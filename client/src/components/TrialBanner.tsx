/**
 * TrialBanner - Shows "7 days free trial" to ALL visitors
 * 
 * FRICTIONLESS: No login required. No auth checks.
 * Just shows the banner to drive conversions.
 */

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface TrialBannerProps {
  daysRemaining?: number;
  tier?: string;
  isTrialExpired?: boolean;
}

export function TrialBanner({ daysRemaining = 7 }: TrialBannerProps) {
  const [, setLocation] = useLocation();

  const handleViewPlans = () => {
    setLocation("/pricing");
  };

  // Simple banner for ALL visitors
  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="h-4 w-4" />
        <span>
          <strong>{daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</strong> left in your free trial
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
