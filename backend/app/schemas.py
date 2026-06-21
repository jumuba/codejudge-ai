from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(RegisterRequest):
    pass


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TestOut(BaseModel):
    id: str
    input_data: dict
    expected_output: dict | None = None
    hidden: bool
    model_config = {"from_attributes": True}


class ResponseOut(BaseModel):
    id: str
    label: str
    explanation: str
    code: str
    model_config = {"from_attributes": True}


class TaskOut(BaseModel):
    id: str
    slug: str
    title: str
    problem_statement: str
    language: str
    difficulty: str
    constraints: str
    expected_behavior: str
    status: str
    tests: list[TestOut]
    responses: list[ResponseOut]
    model_config = {"from_attributes": True}


class EvaluationCreate(BaseModel):
    task_id: str
    preference: Literal["response_a", "response_b", "tie", "both_incorrect"]
    justification: str = Field(min_length=20)
    rubric_scores: dict[str, int]
    error_labels: list[str] = []


class EvaluationOut(BaseModel):
    id: str
    task_id: str
    preference: str
    justification: str
    rubric_scores: dict
    error_labels: list
    llm_preference: str | None
    llm_reasoning: str | None
    agreement: bool | None
    ideal_response: str | None
    created_at: datetime
    model_config = {"from_attributes": True}


class ExecutionRequest(BaseModel):
    response_id: str


class ExecutionResult(BaseModel):
    response_id: str
    status: Literal["completed", "timeout", "failed"]
    passed: int
    total: int
    stdout: str = ""
    stderr: str = ""
    duration_ms: int
