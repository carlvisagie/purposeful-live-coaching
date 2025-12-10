import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Loader2,
  BarChart3,
  Brain,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LOGIN_URL } from "@/const";
import { Badge } from "@/components/ui/badge";

/**
 * AI Insights Dashboard - Pattern detection and progress visualization
 * Features:
 * - Emotion trend charts
 * - Pattern detection
 * - AI-generated insights
 * - Progress metrics
 * - Personalized recommendations
 */
export default function InsightsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [clientId] = useState(1);

  // Fetch AI insights
  const { data: insightsData, refetch } = trpc.aiInsights.list.useQuery(
    { clientId },
    { enabled: !!user }
  );

  // Fetch emotion logs for trends
  const { data: emotionData } = trpc.emotionLogs.list.useQuery(
    { clientId },
    { enabled: !!user }
  );

  // Generate insights mutation
  const generateInsightsMutation = trpc.aiInsights.generate.useMutation({
    onSuccess: () => {
      toast.success("New insights generated!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate insights");
    },
  });

  // Mark insight as read - skip if endpoint doesn't exist
  const markRead = (insightId: number) => {
    // TODO: Implement mark as read mutation
    console.log("Mark as read:", insightId);
    refetch();
  };

  if (!authLoading && !user) {
    window.location.href = LOGIN_URL();
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const insights = insightsData || [];
  const emotionLogs = emotionData || [];

  // Calculate metrics
  const totalLogs = emotionLogs.length;
  const last7Days = emotionLogs.slice(0, 7);
  const avgIntensity = last7Days.length
    ? (last7Days.reduce((sum, log) => sum + log.intensity, 0) / last7Days.length).toFixed(1)
    : "0";

  // Count emotion types
  const emotionCounts = emotionLogs.reduce((acc: any, log) => {
    acc[log.emotionType] = (acc[log.emotionType] || 0) + 1;
    return acc;
  }, {});

  const mostCommonEmotion = Object.entries(emotionCounts).sort(
    ([, a]: any, [, b]: any) => b - a
  )[0]?.[0] || "N/A";

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-5 w-5" />;
      case "medium":
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case "pattern":
        return <BarChart3 className="h-5 w-5" />;
      case "trend":
        return <TrendingUp className="h-5 w-5" />;
      case "recommendation":
        return <Target className="h-5 w-5" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-gray-900">AI Insights</span>
            </div>
            <Button variant="ghost" onClick={() => (window.location.href = "/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Check-Ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalLogs}</div>
              <p className="text-xs text-gray-500 mt-1">Emotional logs recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Intensity (7d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{avgIntensity}/10</div>
              <p className="text-xs text-gray-500 mt-1">Last 7 days average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Most Common
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 capitalize">
                {mostCommonEmotion}
              </div>
              <p className="text-xs text-gray-500 mt-1">Primary emotion</p>
            </CardContent>
          </Card>
        </div>

        {/* Generate Insights Button */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-rose-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI-Powered Pattern Analysis
                  </h3>
                  <p className="text-sm opacity-90">
                    Let AI analyze your emotional patterns and generate personalized insights
                  </p>
                </div>
                <Button
                  onClick={() => generateInsightsMutation.mutate({ clientId })}
                  disabled={generateInsightsMutation.isPending || totalLogs < 3}
                  className="bg-white text-rose-600 hover:bg-gray-100"
                >
                  {generateInsightsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </div>
              {totalLogs < 3 && (
                <p className="text-xs mt-3 opacity-75">
                  ℹ️ Log at least 3 emotions to generate AI insights
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-rose-500" />
            Your Insights
          </h2>

          {insights.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No insights yet
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Track your emotions for a few days, then click "Generate Insights" to discover
                  patterns and get personalized recommendations.
                </p>
              </CardContent>
            </Card>
          ) : (
            insights.map((insight: any) => (
              <Card
                key={insight.id}
                className={`border-2 ${
                  insight.isRead === "false" ? "border-rose-300 shadow-lg" : "border-gray-200"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(insight.severity)}>
                          {getSeverityIcon(insight.severity)}
                          <span className="ml-1 capitalize">{insight.severity}</span>
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {getInsightTypeIcon(insight.insightType)}
                          <span className="ml-1">{insight.insightType}</span>
                        </Badge>
                        {insight.isRead === "false" && (
                          <Badge className="bg-rose-500 text-white">New</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(insight.insightDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  {insight.actionable && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Recommended Actions
                      </h4>
                      <p className="text-sm text-blue-800">{insight.actionable}</p>
                    </div>
                  )}
                  {insight.isRead === "false" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => markRead(insight.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
