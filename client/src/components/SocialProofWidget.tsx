import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Eye, CheckCircle2 } from "lucide-react";

interface SocialProofWidgetProps {
  pageType: "decision-tree" | "ai-coaching" | "book-session" | "enterprise";
  variant?: "viewers" | "bookings" | "both";
}

export function SocialProofWidget({
  pageType,
  variant = "both",
}: SocialProofWidgetProps) {
  const [showNotification, setShowNotification] = useState(false);

  // Page activity removed - no fake viewer counts
  const activityData = null;
  const activityLoading = false;

  // Get recent bookings
  const { data: bookingsData, isLoading: bookingsLoading } =
    trpc.socialProof.getRecentBookings.useQuery(
      { limit: 5 },
      {
        refetchInterval: 15000, // Update every 15 seconds
      }
    );

  // Show notification animation for new bookings
  useEffect(() => {
    if (bookingsData && bookingsData.length > 0) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [bookingsData]);

  if (bookingsLoading) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Viewers Widget - Disabled - No fake data */}

      {/* Recent Bookings Notification */}
      {(variant === "bookings" || variant === "both") &&
        bookingsData &&
        bookingsData.length > 0 && (
          <div
            className={`transition-all duration-300 ${
              showNotification
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                <strong>{bookingsData[0].name}</strong> just booked{" "}
                {bookingsData[0].sessionType}
              </span>
            </div>
          </div>
        )}
    </div>
  );
}

/**
 * Compact version for inline placement
 */
export function SocialProofBadge({
  pageType,
  type = "viewers",
}: {
  pageType: "decision-tree" | "ai-coaching" | "book-session" | "enterprise";
  type?: "viewers" | "bookings";
}) {
  // Viewers data removed - only showing real bookings
  const activityData = null;

  const { data: bookingsData } = trpc.socialProof.getRecentBookings.useQuery(
    { limit: 1 },
    { refetchInterval: 15000 }
  );

  if (false && type === "viewers" && activityData) {
    return null;
  }

  if (bookingsData && bookingsData.length > 0) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
        <CheckCircle2 className="h-3 w-3" />
        {bookingsData[0].name} just booked
      </div>
    );
  }

  return null;
}
