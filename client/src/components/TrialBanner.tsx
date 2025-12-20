/**
 * TrialBanner - Shows trial status and days remaining
 * 
 * Uses React Router for navigation (Safari-compatible)
 */

import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface TrialBannerProps {
  daysRemaining: number;
  tier: string;
  isTrialExpired: boolean;
  userRole?: "user" | "client" | "coach" | "admin";
  userEmail?: string;
}

// Owner emails that should never see the trial banner
const OWNER_EMAILS = [
  "carl@purposefullivecoaching.com",
  "carl@visagie.co.za",
  "admin@purposefullivecoaching.com",
];

export function TrialBanner({ daysRemaining, tier, isTrialExpired, userRole, userEmail }: TrialBannerProps) {
  const [, setLocation] = useLocation();
  
  // Don't show banner for owners - they own the platform!
  if (userEmail && OWNER_EMAILS.includes(userEmail.toLowerCase())) {
    return null;
  }
  
  // Don't show banner for paid users
  if (tier === "basic" || tier === "premium" || tier === "elite") {
    return null;
  }
  
  // Don't show banner for coaches or admins - they're the owners!
  if (userRole === "coach" || userRole === "admin") {
    return null;
  }

  const handleViewPlans = () => {
    setLocation("/pricing");
  };

  // Trial expired - show upgrade prompt
  if (isTrialExpired) {
    return (
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Clock className="h-4 w-4" />
          <span>
            {tier === "free" 
              ? "You're on the Free tier with limited features." 
              : "Your free trial has ended."}
          </span>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-orange-50 h-7 px-3"
            onClick={handleViewPlans}
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  // Active trial or guest - show trial banner
  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="h-4 w-4" />
        <span>
          <strong>{daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</strong> left in your free trial
          {daysRemaining <= 2 && " - Don't lose access!"}
        </span>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white text-purple-600 hover:bg-purple-50 h-7 px-3"
          onClick={handleViewPlans}
        >
          View Plans
        </Button>
      </div>
    </div>
  );
}

export default TrialBanner;
