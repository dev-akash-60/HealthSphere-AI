import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from backend/.env")

client = genai.Client(api_key=API_KEY)

TEXT_MODEL = "gemini-2.5-flash"
LIVE_MODEL = os.getenv("GEMINI_LIVE_MODEL", "gemini-3.8-live")