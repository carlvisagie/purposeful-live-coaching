import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, TrendingUp, Trophy, Star, Users, Clock, Target, 
  ThumbsUp, ThumbsDown, Zap, Heart, MessageSquare, RefreshCw,
  ArrowUp, ArrowDown, Minus, Award, Lightbulb, AlertTriangle,
  CheckCircle2, XCircle, BarChart3, Activity, Sparkles
} from "lucide-react";

/**
 * AI COACH PERFORMANCE DASHBOARD
 * 
 * Shows how each AI coach is performing:
 * - Individual coach metrics
 * - Rankings and comparisons
 * - What's working / not working
 * - Technique effectiveness
 * - Evolution tracking
 */

interface AICoachPerformanceProps {
  className?: string;
}

export function AICoachPerformance({ className }: AICoachPerformanceProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);

  // Fetch coach overview
  const { data: overview, isLoading: overviewLoading, refetch } = trpc.aiCoachPerformance.getCoachOverview.useQuery({ timeRange });
  
  // Fetch quick stats
  const { data: quickStats } = trpc.aiCoachPerformance.getQuickStats.useQuery();

  // Fetch detailed coach data when selected
  const { data: coachDetail } = trpc.aiCoachPerformance.getCoachDetail.useQuery(
    { coachType: selectedCoach!, timeRange },
    { enabled: !!selectedCoach }
  );

  // Coach type icons
  const COACH_ICONS: Record<string, any> = {
    sage: Brain,
    alex: MessageSquare,
    jordan: Target,
    morgan: Heart,
    sam: CheckCircle2,
    memphis: Sparkles,
  };

  // Coach colors
  const COACH_COLORS: Record<string, string> = {
    sage: "from-purple-500 to-indigo-500",
    alex: "from-blue-500 to-cyan-500",
    jordan: "from-green-500 to-emerald-500",
    morgan: "from-pink-500 to-rose-500",
    sam: "from-amber-500 to-orange-500",
    memphis: "from-violet-500 to-purple-500",
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300"><Trophy className="h-3 w-3 mr-1" />1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-700 border-gray-300">2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-100 text-amber-700 border-amber-300">3rd</Badge>;
    return <Badge variant="outline">{rank}th</Badge>;
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className={className}>
      <Card className="border-2 border-slate-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-6 w-6 text-purple-600" />
                AI Coach Performance
              </CardTitle>
              <CardDescription>
                Track how each coach is performing and what's working
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Quick Stats Row */}
          {quickStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Last 24h</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{quickStats.last24h.sessions}</p>
                  <p className="text-xs text-blue-600">sessions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Avg Rating</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{quickStats.last7d.avgRating}</p>
                  <p className="text-xs text-green-600">last 7 days</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">Breakthroughs</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{quickStats.last7d.breakthroughs}</p>
                  <p className="text-xs text-purple-600">last 7 days</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">Total Clients</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-900">{quickStats.allTime.uniqueClients}</p>
                  <p className="text-xs text-amber-600">all time</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="rankings" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Rankings</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-4">
              {overviewLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading coach data...</div>
              ) : !overview?.coaches?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No session data yet. Performance metrics will appear after coaching sessions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overview.coaches.map((coach) => {
                    const Icon = COACH_ICONS[coach.id] || Brain;
                    const colorClass = COACH_COLORS[coach.id] || "from-gray-500 to-gray-600";
                    
                    return (
                      <Card 
                        key={coach.id} 
                        className={`hover:shadow-lg transition-all cursor-pointer ${selectedCoach === coach.id ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setSelectedCoach(selectedCoach === coach.id ? null : coach.id)}
                      >
                        <CardHeader className={`bg-gradient-to-r ${colorClass} text-white rounded-t-lg py-3`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              <CardTitle className="text-lg">{coach.name}</CardTitle>
                            </div>
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              {coach.type}
                            </Badge>
                          </div>
                          <CardDescription className="text-white/80 text-xs">
                            {coach.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Sessions</p>
                              <p className="text-lg font-bold">{coach.stats.totalSessions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Avg Rating</p>
                              <p className="text-lg font-bold flex items-center gap-1">
                                {coach.stats.avgRating}
                                {coach.stats.avgRating !== "N/A" && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Completion</p>
                              <p className="text-lg font-bold">{coach.stats.completionRate}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Breakthroughs</p>
                              <p className="text-lg font-bold flex items-center gap-1">
                                {coach.stats.totalBreakthroughs}
                                <Zap className="h-4 w-4 text-purple-500" />
                              </p>
                            </div>
                          </div>
                          
                          {coach.stats.totalSessions > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Completion Rate</span>
                                <span>{coach.stats.completionRate}%</span>
                              </div>
                              <Progress value={coach.stats.completionRate} className="h-2" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Selected Coach Detail */}
              {selectedCoach && coachDetail && (
                <Card className="mt-6 border-2 border-purple-200">
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      {coachDetail.config?.name} - Detailed Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* What's Working */}
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-3 text-green-700">
                          <ThumbsUp className="h-4 w-4" />
                          What's Working
                        </h4>
                        {coachDetail.whatWorks?.length > 0 ? (
                          <ul className="space-y-2">
                            {coachDetail.whatWorks.map((item: any, i: number) => (
                              <li key={i} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                <span className="text-sm">{item.item}</span>
                                <Badge variant="outline" className="bg-green-100 text-green-700">
                                  {item.count}x
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No data yet</p>
                        )}
                      </div>

                      {/* What's Not Working */}
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-3 text-red-700">
                          <ThumbsDown className="h-4 w-4" />
                          Needs Improvement
                        </h4>
                        {coachDetail.whatDoesntWork?.length > 0 ? (
                          <ul className="space-y-2">
                            {coachDetail.whatDoesntWork.map((item: any, i: number) => (
                              <li key={i} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                                <span className="text-sm">{item.item}</span>
                                <Badge variant="outline" className="bg-red-100 text-red-700">
                                  {item.count}x
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No issues reported</p>
                        )}
                      </div>
                    </div>

                    {/* Technique Effectiveness */}
                    {coachDetail.techniques?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4 text-blue-600" />
                          Technique Effectiveness
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {coachDetail.techniques.slice(0, 8).map((tech: any, i: number) => (
                            <div key={i} className="p-2 bg-blue-50 rounded-lg text-center">
                              <p className="text-xs font-medium truncate">{tech.name}</p>
                              <p className="text-lg font-bold text-blue-700">{tech.avgRating}</p>
                              <p className="text-xs text-muted-foreground">{tech.timesUsed} uses</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evolution Log */}
                    {coachDetail.evolutionLog?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          Recent Changes
                        </h4>
                        <div className="space-y-2">
                          {coachDetail.evolutionLog.slice(0, 5).map((log: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              <Badge variant="outline">{log.changeType}</Badge>
                              <span className="text-sm flex-1">{log.description}</span>
                              <Badge className={
                                log.impact === 'positive' ? 'bg-green-100 text-green-700' :
                                log.impact === 'negative' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }>
                                {log.impact}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* RANKINGS TAB */}
            <TabsContent value="rankings" className="space-y-4">
              {overview?.rankings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* By Rating */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        By Client Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {overview.rankings.byRating.map((item: any) => {
                          const coach = overview.coaches.find((c: any) => c.id === item.coachId);
                          return (
                            <div key={item.coachId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {getRankBadge(item.rank)}
                                <span className="font-medium">{coach?.name}</span>
                              </div>
                              <span className="font-bold">{item.value} ⭐</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* By Breakthroughs */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        By Breakthroughs/Session
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {overview.rankings.byBreakthroughs.map((item: any) => {
                          const coach = overview.coaches.find((c: any) => c.id === item.coachId);
                          return (
                            <div key={item.coachId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {getRankBadge(item.rank)}
                                <span className="font-medium">{coach?.name}</span>
                              </div>
                              <span className="font-bold">{item.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* By Completion Rate */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        By Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {overview.rankings.byCompletionRate.map((item: any) => {
                          const coach = overview.coaches.find((c: any) => c.id === item.coachId);
                          return (
                            <div key={item.coachId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {getRankBadge(item.rank)}
                                <span className="font-medium">{coach?.name}</span>
                              </div>
                              <span className="font-bold">{item.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* By Volume */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        By Session Volume
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {overview.rankings.byVolume.map((item: any) => {
                          const coach = overview.coaches.find((c: any) => c.id === item.coachId);
                          return (
                            <div key={item.coachId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {getRankBadge(item.rank)}
                                <span className="font-medium">{coach?.name}</span>
                              </div>
                              <span className="font-bold">{item.value} sessions</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* INSIGHTS TAB */}
            <TabsContent value="insights" className="space-y-4">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Lightbulb className="h-5 w-5" />
                    Key Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Auto-generated insights based on data */}
                  {overview?.coaches && (
                    <>
                      {/* Top Performer */}
                      {overview.rankings?.byRating?.[0] && (
                        <div className="p-4 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span className="font-semibold text-green-700">Top Performer</span>
                          </div>
                          <p className="text-sm">
                            <strong>{overview.coaches.find((c: any) => c.id === overview.rankings.byRating[0].coachId)?.name}</strong> is currently the highest-rated coach 
                            with a {overview.rankings.byRating[0].value} star rating. Study what makes this coach effective and apply learnings to others.
                          </p>
                        </div>
                      )}

                      {/* Improvement Opportunity */}
                      {overview.rankings?.byCompletionRate && (
                        <div className="p-4 bg-white rounded-lg border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span className="font-semibold text-amber-700">Improvement Opportunity</span>
                          </div>
                          <p className="text-sm">
                            Focus on improving session completion rates. Coaches with lower completion rates may need 
                            adjustments to their engagement style or session pacing.
                          </p>
                        </div>
                      )}

                      {/* Breakthrough Analysis */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-purple-500" />
                          <span className="font-semibold text-purple-700">Breakthrough Patterns</span>
                        </div>
                        <p className="text-sm">
                          Breakthroughs are the key to client transformation. Track which techniques and approaches 
                          lead to more breakthrough moments and replicate them across all coaches.
                        </p>
                      </div>

                      {/* Action Items */}
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          <span className="font-semibold text-blue-700">Recommended Actions</span>
                        </div>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Review top-rated sessions to identify winning patterns
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Analyze abandoned sessions to understand drop-off points
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Cross-train techniques from high-performing coaches
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Collect more client feedback to improve insights
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AICoachPerformance;
