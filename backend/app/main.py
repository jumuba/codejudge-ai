import csv
import io
import json

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from .auth import create_token, current_user, hash_password, verify_password
from .config import settings
from .database import Base, engine, get_db
from .llm import judge
from .models import AuditLog, CodingTask, HumanEvaluation, User
from .schemas import (
    EvaluationCreate,
    EvaluationOut,
    ExecutionRequest,
    ExecutionResult,
    LoginRequest,
    RegisterRequest,
    TaskOut,
    TokenResponse,
)

Base.metadata.create_all(bind=engine)
app = FastAPI(title=settings.app_name, version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}


@app.post("/api/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == payload.email.lower())):
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_token(user.id))


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=create_token(user.id))


@app.get("/api/tasks", response_model=list[TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    query = select(CodingTask).options(selectinload(CodingTask.tests), selectinload(CodingTask.responses))
    return list(db.scalars(query).unique())


@app.get("/api/tasks/{task_id}", response_model=TaskOut)
def get_task(task_id: str, db: Session = Depends(get_db)):
    query = (
        select(CodingTask)
        .where(CodingTask.id == task_id)
        .options(selectinload(CodingTask.tests), selectinload(CodingTask.responses))
    )
    task = db.scalar(query)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    # Hidden expected outputs are never serialized to evaluators.
    for test in task.tests:
        if test.hidden:
            test.expected_output = {}
    return task


@app.post("/api/executions", response_model=ExecutionResult)
def execute_response(
    payload: ExecutionRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Queue work for the isolated runner.

    The public portfolio demo returns deterministic evidence and never executes
    arbitrary code inside the API process.
    """
    from .models import ModelResponse

    response = db.get(ModelResponse, payload.response_id)
    if not response:
        raise HTTPException(status_code=404, detail="Response not found")
    passed = 10 if response.label == "B" else 8
    db.add(AuditLog(user_id=user.id, action="execution.requested", metadata_json={"response_id": response.id}))
    db.commit()
    return ExecutionResult(
        response_id=response.id,
        status="completed",
        passed=passed,
        total=10,
        stderr="" if passed == 10 else "Hidden case failed: adjacent intervals were not merged.",
        duration_ms=84 if passed == 10 else 71,
    )


@app.post("/api/evaluations", response_model=EvaluationOut, status_code=201)
def create_evaluation(
    payload: EvaluationCreate,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    task = db.scalar(
        select(CodingTask)
        .where(CodingTask.id == payload.task_id)
        .options(selectinload(CodingTask.responses))
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    result = judge.evaluate(task, payload.preference)
    evaluation = HumanEvaluation(
        task_id=task.id,
        user_id=user.id,
        preference=payload.preference,
        justification=payload.justification,
        rubric_scores=payload.rubric_scores,
        error_labels=payload.error_labels,
        llm_preference=result.preference,
        llm_reasoning=result.reasoning,
        agreement=result.preference == payload.preference,
        ideal_response=result.ideal_response,
    )
    db.add(evaluation)
    db.add(AuditLog(user_id=user.id, action="evaluation.created", metadata_json={"task_id": task.id}))
    db.commit()
    db.refresh(evaluation)
    return evaluation


@app.get("/api/analytics")
def analytics(user: User = Depends(current_user), db: Session = Depends(get_db)):
    total = db.scalar(select(func.count()).select_from(HumanEvaluation)) or 0
    agreed = db.scalar(
        select(func.count()).select_from(HumanEvaluation).where(HumanEvaluation.agreement.is_(True))
    ) or 0
    return {
        "completed_evaluations": total,
        "agreement_rate": round(agreed / total * 100, 1) if total else 0,
        "languages": ["python", "javascript", "typescript"],
    }


def dataset_rows(db: Session):
    evaluations = db.scalars(select(HumanEvaluation).order_by(HumanEvaluation.created_at.desc())).all()
    for item in evaluations:
        task = db.get(CodingTask, item.task_id)
        yield {
            "task_id": item.task_id,
            "prompt": task.problem_statement if task else "",
            "language": task.language if task else "",
            "rubric_scores": item.rubric_scores,
            "human_preference": item.preference,
            "human_justification": item.justification,
            "llm_preference": item.llm_preference,
            "agreement": item.agreement,
            "ideal_response": item.ideal_response,
            "error_labels": item.error_labels,
            "created_at": item.created_at.isoformat(),
        }


@app.get("/api/exports/{format_name}")
def export_dataset(
    format_name: str,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    rows = list(dataset_rows(db))
    if format_name == "jsonl":
        content = "\n".join(json.dumps(row) for row in rows)
        return Response(content, media_type="application/x-ndjson", headers={"Content-Disposition": "attachment; filename=codejudge.jsonl"})
    if format_name == "csv":
        output = io.StringIO()
        fieldnames = list(rows[0]) if rows else ["task_id"]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: json.dumps(value) if isinstance(value, (dict, list)) else value for key, value in row.items()})
        return Response(output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=codejudge.csv"})
    raise HTTPException(status_code=400, detail="Format must be jsonl or csv")
