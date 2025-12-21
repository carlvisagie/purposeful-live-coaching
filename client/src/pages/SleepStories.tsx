import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Sparkles,
  Clock,
  Heart,
  TreePine,
  Train,
  Home,
  Wand2,
  Star,
  Loader2,
  ChevronRight
} from "lucide-react";

export default function SleepStories() {
  const [activeTab, setActiveTab] = useState("library");
  const [selectedTheme, setSelectedTheme] = useState("nature");
  const [selectedDuration, setSelectedDuration] = useState<"short" | "medium" | "long">("medium");
  const [selectedVoice, setSelectedVoice] = useState("nova");
  const [includeBreathing, setIncludeBreathing] = useState(true);
  const [includeRelaxation, setIncludeRelaxation] = useState(true);
  const [userName, setUserName] = useState("");
  const [currentMood, setCurrentMood] = useState("");
  const [dayHighlight, setDayHighlight] = useState("");
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Fetch options
  const { data: options } = trpc.sleepStories.getOptions.useQuery();
  const { data: library } = trpc.sleepStories.getLibrary.useQuery();

  // Generate story mutation
  const generateStory = trpc.sleepStories.generateStory.useMutation({
    onSuccess: (data) => {
      if (data.success && data.story) {
        setGeneratedStory(data.story);
        setActiveTab("player");
      }
    }
  });

  const themeIcons: Record<string, React.ReactNode> = {
    nature: <TreePine className="h-5 w-5" />,
    travel: <Train className="h-5 w-5" />,
    cozy: <Home className="h-5 w-5" />,
    fantasy: <Wand2 className="h-5 w-5" />,
    space: <Star className="h-5 w-5" />
  };

  const handleGenerateStory = () => {
    generateStory.mutate({
      theme: selectedTheme as any,
      duration: selectedDuration,
      userName: userName || undefined,
      includeBreathing,
      includeRelaxation,
      currentMood: currentMood || undefined,
      dayHighlight: dayHighlight || undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30" />
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="h-10 w-10 text-indigo-300" />
            <h1 className="text-4xl font-bold text-white">Sleep Stories</h1>
          </div>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            AI-personalized bedtime stories that adapt to your mood, reference your day, 
            and guide you gently into peaceful sleep
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-200">
              <Sparkles className="h-3 w-3 mr-1" />
              10X Better Than Calm
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="library" className="text-slate-300 data-[state=active]:text-white">
              Library
            </TabsTrigger>
            <TabsTrigger value="create" className="text-slate-300 data-[state=active]:text-white">
              Create Your Own
            </TabsTrigger>
            <TabsTrigger value="player" className="text-slate-300 data-[state=active]:text-white">
              Now Playing
            </TabsTrigger>
          </TabsList>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            {/* Featured Stories */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Featured Stories</h2>
              <div className="grid gap-4">
                {library?.featured.map((story) => (
                  <Card key={story.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        {themeIcons[story.theme]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{story.title}</h3>
                        <p className="text-sm text-slate-400">{story.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {story.duration === "short" ? "5 min" : story.duration === "medium" ? "15 min" : "30 min"}
                          </Badge>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                        <Play className="h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Browse by Theme</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {library?.categories.map((category) => (
                  <Card key={category.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-2">
                        {themeIcons[category.id]}
                      </div>
                      <h3 className="font-medium text-white text-sm">{category.name}</h3>
                      <p className="text-xs text-slate-500">{category.count} stories</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  Create Your Personalized Story
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Our AI will generate a unique story just for you, incorporating your preferences and mood
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Story Theme</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {options?.themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedTheme === theme.id
                            ? "bg-indigo-500/20 border-indigo-500 text-white"
                            : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {themeIcons[theme.id]}
                          <span className="text-xs">{theme.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Duration</Label>
                  <Select value={selectedDuration} onValueChange={(v) => setSelectedDuration(v as any)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (5 minutes)</SelectItem>
                      <SelectItem value="medium">Medium (15 minutes)</SelectItem>
                      <SelectItem value="long">Long (30 minutes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Narrator Voice</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options?.voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name} - {voice.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Therapeutic Elements */}
                <div className="space-y-4">
                  <Label className="text-slate-300">Therapeutic Elements</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Breathing Cues</p>
                      <p className="text-xs text-slate-500">Include gentle breathing guidance</p>
                    </div>
                    <Switch checked={includeBreathing} onCheckedChange={setIncludeBreathing} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Relaxation Prompts</p>
                      <p className="text-xs text-slate-500">Include progressive relaxation cues</p>
                    </div>
                    <Switch checked={includeRelaxation} onCheckedChange={setIncludeRelaxation} />
                  </div>
                </div>

                {/* Personalization */}
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <Label className="text-slate-300">Personalization (Optional)</Label>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Your Name</Label>
                    <Input 
                      placeholder="So the story can address you personally"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">How are you feeling?</Label>
                    <Input 
                      placeholder="e.g., tired, anxious, peaceful"
                      value={currentMood}
                      onChange={(e) => setCurrentMood(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">A highlight from your day</Label>
                    <Textarea 
                      placeholder="Something meaningful that happened today (the story may reference it)"
                      value={dayHighlight}
                      onChange={(e) => setDayHighlight(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerateStory}
                  disabled={generateStory.isPending}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  {generateStory.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Your Story...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate My Story
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Player Tab */}
          <TabsContent value="player" className="space-y-6">
            {generatedStory ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  {/* Player Controls */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Button 
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mb-8">
                    <Progress value={33} className="h-1 bg-slate-700" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>5:23</span>
                      <span>15:00</span>
                    </div>
                  </div>

                  {/* Story Preview */}
                  <div className="bg-slate-900/50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {generatedStory}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Moon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Story Playing</h3>
                  <p className="text-slate-400 mb-6">
                    Choose a story from the library or create your own personalized story
                  </p>
                  <Button 
                    onClick={() => setActiveTab("create")}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  >
                    Create Your Story
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
