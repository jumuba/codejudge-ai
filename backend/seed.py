from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import CodingTask, ModelResponse, TestCase, User

TASKS = [
    ("merge-intervals", "Merge overlapping intervals", "python", "medium"),
    ("valid-parentheses", "Validate balanced parentheses", "python", "easy"),
    ("lru-cache", "Implement an LRU cache", "python", "hard"),
    ("binary-tree", "Validate a binary search tree", "python", "medium"),
    ("async-retry", "Implement async retry with backoff", "python", "hard"),
    ("group-anagrams-py", "Group anagrams", "python", "medium"),
    ("debounce-js", "Debounce a function", "javascript", "medium"),
    ("deep-clone", "Deep clone serializable data", "javascript", "medium"),
    ("promise-pool", "Build a promise concurrency pool", "javascript", "hard"),
    ("unique-char", "Find first unique character", "javascript", "easy"),
    ("event-emitter", "Implement an event emitter", "javascript", "medium"),
    ("typed-debounce", "Create a typed debounce utility", "typescript", "hard"),
    ("result-type", "Implement a Result type", "typescript", "medium"),
    ("typed-group-by", "Build a type-safe groupBy", "typescript", "medium"),
    ("readonly-update", "Immutable nested state update", "typescript", "hard"),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(CodingTask).count():
            return
        db.add(User(email="trainer@demo.dev", password_hash=hash_password("DemoPass123!")))
        for index, (slug, title, language, difficulty) in enumerate(TASKS):
            task = CodingTask(
                slug=slug,
                title=title,
                language=language,
                difficulty=difficulty,
                problem_statement=f"Solve the {title.lower()} task with production-quality {language} code.",
                constraints="Handle empty input and edge cases. Avoid unnecessary complexity.",
                expected_behavior="Return the correct deterministic result without mutating inputs.",
                rubric={"criteria": ["correctness", "instruction_following", "readability", "efficiency", "security"]},
            )
            task.tests = [
                TestCase(input_data={"case": "visible"}, expected_output={"ok": True}, hidden=False),
                TestCase(input_data={"case": "edge"}, expected_output={"ok": True}, hidden=True),
            ]
            task.responses = [
                ModelResponse(label="A", code=f"# Intentionally imperfect {language} response {index + 1}", explanation="A plausible but flawed approach."),
                ModelResponse(label="B", code=f"# Corrected {language} response {index + 1}", explanation="Handles the specified edge cases."),
            ]
            db.add(task)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
