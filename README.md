# CodeJudge AI

CodeJudge AI is a production-oriented portfolio application for evaluating two anonymous AI-generated coding responses with tests, human rubric scores, an independent LLM judge, analytics, and dataset exports.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, FastAPI, SQLAlchemy, PostgreSQL, pytest, and Docker Compose.

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload
```

Or run the complete stack with `docker compose up --build`.

Demo credentials after seeding: `trainer@demo.dev` / `DemoPass123!`.

## Deployment

Deploy `frontend/` as the Vercel project root. Deploy the repository to Render using `render.yaml`, then set `NEXT_PUBLIC_API_URL` on Vercel and `FRONTEND_URL` on Render.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEMO_SCRIPT.md](./DEMO_SCRIPT.md).
