import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Users, Calendar, Video, DollarSign, Clock, TrendingUp, Search, Plus,
  BarChart3, Settings, Bell, CheckCircle2, AlertCircle, Activity,
  UserPlus, AlertTriangle, Target, Brain, Play, Zap, Timer, Mic, MicOff,
  VideoOff, Volume2, Maximize2, Sparkles, MessageSquare
} from "lucide-react";
import AITeleprompter from "@/components/AITeleprompter";

/**
 * OWNER CONTROL CENTER V2 - Session-Focused Command Center
 * 
 * HERO SECTION: Today's Sessions (always visible, prominent)
 * SECONDARY: Tabs for Clients, Analytics, Admin
 * 
 * The video/sessions are the MAIN focus - not buried in tabs!
 */
export default function OwnerControlCenterV2() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Video/Audio testing state
  const [isTestingEquipment, setIsTestingEquipment] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { data: user } = trpc.auth.me.useQuery();
  
  // Coach queries
  const { data: allClients } = trpc.coachDashboard.getAllClients.useQuery(undefined, { enabled: !!user });
  const { data: coachStats } = trpc.coachDashboard.getStats.useQuery(undefined, { enabled: !!user });
  const { data: coachSessions } = trpc.scheduling.getCoachSessions.useQuery(
    { coachId: user?.id || 0 },
    { enabled: !!user }
  );
  
  // Admin queries
  const { data: adminStats } = trpc.admin.getStats.useQuery({ timeRange }, { enabled: !!user });
  const { data: recentUsers } = trpc.admin.getRecentUsers.useQuery({ limit: 10 }, { enabled: !!user });
  const { data: crisisAlerts } = trpc.admin.getCrisisAlerts.useQuery({ status: "pending", limit: 5 }, { enabled: !!user });

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter today's sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaysSessions = (coachSessions?.filter((session: any) => {
    const sessionDate = new Date(session.scheduledDate);
    return sessionDate >= today && sessionDate < tomorrow;
  }) || []).sort((a: any, b: any) => 
    new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  // Find next session
  const now = new Date();
  const nextSession = todaysSessions.find((session: any) => 
    new Date(session.scheduledDate) > now
  );

  // Check if currently in a session
  const currentSession = todaysSessions.find((session: any) => {
    const sessionStart = new Date(session.scheduledDate);
    const sessionEnd = new Date(sessionStart.getTime() + (session.duration || 60) * 60000);
    return now >= sessionStart && now <= sessionEnd;
  });

  // Calculate time until next session
  const getTimeUntilSession = (session: any) => {
    if (!session) return null;
    const sessionTime = new Date(session.scheduledDate);
    const diff = sessionTime.getTime() - currentTime.getTime();
    if (diff < 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Filter clients by search
  const filteredClients = allClients?.filter((client: any) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Default values
  const coachStatsData = coachStats || {
    totalClients: 0,
    activeSessions: 0,
    completedSessions: 0,
    totalRevenue: 0,
  };

  const adminStatsData = adminStats || {
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeSessions: 0,
    pendingCrisisAlerts: 0,
    revenueMTD: 0,
    revenueGrowth: 0,
    usersByTier: { basic: 0, premium: 0, elite: 0 },
  };

  // Video/Audio testing functions
  const setupAudioMonitoring = (stream: MediaStream) => {
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
  };

  const testEquipment = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      setMediaStream(stream);
      setIsTestingEquipment(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setupAudioMonitoring(stream);
    } catch (error: any) {
      console.error('Equipment test failed:', error);
      alert(`Camera/Microphone access failed: ${error.message}`);
    }
  };

  const stopTest = () => {
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
    
    setIsTestingEquipment(false);
    setAudioLevel(0);
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTest();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Control Center
                </h1>
                <p className="text-xs text-muted-foreground">Coaching Command</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              {/* Crisis Alert */}
              {adminStatsData.pendingCrisisAlerts > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {adminStatsData.pendingCrisisAlerts}
                </Badge>
              )}

              {/* Sessions Today */}
              <Badge variant="outline" className="text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {todaysSessions.length} Today
              </Badge>

              {/* Revenue */}
              <Badge variant="outline" className="text-sm hidden md:flex">
                <DollarSign className="h-3 w-3 mr-1" />
                ${adminStatsData.revenueMTD.toLocaleString()}
              </Badge>

              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* HERO SECTION: TODAY'S SESSIONS */}
        <div className="mb-8">
          {/* Crisis Alert Banner */}
          {adminStatsData.pendingCrisisAlerts > 0 && (
            <Card className="border-l-4 border-l-red-500 bg-red-50 mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <div>
                      <CardTitle className="text-red-900">
                        {adminStatsData.pendingCrisisAlerts} Crisis Alert{adminStatsData.pendingCrisisAlerts !== 1 ? 's' : ''}
                      </CardTitle>
                      <CardDescription className="text-red-700">
                        Immediate attention required
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setActiveTab("admin")}>
                    <Bell className="h-4 w-4 mr-2" />
                    View Now
                  </Button>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* VIDEO PREVIEW & EQUIPMENT TEST */}
          <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-purple-600" />
                    Equipment Check
                  </CardTitle>
                  <CardDescription>
                    Test your camera and microphone before sessions
                  </CardDescription>
                </div>
                {isTestingEquipment && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    Testing Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Preview - Large */}
                <div className="lg:col-span-2">
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video shadow-xl">
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
                          <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Camera preview will appear here</p>
                          <p className="text-sm mt-2">Click "Test Equipment" to start</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Video Controls Overlay */}
                    {mediaStream && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                        <Button
                          size="lg"
                          variant={videoEnabled ? "default" : "destructive"}
                          onClick={toggleVideo}
                          className="shadow-lg"
                        >
                          {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>
                        <Button
                          size="lg"
                          variant={audioEnabled ? "default" : "destructive"}
                          onClick={toggleAudio}
                          className="shadow-lg"
                        >
                          {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls & Audio Level */}
                <div className="space-y-4">
                  {/* Audio Level Indicator */}
                  {mediaStream && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          Microphone Level
                        </span>
                        <span className="font-mono">{Math.round(audioLevel)}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-100 ${
                            audioLevel > 70 ? 'bg-green-500' : audioLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {audioLevel > 70 ? '✅ Great signal' : audioLevel > 30 ? '⚠️ Speak louder' : '❌ Too quiet'}
                      </p>
                    </div>
                  )}

                  {/* Test Buttons */}
                  <div className="space-y-3">
                    {!isTestingEquipment ? (
                      <Button
                        onClick={testEquipment}
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Test Equipment
                      </Button>
                    ) : (
                      <Button
                        onClick={stopTest}
                        size="lg"
                        variant="outline"
                        className="w-full"
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Stop Test
                      </Button>
                    )}
                  </div>

                  {/* Status Indicators */}
                  {mediaStream && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            videoEnabled ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          Camera
                        </span>
                        <span className="font-medium">{videoEnabled ? 'ON' : 'OFF'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            audioEnabled ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          Microphone
                        </span>
                        <span className="font-medium">{audioEnabled ? 'ON' : 'OFF'}</span>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-900 mb-1">💡 Pre-Flight Checklist:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>✓ Camera shows clear image</li>
                      <li>✓ Audio level responds to voice</li>
                      <li>✓ Good lighting on your face</li>
                      <li>✓ Quiet environment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI COACHING TELEPROMPTER - PROMINENT SECTION */}
          <AITeleprompter
            clientName={currentSession?.clientName || nextSession?.clientName || "Client"}
            sessionType={currentSession?.sessionType || nextSession?.sessionType || "General Coaching"}
            className="mb-6"
          />

          {/* Session Status Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {currentSession ? (
                  <span className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    IN SESSION NOW
                  </span>
                ) : nextSession ? (
                  `Next Session in ${getTimeUntilSession(nextSession)}`
                ) : todaysSessions.length > 0 ? (
                  "Today's Sessions Complete"
                ) : (
                  "No Sessions Today"
                )}
              </h2>
              <p className="text-muted-foreground">
                {currentSession 
                  ? `Coaching ${currentSession.clientName || 'Client'}`
                  : nextSession
                  ? `Up next: ${nextSession.clientName || 'Client'}`
                  : todaysSessions.length > 0
                  ? "All sessions completed - great work!"
                  : "Enjoy your free time! 🎉"
                }
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Link href="/coach/availability">
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Availability
                </Button>
              </Link>
              <Link href="/my-sessions">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  All Sessions
                </Button>
              </Link>
            </div>
          </div>

          {/* TODAY'S SESSIONS - LARGE CARDS */}
          {todaysSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todaysSessions.map((session: any) => {
                const sessionTime = new Date(session.scheduledDate);
                const isNow = currentSession?.id === session.id;
                const isPast = sessionTime < now && !isNow;
                const timeUntil = getTimeUntilSession(session);

                return (
                  <Card 
                    key={session.id} 
                    className={`relative overflow-hidden transition-all ${
                      isNow 
                        ? 'border-red-500 border-2 shadow-2xl scale-105' 
                        : isPast
                        ? 'opacity-60'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    {isNow && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 animate-pulse" />
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Client Avatar - LARGE */}
                        <div className={`h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 ${
                          isNow ? 'ring-4 ring-red-500 ring-offset-2' : ''
                        }`}>
                          {session.clientName?.charAt(0) || 'C'}
                        </div>

                        {/* Session Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold truncate">
                                {session.clientName || 'Client'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {sessionTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration || 60} min
                              </p>
                            </div>
                            {isNow && (
                              <Badge variant="destructive" className="animate-pulse">
                                LIVE
                              </Badge>
                            )}
                            {!isNow && !isPast && timeUntil && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                {timeUntil}
                              </Badge>
                            )}
                            {isPast && (
                              <Badge variant="secondary">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Done
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <Badge>{session.sessionType || 'Coaching'}</Badge>
                            {session.isFirstSession && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                First Session
                              </Badge>
                            )}
                          </div>

                          {/* BIG START BUTTON */}
                          <Link href={`/live-session?sessionId=${session.id}&clientId=${session.clientId}`}>
                            <Button 
                              size="lg" 
                              className={`w-full text-lg ${
                                isNow 
                                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                                  : isPast
                                  ? 'bg-gray-400'
                                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                              }`}
                              disabled={isPast}
                            >
                              {isNow ? (
                                <>
                                  <Zap className="h-5 w-5 mr-2" />
                                  JOIN NOW - IN PROGRESS
                                </>
                              ) : isPast ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 mr-2" />
                                  Session Complete
                                </>
                              ) : (
                                <>
                                  <Play className="h-5 w-5 mr-2" />
                                  START SESSION
                                </>
                              )}
                            </Button>
                          </Link>

                          {/* Client Quick Info */}
                          {session.clientEmail && (
                            <p className="text-xs text-muted-foreground mt-2 truncate">
                              {session.clientEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Sessions Scheduled Today</h3>
                  <p className="text-muted-foreground mb-6">
                    Enjoy your free time or check your upcoming schedule
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/my-sessions">
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        View All Sessions
                      </Button>
                    </Link>
                    <Link href="/coach/availability">
                      <Button>
                        <Clock className="h-4 w-4 mr-2" />
                        Set Availability
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-purple-600" />
                <Badge variant="secondary">+{adminStatsData.newUsersThisMonth}</Badge>
              </div>
              <CardTitle className="text-3xl font-bold mt-2">{coachStatsData.totalClients}</CardTitle>
              <CardDescription>Total Clients</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-green-600" />
                <Badge variant="secondary" className="text-green-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{adminStatsData.revenueGrowth}%
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold mt-2">${adminStatsData.revenueMTD.toLocaleString()}</CardTitle>
              <CardDescription>Revenue MTD</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold mt-2">{coachStatsData.completedSessions}</CardTitle>
              <CardDescription>Sessions Complete</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-3xl font-bold mt-2">{adminStatsData.activeSessions}</CardTitle>
              <CardDescription>Active Now</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* SECONDARY TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* CLIENTS TAB */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Clients</CardTitle>
                    <CardDescription>Manage your coaching clients</CardDescription>
                  </div>
                  <Link href="/clients/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3">
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No clients found</p>
                    </div>
                  ) : (
                    filteredClients.map((client: any) => (
                      <Link key={client.id} href={`/clients/${client.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                              {client.name?.charAt(0) || 'C'}
                            </div>
                            <div>
                              <p className="font-semibold">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                          <Badge variant={client.subscriptionTier === 'elite' ? 'default' : 'secondary'}>
                            {client.subscriptionTier || 'Free'}
                          </Badge>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant={timeRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("7d")}
              >
                7 Days
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30d")}
              >
                30 Days
              </Button>
              <Button
                variant={timeRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("90d")}
              >
                90 Days
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Tiers</CardTitle>
                <CardDescription>Distribution by subscription level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Basic ($29/mo)</span>
                      <span className="text-sm text-muted-foreground">{adminStatsData.usersByTier.basic} users</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(adminStatsData.usersByTier.basic / (adminStatsData.totalUsers || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Premium ($149/mo)</span>
                      <span className="text-sm text-muted-foreground">{adminStatsData.usersByTier.premium} users</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ width: `${(adminStatsData.usersByTier.premium / (adminStatsData.totalUsers || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Elite ($299/mo)</span>
                      <span className="text-sm text-muted-foreground">{adminStatsData.usersByTier.elite} users</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                        style={{ width: `${(adminStatsData.usersByTier.elite / (adminStatsData.totalUsers || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADMIN TAB */}
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Database</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">AI Services</p>
                        <p className="text-sm text-muted-foreground">OpenAI</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {crisisAlerts && crisisAlerts.length > 0 && (
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-red-900">Crisis Alerts</CardTitle>
                  <CardDescription>Clients requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {crisisAlerts.map((alert: any) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium text-red-900">{alert.clientName}</p>
                            <p className="text-sm text-red-700">{alert.reason}</p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm">Contact</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/setup">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Settings className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle className="text-lg">Platform Setup</CardTitle>
                    <CardDescription>Configure system</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/ai-monitoring">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Brain className="h-8 w-8 text-purple-500 mb-2" />
                    <CardTitle className="text-lg">AI Monitoring</CardTitle>
                    <CardDescription>View conversations</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
