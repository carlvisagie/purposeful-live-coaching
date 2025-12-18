/**
 * OPENAI REALTIME VOICE COACH COMPONENT
 * 
 * Real-time voice conversation with AI Coach using OpenAI Realtime API.
 * The AI listens continuously and SPEAKS through your headset with instant feedback.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2, Brain } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface OpenAIVoiceCoachProps {
  mode?: "speaker_training" | "interview_prep" | "coaching_practice" | "compliance_monitor" | "singing";
  onClose?: () => void;
}

export function OpenAIVoiceCoach({ mode = "speaker_training", onClose }: OpenAIVoiceCoachProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<"user" | "assistant" | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Get session token from server
  const getSessionToken = trpc.realtimeVoice.getSessionToken.useMutation();

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  // Start voice call with OpenAI Realtime API
  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Get ephemeral token from server
      const session = await getSessionToken.mutateAsync({ 
        mode, 
        voice: "coral" 
      });
      
      if (!session.clientSecret) {
        throw new Error("Failed to get session token from server");
      }

      console.log("[OpenAI Realtime] Got session token, connecting...");

      // Connect to OpenAI Realtime API
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        ["realtime", `openai-insecure-api-key.${session.clientSecret}`]
      );

      ws.onopen = async () => {
        console.log("[OpenAI Realtime] Connected!");
        setIsConnected(true);
        setIsConnecting(false);
        toast.success("🎤 Connected! AI Coach is listening and will speak through your headset");
        
        // Start capturing audio from microphone
        await startAudioCapture();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleServerEvent(data);
      };

      ws.onerror = (err) => {
        console.error("[OpenAI Realtime] WebSocket error:", err);
        setError("Connection error - please try again");
        setIsConnecting(false);
        setIsConnected(false);
        toast.error("Voice connection failed");
      };

      ws.onclose = () => {
        console.log("[OpenAI Realtime] Disconnected");
        setIsConnected(false);
        setCurrentSpeaker(null);
        stopAudioCapture();
      };

      wsRef.current = ws;
    } catch (err: any) {
      console.error("[OpenAI Realtime] Start error:", err);
      setError(err.message || "Failed to connect");
      setIsConnecting(false);
      toast.error(`Failed to start: ${err.message}`);
    }
  }, [mode, getSessionToken]);

  // Handle server events
  const handleServerEvent = useCallback((event: any) => {
    switch (event.type) {
      case "session.created":
        console.log("[OpenAI Realtime] Session created");
        break;

      case "input_audio_buffer.speech_started":
        setCurrentSpeaker("user");
        setVolumeLevel(0.7);
        break;

      case "input_audio_buffer.speech_stopped":
        setCurrentSpeaker(null);
        setVolumeLevel(0);
        break;

      case "conversation.item.input_audio_transcription.completed":
        const userText = event.transcript;
        if (userText && userText.trim()) {
          setTranscript(prev => [...prev, `🎤 You: ${userText}`]);
        }
        break;

      case "response.audio_transcript.delta":
        // AI is speaking - show partial transcript
        setCurrentSpeaker("assistant");
        break;

      case "response.audio_transcript.done":
        const aiText = event.transcript;
        if (aiText && aiText.trim()) {
          setTranscript(prev => [...prev, `🤖 AI: ${aiText}`]);
        }
        break;

      case "response.audio.delta":
        // Queue audio for playback through speakers/headset
        if (isSpeakerOn) {
          const audioData = base64ToFloat32Array(event.delta);
          audioQueueRef.current.push(audioData);
          if (!isPlayingRef.current) {
            playAudioQueue();
          }
        }
        break;

      case "response.audio.done":
        setCurrentSpeaker(null);
        break;

      case "error":
        console.error("[OpenAI Realtime] Server error:", event.error);
        setError(event.error?.message || "Server error");
        toast.error(event.error?.message || "AI error occurred");
        break;
    }
  }, [isSpeakerOn]);

  // Start capturing audio from microphone
  const startAudioCapture = useCallback(async () => {
    try {
      console.log("[OpenAI Realtime] Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      mediaStreamRef.current = stream;
      console.log("[OpenAI Realtime] Microphone access granted");

      // Create audio context at 24kHz (required by OpenAI)
      const audioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioContext;

      // Create source from microphone
      const source = audioContext.createMediaStreamSource(stream);

      // Load audio worklet for processing
      const workletCode = `
        class AudioProcessor extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input && input[0]) {
              this.port.postMessage(input[0]);
            }
            return true;
          }
        }
        registerProcessor('audio-processor', AudioProcessor);
      `;
      
      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      
      await audioContext.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      const worklet = new AudioWorkletNode(audioContext, 'audio-processor');
      worklet.port.onmessage = (event) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && !isMuted) {
          const base64Audio = float32ArrayToBase64(event.data);
          wsRef.current.send(JSON.stringify({
            type: "input_audio_buffer.append",
            audio: base64Audio,
          }));
        }
      };

      source.connect(worklet);
      audioWorkletRef.current = worklet;

      console.log("[OpenAI Realtime] Audio capture started - speak now!");
    } catch (err: any) {
      console.error("[OpenAI Realtime] Microphone error:", err);
      setError("Failed to access microphone - please allow microphone access");
      toast.error("Microphone access denied");
    }
  }, [isMuted]);

  // Stop audio capture
  const stopAudioCapture = useCallback(() => {
    if (audioWorkletRef.current) {
      audioWorkletRef.current.disconnect();
      audioWorkletRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  // Play audio queue (AI speaking through headset)
  const playAudioQueue = useCallback(async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    setCurrentSpeaker("assistant");

    // Create a separate audio context for playback
    const playbackContext = new AudioContext({ sampleRate: 24000 });
    
    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift()!;
      const buffer = playbackContext.createBuffer(1, audioData.length, 24000);
      buffer.getChannelData(0).set(audioData);
      
      const source = playbackContext.createBufferSource();
      source.buffer = buffer;
      source.connect(playbackContext.destination);
      
      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        source.start();
      });
    }

    await playbackContext.close();
    isPlayingRef.current = false;
    setCurrentSpeaker(null);
  }, []);

  // End voice call
  const endCall = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopAudioCapture();
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsConnected(false);
    setIsConnecting(false);
    setCurrentSpeaker(null);
  }, [stopAudioCapture]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
  }, [isMuted]);

  // Get mode title
  const getModeTitle = () => {
    switch (mode) {
      case "speaker_training": return "Speaker Training";
      case "interview_prep": return "Interview Prep";
      case "coaching_practice": return "Coaching Practice";
      case "compliance_monitor": return "Compliance Monitor";
      case "singing": return "Singing Coach";
      default: return "Voice Coach";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-purple-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">AI Voice Coach</h2>
              <p className="text-purple-200 text-sm">{getModeTitle()} - Real-time Conversation</p>
            </div>
          </div>
          <button
            onClick={() => {
              endCall();
              onClose?.();
            }}
            className="text-white/80 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Status Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected 
                ? currentSpeaker === "assistant"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse scale-110"
                  : currentSpeaker === "user"
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse"
                    : "bg-gradient-to-br from-green-500 to-emerald-500"
                : isConnecting
                  ? "bg-gradient-to-br from-yellow-500 to-orange-500 animate-pulse"
                  : "bg-gradient-to-br from-gray-600 to-gray-700"
            }`}>
              {isConnecting ? (
                <Loader2 className="w-16 h-16 text-white animate-spin" />
              ) : isConnected ? (
                <div className="text-center">
                  <Volume2 className={`w-12 h-12 text-white mx-auto ${currentSpeaker === "assistant" ? "animate-bounce" : ""}`} />
                  <span className="text-white text-xs mt-1 block">
                    {currentSpeaker === "assistant" 
                      ? "AI Speaking..." 
                      : currentSpeaker === "user"
                        ? "You're Speaking..."
                        : "Listening..."}
                  </span>
                </div>
              ) : (
                <Phone className="w-16 h-16 text-white" />
              )}
            </div>
          </div>

          {/* Volume Indicator */}
          {isConnected && (
            <div className="mb-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ${
                    currentSpeaker === "assistant" 
                      ? "bg-gradient-to-r from-purple-500 to-pink-400" 
                      : "bg-gradient-to-r from-green-500 to-emerald-400"
                  }`}
                  style={{ width: `${currentSpeaker ? 70 : 10}%` }}
                />
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="bg-gray-800/50 rounded-xl p-4 h-48 overflow-y-auto mb-6 border border-gray-700">
            {transcript.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                {isConnected 
                  ? "🎤 Start speaking... AI will respond through your headset!"
                  : "Click 'Start Voice Call' to begin your coaching session"
                }
              </div>
            ) : (
              <div className="space-y-2">
                {transcript.map((line, i) => (
                  <p 
                    key={i} 
                    className={`text-sm ${
                      line.startsWith("🤖") 
                        ? "text-purple-300" 
                        : "text-green-300"
                    }`}
                  >
                    {line}
                  </p>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isConnected ? (
              <button
                onClick={startCall}
                disabled={isConnecting}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-full transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="w-6 h-6" />
                    Start Voice Call
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full transition-all ${
                    isMuted 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={endCall}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold rounded-full transition-all transform hover:scale-105"
                >
                  <PhoneOff className="w-6 h-6" />
                  End Call
                </button>

                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`p-4 rounded-full transition-all ${
                    !isSpeakerOn 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {isSpeakerOn ? (
                    <Volume2 className="w-6 h-6 text-white" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-white" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            {isConnected ? (
              <p>🎧 AI Coach speaks through your headset - talk naturally and get instant feedback!</p>
            ) : (
              <p>💡 Make sure your headset is connected before starting</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility functions for audio conversion
function float32ArrayToBase64(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

function base64ToFloat32Array(base64: string): Float32Array {
  const binary = atob(base64);
  const uint8Array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }
  const int16Array = new Int16Array(uint8Array.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF);
  }
  return float32Array;
}

export default OpenAIVoiceCoach;
