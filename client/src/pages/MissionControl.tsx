import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Target, Brain, TrendingUp, Zap, Heart, CheckCircle2, AlertTriangle,
  Flame, Award, Activity, Calendar, ArrowRight, Sparkles, Video,
  MessageCircle, BookOpen, Clock, FileText, CreditCard, Sun, Moon,
  Droplet, Apple, Dumbbell, Users, Settings, LogOut, Bell, Search
} from "lucide-react";

/**
 * MISSION CONTROL - Unified Command Center
 * 
 * ONE interface to rule them all. No more scattered dashboards.
 * Everything accessible from one place:
 * - AI Coach
 * - Sessions & Booking
 * - Wellness Modules
 * - Health Tracking
 * - Daily OS (Morning/Evening)
 * - Progress & Metrics
 * - Account & Settings
 */
export default function MissionControl() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: user } = trpc.auth.me.useQuery();
  const { data: subscription } = trpc.subscriptions.getMySubscription.useQuery();
  const { data: usageData } = trpc.subscriptions.getCurrentUsage.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: upcomingSessions } = trpc.scheduling.getUpcomingClientSessions.useQuery(
    { clientId: user?.id || 0 },
    { enabled: !!user }
  );

  const tierName = subscription?.tier || "Free";
  const messagesUsed = usageData?.messagesUsed || 0;
  const messageLimit = usageData?.messageLimit || 0;
  const messagesRemaining = usageData?.messagesRemaining || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mission Control</h1>
                <p className="text-xs text-muted-foreground">Your Path to Freedom</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {tierName} Plan
              </Badge>
              
              {usageData && messageLimit > 0 && (
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>{messagesUsed} / {messageLimit}</span>
                </div>
              )}

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Champion'}
          </h2>
          <p className="text-muted-foreground">
            Everything you need in one place. Let's make today count.
          </p>
        </div>

        {/* Tabs for Different Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">
              <Target className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-coach">
              <Brain className="h-4 w-4 mr-2" />
              AI Coach
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="wellness">
              <Sparkles className="h-4 w-4 mr-2" />
              Wellness
            </TabsTrigger>
            <TabsTrigger value="health">
              <Activity className="h-4 w-4 mr-2" />
              Health
            </TabsTrigger>
            <TabsTrigger value="daily">
              <Sun className="h-4 w-4 mr-2" />
              Daily OS
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/ai-coach">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 hover:border-purple-400">
                  <CardHeader className="pb-3">
                    <Brain className="h-8 w-8 text-purple-500 mb-2" />
                    <CardTitle className="text-lg">AI Coach</CardTitle>
                    <CardDescription>24/7 Support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Start Chat
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/sessions/book">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-400">
                  <CardHeader className="pb-3">
                    <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle className="text-lg">Book Session</CardTitle>
                    <CardDescription>Human Coaching</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Schedule Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/wellness-modules">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-indigo-200 hover:border-indigo-400">
                  <CardHeader className="pb-3">
                    <Sparkles className="h-8 w-8 text-indigo-500 mb-2" />
                    <CardTitle className="text-lg">Wellness</CardTitle>
                    <CardDescription>33 Modules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Explore
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/health-tracker">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200 hover:border-green-400">
                  <CardHeader className="pb-3">
                    <Activity className="h-8 w-8 text-green-500 mb-2" />
                    <CardTitle className="text-lg">Health</CardTitle>
                    <CardDescription>Track Progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Log Data
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Today's Focus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Today's Focus
                </CardTitle>
                <CardDescription>Your daily operating system</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/daily-os/morning">
                  <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-orange-500" />
                        <h3 className="font-semibold">Morning Routine</h3>
                      </div>
                      <Badge variant="outline">Start Day</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set intentions, gratitude, and plan your day
                    </p>
                  </div>
                </Link>

                <Link href="/daily-os/evening">
                  <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold">Evening Review</h3>
                      </div>
                      <Badge variant="outline">End Day</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reflect, celebrate wins, and prepare for tomorrow
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            {upcomingSessions && upcomingSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 3).map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.sessionType}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.scheduledDate).toLocaleDateString()} at{' '}
                            {new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Badge>{session.duration} min</Badge>
                      </div>
                    ))}
                  </div>
                  <Link href="/my-sessions">
                    <Button variant="outline" className="w-full mt-4">
                      View All Sessions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Tier & Usage Info */}
            {usageData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    Your Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Tier</span>
                    <Badge className="text-lg px-3 py-1">{tierName}</Badge>
                  </div>
                  
                  {messageLimit > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">AI Messages</span>
                        <span className="text-sm font-medium">
                          {messagesUsed} / {messageLimit}
                        </span>
                      </div>
                      <Progress value={(messagesUsed / messageLimit) * 100} className="h-2" />
                      {messagesRemaining <= 10 && messagesRemaining > 0 && (
                        <p className="text-xs text-orange-600 mt-2">
                          Only {messagesRemaining} messages remaining this month
                        </p>
                      )}
                    </div>
                  )}

                  {messageLimit === -1 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Unlimited Messages</span>
                    </div>
                  )}

                  {tierName === "Basic" && (
                    <Link href="/pricing">
                      <Button className="w-full" variant="outline">
                        Upgrade Plan
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI COACH TAB */}
          <TabsContent value="ai-coach">
            <Card>
              <CardHeader>
                <CardTitle>AI Coach redirects to full interface</CardTitle>
                <CardDescription>
                  The AI Coach has its own dedicated interface for the best chat experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/ai-coach">
                  <Button size="lg" className="w-full">
                    <Brain className="h-5 w-5 mr-2" />
                    Open AI Coach
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SESSIONS TAB */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Session Management redirects to full interface</CardTitle>
                <CardDescription>
                  Manage your coaching sessions in the dedicated sessions interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/my-sessions">
                  <Button size="lg" className="w-full">
                    <Calendar className="h-5 w-5 mr-2" />
                    View My Sessions
                  </Button>
                </Link>
                <Link href="/sessions/book">
                  <Button size="lg" variant="outline" className="w-full">
                    <Calendar className="h-5 w-5 mr-2" />
                    Book New Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WELLNESS TAB */}
          <TabsContent value="wellness">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Modules</CardTitle>
                <CardDescription>
                  33 comprehensive modules for holistic wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/wellness-modules">
                  <Button size="lg" className="w-full">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Explore Wellness Modules
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HEALTH TAB */}
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Health Tracking</CardTitle>
                <CardDescription>
                  Track movement, nutrition, hydration, and sleep
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/health-tracker">
                  <Button size="lg" className="w-full">
                    <Activity className="h-5 w-5 mr-2" />
                    Open Health Tracker
                  </Button>
                </Link>
                <Link href="/stress-relief">
                  <Button size="lg" variant="outline" className="w-full">
                    <Heart className="h-5 w-5 mr-2" />
                    Stress Relief Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DAILY OS TAB */}
          <TabsContent value="daily">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Sun className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle>Morning Routine</CardTitle>
                  <CardDescription>
                    Start your day with intention and clarity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/daily-os/morning">
                    <Button size="lg" className="w-full">
                      Begin Morning Routine
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Moon className="h-8 w-8 text-indigo-500 mb-2" />
                  <CardTitle>Evening Review</CardTitle>
                  <CardDescription>
                    Reflect on your day and prepare for tomorrow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/daily-os/evening">
                    <Button size="lg" className="w-full">
                      Begin Evening Review
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
