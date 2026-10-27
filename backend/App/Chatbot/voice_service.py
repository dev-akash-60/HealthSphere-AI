import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

LIVE_MODEL = os.getenv(
    "GEMINI_LIVE_MODEL",
    "gemini-3.8-live",
)

VOICE_SYSTEM_PROMPT = """
You are HealthSphere AI, a friendly healthcare assistant.

Speak naturally and clearly. Keep responses concise and helpful.
Explain health information in simple language.
Never claim to replace a qualified doctor or provide a definitive
diagnosis. Recommend urgent medical attention for potentially
life-threatening symptoms.

You are having a live spoken conversation. Respond conversationally,
not as if you are writing a long report.
"""


def create_live_client():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is missing from backend/.env"
        )

    return genai.Client(api_key=api_key)


def get_live_config():
    return types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        system_instruction=VOICE_SYSTEM_PROMPT,
        input_audio_transcription=types.AudioTranscriptionConfig(),
        output_audio_transcription=types.AudioTranscriptionConfig(),
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Aoede"
                )
            )
        ),
    )