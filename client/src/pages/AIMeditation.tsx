import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Leaf, 
  Play, 
  Pause, 
  Volume2,
  Sparkles,
  Clock,
  Heart,
  Wind,
  Brain,
  Moon,
  Shield,
  Target,
  Loader2,
  ChevronRight,
  Flame,
  TrendingUp
} from "lucide-react";

export default function AIMeditation() {
  const [activeTab, setActiveTab] = useState("meditate");
  const [selectedType, setSelectedType] = useState("mindfulness");
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedBackground, setSelectedBackground] = useState("silence");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [currentMood, setCurrentMood] = useState("");
  const [intention, setIntention] = useState("");
  const [generatedSession, setGeneratedSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch options
  const { data: options } = trpc.aiMeditation.getOptions.useQuery();
  const { data: stats } = trpc.aiMeditation.getStats.useQuery({ period: "week" });

  // Mutations
  const generateSession = trpc.aiMeditation.generateSession.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedSession(data.session);
        setActiveTab("session");
      }
    }
  });

  const getQuickMeditation = trpc.aiMeditation.getQuickMeditation.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedSession({
          ...data.meditation,
          typeName: data.meditation.type,
          benefits: []
        });
        setActiveTab("session");
      }
    }
  });

  const typeIcons: Record<string, React.ReactNode> = {
    mindfulness: <Leaf className="h-5 w-5" />,
    breathing: <Wind className="h-5 w-5" />,
    body_scan: <Heart className="h-5 w-5" />,
    loving_kindness: <Heart className="h-5 w-5 text-pink-400" />,
    visualization: <Sparkles className="h-5 w-5" />,
    sleep: <Moon className="h-5 w-5" />,
    anxiety: <Shield className="h-5 w-5" />,
    focus: <Target className="h-5 w-5" />
  };

  const quickSituations = [
    { id: "stressed_at_work", label: "Stressed at Work", icon: <Flame className="h-4 w-4" /> },
    { id: "cant_sleep", label: "Can't Sleep", icon: <Moon className="h-4 w-4" /> },
    { id: "feeling_anxious", label: "Feeling Anxious", icon: <Shield className="h-4 w-4" /> },
    { id: "need_energy", label: "Need Energy", icon: <Sparkles className="h-4 w-4" /> },
    { id: "before_meeting", label: "Before a Meeting", icon: <Target className="h-4 w-4" /> },
    { id: "feeling_overwhelmed", label: "Overwhelmed", icon: <Brain className="h-4 w-4" /> }
  ];

  const handleGenerateSession = () => {
    generateSession.mutate({
      type: selectedType as any,
      duration: selectedDuration,
      background: selectedBackground,
      currentMood: currentMood || undefined,
      intention: intention || undefined,
      experienceLevel
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10" />
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-10 w-10 text-violet-400" />
            <h1 className="text-4xl font-bold text-white">AI Meditation</h1>
          </div>
          <p className="text-violet-200 text-lg max-w-2xl mx-auto">
            Real-time AI-guided meditation that adapts to your state, 
            responds to your needs, and learns what works best for you
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-200">
              <Sparkles className="h-3 w-3 mr-1" />
              10X Better Than Headspace
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="quick" className="text-slate-300 data-[state=active]:text-white">
              Quick Relief
            </TabsTrigger>
            <TabsTrigger value="meditate" className="text-slate-300 data-[state=active]:text-white">
              Meditate
            </TabsTrigger>
            <TabsTrigger value="session" className="text-slate-300 data-[state=active]:text-white">
              Session
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-slate-300 data-[state=active]:text-white">
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Quick Relief Tab */}
          <TabsContent value="quick" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">What do you need right now?</CardTitle>
                <CardDescription className="text-slate-400">
                  Get an instant meditation tailored to your current situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickSituations.map((situation) => (
                    <Button
                      key={situation.id}
                      variant="outline"
                      onClick={() => getQuickMeditation.mutate({ situation: situation.id as any })}
                      disabled={getQuickMeditation.isPending}
                      className="h-auto py-4 flex flex-col items-center gap-2 bg-slate-700/50 border-slate-600 text-white hover:bg-violet-500/20 hover:border-violet-500"
                    >
                      {situation.icon}
                      <span className="text-sm">{situation.label}</span>
                    </Button>
                  ))}
                </div>
                {getQuickMeditation.isPending && (
                  <div className="flex items-center justify-center mt-6">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
                    <span className="ml-2 text-slate-400">Creating your meditation...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meditate Tab */}
          <TabsContent value="meditate" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  Create Your Meditation
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Our AI will generate a personalized meditation session just for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Meditation Type</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {options?.types.slice(0, 8).map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedType === type.id
                            ? "bg-violet-500/20 border-violet-500 text-white"
                            : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {typeIcons[type.id]}
                          <span className="text-xs">{type.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {options?.types.find(t => t.id === selectedType) && (
                    <p className="text-sm text-slate-500 mt-2">
                      {options.types.find(t => t.id === selectedType)?.description}
                    </p>
                  )}
                </div>

                {/* Duration Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label className="text-slate-300">Duration</Label>
                    <span className="text-violet-400 font-medium">{selectedDuration} minutes</span>
                  </div>
                  <Slider
                    value={[selectedDuration]}
                    onValueChange={(v) => setSelectedDuration(v[0])}
                    min={3}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>3 min</span>
                    <span>30 min</span>
                  </div>
                </div>

                {/* Background Sound */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Background Sound</Label>
                  <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.backgrounds.map((bg) => (
                        <SelectItem key={bg.id} value={bg.id}>
                          {bg.name} - {bg.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={(v) => setExperienceLevel(v as any)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - More guidance</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Balanced</SelectItem>
                      <SelectItem value="advanced">Advanced - Minimal guidance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Personalization */}
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <Label className="text-slate-300">Personalization (Optional)</Label>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">How are you feeling?</Label>
                    <Input 
                      placeholder="e.g., anxious, tired, scattered"
                      value={currentMood}
                      onChange={(e) => setCurrentMood(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Set an intention</Label>
                    <Input 
                      placeholder="e.g., find calm, let go of stress, improve focus"
                      value={intention}
                      onChange={(e) => setIntention(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerateSession}
                  disabled={generateSession.isPending}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  {generateSession.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Your Meditation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Meditation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Tab */}
          <TabsContent value="session" className="space-y-6">
            {generatedSession ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        {typeIcons[generatedSession.type]}
                        {generatedSession.typeName}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {generatedSession.duration} minutes • {generatedSession.technique}
                      </CardDescription>
                    </div>
                    <Button 
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Benefits */}
                  {generatedSession.benefits?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {generatedSession.benefits.map((benefit: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-violet-300 border-violet-500/30">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Script */}
                  <div className="bg-slate-900/50 rounded-lg p-6 max-h-[500px] overflow-y-auto">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {generatedSession.script}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Leaf className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Session Active</h3>
                  <p className="text-slate-400 mb-6">
                    Create a personalized meditation or choose a quick relief option
                  </p>
                  <Button 
                    onClick={() => setActiveTab("meditate")}
                    className="bg-gradient-to-r from-violet-500 to-purple-600"
                  >
                    Create Meditation
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-violet-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.totalMinutes || 0}</p>
                  <p className="text-xs text-slate-400">Minutes This Week</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Leaf className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.totalSessions || 0}</p>
                  <p className="text-xs text-slate-400">Sessions</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.currentStreak || 0}</p>
                  <p className="text-xs text-slate-400">Day Streak</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats?.averageMoodImprovement || "N/A"}</p>
                  <p className="text-xs text-slate-400">Mood Improvement</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Favorite Type</span>
                  <span className="text-white font-medium capitalize">{stats?.favoriteType || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Most Effective Technique</span>
                  <span className="text-white font-medium capitalize">{stats?.mostEffectiveTechnique || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Best Time of Day</span>
                  <span className="text-white font-medium">{stats?.bestTimeOfDay || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Longest Streak</span>
                  <span className="text-white font-medium">{stats?.longestStreak || 0} days</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
