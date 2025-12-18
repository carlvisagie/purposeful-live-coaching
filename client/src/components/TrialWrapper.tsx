/**
 * TrialWrapper - Wraps the app to show trial banner and upgrade prompts
 */

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TrialBanner } from "./TrialBanner";

interface TrialWrapperProps {
  children: ReactNode;
}

export function TrialWrapper({ children }: TrialWrapperProps) {
  const { trialStatus, isLoading } = useAuth();

  // Don't show banner while loading
  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TrialBanner
        daysRemaining={trialStatus?.daysRemaining || 0}
        tier={trialStatus?.tier || "free"}
        isTrialExpired={trialStatus?.isTrialExpired || false}
      />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default TrialWrapper;
