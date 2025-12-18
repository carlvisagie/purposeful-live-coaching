import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  Square,
  RotateCcw,
  ChevronRight,
  Eye,
  Smile,
  User,
  Hand,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  Target,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Music,
  Briefcase,
  BookOpen,
  Zap,
  Brain,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAISessionCoPilot, CoPilotStatusIndicator, CoPilotInsight } from "@/components/AISessionCoPilot";

/**
 * SPEAKER TRAINING MODE
 * 
 * AI-powered personal speaking coach that watches and provides real-time
 * feedback to transform users into powerful, authoritative speakers.
 * 
 * MODES:
 * - Free Practice: Just talk, get feedback
 * - Storytelling: Practice narrative delivery
 * - Coaching: Rehearse client sessions
 * - Presentation: Formal speech practice
 * - Impromptu: Random prompts to think on feet
 * - Interview: Aviation maintenance manager interview prep
 * - Singing: Voice coaching for singers
 */

type TrainingMode = "free_practice" | "storytelling" | "coaching" | "presentation" | "impromptu" | "interview" | "singing";

interface VisualScore {
  eyeContact: number;
  facialExpression: number;
  posture: number;
  gestures: number;
  presence: number;
}

interface LiveFeedback {
  visual: {
    eyeContact: { score: number; issue: string | null; tip: string };
    facialExpression: { score: number; expressiveness: string; issue: string | null; tip: string };
    posture: { score: number; description: string; issue: string | null; tip: string };
    gestures: { score: number; type: string; issue: string | null; tip: string };
    presence: { score: number; level: string; issue: string | null; tip: string };
  };
  immediateCorrection: string | null;
  encouragement: string | null;
}

const MODE_CONFIG: Record<TrainingMode, {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}> = {
  free_practice: {
    title: "Free Practice",
    description: "Just talk and get real-time feedback",
    icon: <Mic className="h-5 w-5" />,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-cyan-500",
  },
  storytelling: {
    title: "Storytelling",
    description: "Master the art of captivating narratives",
    icon: <BookOpen className="h-5 w-5" />,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-pink-500",
  },
  coaching: {
    title: "Coaching Scripts",
    description: "Practice client session delivery",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "text-green-600",
    bgGradient: "from-green-500 to-emerald-500",
  },
  presentation: {
    title: "Presentation",
    description: "Deliver powerful presentations",
    icon: <Target className="h-5 w-5" />,
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-500",
  },
  impromptu: {
    title: "Impromptu",
    description: "Think on your feet with random prompts",
    icon: <Zap className="h-5 w-5" />,
    color: "text-yellow-600",
    bgGradient: "from-yellow-500 to-orange-500",
  },
  interview: {
    title: "Interview Prep",
    description: "Senior Maintenance Manager interview",
    icon: <Briefcase className="h-5 w-5" />,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500 to-blue-500",
  },
  singing: {
    title: "Singing Coach",
    description: "Improve your vocal performance",
    icon: <Music className="h-5 w-5" />,
    color: "text-pink-600",
    bgGradient: "from-pink-500 to-rose-500",
  },
};

interface SpeakerTrainingProps {
  onClose?: () => void;
  className?: string;
}

