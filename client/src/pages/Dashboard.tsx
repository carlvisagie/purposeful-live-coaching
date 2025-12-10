import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Zap, 
  Heart,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Activity,
  Calendar,
  ArrowRight,
  Sparkles,
  Video,
  MessageCircle,
  BookOpen,
  Clock,
  FileText,
  CreditCard
} from "lucide-react";
import { LOGIN_URL } from "@/const";

export default function Dashboard() {
  const { data: user } = trpc.auth.me.useQuery();
  
  // Coaching-specific queries (using only existing routers)
  const { data: subscription } = trpc.subscriptions.getMySubscription.useQuery(undefined, { enabled: !!user });
  const { data: upcomingSessions } = trpc.scheduling.getUpcomingClientSessions.useQuery(
    { clientId: user?.id || 0 },
    { enabled: !!user }
  );
  const { data: sessionHistory } = trpc.scheduling.getClientSessions.useQuery(
    { clientId: user?.id || 0 },
    { enabled: !!user }
  );
  const { data: resources } = trpc.clientFiles.getMyFiles.useQuery(undefined, { enabled: !!user });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
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

  // Determine next action based on available data
  const getNextAction = () => {
    if (!subscription) {
      return {
        title: "Choose Your Plan",
        description: "Start your transformation journey with the right coaching plan.",
        link: "/pricing",
        icon: Target,
        priority: "critical"
      };
    }
    if (!upcomingSessions || upcomingSessions.length === 0) {
      return {
        title: "Book Your First Session",
        description: "Schedule a session with your coach to get started.",
        link: "/my-sessions",
        icon: Calendar,
        priority: "high"
      };
    }
    return {
      title: "Talk to AI Coach",
      description: "Get 24/7 support and guidance between coaching sessions.",
      link: "/ai-coach",
      icon: Brain,
        priority: "medium"
    };
  };

  const nextAction = getNextAction();
  const NextActionIcon = nextAction.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {user.name?.split(' ')[0] || 'Champion'}</h1>
            <p className="text-muted-foreground mt-2">
              Your path to freedom starts here
            </p>
          </div>
          <Badge variant={subscription ? "default" : "destructive"} className="text-lg px-4 py-2">
            {subscription ? `${subscription.tier} Plan` : "No Active Plan"}
          </Badge>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/ai-coach">
            <Button className="w-full h-20 text-lg" variant="default" size="lg">
              <MessageCircle className="mr-3 h-6 w-6" />
              Chat with AI Coach
            </Button>
          </Link>
          <Link to="/sessions/book">
            <Button className="w-full h-20 text-lg" variant="outline" size="lg">
              <Calendar className="mr-3 h-6 w-6" />
              Book a Session
            </Button>
          </Link>
          <Link to="/pricing">
            <Button className="w-full h-20 text-lg" variant="outline" size="lg">
              <CreditCard className="mr-3 h-6 w-6" />
              {subscription ? 'Manage Plan' : 'View Plans'}
            </Button>
          </Link>
        </div>

        {/* Upcoming Sessions */}
        {upcomingSessions && upcomingSessions.length > 0 && (
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>Your Next Session</CardTitle>
                    <CardDescription>
                      {upcomingSessions[0].coachName} • {new Date(upcomingSessions[0].scheduledAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.ceil((new Date(upcomingSessions[0].scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </div>
                  <div className="text-sm text-muted-foreground">until session</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{upcomingSessions[0].type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(upcomingSessions[0].scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {upcomingSessions[0].meetingLink && (
                  <a href={upcomingSessions[0].meetingLink} target="_blank" rel="noopener noreferrer">
                    <Button size="lg">
                      <Video className="mr-2 h-5 w-5" />
                      Join Session
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session History & Resources Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
              <CardDescription>Your coaching journey</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionHistory && sessionHistory.length > 0 ? (
                <div className="space-y-3">
                  {sessionHistory.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to={`/sessions/${session.id}`}>
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Notes
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No sessions yet</p>
                  <Link to="/sessions/book">
                    <Button size="sm" variant="outline" className="mt-3">
                      Book Your First Session
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Resources
              </CardTitle>
              <CardDescription>Materials from your coach</CardDescription>
            </CardHeader>
            <CardContent>
              {resources && resources.length > 0 ? (
                <div className="space-y-3">
                  {resources.map((resource: any) => (
                    <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">{resource.type}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No resources yet</p>
                  <p className="text-xs mt-2">Your coach will share materials here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* NO-DECISION MODE: Next Action Card */}
        <Card className={`border-2 ${
          nextAction.priority === "critical" ? "border-red-500 bg-red-50 dark:bg-red-950" :
          nextAction.priority === "high" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
          "border-blue-500 bg-blue-50 dark:bg-blue-950"
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <NextActionIcon className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">Your Next Action</CardTitle>
                  <CardDescription className="text-base">
                    {nextAction.priority === "critical" && "⚠️ Critical - Do this first"}
                    {nextAction.priority === "high" && "🔥 High priority"}
                    {nextAction.priority === "medium" && "✨ Recommended"}
                  </CardDescription>
                </div>
              </div>
              <Link to={nextAction.link}>
                <Button size="lg" className="text-lg">
                  {nextAction.title}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{nextAction.description}</p>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Identity Alignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Identity Alignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{identityAlignment}%</div>
              <Progress value={identityAlignment} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {identityAlignment === 100 ? "Strong foundation" : "Build your identity first"}
              </p>
            </CardContent>
          </Card>

          {/* Morning Routine Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Morning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{morningStreak?.current || 0}</div>
              <p className="text-xs text-muted-foreground">
                Best: {morningStreak?.longest || 0} days
              </p>
            </CardContent>
          </Card>

          {/* Health Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {healthStats?.averageScore || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                7-day average
              </p>
            </CardContent>
          </Card>

          {/* Total Points */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{gamificationData?.totalPoints || 0}</div>
              <p className="text-xs text-muted-foreground">
                {gamificationData?.badges || 0} badges earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Priority Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Today's Priorities
            </CardTitle>
            <CardDescription>
              Based on your identity and goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${healthToday ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Log health metrics</span>
              </div>
              {healthToday ? (
                <Badge variant="outline" className="text-green-600">Complete</Badge>
              ) : (
                <Link to="/health">
                  <Button size="sm" variant="outline">Do Now</Button>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${morningStreak?.current ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Complete morning routine</span>
              </div>
              {morningStreak?.current ? (
                <Badge variant="outline" className="text-green-600">Complete</Badge>
              ) : (
                <Link to="/daily-os/morning">
                  <Button size="sm" variant="outline">Do Now</Button>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span>Evening review (complete tonight)</span>
              </div>
              <Link to="/daily-os/evening">
                <Button size="sm" variant="outline">Preview</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/health">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <CardTitle>Health Tracker</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Log movement, nutrition, sleep, hydration
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/stress-relief">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-500" />
                  <CardTitle>Stress Relief</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Box breathing, grounding exercises
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/ai-coach">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <CardTitle>AI Coach</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get personalized guidance 24/7
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Active Milestones */}
        {activeMilestones && activeMilestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Active Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeMilestones.map((milestone) => (
                <div key={milestone.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{milestone.title}</span>
                    <Badge>{milestone.category}</Badge>
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contradiction Alerts */}
        {identityStatement && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Identity Contradiction Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Before making any decision today, ask: <strong>"Would someone who {identityStatement.statement} do this?"</strong>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Book Session CTA */}
        <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Ready for Your Next Breakthrough?</CardTitle>
            <CardDescription className="text-white/80">
              Book a live coaching session to accelerate your transformation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/book-session">
              <Button size="lg" variant="secondary" className="text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Book Live Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
