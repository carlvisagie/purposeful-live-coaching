import { useEffect, useState } from "react";
import { Bot, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * AI Disclosure Banner (Non-Blocking)
 * 
 * Complies with California SB 243 and New York AI Companion Models law:
 * - Shows disclosure banner at conversation start
 * - Non-blocking - users can still use the app
 * - Repeats every 3 hours during active conversations
 * - Persists state across page refreshes
 */

const DISCLOSURE_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const STORAGE_KEY = "ai_disclosure_last_shown";

export function AIDisclosureDialog() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if we need to show disclosure
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown) {
      // First time - show immediately
      setShowBanner(true);
    } else {
      const lastShownTime = parseInt(lastShown, 10);
      const timeSinceLastShown = now - lastShownTime;

      if (timeSinceLastShown >= DISCLOSURE_INTERVAL_MS) {
        // 3 hours have passed - show again
        setShowBanner(true);
      } else {
        // Schedule next disclosure
        const timeUntilNext = DISCLOSURE_INTERVAL_MS - timeSinceLastShown;
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, timeUntilNext);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Set up recurring 3-hour reminders
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBanner(true);
    }, DISCLOSURE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    // Record that disclosure was shown
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <Bot className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">You're Chatting with AI</p>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Not a Human Therapist</span>
            </div>
            <p className="text-xs text-blue-100">
              This AI provides wellness support but is <strong>not a replacement for professional mental health care</strong>. 
              <span className="mx-1">•</span>
              <strong>Crisis?</strong> Call <strong>988</strong> (Suicide & Crisis Lifeline) or <strong>911</strong>.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to show toast reminders during active conversations
 * Shows a subtle reminder every 3 hours without blocking the UI
 */
export function useAIDisclosureReminder() {
  useEffect(() => {
    const checkAndShowReminder = () => {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      if (!lastShown) return;

      const now = Date.now();
      const lastShownTime = parseInt(lastShown, 10);
      const timeSinceLastShown = now - lastShownTime;

      // If 3 hours have passed, show toast reminder
      if (timeSinceLastShown >= DISCLOSURE_INTERVAL_MS) {
        toast.info("Reminder: You are chatting with AI, not a human therapist", {
          duration: 8000,
          icon: <Bot className="h-4 w-4" />,
        });
        localStorage.setItem(STORAGE_KEY, now.toString());
      }
    };

    // Check every minute
    const interval = setInterval(checkAndShowReminder, 60 * 1000);
    
    // Check immediately on mount
    checkAndShowReminder();

    return () => clearInterval(interval);
  }, []);
}
