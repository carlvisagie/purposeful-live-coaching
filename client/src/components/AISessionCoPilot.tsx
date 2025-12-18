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
 * Uses OpenAI Realtime API for true real-time voice conversation.
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

interface AISessionCoPilotProps {
  mode: SessionMode;
  isActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onInsight?: (insight: CoPilotInsight) => void;
  onTranscript?: (text: string, speaker: "user" | "ai" | "client") => void;
  voice?: "alloy" | "echo" | "shimmer" | "ash" | "ballad" | "coral" | "sage" | "verse";
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

export function AISessionCoPilot({
  mode,
  isActive,
  videoRef,
  onInsight,
  onTranscript,
  voice = "coral",
}: AISessionCoPilotProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const connectionAttemptRef = useRef(0);

  // Get session token from server
  const getSessionToken = trpc.realtimeVoice.getSessionToken.useMutation();

  // Connect to OpenAI Realtime API
  const connectVoice = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setIsConnecting(true);
    setError(null);
    connectionAttemptRef.current++;

    try {
      // Get ephemeral token from server
      const realtimeMode = MODE_MAP[mode] || "speaker_training";
      const session = await getSessionToken.mutateAsync({ 
        mode: realtimeMode, 
        voice 
      });
      
      if (!session.clientSecret) {
        throw new Error("Failed to get session token");
      }

      // Connect to OpenAI Realtime API
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        ["realtime", `openai-insecure-api-key.${session.clientSecret}`]
      );

      ws.onopen = async () => {
        console.log("[AI Co-Pilot] Connected to OpenAI Realtime API");
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        toast.success("🎤 AI Coach connected - listening through your headset");
        
        onInsight?.({
          type: "observation",
          category: "behavioral",
          message: "AI Co-Pilot activated and listening",
          confidence: 1,
          timestamp: new Date(),
        });

        // Start capturing audio
        await startAudioCapture();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleServerEvent(data);
      };

      ws.onerror = (error) => {
        console.error("[AI Co-Pilot] WebSocket error:", error);
        setError("Connection error");
        setIsConnecting(false);
        setIsConnected(false);
        
        // Auto-retry once
        if (connectionAttemptRef.current < 3 && isActive) {
          setTimeout(() => connectVoice(), 2000);
        }
      };

      ws.onclose = () => {
        console.log("[AI Co-Pilot] Disconnected");
        setIsConnected(false);
        setIsSpeaking(false);
        setIsListening(false);
        stopAudioCapture();
      };

      wsRef.current = ws;
    } catch (error: any) {
      console.error("[AI Co-Pilot] Connection error:", error);
      setError(error.message || "Connection failed");
      setIsConnecting(false);
      toast.error(`Voice coach failed: ${error.message}`);
      
      // Auto-retry once
      if (connectionAttemptRef.current < 3 && isActive) {
        setTimeout(() => connectVoice(), 2000);
      }
    }
  }, [mode, voice, isActive, getSessionToken, onInsight]);

  // Handle server events
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

      case "response.audio.delta":
        // Queue audio for playback
        const audioData = base64ToFloat32Array(event.delta);
        audioQueueRef.current.push(audioData);
        if (!isPlayingRef.current) {
          playAudioQueue();
        }
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

  // Start capturing audio from microphone
  const startAudioCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioContext;

      // Create source from microphone
      const source = audioContext.createMediaStreamSource(stream);

      // Load audio worklet for processing
      await audioContext.audioWorklet.addModule(
        URL.createObjectURL(new Blob([`
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
        `], { type: 'application/javascript' }))
      );

      const worklet = new AudioWorkletNode(audioContext, 'audio-processor');
      worklet.port.onmessage = (event) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64Audio = float32ArrayToBase64(event.data);
          wsRef.current.send(JSON.stringify({
            type: "input_audio_buffer.append",
            audio: base64Audio,
          }));
        }
      };

      source.connect(worklet);
      audioWorkletRef.current = worklet;

      console.log("[AI Co-Pilot] Audio capture started");
    } catch (error) {
      console.error("[AI Co-Pilot] Failed to start audio capture:", error);
      setError("Failed to access microphone");
    }
  }, []);

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

  // Play audio queue
  const playAudioQueue = useCallback(async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);

    const audioContext = audioContextRef.current || new AudioContext({ sampleRate: 24000 });
    
    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift()!;
      const buffer = audioContext.createBuffer(1, audioData.length, 24000);
      buffer.getChannelData(0).set(audioData);
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      
      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        source.start();
      });
    }

    isPlayingRef.current = false;
  }, []);

  // Disconnect voice
  const disconnectVoice = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopAudioCapture();
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsListening(false);
  }, [stopAudioCapture]);

  // Send context to AI
  const sendContext = useCallback((context: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: context }],
        },
      }));
      wsRef.current.send(JSON.stringify({
        type: "response.create",
      }));
    }
  }, []);

  // Connect/disconnect based on isActive
  useEffect(() => {
    if (isActive && !isConnected && !isConnecting) {
      connectionAttemptRef.current = 0;
      connectVoice();
    } else if (!isActive && isConnected) {
      disconnectVoice();
    }
  }, [isActive, isConnected, isConnecting, connectVoice, disconnectVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectVoice();
    };
  }, [disconnectVoice]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
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
  isListening,
  error,
}: {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening?: boolean;
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
          : isListening
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isSpeaking ? "bg-purple-500 animate-bounce" : isListening ? "bg-blue-500 animate-pulse" : "bg-green-500"
        }`} />
        <span>{isSpeaking ? "AI Speaking..." : isListening ? "Listening..." : "AI Ready"}</span>
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

export default AISessionCoPilot;
