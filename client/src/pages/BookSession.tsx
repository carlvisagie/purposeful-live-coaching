import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SESSION_TYPES = [
  { value: "initial", label: "Initial Consultation (60 min)", duration: 60 },
  { value: "follow-up", label: "Follow-up Session (45 min)", duration: 45 },
  { value: "check-in", label: "Quick Check-in (30 min)", duration: 30 },
];

export default function BookSession() {
  const [coachId] = useState(1); // TODO: Get from context or props
  const [clientId] = useState(1); // TODO: Get from auth context
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState("follow-up");
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get current month for calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get session duration based on type
  const duration = SESSION_TYPES.find(t => t.value === sessionType)?.duration || 45;

  // Fetch available slots when date is selected
  const { data: slotsData, isLoading: loadingSlots } = trpc.scheduling.getAvailableSlots.useQuery(
    {
      coachId,
      date: selectedDate!,
      duration,
    },
    {
      enabled: selectedDate !== null,
    }
  );

  // Create Stripe checkout session for payment
  const createCheckout = trpc.stripe.createSessionCheckout.useMutation({
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    },
    onError: (error) => {
      toast.error(`Failed to create checkout: ${error.message}`);
    },
  });

  const handleBookSession = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    // Get session type ID (map from value to ID)
    // TODO: Fetch actual session types from backend
    const sessionTypeMap: Record<string, number> = {
      "initial": 1,
      "follow-up": 2,
      "check-in": 3,
    };

    const sessionTypeId = sessionTypeMap[sessionType] || 2;

    // Create Stripe checkout with session details
    createCheckout.mutate({
      sessionTypeId,
      scheduledDate: selectedSlot,
      notes,
    });
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
        <p className="text-muted-foreground">
          Select a date and time that works for you
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,400px]">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select a Date
            </CardTitle>
            <CardDescription>
              Choose a date to see available time slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                ← Previous
              </Button>
              <h3 className="font-semibold">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                Next →
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((date, index) => (
                <button
                  key={index}
                  onClick={() => date && !isPast(date) && setSelectedDate(date)}
                  disabled={!date || isPast(date)}
                  className={`
                    aspect-square p-2 text-sm rounded-md transition-colors
                    ${!date ? "invisible" : ""}
                    ${isPast(date) ? "text-muted-foreground cursor-not-allowed" : "hover:bg-accent"}
                    ${isToday(date) ? "border-2 border-primary" : "border border-border"}
                    ${isSelected(date) ? "bg-primary text-primary-foreground" : ""}
                  `}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <div className="space-y-6">
          {/* Session Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Available Times
                </CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSlots ? (
                  <p className="text-sm text-muted-foreground">Loading available slots...</p>
                ) : slotsData?.slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No available slots on this date</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {slotsData?.slots.map(slot => {
                      const slotDate = new Date(slot);
                      const timeString = slotDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return (
                        <Button
                          key={slot}
                          variant={selectedSlot === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSlot(slot)}
                          className="justify-start"
                        >
                          {timeString}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {selectedSlot && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any specific topics or concerns you'd like to discuss?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          )}

          {/* Book Button */}
          {selectedSlot && (
            <Button
              onClick={handleBookSession}
              disabled={bookSession.isPending}
              className="w-full"
              size="lg"
            >
              Book Session
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center">Session Booked!</DialogTitle>
            <DialogDescription className="text-center">
              Your session has been successfully scheduled. You'll receive a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowConfirmation(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
