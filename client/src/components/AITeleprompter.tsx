import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Brain,
  Lightbulb,
  Mic,
  MicOff,
  Send,
  RefreshCw,
  Copy,
  Check,
  Volume2,
  Sparkles,
  AlertTriangle,
  Heart,
  Shield,
  MessageSquare,
  Maximize2,
  Minimize2,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  Ear,
  Activity,
  AlertCircle,
  TrendingUp,
  User,
  Video,
  VideoOff,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

/**
 * AI Teleprompter Component - Enhanced with Live Session Analysis
 * 
 * Real-time AI coaching assistant that provides:
 * - VISUAL ANALYSIS: Micro-expressions, body language, engagement
 * - AUDIO ANALYSIS: Voice patterns, emotional undertones
 * - Suggested responses based on client input
 * - Emotional intelligence cues
 * - Compliance-safe language suggestions
 * - Quick copy-to-clipboard functionality
 * - Voice input support
 * - Crisis detection alerts
 */

interface TeleprompterSuggestion {
  id: string;
  type: "response" | "empathy" | "technique" | "warning" | "transition" | "observation" | "crisis";
  title: string;
  content: string;
  technique?: string;
  priority: "low" | "medium" | "high" | "critical";
  timestamp: Date;
}

interface LiveAnalysis {
  emotionalState: string;
  engagementLevel: "low" | "medium" | "high";
  stressLevel: "low" | "medium" | "high" | "critical";
  bodyLanguage: {
    posture: string;
    eyeContact: string;
    tension: string;
  };
  microExpressions: string[];
  riskLevel: "none" | "low" | "medium" | "high" | "crisis";
}

interface AITeleprompterProps {
  clientName?: string;
  sessionType?: string;
  clientContext?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
  // New props for live analysis
  videoRef?: React.RefObject<HTMLVideoElement>;
  isSessionActive?: boolean;
  onAnalysisUpdate?: (analysis: LiveAnalysis) => void;
}

// Pre-built coaching scripts for quick access
const QUICK_SCRIPTS = {
  opening: [
    "Thank you for joining me today. Before we begin, I want you to know this is a safe space where you can share openly.",
    "I'm glad you're here. Let's start by checking in - how are you feeling right now, in this moment?",
    "Welcome back! I've been looking forward to our session. What's been on your mind since we last spoke?",
  ],
  empathy: [
    "I hear you, and that sounds really challenging. It takes courage to share that.",
    "Thank you for trusting me with this. Your feelings are completely valid.",
    "That must be difficult to carry. I appreciate you opening up about this.",
  ],
  grounding: [
    "Let's pause for a moment. Can you take a deep breath with me? Inhale for 4 counts... hold for 4... exhale for 6...",
    "I notice this is bringing up strong emotions. Let's ground ourselves - can you name 5 things you can see right now?",
    "Before we continue, let's do a quick body scan. Where are you holding tension right now?",
  ],
  reframing: [
    "I'm curious - what would it look like if you approached this situation with self-compassion?",
    "Let's explore another perspective. What advice would you give a close friend in this situation?",
    "What's one small thing that went well today, even if it feels insignificant?",
  ],
  closing: [
    "We've covered a lot today. What's one insight you're taking away from our conversation?",
    "Before we end, what's one small action you feel ready to take this week?",
    "Thank you for your openness today. Remember, progress isn't always linear, and you're doing important work.",
  ],
  crisis: [
    "I want to make sure I understand - are you having thoughts of harming yourself right now?",
    "Your safety is my top priority. Can you tell me more about what you're experiencing?",
    "I'm here with you. Let's talk about what support you have available right now.",
  ],
};

