import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useState } from "react";
import {
  Users,
  Calendar,
  Video,
  DollarSign,
  MessageCircle,
  FileText,
  Clock,
  TrendingUp,
  Search,
  Plus,
  BarChart3,
  Settings,
  Bell,
  CheckCircle2,
  AlertCircle,
  Phone
} from "lucide-react";
import { LOGIN_URL } from "@/const";

export default function CoachDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: user } = trpc.auth.me.useQuery();
  
  // Coach data queries
  const { data: allClients } = trpc.coachDashboard.getAllClients.useQuery(undefined, { enabled: !!user });
  const { data: stats } = trpc.coachDashboard.getStats.useQuery(undefined, { enabled: !!user });
  const { data: activeSessions } = trpc.coachDashboard.getActiveSessions.useQuery(undefined, { enabled: !!user });
  const { data: coachSessions } = trpc.scheduling.getCoachSessions.useQuery(
    { coachId: user?.id || 0 },
    { enabled: !!user }
  );
  
  // Filter today's sessions from all coach sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaysSessions = coachSessions?.filter((session: any) => {
    const sessionDate = new Date(session.scheduledDate);
    return sessionDate >= today && sessionDate < tomorrow;
  }) || [];
  
  // Calculate revenue stats from real data (stats from backend)
  const revenueStats = {
    currentMonth: stats?.monthlyRevenue || 0,
    lastMonth: stats?.lastMonthRevenue || 0,
    yearToDate: stats?.yearlyRevenue || 0,
    growthPercent: stats?.revenueGrowth || 0,
    completionRate: stats?.completionRate || 0,
    byTier: stats?.revenueByTier || []
  };
  
  // Recent activity from sessions and clients
  const recentActivity = [
    ...(coachSessions?.slice(0, 5).map((session: any) => ({
      type: 'session',
      title: `Session with ${session.clientName}`,
      time: new Date(session.scheduledDate).toLocaleString(),
      status: session.status
    })) || [])
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the coach dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = LOGIN_URL}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter clients based on search
  const filteredClients = allClients?.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClients = stats?.activeClients || 0;
  const sessionsToday = todaysSessions?.length || 0;
  const monthlyRevenue = revenueStats?.currentMonth || 0;
  const revenueGrowth = revenueStats?.growthPercent || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Coach Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, {user.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/settings">
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeClients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {allClients?.length || 0} total clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Sessions Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sessionsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {upcomingBookings?.length || 0} upcoming bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Revenue (MTD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${(monthlyRevenue / 100).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}% vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{revenueStats?.completionRate || 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your sessions for today</CardDescription>
              </div>
              <Link to="/sessions/schedule">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {todaysSessions && todaysSessions.length > 0 ? (
              <div className="space-y-3">
                {todaysSessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {session.duration} min
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{session.clientName}</p>
                        <p className="text-sm text-muted-foreground">{session.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                            {session.status}
                          </Badge>
                          {session.isFirstSession && (
                            <Badge variant="outline" className="text-xs">First Session</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/clients/${session.clientId}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Notes
                        </Button>
                      </Link>
                      {session.meetingLink ? (
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Start Session
                          </Button>
                        </a>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Phone className="mr-2 h-4 w-4" />
                          Call Client
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No sessions scheduled for today</p>
                <p className="text-sm mt-2">Enjoy your day off or use this time to prepare for upcoming sessions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="clients">
              <Users className="mr-2 h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="activity">
              <BarChart3 className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Clients</CardTitle>
                    <CardDescription>Manage your client relationships</CardDescription>
                  </div>
                  <Link to="/clients/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Client
                    </Button>
                  </Link>
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredClients && filteredClients.length > 0 ? (
                  <div className="space-y-3">
                    {filteredClients.map((client: any) => (
                      <Link key={client.id} to={`/clients/${client.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {client.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                  {client.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {client.tier} • {client.totalSessions} sessions
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={(e) => { e.preventDefault(); /* Open message modal */ }}>
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">
                      {searchTerm ? 'No clients found' : 'No clients yet'}
                    </p>
                    <p className="text-sm mt-2">
                      {searchTerm ? 'Try a different search term' : 'Add your first client to get started'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Your earnings breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="text-2xl font-bold">${(revenueStats?.currentMonth / 100 || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Month</span>
                    <span className="text-lg">${(revenueStats?.lastMonth / 100 || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Year to Date</span>
                    <span className="text-lg">${(revenueStats?.yearToDate / 100 || 0).toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth</span>
                      <span className={`text-lg font-semibold ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Tier</CardTitle>
                  <CardDescription>Breakdown by subscription level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {revenueStats?.byTier?.map((tier: any) => (
                    <div key={tier.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{tier.name}</p>
                        <p className="text-sm text-muted-foreground">{tier.clientCount} clients</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(tier.revenue / 100).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{tier.percentage}%</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No revenue data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and actions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity && recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'session_completed' ? 'bg-green-100 dark:bg-green-900' :
                          activity.type === 'new_client' ? 'bg-blue-100 dark:bg-blue-900' :
                          activity.type === 'payment_received' ? 'bg-purple-100 dark:bg-purple-900' :
                          'bg-gray-100 dark:bg-gray-900'
                        }`}>
                          {activity.type === 'session_completed' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          {activity.type === 'new_client' && <Users className="h-5 w-5 text-blue-600" />}
                          {activity.type === 'payment_received' && <DollarSign className="h-5 w-5 text-purple-600" />}
                          {activity.type === 'alert' && <AlertCircle className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No recent activity</p>
                    <p className="text-sm mt-2">Activity will appear here as you work with clients</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
