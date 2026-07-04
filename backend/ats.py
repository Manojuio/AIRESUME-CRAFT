import re
import logging
from collections import Counter

logger = logging.getLogger(__name__)

STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
    "been", "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "shall", "can", "need",
    "dare", "ought", "used", "this", "that", "these", "those", "it",
    "its", "they", "them", "their", "we", "our", "you", "your", "he",
    "she", "his", "her", "him", "who", "whom", "which", "what", "not",
    "no", "nor", "so", "if", "then", "than", "too", "very", "just",
    "about", "also", "into", "over", "such", "each", "all", "both",
    "every", "own", "same", "any", "some", "few", "most", "other",
    "more", "else", "only", "how", "when", "where", "why",
}


def calculate_ats_score(
    resume_text: str, jd: str, use_llm: bool = True
) -> dict:
    if use_llm:
        try:
            return _ats_llm(resume_text, jd)
        except Exception as e:
            logger.warning("LLM ATS scoring failed, falling back to keyword: %s", e)

    return _ats_keyword(resume_text, jd)


async def calculate_ats_score_async(
    resume_text: str, jd: str, use_llm: bool = True
) -> dict:
    if use_llm:
        try:
            return await _ats_llm_async(resume_text, jd)
        except Exception as e:
            logger.warning("LLM ATS scoring failed, falling back to keyword: %s", e)

    return _ats_keyword(resume_text, jd)


def _ats_llm(resume_text: str, jd: str) -> dict:
    from llm_client import llm_generate_json
    import asyncio

    prompt = f"""
Evaluate this resume against the job description.
Return JSON with:
- score (integer 0-100)
- missing_keywords (array of strings, important terms in the JD missing from resume)

Job Description:
{jd}

Resume:
{resume_text}
"""
    # Run async function in sync context
    result = asyncio.run(llm_generate_json(
        prompt,
        system="You are an ATS (Applicant Tracking System) evaluator. Return only valid JSON.",
    ))
    return {
        "score": min(max(int(result.get("score", 50)), 0), 100),
        "missing_keywords": result.get("missing_keywords", []),
    }


async def _ats_llm_async(resume_text: str, jd: str) -> dict:
    from llm_client import llm_generate_json

    prompt = f"""
Evaluate this resume against the job description.
Return JSON with:
- score (integer 0-100)
- missing_keywords (array of strings, important terms in the JD missing from resume)

Job Description:
{jd}

Resume:
{resume_text}
"""
    result = await llm_generate_json(
        prompt,
        system="You are an ATS (Applicant Tracking System) evaluator. Return only valid JSON.",
    )
    return {
        "score": min(max(int(result.get("score", 50)), 0), 100),
        "missing_keywords": result.get("missing_keywords", []),
    }


def _ats_keyword(resume_text: str, jd: str) -> dict:
    jd_tokens = re.findall(r"[a-zA-Z#+.]+", jd.lower())
    resume_tokens = set(re.findall(r"[a-zA-Z#+.]+", resume_text.lower()))

    freq = Counter(t for t in jd_tokens if t not in STOP_WORDS and len(t) > 2)
    if not freq:
        return {"score": 50, "missing_keywords": []}

    total = sum(freq.values())
    matched = sum(cnt for word, cnt in freq.items() if word in resume_tokens)

    top_missing = [
        word for word, _ in freq.most_common(10) if word not in resume_tokens
    ]

    score = int((matched / total) * 100) if total > 0 else 50
    return {
        "score": min(score, 100),
        "missing_keywords": top_missing,
    }
