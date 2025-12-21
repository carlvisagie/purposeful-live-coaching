import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Video, 
  Mic, 
  FileText, 
  Scissors, 
  Upload,
  Youtube,
  Radio,
  Sparkles,
  Zap,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  AlertCircle,
  Film,
  Music,
  MessageSquare,
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";

interface ContentItem {
  id: string;
  sessionId: string;
  sessionDate: string;
  status: 'processing' | 'ready' | 'published' | 'failed';
  progress: number;
  currentStep: string;
  title: string;
  description: string;
  transcript: string;
  cleanedAudio: string | null;
  highlights: Highlight[];
  youtubeScript: string;
  podcastScript: string;
  shortClips: ShortClip[];
  bRollSuggestions: BRollSuggestion[];
  seoData: SEOData;
  publishedTo: string[];
  createdAt: string;
}

interface Highlight {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  type: 'insight' | 'breakthrough' | 'emotional' | 'quotable';
  score: number;
}

interface ShortClip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  hook: string;
  platform: 'tiktok' | 'reels' | 'shorts';
  status: 'pending' | 'ready';
}

interface BRollSuggestion {
  timestamp: number;
  duration: number;
  suggestion: string;
  keywords: string[];
  type: 'nature' | 'abstract' | 'lifestyle' | 'tech' | 'emotion';
}

interface SEOData {
  title: string;
  description: string;
  tags: string[];
  thumbnailText: string;
  chapters: { time: string; title: string }[];
}

interface PipelineSettings {
  autoProcess: boolean;
  autoPublishYouTube: boolean;
  autoPublishPodcast: boolean;
  generateShortClips: boolean;
  includeBRollSuggestions: boolean;
  cleanAudio: boolean;
  removeFillerWords: boolean;
  youtubeChannelId: string;
  podcastRssFeed: string;
  defaultThumbnailStyle: string;
}

