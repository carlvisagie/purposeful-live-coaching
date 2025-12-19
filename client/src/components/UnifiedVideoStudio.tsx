/**
 * UNIFIED VIDEO STUDIO - One Screen to Rule Them All
 * 
 * Consolidates:
 * - Equipment Check (Test mode)
 * - Speaker Training (Train mode)
 * - Live Coaching Session (Coach mode)
 * - Voice-Only AI Coach (Voice mode)
 * 
 * Features:
 * - Single video feed display
 * - Mode selector tabs
 * - Detachable teleprompter (opens in new window for upper monitor)
 * - All controls in one place
 * - Seamless mode switching
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Settings,
  Maximize2,
  ExternalLink,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Brain,
  MessageSquare,
  Phone,
  PhoneOff,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { OpenAIVoiceCoach } from "./OpenAIVoiceCoach";
import { SessionHealthDisclaimer } from "./SessionHealthDisclaimer";

type StudioMode = "test" | "train" | "coach" | "voice";

interface UnifiedVideoStudioProps {
  clientName?: string;
  sessionType?: string;
  className?: string;
}

// Quick coaching scripts for teleprompter
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
  ],
  closing: [
    "We've covered a lot today. What's one insight you're taking away from our conversation?",
    "Before we end, what's one small action you feel ready to take this week?",
    "Thank you for your openness today. Remember, progress isn't always linear, and you're doing important work.",
  ],
};

export function UnifiedVideoStudio({
  clientName = "Client",
  sessionType = "General Coaching",
  className = "",
}: UnifiedVideoStudioProps) {
  // Mode state
  const [mode, setMode] = useState<StudioMode>("test");
  const [isActive, setIsActive] = useState(false);
  
  // Media state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Teleprompter state
  const [scriptContent, setScriptContent] = useState("Welcome to your coaching session.\n\nYour script will appear here.\n\nClick 'Pop Out' to move this to your upper monitor near your camera.");
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(50);
  const [fontSize, setFontSize] = useState(24);
  const [showTeleprompter, setShowTeleprompter] = useState(true);
  const [selectedScriptCategory, setSelectedScriptCategory] = useState<keyof typeof QUICK_SCRIPTS | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  
  // Health disclaimer
  const [showHealthDisclaimer, setShowHealthDisclaimer] = useState(false);
  const [pendingMode, setPendingMode] = useState<StudioMode | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync script to localStorage for popout window
  useEffect(() => {
    localStorage.setItem("teleprompter_script", scriptContent);
  }, [scriptContent]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isScrolling && scrollContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += scrollSpeed / 50;
        }
      }, 50);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }
    
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

  // Audio level monitoring
  const setupAudioMonitoring = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Audio monitoring setup failed:', error);
    }
  }, []);

  // Start media stream
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: mode !== "voice" ? { width: 1280, height: 720 } : false,
        audio: true
      });
      
      setMediaStream(stream);
      setIsActive(true);
      
      if (videoRef.current && mode !== "voice") {
        videoRef.current.srcObject = stream;
      }
      
      setupAudioMonitoring(stream);
      toast.success("Equipment ready!");
    } catch (error: any) {
      console.error('Media access failed:', error);
      toast.error(`Camera/Microphone access failed: ${error.message}`);
    }
  };

  // Stop media stream
  const stopMedia = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsActive(false);
    setAudioLevel(0);
  };

  // Toggle video
  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Pop out teleprompter to new window
  const popOutTeleprompter = () => {
    // Save current script to localStorage first
    localStorage.setItem("teleprompter_script", scriptContent);
    
    // Open in new window - sized for upper monitor
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = 0; // Top of screen for upper monitor
    
    window.open(
      "/teleprompter",
      "teleprompter",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
    );
    
    toast.success("Teleprompter opened! Drag it to your upper monitor near your camera.");
  };

  // Add script to teleprompter
  const addScript = (script: string) => {
    setScriptContent(prev => prev + "\n\n" + script);
    toast.success("Script added!");
  };

  // Copy script to clipboard
  const copyScript = async (script: string) => {
    await navigator.clipboard.writeText(script);
    setCopiedScript(script);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  // Handle mode change with health disclaimer
  const handleModeChange = (newMode: StudioMode) => {
    if (newMode === "voice" || newMode === "train") {
      setPendingMode(newMode);
      setShowHealthDisclaimer(true);
    } else {
      setMode(newMode);
      if (isActive) {
        stopMedia();
      }
    }
  };

  // Confirm health disclaimer
  const confirmHealthDisclaimer = () => {
    if (pendingMode) {
      setMode(pendingMode);
      setPendingMode(null);
    }
    setShowHealthDisclaimer(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, []);

  // Mode descriptions
  const modeInfo: Record<StudioMode, { title: string; description: string; icon: React.ReactNode }> = {
    test: {
      title: "Equipment Check",
      description: "Test your camera and microphone before sessions",
      icon: <Settings className="h-4 w-4" />,
    },
    train: {
      title: "Speaker Training",
      description: "Practice speaking with AI feedback and analysis",
      icon: <Brain className="h-4 w-4" />,
    },
    coach: {
      title: "Live Coaching",
      description: "Run a live coaching session with teleprompter",
      icon: <Users className="h-4 w-4" />,
    },
    voice: {
      title: "Voice Coach",
      description: "Talk to AI coaches in real-time conversation",
      icon: <Phone className="h-4 w-4" />,
    },
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Health Disclaimer Modal */}
      {showHealthDisclaimer && (
        <SessionHealthDisclaimer
          onAccept={confirmHealthDisclaimer}
          onDecline={() => {
            setShowHealthDisclaimer(false);
            setPendingMode(null);
          }}
        />
      )}

      {/* Main Studio Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Video Studio</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {modeInfo[mode].description}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            {isActive && (
              <Badge variant="destructive" className="animate-pulse">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mode Selector Tabs */}
          <Tabs value={mode} onValueChange={(v) => handleModeChange(v as StudioMode)} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="test" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Test</span>
              </TabsTrigger>
              <TabsTrigger value="train" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Train</span>
              </TabsTrigger>
              <TabsTrigger value="coach" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Coach</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Main Content Area - Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT: Video Feed */}
            <div className="space-y-3">
              {/* Video Display */}
              {mode !== "voice" ? (
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                  />
                  
                  {/* Video Off Placeholder */}
                  {(!isActive || !videoEnabled) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                        {isActive ? (
                          <VideoOff className="h-10 w-10 text-gray-400" />
                        ) : (
                          <Video className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {isActive ? "Camera Off" : "Click Start to begin"}
                      </p>
                    </div>
                  )}

                  {/* Audio Level Indicator */}
                  {isActive && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                        {audioEnabled ? (
                          <Mic className="h-4 w-4 text-green-400" />
                        ) : (
                          <MicOff className="h-4 w-4 text-red-400" />
                        )}
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-75"
                            style={{ width: `${audioLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Voice Mode - No Video */
                <div className="aspect-video bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl flex flex-col items-center justify-center shadow-lg">
                  <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-pulse">
                    <Phone className="h-12 w-12 text-green-400" />
                  </div>
                  <p className="text-green-300 font-medium">Voice-Only Mode</p>
                  <p className="text-green-400/60 text-sm">No camera needed</p>
                </div>
              )}

              {/* Media Controls */}
              <div className="flex items-center justify-center gap-2">
                {/* Start/Stop Button */}
                {!isActive ? (
                  <Button
                    onClick={startMedia}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start {modeInfo[mode].title}
                  </Button>
                ) : (
                  <Button
                    onClick={stopMedia}
                    size="lg"
                    variant="destructive"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                )}

                {/* Video Toggle */}
                {mode !== "voice" && isActive && (
                  <Button
                    variant={videoEnabled ? "outline" : "destructive"}
                    size="icon"
                    onClick={toggleVideo}
                  >
                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                )}

                {/* Audio Toggle */}
                {isActive && (
                  <Button
                    variant={audioEnabled ? "outline" : "destructive"}
                    size="icon"
                    onClick={toggleAudio}
                  >
                    {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                )}
              </div>

              {/* Equipment Status */}
              {isActive && mode === "test" && (
                <div className="bg-white/80 rounded-lg p-3 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Equipment Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${videoEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                      Camera: {videoEnabled ? 'ON' : 'OFF'}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${audioEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                      Mic: {audioEnabled ? 'ON' : 'OFF'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Teleprompter / Mode-Specific Content */}
            <div className="space-y-3">
              {/* Teleprompter Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {mode === "voice" ? "Voice Coach" : "Teleprompter"}
                </h3>
                <div className="flex items-center gap-2">
                  {mode !== "voice" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTeleprompter(!showTeleprompter)}
                      >
                        {showTeleprompter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={popOutTeleprompter}
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Pop Out
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Mode-Specific Content */}
              {mode === "voice" ? (
                /* Voice Coach Mode */
                <div className="bg-white/80 rounded-lg p-4">
                  <OpenAIVoiceCoach
                    mode="coaching_practice"
                  />
                </div>
              ) : showTeleprompter ? (
                /* Teleprompter Display */
                <div className="space-y-3">
                  {/* Script Display */}
                  <div
                    ref={scrollContainerRef}
                    className="bg-gray-900 text-white rounded-lg p-4 h-64 overflow-y-auto"
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                  >
                    <div className="whitespace-pre-wrap">
                      {scriptContent}
                    </div>
                  </div>

                  {/* Teleprompter Controls */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Play/Pause */}
                    <Button
                      variant={isScrolling ? "destructive" : "default"}
                      size="sm"
                      onClick={() => setIsScrolling(!isScrolling)}
                    >
                      {isScrolling ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                      {isScrolling ? "Pause" : "Scroll"}
                    </Button>

                    {/* Reset */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollTop = 0;
                        }
                        setIsScrolling(false);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>

                    {/* Speed Control */}
                    <div className="flex items-center gap-2 flex-1 max-w-32">
                      <span className="text-xs text-muted-foreground">Speed:</span>
                      <Slider
                        value={[scrollSpeed]}
                        onValueChange={([v]) => setScrollSpeed(v)}
                        min={10}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                    </div>

                    {/* Font Size */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setFontSize(prev => Math.max(prev - 2, 14))}
                      >
                        <span className="text-xs">A-</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setFontSize(prev => Math.min(prev + 2, 48))}
                      >
                        <span className="text-xs">A+</span>
                      </Button>
                    </div>
                  </div>

                  {/* Quick Scripts */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(QUICK_SCRIPTS).map((category) => (
                        <Button
                          key={category}
                          variant={selectedScriptCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedScriptCategory(
                            selectedScriptCategory === category ? null : category as keyof typeof QUICK_SCRIPTS
                          )}
                          className="capitalize text-xs"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>

                    {selectedScriptCategory && (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {QUICK_SCRIPTS[selectedScriptCategory].map((script, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-2 bg-white/60 rounded text-sm hover:bg-white/80 transition-colors"
                          >
                            <p className="flex-1 text-xs">{script}</p>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyScript(script)}
                              >
                                {copiedScript === script ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => addScript(script)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Edit Script */}
                  <Textarea
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    placeholder="Type or paste your script here..."
                    className="h-24 text-sm"
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Mode-Specific Full Components - Speaker Training opens in its own section */}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Pro Tip: Eye Contact</h4>
              <p className="text-sm text-blue-700">
                Click "Pop Out" to open the teleprompter in a separate window. Drag it to your upper monitor 
                near your camera - when you read the script, you'll naturally maintain eye contact with your client!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Plus icon component
function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default UnifiedVideoStudio;
