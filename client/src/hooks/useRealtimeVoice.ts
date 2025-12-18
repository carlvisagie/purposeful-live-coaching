import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";

/**
 * REALTIME VOICE HOOK
 * 
 * Connects to OpenAI Realtime API for true real-time voice conversation.
 * The AI listens continuously and can respond/interrupt instantly.
 * 
 * Features:
 * - WebSocket-based voice session
 * - Server-side VAD (voice activity detection)
 * - Instant AI responses through speakers
 * - AI can interrupt when user says something wrong
 */

type RealtimeMode = 
  | "speaker_training" 
  | "interview_prep" 
  | "coaching_practice" 
  | "compliance_monitor" 
  | "singing";

type RealtimeVoice = 
  | "alloy" 
  | "echo" 
  | "shimmer" 
  | "ash" 
  | "ballad" 
  | "coral" 
  | "sage" 
  | "verse";

interface UseRealtimeVoiceOptions {
  mode: RealtimeMode;
  voice?: RealtimeVoice;
  isActive: boolean;
  onTranscript?: (text: string, speaker: "user" | "ai") => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: RealtimeStatus) => void;
}

type RealtimeStatus = 
  | "disconnected" 
  | "connecting" 
  | "connected" 
  | "listening" 
  | "processing" 
  | "speaking"
  | "error";

interface RealtimeState {
  status: RealtimeStatus;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
  transcript: string;
  aiResponse: string;
}

export function useRealtimeVoice({
  mode,
  voice = "coral",
  isActive,
  onTranscript,
  onError,
  onStatusChange,
}: UseRealtimeVoiceOptions) {
  const [state, setState] = useState<RealtimeState>({
    status: "disconnected",
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    error: null,
    transcript: "",
    aiResponse: "",
  });

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  // Get session token mutation
  const getSessionToken = trpc.realtimeVoice.getSessionToken.useMutation();

  // Update status
  const updateStatus = useCallback((status: RealtimeStatus) => {
    setState(prev => ({ ...prev, status }));
    onStatusChange?.(status);
  }, [onStatusChange]);

  // Connect to Realtime API
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      updateStatus("connecting");

      // Get ephemeral token from server
      const session = await getSessionToken.mutateAsync({ mode, voice });
      
      if (!session.clientSecret) {
        throw new Error("Failed to get session token");
      }

      // Connect to OpenAI Realtime API
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        ["realtime", `openai-insecure-api-key.${session.clientSecret}`]
      );

      ws.onopen = () => {
        console.log("[Realtime] Connected");
        setState(prev => ({ ...prev, isConnected: true, error: null }));
        updateStatus("connected");
        
        // Start capturing audio
        startAudioCapture();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleServerEvent(data);
      };

      ws.onerror = (error) => {
        console.error("[Realtime] WebSocket error:", error);
        setState(prev => ({ ...prev, error: "Connection error" }));
        updateStatus("error");
        onError?.("Connection error");
      };

      ws.onclose = () => {
        console.log("[Realtime] Disconnected");
        setState(prev => ({ ...prev, isConnected: false }));
        updateStatus("disconnected");
        stopAudioCapture();
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("[Realtime] Connection failed:", error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "Connection failed" 
      }));
      updateStatus("error");
      onError?.(error instanceof Error ? error.message : "Connection failed");
    }
  }, [mode, voice, getSessionToken, updateStatus, onError]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopAudioCapture();
    setState(prev => ({ ...prev, isConnected: false }));
    updateStatus("disconnected");
  }, [updateStatus]);

  // Handle server events
  const handleServerEvent = useCallback((event: any) => {
    switch (event.type) {
      case "session.created":
        console.log("[Realtime] Session created");
        break;

      case "input_audio_buffer.speech_started":
        setState(prev => ({ ...prev, isListening: true }));
        updateStatus("listening");
        break;

      case "input_audio_buffer.speech_stopped":
        setState(prev => ({ ...prev, isListening: false }));
        updateStatus("processing");
        break;

      case "conversation.item.input_audio_transcription.completed":
        const userTranscript = event.transcript;
        setState(prev => ({ ...prev, transcript: userTranscript }));
        onTranscript?.(userTranscript, "user");
        break;

      case "response.audio_transcript.delta":
        setState(prev => ({ 
          ...prev, 
          aiResponse: prev.aiResponse + event.delta 
        }));
        break;

      case "response.audio_transcript.done":
        const aiText = event.transcript;
        onTranscript?.(aiText, "ai");
        setState(prev => ({ ...prev, aiResponse: "" }));
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
        setState(prev => ({ ...prev, isSpeaking: false }));
        updateStatus("connected");
        break;

      case "response.done":
        console.log("[Realtime] Response complete");
        break;

      case "error":
        console.error("[Realtime] Server error:", event.error);
        setState(prev => ({ ...prev, error: event.error?.message }));
        onError?.(event.error?.message || "Server error");
        break;
    }
  }, [onTranscript, onError, updateStatus]);

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

      console.log("[Realtime] Audio capture started");
    } catch (error) {
      console.error("[Realtime] Failed to start audio capture:", error);
      onError?.("Failed to access microphone");
    }
  }, [onError]);

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
    setState(prev => ({ ...prev, isSpeaking: true }));
    updateStatus("speaking");

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
  }, [updateStatus]);

  // Send text message to AI
  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    }));

    wsRef.current.send(JSON.stringify({
      type: "response.create",
    }));
  }, []);

  // Interrupt AI response
  const interrupt = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({
      type: "response.cancel",
    }));

    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  // Auto-connect/disconnect based on isActive
  useEffect(() => {
    if (isActive) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isActive, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    interrupt,
  };
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

export type { RealtimeMode, RealtimeVoice, RealtimeStatus, RealtimeState };
