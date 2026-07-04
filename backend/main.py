import uuid
import os
from pathlib import Path
from dotenv import load_dotenv

from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import run_agent

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="ResumeAI")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks: dict = {}


class GenerateRequest(BaseModel):
    github_username: str
    personal_token: str | None = None
    personal_summary: str | None = ""
    job_description: str | None = ""


class UpdateRequest(BaseModel):
    resume_data: dict


@app.on_event("startup")
def startup():
    llm_provider = os.getenv("LLM_PROVIDER", "").lower()
    if llm_provider not in ("groq", "gemini"):
        raise RuntimeError(
            "LLM_PROVIDER must be set to 'groq' or 'gemini'"
        )
    key = os.getenv(f"{llm_provider.upper()}_API_KEY")
    if not key:
        raise RuntimeError(
            f"{llm_provider.upper()}_API_KEY is required"
        )


@app.post("/generate")
async def generate(body: GenerateRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    tasks[task_id] = {
        "status": "processing",
        "progress": 0,
    }
    background_tasks.add_task(
        run_agent, task_id, body.model_dump(), tasks
    )
    return {"task_id": task_id, "status": "processing"}


@app.get("/status/{task_id}")
async def get_status(task_id: str):
    task = tasks.get(task_id)
    if not task:
        return {"error": "Task not found"}
    return {
        "status": task.get("status"),
        "progress": task.get("progress", 0),
        "resume_data": task.get("resume_data"),
        "ats_score": task.get("ats_score"),
        "missing_keywords": task.get("missing_keywords"),
        "pdf_url": task.get("pdf_url"),
        "docx_url": task.get("docx_url"),
        "portfolio_url": task.get("portfolio_url"),
        "error": task.get("error"),
    }


@app.post("/update/{task_id}")
async def update_resume(task_id: str, body: UpdateRequest):
    task = tasks.get(task_id)
    if not task or task.get("status") != "completed":
        return {"error": "Task not found or not completed"}

    from renderer import render_pdf, render_docx, render_portfolio_html

    resume_data = body.resume_data
    task["resume_data"] = resume_data

    pdf_path = render_pdf(resume_data, task_id)
    docx_path = render_docx(resume_data, task_id)
    portfolio_path = render_portfolio_html(resume_data, [], task_id)

    task["pdf_url"] = f"/download/{task_id}/pdf"
    task["docx_url"] = f"/download/{task_id}/docx"
    task["portfolio_url"] = f"/download/{task_id}/portfolio.html"

    return {
        "pdf_url": task["pdf_url"],
        "docx_url": task["docx_url"],
        "portfolio_url": task["portfolio_url"],
    }


@app.get("/download/{task_id}/{file_type}")
async def download_file(task_id: str, file_type: str):
    generated_dir = Path(__file__).parent / "generated" / task_id
    filename_map = {
        "pdf": "resume.pdf",
        "docx": "resume.docx",
        "portfolio.html": "portfolio.html",
    }
    filename = filename_map.get(file_type)
    if not filename:
        return {"error": "Invalid file type"}

    file_path = generated_dir / filename
    if not file_path.exists():
        return {"error": "File not found"}

    media_type = {
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "portfolio.html": "text/html",
    }.get(file_type, "application/octet-stream")

    return FileResponse(
        str(file_path),
        media_type=media_type,
        filename=filename,
    )
