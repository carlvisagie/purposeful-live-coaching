/**
 * TrialWrapper - Wraps the app to show trial banner and upgrade prompts
 * 
 * Made robust for mobile Safari - never blocks rendering
 */

import { ReactNode, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { TrialBanner } from "./TrialBanner";

interface TrialWrapperProps {
  children: ReactNode;
}

// Owner/admin routes where the trial banner should NOT show
const OWNER_ROUTES = [
  "/control-center",
  "/owner",
  "/admin",
  "/settings",
];

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
  const { trialStatus, isLoading, user } = useAuth();
  const [location] = useLocation();

  // Check if current route is an owner/admin route
  const isOwnerRoute = OWNER_ROUTES.some(route => location.startsWith(route));

  // Always render children - never block on loading
  // This prevents blank page issues on mobile Safari
  return (
    <div className="flex flex-col min-h-screen">
      {/* Don't show banner on owner routes - they own the platform! */}
      {!isLoading && trialStatus && !isOwnerRoute && (
        <TrialBanner
          daysRemaining={trialStatus.daysRemaining || 0}
          tier={trialStatus.tier || "free"}
          isTrialExpired={trialStatus.isTrialExpired || false}
          userRole={user?.role}
          userEmail={user?.email}
        />
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default TrialWrapper;
