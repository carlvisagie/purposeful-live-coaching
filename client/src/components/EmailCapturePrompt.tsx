import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, X, Sparkles, CheckCircle } from "lucide-react";

interface EmailCapturePromptProps {
  messageCount: number;
  onDismiss: () => void;
  onEmailCaptured: (email: string) => void;
}

/**
 * Smart Email Capture Prompt
 * Shows after a certain number of messages in AI Coach
 * Offers value in exchange for email (summary, resources, etc.)
 */
export function EmailCapturePrompt({
  messageCount,
  onDismiss,
  onEmailCaptured,
}: EmailCapturePromptProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const captureEmailMutation = trpc.emailCapture.captureIndividualEmail.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      onEmailCaptured(email);
      toast.success("Thanks! Check your email for your personalized resources.");
      
      // Store in localStorage to not show again
      localStorage.setItem("plc_email_captured", "true");
      localStorage.setItem("plc_user_email", email);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    captureEmailMutation.mutate({
      email: email.trim(),
      plan: "essential", // Default plan for AI coach users
    });
  };

  // Don't show if already captured
  if (localStorage.getItem("plc_email_captured") === "true") {
    return null;
  }

  // Show success state briefly
  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mx-4 mb-4 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-900">You're all set!</p>
            <p className="text-sm text-green-700">Check your inbox for your personalized resources.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-rose-50 border border-purple-200 rounded-lg p-4 mx-4 mb-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-rose-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-1">
              I'm enjoying our conversation! 💜
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Want me to send you a summary of our chat plus some personalized resources based on what we've discussed?
            </p>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-9 bg-white border-gray-300 focus:border-purple-400 focus:ring-purple-200"
                />
              </div>
              <Button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white whitespace-nowrap"
              >
                {isSubmitting ? "Sending..." : "Yes, send it!"}
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-2">
              No spam, ever. Just helpful resources tailored to your journey.
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
