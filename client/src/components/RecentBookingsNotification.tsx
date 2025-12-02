import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, X } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  sessionType: string;
  timeAgo: string;
}

/**
 * Displays a rotating carousel of recent bookings
 */
export function RecentBookingsNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedBookings, setDisplayedBookings] = useState<Booking[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const { data: bookingsData } = trpc.socialProof.getRecentBookings.useQuery(
    { limit: 5 },
    {
      refetchInterval: 20000, // Update every 20 seconds
    }
  );

  // Update displayed bookings and rotate
  useEffect(() => {
    if (bookingsData && bookingsData.length > 0) {
      setDisplayedBookings(bookingsData);

      // Auto-rotate through bookings every 5 seconds
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bookingsData.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [bookingsData]);

  if (!isVisible || displayedBookings.length === 0) {
    return null;
  }

  const currentBooking = displayedBookings[currentIndex];

  return (
    <div className="fixed bottom-6 right-6 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 flex items-start gap-3">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            <span className="font-semibold text-green-600">
              {currentBooking.name}
            </span>{" "}
            just booked
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {currentBooking.sessionType} • {currentBooking.timeAgo}
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Pagination dots */}
      {displayedBookings.length > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {displayedBookings.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Inline version for embedding in pages
 */
export function RecentBookingsInline() {
  const { data: bookingsData, isLoading } =
    trpc.socialProof.getRecentBookings.useQuery({ limit: 3 });

  if (isLoading || !bookingsData || bookingsData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-700">Recent Bookings</p>
      <div className="space-y-2">
        {bookingsData.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100"
          >
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {booking.name}
              </p>
              <p className="text-xs text-gray-600">{booking.sessionType}</p>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {booking.timeAgo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
