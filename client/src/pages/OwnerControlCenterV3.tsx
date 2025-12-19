import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import {
  Users, Calendar, Video, DollarSign, Clock, TrendingUp, Search, Plus,
  BarChart3, Settings, Bell, CheckCircle2, AlertCircle, Activity,
  UserPlus, AlertTriangle, Target, Brain, Play, Zap, Timer, Mic
} from "lucide-react";
import UnifiedVideoStudio from "@/components/UnifiedVideoStudio";
import { PlatformManagement } from "@/components/PlatformManagement";
import { AICoachPerformance } from "@/components/AICoachPerformance";
import { AviationKnowledgeCoach } from "@/components/AviationKnowledgeCoach";

/**
 * OWNER CONTROL CENTER V3 - Unified Video Studio
 * 
 * HERO SECTION: Unified Video Studio (one screen for all modes)
 * SECONDARY: Today's Sessions + Tabs for Clients, Analytics, Admin
 * 
 * The video studio consolidates:
 * - Equipment Check (Test mode)
 * - Speaker Training (Train mode)
 * - Live Coaching (Coach mode)
 * - Voice AI Coach (Voice mode)
 */
export default function OwnerControlCenterV3() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAviationCoach, setShowAviationCoach] = useState(false);
  const [, setLocation] = useLocation();

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

              {/* Next Session Countdown */}
              {nextSession && (
                <Badge variant="secondary" className="text-sm">
                  <Timer className="h-3 w-3 mr-1" />
                  Next: {getTimeUntilSession(nextSession)}
                </Badge>
              )}

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {adminStatsData.pendingCrisisAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {adminStatsData.pendingCrisisAlerts}
                  </span>
                )}
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation('/my-profile')}
                title="Settings & Profile"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed right-4 top-16 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>×</Button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {adminStatsData.pendingCrisisAlerts > 0 ? (
              <div className="p-4 border-b border-gray-100 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Crisis Alert</p>
                    <p className="text-sm text-red-700">{adminStatsData.pendingCrisisAlerts} alert(s) require attention</p>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => { setActiveTab('admin'); setShowNotifications(false); }}
                    >
                      View Now
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
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

        {/* HERO: UNIFIED VIDEO STUDIO */}
        <UnifiedVideoStudio
          clientName={currentSession?.clientName || nextSession?.clientName || "Client"}
          sessionType={currentSession?.sessionType || nextSession?.sessionType || "General Coaching"}
          className="mb-8"
        />

        {/* Aviation Knowledge Coach Card */}
        <Card 
          className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => setShowAviationCoach(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <span className="text-2xl">✈️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Aviation Knowledge Coach</h3>
                  <p className="text-sm text-gray-600">Master the 10 must-know areas for Senior Maintenance Manager</p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                onClick={(e) => { e.stopPropagation(); setShowAviationCoach(true); }}
              >
                <Target className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* TODAY'S SESSIONS - Compact Cards */}
        {todaysSessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {todaysSessions.slice(0, 3).map((session: any) => {
              const sessionTime = new Date(session.scheduledDate);
              const isNow = currentSession?.id === session.id;
              const isPast = sessionTime < now && !isNow;

              return (
                <Card 
                  key={session.id} 
                  className={`relative overflow-hidden transition-all ${
                    isNow 
                      ? 'border-red-500 border-2 shadow-lg' 
                      : isPast
                      ? 'opacity-60'
                      : 'hover:shadow-md'
                  }`}
                >
                  {isNow && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 animate-pulse" />
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold ${
                        isNow ? 'ring-2 ring-red-500 ring-offset-2' : ''
                      }`}>
                        {session.clientName?.charAt(0) || 'C'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{session.clientName || 'Client'}</h3>
                          {isNow && <Badge variant="destructive" className="text-xs">LIVE</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sessionTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration || 60}min
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="platform">
              <Settings className="h-4 w-4 mr-2" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="ai-coaches">
              <Brain className="h-4 w-4 mr-2" />
              AI Coaches
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{adminStatsData.totalUsers}</div>
                  <p className="text-sm text-muted-foreground">
                    +{adminStatsData.newUsersThisMonth} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Mix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Basic</span>
                      <span className="font-bold">{adminStatsData.usersByTier.basic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium</span>
                      <span className="font-bold">{adminStatsData.usersByTier.premium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Elite</span>
                      <span className="font-bold">{adminStatsData.usersByTier.elite}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{coachStatsData.completedSessions}</div>
                  <p className="text-sm text-muted-foreground">
                    Sessions completed
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PLATFORM TAB */}
          <TabsContent value="platform" className="space-y-6">
            <PlatformManagement />
          </TabsContent>

          {/* AI COACHES TAB */}
          <TabsContent value="ai-coaches" className="space-y-6">
            <AICoachPerformance />
          </TabsContent>

          {/* ADMIN TAB */}
          <TabsContent value="admin" className="space-y-6">
            {/* Crisis Alerts */}
            {crisisAlerts && crisisAlerts.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Crisis Alerts
                  </CardTitle>
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

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest signups and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers?.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{user.name || 'New User'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{user.subscriptionTier || 'Free'}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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

      {/* Aviation Knowledge Coach Modal */}
      {showAviationCoach && (
        <AviationKnowledgeCoach onClose={() => setShowAviationCoach(false)} />
      )}
    </div>
  );
}
