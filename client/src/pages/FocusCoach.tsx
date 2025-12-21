import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2, 
  VolumeX,
  Sparkles,
  Clock,
  Zap,
  Brain,
  Coffee,
  Timer,
  TrendingUp,
  Award,
  Music,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function FocusCoach() {
  const [activeTab, setActiveTab] = useState("session");
  const [selectedMode, setSelectedMode] = useState("pomodoro");
  const [selectedSoundscape, setSelectedSoundscape] = useState("lofi");
  const [task, setTask] = useState("");
  const [goal, setGoal] = useState("");
  const [enableVoiceCoach, setEnableVoiceCoach] = useState(true);
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [coachMessage, setCoachMessage] = useState("");
  const [distractionCount, setDistractionCount] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch options
  const { data: options } = trpc.focusCoach.getOptions.useQuery();
  const { data: stats } = trpc.focusCoach.getStats.useQuery({ period: "week" });

  // Mutations
  const startSession = trpc.focusCoach.startSession.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setCurrentSession(data.session);
        setCoachMessage(data.openingMessage);
        setTimeRemaining(data.session.duration * 60);
        setIsRunning(true);
      }
    }
  });

  const completeSession = trpc.focusCoach.completeSession.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setCoachMessage(data.completionMessage);
        setSessionsCompleted(prev => prev + 1);
        setIsRunning(false);
        setCurrentSession(null);
      }
    }
  });

  const getBreakGuidance = trpc.focusCoach.generateBreakGuidance.useMutation();

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const handleTimerComplete = () => {
    if (!isBreak && currentSession) {
      // Focus session complete, start break
      completeSession.mutate({
        sessionId: currentSession.id,
        actualDuration: currentSession.duration,
        task,
        goal,
        distractionCount,
        completedTask: false
      });
      setIsBreak(true);
      setTimeRemaining(currentSession.breakDuration * 60);
    } else {
      // Break complete
      setIsBreak(false);
      setIsRunning(false);
    }
  };

  const handleStartSession = () => {
    const mode = options?.modes.find(m => m.id === selectedMode);
    startSession.mutate({
      mode: selectedMode as any,
      soundscape: selectedSoundscape as any,
      task: task || undefined,
      goal: goal || undefined,
      enableVoiceCoach
    });
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsBreak(false);
    setCurrentSession(null);
    setCoachMessage("");
    const mode = options?.modes.find(m => m.id === selectedMode);
    setTimeRemaining((mode?.defaultDuration || 25) * 60);
  };

  const handleDistraction = () => {
    setDistractionCount(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    if (!currentSession) return 0;
    const totalSeconds = (isBreak ? currentSession.breakDuration : currentSession.duration) * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const modeIcons: Record<string, React.ReactNode> = {
    deep_work: <Brain className="h-5 w-5" />,
    pomodoro: <Timer className="h-5 w-5" />,
    sprint: <Zap className="h-5 w-5" />,
    flow: <Sparkles className="h-5 w-5" />,
    study: <Target className="h-5 w-5" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10" />
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-10 w-10 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">Focus Coach</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            AI-powered focus sessions with voice coaching, adaptive soundscapes, 
            and guided breaks to maximize your productivity
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200">
              <Sparkles className="h-3 w-3 mr-1" />
              10X Better Than Headspace Focus
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="session" className="text-slate-300 data-[state=active]:text-white">
              Focus Session
            </TabsTrigger>
            <TabsTrigger value="breaks" className="text-slate-300 data-[state=active]:text-white">
              Break Activities
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-slate-300 data-[state=active]:text-white">
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Session Tab */}
          <TabsContent value="session" className="space-y-6">
            {/* Timer Display */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                {/* Timer Circle */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 120}
                      strokeDashoffset={2 * Math.PI * 120 * (1 - getProgressPercent() / 100)}
                      className={isBreak ? "text-cyan-400" : "text-emerald-400"}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-mono font-bold text-white">
                      {formatTime(timeRemaining)}
                    </span>
                    <span className="text-sm text-slate-400 mt-2">
                      {isBreak ? "Break Time" : isRunning ? "Focus Time" : "Ready"}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  {!isRunning ? (
                    <Button 
                      size="lg"
                      onClick={handleStartSession}
                      disabled={startSession.isPending}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    >
                      {startSession.isPending ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-5 w-5 mr-2" />
                      )}
                      Start Focus Session
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="icon"
                        variant="outline"
                        onClick={handleReset}
                        className="border-slate-600 text-slate-400 hover:text-white"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                      <Button 
                        size="lg"
                        onClick={handlePauseResume}
                        className={isPaused 
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-500" 
                          : "bg-slate-600 hover:bg-slate-500"
                        }
                      >
                        {isPaused ? (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-5 w-5 mr-2" />
                            Pause
                          </>
                        )}
                      </Button>
                      <Button 
                        size="icon"
                        variant="outline"
                        onClick={handleDistraction}
                        className="border-slate-600 text-slate-400 hover:text-white"
                        title="Log a distraction"
                      >
                        <span className="text-xs">{distractionCount}</span>
                      </Button>
                    </>
                  )}
                </div>

                {/* Coach Message */}
                {coachMessage && (
                  <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                    <p className="text-slate-300 italic">"{coachMessage}"</p>
                  </div>
                )}

                {/* Session Info */}
                {currentSession && (
                  <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      {modeIcons[currentSession.mode]}
                      <span>{currentSession.modeName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Music className="h-4 w-4" />
                      <span>{currentSession.soundscapeName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{sessionsCompleted} completed</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Setup */}
            {!isRunning && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Session Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mode Selection */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">Focus Mode</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {options?.modes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setSelectedMode(mode.id);
                            setTimeRemaining(mode.defaultDuration * 60);
                          }}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedMode === mode.id
                              ? "bg-emerald-500/20 border-emerald-500 text-white"
                              : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {modeIcons[mode.id]}
                            <span className="text-xs">{mode.name}</span>
                            <span className="text-xs text-slate-500">{mode.defaultDuration}m</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Soundscape */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">Background Sound</Label>
                    <Select value={selectedSoundscape} onValueChange={setSelectedSoundscape}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {options?.soundscapes.map((soundscape) => (
                          <SelectItem key={soundscape.id} value={soundscape.id}>
                            {soundscape.name} - {soundscape.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Task & Goal */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">What are you working on?</Label>
                      <Input 
                        placeholder="e.g., Write report"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Session goal</Label>
                      <Input 
                        placeholder="e.g., Complete first draft"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Voice Coach Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">AI Voice Coach</p>
                      <p className="text-xs text-slate-500">Get encouraging messages during your session</p>
                    </div>
                    <Switch checked={enableVoiceCoach} onCheckedChange={setEnableVoiceCoach} />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Breaks Tab */}
          <TabsContent value="breaks" className="space-y-6">
            <div className="grid gap-4">
              {options?.breakActivities.map((activity) => (
                <Card key={activity.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
                      <Coffee className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{activity.name}</h3>
                      <p className="text-sm text-slate-400">{activity.description}</p>
                    </div>
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      {activity.duration} min
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.totalMinutes || 0}</p>
                  <p className="text-xs text-slate-400">Minutes This Week</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.totalSessions || 0}</p>
                  <p className="text-xs text-slate-400">Sessions</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.averageFocusScore || 0}</p>
                  <p className="text-xs text-slate-400">Focus Score</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.streak || 0}</p>
                  <p className="text-xs text-slate-400">Day Streak</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Most Productive Time</span>
                  <span className="text-white font-medium">{stats?.mostProductiveTime || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Favorite Mode</span>
                  <span className="text-white font-medium capitalize">{stats?.favoriteMode || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Favorite Soundscape</span>
                  <span className="text-white font-medium capitalize">{stats?.favoriteSoundscape || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Improvement</span>
                  <span className="text-emerald-400 font-medium">{stats?.improvement || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
