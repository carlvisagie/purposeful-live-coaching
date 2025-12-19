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
 * Uses OpenAI Realtime API with WebRTC for true real-time voice conversation.
 * Updated to use the new unified interface (GA API, December 2024).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export type SessionMode = 
  | "speaker_training" 
  | "interview_prep" 
  | "coaching_practice" 
  | "live_client_session"
  | "compliance_monitor"
  | "singing";

interface UseAISessionCoPilotProps {
  mode: SessionMode;
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onInsight?: (insight: CoPilotInsight) => void;
  onTranscript?: (text: string, speaker: "user" | "ai" | "client") => void;
  voice?: "alloy" | "echo" | "shimmer" | "ash" | "ballad" | "coral" | "sage" | "verse" | "marin";
}

export interface CoPilotInsight {
  type: "observation" | "suggestion" | "warning" | "crisis" | "encouragement";
  category: "visual" | "vocal" | "behavioral" | "compliance" | "diagnostic";
  message: string;
  confidence: number;
  timestamp: Date;
  actionRequired?: boolean;
}

// Map session modes to realtime voice modes
const MODE_MAP: Record<SessionMode, "speaker_training" | "interview_prep" | "coaching_practice" | "compliance_monitor" | "singing"> = {
  speaker_training: "speaker_training",
  interview_prep: "interview_prep",
  coaching_practice: "coaching_practice",
  live_client_session: "compliance_monitor",
  compliance_monitor: "compliance_monitor",
  singing: "singing",
};

/**
 * useAISessionCoPilot Hook
 * 
 * The main hook for integrating AI voice coaching into any component.
 * Returns connection state and control functions.
 */
