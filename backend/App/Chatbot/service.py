import logging
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
logger = logging.getLogger(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from backend/.env"
    )

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-2.5-flash"

SYSTEM_PROMPT = """
You are HealthSphere AI, a helpful healthcare assistant.

RESPONSE RULES:
1. Always respond in complete, grammatically correct sentences.
2. Never intentionally stop in the middle of a sentence.
3. Answer the user's question directly before asking any follow-up questions.
4. For general health questions, provide useful and practical guidance.
5. For joint pain, explain basic self-care, warning signs, and when
   professional medical evaluation is appropriate.
6. Ask a follow-up question only when it is genuinely necessary.
7. Keep simple answers concise, but provide enough information to be useful.
8. Never claim to provide a definitive diagnosis or replace a doctor.
9. Recommend urgent medical care for potentially life-threatening symptoms.
10. Do not end a response with an unfinished phrase or sentence.
11. Try to use less word and less sentences as possible
"""


def generate_response(message: str) -> str:
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.4,
                max_output_tokens=1000,
            ),
        )

        reply = response.text

        if not reply or not reply.strip():
            logger.error(
                "Gemini returned no text. Response: %r",
                response,
            )
            raise RuntimeError(
                "Gemini returned an empty response."
            )

        finish_reason = None

        if response.candidates:
            finish_reason = response.candidates[0].finish_reason

        logger.info(
            "Gemini response completed. Finish reason: %s; "
            "Response length: %s characters",
            finish_reason,
            len(reply),
        )

        if str(finish_reason).endswith("MAX_TOKENS"):
            logger.warning(
                "Gemini reached the maximum output token limit."
            )

        return reply.strip()

    except Exception:
        logger.exception(
            "HealthSphere AI text generation failed."
        )
        raise