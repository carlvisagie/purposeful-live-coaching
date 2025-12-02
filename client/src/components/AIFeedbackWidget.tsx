import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";

interface AIFeedbackWidgetProps {
  responseId: string;
  onFeedbackSubmitted?: () => void;
}

/**
 * Feedback widget for AI coaching responses
 * Allows users to rate and comment on AI responses
 */
export function AIFeedbackWidget({
  responseId,
  onFeedbackSubmitted,
}: AIFeedbackWidgetProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState<
    "accuracy" | "helpfulness" | "tone" | "relevance" | "clarity"
  >("helpfulness");
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = trpc.aiFeedback.submitFeedback.useMutation();

  const handleSubmit = async () => {
    if (!rating) return;

    await submitFeedback.mutateAsync({
      responseId,
      rating,
      comment: comment || undefined,
      category,
    });

    setSubmitted(true);
    onFeedbackSubmitted?.();

    // Reset after 3 seconds
    setTimeout(() => {
      setRating(null);
      setComment("");
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm text-green-700 font-medium">
          Thank you! Your feedback helps us improve.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Was this response helpful?
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              className={`p-2 rounded transition-colors ${
                rating === value
                  ? "bg-yellow-400 text-white"
                  : "bg-white border border-gray-300 text-gray-400 hover:text-yellow-400"
              }`}
            >
              <Star className="h-5 w-5 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {rating && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | "accuracy"
                    | "helpfulness"
                    | "tone"
                    | "relevance"
                    | "clarity"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="accuracy">Accuracy</option>
              <option value="helpfulness">Helpfulness</option>
              <option value="tone">Tone</option>
              <option value="relevance">Relevance</option>
              <option value="clarity">Clarity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what could be improved..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              rows={2}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitFeedback.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </>
      )}
    </div>
  );
}

/**
 * Feedback Analytics Dashboard
 */
export function AIFeedbackDashboard() {
  const { data: analytics, isLoading } =
    trpc.aiFeedback.getAnalytics.useQuery();
  const { data: summary } = trpc.aiFeedback.getFeedbackSummary.useQuery();
  const { data: report } = trpc.aiFeedback.getImprovementReport.useQuery();

  if (isLoading) {
    return <div className="text-center py-8">Loading feedback analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Total Feedback</p>
            <p className="text-3xl font-bold text-blue-600">
              {summary?.totalFeedback || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-yellow-500">
                {summary?.averageRating || 0}
              </p>
              <span className="text-sm text-gray-500">/5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Quality Score</p>
            <p className="text-3xl font-bold text-green-600">
              {summary?.qualityScore || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Trend</p>
            <div className="flex items-center gap-2">
              <TrendingUp
                className={`h-6 w-6 ${
                  summary?.ratingTrend === "improving"
                    ? "text-green-600"
                    : summary?.ratingTrend === "declining"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              />
              <span className="text-sm font-medium capitalize">
                {summary?.ratingTrend || "stable"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">
                    {rating} ⭐
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (analytics.ratingDistribution[
                            rating as 1 | 2 | 3 | 4 | 5
                          ] /
                            analytics.totalResponses) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {analytics.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Report */}
      {report && report.feedbackCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Improvement Report ({report.period})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Category Performance
              </p>
              <div className="space-y-2">
                {report.categoryPerformance?.map((cat) => (
                  <div key={cat.category} className="flex justify-between">
                    <span className="text-sm capitalize">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {cat.average}/5
                      </span>
                      <span className="text-xs text-gray-500">
                        ({cat.count} ratings)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {report.recommendations.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Recommendations
                </p>
                <ul className="space-y-1">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex gap-2">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
