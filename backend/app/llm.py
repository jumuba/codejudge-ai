from dataclasses import dataclass

from .models import CodingTask


@dataclass
class JudgeResult:
    preference: str
    reasoning: str
    ideal_response: str


class LLMJudge:
    """Provider boundary for OpenAI, Gemini, or a deterministic demo judge."""

    def evaluate(self, task: CodingTask, human_preference: str) -> JudgeResult:
        # Production providers plug in here and must validate structured JSON.
        preferred = "response_b" if any(r.label == "B" for r in task.responses) else human_preference
        return JudgeResult(
            preference=preferred,
            reasoning="Response B follows the endpoint requirement and handles the hidden adjacency edge case.",
            ideal_response="Use a sorted sweep and merge when the next start is less than or equal to the current end.",
        )


judge = LLMJudge()
