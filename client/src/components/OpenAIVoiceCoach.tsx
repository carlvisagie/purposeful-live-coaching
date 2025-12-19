/**
 * OPENAI REALTIME VOICE COACH COMPONENT
 * 
 * Real-time voice conversation with AI Coach using OpenAI Realtime API.
 * Uses WebRTC (GA API) for browser connections - the AI SPEAKS through your headset.
 * 
 * Updated December 2024 to use the new unified interface.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2, Brain, X } from "lucide-react";
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
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Get WebRTC session from server
  const createWebRTCSession = trpc.realtimeVoice.createWebRTCSession.useMutation();

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

  // Start voice call with OpenAI Realtime API via WebRTC
  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      // Set up audio element to play AI responses through headset
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;
      
      // When we receive audio from OpenAI, play it through headset
      pc.ontrack = (event) => {
        console.log("[OpenAI Realtime] Receiving AI audio - playing through headset");
        audioEl.srcObject = event.streams[0];
        setCurrentSpeaker("assistant");
        toast.success("🔊 AI Coach is now speaking through your headset!");
      };

      // Request microphone access
      console.log("[OpenAI Realtime] Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      mediaStreamRef.current = stream;
      console.log("[OpenAI Realtime] Microphone access granted");
      
      // Add microphone track to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Set up data channel for events
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;
      
      dc.onopen = () => {
        console.log("[OpenAI Realtime] Data channel open - ready for conversation");
      };

      dc.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerEvent(data);
        } catch (e) {
          console.error("[OpenAI Realtime] Failed to parse event:", e);
        }
      };

      dc.onclose = () => {
        console.log("[OpenAI Realtime] Data channel closed");
      };

      // Create SDP offer
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

      console.log("[OpenAI Realtime] Sending SDP to server...");

      // Send SDP to server, get answer back
      const response = await createWebRTCSession.mutateAsync({
        sdp: finalOffer.sdp,
        mode,
        voice: "coral",
      });

      if (!response.sdp) {
        throw new Error("Failed to get SDP answer from server");
      }

      console.log("[OpenAI Realtime] Got SDP answer, setting remote description...");

      // Set remote description with OpenAI's answer
      await pc.setRemoteDescription({
        type: "answer",
        sdp: response.sdp,
      });

      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      toast.success("🎤 Connected! AI Coach will speak through your headset");
      setTranscript(prev => [...prev, "🟢 Connected to AI Coach - speak now!"]);

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log("[OpenAI Realtime] Connection state:", pc.connectionState);
        if (pc.connectionState === "connected") {
          setIsConnected(true);
        } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          setIsConnected(false);
          setError("Connection lost");
          toast.error("Connection lost - please reconnect");
        }
      };

    } catch (err: any) {
      console.error("[OpenAI Realtime] Start error:", err);
      setError(err.message || "Failed to connect");
      setIsConnecting(false);
      toast.error(`Failed to start: ${err.message}`);
      endCall();
    }
  }, [mode, createWebRTCSession]);

  // Handle server events from data channel
  const handleServerEvent = useCallback((event: any) => {
    switch (event.type) {
      case "session.created":
        console.log("[OpenAI Realtime] Session created");
        setTranscript(prev => [...prev, "🎯 Session started - AI is listening..."]);
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
        setCurrentSpeaker("assistant");
        break;

      case "response.audio_transcript.done":
        const aiText = event.transcript;
        if (aiText && aiText.trim()) {
          setTranscript(prev => [...prev, `🤖 AI Coach: ${aiText}`]);
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
  }, []);

  // End voice call
  const endCall = useCallback(() => {
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
    setIsConnecting(false);
    setCurrentSpeaker(null);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle
      });
    }
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
  }, [isMuted]);

  // Toggle speaker
  const toggleSpeaker = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = isSpeakerOn;
    }
    setIsSpeakerOn(!isSpeakerOn);
    toast.info(isSpeakerOn ? "Speaker off" : "Speaker on");
  }, [isSpeakerOn]);

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">AI Voice Coach</h2>
              <p className="text-slate-400 text-sm">{getModeTitle()} - Real-time Conversation</p>
            </div>
          </div>
          <button 
            onClick={() => { endCall(); onClose?.(); }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isConnecting ? "bg-yellow-500/20 animate-pulse" :
            isConnected ? (currentSpeaker === "assistant" ? "bg-purple-500/30 animate-pulse" : 
                          currentSpeaker === "user" ? "bg-green-500/30 animate-pulse" : 
                          "bg-green-500/20") :
            "bg-slate-700"
          }`}>
            {isConnecting ? (
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            ) : isConnected ? (
              <Phone className="w-12 h-12 text-green-400" />
            ) : (
              <PhoneOff className="w-12 h-12 text-slate-500" />
            )}
          </div>
        </div>

        {/* Connection status */}
        <div className="text-center mb-6">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : isConnecting ? (
            <p className="text-yellow-400">Connecting to AI Coach...</p>
          ) : isConnected ? (
            <p className="text-green-400">
              {currentSpeaker === "assistant" ? "🔊 AI Coach is speaking..." : 
               currentSpeaker === "user" ? "🎤 Listening to you..." : 
               "✅ Connected - speak to your AI Coach"}
            </p>
          ) : (
            <p className="text-slate-400">Click 'Start Voice Call' to begin your coaching session</p>
          )}
        </div>

        {/* Transcript */}
        <div className="bg-slate-900/50 rounded-lg p-4 h-48 overflow-y-auto mb-6 border border-slate-700">
          {transcript.length === 0 ? (
            <p className="text-slate-500 text-center text-sm">
              Conversation will appear here...
            </p>
          ) : (
            transcript.map((line, i) => (
              <p key={i} className={`text-sm mb-2 ${
                line.startsWith("🎤") ? "text-blue-300" : 
                line.startsWith("🤖") ? "text-purple-300" : 
                "text-slate-400"
              }`}>
                {line}
              </p>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isConnected ? (
            <button
              onClick={startCall}
              disabled={isConnecting}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white rounded-full font-medium transition-colors"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  Start Voice Call
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-colors ${
                  isMuted ? "bg-red-600 hover:bg-red-500" : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
              </button>
              
              <button
                onClick={endCall}
                className="p-4 bg-red-600 hover:bg-red-500 rounded-full transition-colors"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={toggleSpeaker}
                className={`p-4 rounded-full transition-colors ${
                  !isSpeakerOn ? "bg-red-600 hover:bg-red-500" : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
              </button>
            </>
          )}
        </div>

        {/* Tip */}
        <p className="text-center text-slate-500 text-xs mt-4">
          💡 Make sure your headset is connected before starting
        </p>
      </div>
    </div>
  );
}

export default OpenAIVoiceCoach;