export default function SpeakerTraining({ onClose, className = "" }: SpeakerTrainingProps) {
  // State
  const [selectedMode, setSelectedMode] = useState<TrainingMode | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // AI speaks through headset
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechQueueRef = useRef<string[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  
  // Media state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Feedback state
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback | null>(null);
  const [visualScores, setVisualScores] = useState<VisualScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentCorrection, setCurrentCorrection] = useState<string | null>(null);
  const [currentEncouragement, setCurrentEncouragement] = useState<string | null>(null);
  
  // Session summary
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  
  // AI Co-Pilot insights
  const [coPilotInsights, setCoPilotInsights] = useState<CoPilotInsight[]>([]);
  const [transcripts, setTranscripts] = useState<{text: string; speaker: string; time: Date}[]>([]);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // AI Session Co-Pilot - REAL-TIME VOICE COACHING
  // This automatically connects when session starts and provides instant voice feedback
  const coPilot = useAISessionCoPilot({
    mode: selectedMode === "interview" ? "interview_prep" : "speaker_training",
    isActive: isSessionActive && voiceEnabled,
    videoRef,
    onInsight: (insight) => {
      setCoPilotInsights(prev => [...prev.slice(-20), insight]);
      // Show warnings and crisis alerts prominently
      if (insight.type === "warning") {
        setCurrentCorrection(insight.message);
        setTimeout(() => setCurrentCorrection(null), 5000);
      } else if (insight.type === "crisis") {
        toast.error(`🚨 ${insight.message}`, { duration: 10000 });
      } else if (insight.type === "encouragement") {
        setCurrentEncouragement(insight.message);
        setTimeout(() => setCurrentEncouragement(null), 3000);
      }
    },
    onTranscript: (text, speaker) => {
      setTranscripts(prev => [...prev.slice(-50), { text, speaker, time: new Date() }]);
    },
  });

  // TTS mutation for AI voice output (backup - Vapi handles primary voice)
  const ttsMutation = trpc.tts.generateSpeech.useMutation({
    onSuccess: async (data) => {
      if (data.audioData && voiceEnabled) {
        try {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
            { type: data.mimeType }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (!audioRef.current) {
            audioRef.current = new Audio();
          }
          
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            // Process next in queue
            if (speechQueueRef.current.length > 0) {
              const nextText = speechQueueRef.current.shift();
              if (nextText) speakText(nextText);
            }
          };
          
          setIsSpeaking(true);
          await audioRef.current.play();
        } catch (error) {
          console.error('Audio playback error:', error);
          setIsSpeaking(false);
        }
      }
    },
  });

  // Fallback to browser speech synthesis
  const speakWithBrowserTTS = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      // Try to find a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Process next in queue
        if (speechQueueRef.current.length > 0) {
          const nextText = speechQueueRef.current.shift();
          if (nextText) speakText(nextText);
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Speak text through headset
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !text) return;
    
    if (isSpeaking) {
      // Queue if already speaking
      speechQueueRef.current.push(text);
      return;
    }
    
    // Try OpenAI TTS first, fallback to browser
    ttsMutation.mutate(
      {
        text,
        voice: "nova", // Warm, professional female voice
        speed: 1.0,
      },
      {
        onError: () => {
          // Fallback to browser speech synthesis
          console.log('TTS API failed, using browser fallback');
          speakWithBrowserTTS(text);
        },
      }
    );
  }, [voiceEnabled, isSpeaking, ttsMutation, speakWithBrowserTTS]);
  
  // tRPC mutations
  const getPromptQuery = trpc.speakerTraining.getTrainingPrompt.useQuery(
    { mode: selectedMode as any },
    { enabled: false }
  );
  
  const analyzePresenceMutation = trpc.speakerTraining.analyzePresence.useMutation({
    onSuccess: (data) => {
      console.log('[AI Coach] Analysis result:', data);
      setLiveFeedback(data as LiveFeedback);
      if (data.visual) {
        setVisualScores(prev => [...prev, {
          eyeContact: data.visual.eyeContact.score,
          facialExpression: data.visual.facialExpression.score,
          posture: data.visual.posture.score,
          gestures: data.visual.gestures.score,
          presence: data.visual.presence.score,
        }]);
      }
      
      // ALWAYS speak something after analysis
      if (data.immediateCorrection) {
        setCurrentCorrection(data.immediateCorrection);
        speakText(data.immediateCorrection);
        setTimeout(() => setCurrentCorrection(null), 5000);
      } else if (data.encouragement) {
        setCurrentEncouragement(data.encouragement);
        speakText(data.encouragement);
        setTimeout(() => setCurrentEncouragement(null), 4000);
      } else {
        // Fallback - always say something
        const fallbacks = [
          "Good, keep going.",
          "I'm watching. Stay focused.",
          "Keep your energy up.",
          "You're doing well. Continue.",
          "Stay present. I'm here.",
        ];
        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        speakText(randomFallback);
      }
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error('[AI Coach] Analysis failed:', error);
      setIsAnalyzing(false);
      // Still speak on error so user knows system is trying
      speakText("Analysis in progress. Keep practicing.");
    },
  });
  
  const getSessionSummaryMutation = trpc.speakerTraining.getSessionSummary.useMutation({
    onSuccess: (data) => {
      setSessionSummary(data);
      setShowSummary(true);
    },
  });

  // Capture video frame
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;
    
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0) return null;
    
    canvas.width = 640;
    canvas.height = 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    return dataUrl.split(',')[1];
  }, []);

  // Run analysis
  const runAnalysis = useCallback(async () => {
    if (!isSessionActive || isPaused || isAnalyzing || !selectedMode) return;
    
    const frameBase64 = captureFrame();
    if (!frameBase64) return;
    
    setIsAnalyzing(true);
    
    try {
      await analyzePresenceMutation.mutateAsync({
        frameBase64,
        mode: selectedMode,
        sessionDuration,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
    }
  }, [isSessionActive, isPaused, isAnalyzing, selectedMode, sessionDuration, captureFrame]);

  // Start media
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (error: any) {
      toast.error(`Camera/Microphone access failed: ${error.message}`);
      return false;
    }
  };

  // Stop media
  const stopMedia = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start session
  const startSession = async () => {
    if (!selectedMode) return;
    
    const mediaStarted = await startMedia();
    if (!mediaStarted) return;
    
    // Get prompt if not free practice
    if (selectedMode !== "free_practice") {
      const result = await getPromptQuery.refetch();
      if (result.data) {
        setCurrentPrompt(result.data.prompt);
        setTips(result.data.tips);
      }
    }
    
    setIsSessionActive(true);
    setSessionDuration(0);
    setVisualScores([]);
    setLiveFeedback(null);
    
    // Greet user through headset
    const modeTitle = MODE_CONFIG[selectedMode]?.title || "practice";
    speakText(`Starting ${modeTitle} session. I'm watching and listening. Let's begin.`);
    
    // If there's a prompt, speak it after greeting
    if (selectedMode !== "free_practice") {
      setTimeout(() => {
        if (currentPrompt) {
          speakText(`Your prompt is: ${currentPrompt}`);
        }
      }, 3000);
    }
    
    // Start timer
    timerRef.current = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    
    // Start analysis every 4 seconds
    analysisIntervalRef.current = setInterval(() => {
      runAnalysis();
    }, 4000);
    
    // Initial analysis after 2 seconds
    setTimeout(runAnalysis, 2000);
    
    toast.success("Session started! AI is watching...");
  };

  // Stop session
  const stopSession = async () => {
    setIsSessionActive(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    stopMedia();
    
    // Get session summary
    if (visualScores.length > 0 && selectedMode) {
      await getSessionSummaryMutation.mutateAsync({
        mode: selectedMode,
        duration: sessionDuration,
        visualScores,
      });
    }
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      toast.info("Session resumed");
    } else {
      toast.info("Session paused");
    }
  };

  // Get new prompt
  const getNewPrompt = async () => {
    if (!selectedMode || selectedMode === "free_practice") return;
    
    const result = await getPromptQuery.refetch();
    if (result.data) {
      setCurrentPrompt(result.data.prompt);
      toast.success("New prompt loaded!");
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate average score
  const getAverageScore = (scores: VisualScore[]): number => {
    if (scores.length === 0) return 0;
    const avg = scores.reduce((acc, s) => {
      return acc + (s.eyeContact + s.facialExpression + s.posture + s.gestures + s.presence) / 5;
    }, 0) / scores.length;
    return Math.round(avg);
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Get score bg
  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMedia();
      if (timerRef.current) clearInterval(timerRef.current);
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    };
  }, []);

  // Run analysis when conditions change
  useEffect(() => {
    if (isSessionActive && !isPaused && !isAnalyzing) {
      // Analysis is handled by interval
    }
  }, [isSessionActive, isPaused, isAnalyzing]);

  // Mode selection screen
  if (!selectedMode) {
    return (
      <Card className={`border-2 border-purple-200 shadow-xl ${className}`}>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-6 w-6" />
                Speaker Training Mode
              </CardTitle>
              <CardDescription className="text-white/80 mt-1">
                AI-powered coaching to transform your presence
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Choose Your Training Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(MODE_CONFIG) as [TrainingMode, typeof MODE_CONFIG[TrainingMode]][]).map(([mode, config]) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all text-left group hover:shadow-lg`}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${config.bgGradient} text-white mb-3`}>
                  {config.icon}
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {config.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{config.description}</p>
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              What AI Analyzes
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span>Eye Contact</span>
              </div>
              <div className="flex items-center gap-2">
                <Smile className="h-4 w-4 text-pink-500" />
                <span>Expressions</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-500" />
                <span>Posture</span>
              </div>
              <div className="flex items-center gap-2">
                <Hand className="h-4 w-4 text-orange-500" />
                <span>Gestures</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-500" />
                <span>Voice</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-red-500" />
                <span>Conviction</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Presence</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Session summary screen
  if (showSummary && sessionSummary) {
    return (
      <Card className={`border-2 border-purple-200 shadow-xl ${className}`}>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Session Complete!
            </CardTitle>
            <Badge className="bg-white text-purple-600 text-lg px-3 py-1">
              {sessionSummary.grade}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(sessionSummary.overallScore)}`}>
              {sessionSummary.overallScore}%
            </div>
            <p className="text-gray-500 mt-1">Overall Performance</p>
            <p className="text-sm text-gray-400">
              {formatTime(sessionSummary.duration)} practice session
            </p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4" />
                Top Strengths
              </h4>
              <ul className="space-y-1 text-sm text-green-800">
                {sessionSummary.topStrengths.map((s: string, i: number) => (
                  <li key={i}>✓ {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-700 flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" />
                Focus Areas
              </h4>
              <ul className="space-y-1 text-sm text-orange-800">
                {sessionSummary.topImprovements.map((s: string, i: number) => (
                  <li key={i}>→ {s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Immediate Action */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-700 flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4" />
              Your #1 Action Item
            </h4>
            <p className="text-purple-800">{sessionSummary.immediateAction}</p>
          </div>

          {/* Encouragement */}
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-800 italic">"{sessionSummary.encouragement}"</p>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <ul className="space-y-2 text-sm">
              {sessionSummary.nextSteps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowSummary(false);
                setSessionSummary(null);
                startSession();
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Practice Again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSummary(false);
                setSessionSummary(null);
                setSelectedMode(null);
              }}
              className="flex-1"
            >
              Choose Different Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active training screen
  const modeConfig = MODE_CONFIG[selectedMode];
  const avgScore = getAverageScore(visualScores);

  return (
    <Card className={`border-2 border-purple-200 shadow-xl ${className}`}>
      {/* Header */}
      <CardHeader className={`bg-gradient-to-r ${modeConfig.bgGradient} text-white rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {modeConfig.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{modeConfig.title}</CardTitle>
              {isSessionActive && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Clock className="h-3 w-3" />
                  {formatTime(sessionDuration)}
                  {isAnalyzing && (
                    <Badge className="bg-white/20 text-white text-xs animate-pulse">
                      Analyzing...
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSessionActive && avgScore > 0 && (
              <Badge className={`${getScoreBg(avgScore)} ${getScoreColor(avgScore)} text-lg px-3`}>
                {avgScore}%
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isSessionActive) stopSession();
                setSelectedMode(null);
              }}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Video Preview */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {!mediaStream && !isSessionActive && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready to practice?</p>
                <p className="text-sm mt-2">Click Start to begin your session</p>
              </div>
            </div>
          )}

          {/* Live Correction Overlay */}
          {currentCorrection && (
            <div className="absolute top-4 left-4 right-4 p-3 bg-red-500/90 text-white rounded-lg animate-pulse">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{currentCorrection}</span>
              </div>
            </div>
          )}

          {/* Encouragement Overlay */}
          {currentEncouragement && !currentCorrection && (
            <div className="absolute top-4 left-4 right-4 p-3 bg-green-500/90 text-white rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{currentEncouragement}</span>
              </div>
            </div>
          )}

          {/* Video Controls */}
          {isSessionActive && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <Button
                size="lg"
                variant={videoEnabled ? "default" : "destructive"}
                onClick={() => {
                  if (mediaStream) {
                    const track = mediaStream.getVideoTracks()[0];
                    if (track) {
                      track.enabled = !track.enabled;
                      setVideoEnabled(track.enabled);
                    }
                  }
                }}
                className="shadow-lg"
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                size="lg"
                variant={audioEnabled ? "default" : "destructive"}
                onClick={() => {
                  if (mediaStream) {
                    const track = mediaStream.getAudioTracks()[0];
                    if (track) {
                      track.enabled = !track.enabled;
                      setAudioEnabled(track.enabled);
                    }
                  }
                }}
                className="shadow-lg"
              >
                {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>

        {/* Prompt Display */}
        {currentPrompt && isSessionActive && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-purple-700 text-sm mb-1">Your Prompt:</h4>
                <p className="text-gray-800">{currentPrompt}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={getNewPrompt}
                className="flex-shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Tips */}
        {tips.length > 0 && isSessionActive && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-700 text-sm mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Tips for {modeConfig.title}
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Scores */}
        {liveFeedback && isSessionActive && (
          <div className="grid grid-cols-5 gap-2">
            {[
              { key: "eyeContact", label: "Eye", icon: <Eye className="h-3 w-3" /> },
              { key: "facialExpression", label: "Face", icon: <Smile className="h-3 w-3" /> },
              { key: "posture", label: "Posture", icon: <User className="h-3 w-3" /> },
              { key: "gestures", label: "Hands", icon: <Hand className="h-3 w-3" /> },
              { key: "presence", label: "Presence", icon: <Sparkles className="h-3 w-3" /> },
            ].map(({ key, label, icon }) => {
              const score = liveFeedback.visual[key as keyof typeof liveFeedback.visual]?.score || 0;
              return (
                <div key={key} className="text-center">
                  <div className={`p-2 rounded-lg ${getScoreBg(score)} mb-1`}>
                    <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    {icon}
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Voice Toggle & Control Buttons */}
        <div className="flex items-center gap-3 mb-2">
          <Button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            className={voiceEnabled ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {voiceEnabled ? (
              <><Volume2 className="h-4 w-4 mr-2" />AI Voice ON</>
            ) : (
              <><VolumeX className="h-4 w-4 mr-2" />AI Voice OFF</>
            )}
          </Button>
          {/* AI Co-Pilot Status - Shows real-time connection state */}
          <CoPilotStatusIndicator 
            isConnected={coPilot.isConnected}
            isConnecting={coPilot.isConnecting}
            isSpeaking={coPilot.isSpeaking}
            error={coPilot.error}
          />
        </div>
        <div className="flex gap-3">
          {!isSessionActive ? (
            <Button
              onClick={startSession}
              size="lg"
              className={`flex-1 bg-gradient-to-r ${modeConfig.bgGradient} hover:opacity-90`}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              <Button
                onClick={togglePause}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                {isPaused ? (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Square className="h-5 w-5 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                onClick={stopSession}
                size="lg"
                variant="destructive"
                className="flex-1"
              >
                <Square className="h-5 w-5 mr-2" />
                End Session
              </Button>
            </>
          )}
        </div>

        {/* Pre-session info */}
        {!isSessionActive && (
          <div className="text-center text-sm text-gray-500">
            <p>AI will analyze your presence every 4 seconds and provide real-time feedback.</p>
            <p className="mt-1">Practice as long as you want - end when you're ready for your summary.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
