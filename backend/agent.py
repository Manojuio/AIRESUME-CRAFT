import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from llm_client import llm_generate_json
from github_fetcher import fetch_all_repos
from renderer import render_pdf, render_docx, render_portfolio_html
from ats import calculate_ats_score_async

logger = logging.getLogger(__name__)


async def run_agent(task_id: str, request: dict, tasks: dict):
    try:
        tasks[task_id]["progress"] = 10
        tasks[task_id]["status"] = "processing"

        username = request["github_username"]
        token = request.get("personal_token")
        personal_summary = request.get("personal_summary", "")
        job_description = request.get("job_description", "")

        repos = await fetch_all_repos(username, token)
        tasks[task_id]["progress"] = 20

        repo_summaries = [
            {
                "name": r["name"],
                "stars": r["stargazers_count"],
                "language": r["language"],
                "description": r["description"],
                "topics": r["topics"],
            }
            for r in repos
        ]

        selected_names = await select_top5_repos(repo_summaries, job_description)
        tasks[task_id]["progress"] = 40

        selected_repos = [r for r in repos if r["name"] in selected_names]

        resume_data = await generate_resume_content(
            selected_repos, personal_summary, job_description
        )
        tasks[task_id]["progress"] = 70

        ats_result = None
        if job_description:
            resume_text = _resume_to_text(resume_data)
            ats_result = await calculate_ats_score_async(resume_text, job_description)
        tasks[task_id]["progress"] = 80

        pdf_path = render_pdf(resume_data, task_id)
        docx_path = render_docx(resume_data, task_id)
        portfolio_path = render_portfolio_html(resume_data, selected_repos, task_id)
        tasks[task_id]["progress"] = 90

        tasks[task_id].update(
            {
                "status": "completed",
                "progress": 100,
                "resume_data": resume_data,
                "ats_score": ats_result["score"] if ats_result else None,
                "missing_keywords": ats_result["missing_keywords"]
                if ats_result
                else [],
                "pdf_url": f"/download/{task_id}/pdf" if pdf_path else None,
                "docx_url": f"/download/{task_id}/docx" if docx_path else None,
                "portfolio_url": f"/download/{task_id}/portfolio.html" if portfolio_path else None,
            }
        )

    except Exception as e:
        logger.exception("Agent failed for task %s", task_id)
        tasks[task_id].update(
            {
                "status": "failed",
                "error": str(e),
            }
        )


async def select_top5_repos(
    repo_summaries: list, job_description: str | None
) -> list[str]:
    prompt = (
        "You are a technical recruiter. From the following repositories, "
        "pick exactly 5 that best showcase the candidate's skills"
    )
    if job_description:
        prompt += f" for this job description:\n{job_description}\n\n"
    else:
        prompt += ".\n\n"

    prompt += (
        "Repositories:\n"
        + "\n".join(
            f"- {r['name']} ({r['language']}, {r['stars']} stars): {r['description']}"
            for r in repo_summaries
        )
        + '\n\nReturn JSON: {"selected": ["repo1", "repo2", "repo3", "repo4", "repo5"]}'
    )

    result = await llm_generate_json(
        prompt,
        system="You select the most relevant repositories. Return only valid JSON.",
    )
    return result.get("selected", [])[:5]


async def generate_resume_content(
    selected_repos: list, personal_summary: str, job_description: str | None
) -> dict:
    repo_details = []
    for r in selected_repos:
        langs = r.get("languages_dict", {})
        lang_str = ", ".join(f"{k}" for k, v in sorted(langs.items(), key=lambda x: -x[1])[:5])
        repo_details.append(
            {
                "name": r["name"],
                "description": r["description"],
                "languages": lang_str,
                "stars": r["stargazers_count"],
                "url": r["html_url"],
                "readme_excerpt": (r.get("readme_text", "") or "")[:500],
            }
        )

    prompt = f"""
Generate a professional resume as JSON with these exact keys:
- full_name (string)
- email (string)
- summary (string, 2-3 sentences)
- skills (array of strings)
- experience (array of objects with: project_name, description, technologies, url)
- education (array of objects with: degree, institution, year)

Personal summary provided by candidate: {personal_summary}
"""
    if job_description:
        prompt += f"\nJob description to tailor for:\n{job_description}\n"

    prompt += "\nProjects (use as experience):\n" + "\n".join(
        f"- {r['name']}: {r['description']} | Languages: {r['languages']} | {r['url']}"
        for r in repo_details
    )

    result = await llm_generate_json(
        prompt,
        system=(
            "You are a professional resume writer. Generate a truthful, "
            "ATS-optimized resume in JSON format."
        ),
    )
    return result


def _resume_to_text(resume_data: dict) -> str:
    parts = [
        resume_data.get("summary", ""),
        "Skills: " + ", ".join(resume_data.get("skills", [])),
    ]
    for exp in resume_data.get("experience", []):
        parts.append(f"{exp.get('project_name', '')}: {exp.get('description', '')}")
    for edu in resume_data.get("education", []):
        parts.append(f"{edu.get('degree', '')} - {edu.get('institution', '')}")
    return "\n".join(parts)
