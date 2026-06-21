from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def uid() -> str:
    return str(uuid4())


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CodingTask(Base):
    __tablename__ = "coding_tasks"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    problem_statement: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(30), index=True)
    difficulty: Mapped[str] = mapped_column(String(20), default="medium")
    constraints: Mapped[str] = mapped_column(Text, default="")
    expected_behavior: Mapped[str] = mapped_column(Text, default="")
    rubric: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="ready")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    tests: Mapped[list["TestCase"]] = relationship(cascade="all, delete-orphan")
    responses: Mapped[list["ModelResponse"]] = relationship(cascade="all, delete-orphan")


class TestCase(Base):
    __tablename__ = "test_cases"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    task_id: Mapped[str] = mapped_column(ForeignKey("coding_tasks.id", ondelete="CASCADE"), index=True)
    input_data: Mapped[dict] = mapped_column(JSON)
    expected_output: Mapped[dict] = mapped_column(JSON)
    hidden: Mapped[bool] = mapped_column(Boolean, default=False)


class ModelResponse(Base):
    __tablename__ = "model_responses"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    task_id: Mapped[str] = mapped_column(ForeignKey("coding_tasks.id", ondelete="CASCADE"), index=True)
    label: Mapped[str] = mapped_column(String(1))
    explanation: Mapped[str] = mapped_column(Text, default="")
    code: Mapped[str] = mapped_column(Text)
    model_name: Mapped[str] = mapped_column(String(100), default="hidden")


class HumanEvaluation(Base):
    __tablename__ = "human_evaluations"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    task_id: Mapped[str] = mapped_column(ForeignKey("coding_tasks.id"), index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    preference: Mapped[str] = mapped_column(String(30))
    justification: Mapped[str] = mapped_column(Text)
    rubric_scores: Mapped[dict] = mapped_column(JSON)
    error_labels: Mapped[list] = mapped_column(JSON, default=list)
    llm_preference: Mapped[str | None] = mapped_column(String(30), nullable=True)
    llm_reasoning: Mapped[str | None] = mapped_column(Text, nullable=True)
    agreement: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    ideal_response: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CodeExecution(Base):
    __tablename__ = "code_executions"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    response_id: Mapped[str] = mapped_column(ForeignKey("model_responses.id"), index=True)
    passed: Mapped[int] = mapped_column(Integer, default=0)
    total: Mapped[int] = mapped_column(Integer, default=0)
    stdout: Mapped[str] = mapped_column(Text, default="")
    stderr: Mapped[str] = mapped_column(Text, default="")
    duration_ms: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    user_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    action: Mapped[str] = mapped_column(String(100), index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
