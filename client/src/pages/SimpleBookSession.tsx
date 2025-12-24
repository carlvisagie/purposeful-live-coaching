/**
 * Simple Book Session Page
 * 
 * A clean, working booking interface that ACTUALLY WORKS.
 * No complex logic, just straightforward booking.
 */

import { useState } from "react";
import { trpc } from "../lib/trpc";
import { format, addDays, startOfDay } from "date-fns";

export default function SimpleBookSession() {
  const [selectedCoachId, setSelectedCoachId] = useState<number>(1); // Default to Carl
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(15);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Fetch available slots
  const { data: slotsData, isLoading: slotsLoading } = trpc.simpleBooking.getAvailableSlots.useQuery({
    coachId: selectedCoachId,
    date: selectedDate,
    duration,
  });

  // Book session mutation
  const bookMutation = trpc.simpleBooking.bookSession.useMutation({
    onSuccess: () => {
      setBookingComplete(true);
    },
    onError: (error) => {
      alert(`Booking failed: ${error.message}`);
    },
  });

  const handleBooking = () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    if (!clientName || !clientEmail) {
      alert("Please enter your name and email");
      return;
    }

    bookMutation.mutate({
      coachId: selectedCoachId,
      clientName,
      clientEmail,
      clientPhone,
      bookingDateTime: selectedSlot,
      duration,
      notes,
    });
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your session is scheduled for {selectedSlot && format(new Date(selectedSlot), "MMMM d, yyyy 'at' h:mm a")}
          </p>
          <button
            onClick={() => {
              setBookingComplete(false);
              setSelectedSlot(null);
              setClientName("");
              setClientEmail("");
              setClientPhone("");
              setNotes("");
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Book Another Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Book a Coaching Session</h1>

          {/* Coach Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Coach</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedCoachId(1)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedCoachId === 1
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold">Carl</div>
                <div className="text-sm text-gray-600">Life Coach</div>
              </button>
              <button
                onClick={() => setSelectedCoachId(2)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedCoachId === 2
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold">Besarta</div>
                <div className="text-sm text-gray-600">Wellness Coach</div>
              </button>
            </div>
          </div>

          {/* Session Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={15}>15 minutes - Quick Check-in</option>
              <option value={30}>30 minutes - Standard Session</option>
              <option value={60}>60 minutes - Deep Dive</option>
            </select>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((daysAhead) => {
                const date = addDays(startOfDay(new Date()), daysAhead);
                const dateStr = format(date, "yyyy-MM-dd");
                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setSelectedSlot(null);
                    }}
                    className={`p-3 rounded-lg border-2 transition ${
                      selectedDate === dateStr
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-xs text-gray-600">{format(date, "EEE")}</div>
                    <div className="font-semibold">{format(date, "MMM d")}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Time Slots */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
            {slotsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading available slots...</div>
            ) : slotsData?.slots && slotsData.slots.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {slotsData.slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-lg border-2 transition ${
                      selectedSlot === slot
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {format(new Date(slot), "h:mm a")}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No available slots for this date</div>
            )}
          </div>

          {/* Booking Form */}
          {selectedSlot && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Anything you'd like your coach to know..."
                />
              </div>
              <button
                onClick={handleBooking}
                disabled={bookMutation.isLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookMutation.isLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
