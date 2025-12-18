/**
 * VAPI VOICE COACH COMPONENT
 * 
 * Real-time voice conversation with AI Coach using Vapi.
 * The AI listens continuously and responds instantly through your headset.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2, Brain } from "lucide-react";
import { toast } from "sonner";

// Vapi Web SDK types
declare global {
  interface Window {
    Vapi: any;
  }
}

interface VapiVoiceCoachProps {
  mode?: "speaker_training" | "interview_prep" | "coaching_practice" | "compliance_monitor" | "singing";
  onClose?: () => void;
  assistantId?: string;
}

// Your Vapi Assistant IDs
const ASSISTANT_IDS = {
  ultimate: "f86598d0-74a6-4405-9455-a6e244a1c4e1",
  super_intelligence: "super-intelligence-id", // Get from Vapi dashboard
  zoom_monitor: "zoom-monitor-id",
  purposeful: "purposeful-id",
};

// Vapi Public Key (client-side SDK)
const VAPI_PUBLIC_KEY = "4bdee076-6ac8-47e0-b41a-ec418eeb2b01";

export function VapiVoiceCoach({ mode = "speaker_training", onClose, assistantId }: VapiVoiceCoachProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<"user" | "assistant" | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  const vapiRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Load Vapi SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/vapi.min.js";
    script.async = true;
    script.onload = () => {
      console.log("[Vapi] SDK loaded");
    };
    document.body.appendChild(script);

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
      document.body.removeChild(script);
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Start voice call
  const startCall = useCallback(async () => {
    if (!window.Vapi) {
      toast.error("Voice SDK not loaded yet. Please wait a moment.");
      return;
    }

    setIsConnecting(true);

    try {
      // Initialize Vapi with public key
      vapiRef.current = new window.Vapi(VAPI_PUBLIC_KEY);

      // Set up event listeners
      vapiRef.current.on("call-start", () => {
        console.log("[Vapi] Call started");
        setIsConnected(true);
        setIsConnecting(false);
        toast.success("Connected! AI Coach is listening...");
      });

      vapiRef.current.on("call-end", () => {
        console.log("[Vapi] Call ended");
        setIsConnected(false);
        setCurrentSpeaker(null);
        toast.info("Call ended");
      });

      vapiRef.current.on("speech-start", () => {
        setCurrentSpeaker("assistant");
      });

      vapiRef.current.on("speech-end", () => {
        setCurrentSpeaker(null);
      });

      vapiRef.current.on("message", (message: any) => {
        console.log("[Vapi] Message:", message);
        
        if (message.type === "transcript") {
          const role = message.role === "assistant" ? "🤖 AI" : "🎤 You";
          const text = message.transcript;
          
          if (message.transcriptType === "final") {
            setTranscript(prev => [...prev, `${role}: ${text}`]);
          }
        }
      });

      vapiRef.current.on("volume-level", (level: number) => {
        setVolumeLevel(level);
      });

      vapiRef.current.on("error", (error: any) => {
        console.error("[Vapi] Error:", error);
        toast.error(`Voice error: ${error.message || "Connection failed"}`);
        setIsConnecting(false);
        setIsConnected(false);
      });

      // Start the call with the assistant
      const targetAssistantId = assistantId || ASSISTANT_IDS.ultimate;
      await vapiRef.current.start(targetAssistantId);

    } catch (error: any) {
      console.error("[Vapi] Start error:", error);
      toast.error(`Failed to start: ${error.message}`);
      setIsConnecting(false);
    }
  }, [assistantId]);

  // End voice call
  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
      toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
    }
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
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected 
                ? currentSpeaker === "assistant"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse scale-110"
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
                    {currentSpeaker === "assistant" ? "AI Speaking..." : "Listening..."}
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
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-100"
                  style={{ width: `${volumeLevel * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="bg-gray-800/50 rounded-xl p-4 h-48 overflow-y-auto mb-6 border border-gray-700">
            {transcript.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                {isConnected 
                  ? "Start speaking... AI is listening in real-time!"
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
              <p>🎤 Speak naturally - AI responds in real-time through your headset</p>
            ) : (
              <p>💡 Make sure your headset is connected before starting</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VapiVoiceCoach;