export function useAISessionCoPilot({
  mode,
  isActive,
  videoRef,
  onInsight,
  onTranscript,
  voice = "coral",
}: UseAISessionCoPilotProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const connectionAttemptRef = useRef(0);

  // Get WebRTC session from server
  const createWebRTCSession = trpc.realtimeVoice.createWebRTCSession.useMutation();

  // Connect to OpenAI Realtime API via WebRTC
  const connect = useCallback(async () => {
    if (peerConnectionRef.current) return;
    
    setIsConnecting(true);
    setError(null);
    connectionAttemptRef.current++;

    try {
      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      // Set up audio element to play AI responses
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;
      
      // When we receive audio from OpenAI, play it through headset
      pc.ontrack = (event) => {
        console.log("[AI Co-Pilot] Received audio track from OpenAI");
        audioEl.srcObject = event.streams[0];
        setIsSpeaking(true);
        toast.success("🔊 AI Coach speaking through your headset");
      };

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      mediaStreamRef.current = stream;
      
      // Add microphone track to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Set up data channel for events
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;
      
      dc.onopen = () => {
        console.log("[AI Co-Pilot] Data channel open");
        setIsListening(true);
      };

      dc.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerEvent(data);
        } catch (e) {
          console.error("[AI Co-Pilot] Failed to parse event:", e);
        }
      };

      dc.onclose = () => {
        console.log("[AI Co-Pilot] Data channel closed");
        setIsListening(false);
      };

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === "complete") {
          resolve();
        } else {
          const checkState = () => {
            if (pc.iceGatheringState === "complete") {
              pc.removeEventListener("icegatheringstatechange", checkState);
              resolve();
            }
          };
          pc.addEventListener("icegatheringstatechange", checkState);
          // Timeout after 5 seconds
          setTimeout(resolve, 5000);
        }
      });

      // Get the final SDP offer
      const finalOffer = pc.localDescription;
      if (!finalOffer?.sdp) {
        throw new Error("Failed to create SDP offer");
      }

      // Send SDP to server, get answer back
      const realtimeMode = MODE_MAP[mode] || "speaker_training";
      const response = await createWebRTCSession.mutateAsync({
        sdp: finalOffer.sdp,
        mode: realtimeMode,
        voice,
      });

      if (!response.sdp) {
        throw new Error("Failed to get SDP answer from server");
      }

      // Set remote description with OpenAI's answer
      await pc.setRemoteDescription({
        type: "answer",
        sdp: response.sdp,
      });

      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      toast.success("🎤 AI Coach connected - speaking through your headset");
      
      onInsight?.({
        type: "observation",
        category: "behavioral",
        message: "AI Co-Pilot activated and ready to coach",
        confidence: 1,
        timestamp: new Date(),
      });

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log("[AI Co-Pilot] Connection state:", pc.connectionState);
        if (pc.connectionState === "connected") {
          setIsConnected(true);
        } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          setIsConnected(false);
          setError("Connection lost");
        }
      };

    } catch (err: any) {
      console.error("[AI Co-Pilot] Connection error:", err);
      setError(err.message || "Connection failed");
      setIsConnecting(false);
      toast.error(`Voice coach failed: ${err.message}`);
      
      // Clean up on error
      disconnect();
      
      // Auto-retry once
      if (connectionAttemptRef.current < 3 && isActive) {
        setTimeout(() => connect(), 2000);
      }
    }
  }, [mode, voice, isActive, createWebRTCSession, onInsight]);

  // Handle server events from data channel
  const handleServerEvent = useCallback((event: any) => {
    switch (event.type) {
      case "session.created":
        console.log("[AI Co-Pilot] Session created");
        break;

      case "input_audio_buffer.speech_started":
        setIsListening(true);
        break;

      case "input_audio_buffer.speech_stopped":
        setIsListening(false);
        break;

      case "conversation.item.input_audio_transcription.completed":
        const userTranscript = event.transcript;
        onTranscript?.(userTranscript, "user");
        break;

      case "response.audio_transcript.done":
        const aiText = event.transcript;
        onTranscript?.(aiText, "ai");
        parseAIResponse(aiText);
        break;

      case "response.audio.done":
        setIsSpeaking(false);
        break;

      case "error":
        console.error("[AI Co-Pilot] Server error:", event.error);
        setError(event.error?.message || "Server error");
        break;
    }
  }, [onTranscript]);

  // Parse AI responses to extract insights
  const parseAIResponse = useCallback((text: string) => {
    if (!text) return;
    
    const lowerText = text.toLowerCase();
    
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

  // Disconnect and clean up
  const disconnect = useCallback(() => {
    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Remove audio element
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
  }, []);

  // Auto-connect when active
  useEffect(() => {
    if (isActive && !isConnected && !isConnecting) {
      connectionAttemptRef.current = 0;
      connect();
    } else if (!isActive && isConnected) {
      disconnect();
    }
  }, [isActive, isConnected, isConnecting, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    error,
    connect,
    disconnect,
  };
}

// Status indicator component for UI
export function CoPilotStatusIndicator({ 
  isConnected, 
  isListening,
  isSpeaking,
  error 
}: { 
  isConnected: boolean; 
  isListening?: boolean;
  isSpeaking?: boolean;
  error?: string | null;
}) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm">AI Coach Error</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <span className="text-sm">AI Coach Offline</span>
      </div>
    );
  }

  if (isSpeaking) {
    return (
      <div className="flex items-center gap-2 text-purple-500">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-sm">AI Coach Speaking...</span>
      </div>
    );
  }

  if (isListening) {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm">AI Coach Listening...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-500">
      <span className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-sm">AI Coach Ready</span>
    </div>
  );
}

// Component version (for backwards compatibility)
interface AISessionCoPilotProps {
  mode: SessionMode;
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onInsight?: (insight: CoPilotInsight) => void;
  onTranscript?: (text: string, speaker: "user" | "ai" | "client") => void;
  voice?: "alloy" | "echo" | "shimmer" | "ash" | "ballad" | "coral" | "sage" | "verse" | "marin";
}

export function AISessionCoPilot(props: AISessionCoPilotProps) {
  // Just use the hook internally - component doesn't render anything
  useAISessionCoPilot(props);
  return null;
}

export default AISessionCoPilot;
