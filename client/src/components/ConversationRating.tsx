import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ConversationRatingProps {
  conversationId: number;
  onRatingSubmitted?: () => void;
}

/**
 * Conversation Rating Component
 * Allows users to rate AI coaching conversations with thumbs up/down or star rating
 * Collects optional detailed feedback
 */
export function ConversationRating({ conversationId, onRatingSubmitted }: ConversationRatingProps) {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [wasHelpful, setWasHelpful] = useState<"yes" | "no" | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState<string>("");

  const rateMutation = trpc.aiChatFeedback.rateConversation.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      setShowFeedbackDialog(false);
      setFeedbackText("");
      setFeedbackCategory("");
      onRatingSubmitted?.();
    },
    onError: (error) => {
      toast.error(`Failed to submit rating: ${error.message}`);
    },
  });

  const handleQuickRating = (helpful: "yes" | "no") => {
    setWasHelpful(helpful);
    
    // Submit quick rating immediately
    rateMutation.mutate({
      conversationId,
      wasHelpful: helpful,
    });

    // If unhelpful, show feedback dialog
    if (helpful === "no") {
      setTimeout(() => setShowFeedbackDialog(true), 500);
    }
  };

  const handleStarRating = (stars: number) => {
    setRating(stars);
    
    // If low rating (1-2 stars), show feedback dialog
    if (stars <= 2) {
      setShowFeedbackDialog(true);
    } else {
      // Submit high rating immediately
      rateMutation.mutate({
        conversationId,
        rating: stars,
        wasHelpful: stars >= 4 ? "yes" : "no",
      });
    }
  };

  const handleSubmitDetailedFeedback = () => {
    rateMutation.mutate({
      conversationId,
      wasHelpful: wasHelpful || undefined,
      rating: rating || undefined,
      feedbackText: feedbackText.trim() || undefined,
      feedbackCategory: feedbackCategory as any || undefined,
    });
  };

  return (
    <>
      {/* Quick Rating Buttons */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Was this conversation helpful?</span>
        <div className="flex gap-2">
          <Button
            variant={wasHelpful === "yes" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickRating("yes")}
            disabled={rateMutation.isPending}
            className={wasHelpful === "yes" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful
          </Button>
          <Button
            variant={wasHelpful === "no" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickRating("no")}
            disabled={rateMutation.isPending}
            className={wasHelpful === "no" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            Not Helpful
          </Button>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 ml-4 border-l pl-4">
          <span className="text-sm text-gray-600 mr-2">Rate:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarRating(star)}
              disabled={rateMutation.isPending}
              className="focus:outline-none"
            >
              <Star
                className={`h-5 w-5 ${
                  rating && star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help Us Improve</DialogTitle>
            <DialogDescription>
              We're sorry this conversation wasn't helpful. Your feedback helps us improve the AI coaching experience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Feedback Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                What went wrong?
              </label>
              <Select value={feedbackCategory} onValueChange={setFeedbackCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unhelpful">Advice wasn't helpful</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate response</SelectItem>
                  <SelectItem value="technical_error">Technical error</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Detailed Feedback Text */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Additional details (optional)
              </label>
              <Textarea
                placeholder="Tell us more about what happened..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFeedbackDialog(false)}
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmitDetailedFeedback}
              disabled={rateMutation.isPending}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
