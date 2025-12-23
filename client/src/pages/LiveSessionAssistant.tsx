import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Brain,
  Heart,
  TrendingUp,
  FileText,
  Lightbulb,
  Shield,
  Video,
  VideoOff,
  Settings,
  Volume2,
} from "lucide-react";
import { Streamdown } from "streamdown";

/**
 * Live Session AI Assistant
 * Real-time coaching guidance system
 * 
 * Features:
 * - Audio capture from session
 * - Real-time transcription
 * - Emotion detection
 * - Coaching prompt suggestions
 * - Compliance monitoring
 * - Auto-documentation
 */

interface TranscriptSegment {
  id: string;
  speaker: "client" | "coach";
  text: string;
  timestamp: Date;
  emotions?: string[];
  triggers?: string[];
}

interface CoachingPrompt {
  id: string;
  type: "suggestion" | "warning" | "insight";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  content: string;
  timestamp: Date;
}

interface SessionData {
  sessionId: number;
  clientId: number;
  clientName: string;
  sessionType: string;
  startTime: Date;
  duration: number;
}

export default function LiveSessionAssistant() {
  // Session state
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Audio/Video capture
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isTestingEquipment, setIsTestingEquipment] = useState(false);
  const [videoQuality, setVideoQuality] = useState<{resolution: string, fps: number} | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const clientVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Transcript
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // AI Analysis
  const [currentEmotions, setCurrentEmotions] = useState<string[]>([]);
  const [detectedTriggers, setDetectedTriggers] = useState<string[]>([]);
  const [coachingPrompts, setCoachingPrompts] = useState<CoachingPrompt[]>([]);

  // API mutations
  const uploadAudioMutation = trpc.audioUpload.uploadAudioChunk.useMutation();
  const uploadVideoMutation = trpc.videoUpload.uploadSessionRecording.useMutation();

  // Session notes
  const [sessionNotes, setSessionNotes] = useState("");
  const [keyInsights, setKeyInsights] = useState<string[]>([]);

  // Refs for auto-scroll
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const promptsEndRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    if (sessionStartTime && isRecording) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sessionStartTime, isRecording]);

   // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper: Convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Client recognition state
  const [recognizedClient, setRecognizedClient] = useState<{id: number, name: string, confidence: number} | null>(null);
  const [recognitionAttempted, setRecognitionAttempted] = useState(false);
  
  // Test equipment before session
  const testEquipment = async () => {
    try {
      setIsTestingEquipment(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      setMediaStream(stream);
      
      // Attach stream to video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Get video quality info
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        setVideoQuality({
          resolution: `${settings.width}x${settings.height}`,
          fps: settings.frameRate || 30
        });
      }
      
      // Setup audio level monitoring
      setupAudioMonitoring(stream);
      
      toast.success("Equipment test successful!", {
        description: "Camera and microphone are working properly"
      });
    } catch (error: any) {
      console.error("Equipment test failed:", error);
      
      // Provide specific error messages based on error type
      if (error.name === 'NotFoundError') {
        toast.error('Camera or microphone not found', {
          description: 'Please connect your devices and refresh the page'
        });
      } else if (error.name === 'NotAllowedError') {
        toast.error('Permission denied', {
          description: 'Please allow camera and microphone access in your browser'
        });
      } else if (error.name === 'NotReadableError') {
        toast.error('Device in use', {
          description: 'Close other apps using your camera or microphone'
        });
      } else if (error.name === 'OverconstrainedError') {
        toast.error('Device constraints not supported', {
          description: 'Your camera may not support the requested resolution'
        });
      } else {
        toast.error('Equipment test failed', {
          description: error.message || 'Please check camera and microphone permissions'
        });
      }
      
      setIsTestingEquipment(false);
    }
  };
  
  // Setup audio level monitoring
  const setupAudioMonitoring = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Monitor audio levels continuously
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let animationId: number;
      
      const monitorAudio = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedLevel = Math.min(100, (average / 255) * 100);
        setAudioLevel(normalizedLevel);
        
        // Continue monitoring as long as analyser exists
        animationId = requestAnimationFrame(monitorAudio);
      };
      
      monitorAudio();
    } catch (error) {
      console.error("Audio monitoring setup failed:", error);
    }
  };
  
  // Stop equipment test
  const stopEquipmentTest = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsTestingEquipment(false);
    setVideoQuality(null);
    setAudioLevel(0);
    toast.info("Equipment test stopped");
  };
  
  // Toggle video during session
  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
        toast.info(videoTrack.enabled ? "Video enabled" : "Video disabled");
      }
    }
  };
  
  // Toggle audio during session
  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        toast.info(audioTrack.enabled ? "Microphone enabled" : "Microphone muted");
      }
    }
  };

  // Session creation mutation
  const createSessionMutation = trpc.liveSession.createSession.useMutation();
  
  // Voice recognition mutation
  const identifyByVoice = trpc.voiceRecognition.identifyClient.useMutation();
  
  // Face recognition mutation (when video is enabled)
  const identifyByFace = trpc.faceRecognition.identifyClient.useMutation();

  // Start audio capture
  const startRecording = async () => {
    try {
      // Check for available devices first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === 'videoinput');
      const mics = devices.filter(d => d.kind === 'audioinput');

      if (cameras.length === 0) {
        toast.error('No camera found', {
          description: 'Please connect a camera and refresh the page'
        });
        return;
      }

      if (mics.length === 0) {
        toast.error('No microphone found', {
          description: 'Please connect a microphone and refresh the page'
        });
        return;
      }

      // Create session in database first
      const session = await createSessionMutation.mutateAsync({
        clientId: recognizedClient?.id,
        clientName: recognizedClient?.name || 'Unknown Client',
        sessionType: 'coaching'
      });

      // Set session data with REAL session ID
      setSessionData({
        sessionId: session.sessionId,
        clientId: session.clientId || 0,
        clientName: session.clientName,
        sessionType: session.sessionType || 'coaching',
        startTime: new Date(session.startTime),
        duration: 0
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      setMediaStream(stream);
      
      // Attach stream to video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // VOICE RECOGNITION: Capture first 5 seconds for identification
      if (!recognitionAttempted) {
        setTimeout(async () => {
          try {
            // Get first audio chunk for voice recognition
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioBase64 = await blobToBase64(audioBlob);
            
            const result = await identifyByVoice.mutateAsync({ audioData: audioBase64 });
            
            if (result.identified && result.client) {
              setRecognizedClient({
                id: result.client.id,
                name: result.client.name,
                confidence: result.confidence
              });
              
              toast.success(`Welcome back, ${result.client.name}! 👋`, {
                description: `Recognized with ${Math.round(result.confidence * 100)}% confidence`
              });
              
              // Load client profile
              setSessionData({
                sessionId: 0,
                clientId: result.client.id,
                clientName: result.client.name,
                sessionType: 'coaching',
                startTime: new Date(),
                duration: 0
              });
            } else {
              toast.warning('Client not recognized', {
                description: 'Please verify client identity manually'
              });
            }
            
            setRecognitionAttempted(true);
          } catch (error) {
            console.error('Voice recognition failed:', error);
            toast.error('Voice recognition unavailable');
          }
        }, 5000); // Wait 5 seconds to collect voice sample
      }
      
      // Check for supported mimeType
      let mimeType = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8,opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            throw new Error("No supported video format found");
          }
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // VOICE RECOGNITION: Use first audio chunk for client identification
          if (!recognitionAttempted && audioChunksRef.current.length === 1) {
            try {
              const audioBlob = new Blob([event.data], { type: 'audio/webm' });
              const audioBase64 = await blobToBase64(audioBlob);
              
              const result = await identifyByVoice.mutateAsync({ audioData: audioBase64 });
              
              if (result.identified && result.client) {
                setRecognizedClient({
                  id: result.client.id,
                  name: result.client.name,
                  confidence: result.confidence
                });
                
                toast.success(`Welcome back, ${result.client.name}! 👋`, {
                  description: `Recognized with ${Math.round(result.confidence * 100)}% confidence`
                });
                
                // Update session with recognized client
                if (sessionData) {
                  setSessionData({
                    ...sessionData,
                    clientId: result.client.id,
                    clientName: result.client.name,
                  });
                }
              } else {
                toast.warning('Client not recognized', {
                  description: 'Please verify client identity manually'
                });
              }
              
              setRecognitionAttempted(true);
            } catch (error) {
              console.error('Voice recognition failed:', error);
              toast.error('Voice recognition unavailable');
              setRecognitionAttempted(true);
            }
          }
          
          // Process audio chunk for transcription
          processAudioChunk(event.data);
        }
      };

      // CRITICAL: Save recording when stopped
      mediaRecorder.onstop = async () => {
        try {
          if (!sessionData) {
            console.error('No session data available');
            toast.error('Failed to save recording: No session data');
            return;
          }

          if (audioChunksRef.current.length === 0) {
            console.warn('No recording data to save');
            return;
          }

          toast.info('Saving session recording...', { duration: Infinity });

          // Combine all chunks into single video file
          const videoBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const videoBase64 = await blobToBase64(videoBlob);

          // Calculate duration
          const duration = sessionStartTime 
            ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)
            : 0;

          // Upload to S3
          const result = await uploadVideoMutation.mutateAsync({
            sessionId: sessionData.sessionId,
            videoData: videoBase64,
            mimeType,
            duration,
            fileSize: videoBlob.size,
          });

          toast.success('Session recording saved!', {
            description: `${Math.round(videoBlob.size / 1024 / 1024)}MB saved to cloud storage`,
            action: {
              label: 'Download',
              onClick: () => {
                const url = URL.createObjectURL(videoBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `session-${sessionData.sessionId}-${new Date().toISOString()}.webm`;
                a.click();
                URL.revokeObjectURL(url);
              },
            },
          });

          // Clear chunks
          audioChunksRef.current = [];
        } catch (error: any) {
          console.error('Failed to save recording:', error);
          toast.error('Failed to save recording', {
            description: error.message || 'Please try again or download manually',
          });
        }
      };

      mediaRecorder.start(5000); // Capture 5-second chunks
      setIsRecording(true);
      setSessionStartTime(new Date());
      
      // Setup audio level monitoring
      setupAudioMonitoring(stream);
      
      toast.success("Session recording started");
    } catch (error: any) {
      console.error("Failed to start recording:", error);
      
      // Provide specific error messages
      if (error.name === 'NotFoundError') {
        toast.error('Camera or microphone not found', {
          description: 'Please connect your devices and refresh the page'
        });
      } else if (error.name === 'NotAllowedError') {
        toast.error('Permission denied', {
          description: 'Please allow camera and microphone access in your browser'
        });
      } else if (error.name === 'NotReadableError') {
        toast.error('Device in use', {
          description: 'Close other apps using your camera or microphone'
        });
      } else {
        toast.error('Failed to start recording', {
          description: error.message || 'Please check your camera and microphone'
        });
      }
    }
  };

  // Stop audio capture
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    
    // Clear video preview
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsRecording(false);
    toast.info("Session recording stopped");
    
    // Generate session summary
    generateSessionSummary();
  };

  // Process audio chunk for transcription
  const processAudioChunk = async (audioBlob: Blob) => {
    if (!sessionData) {
      console.error("No session data available");
      return;
    }

    setIsTranscribing(true);
    
    try {
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');

      // Upload audio to storage
      const uploadResult = await trpc.audioUpload.uploadAudioChunk.mutate({
        sessionId: sessionData.sessionId,
        audioData: base64Audio,
        mimeType: audioBlob.type,
      });

      // Transcribe audio using the uploaded URL
      await transcribeMutation.mutateAsync({
        sessionId: sessionData.sessionId,
        audioUrl: uploadResult.audioUrl,
        speaker: "client", // TODO: Add speaker detection
      });
    } catch (error) {
      console.error("Audio processing error:", error);
      toast.error("Failed to process audio");
    } finally {
      setIsTranscribing(false);
    }
  };

  // Play audio guidance in coach headset
  const playCoachAudio = async (text: string) => {
    try {
      const result = await trpc.tts.generateSpeech.mutate({
        text,
        voice: "nova", // Calm, professional female voice
        speed: 1.1, // Slightly faster for real-time guidance
      });

      // Convert base64 to audio and play
      const audioData = atob(result.audioData);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      const audioBlob = new Blob([arrayBuffer], { type: result.mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Play in coach headset (right channel if stereo)
      audio.play();
      
      // Clean up
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error("Failed to play coach audio:", error);
      // Silently fail - don't disrupt session
    }
  };

  // tRPC mutations
  const transcribeMutation = trpc.liveSession.transcribeAudio.useMutation({
    onSuccess: async (data) => {
      // Add to transcript
      const newSegment: TranscriptSegment = {
        id: `seg-${Date.now()}`,
        speaker: "client", // TODO: Detect speaker
        text: data.text,
        timestamp: new Date(),
      };
      
      setTranscript((prev) => [...prev, newSegment]);
      
      // Analyze segment
      await analyzeSegmentMutation.mutateAsync({
        sessionId: sessionData!.sessionId,
        transcriptText: data.text,
        speaker: "client",
      });
    },
    onError: (error) => {
      console.error("Transcription error:", error);
      toast.error("Failed to transcribe audio");
    },
  });

  const analyzeSegmentMutation = trpc.liveSession.analyzeSegment.useMutation({
    onSuccess: (data) => {
      // Update emotions
      if (data.analysis.emotions.length > 0) {
        setCurrentEmotions(data.analysis.emotions);
      }
      
      // Update triggers
      if (data.analysis.triggers.length > 0) {
        setDetectedTriggers((prev) => {
          const combined = [...prev, ...data.analysis.triggers];
          return Array.from(new Set(combined));
        });
      }
      
      // Add coaching prompts
      if (data.prompts.length > 0) {
        const newPrompts: CoachingPrompt[] = data.prompts.map((p: any) => ({
          id: `prompt-${Date.now()}-${Math.random()}`,
          type: p.type,
          priority: p.priority,
          title: p.title,
          content: p.content,
          timestamp: new Date(),
        }));
        setCoachingPrompts((prev) => [...prev, ...newPrompts]);
        
        // Play audio for high/critical priority prompts in coach headset
        const urgentPrompts = newPrompts.filter(p => 
          p.priority === 'high' || p.priority === 'critical'
        );
        if (urgentPrompts.length > 0) {
          playCoachAudio(urgentPrompts[0].content);
        }
      }
    },
  });

  const generateSummaryMutation = trpc.liveSession.generateSessionSummary.useMutation({
    onSuccess: (data) => {
      // Parse summary into key insights
      const summaryText = typeof data.summary === 'string' ? data.summary : '';
      const insights = summaryText.split("\n").filter((line: string) => line.trim());
      setKeyInsights(insights.slice(0, 5)); // Take first 5 lines as key insights
    },
  });

  // Process audio chunk for transcription
  const simulateTranscription = async (audioBlob: Blob) => {
    if (!sessionData) {
      console.error("No session data available");
      return;
    }

    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Upload audio to S3
      const uploadResult = await uploadAudioMutation.mutateAsync({
        sessionId: sessionData.sessionId,
        audioData: audioBase64,
        mimeType: audioBlob.type,
      });
      
      const audioUrl = uploadResult.audioUrl;
      
      // Call transcription
      await transcribeMutation.mutateAsync({
        sessionId: sessionData.sessionId,
        audioUrl,
        speaker: "client",
      });
    } catch (error) {
      console.error("Failed to process audio chunk:", error);
    }
  };

  // Analyze transcript segment for emotions and triggers
  const analyzeSegment = async (text: string) => {
    // TODO: Call AI analysis API
    // For now, simple keyword detection
    const emotions: string[] = [];
    const triggers: string[] = [];

    // Emotion keywords
    if (/anxious|worried|nervous|scared/i.test(text)) emotions.push("anxiety");
    if (/sad|depressed|down|hopeless/i.test(text)) emotions.push("sadness");
    if (/angry|frustrated|mad|annoyed/i.test(text)) emotions.push("anger");
    if (/happy|excited|great|wonderful/i.test(text)) emotions.push("joy");

    // Trigger keywords
    if (/work|job|boss|colleague/i.test(text)) triggers.push("work");
    if (/family|parent|sibling|child/i.test(text)) triggers.push("family");
    if (/relationship|partner|spouse|dating/i.test(text)) triggers.push("relationships");
    if (/money|financial|debt|bills/i.test(text)) triggers.push("finances");

    return { emotions, triggers };
  };

  // Generate coaching prompts based on analysis
  const generateCoachingPrompt = (segment: TranscriptSegment) => {
    const prompts: CoachingPrompt[] = [];

    // Emotion-based prompts
    if (segment.emotions?.includes("anxiety")) {
      prompts.push({
        id: `prompt-${Date.now()}-1`,
        type: "suggestion",
        priority: "medium",
        title: "Anxiety Detected",
        content: "Consider introducing a grounding technique. Ask: 'Can you describe what you're feeling in your body right now?'",
        timestamp: new Date(),
      });
    }

    if (segment.emotions?.includes("sadness")) {
      prompts.push({
        id: `prompt-${Date.now()}-2`,
        type: "suggestion",
        priority: "medium",
        title: "Sadness Detected",
        content: "Validate their feelings. Say: 'It sounds like you're going through a really difficult time. That must be hard.'",
        timestamp: new Date(),
      });
    }

    // Trigger-based prompts
    if (segment.triggers?.includes("work")) {
      prompts.push({
        id: `prompt-${Date.now()}-3`,
        type: "insight",
        priority: "low",
        title: "Work Stress Pattern",
        content: "Client mentioned work stress 3 times this session. Consider exploring work-life balance strategies.",
        timestamp: new Date(),
      });
    }

    // Compliance warnings
    if (/diagnose|medication|prescription/i.test(segment.text)) {
      prompts.push({
        id: `prompt-${Date.now()}-4`,
        type: "warning",
        priority: "critical",
        title: "Compliance Alert",
        content: "⚠️ Medical advice detected. Remind client: 'I'm a coach, not a doctor. For medical concerns, please consult with a healthcare professional.'",
        timestamp: new Date(),
      });
    }

    return prompts;
  };

  // Generate session summary
  const generateSessionSummary = async () => {
    if (!sessionData) {
      toast.error("No session data available");
      return;
    }

    toast.info("Generating session summary...");
    
    try {
      await generateSummaryMutation.mutateAsync({
        sessionId: sessionData.sessionId,
      });
      toast.success("Session summary generated!");
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast.error("Failed to generate session summary");
    }
  };

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Auto-scroll prompts
  useEffect(() => {
    promptsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coachingPrompts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              Live Session AI Assistant
            </h1>
            <p className="text-gray-600 mt-1">Real-time coaching guidance & documentation</p>
            {recognizedClient && (
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">
                  <User className="h-3 w-3 mr-1" />
                  {recognizedClient.name}
                </Badge>
                <span className="text-sm text-gray-500">
                  Recognized with {Math.round(recognizedClient.confidence * 100)}% confidence
                </span>
              </div>
            )}
          </div>
          
          {/* Session Timer */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-gray-600" />
                <div>
                  <div className="text-2xl font-bold font-mono">{formatTime(elapsedTime)}</div>
                  <div className="text-sm text-gray-600">Session Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transcript */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Preview & Equipment Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Video Preview</span>
                {videoQuality && (
                  <Badge variant="outline">
                    {videoQuality.resolution} @ {videoQuality.fps}fps
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Video Preview */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!mediaStream && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Camera preview will appear here</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Controls Overlay */}
                  {mediaStream && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        size="sm"
                        variant={videoEnabled ? "default" : "destructive"}
                        onClick={toggleVideo}
                      >
                        {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={audioEnabled ? "default" : "destructive"}
                        onClick={toggleAudio}
                      >
                        {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Audio Level Indicator */}
                {mediaStream && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Audio Level
                      </span>
                      <span className="font-mono">{Math.round(audioLevel)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-100 ${
                          audioLevel > 70 ? 'bg-green-500' : audioLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${audioLevel}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Equipment Test / Recording Controls */}
                <div className="flex gap-2">
                  {!isRecording && !isTestingEquipment && (
                    <>
                      <Button
                        onClick={testEquipment}
                        variant="outline"
                        className="flex-1"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Test Equipment
                      </Button>
                      <Button
                        onClick={startRecording}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Session
                      </Button>
                    </>
                  )}
                  
                  {isTestingEquipment && (
                    <Button
                      onClick={stopEquipmentTest}
                      variant="outline"
                      className="flex-1"
                    >
                      Stop Test
                    </Button>
                  )}
                  
                  {isRecording && (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      End Session
                    </Button>
                  )}
                </div>
                
                {isRecording && (
                  <Badge variant="destructive" className="w-full justify-center animate-pulse">
                    <Mic className="h-3 w-3 mr-1" />
                    Recording in Progress
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Transcript */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Transcript</span>
                {isTranscribing && (
                  <Badge variant="outline">
                    Transcribing...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start recording to see live transcript</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {transcript.map((segment) => (
                    <div
                      key={segment.id}
                      className={`p-4 rounded-lg ${
                        segment.speaker === "client"
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "bg-green-50 border-l-4 border-green-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-semibold">
                          {segment.speaker === "client" ? "Client" : "You"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {segment.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{segment.text}</p>
                      {segment.emotions && segment.emotions.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {segment.emotions.map((emotion) => (
                            <Badge key={emotion} variant="secondary">
                              <Heart className="h-3 w-3 mr-1" />
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Guidance */}
        <div className="space-y-6">
          {/* Current Emotions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Current Emotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentEmotions.length === 0 ? (
                <p className="text-gray-500 text-sm">No emotions detected yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentEmotions.map((emotion) => (
                    <Badge key={emotion} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detected Triggers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Detected Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {detectedTriggers.length === 0 ? (
                <p className="text-gray-500 text-sm">No triggers detected yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {detectedTriggers.map((trigger) => (
                    <Badge key={trigger} variant="outline">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coaching Scripts - Enhanced for Real-Time Reading */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  AI Coaching Scripts
                </div>
                <Badge variant="secondary">{coachingPrompts.length} scripts</Badge>
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Scroll back anytime to find the exact phrase you need
              </p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4">
              {coachingPrompts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">AI will generate full scripts during the session</p>
                    <p className="text-xs mt-2 text-gray-400">
                      You can pause, scroll back, and read word-for-word
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {coachingPrompts.map((prompt, index) => (
                    <div
                      key={prompt.id}
                      className={`p-4 rounded-lg border-l-4 shadow-sm ${
                        prompt.priority === "critical"
                          ? "bg-red-50 border-red-500"
                          : prompt.priority === "high"
                          ? "bg-orange-50 border-orange-500"
                          : prompt.priority === "medium"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      {/* Header with timestamp and priority */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {prompt.type === "warning" ? (
                            <Shield className="h-4 w-4 text-red-600" />
                          ) : prompt.type === "insight" ? (
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="font-semibold text-sm">{prompt.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Full Script - Large, Readable */}
                      <div className="bg-white p-3 rounded border border-gray-200 mb-2">
                        <p className="text-base leading-relaxed text-gray-900">
                          {prompt.content}
                        </p>
                      </div>

                      {/* Technique Badge */}
                      {prompt.technique && (
                        <Badge variant="outline" className="text-xs">
                          {prompt.technique}
                        </Badge>
                      )}
                    </div>
                  ))}
                  <div ref={promptsEndRef} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Quick Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add quick notes during the session..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Insights (shown after session ends) */}
      {keyInsights.length > 0 && (
        <div className="max-w-7xl mx-auto mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
