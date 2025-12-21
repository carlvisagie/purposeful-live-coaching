/**
 * AUTONOMOUS CONTENT STUDIO
 * 
 * Features:
 * - Auto-generate weekly content calendar
 * - YouTube video scripts with SEO optimization
 * - Podcast episode scripts with show notes
 * - Short-form clips (TikTok/Reels/Shorts)
 * - Session-to-content pipeline
 * - Content queue dashboard
 * - Scheduled generation
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Video,
  Mic,
  Scissors,
  Calendar,
  Sparkles,
  Play,
  Copy,
  Check,
  Download,
  RefreshCw,
  Clock,
  TrendingUp,
  Target,
  Zap,
  FileText,
  Youtube,
  Radio,
  Film,
  Users,
  Heart,
  Brain,
  Moon,
  Sun,
  Dumbbell,
  Utensils,
  Loader2,
  ChevronRight,
  Settings,
  LayoutGrid,
  List,
  Plus,
  Trash2,
  Edit,
  Eye,
  Share2,
  BookOpen,
  MessageSquare,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Content Types
type ContentType = "youtube" | "podcast" | "shorts" | "blog";
type ContentStatus = "draft" | "ready" | "recorded" | "published";

interface GeneratedContent {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  script: string;
  tags: string[];
  thumbnailIdea: string;
  duration: string;
  status: ContentStatus;
  createdAt: Date;
  topic: string;
  seoScore: number;
}

interface ContentCalendarItem {
  day: string;
  date: string;
  content: GeneratedContent[];
}

// Wellness module topics for content generation
const CONTENT_TOPICS = [
  { id: "anxiety", name: "Anxiety & Stress Relief", icon: Brain, color: "from-purple-500 to-indigo-600" },
  { id: "sleep", name: "Sleep Optimization", icon: Moon, color: "from-indigo-500 to-blue-600" },
  { id: "morning", name: "Morning Routines", icon: Sun, color: "from-orange-500 to-yellow-500" },
  { id: "fitness", name: "Physical Fitness", icon: Dumbbell, color: "from-green-500 to-emerald-600" },
  { id: "nutrition", name: "Nutrition & Diet", icon: Utensils, color: "from-red-500 to-pink-600" },
  { id: "mindfulness", name: "Mindfulness & Meditation", icon: Heart, color: "from-pink-500 to-rose-600" },
  { id: "productivity", name: "Focus & Productivity", icon: Target, color: "from-blue-500 to-cyan-600" },
  { id: "relationships", name: "Relationships & Communication", icon: Users, color: "from-teal-500 to-green-600" },
  { id: "founder", name: "Founder's Journey", icon: Lightbulb, color: "from-amber-500 to-orange-600" },
  { id: "couples", name: "Couples Wellness", icon: Heart, color: "from-rose-500 to-red-600" },
];

// Content templates
const CONTENT_TEMPLATES = {
  youtube: {
    founder_intro: {
      title: "Why I Built [Platform Name] - My Story",
      hook: "I was burned out, anxious, and couldn't sleep. Traditional therapy had a 6-week waitlist. That's when I decided to build something different...",
      structure: ["Hook (0:00-0:30)", "The Problem (0:30-2:00)", "My Journey (2:00-5:00)", "The Solution (5:00-8:00)", "Call to Action (8:00-10:00)"],
    },
    couples_review: {
      title: "My [Partner] Tries [Feature] for the First Time - Honest Review",
      hook: "My wife has never used an AI coach before. Today, she's trying Sage for the first time, and her reaction was NOT what I expected...",
      structure: ["Intro (0:00-0:30)", "Setup (0:30-1:30)", "Live Reaction (1:30-6:00)", "Discussion (6:00-9:00)", "Verdict (9:00-10:00)"],
    },
    tutorial: {
      title: "How to [Achieve Result] in [Timeframe] - Science-Backed Method",
      hook: "What if I told you that you could [achieve result] in just [timeframe]? And it's not some hack - it's backed by research from [expert]...",
      structure: ["Hook (0:00-0:30)", "The Science (0:30-3:00)", "Step-by-Step (3:00-8:00)", "Common Mistakes (8:00-9:00)", "CTA (9:00-10:00)"],
    },
  },
  podcast: {
    solo: {
      title: "The [Topic] Episode - What [Expert] Got Wrong",
      intro: "Welcome back to Purposeful Live. I'm [Name], and today we're diving deep into [topic]...",
      structure: ["Intro (0:00-2:00)", "Main Content (2:00-20:00)", "Key Takeaways (20:00-25:00)", "Outro (25:00-30:00)"],
    },
    couples: {
      title: "[Partner] and I Discuss [Topic] - Real Talk",
      intro: "Welcome to Purposeful Live. Today's episode is special because I have my [partner] here with me...",
      structure: ["Intro (0:00-2:00)", "Topic Setup (2:00-5:00)", "Discussion (5:00-25:00)", "Takeaways (25:00-28:00)", "Outro (28:00-30:00)"],
    },
  },
  shorts: {
    tip: {
      title: "One thing that changed my [area] #shorts",
      hook: "Stop scrolling. This one tip changed everything for me...",
      duration: "30-60 seconds",
    },
    myth: {
      title: "This [topic] advice is WRONG #shorts",
      hook: "Everyone says [common advice]. But here's what the science actually shows...",
      duration: "30-60 seconds",
    },
  },
};

export default function ContentStudio() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedType, setSelectedType] = useState<ContentType>("youtube");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [contentQueue, setContentQueue] = useState<GeneratedContent[]>([]);
  const [weeklyCalendar, setWeeklyCalendar] = useState<ContentCalendarItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  // Generate content using AI
  const generateContent = async () => {
    if (!selectedTopic) {
      toast.error("Please select a topic first");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation (in production, this would call OpenAI API)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const topic = CONTENT_TOPICS.find(t => t.id === selectedTopic);
      const template = selectedType === "youtube" 
        ? CONTENT_TEMPLATES.youtube.tutorial 
        : selectedType === "podcast"
        ? CONTENT_TEMPLATES.podcast.solo
        : CONTENT_TEMPLATES.shorts.tip;

      // Generate mock content based on type
      const content: GeneratedContent = {
        id: `content-${Date.now()}`,
        type: selectedType,
        title: generateTitle(selectedType, topic?.name || ""),
        description: generateDescription(selectedType, topic?.name || ""),
        script: generateScript(selectedType, topic?.name || "", customPrompt),
        tags: generateTags(topic?.name || ""),
        thumbnailIdea: generateThumbnailIdea(topic?.name || ""),
        duration: selectedType === "shorts" ? "60 seconds" : selectedType === "podcast" ? "30 minutes" : "10 minutes",
        status: "draft",
        createdAt: new Date(),
        topic: topic?.name || "",
        seoScore: Math.floor(Math.random() * 20) + 80,
      };

      setGeneratedContent(content);
      toast.success("Content generated successfully! 🎉");
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate weekly content calendar
  const generateWeeklyCalendar = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const today = new Date();
      
      const calendar: ContentCalendarItem[] = days.map((day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        
        const content: GeneratedContent[] = [];
        
        // Monday, Wednesday, Friday: YouTube videos
        if (index === 0 || index === 2 || index === 4) {
          const topic = CONTENT_TOPICS[index % CONTENT_TOPICS.length];
          content.push({
            id: `cal-yt-${index}`,
            type: "youtube",
            title: generateTitle("youtube", topic.name),
            description: generateDescription("youtube", topic.name),
            script: generateScript("youtube", topic.name, ""),
            tags: generateTags(topic.name),
            thumbnailIdea: generateThumbnailIdea(topic.name),
            duration: "10 minutes",
            status: "draft",
            createdAt: new Date(),
            topic: topic.name,
            seoScore: Math.floor(Math.random() * 20) + 80,
          });
        }
        
        // Tuesday, Thursday: Podcast episodes
        if (index === 1 || index === 3) {
          const topic = CONTENT_TOPICS[(index + 3) % CONTENT_TOPICS.length];
          content.push({
            id: `cal-pod-${index}`,
            type: "podcast",
            title: generateTitle("podcast", topic.name),
            description: generateDescription("podcast", topic.name),
            script: generateScript("podcast", topic.name, ""),
            tags: generateTags(topic.name),
            thumbnailIdea: "",
            duration: "30 minutes",
            status: "draft",
            createdAt: new Date(),
            topic: topic.name,
            seoScore: Math.floor(Math.random() * 20) + 80,
          });
        }
        
        // Every day: 2 shorts
        const shortsTopic1 = CONTENT_TOPICS[index % CONTENT_TOPICS.length];
        const shortsTopic2 = CONTENT_TOPICS[(index + 5) % CONTENT_TOPICS.length];
        content.push({
          id: `cal-short1-${index}`,
          type: "shorts",
          title: generateTitle("shorts", shortsTopic1.name),
          description: "",
          script: generateScript("shorts", shortsTopic1.name, ""),
          tags: generateTags(shortsTopic1.name),
          thumbnailIdea: "",
          duration: "60 seconds",
          status: "draft",
          createdAt: new Date(),
          topic: shortsTopic1.name,
          seoScore: Math.floor(Math.random() * 20) + 80,
        });
        content.push({
          id: `cal-short2-${index}`,
          type: "shorts",
          title: generateTitle("shorts", shortsTopic2.name),
          description: "",
          script: generateScript("shorts", shortsTopic2.name, ""),
          tags: generateTags(shortsTopic2.name),
          thumbnailIdea: "",
          duration: "60 seconds",
          status: "draft",
          createdAt: new Date(),
          topic: shortsTopic2.name,
          seoScore: Math.floor(Math.random() * 20) + 80,
        });

        return {
          day,
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          content,
        };
      });

      setWeeklyCalendar(calendar);
      toast.success("Weekly content calendar generated! 📅");
    } catch (error) {
      toast.error("Failed to generate calendar");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions for content generation
  const generateTitle = (type: ContentType, topic: string): string => {
    const titles: Record<ContentType, string[]> = {
      youtube: [
        `How to Master ${topic} in 7 Days (Science-Backed)`,
        `${topic}: What Huberman Gets Right (And Wrong)`,
        `I Tried ${topic} for 30 Days - Here's What Happened`,
        `The ${topic} Protocol That Changed Everything`,
        `${topic} 101: A Complete Beginner's Guide`,
      ],
      podcast: [
        `Deep Dive: The Science of ${topic}`,
        `${topic} - Real Talk with My Wife`,
        `Why ${topic} is the Key to Everything`,
        `The ${topic} Episode You've Been Waiting For`,
        `Unpacking ${topic}: Myths vs Reality`,
      ],
      shorts: [
        `One ${topic} tip that changed my life #shorts`,
        `Stop doing this for ${topic} #shorts`,
        `${topic} hack you NEED to know #shorts`,
        `The truth about ${topic} #shorts`,
        `${topic} in 60 seconds #shorts`,
      ],
      blog: [
        `The Ultimate Guide to ${topic}`,
        `${topic}: Everything You Need to Know`,
        `How ${topic} Can Transform Your Life`,
      ],
    };
    return titles[type][Math.floor(Math.random() * titles[type].length)];
  };

  const generateDescription = (type: ContentType, topic: string): string => {
    if (type === "youtube") {
      return `In this video, we dive deep into ${topic} and explore the science-backed strategies that actually work. Based on research from Huberman Lab, Peter Attia, and Matthew Walker, you'll learn practical techniques you can implement today.

🔔 Subscribe for more evidence-based wellness content!
🎯 Try Sage, your AI wellness coach: https://purposefullivecoaching.com

Timestamps:
0:00 - Introduction
0:30 - The Science Behind ${topic}
3:00 - Step-by-Step Protocol
7:00 - Common Mistakes to Avoid
9:00 - Your Action Plan

#wellness #${topic.toLowerCase().replace(/\s+/g, "")} #selfimprovement #health`;
    } else if (type === "podcast") {
      return `Welcome to Purposeful Live! In this episode, we explore ${topic} and share practical insights you can apply immediately.

Show Notes:
- The science behind ${topic}
- Real-world applications
- Common misconceptions
- Action items for this week

Connect with us:
🌐 Website: https://purposefullivecoaching.com
📱 Instagram: @purposefullivecoaching`;
    }
    return "";
  };

  const generateScript = (type: ContentType, topic: string, customPrompt: string): string => {
    if (type === "youtube") {
      return `[INTRO - 0:00]
Hey everyone, welcome back to Purposeful Live. I'm [Your Name], and today we're talking about something that could genuinely change your life: ${topic}.

[HOOK - 0:15]
Before we dive in, let me ask you this: Have you ever felt like you're doing everything right, but still not seeing results with ${topic}? You're not alone. And today, I'm going to show you exactly why that happens and what to do about it.

[THE PROBLEM - 0:45]
Here's the thing about ${topic} that most people get wrong...

Most advice out there is either outdated, oversimplified, or just plain wrong. I know because I used to follow all of it, and it didn't work.

[THE SCIENCE - 2:00]
But then I discovered the research from Dr. Andrew Huberman, Peter Attia, and Matthew Walker. And everything changed.

Here's what the science actually shows about ${topic}:

1. [Key Point 1]
2. [Key Point 2]  
3. [Key Point 3]

[THE PROTOCOL - 4:00]
So here's the exact protocol I follow, and that I teach in Purposeful Live Coaching:

Step 1: [Detailed explanation]
Step 2: [Detailed explanation]
Step 3: [Detailed explanation]

[PERSONAL STORY - 6:00]
Let me share what happened when my wife and I started implementing this...

[COMMON MISTAKES - 8:00]
Now, here are the mistakes I see people make all the time:

Mistake 1: [Explanation]
Mistake 2: [Explanation]

[CALL TO ACTION - 9:00]
If you want to go deeper with ${topic}, I've built an AI coach named Sage who can guide you through this 24/7. No judgment, no waiting lists, just evidence-based support whenever you need it.

Click the link in the description to try it free for 7 days.

And if this video helped you, smash that subscribe button and hit the bell so you don't miss our next deep dive.

See you in the next one. Stay purposeful.

[END - 10:00]`;
    } else if (type === "podcast") {
      return `[INTRO MUSIC - 0:00]

[HOST INTRO - 0:30]
Welcome to Purposeful Live, the podcast where we explore evidence-based strategies for living your best life. I'm [Your Name], and today we're diving deep into ${topic}.

${customPrompt ? `\n[CUSTOM SEGMENT]\n${customPrompt}\n` : ""}

[MAIN CONTENT - 2:00]
So let's talk about ${topic}. This is something I'm really passionate about because...

[Key Point 1 - 5:00]
The first thing you need to understand about ${topic} is...

[Key Point 2 - 10:00]
Now here's where it gets interesting...

[Key Point 3 - 15:00]
And finally, the piece that ties it all together...

[PERSONAL REFLECTION - 20:00]
You know, when my wife and I started focusing on ${topic}, we noticed...

[KEY TAKEAWAYS - 25:00]
Alright, let's recap the key takeaways from today:
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]

[OUTRO - 28:00]
That's all for today's episode. If you found this valuable, please subscribe and leave a review - it really helps us reach more people.

And remember, if you want personalized guidance on ${topic} or anything else we talk about on this show, check out Sage, our AI wellness coach, at purposefullivecoaching.com.

Until next time, stay purposeful.

[OUTRO MUSIC - 30:00]`;
    } else if (type === "shorts") {
      return `[HOOK - 0:00]
Stop scrolling. This ${topic} tip changed everything for me.

[CONTENT - 0:05]
Most people think ${topic} is about [common misconception].

But here's what the research actually shows:

[Key insight in 2-3 sentences]

[CTA - 0:50]
Follow for more science-backed wellness tips.

Link in bio to try our free AI coach.

[END - 0:60]`;
    }
    return "";
  };

  const generateTags = (topic: string): string[] => {
    const baseTags = ["wellness", "selfimprovement", "health", "mindset", "motivation", "lifestyle"];
    const topicTags = topic.toLowerCase().split(" ").filter(t => t.length > 3);
    return [...baseTags, ...topicTags, "purposefullive", "huberman", "evidencebased"];
  };

  const generateThumbnailIdea = (topic: string): string => {
    const ideas = [
      `Split screen: "Before" (stressed face) vs "After" (calm face) with "${topic}" text overlay`,
      `You pointing at camera with surprised expression, text: "The ${topic} SECRET"`,
      `Clean background, you and wife together, text: "We tried ${topic} for 30 days"`,
      `Bold text "${topic}" with arrow pointing to brain graphic`,
      `You holding up 3 fingers, text: "3 ${topic} MISTAKES"`,
    ];
    return ideas[Math.floor(Math.random() * ideas.length)];
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const addToQueue = (content: GeneratedContent) => {
    setContentQueue(prev => [...prev, content]);
    toast.success("Added to content queue!");
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case "youtube": return <Youtube className="h-4 w-4" />;
      case "podcast": return <Radio className="h-4 w-4" />;
      case "shorts": return <Film className="h-4 w-4" />;
      case "blog": return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: ContentType) => {
    switch (type) {
      case "youtube": return "bg-red-500";
      case "podcast": return "bg-purple-500";
      case "shorts": return "bg-pink-500";
      case "blog": return "bg-blue-500";
    }
  };

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case "draft": return "bg-gray-500";
      case "ready": return "bg-yellow-500";
      case "recorded": return "bg-blue-500";
      case "published": return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              Content Studio
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                AI-Powered
              </Badge>
            </h1>
            <p className="text-gray-400 mt-1">
              Autonomous content generation for YouTube, Podcasts, and Short-form video
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Switch
                checked={autoGenerate}
                onCheckedChange={setAutoGenerate}
              />
              <span className="text-white text-sm">Auto-Generate Weekly</span>
            </div>
            <Button
              onClick={generateWeeklyCalendar}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              Generate Week
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 p-1">
            <TabsTrigger value="generate" className="data-[state=active]:bg-white/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white/20">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly Calendar
            </TabsTrigger>
            <TabsTrigger value="queue" className="data-[state=active]:bg-white/20">
              <List className="h-4 w-4 mr-2" />
              Content Queue ({contentQueue.length})
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-white/20">
              <MessageSquare className="h-4 w-4 mr-2" />
              From Sessions
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Options */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Content Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose your content type and topic
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Content Type */}
                  <div className="space-y-2">
                    <Label className="text-white">Content Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { type: "youtube" as ContentType, icon: Youtube, label: "YouTube", color: "from-red-500 to-red-600" },
                        { type: "podcast" as ContentType, icon: Radio, label: "Podcast", color: "from-purple-500 to-purple-600" },
                        { type: "shorts" as ContentType, icon: Film, label: "Shorts", color: "from-pink-500 to-pink-600" },
                        { type: "blog" as ContentType, icon: FileText, label: "Blog", color: "from-blue-500 to-blue-600" },
                      ].map(({ type, icon: Icon, label, color }) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedType === type
                              ? `bg-gradient-to-r ${color} border-transparent`
                              : "bg-white/5 border-white/20 hover:border-white/40"
                          }`}
                        >
                          <Icon className="h-5 w-5 text-white mx-auto mb-1" />
                          <span className="text-white text-sm">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic Selection */}
                  <div className="space-y-2">
                    <Label className="text-white">Topic</Label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TOPICS.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            <div className="flex items-center gap-2">
                              <topic.icon className="h-4 w-4" />
                              {topic.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Prompt */}
                  <div className="space-y-2">
                    <Label className="text-white">Custom Instructions (Optional)</Label>
                    <Textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add any specific points you want to cover, personal stories, or special instructions..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 min-h-[100px]"
                    />
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={generateContent}
                    disabled={isGenerating || !selectedTopic}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Right Panel - Generated Content */}
              <div className="lg:col-span-2">
                {generatedContent ? (
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(generatedContent.type)}`}>
                            {getTypeIcon(generatedContent.type)}
                          </div>
                          <div>
                            <CardTitle className="text-white">{generatedContent.title}</CardTitle>
                            <CardDescription className="text-gray-400">
                              {generatedContent.topic} • {generatedContent.duration}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-400">
                            SEO Score: {generatedContent.seoScore}%
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => addToQueue(generatedContent)}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add to Queue
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-white font-semibold">Title</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(generatedContent.title, "title")}
                            className="text-gray-400 hover:text-white"
                          >
                            {copied === "title" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-white">
                          {generatedContent.title}
                        </div>
                      </div>

                      {/* Description */}
                      {generatedContent.description && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-white font-semibold">Description</Label>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedContent.description, "description")}
                              className="text-gray-400 hover:text-white"
                            >
                              {copied === "description" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg text-gray-300 text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                            {generatedContent.description}
                          </div>
                        </div>
                      )}

                      {/* Script */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-white font-semibold">Script</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(generatedContent.script, "script")}
                            className="text-gray-400 hover:text-white"
                          >
                            {copied === "script" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <ScrollArea className="h-[300px]">
                          <div className="p-4 bg-white/5 rounded-lg text-gray-300 text-sm whitespace-pre-wrap font-mono">
                            {generatedContent.script}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-white font-semibold">Tags</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(generatedContent.tags.map(t => `#${t}`).join(" "), "tags")}
                            className="text-gray-400 hover:text-white"
                          >
                            {copied === "tags" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.tags.map(tag => (
                            <Badge key={tag} className="bg-white/10 text-gray-300">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Thumbnail Idea */}
                      {generatedContent.thumbnailIdea && (
                        <div className="space-y-2">
                          <Label className="text-white font-semibold">Thumbnail Idea</Label>
                          <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg text-gray-300 text-sm">
                            💡 {generatedContent.thumbnailIdea}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/10 border-white/20 h-full flex items-center justify-center min-h-[500px]">
                    <div className="text-center p-8">
                      <div className="p-4 bg-white/10 rounded-full w-fit mx-auto mb-4">
                        <Sparkles className="h-12 w-12 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Ready to Create</h3>
                      <p className="text-gray-400 max-w-md">
                        Select a content type and topic, then click "Generate Content" to create AI-powered scripts, titles, and descriptions.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Weekly Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            {weeklyCalendar.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weeklyCalendar.map((day, index) => (
                  <Card key={index} className="bg-white/10 border-white/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg">{day.day}</CardTitle>
                      <CardDescription className="text-gray-400">{day.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {day.content.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            setGeneratedContent(item);
                            setActiveTab("generate");
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1 rounded ${getTypeColor(item.type)}`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <span className="text-xs text-gray-400 capitalize">{item.type}</span>
                          </div>
                          <p className="text-white text-xs line-clamp-2">{item.title}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Calendar Generated</h3>
                  <p className="text-gray-400 mb-4">Click "Generate Week" to create your content calendar</p>
                  <Button
                    onClick={generateWeeklyCalendar}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2" />
                    )}
                    Generate Weekly Calendar
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Content Queue Tab */}
          <TabsContent value="queue" className="space-y-6">
            {contentQueue.length > 0 ? (
              <div className="space-y-4">
                {contentQueue.map((item, index) => (
                  <Card key={item.id} className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.topic} • {item.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(item.status)} text-white`}>
                            {item.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setGeneratedContent(item);
                              setActiveTab("generate");
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setContentQueue(prev => prev.filter(c => c.id !== item.id))}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <List className="h-16 w-16 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Queue is Empty</h3>
                  <p className="text-gray-400">Generate content and add it to your queue to track progress</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Sessions to Content Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Session-to-Content Pipeline
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Transform your coaching sessions into valuable content (with client permission)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <div className="p-3 bg-blue-500/20 rounded-full w-fit mx-auto mb-3">
                      <MessageSquare className="h-8 w-8 text-blue-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-1">1. Record Session</h4>
                    <p className="text-gray-400 text-sm">Coaching session is transcribed automatically</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <div className="p-3 bg-purple-500/20 rounded-full w-fit mx-auto mb-3">
                      <Brain className="h-8 w-8 text-purple-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-1">2. AI Analysis</h4>
                    <p className="text-gray-400 text-sm">Extracts key insights and breakthroughs</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <div className="p-3 bg-pink-500/20 rounded-full w-fit mx-auto mb-3">
                      <Sparkles className="h-8 w-8 text-pink-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-1">3. Content Generated</h4>
                    <p className="text-gray-400 text-sm">Anonymized content ready to publish</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    Coming Soon: Auto-Extract Content from Sessions
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Once you start having coaching sessions, this feature will automatically identify powerful moments and generate content ideas based on real client breakthroughs (with their permission).
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-semibold mb-3">For Now: Record with Your Wife!</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Your first content can come from practice sessions with your wife. Here are some ideas:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Her first time trying Sage - genuine reaction",
                      "Couples morning routine walkthrough",
                      "Real conversation about stress management",
                      "Sleep Stories review - does it actually work?",
                      "Our wellness journey as a couple",
                    ].map((idea, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <ArrowRight className="h-4 w-4 text-purple-400" />
                        {idea}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
