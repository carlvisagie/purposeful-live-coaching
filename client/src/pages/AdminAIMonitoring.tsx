import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Star,
  Eye,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

/**
 * Admin AI Quality Monitoring Dashboard
 * Monitor AI coaching quality, review conversations, track metrics
 */
export default function AdminAIMonitoring() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "rated" | "unrated" | "helpful" | "unhelpful" | "needs_review">("needs_review");

  // Auth check disabled for demo/development
  // if (!authLoading && user && user.role !== "admin") {
  //   setLocation("/dashboard");
  //   return null;
  // }

  // Fetch quality metrics
  const { data: metrics, isLoading: metricsLoading } = trpc.aiChatFeedback.getQualityMetrics.useQuery();

  // Fetch conversations needing review
  const { data: conversationsNeedingReview, refetch: refetchNeedingReview } = 
    trpc.aiChatFeedback.getConversationsNeedingReview.useQuery();

  // Fetch all conversations with feedback
  const { data: conversationsData, refetch: refetchConversations } = 
    trpc.aiChatFeedback.getAllConversationsWithFeedback.useQuery({
      limit: 50,
      offset: 0,
      filterBy,
    });

  // Mark as reviewed mutation
  const markAsReviewedMutation = trpc.aiChatFeedback.markAsReviewed.useMutation({
    onSuccess: () => {
      toast.success("Conversation marked as reviewed");
      setReviewDialogOpen(false);
      setAdminNotes("");
      refetchNeedingReview();
      refetchConversations();
    },
    onError: (error) => {
      toast.error(`Failed to mark as reviewed: ${error.message}`);
    },
  });

  const handleReviewConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setAdminNotes(conversation.adminNotes || "");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedConversation) return;
    
    markAsReviewedMutation.mutate({
      conversationId: selectedConversation.id,
      adminNotes: adminNotes.trim() || undefined,
    });
  };

  if (metricsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const conversations = conversationsData?.conversations || [];
  const needsReview = conversationsNeedingReview || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">AI Quality Monitoring</h1>
            <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{metrics?.totalConversations || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics?.ratedConversations || 0} rated ({metrics?.ratingPercentage || 0}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-gray-900">
                  {metrics?.averageRating?.toFixed(1) || "N/A"}
                </div>
                {metrics?.averageRating && (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(metrics.averageRating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Out of 5 stars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Helpful Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-green-600">
                  {metrics?.helpfulPercentage || 0}%
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics?.helpfulCount || 0} helpful, {metrics?.unhelpfulCount || 0} not helpful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Needs Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-red-600">{needsReview.length}</div>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Low ratings or negative feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Breakdown */}
        {metrics?.feedbackByCategory && metrics.feedbackByCategory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Feedback Categories</CardTitle>
              <CardDescription>Distribution of feedback by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.feedbackByCategory.map((item: any) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {item.category?.replace("_", " ") || "Uncategorized"}
                    </span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversations Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Review and monitor AI coaching conversations</CardDescription>
              </div>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conversations</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                  <SelectItem value="rated">Rated</SelectItem>
                  <SelectItem value="unrated">Unrated</SelectItem>
                  <SelectItem value="helpful">Helpful</SelectItem>
                  <SelectItem value="unhelpful">Not Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No conversations found
                    </TableCell>
                  </TableRow>
                ) : (
                  conversations.map((conv: any) => (
                    <TableRow key={conv.id}>
                      <TableCell className="font-medium">
                        {conv.title || "Untitled Conversation"}
                      </TableCell>
                      <TableCell>
                        {conv.rating ? (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{conv.rating}</span>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        ) : conv.wasHelpful === "yes" ? (
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                        ) : conv.wasHelpful === "no" ? (
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {conv.feedbackText || <span className="text-gray-400">—</span>}
                      </TableCell>
                      <TableCell>
                        {conv.feedbackCategory ? (
                          <Badge variant={conv.feedbackCategory === "helpful" ? "default" : "destructive"}>
                            {conv.feedbackCategory.replace("_", " ")}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(conv.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {conv.reviewedByAdmin === "yes" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReviewConversation(conv)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Conversation</DialogTitle>
            <DialogDescription>
              Review this conversation and add admin notes
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-4">
              {/* Conversation Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Title</p>
                  <p className="text-sm text-gray-900">{selectedConversation.title || "Untitled"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedConversation.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-sm text-gray-900">
                    {selectedConversation.rating ? `${selectedConversation.rating}/5 stars` : 
                     selectedConversation.wasHelpful === "yes" ? "Helpful" :
                     selectedConversation.wasHelpful === "no" ? "Not Helpful" : "Not rated"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {selectedConversation.feedbackCategory?.replace("_", " ") || "—"}
                  </p>
                </div>
              </div>

              {/* User Feedback */}
              {selectedConversation.feedbackText && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">User Feedback</p>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-900">{selectedConversation.feedbackText}</p>
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Admin Notes
                </label>
                <Textarea
                  placeholder="Add your review notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={markAsReviewedMutation.isPending}
            >
              Mark as Reviewed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
