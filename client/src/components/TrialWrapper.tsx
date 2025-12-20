/**
 * TrialWrapper - Shows trial banner to ALL visitors
 * 
 * FRICTIONLESS: No login required. Everyone sees the trial banner.
 * Only hidden on owner routes (control-center, owner, admin, settings)
 */

import { ReactNode } from "react";
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

export function TrialWrapper({ children }: TrialWrapperProps) {
  const [location] = useLocation();

  // Only hide banner on owner routes - show for EVERYONE else
  const isOwnerRoute = OWNER_ROUTES.some(route => location.startsWith(route));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show banner for ALL visitors except on owner routes */}
      {!isOwnerRoute && (
        <TrialBanner
          daysRemaining={7}
          tier="trial"
          isTrialExpired={false}
        />
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default TrialWrapper;
