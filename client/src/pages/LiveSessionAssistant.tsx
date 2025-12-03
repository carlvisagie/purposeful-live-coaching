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

  // Audio capture
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Transcript
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // AI Analysis
  const [currentEmotions, setCurrentEmotions] = useState<string[]>([]);
  const [detectedTriggers, setDetectedTriggers] = useState<string[]>([]);
  const [coachingPrompts, setCoachingPrompts] = useState<CoachingPrompt[]>([]);

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

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start audio capture
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      setAudioStream(stream);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          // Process audio chunk for transcription
          processAudioChunk(event.data);
        }
      };

      mediaRecorder.start(5000); // Capture 5-second chunks
      setIsRecording(true);
      setSessionStartTime(new Date());
      
      toast.success("Session recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  // Stop audio capture
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }

    setIsRecording(false);
    toast.info("Session recording stopped");
    
    // Generate session summary
    generateSessionSummary();
  };

  // Process audio chunk for transcription
  const processAudioChunk = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // TODO: Integrate with speech-to-text API
      // For now, simulate transcription
      await simulateTranscription(audioBlob);
    } catch (error) {
      console.error("Transcription error:", error);
    } finally {
      setIsTranscribing(false);
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
      // Upload audio to S3 first
      const formData = new FormData();
      formData.append("file", audioBlob, "audio-chunk.webm");
      
      // TODO: Upload to S3 and get URL
      // For now, use a placeholder
      const audioUrl = "https://placeholder-audio-url.com/chunk.webm";
      
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
          {/* Recording Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Session Recording</span>
                {isRecording && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Mic className="h-3 w-3 mr-1" />
                    Recording
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Session
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    variant="destructive"
                    className="flex-1"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    End Session
                  </Button>
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

          {/* Coaching Prompts */}
          <Card className="h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Coaching Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {coachingPrompts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">AI will suggest coaching prompts during the session</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {coachingPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        prompt.priority === "critical"
                          ? "bg-red-50 border-red-500"
                          : prompt.priority === "high"
                          ? "bg-orange-50 border-orange-500"
                          : prompt.priority === "medium"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {prompt.type === "warning" ? (
                          <Shield className="h-4 w-4 text-red-600" />
                        ) : prompt.type === "insight" ? (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="font-semibold text-sm">{prompt.title}</span>
                      </div>
                      <p className="text-sm text-gray-700">{prompt.content}</p>
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
