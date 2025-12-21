/**
 * CLIENT RECOGNITION HOOK
 * 
 * Automatically recognizes returning clients using:
 * - Device ID (localStorage)
 * - Voice sample (first 3 seconds of speech)
 * - Face frame (if video enabled)
 * 
 * Provides personalized greeting based on confidence tier:
 * - 95%+: "Welcome back, Sarah!"
 * - 80-94%: "Sarah, is that you?"
 * - 60-79%: "I think we've talked before..."
 * - <60%: "Hi! What's your name?"
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";

// Get or create anonymous ID from localStorage
function getDeviceId(): string {
  const STORAGE_KEY = "purposeful_anonymous_id";
  let deviceId = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceId) {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    deviceId = \`anon_\${timestamp}_\${randomPart}\`;
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  
  return deviceId;
}

interface RecognitionResult {
  userId: number | null;
  userName: string | null;
  confidence: number;
  tier: "certain" | "likely" | "possible" | "unknown";
  method: "multi-modal" | "voice" | "face" | "device" | "behavioral" | "none";
  greeting: string;
  profileLoaded: boolean;
  lastTopic: string | null;
}

interface UseClientRecognitionOptions {
  enableVoice?: boolean;
  enableFace?: boolean;
  onRecognized?: (result: RecognitionResult) => void;
}

export function useClientRecognition(options: UseClientRecognitionOptions = {}) {
  const { enableVoice = true, enableFace = false, onRecognized } = options;
  
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const hasRecognized = useRef(false);
  const voiceSampleRef = useRef<string | null>(null);
  const faceSampleRef = useRef<string | null>(null);
  
  const recognizeMutation = trpc.clientRecognition.recognizeClient.useMutation();
  const confirmMutation = trpc.clientRecognition.confirmRecognition.useMutation();
  const denyMutation = trpc.clientRecognition.denyRecognition.useMutation();
  
  /**
   * Capture voice sample from microphone
   * Returns base64 encoded audio (first 3 seconds)
   */
  const captureVoiceSample = useCallback(async (): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      return new Promise((resolve) => {
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            // Remove data URL prefix
            const base64Data = base64.split(",")[1];
            resolve(base64Data);
          };
          reader.readAsDataURL(blob);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        
        // Stop after 3 seconds
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 3000);
      });
    } catch (err) {
      console.warn("[Recognition] Could not capture voice:", err);
      return null;
    }
  }, []);
  
  /**
   * Capture face frame from video
   * Returns base64 encoded image
   */
  const captureFaceFrame = useCallback(async (videoElement?: HTMLVideoElement): Promise<string | null> => {
    if (!videoElement) return null;
    
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      
      ctx.drawImage(videoElement, 0, 0);
      
      // Get base64 image (remove data URL prefix)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      return dataUrl.split(",")[1];
    } catch (err) {
      console.warn("[Recognition] Could not capture face:", err);
      return null;
    }
  }, []);
  
  /**
   * Run recognition with available signals
   */
  const recognize = useCallback(async (
    voiceSample?: string | null,
    faceFrame?: string | null
  ) => {
    if (hasRecognized.current) return;
    
    setIsRecognizing(true);
    setError(null);
    
    try {
      const deviceId = getDeviceId();
      
      const result = await recognizeMutation.mutateAsync({
        deviceId,
        voiceSample: voiceSample || undefined,
        faceFrame: faceFrame || undefined,
        sessionContext: {
          timeOfDay: new Date().toLocaleTimeString(),
          dayOfWeek: new Date().getDay(),
          platform: navigator.platform,
        },
      });
      
      hasRecognized.current = true;
      setRecognitionResult(result);
      onRecognized?.(result);
      
      return result;
    } catch (err) {
      console.error("[Recognition] Failed:", err);
      setError("Recognition failed");
      
      // Return unknown result on error
      const fallbackResult: RecognitionResult = {
        userId: null,
        userName: null,
        confidence: 0,
        tier: "unknown",
        method: "none",
        greeting: "Hey there 💜 I'm Sage. I'm genuinely glad you're here. What's your name?",
        profileLoaded: false,
        lastTopic: null,
      };
      
      setRecognitionResult(fallbackResult);
      onRecognized?.(fallbackResult);
      
      return fallbackResult;
    } finally {
      setIsRecognizing(false);
    }
  }, [recognizeMutation, onRecognized]);
  
  /**
   * Auto-recognize on mount (device ID only - instant)
   * Voice/face recognition happens when user starts speaking/video
   */
  useEffect(() => {
    if (!hasRecognized.current) {
      // Start with device-only recognition (instant)
      recognize(null, null);
    }
  }, [recognize]);
  
  /**
   * Confirm recognition - user says "Yes, that's me"
   */
  const confirmIdentity = useCallback(async () => {
    if (!recognitionResult?.userId) return;
    
    const deviceId = getDeviceId();
    
    await confirmMutation.mutateAsync({
      userId: recognitionResult.userId,
      deviceId,
      voiceSample: voiceSampleRef.current || undefined,
      faceFrame: faceSampleRef.current || undefined,
    });
  }, [recognitionResult, confirmMutation]);
  
  /**
   * Deny recognition - user says "No, I'm not [name]"
   */
  const denyIdentity = useCallback(async (correctName?: string) => {
    if (!recognitionResult?.userId) return;
    
    const deviceId = getDeviceId();
    
    const result = await denyMutation.mutateAsync({
      attemptedUserId: recognitionResult.userId,
      deviceId,
      correctName,
    });
    
    return result.message;
  }, [recognitionResult, denyMutation]);
  
  /**
   * Update recognition with voice sample
   * Called when user starts speaking
   */
  const updateWithVoice = useCallback(async (voiceSample: string) => {
    voiceSampleRef.current = voiceSample;
    
    // Re-run recognition with voice
    if (recognitionResult?.tier === "unknown" || recognitionResult?.tier === "possible") {
      await recognize(voiceSample, faceSampleRef.current);
    }
  }, [recognitionResult, recognize]);
  
  /**
   * Update recognition with face frame
   * Called when video is enabled
   */
  const updateWithFace = useCallback(async (faceFrame: string) => {
    faceSampleRef.current = faceFrame;
    
    // Re-run recognition with face
    if (recognitionResult?.tier === "unknown" || recognitionResult?.tier === "possible") {
      await recognize(voiceSampleRef.current, faceFrame);
    }
  }, [recognitionResult, recognize]);
  
  return {
    // State
    recognitionResult,
    isRecognizing,
    error,
    
    // Computed
    isRecognized: recognitionResult?.tier === "certain" || recognitionResult?.tier === "likely",
    greeting: recognitionResult?.greeting || "Hey there 💜 I'm Sage.",
    userName: recognitionResult?.userName,
    
    // Actions
    recognize,
    confirmIdentity,
    denyIdentity,
    updateWithVoice,
    updateWithFace,
    captureVoiceSample,
    captureFaceFrame,
  };
}
