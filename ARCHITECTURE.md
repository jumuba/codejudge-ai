# CodeJudge AI architecture

## Production topology

- **Vercel:** Next.js frontend, static assets, and the public portfolio URL.
- **Render:** FastAPI service, authentication, evaluation APIs, exports, and LLM provider calls.
- **Managed PostgreSQL:** users, coding tasks, tests, responses, scores, evaluations, and audit logs.
- **Isolated runner service:** submitted code is executed outside the API process with no network, a temporary filesystem, and strict CPU, memory, and time limits.

The portfolio demo ships with deterministic test results so it stays safe and inexpensive when publicly accessible. The backend boundary is ready for a container runner such as an ephemeral job service.

## Security boundaries

API keys remain on the backend. Every mutation validates an authenticated user. Hidden expected outputs are removed from task responses. Production deployments must rate-limit login, LLM, export, and execution endpoints.
