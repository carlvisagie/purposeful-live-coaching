import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, AlertCircle } from "lucide-react";
import { toast } from "sonner";

/**
 * AI Disclosure Dialog
 * 
 * Complies with California SB 243 and New York AI Companion Models law:
 * - Shows disclosure at conversation start
 * - Repeats every 3 hours during active conversations
 * - Persists state across page refreshes
 */

const DISCLOSURE_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const STORAGE_KEY = "ai_disclosure_last_shown";

export function AIDisclosureDialog() {
  const [showDisclosure, setShowDisclosure] = useState(false);

  useEffect(() => {
    // Check if we need to show disclosure
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown) {
      // First time - show immediately
      setShowDisclosure(true);
    } else {
      const lastShownTime = parseInt(lastShown, 10);
      const timeSinceLastShown = now - lastShownTime;

      if (timeSinceLastShown >= DISCLOSURE_INTERVAL_MS) {
        // 3 hours have passed - show again
        setShowDisclosure(true);
      } else {
        // Schedule next disclosure
        const timeUntilNext = DISCLOSURE_INTERVAL_MS - timeSinceLastShown;
        const timer = setTimeout(() => {
          setShowDisclosure(true);
        }, timeUntilNext);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Set up recurring 3-hour reminders
  useEffect(() => {
    const interval = setInterval(() => {
      setShowDisclosure(true);
    }, DISCLOSURE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = () => {
    // Record that disclosure was shown
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setShowDisclosure(false);
    
    // Show toast reminder
    toast.info("Reminder: You are chatting with AI, not a human", {
      duration: 5000,
      icon: <Bot className="h-4 w-4" />,
    });
  };

  return (
    <Dialog open={showDisclosure} onOpenChange={setShowDisclosure}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <DialogTitle>You Are Talking to AI</DialogTitle>
          </div>
          <DialogDescription className="space-y-3 text-left">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-medium">
                    You are chatting with an AI coach, not a human therapist.
                  </p>
                  <p>
                    This AI provides wellness support and emotional coaching, but it is <strong>not a replacement for professional mental health care</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>What this AI can do:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide 24/7 emotional support and wellness coaching</li>
                <li>Help you develop coping strategies and healthy habits</li>
                <li>Guide you through mindfulness and self-reflection</li>
                <li>Detect crisis situations and connect you to help</li>
              </ul>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>What this AI cannot do:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide therapy, diagnosis, or medical treatment</li>
                <li>Replace professional mental health care</li>
                <li>Handle immediate crisis situations</li>
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>If you're in crisis:</strong> Call <strong>988</strong> (Suicide & Crisis Lifeline) or <strong>911</strong> for immediate help.
              </p>
            </div>

            <p className="text-xs text-gray-500 italic">
              This disclosure will appear again in 3 hours as required by law.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAcknowledge} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
