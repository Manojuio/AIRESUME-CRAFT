# ResumeAI

Turn a GitHub profile into an ATS-optimized resume (PDF + DOCX) and a portfolio website.

## Architecture

```
resume-ai/
├── frontend/          # React SPA (Vite + Tailwind)
├── backend/           # FastAPI + LLM agent (Groq/Gemini)
└── README.md
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt

# Copy and edit environment
cp .env.example .env
# Set LLM_PROVIDER, GROQ_API_KEY or GEMINI_API_KEY

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8000` in a `.env` file if the backend runs on a different URL.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/generate` | Start resume generation |
| GET | `/status/{task_id}` | Poll generation status |
| POST | `/update/{task_id}` | Update resume & regenerate files |
| GET | `/download/{task_id}/{type}` | Download generated files (pdf, docx, portfolio.html) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LLM_PROVIDER` | Yes | `groq` or `gemini` |
| `GROQ_API_KEY` | If using Groq | Groq API key |
| `GEMINI_API_KEY` | If using Gemini | Google Gemini API key |
| `GROQ_MODEL` | No | Groq model override (default: `llama-3.2-3b-preview`) |
| `GEMINI_MODEL` | No | Gemini model override (default: `gemini-1.5-flash`) |

## Deployment

**Backend:** Render, Railway, Fly.io – `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Frontend:** Vercel, Netlify – `npm run build` deploys the `dist/` folder.
