import asyncio
import base64
import logging

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from google.genai import types

from .service import generate_response
from .voice_service import (
    create_live_client,
    get_live_config,
    LIVE_MODEL,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10000)


# --------------------------------------------------
# TEXT CHAT
# POST /chatbot/chat
# --------------------------------------------------

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        reply = await asyncio.to_thread(
            generate_response,
            request.message.strip(),
        )
        return {"reply": reply}

    except Exception as exc:
        logger.exception("Text chatbot request failed")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate a response. Check backend logs.",
        ) from exc


# --------------------------------------------------
# CONTINUOUS REAL-TIME VOICE CHAT
# WEBSOCKET /chatbot/voice
# --------------------------------------------------

@router.websocket("/voice")
async def voice_chat(websocket: WebSocket):
    await websocket.accept()

    client = None
    sender_task = None
    receiver_task = None
    stop_event = asyncio.Event()

    try:
        client = create_live_client()

        async with client.aio.live.connect(
            model=LIVE_MODEL,
            config=get_live_config(),
        ) as session:

            await websocket.send_json({
                "type": "status",
                "state": "connected",
                "message": "Voice connection established.",
            })

            # Browser microphone -> Gemini
            async def forward_browser_audio():
                try:
                    while not stop_event.is_set():
                        message = await websocket.receive_json()
                        message_type = message.get("type")

                        if message_type == "audio":
                            encoded_audio = message.get("data")

                            if not isinstance(encoded_audio, str):
                                continue

                            try:
                                audio_bytes = base64.b64decode(
                                    encoded_audio,
                                    validate=True,
                                )
                            except (ValueError, TypeError):
                                logger.warning(
                                    "Received invalid base64 audio."
                                )
                                continue

                            if not audio_bytes:
                                continue

                            await session.send_realtime_input(
                                audio=types.Blob(
                                    data=audio_bytes,
                                    mime_type="audio/pcm;rate=16000",
                                )
                            )

                        elif message_type == "audio_stream_end":
                            await session.send_realtime_input(
                                audio_stream_end=True,
                            )

                        elif message_type == "text":
                            text = message.get("data", "")

                            if isinstance(text, str) and text.strip():
                                await session.send_realtime_input(
                                    text=text.strip(),
                                )

                        elif message_type == "stop":
                            stop_event.set()
                            break

                except WebSocketDisconnect:
                    stop_event.set()
                    logger.info("Browser voice WebSocket disconnected.")

                except asyncio.CancelledError:
                    raise

                except Exception:
                    stop_event.set()
                    logger.exception("Browser audio sender failed.")
                    raise

            # Gemini -> Browser audio
            async def forward_model_response():
                try:
                    # IMPORTANT:
                    # session.receive() can finish after ONE model turn.
                    # Re-enter it for the next turn, without reconnecting
                    # the Gemini session or browser WebSocket.
                    while not stop_event.is_set():

                        async for response in session.receive():
                            if stop_event.is_set():
                                break

                            content = response.server_content

                            if content is None:
                                continue

                            # Forward generated audio chunks.
                            model_turn = getattr(
                                content,
                                "model_turn",
                                None,
                            )

                            if model_turn:
                                for part in model_turn.parts:
                                    inline_data = getattr(
                                        part,
                                        "inline_data",
                                        None,
                                    )

                                    if not inline_data:
                                        continue

                                    audio_data = inline_data.data

                                    if not audio_data:
                                        continue

                                    if isinstance(audio_data, str):
                                        audio_b64 = audio_data
                                    else:
                                        audio_b64 = base64.b64encode(
                                            audio_data
                                        ).decode("ascii")

                                    await websocket.send_json({
                                        "type": "audio",
                                        "data": audio_b64,
                                        "sampleRate": 24000,
                                    })

                            # Notify the frontend that Gemini has
                            # finished speaking, but KEEP the session open.
                            if getattr(content, "turn_complete", False):
                                await websocket.send_json({
                                    "type": "status",
                                    "state": "listening",
                                })

                            if getattr(content, "interrupted", False):
                                await websocket.send_json({
                                    "type": "status",
                                    "state": "interrupted",
                                })

                        # The receive iterator ended for this turn.
                        # The outer while loop starts it again.

                except asyncio.CancelledError:
                    raise

                except Exception:
                    stop_event.set()
                    logger.exception("Gemini response receiver failed.")
                    raise

            sender_task = asyncio.create_task(
                forward_browser_audio(),
                name="voice-browser-to-gemini",
            )

            receiver_task = asyncio.create_task(
                forward_model_response(),
                name="voice-gemini-to-browser",
            )

            # Keep both directions active until the user stops the call,
            # the browser disconnects, or a task fails.
            done, pending = await asyncio.wait(
                [sender_task, receiver_task],
                return_when=asyncio.FIRST_COMPLETED,
            )

            stop_event.set()

            for task in pending:
                task.cancel()

            if pending:
                await asyncio.gather(
                    *pending,
                    return_exceptions=True,
                )

            for task in done:
                if task.cancelled():
                    continue

                exception = task.exception()
                if exception:
                    raise exception

    except WebSocketDisconnect:
        logger.info("Voice client disconnected.")

    except asyncio.CancelledError:
        raise

    except Exception:
        logger.exception("Voice session failed.")

        try:
            await websocket.send_json({
                "type": "error",
                "message": (
                    "Voice session failed. "
                    "Check the backend terminal for details."
                ),
            })
        except Exception:
            pass

    finally:
        stop_event.set()

        tasks = [
            task
            for task in (sender_task, receiver_task)
            if task is not None
        ]

        for task in tasks:
            if not task.done():
                task.cancel()

        if tasks:
            await asyncio.gather(
                *tasks,
                return_exceptions=True,
            )

        if client is not None:
            try:
                await client.aio.aclose()
            except Exception:
                logger.debug(
                    "Gemini client cleanup failed.",
                    exc_info=True,
                )

        try:
            await websocket.close()
        except Exception:
            pass