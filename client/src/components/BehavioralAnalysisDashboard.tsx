/**
 * BEHAVIORAL ANALYSIS DASHBOARD
 * 
 * Chase Hughes HABIT Framework + Advanced Behavioral Analysis
 * 
 * This dashboard shows:
 * 1. Co-Pilot status and capabilities
 * 2. Live testing of behavioral analysis
 * 3. What the system can detect
 * 4. Recent detections and insights
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain, Eye, Ear, Hand, Clock, AlertTriangle, CheckCircle2,
  Play, Square, Video, Mic, Activity, Zap, Heart, Shield,
  Target, TrendingUp, Users, MessageSquare
} from "lucide-react";
import { useAISessionCoPilot, CoPilotInsight } from "@/components/AISessionCoPilot";
import { toast } from "sonner";

export function BehavioralAnalysisDashboard() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [insights, setInsights] = useState<CoPilotInsight[]>([]);
  const [transcript, setTranscript] = useState<Array<{ text: string; speaker: string; time: Date }>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // AI Co-Pilot hook
  const coPilot = useAISessionCoPilot({
    mode: "coaching_practice",
    isActive: isTestMode,
    videoRef,
    onInsight: (insight) => {
      setInsights(prev => [...prev.slice(-50), insight]);
    },
    onTranscript: (text, speaker) => {
      setTranscript(prev => [...prev.slice(-100), { text, speaker, time: new Date() }]);
    },
    voice: "coral",
  });

  // Start test mode
  const startTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsTestMode(true);
      toast.success("Behavioral Analysis Test Mode activated");
    } catch (err) {
      toast.error("Failed to access camera/microphone");
    }
  };

  // Stop test mode
  const stopTest = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsTestMode(false);
    toast.info("Test mode stopped");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // HABIT Framework capabilities
  const habitFramework = [
    {
      letter: "H",
      name: "Heart Rate & Physiology",
      icon: Heart,
      color: "text-red-500",
      detects: [
        "Voice pitch changes (fear, anger, deception)",
        "Rapid breathing (stress/anxiety)",
        "Micro-tremors (suppressed emotion)",
        "Flushed face (shame, anger)",
        "Pale face (fear, shock)"
      ]
    },
    {
      letter: "A",
      name: "Adaptors (Self-Soothing)",
      icon: Hand,
      color: "text-orange-500",
      detects: [
        "Touching face/neck (anxiety)",
        "Playing with hair (nervous energy)",
        "Fidgeting (discomfort)",
        "Rubbing hands (self-comfort)",
        "Covering mouth (hiding truth)"
      ]
    },
    {
      letter: "B",
      name: "Barriers (Blocking)",
      icon: Shield,
      color: "text-yellow-500",
      detects: [
        "Crossed arms (defensive)",
        "Leaning back (withdrawal)",
        "Placing objects between (protection)",
        "Turning away (avoidance)",
        "Closing off body (resistance)"
      ]
    },
    {
      letter: "I",
      name: "Illustrators (Gestures)",
      icon: Target,
      color: "text-green-500",
      detects: [
        "Decreased gestures (cognitive load, deception)",
        "Increased gestures (passion, truth)",
        "Mismatched gestures (incongruence)",
        "Frozen hands (suppression)",
        "Pointing (blame, deflection)"
      ]
    },
    {
      letter: "T",
      name: "Timing & Pauses",
      icon: Clock,
      color: "text-blue-500",
      detects: [
        "Long pauses before answering (fabricating)",
        "Quick responses (rehearsed or truth)",
        "Hesitation (uncertainty, hiding)",
        "Speech rate changes (stress)",
        "Filler words - um, uh, like (cognitive load)"
      ]
    }
  ];

  // Additional capabilities
  const additionalCapabilities = [
    { name: "Micro-Expression Detection", icon: Eye, description: "Fleeting facial expressions lasting 1/25th of a second" },
    { name: "Voice Stress Analysis", icon: Ear, description: "Tone, pitch, pace, and stress indicators in speech" },
    { name: "Body Language Interpretation", icon: Users, description: "Posture, positioning, and movement patterns" },
    { name: "Deception Indicators", icon: AlertTriangle, description: "Inconsistencies between verbal and non-verbal cues" },
    { name: "Multi-Layer Causal Analysis", icon: Brain, description: "5 levels deep - from symptom to root cause" },
    { name: "Compliance Protection", icon: Shield, description: "Catches medical/legal advice before it's spoken" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            Chase Hughes Behavioral Analysis
          </h2>
          <p className="text-muted-foreground">
            HABIT Framework + Advanced Micro-Expression Detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={coPilot.isConnected ? "default" : "secondary"} className="gap-1">
            <Activity className={`h-3 w-3 ${coPilot.isConnected ? "animate-pulse" : ""}`} />
            {coPilot.isConnected ? "Co-Pilot Active" : "Co-Pilot Standby"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test">Live Test</TabsTrigger>
          <TabsTrigger value="habit">HABIT Framework</TabsTrigger>
          <TabsTrigger value="insights">Recent Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Status Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chase Hughes HABIT</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Micro-Expression Engine</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Stress Analysis</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Monitor</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capabilities Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Detection Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {additionalCapabilities.slice(0, 4).map((cap, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <cap.icon className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{cap.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Integrated Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Og Mandino Principles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Huberman Lab Protocols</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Polyvagal Theory (Porges)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Trauma-Informed (van der Kolk)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Launch behavioral analysis in different contexts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={startTest}>
                  <Play className="h-6 w-6" />
                  <span>Test Mode</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/live-session">
                    <Video className="h-6 w-6" />
                    <span>Live Session</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/speaker-training">
                    <Mic className="h-6 w-6" />
                    <span>Speaker Training</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Test Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Behavioral Analysis Test</CardTitle>
              <CardDescription>
                Test the Chase Hughes HABIT framework and micro-expression detection in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Video Feed */}
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isTestMode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Button onClick={startTest} size="lg" className="gap-2">
                          <Play className="h-5 w-5" />
                          Start Test
                        </Button>
                      </div>
                    )}
                    {isTestMode && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="gap-1 animate-pulse">
                          <Activity className="h-3 w-3" />
                          ANALYZING
                        </Badge>
                      </div>
                    )}
                  </div>
                  {isTestMode && (
                    <Button onClick={stopTest} variant="destructive" className="w-full gap-2">
                      <Square className="h-4 w-4" />
                      Stop Test
                    </Button>
                  )}
                </div>

                {/* Live Insights */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Live Insights</h3>
                  <div className="h-[300px] overflow-y-auto space-y-2 border rounded-lg p-3">
                    {insights.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-8">
                        Start the test to see real-time behavioral insights
                      </p>
                    ) : (
                      insights.slice(-10).reverse().map((insight, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg text-sm ${
                            insight.type === "warning" ? "bg-yellow-500/10 border-yellow-500/20" :
                            insight.type === "crisis" ? "bg-red-500/10 border-red-500/20" :
                            insight.type === "encouragement" ? "bg-green-500/10 border-green-500/20" :
                            "bg-muted"
                          } border`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {insight.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p>{insight.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${coPilot.isConnected ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm">WebRTC Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${coPilot.isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                  <span className="text-sm">Listening</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${coPilot.isSpeaking ? "bg-blue-500 animate-pulse" : "bg-gray-300"}`} />
                  <span className="text-sm">AI Speaking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${mediaStream ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm">Video Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HABIT Framework Tab */}
        <TabsContent value="habit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habitFramework.map((item) => (
              <Card key={item.letter}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${item.color}`}>{item.letter}</span>
                    <span className="text-lg">{item.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {item.detects.map((detect, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{detect}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Detection Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {additionalCapabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    <cap.icon className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{cap.name}</p>
                      <p className="text-sm text-muted-foreground">{cap.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Behavioral Insights</CardTitle>
              <CardDescription>
                Insights detected across all sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No insights yet. Start a test or live session to see behavioral analysis.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {insights.slice(-20).reverse().map((insight, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        insight.type === "warning" ? "bg-yellow-500/10 border-yellow-500/30" :
                        insight.type === "crisis" ? "bg-red-500/10 border-red-500/30" :
                        insight.type === "encouragement" ? "bg-green-500/10 border-green-500/30" :
                        insight.type === "suggestion" ? "bg-blue-500/10 border-blue-500/30" :
                        "bg-muted border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{insight.type}</Badge>
                          <Badge variant="secondary">{insight.category}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {insight.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{insight.message}</p>
                      {insight.actionRequired && (
                        <Badge variant="destructive" className="mt-2">Action Required</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BehavioralAnalysisDashboard;
