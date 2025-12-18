/**
 * UpgradePrompt - Modal shown when trial expires or message limit reached
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Clock, MessageCircle, Calendar, Phone } from "lucide-react";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  reason: "trial_expired" | "message_limit" | "feature_locked";
  daysRemaining?: number;
  messagesUsed?: number;
  messageLimit?: number;
}

export function UpgradePrompt({
  isOpen,
  onClose,
  reason,
  daysRemaining = 0,
  messagesUsed = 0,
  messageLimit = 5,
}: UpgradePromptProps) {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (reason) {
      case "trial_expired":
        return "Your Free Trial Has Ended";
      case "message_limit":
        return "Daily Message Limit Reached";
      case "feature_locked":
        return "Premium Feature";
      default:
        return "Upgrade Your Plan";
    }
  };

  const getDescription = () => {
    switch (reason) {
      case "trial_expired":
        return "You've experienced the full power of Purposeful Live Coaching. Continue your transformation journey with a subscription.";
      case "message_limit":
        return `You've used ${messagesUsed}/${messageLimit} messages today. Upgrade for unlimited AI coaching conversations.`;
      case "feature_locked":
        return "This feature is available on Premium and Elite plans. Upgrade to unlock.";
      default:
        return "Upgrade to continue your coaching journey.";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription className="text-base">{getDescription()}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Free tier info */}
          {reason === "trial_expired" && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Free Tier:</strong> Continue with limited access
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  5 AI messages per day
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Basic wellness modules only
                </li>
              </ul>
            </div>
          )}

          {/* Premium benefits */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">Most Popular</Badge>
              <span className="font-semibold">Premium - $149/month</span>
            </div>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2 text-gray-700">
                <MessageCircle className="h-4 w-4 text-pink-500" />
                Unlimited AI coaching conversations
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-pink-500" />
                1 human coaching session/month
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-pink-500" />
                24/7 voice call access
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Sparkles className="h-4 w-4 text-pink-500" />
                All 33 wellness modules
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            onClick={() => window.location.href = "/pricing"}
          >
            View Plans & Upgrade
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-500"
            onClick={onClose}
          >
            {reason === "trial_expired" ? "Continue with Free Tier" : "Maybe Later"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UpgradePrompt;
