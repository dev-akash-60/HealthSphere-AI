
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Plus,
    Bot,
    User,
    Mic,
    MessageSquare,
    Volume2,
    Activity,
    PhoneOff,
    LoaderCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import pcmProcessorUrl from "../services/pcm-processor.js?url";
import "../styles/chatbot.css";

const API_URL = "http://127.0.0.1:8000";
const VOICE_URL = "ws://127.0.0.1:8000/chatbot/voice";

const INITIAL_MESSAGE = {
    id: "welcome-message",
    sender: "ai",
    text: "Hello! I am HealthSphere AI Assistant 🩺\n\nHow can I help you today?",
};

function Chatbot() {
    // Main assistant mode: chat or voice.
    const [assistantMode, setAssistantMode] = useState("chat");

    // Text chat state.
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    // Voice assistant state.
    const [voiceState, setVoiceState] = useState("idle");
    const [voiceError, setVoiceError] = useState("");
    const [voiceEnabled, setVoiceEnabled] = useState(false);

    // DOM and audio references.
    const messagesRef = useRef(null);
    const socketRef = useRef(null);
    const audioContextRef = useRef(null);
    const micStreamRef = useRef(null);
    const sourceRef = useRef(null);
    const processorRef = useRef(null);
    const silentGainRef = useRef(null);

    const playbackSourcesRef = useRef(new Set());
    const nextPlayTimeRef = useRef(0);

    const voiceStateRef = useRef("idle");
    const stoppingRef = useRef(false);
    const voiceSessionIdRef = useRef(0);

    const textIntervalRef = useRef(null);
    const responseIdRef = useRef(null);

    const updateVoiceState = useCallback((state) => {
        voiceStateRef.current = state;
        setVoiceState(state);
    }, []);

    // Keep the text conversation scrolled to the latest message.
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop =
                messagesRef.current.scrollHeight;
        }
    }, [messages, typing, assistantMode]);

    // --------------------------------------------------
    // TEXT CHAT
    // --------------------------------------------------

    const saveChat = useCallback((chatMessages) => {
        if (!chatMessages || chatMessages.length <= 1) return;

        setHistory((previous) => [
            {
                id: Date.now(),
                title:
                    chatMessages.find(
                        (message) => message.sender === "user"
                    )?.text?.slice(0, 30) || "New Chat",
                messages: chatMessages,
            },
            ...previous,
        ]);
    }, []);

    const streamResponse = useCallback((text, responseId) => {
        if (textIntervalRef.current) {
            clearInterval(textIntervalRef.current);
            textIntervalRef.current = null;
        }

        const words = text.split(/\s+/).filter(Boolean);
        let current = "";
        let index = 0;

        textIntervalRef.current = setInterval(() => {
            if (index >= words.length) {
                clearInterval(textIntervalRef.current);
                textIntervalRef.current = null;
                responseIdRef.current = null;
                setTyping(false);
                return;
            }

            current += `${words[index]} `;
            index += 1;

            setMessages((previous) =>
                previous.map((message) =>
                    message.id === responseId
                        ? {
                            ...message,
                            text: current.trimEnd(),
                        }
                        : message
                )
            );
        }, 35);
    }, []);

    const simulateAI = async (question, responseId) => {
        setTyping(true);
        responseIdRef.current = responseId;

        try {
            const response = await axios.post(
                `${API_URL}/chatbot/chat`,
                { message: question },
                { timeout: 120000 }
            );

            const reply = response.data?.reply?.trim();

            if (!reply) {
                throw new Error("The AI returned an empty response.");
            }

            streamResponse(reply, responseId);
        } catch (error) {
            console.error("Text chat failed:", error);

            const errorMessage =
                error.response?.data?.detail ||
                "Unable to connect with HealthSphere AI. Please check the backend.";

            streamResponse(errorMessage, responseId);
        }
    };

    const sendMessage = () => {
        const question = input.trim();

        if (!question || typing) return;

        const responseId = `ai-${Date.now()}-${Math.random()}`;

        setMessages((previous) => [
            ...previous,
            {
                id: `user-${Date.now()}`,
                sender: "user",
                text: question,
            },
            {
                id: responseId,
                sender: "ai",
                text: "",
            },
        ]);

        setInput("");
        simulateAI(question, responseId);
    };

    const newChat = () => {
        if (textIntervalRef.current) {
            clearInterval(textIntervalRef.current);
            textIntervalRef.current = null;
        }

        if (messages.length > 1) {
            saveChat(messages);
        }

        responseIdRef.current = null;

        setMessages([
            {
                ...INITIAL_MESSAGE,
                id: `welcome-${Date.now()}`,
                text: "New conversation started 🩺\n\nHow can I assist you?",
            },
        ]);

        setInput("");
        setTyping(false);
    };

    const loadChat = (chat) => {
        if (textIntervalRef.current) {
            clearInterval(textIntervalRef.current);
            textIntervalRef.current = null;
        }

        responseIdRef.current = null;
        setMessages(chat.messages);
        setTyping(false);
    };

    // --------------------------------------------------
    // AUDIO PLAYBACK
    // Incoming audio: signed 16-bit PCM at 24 kHz.
    // --------------------------------------------------

    const stopPlayback = useCallback(() => {
        playbackSourcesRef.current.forEach((source) => {
            try {
                source.stop();
            } catch {
                // Audio may already have finished.
            }

            try {
                source.disconnect();
            } catch {
                // Source may already be disconnected.
            }
        });

        playbackSourcesRef.current.clear();

        nextPlayTimeRef.current =
            audioContextRef.current?.currentTime || 0;
    }, []);

    const playAudioChunk = useCallback(
        (base64Audio, sampleRate = 24000) => {
            const audioContext = audioContextRef.current;

            if (!audioContext || audioContext.state === "closed") return;

            try {
                const binary = atob(base64Audio);
                const bytes = new Uint8Array(binary.length);

                for (let i = 0; i < binary.length; i += 1) {
                    bytes[i] = binary.charCodeAt(i);
                }

                if (bytes.byteLength % 2 !== 0) {
                    console.error("Invalid PCM audio chunk received.");
                    return;
                }

                const pcm = new Int16Array(
                    bytes.buffer.slice(
                        bytes.byteOffset,
                        bytes.byteOffset + bytes.byteLength
                    )
                );

                const audioBuffer = audioContext.createBuffer(
                    1,
                    pcm.length,
                    sampleRate
                );

                const channel = audioBuffer.getChannelData(0);

                for (let i = 0; i < pcm.length; i += 1) {
                    channel[i] = pcm[i] / 32768;
                }

                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);

                const startAt = Math.max(
                    audioContext.currentTime + 0.02,
                    nextPlayTimeRef.current
                );

                source.start(startAt);
                nextPlayTimeRef.current =
                    startAt + audioBuffer.duration;

                playbackSourcesRef.current.add(source);

                source.onended = () => {
                    playbackSourcesRef.current.delete(source);
                    source.disconnect();

                    if (
                        playbackSourcesRef.current.size === 0 &&
                        voiceStateRef.current === "speaking"
                    ) {
                        updateVoiceState("listening");
                    }
                };

                updateVoiceState("speaking");
            } catch (error) {
                console.error("Audio playback failed:", error);
                setVoiceError("Unable to play the assistant's audio.");
            }
        },
        [updateVoiceState]
    );

    // --------------------------------------------------
    // MICROPHONE AUDIO -> WEBSOCKET
    // --------------------------------------------------

    const sendAudioToBackend = useCallback((arrayBuffer) => {
        const socket = socketRef.current;

        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";

        for (let i = 0; i < bytes.length; i += 1) {
            binary += String.fromCharCode(bytes[i]);
        }

        socket.send(
            JSON.stringify({
                type: "audio",
                data: btoa(binary),
            })
        );
    }, []);

    // --------------------------------------------------
    // STOP VOICE SESSION
    // --------------------------------------------------

    const stopVoice = useCallback(async () => {
        stoppingRef.current = true;
        voiceSessionIdRef.current += 1;

        const socket = socketRef.current;
        socketRef.current = null;

        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                try {
                    socket.send(JSON.stringify({ type: "stop" }));
                } catch {
                    // Socket may already be closing.
                }
            }

            try {
                socket.close();
            } catch {
                // Ignore already-closed sockets.
            }
        }

        stopPlayback();

        if (processorRef.current) {
            try {
                processorRef.current.port.onmessage = null;
                processorRef.current.disconnect();
            } catch {
                // Node may already be disconnected.
            }

            processorRef.current = null;
        }

        if (sourceRef.current) {
            try {
                sourceRef.current.disconnect();
            } catch {
                // Ignore disconnection errors.
            }

            sourceRef.current = null;
        }

        if (silentGainRef.current) {
            try {
                silentGainRef.current.disconnect();
            } catch {
                // Ignore disconnection errors.
            }

            silentGainRef.current = null;
        }

        if (micStreamRef.current) {
            micStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            micStreamRef.current = null;
        }

        if (audioContextRef.current) {
            const context = audioContextRef.current;
            audioContextRef.current = null;

            try {
                await context.close();
            } catch {
                // Context may already be closed.
            }
        }

        setVoiceEnabled(false);
        updateVoiceState("idle");
        stoppingRef.current = false;
    }, [stopPlayback, updateVoiceState]);

    // --------------------------------------------------
    // START VOICE SESSION
    // --------------------------------------------------

    const startVoice = async () => {
        if (voiceStateRef.current !== "idle") {
            await stopVoice();
            return;
        }

        setVoiceError("");
        stoppingRef.current = false;

        const sessionId = ++voiceSessionIdRef.current;

        updateVoiceState("connecting");

        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error(
                    "Microphone access is unavailable. Use localhost or HTTPS."
                );
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            if (sessionId !== voiceSessionIdRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }

            micStreamRef.current = stream;

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            await audioContext.audioWorklet.addModule(pcmProcessorUrl);
            await audioContext.resume();

            if (sessionId !== voiceSessionIdRef.current) return;

            const socket = new WebSocket(VOICE_URL);
            socketRef.current = socket;

            // Register incoming events immediately.
            socket.onmessage = (event) => {
                if (sessionId !== voiceSessionIdRef.current) return;

                let data;

                try {
                    data = JSON.parse(event.data);
                } catch {
                    console.error("Invalid WebSocket message:", event.data);
                    return;
                }

                if (data.type === "status") {
                    if (data.state === "connected") {
                        setVoiceEnabled(true);
                        updateVoiceState("listening");
                    } else if (data.state === "listening") {
                        if (
                            playbackSourcesRef.current.size === 0
                        ) {
                            updateVoiceState("listening");
                        }
                    } else if (data.state === "interrupted") {
                        stopPlayback();
                        updateVoiceState("listening");
                    }
                }

                // Intentionally ignore transcription events.
                // Voice conversations never enter text chat.

                if (data.type === "audio" && data.data) {
                    playAudioChunk(
                        data.data,
                        data.sampleRate || 24000
                    );
                }

                if (data.type === "error") {
                    setVoiceError(
                        data.message || "Voice session failed."
                    );
                    updateVoiceState("error");
                }
            };

            socket.onclose = (event) => {
                console.warn("Voice WebSocket closed:", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                });

                if (
                    sessionId === voiceSessionIdRef.current &&
                    !stoppingRef.current
                ) {
                    setVoiceEnabled(false);
                    updateVoiceState("idle");
                    setVoiceError(
                        `Voice connection closed (${event.code}). Check the backend logs.`
                    );
                }
            };

            await new Promise((resolve, reject) => {
                socket.onopen = resolve;

                socket.onerror = () => {
                    reject(
                        new Error(
                            "Unable to connect to the voice backend."
                        )
                    );
                };
            });

            if (sessionId !== voiceSessionIdRef.current) return;

            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;

            const processor = new AudioWorkletNode(
                audioContext,
                "pcm-processor"
            );

            processorRef.current = processor;

            processor.port.onmessage = (event) => {
                if (sessionId === voiceSessionIdRef.current) {
                    sendAudioToBackend(event.data);
                }
            };

            // Keep microphone processing active without feedback.
            const silentGain = audioContext.createGain();
            silentGain.gain.value = 0;
            silentGainRef.current = silentGain;

            source.connect(processor);
            processor.connect(silentGain);
            silentGain.connect(audioContext.destination);
        } catch (error) {
            console.error("Voice initialization failed:", error);

            setVoiceError(
                error.message ||
                "Could not start voice mode. Check microphone permissions and the backend."
            );

            await stopVoice();
            updateVoiceState("error");
        }
    };

    // Clean up all resources when leaving this page.
    useEffect(() => {
        return () => {
            stoppingRef.current = true;
            voiceSessionIdRef.current += 1;

            if (textIntervalRef.current) {
                clearInterval(textIntervalRef.current);
            }

            if (socketRef.current) {
                try {
                    socketRef.current.close();
                } catch {
                    // Ignore cleanup errors.
                }
            }

            micStreamRef.current
                ?.getTracks()
                .forEach((track) => track.stop());

            playbackSourcesRef.current.forEach((source) => {
                try {
                    source.stop();
                } catch {
                    // Already stopped.
                }
            });

            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => { });
            }
        };
    }, []);

    // Stop the microphone if the user switches away from voice mode.
    const switchMode = async (mode) => {
        if (mode === assistantMode) return;

        if (voiceStateRef.current !== "idle") {
            await stopVoice();
        }

        setAssistantMode(mode);
        setVoiceError("");
    };

    const voiceStatus = {
        idle: "Ready when you are",
        connecting: "Connecting to HealthSphere AI...",
        connected: "Connected",
        listening: "Listening to you...",
        thinking: "Thinking...",
        speaking: "HealthSphere AI is speaking...",
        interrupted: "Interrupted",
        error: "Voice connection error",
    }[voiceState] || "Voice assistant";

    return (
        <div className="chatbot-page">
            <div className="glow one" />
            <div className="glow two" />

            <div className="chat-container">
                {/* HEADER */}
                <header className="chat-header">
                    <div className="ai-brand">
                        <div className="ai-icon">
                            <Bot />
                        </div>

                        <div>
                            <h2>HealthSphere AI</h2>
                            <span>● Online Healthcare Assistant</span>
                        </div>
                    </div>

                    {assistantMode === "chat" && (
                        <button
                            type="button"
                            className="new-chat"
                            onClick={newChat}
                        >
                            <Plus size={18} />
                            New Chat
                        </button>
                    )}
                </header>

                {/* CHAT / VOICE SELECTOR */}
                <div className="assistant-mode-switch">
                    <button
                        type="button"
                        className={
                            assistantMode === "chat" ? "active" : ""
                        }
                        onClick={() => switchMode("chat")}
                        aria-pressed={assistantMode === "chat"}
                    >
                        <MessageSquare size={17} />
                        Chat
                    </button>

                    <button
                        type="button"
                        className={
                            assistantMode === "voice" ? "active" : ""
                        }
                        onClick={() => switchMode("voice")}
                        aria-pressed={assistantMode === "voice"}
                    >
                        <Mic size={17} />
                        Voice
                    </button>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    {assistantMode === "chat" ? (
                        <motion.section
                            key="chat-mode"
                            className="chat-mode"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.18 }}
                        >
                            <div className="chat-body">
                                <aside className="history-panel">
                                    <h3>Chat History</h3>

                                    <div className="history-list">
                                        {history.map((chat) => (
                                            <button
                                                type="button"
                                                key={chat.id}
                                                className="history-item"
                                                onClick={() => loadChat(chat)}
                                            >
                                                {chat.title}
                                            </button>
                                        ))}
                                    </div>
                                </aside>

                                <div
                                    className="messages"
                                    ref={messagesRef}
                                >
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={
                                                msg.id ||
                                                `${index}-${msg.sender}`
                                            }
                                            initial={{
                                                opacity: 0,
                                                y: 12,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            className={
                                                msg.sender === "user"
                                                    ? "message user"
                                                    : "message ai"
                                            }
                                        >
                                            <div className="avatar">
                                                {msg.sender === "ai" ? (
                                                    <Bot />
                                                ) : (
                                                    <User />
                                                )}
                                            </div>

                                            <div className="bubble">
                                                <ReactMarkdown>
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {typing && (
                                        <div className="typing">
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="input-area">
                                <input
                                    value={input}
                                    onChange={(event) =>
                                        setInput(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey
                                        ) {
                                            event.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Ask your health question..."
                                    disabled={typing}
                                />

                                <button
                                    type="button"
                                    onClick={sendMessage}
                                    disabled={!input.trim() || typing}
                                    aria-label="Send message"
                                >
                                    <Send />
                                </button>
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section
                            key="voice-mode"
                            className="voice-mode"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.18 }}
                        >
                            <div className="voice-mode-heading">
                                <span className="voice-mode-eyebrow">
                                    HEALTHSPHERE AI
                                </span>

                                <h3>Your personal voice assistant</h3>

                                <p>
                                    Speak naturally. HealthSphere AI will
                                    listen and respond aloud.
                                </p>
                            </div>

                            <div
                                className={`voice-assistant-orb ${voiceState}`}
                            >
                                <div className="voice-orb-ring ring-one" />
                                <div className="voice-orb-ring ring-two" />

                                <motion.div
                                    className="voice-orb-core"
                                    animate={
                                        voiceState === "listening" ||
                                            voiceState === "speaking"
                                            ? {
                                                scale: [1, 1.08, 1],
                                            }
                                            : { scale: 1 }
                                    }
                                    transition={{
                                        duration:
                                            voiceState === "speaking"
                                                ? 0.7
                                                : 1.5,
                                        repeat:
                                            voiceState === "listening" ||
                                                voiceState === "speaking"
                                                ? Infinity
                                                : 0,
                                    }}
                                >
                                    {voiceState === "connecting" ? (
                                        <LoaderCircle className="voice-spinner" />
                                    ) : voiceState === "speaking" ? (
                                        <Volume2 size={34} />
                                    ) : voiceState === "listening" ? (
                                        <Activity size={34} />
                                    ) : (
                                        <Bot size={34} />
                                    )}
                                </motion.div>
                            </div>

                            <div
                                className={`voice-mode-status status-${voiceState}`}
                                role="status"
                                aria-live="polite"
                            >
                                <span className="voice-status-dot" />
                                {voiceStatus}
                            </div>

                            {voiceError && (
                                <div className="voice-error">
                                    {voiceError}
                                </div>
                            )}

                            <div className="voice-mode-controls">
                                {voiceEnabled ? (
                                    <button
                                        type="button"
                                        className="voice-button danger"
                                        onClick={stopVoice}
                                    >
                                        <PhoneOff size={18} />
                                        End Voice Session
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="voice-button"
                                        onClick={startVoice}
                                        disabled={
                                            voiceState === "connecting"
                                        }
                                    >
                                        {voiceState === "connecting" ? (
                                            <LoaderCircle
                                                className="voice-spinner"
                                                size={18}
                                            />
                                        ) : (
                                            <Mic size={18} />
                                        )}

                                        {voiceState === "connecting"
                                            ? "Connecting..."
                                            : "Start Voice Session"}
                                    </button>
                                )}
                            </div>

                            <p className="voice-mode-footnote">
                                <span />
                                Live voice conversation · No transcript
                                displayed
                            </p>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Chatbot;
