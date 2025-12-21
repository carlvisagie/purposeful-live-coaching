/**
 * Notification Prompt Component
 * 
 * Shows a friendly prompt to enable push notifications
 * Appears after user completes first check-in or session
 * 
 * Research: Users who enable notifications have 2-3x higher engagement
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X, Sparkles } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

interface NotificationPromptProps {
  className?: string;
  onDismiss?: () => void;
  trigger?: "first-checkin" | "first-session" | "streak-risk" | "manual";
}

export default function NotificationPrompt({ 
  className, 
  onDismiss,
  trigger = "manual" 
}: NotificationPromptProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isSupported, isSubscribed, subscribe, isLoading } = usePushNotifications();

  // Don't show if already subscribed or not supported
  if (!isSupported || isSubscribed || !isVisible) {
    return null;
  }

  const handleEnable = async () => {
    setIsAnimating(true);
    const success = await subscribe({
      dailyCheckin: true,
      streakWarnings: true,
      sessionReminders: true,
      wellnessTips: true
    });
    
    if (success) {
      setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 1000);
    }
    setIsAnimating(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('notification-prompt-dismissed', Date.now().toString());
  };

  // Get message based on trigger
  const getMessage = () => {
    switch (trigger) {
      case "first-checkin":
        return {
          title: "Great job on your first check-in! 🎉",
          body: "Want daily reminders to keep your streak going?"
        };
      case "first-session":
        return {
          title: "Session complete! 🌟",
          body: "Enable notifications so you never miss a session."
        };
      case "streak-risk":
        return {
          title: "Protect your streak! 🔥",
          body: "Get reminders before your streak is at risk."
        };
      default:
        return {
          title: "Stay on track with reminders",
          body: "Get daily check-in reminders and wellness tips."
        };
    }
  };

  const message = getMessage();

  return (
    <Card className={cn(
      "relative overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50",
      "animate-in slide-in-from-top-2 duration-300",
      className
    )}>
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <CardContent className="pt-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            "shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-blue-400 to-purple-500",
            isAnimating && "animate-bounce"
          )}>
            <Bell className="h-6 w-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {message.title}
              {trigger === "first-checkin" && <Sparkles className="h-4 w-4 text-yellow-500" />}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {message.body}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleEnable}
                disabled={isLoading}
                size="sm"
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                {isLoading ? "Enabling..." : "Enable Notifications"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Hook to check if notification prompt should be shown
 */
export function useShouldShowNotificationPrompt(): boolean {
  const { isSupported, isSubscribed } = usePushNotifications();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if dismissed recently (within 7 days)
    const dismissed = localStorage.getItem('notification-prompt-dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (dismissedAt > sevenDaysAgo) {
        setShouldShow(false);
        return;
      }
    }

    setShouldShow(isSupported && !isSubscribed);
  }, [isSupported, isSubscribed]);

  return shouldShow;
}
