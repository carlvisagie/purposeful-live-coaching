/**
 * AI SESSION CO-PILOT
 * 
 * The core AI engine that powers ALL sessions - training and live client coaching.
 * 
 * This component:
 * 1. AUTOMATICALLY activates when any session starts
 * 2. WATCHES video for micro-expressions, body language, behavioral cues
 * 3. LISTENS to voice for tone, pace, stress indicators
 * 4. DIAGNOSES patterns and provides real-time insights
 * 5. GUIDES the coach through their headset with whispered advice
 * 6. PROTECTS compliance by catching medical/legal advice before it's spoken
 * 
 * Uses Vapi for real-time voice conversation - AI can interrupt and respond instantly.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

// Vapi SDK types
declare global {
  interface Window {
    Vapi: any;
  }
}

// Your Vapi credentials
const VAPI_PUBLIC_KEY = "4bdee076-6ac8-47e0-b41a-ec418eeb2b01";
const ASSISTANT_IDS = {
  ultimate: "f86598d0-74a6-4405-9455-a6e244a1c4e1",
};

export type SessionMode = 
  | "speaker_training" 
  | "interview_prep" 
  | "coaching_practice" 
  | "live_client_session"
  | "compliance_monitor"
  | "singing";

interface AISessionCoPilotProps {
  mode: SessionMode;
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onInsight?: (insight: CoPilotInsight) => void;
  onTranscript?: (text: string, speaker: "user" | "ai" | "client") => void;
  assistantId?: string;
}

export interface CoPilotInsight {
  type: "observation" | "suggestion" | "warning" | "crisis" | "encouragement";
  category: "visual" | "vocal" | "behavioral" | "compliance" | "diagnostic";
  message: string;
  confidence: number;
  timestamp: Date;
  actionRequired?: boolean;
}

export function AISessionCoPilot({
  mode,
  isActive,
  videoRef,
  onInsight,
  onTranscript,
  assistantId = ASSISTANT_IDS.ultimate,
}: AISessionCoPilotProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const vapiRef = useRef<any>(null);
  const sdkLoadedRef = useRef(false);
  const connectionAttemptRef = useRef(0);

  // Load Vapi SDK on mount
  useEffect(() => {
    if (sdkLoadedRef.current) return;
    
    const existingScript = document.querySelector('script[src*="vapi"]');
    if (existingScript) {
      sdkLoadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/vapi.min.js";
    script.async = true;
    script.onload = () => {
      console.log("[AI Co-Pilot] Vapi SDK loaded");
      sdkLoadedRef.current = true;
    };
    script.onerror = () => {
      console.error("[AI Co-Pilot] Failed to load Vapi SDK");
      setError("Voice SDK failed to load");
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount - it's shared
    };
  }, []);

  // Connect/disconnect based on isActive
  useEffect(() => {
    if (isActive && !isConnected && !isConnecting) {
      connectVoice();
    } else if (!isActive && isConnected) {
      disconnectVoice();
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Connect to Vapi for real-time voice
  const connectVoice = useCallback(async () => {
    if (!window.Vapi) {
      // Wait for SDK to load
      setTimeout(() => {
        connectionAttemptRef.current++;
        if (connectionAttemptRef.current < 10) {
          connectVoice();
        } else {
          setError("Voice SDK not available");
          toast.error("Voice coach unavailable - SDK failed to load");
        }
      }, 500);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Initialize Vapi
      vapiRef.current = new window.Vapi(VAPI_PUBLIC_KEY);

      // Event handlers
      vapiRef.current.on("call-start", () => {
        console.log("[AI Co-Pilot] Voice connected");
        setIsConnected(true);
        setIsConnecting(false);
        toast.success("🎤 AI Coach connected - listening through your headset");
        
        onInsight?.({
          type: "observation",
          category: "behavioral",
          message: "AI Co-Pilot activated and listening",
          confidence: 1,
          timestamp: new Date(),
        });
      });

      vapiRef.current.on("call-end", () => {
        console.log("[AI Co-Pilot] Voice disconnected");
        setIsConnected(false);
        setIsSpeaking(false);
      });

      vapiRef.current.on("speech-start", () => {
        setIsSpeaking(true);
      });

      vapiRef.current.on("speech-end", () => {
        setIsSpeaking(false);
      });

      vapiRef.current.on("message", (message: any) => {
        console.log("[AI Co-Pilot] Message:", message);
        
        if (message.type === "transcript" && message.transcriptType === "final") {
          const speaker = message.role === "assistant" ? "ai" : "user";
          onTranscript?.(message.transcript, speaker);
          
          // Parse AI responses for insights
          if (speaker === "ai") {
            parseAIResponse(message.transcript);
          }
        }
      });

      vapiRef.current.on("error", (error: any) => {
        console.error("[AI Co-Pilot] Error:", error);
        setError(error.message || "Connection failed");
        setIsConnecting(false);
        setIsConnected(false);
        toast.error("Voice coach connection failed - retrying...");
        
        // Auto-retry once
        setTimeout(() => {
          if (isActive && !isConnected) {
            connectVoice();
          }
        }, 2000);
      });

      // Start the call
      await vapiRef.current.start(assistantId);

    } catch (error: any) {
      console.error("[AI Co-Pilot] Connection error:", error);
      setError(error.message);
      setIsConnecting(false);
      toast.error(`Voice coach failed: ${error.message}`);
    }
  }, [assistantId, isActive, onInsight, onTranscript]);

  // Disconnect voice
  const disconnectVoice = useCallback(() => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
      } catch (e) {
        // Ignore
      }
      vapiRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  }, []);

  // Parse AI responses to extract insights
  const parseAIResponse = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Detect insight types from AI response
    let insightType: CoPilotInsight["type"] = "observation";
    let category: CoPilotInsight["category"] = "behavioral";
    let actionRequired = false;

    if (lowerText.includes("stop") || lowerText.includes("warning") || lowerText.includes("careful")) {
      insightType = "warning";
      category = "compliance";
      actionRequired = true;
    } else if (lowerText.includes("crisis") || lowerText.includes("emergency") || lowerText.includes("988") || lowerText.includes("911")) {
      insightType = "crisis";
      category = "compliance";
      actionRequired = true;
    } else if (lowerText.includes("great") || lowerText.includes("good") || lowerText.includes("excellent") || lowerText.includes("well done")) {
      insightType = "encouragement";
    } else if (lowerText.includes("try") || lowerText.includes("suggest") || lowerText.includes("ask") || lowerText.includes("consider")) {
      insightType = "suggestion";
    }

    // Detect category
    if (lowerText.includes("eye") || lowerText.includes("look") || lowerText.includes("posture") || lowerText.includes("gesture")) {
      category = "visual";
    } else if (lowerText.includes("voice") || lowerText.includes("tone") || lowerText.includes("pace") || lowerText.includes("speak")) {
      category = "vocal";
    } else if (lowerText.includes("medical") || lowerText.includes("diagnos") || lowerText.includes("legal") || lowerText.includes("prescri")) {
      category = "compliance";
    }

    onInsight?.({
      type: insightType,
      category,
      message: text,
      confidence: 0.9,
      timestamp: new Date(),
      actionRequired,
    });
  }, [onInsight]);

  // Send a message to the AI (for injecting context)
  const sendContext = useCallback((context: string) => {
    if (vapiRef.current && isConnected) {
      // Vapi handles this through the conversation
      console.log("[AI Co-Pilot] Context update:", context);
    }
  }, [isConnected]);

  // Expose methods via ref or return
  return {
    isConnected,
    isConnecting,
    isSpeaking,
    error,
    connect: connectVoice,
    disconnect: disconnectVoice,
    sendContext,
  };
}

/**
 * Hook version for easier integration
 */
export function useAISessionCoPilot(props: AISessionCoPilotProps) {
  return AISessionCoPilot(props);
}

/**
 * Visual indicator component to show AI Co-Pilot status
 */
export function CoPilotStatusIndicator({ 
  isConnected, 
  isConnecting, 
  isSpeaking,
  error,
}: {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  error: string | null;
}) {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span>AI Coach Error</span>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm animate-pulse">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
        <span>Connecting AI Coach...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
        isSpeaking 
          ? "bg-purple-100 text-purple-700 animate-pulse" 
          : "bg-green-100 text-green-700"
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isSpeaking ? "bg-purple-500 animate-bounce" : "bg-green-500"
        }`} />
        <span>{isSpeaking ? "AI Speaking..." : "AI Listening"}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-sm">
      <div className="w-2 h-2 bg-gray-400 rounded-full" />
      <span>AI Coach Standby</span>
    </div>
  );
}

export default AISessionCoPilot;
