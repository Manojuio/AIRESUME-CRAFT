import base64
import logging

import httpx

logger = logging.getLogger(__name__)


async def fetch_all_repos(username: str, token: str | None = None) -> list[dict]:
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    repos = []
    page = 1
    async with httpx.AsyncClient() as client:
        while True:
            url = f"https://api.github.com/users/{username}/repos?per_page=100&page={page}&sort=updated"
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                logger.warning(
                    "GitHub API error fetching repos: %s %s",
                    resp.status_code,
                    resp.text,
                )
                break
            page_repos = resp.json()
            if not page_repos:
                break
            repos.extend(page_repos)
            if len(page_repos) < 100:
                break
            page += 1

    result = []
    for repo in repos:
        if repo.get("fork"):
            continue
        name = repo.get("name", "")
        repo_info = {
            "name": name,
            "description": repo.get("description") or "",
            "language": repo.get("language") or "",
            "topics": repo.get("topics") or [],
            "stargazers_count": repo.get("stargazers_count", 0),
            "forks_count": repo.get("forks_count", 0),
            "updated_at": repo.get("updated_at", ""),
            "html_url": repo.get("html_url", ""),
        }

        languages_url = repo.get("languages_url", "")
        if languages_url:
            try:
                lang_resp = await client.get(languages_url, headers=headers)
                if lang_resp.status_code == 200:
                    repo_info["languages_dict"] = lang_resp.json()
            except Exception:
                logger.warning("Failed to fetch languages for %s", name)

        readme_url = f"https://api.github.com/repos/{username}/{name}/readme"
        try:
            readme_resp = await client.get(readme_url, headers=headers)
            if readme_resp.status_code == 200:
                readme_data = readme_resp.json()
                content = base64.b64decode(readme_data.get("content", "")).decode(
                    "utf-8", errors="replace"
                )
                repo_info["readme_text"] = content[:1000]
            else:
                repo_info["readme_text"] = ""
        except Exception:
            logger.warning("Failed to fetch README for %s", name)
            repo_info["readme_text"] = ""

        result.append(repo_info)

    return result