export default function AITeleprompter({
  clientName = "Client",
  sessionType = "General Coaching",
  clientContext = "",
  isExpanded: externalExpanded,
  onToggleExpand,
  className = "",
  videoRef,
  isSessionActive = false,
  onAnalysisUpdate,
}: AITeleprompterProps) {
  const [isExpanded, setIsExpanded] = useState(externalExpanded ?? true);
  const [clientInput, setClientInput] = useState("");
  const [suggestions, setSuggestions] = useState<TeleprompterSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof QUICK_SCRIPTS | null>(null);
  const [showQuickScripts, setShowQuickScripts] = useState(false);
  
  // Live analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<LiveAnalysis | null>(null);
  const [analysisEnabled, setAnalysisEnabled] = useState(true);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  
  const suggestionsEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // AI suggestion mutation
  const generateSuggestionMutation = trpc.aiCoach.generateCoachingSuggestion.useMutation({
    onSuccess: (data) => {
      if (data.suggestions && data.suggestions.length > 0) {
        const newSuggestions: TeleprompterSuggestion[] = data.suggestions.map((s: any, index: number) => ({
          id: `suggestion-${Date.now()}-${index}`,
          type: s.type || "response",
          title: s.title || "Suggested Response",
          content: s.content,
          technique: s.technique,
          priority: s.priority || "medium",
          timestamp: new Date(),
        }));
        setSuggestions(prev => [...prev, ...newSuggestions]);
      }
      setIsGenerating(false);
    },
    onError: (error) => {
      console.error("AI suggestion error:", error);
      generateLocalSuggestions(clientInput);
      setIsGenerating(false);
    },
  });

  // Session analysis mutation
  const analyzeSessionMutation = trpc.sessionAnalysis.analyzeSessionMoment.useMutation({
    onSuccess: (data) => {
      if (data.overallState) {
        const newAnalysis: LiveAnalysis = {
          emotionalState: data.overallState.emotionalState,
          engagementLevel: data.overallState.engagementLevel as "low" | "medium" | "high",
          stressLevel: data.visual?.stressIndicators?.level || "low",
          bodyLanguage: {
            posture: data.visual?.bodyLanguage?.posture || "neutral",
            eyeContact: data.visual?.bodyLanguage?.eyeContact || "direct",
            tension: data.visual?.bodyLanguage?.tension || "low",
          },
          microExpressions: data.visual?.microExpressions?.detected || [],
          riskLevel: data.overallState.riskLevel,
        };
        
        setLiveAnalysis(newAnalysis);
        setLastAnalysisTime(new Date());
        onAnalysisUpdate?.(newAnalysis);

        // Add insights as suggestions
        if (data.insights && data.insights.length > 0) {
          const insightSuggestions: TeleprompterSuggestion[] = data.insights.map((insight: any, index: number) => ({
            id: `insight-${Date.now()}-${index}`,
            type: insight.type || "observation",
            title: insight.title,
            content: insight.content,
            technique: insight.technique,
            priority: insight.priority || "medium",
            timestamp: new Date(),
          }));
          setSuggestions(prev => [...insightSuggestions, ...prev].slice(0, 20)); // Keep last 20
        }

        // Crisis alert
        if (data.overallState.riskLevel === "crisis" || data.overallState.riskLevel === "high") {
          toast.error("⚠️ Risk Detected", {
            description: data.overallState.recommendedAction,
            duration: 10000,
          });
        }
      }
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error("Session analysis error:", error);
      setIsAnalyzing(false);
    },
  });

  // Capture video frame for analysis
  const captureVideoFrame = useCallback((): string | null => {
    if (!videoRef?.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0) return null;
    
    canvas.width = 640;
    canvas.height = 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get base64 without the data URL prefix
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    return dataUrl.split(',')[1];
  }, [videoRef]);

  // Run live analysis
  const runAnalysis = useCallback(async () => {
    if (!analysisEnabled || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    const frameBase64 = captureVideoFrame();
    
    try {
      await analyzeSessionMutation.mutateAsync({
        frameBase64: frameBase64 || undefined,
        transcript: clientInput || undefined,
        clientName,
        sessionType,
        sessionDuration: lastAnalysisTime 
          ? Math.floor((Date.now() - lastAnalysisTime.getTime()) / 60000)
          : 0,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    }
  }, [analysisEnabled, isAnalyzing, captureVideoFrame, clientInput, clientName, sessionType, lastAnalysisTime]);

  // Start/stop analysis interval when session is active
  useEffect(() => {
    if (isSessionActive && analysisEnabled && videoRef?.current) {
      // Create hidden canvas for frame capture
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      // Run analysis every 5 seconds
      analysisIntervalRef.current = setInterval(() => {
        runAnalysis();
      }, 5000);
      
      // Run initial analysis
      setTimeout(runAnalysis, 1000);
    }
    
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, [isSessionActive, analysisEnabled, videoRef, runAnalysis]);

  // Generate suggestions based on client input
  const generateSuggestions = useCallback(async () => {
    if (!clientInput.trim()) {
      toast.error("Please enter what the client said first");
      return;
    }

    setIsGenerating(true);

    try {
      await generateSuggestionMutation.mutateAsync({
        clientInput: clientInput.trim(),
        clientName,
        sessionType,
        clientContext,
      });
    } catch (error) {
      // Fallback handled in onError
    }
  }, [clientInput, clientName, sessionType, clientContext]);

  // Local fallback suggestion generator
  const generateLocalSuggestions = (input: string) => {
    const lowerInput = input.toLowerCase();
    const newSuggestions: TeleprompterSuggestion[] = [];

    if (lowerInput.includes("anxious") || lowerInput.includes("worried") || lowerInput.includes("stress")) {
      newSuggestions.push({
        id: `local-${Date.now()}-1`,
        type: "empathy",
        title: "Acknowledge Anxiety",
        content: `I hear that you're feeling anxious, ${clientName}. That's a completely natural response to what you're going through. Let's take a moment to breathe together - would you be open to a quick grounding exercise?`,
        technique: "Validation + Grounding",
        priority: "high",
        timestamp: new Date(),
      });
      newSuggestions.push({
        id: `local-${Date.now()}-2`,
        type: "technique",
        title: "5-4-3-2-1 Grounding",
        content: "Let's try the 5-4-3-2-1 technique. Can you name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste?",
        technique: "Sensory Grounding",
        priority: "medium",
        timestamp: new Date(),
      });
    }

    if (lowerInput.includes("sad") || lowerInput.includes("depressed") || lowerInput.includes("hopeless")) {
      newSuggestions.push({
        id: `local-${Date.now()}-3`,
        type: "empathy",
        title: "Validate Sadness",
        content: `Thank you for sharing that with me, ${clientName}. It takes courage to acknowledge these feelings. I want you to know that what you're feeling is valid, and you don't have to face this alone.`,
        technique: "Emotional Validation",
        priority: "high",
        timestamp: new Date(),
      });
    }

    if (lowerInput.includes("angry") || lowerInput.includes("frustrated") || lowerInput.includes("mad")) {
      newSuggestions.push({
        id: `local-${Date.now()}-4`,
        type: "empathy",
        title: "Acknowledge Frustration",
        content: `I can hear the frustration in what you're sharing. That anger makes sense given what you've described. Let's explore what's underneath that feeling - often anger is protecting something deeper.`,
        technique: "Emotion Exploration",
        priority: "high",
        timestamp: new Date(),
      });
    }

    if (lowerInput.includes("don't know") || lowerInput.includes("confused") || lowerInput.includes("stuck")) {
      newSuggestions.push({
        id: `local-${Date.now()}-5`,
        type: "response",
        title: "Explore Uncertainty",
        content: `It's okay not to have all the answers right now. Sometimes sitting with uncertainty is part of the process. What feels most unclear to you in this moment?`,
        technique: "Curious Inquiry",
        priority: "medium",
        timestamp: new Date(),
      });
    }

    if (newSuggestions.length === 0) {
      newSuggestions.push({
        id: `local-${Date.now()}-6`,
        type: "response",
        title: "Reflective Response",
        content: `I appreciate you sharing that. Can you tell me more about what that experience was like for you?`,
        technique: "Open-ended Inquiry",
        priority: "medium",
        timestamp: new Date(),
      });
    }

    setSuggestions(prev => [...prev, ...newSuggestions]);
    toast.success("Generated coaching suggestions");
  };

  // Copy suggestion to clipboard
  const copySuggestion = async (suggestion: TeleprompterSuggestion) => {
    try {
      await navigator.clipboard.writeText(suggestion.content);
      setCopiedId(suggestion.id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  // Voice input setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setClientInput(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error("Voice input error: " + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening... Speak what the client said");
    }
  };

  // Auto-scroll to latest suggestion
  useEffect(() => {
    suggestionsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [suggestions]);

  // Handle expand toggle
  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const expanded = externalExpanded ?? isExpanded;

  // Get icon for suggestion type
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "empathy":
        return <Heart className="h-4 w-4 text-pink-500" />;
      case "technique":
        return <Brain className="h-4 w-4 text-purple-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "crisis":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "observation":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "transition":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Get background color for suggestion type
  const getSuggestionBg = (type: string, priority: string) => {
    if (priority === "critical") {
      return "bg-gradient-to-r from-red-50 to-rose-50 border-l-red-600";
    }
    if (priority === "high") {
      return "bg-gradient-to-r from-amber-50 to-orange-50 border-l-orange-500";
    }
    switch (type) {
      case "empathy":
        return "bg-gradient-to-r from-pink-50 to-rose-50 border-l-pink-500";
      case "technique":
        return "bg-gradient-to-r from-purple-50 to-indigo-50 border-l-purple-500";
      case "warning":
        return "bg-gradient-to-r from-orange-50 to-amber-50 border-l-orange-500";
      case "crisis":
        return "bg-gradient-to-r from-red-50 to-rose-50 border-l-red-600";
      case "observation":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 border-l-blue-500";
      case "transition":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 border-l-blue-500";
      default:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-l-yellow-500";
    }
  };

  // Get stress level color
  const getStressColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Get engagement color
  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high": return "text-green-600 bg-green-100";
      case "medium": return "text-blue-600 bg-blue-100";
      case "low": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card className={`border-2 border-purple-200 shadow-xl ${className}`}>
      {/* Header - Always Visible */}
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            AI Coaching Co-Pilot
            {(isGenerating || isAnalyzing) && (
              <RefreshCw className="h-4 w-4 animate-spin ml-2" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Live Analysis Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAnalysisEnabled(!analysisEnabled)}
              className={`text-white hover:bg-white/20 ${analysisEnabled ? 'bg-white/20' : ''}`}
              title={analysisEnabled ? "AI Analysis Active" : "AI Analysis Paused"}
            >
              {analysisEnabled ? <Eye className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {suggestions.length} insights
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpand}
              className="text-white hover:bg-white/20"
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Live Analysis Status Bar */}
        {liveAnalysis && (
          <div className="flex items-center gap-3 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span className="capitalize">{liveAnalysis.emotionalState}</span>
            </div>
            <Badge className={`text-xs ${getEngagementColor(liveAnalysis.engagementLevel)}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {liveAnalysis.engagementLevel} engagement
            </Badge>
            <Badge className={`text-xs ${getStressColor(liveAnalysis.stressLevel)}`}>
              <Activity className="h-3 w-3 mr-1" />
              {liveAnalysis.stressLevel} stress
            </Badge>
            {liveAnalysis.riskLevel !== "none" && (
              <Badge className="text-xs bg-red-100 text-red-700">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {liveAnalysis.riskLevel} risk
              </Badge>
            )}
          </div>
        )}
        
        {!expanded && suggestions.length > 0 && (
          <p className="text-sm text-white/80 mt-1 truncate">
            Latest: {suggestions[0]?.content.substring(0, 60)}...
          </p>
        )}
      </CardHeader>

      {/* Expandable Content */}
      {expanded && (
        <CardContent className="p-4 space-y-4">
          {/* Live Analysis Panel */}
          {liveAnalysis && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  Live Client Analysis
                </h4>
                <span className="text-xs text-gray-500">
                  Updated {lastAnalysisTime?.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Emotional State</p>
                  <p className="font-medium capitalize">{liveAnalysis.emotionalState}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Body Language</p>
                  <p className="font-medium capitalize">{liveAnalysis.bodyLanguage.posture}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Eye Contact</p>
                  <p className="font-medium capitalize">{liveAnalysis.bodyLanguage.eyeContact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tension</p>
                  <p className="font-medium capitalize">{liveAnalysis.bodyLanguage.tension}</p>
                </div>
              </div>
              
              {liveAnalysis.microExpressions.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Micro-expressions detected:</p>
                  <div className="flex flex-wrap gap-1">
                    {liveAnalysis.microExpressions.map((expr, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {expr}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-700">
                What did {clientName} say?
              </p>
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={toggleVoiceInput}
                className="ml-auto"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-1" />
                    Voice
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                placeholder="Type or speak what the client said..."
                rows={2}
                className="flex-1 resize-none"
              />
              <Button
                onClick={generateSuggestions}
                disabled={isGenerating || !clientInput.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Scripts Toggle */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickScripts(!showQuickScripts)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Quick Scripts Library
              </span>
              {showQuickScripts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showQuickScripts && (
              <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(QUICK_SCRIPTS) as Array<keyof typeof QUICK_SCRIPTS>).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {selectedCategory && (
                  <div className="space-y-2 mt-3">
                    {QUICK_SCRIPTS[selectedCategory].map((script, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors"
                        onClick={() => copySuggestion({
                          id: `quick-${selectedCategory}-${index}`,
                          type: "response",
                          title: selectedCategory,
                          content: script,
                          priority: "medium",
                          timestamp: new Date(),
                        })}
                      >
                        <p className="text-sm text-gray-800">{script}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Copy className="h-3 w-3" />
                          Click to copy
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Suggestions Display */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {suggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">AI Co-Pilot Ready</p>
                <p className="text-sm">
                  {isSessionActive 
                    ? "Analyzing session... Insights will appear here" 
                    : "Enter what the client said to get AI-powered suggestions"}
                </p>
              </div>
            ) : (
              <>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-lg border-l-4 shadow-sm transition-all hover:shadow-md ${getSuggestionBg(
                      suggestion.type,
                      suggestion.priority
                    )}`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        <span className="font-semibold text-sm text-gray-800">
                          {suggestion.title}
                        </span>
                        {suggestion.priority === "critical" && (
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            URGENT
                          </Badge>
                        )}
                        {suggestion.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">
                            Priority
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySuggestion(suggestion)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedId === suggestion.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Script Content - Large and Readable */}
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-base leading-relaxed text-gray-900 font-medium">
                        "{suggestion.content}"
                      </p>
                    </div>

                    {/* Technique Badge */}
                    {suggestion.technique && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-white">
                          <Brain className="h-3 w-3 mr-1" />
                          {suggestion.technique}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {suggestion.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={suggestionsEndRef} />
              </>
            )}
          </div>

          {/* Clear Button */}
          {suggestions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSuggestions([]);
                setClientInput("");
              }}
              className="w-full"
            >
              Clear All Suggestions
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
