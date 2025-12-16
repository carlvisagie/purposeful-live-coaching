import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Users, Calendar, Video, DollarSign, MessageCircle, FileText, Clock,
  TrendingUp, Search, Plus, BarChart3, Settings, Bell, CheckCircle2,
  AlertCircle, Phone, Activity, UserPlus, CreditCard, Download,
  AlertTriangle, XCircle, Target, Brain, Sparkles, Award, Flame
} from "lucide-react";

/**
 * OWNER CONTROL CENTER - Unified Command Center for Coach/Admin
 * 
 * ONE interface to run the entire business:
 * - Coach Tab: Clients, sessions, analytics, resources
 * - Admin Tab: Platform health, users, payments, AI monitoring
 * - Quick Actions: Everything accessible from one place
 * 
 * No more switching between CoachDashboard and AdminDashboard!
 */
export default function OwnerControlCenter() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

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

  // Filter today's sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaysSessions = coachSessions?.filter((session: any) => {
    const sessionDate = new Date(session.scheduledDate);
    return sessionDate >= today && sessionDate < tomorrow;
  }) || [];

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
                  Owner Control Center
                </h1>
                <p className="text-xs text-muted-foreground">Run Your Empire</p>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="flex items-center gap-4">
              {/* Crisis Alert Indicator */}
              {adminStatsData.pendingCrisisAlerts > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {adminStatsData.pendingCrisisAlerts} Alert{adminStatsData.pendingCrisisAlerts !== 1 ? 's' : ''}
                </Badge>
              )}

              {/* Today's Sessions */}
              <Badge variant="outline" className="text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {todaysSessions.length} Today
              </Badge>

              {/* Revenue MTD */}
              <Badge variant="outline" className="text-sm hidden md:flex">
                <DollarSign className="h-3 w-3 mr-1" />
                ${adminStatsData.revenueMTD.toLocaleString()} MTD
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Carl'} 👑
          </h2>
          <p className="text-muted-foreground">
            Your complete command center for coaching and platform management
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">
              <Target className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="h-4 w-4 mr-2" />
              Sessions
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

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Crisis Alerts Banner */}
            {adminStatsData.pendingCrisisAlerts > 0 && (
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      <div>
                        <CardTitle className="text-red-900">
                          {adminStatsData.pendingCrisisAlerts} Pending Crisis Alert{adminStatsData.pendingCrisisAlerts !== 1 ? 's' : ''}
                        </CardTitle>
                        <CardDescription className="text-red-700">
                          Immediate attention required
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setActiveTab("admin")}>
                      <Bell className="h-4 w-4 mr-2" />
                      View Alerts
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Clients */}
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Users className="h-8 w-8 text-purple-600" />
                    <Badge variant="secondary">+{adminStatsData.newUsersThisMonth}</Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold mt-2">{coachStatsData.totalClients}</CardTitle>
                  <CardDescription>Total Clients</CardDescription>
                </CardHeader>
              </Card>

              {/* Revenue MTD */}
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <Badge variant="secondary" className="text-green-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{adminStatsData.revenueGrowth}%
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold mt-2">${adminStatsData.revenueMTD.toLocaleString()}</CardTitle>
                  <CardDescription>Revenue This Month</CardDescription>
                </CardHeader>
              </Card>

              {/* Sessions Today */}
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary">{coachStatsData.completedSessions} total</Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold mt-2">{todaysSessions.length}</CardTitle>
                  <CardDescription>Sessions Today</CardDescription>
                </CardHeader>
              </Card>

              {/* Active Sessions */}
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Activity className="h-8 w-8 text-orange-600" />
                    <Badge variant="secondary">Live</Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold mt-2">{adminStatsData.activeSessions}</CardTitle>
                  <CardDescription>Active Right Now</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Today's Sessions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Today's Sessions
                    </CardTitle>
                    <CardDescription>Your coaching schedule for today</CardDescription>
                  </div>
                  <Link href="/coach/calendar">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Full Calendar
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {todaysSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No sessions scheduled for today</p>
                    <p className="text-sm mt-1">Enjoy your free time! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaysSessions.map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            {session.clientName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-semibold">{session.clientName || 'Client'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration} min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{session.sessionType || 'Coaching'}</Badge>
                          <Link href={`/live-session?sessionId=${session.id}&clientId=${session.clientId}`}>
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-2" />
                              Start Session
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/clients/new">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 hover:border-purple-400">
                  <CardHeader>
                    <UserPlus className="h-8 w-8 text-purple-500 mb-2" />
                    <CardTitle className="text-lg">Add New Client</CardTitle>
                    <CardDescription>Onboard a new client</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/ai-monitoring">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-400">
                  <CardHeader>
                    <Brain className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle className="text-lg">AI Monitoring</CardTitle>
                    <CardDescription>View AI conversations</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/setup">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200 hover:border-green-400">
                  <CardHeader>
                    <Settings className="h-8 w-8 text-green-500 mb-2" />
                    <CardTitle className="text-lg">Platform Setup</CardTitle>
                    <CardDescription>Configure system</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </TabsContent>

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
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Clients List */}
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
                          <div className="flex items-center gap-2">
                            <Badge variant={client.subscriptionTier === 'elite' ? 'default' : 'secondary'}>
                              {client.subscriptionTier || 'Free'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SESSIONS TAB */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>View and manage all coaching sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Full calendar view coming soon</p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/coach/availability">
                      <Button variant="outline">
                        <Clock className="h-4 w-4 mr-2" />
                        Set Availability
                      </Button>
                    </Link>
                    <Link href="/my-sessions">
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        View All Sessions
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-end gap-2">
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

            {/* Revenue & Growth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${coachStatsData.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${adminStatsData.revenueMTD.toLocaleString()}</div>
                  <p className="text-xs text-green-600 mt-1">+{adminStatsData.revenueGrowth}% growth</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coachStatsData.completedSessions}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total sessions</p>
                </CardContent>
              </Card>
            </div>

            {/* User Tier Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Tiers</CardTitle>
                <CardDescription>Distribution of users by subscription level</CardDescription>
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
                        style={{ width: `${(adminStatsData.usersByTier.basic / adminStatsData.totalUsers) * 100}%` }}
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
                        style={{ width: `${(adminStatsData.usersByTier.premium / adminStatsData.totalUsers) * 100}%` }}
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
                        style={{ width: `${(adminStatsData.usersByTier.elite / adminStatsData.totalUsers) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADMIN TAB */}
          <TabsContent value="admin" className="space-y-6">
            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System status and monitoring</CardDescription>
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
                        <p className="text-sm text-muted-foreground">OpenAI Connected</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Payments</p>
                        <p className="text-sm text-muted-foreground">Stripe Connected</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Active Users</p>
                        <p className="text-sm text-muted-foreground">{adminStatsData.activeSessions} online now</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{adminStatsData.totalUsers} total</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crisis Alerts */}
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
                            <p className="text-xs text-red-600 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
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
                  {recentUsers && recentUsers.length > 0 ? (
                    recentUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge>{user.subscriptionTier || 'Free'}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No recent users</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/setup">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Settings className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle className="text-lg">Platform Setup</CardTitle>
                    <CardDescription>Configure system settings</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/ai-monitoring">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Brain className="h-8 w-8 text-purple-500 mb-2" />
                    <CardTitle className="text-lg">AI Monitoring</CardTitle>
                    <CardDescription>View AI conversations</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Download className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle className="text-lg">Export Data</CardTitle>
                  <CardDescription>Download reports</CardDescription>
                </CardHeader>
              </Card>

              <Link href="/admin/client-history">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <FileText className="h-8 w-8 text-orange-500 mb-2" />
                    <CardTitle className="text-lg">Client History</CardTitle>
                    <CardDescription>View all interactions</CardDescription>
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