export default function ContentPipeline() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [settings, setSettings] = useState<PipelineSettings>({
    autoProcess: true,
    autoPublishYouTube: false,
    autoPublishPodcast: false,
    generateShortClips: true,
    includeBRollSuggestions: true,
    cleanAudio: true,
    removeFillerWords: true,
    youtubeChannelId: "",
    podcastRssFeed: "",
    defaultThumbnailStyle: "faces-with-text"
  });

  // Fetch content queue
  const { data: contentQueue, isLoading, refetch } = useQuery({
    queryKey: ["/api/content-pipeline/queue"],
    queryFn: async () => {
      const res = await fetch("/api/content-pipeline/queue");
      if (!res.ok) throw new Error("Failed to fetch queue");
      return res.json() as Promise<ContentItem[]>;
    },
    refetchInterval: 5000 // Poll every 5 seconds for updates
  });

  // Process session mutation
  const processSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch("/api/content-pipeline/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      if (!res.ok) throw new Error("Failed to start processing");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Processing started!", description: "Your content is being generated autonomously." });
      refetch();
    }
  });

  // Publish content mutation
  const publishContent = useMutation({
    mutationFn: async ({ itemId, platforms }: { itemId: string; platforms: string[] }) => {
      const res = await fetch("/api/content-pipeline/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, platforms })
      });
      if (!res.ok) throw new Error("Failed to publish");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Published!", description: "Your content is now live." });
      refetch();
    }
  });

  // Save settings mutation
  const saveSettings = useMutation({
    mutationFn: async (newSettings: PipelineSettings) => {
      const res = await fetch("/api/content-pipeline/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Settings saved!", description: "Your pipeline settings have been updated." });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'published': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'ready': return <CheckCircle2 className="h-4 w-4" />;
      case 'published': return <Upload className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Mock data for demo
  const mockQueue: ContentItem[] = [
    {
      id: "1",
      sessionId: "session-123",
      sessionDate: "2025-12-21T10:00:00Z",
      status: "ready",
      progress: 100,
      currentStep: "Complete",
      title: "Overcoming Anxiety: A Real Conversation",
      description: "In this episode, Besarta and Carl discuss practical techniques for managing anxiety...",
      transcript: "Full transcript here...",
      cleanedAudio: "/audio/cleaned-session-123.mp3",
      highlights: [
        { id: "h1", startTime: 120, endTime: 180, text: "The physiological sigh changed everything for me", type: "breakthrough", score: 95 },
        { id: "h2", startTime: 340, endTime: 400, text: "It's not about being perfect, it's about progress", type: "quotable", score: 88 }
      ],
      youtubeScript: "Full YouTube script with intro, sections, and outro...",
      podcastScript: "Podcast version with show notes...",
      shortClips: [
        { id: "c1", title: "The 5-Second Anxiety Hack", startTime: 120, endTime: 150, hook: "This breathing technique changed my life", platform: "tiktok", status: "ready" },
        { id: "c2", title: "Progress Over Perfection", startTime: 340, endTime: 370, hook: "Stop trying to be perfect", platform: "reels", status: "ready" }
      ],
      bRollSuggestions: [
        { timestamp: 60, duration: 5, suggestion: "Calming nature scene - forest or ocean", keywords: ["nature", "calm", "peaceful"], type: "nature" },
        { timestamp: 180, duration: 3, suggestion: "Person taking deep breath", keywords: ["breathing", "meditation", "wellness"], type: "lifestyle" }
      ],
      seoData: {
        title: "The 5-Minute Anxiety Hack That Actually Works | Purposeful Living",
        description: "Besarta shares the exact breathing technique that helped her overcome anxiety attacks...",
        tags: ["anxiety", "mental health", "breathing techniques", "wellness", "self-help"],
        thumbnailText: "ANXIETY HACK",
        chapters: [
          { time: "0:00", title: "Introduction" },
          { time: "2:00", title: "My Anxiety Story" },
          { time: "5:30", title: "The Science Behind It" },
          { time: "8:00", title: "The Technique" },
          { time: "12:00", title: "How to Practice" }
        ]
      },
      publishedTo: [],
      createdAt: "2025-12-21T11:00:00Z"
    },
    {
      id: "2",
      sessionId: "session-124",
      sessionDate: "2025-12-21T14:00:00Z",
      status: "processing",
      progress: 45,
      currentStep: "Generating highlights...",
      title: "Processing...",
      description: "",
      transcript: "",
      cleanedAudio: null,
      highlights: [],
      youtubeScript: "",
      podcastScript: "",
      shortClips: [],
      bRollSuggestions: [],
      seoData: { title: "", description: "", tags: [], thumbnailText: "", chapters: [] },
      publishedTo: [],
      createdAt: "2025-12-21T15:00:00Z"
    }
  ];

  const displayQueue = contentQueue || mockQueue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              Autonomous Content Pipeline
            </h1>
            <p className="text-purple-200 mt-1">
              Session → Content → Published. Fully automatic.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Pipeline Active
            </Badge>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Processing</p>
                  <p className="text-2xl font-bold text-white">{displayQueue.filter(i => i.status === 'processing').length}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-yellow-400 animate-spin" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Ready to Publish</p>
                  <p className="text-2xl font-bold text-white">{displayQueue.filter(i => i.status === 'ready').length}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Published</p>
                  <p className="text-2xl font-bold text-white">{displayQueue.filter(i => i.status === 'published').length}</p>
                </div>
                <Upload className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Short Clips</p>
                  <p className="text-2xl font-bold text-white">{displayQueue.reduce((acc, i) => acc + i.shortClips.length, 0)}</p>
                </div>
                <Scissors className="h-8 w-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10">
            <TabsTrigger value="queue" className="data-[state=active]:bg-purple-600">
              <Video className="h-4 w-4 mr-2" />
              Content Queue
            </TabsTrigger>
            <TabsTrigger value="clips" className="data-[state=active]:bg-purple-600">
              <Scissors className="h-4 w-4 mr-2" />
              Short Clips
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Content Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Queue List */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content Queue</CardTitle>
                    <CardDescription className="text-purple-200">
                      Sessions being processed into content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {displayQueue.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedItem?.id === item.id 
                            ? 'bg-purple-600/50 border border-purple-400' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getStatusColor(item.status)} text-white`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 capitalize">{item.status}</span>
                          </Badge>
                          <span className="text-xs text-purple-300">
                            {new Date(item.sessionDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white font-medium truncate">
                          {item.title || "Processing..."}
                        </p>
                        {item.status === 'processing' && (
                          <div className="mt-2">
                            <Progress value={item.progress} className="h-2" />
                            <p className="text-xs text-purple-300 mt-1">{item.currentStep}</p>
                          </div>
                        )}
                        {item.status === 'ready' && (
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Film className="h-3 w-3 mr-1" />
                              {item.shortClips.length} clips
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {item.highlights.length} highlights
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Content Detail */}
              <div className="lg:col-span-2">
                {selectedItem ? (
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{selectedItem.title}</CardTitle>
                          <CardDescription className="text-purple-200">
                            Session from {new Date(selectedItem.sessionDate).toLocaleString()}
                          </CardDescription>
                        </div>
                        {selectedItem.status === 'ready' && (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => publishContent.mutate({ itemId: selectedItem.id, platforms: ['youtube'] })}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Youtube className="h-4 w-4 mr-2" />
                              Publish to YouTube
                            </Button>
                            <Button 
                              onClick={() => publishContent.mutate({ itemId: selectedItem.id, platforms: ['podcast'] })}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Radio className="h-4 w-4 mr-2" />
                              Publish Podcast
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* SEO Data */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-400" />
                          SEO Optimized Content
                        </h3>
                        <div className="bg-white/5 p-4 rounded-lg space-y-3">
                          <div>
                            <Label className="text-purple-200">Title</Label>
                            <Input 
                              value={selectedItem.seoData.title} 
                              className="bg-white/10 border-white/20 text-white mt-1"
                              readOnly
                            />
                          </div>
                          <div>
                            <Label className="text-purple-200">Description</Label>
                            <Textarea 
                              value={selectedItem.seoData.description} 
                              className="bg-white/10 border-white/20 text-white mt-1"
                              rows={3}
                              readOnly
                            />
                          </div>
                          <div>
                            <Label className="text-purple-200">Tags</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedItem.seoData.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-400" />
                          AI-Detected Highlights
                        </h3>
                        <div className="space-y-2">
                          {selectedItem.highlights.map((highlight) => (
                            <div key={highlight.id} className="bg-white/5 p-3 rounded-lg flex items-start gap-3">
                              <Badge className={
                                highlight.type === 'breakthrough' ? 'bg-green-600' :
                                highlight.type === 'quotable' ? 'bg-blue-600' :
                                highlight.type === 'emotional' ? 'bg-pink-600' :
                                'bg-purple-600'
                              }>
                                {highlight.type}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-white">"{highlight.text}"</p>
                                <p className="text-xs text-purple-300 mt-1">
                                  {Math.floor(highlight.startTime / 60)}:{(highlight.startTime % 60).toString().padStart(2, '0')} - 
                                  {Math.floor(highlight.endTime / 60)}:{(highlight.endTime % 60).toString().padStart(2, '0')}
                                  <span className="ml-2">Score: {highlight.score}%</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* B-Roll Suggestions */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Film className="h-5 w-5 text-cyan-400" />
                          B-Roll Suggestions
                        </h3>
                        <div className="space-y-2">
                          {selectedItem.bRollSuggestions.map((broll, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded-lg flex items-center gap-3">
                              <div className="text-center min-w-[60px]">
                                <p className="text-white font-mono">
                                  {Math.floor(broll.timestamp / 60)}:{(broll.timestamp % 60).toString().padStart(2, '0')}
                                </p>
                                <p className="text-xs text-purple-300">{broll.duration}s</p>
                              </div>
                              <div className="flex-1">
                                <p className="text-white">{broll.suggestion}</p>
                                <div className="flex gap-1 mt-1">
                                  {broll.keywords.map((kw, j) => (
                                    <Badge key={j} variant="outline" className="text-xs">{kw}</Badge>
                                  ))}
                                </div>
                              </div>
                              <Badge className="bg-cyan-600">{broll.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chapters */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-orange-400" />
                          Video Chapters
                        </h3>
                        <div className="bg-white/5 p-4 rounded-lg">
                          {selectedItem.seoData.chapters.map((chapter, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                              <span className="text-purple-300 font-mono w-12">{chapter.time}</span>
                              <span className="text-white">{chapter.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/10 border-white/20 h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Video className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-white text-lg">Select a content item to view details</p>
                      <p className="text-purple-300 mt-2">Or wait for new sessions to be processed</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Short Clips Tab */}
          <TabsContent value="clips" className="space-y-4">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-pink-400" />
                  Auto-Generated Short Clips
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Ready for TikTok, Instagram Reels, and YouTube Shorts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayQueue.flatMap(item => item.shortClips).map((clip) => (
                    <div key={clip.id} className="bg-white/5 rounded-lg overflow-hidden">
                      <div className="aspect-[9/16] bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <div className="p-4">
                        <Badge className={
                          clip.platform === 'tiktok' ? 'bg-black' :
                          clip.platform === 'reels' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                          'bg-red-600'
                        }>
                          {clip.platform}
                        </Badge>
                        <h4 className="text-white font-medium mt-2">{clip.title}</h4>
                        <p className="text-purple-300 text-sm mt-1">"{clip.hook}"</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1 bg-purple-600">
                            <Upload className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Total Videos Created</span>
                      <span className="text-white font-bold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Total Podcast Episodes</span>
                      <span className="text-white font-bold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Short Clips Generated</span>
                      <span className="text-white font-bold">48</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Hours of Content</span>
                      <span className="text-white font-bold">8.5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Time Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-6xl font-bold text-green-400">47</p>
                    <p className="text-purple-200 mt-2">Hours saved this month</p>
                    <p className="text-sm text-purple-300 mt-4">
                      Based on average 4 hours per video for manual editing
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Pipeline Settings
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Configure your autonomous content pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Automation Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Automation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto-Process Sessions</Label>
                        <p className="text-sm text-purple-300">Automatically process sessions when they end</p>
                      </div>
                      <Switch 
                        checked={settings.autoProcess}
                        onCheckedChange={(checked) => setSettings({...settings, autoProcess: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto-Publish to YouTube</Label>
                        <p className="text-sm text-purple-300">Automatically publish when processing completes</p>
                      </div>
                      <Switch 
                        checked={settings.autoPublishYouTube}
                        onCheckedChange={(checked) => setSettings({...settings, autoPublishYouTube: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto-Publish Podcast</Label>
                        <p className="text-sm text-purple-300">Automatically publish podcast episodes</p>
                      </div>
                      <Switch 
                        checked={settings.autoPublishPodcast}
                        onCheckedChange={(checked) => setSettings({...settings, autoPublishPodcast: checked})}
                      />
                    </div>
                  </div>
                </div>

                {/* Content Generation Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Content Generation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Generate Short Clips</Label>
                        <p className="text-sm text-purple-300">Create TikTok/Reels/Shorts from highlights</p>
                      </div>
                      <Switch 
                        checked={settings.generateShortClips}
                        onCheckedChange={(checked) => setSettings({...settings, generateShortClips: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Include B-Roll Suggestions</Label>
                        <p className="text-sm text-purple-300">AI suggests stock footage for each section</p>
                      </div>
                      <Switch 
                        checked={settings.includeBRollSuggestions}
                        onCheckedChange={(checked) => setSettings({...settings, includeBRollSuggestions: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Clean Audio</Label>
                        <p className="text-sm text-purple-300">Remove background noise and enhance quality</p>
                      </div>
                      <Switch 
                        checked={settings.cleanAudio}
                        onCheckedChange={(checked) => setSettings({...settings, cleanAudio: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Remove Filler Words</Label>
                        <p className="text-sm text-purple-300">Automatically remove ums, ahs, and pauses</p>
                      </div>
                      <Switch 
                        checked={settings.removeFillerWords}
                        onCheckedChange={(checked) => setSettings({...settings, removeFillerWords: checked})}
                      />
                    </div>
                  </div>
                </div>

                {/* Platform Connections */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Platform Connections</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">YouTube Channel ID</Label>
                      <Input 
                        value={settings.youtubeChannelId}
                        onChange={(e) => setSettings({...settings, youtubeChannelId: e.target.value})}
                        placeholder="Enter your YouTube channel ID"
                        className="bg-white/10 border-white/20 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Podcast RSS Feed</Label>
                      <Input 
                        value={settings.podcastRssFeed}
                        onChange={(e) => setSettings({...settings, podcastRssFeed: e.target.value})}
                        placeholder="Enter your podcast RSS feed URL"
                        className="bg-white/10 border-white/20 text-white mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => saveSettings.mutate(settings)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
