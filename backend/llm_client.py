import os
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "").lower()


async def llm_generate_json(prompt: str, system: str = "") -> dict:
    if LLM_PROVIDER == "groq":
        return await _groq_generate_json(prompt, system)
    elif LLM_PROVIDER == "gemini":
        return await _gemini_generate_json(prompt, system)
    else:
        raise RuntimeError(
            "LLM_PROVIDER must be set to 'groq' or 'gemini'. "
            "Set LLM_PROVIDER environment variable and the corresponding API key."
        )


async def _groq_generate_json(prompt: str, system: str = "") -> dict:
    from groq import Groq

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is required when LLM_PROVIDER=groq")

    client = Groq(api_key=api_key)

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content
    return json.loads(content)


async def _gemini_generate_json(prompt: str, system: str = "") -> dict:
    import google.generativeai as genai

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is required when LLM_PROVIDER=gemini")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
        system_instruction=system or None,
        generation_config={
            "response_mime_type": "application/json",
        },
    )
    response = model.generate_content(prompt)
    return json.loads(response.text)
