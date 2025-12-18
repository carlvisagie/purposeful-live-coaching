/**
 * TrialWrapper - Wraps the app to show trial banner and upgrade prompts
 * 
 * Made robust for mobile Safari - never blocks rendering
 */

import { ReactNode, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TrialBanner } from "./TrialBanner";

interface TrialWrapperProps {
  children: ReactNode;
}

// Loading fallback that shows children immediately
function LoadingFallback({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Show a minimal banner placeholder while loading */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-center text-sm opacity-50">
        <span>Loading...</span>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export function TrialWrapper({ children }: TrialWrapperProps) {
  const { trialStatus, isLoading } = useAuth();

  // Always render children - never block on loading
  // This prevents blank page issues on mobile Safari
  return (
    <div className="flex flex-col min-h-screen">
      {!isLoading && trialStatus && (
        <TrialBanner
          daysRemaining={trialStatus.daysRemaining || 0}
          tier={trialStatus.tier || "free"}
          isTrialExpired={trialStatus.isTrialExpired || false}
        />
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default TrialWrapper;
