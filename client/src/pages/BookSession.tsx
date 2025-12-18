import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle2, User, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SESSION_TYPES = [
  { value: "initial", label: "Initial Consultation (60 min)", duration: 60 },
  { value: "follow-up", label: "Follow-up Session (45 min)", duration: 45 },
  { value: "check-in", label: "Quick Check-in (30 min)", duration: 30 },
];

// Coach profiles - both you and your wife
const COACHES = [
  {
    id: 1,
    name: "Carl",
    title: "Lead Wellness Coach",
    gender: "male",
    specialties: ["Life Transitions", "Goal Setting", "Stress Management", "Career Coaching"],
    bio: "Experienced wellness coach specializing in helping clients navigate life transitions and achieve their personal goals through evidence-based coaching techniques.",
    image: null, // Will use initials
    available: true,
  },
  {
    id: 2,
    name: "Partner Coach",
    title: "Wellness & Support Coach",
    gender: "female",
    specialties: ["Emotional Support", "Relationship Coaching", "Self-Care", "Anxiety Management"],
    bio: "Compassionate wellness coach focused on emotional wellbeing, self-care practices, and building healthy relationships through supportive guidance.",
    image: null,
    available: true,
  },
];

export default function BookSession() {
  const { user } = useAuth();
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null);
  const coachId = selectedCoach || 1; // Default to first coach
  const clientId = user?.id || 1;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState("follow-up");
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const bookButtonRef = useRef<HTMLButtonElement>(null);

  // Get current month for calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get session duration based on type
  const duration = SESSION_TYPES.find(t => t.value === sessionType)?.duration || 45;

  // Reset slot when coach or date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedCoach, selectedDate]);

  // Fetch available slots when date and coach are selected
  const { data: slotsData, isLoading: loadingSlots } = trpc.scheduling.getAvailableSlots.useQuery(
    {
      coachId,
      date: selectedDate!,
      duration,
    },
    {
      enabled: selectedDate !== null && selectedCoach !== null,
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
      // Check if it's an authentication error
      if (error.message.includes('UNAUTHORIZED') || error.data?.code === 'UNAUTHORIZED') {
        toast.error("Please log in to book a session");
        // Save booking intent
        localStorage.setItem('bookingIntent', JSON.stringify({
          selectedSlot,
          sessionType,
          notes,
          coachId: selectedCoach,
        }));
        window.location.href = '/login?redirect=/sessions/book';
        return;
      }
      toast.error(`Failed to create checkout: ${error.message}`);
    },
  });

  const handleBookSession = () => {
    console.log('[BookSession] handleBookSession called');
    console.log('[BookSession] selectedSlot:', selectedSlot);
    console.log('[BookSession] selectedCoach:', selectedCoach);
    console.log('[BookSession] user:', user);
    
    if (!selectedCoach) {
      toast.error("Please select a coach");
      return;
    }
    
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      console.log('No slot selected');
      return;
    }

    // Get session type ID (map from value to ID)
    const sessionTypeMap: Record<string, number> = {
      "initial": 1,
      "follow-up": 2,
      "check-in": 3,
    };

    const sessionTypeId = sessionTypeMap[sessionType] || 2;

    // Create Stripe checkout with session details
    console.log('Calling createCheckout.mutate with:', { sessionTypeId, scheduledDate: selectedSlot, notes, coachId: selectedCoach });
    createCheckout.mutate({
      sessionTypeId,
      scheduledDate: selectedSlot,
      notes,
      coachId: selectedCoach,
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

  const selectedCoachData = COACHES.find(c => c.id === selectedCoach);

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
        <p className="text-muted-foreground">
          Choose your coach and select a time that works for you
        </p>
      </div>

      {/* Step 1: Coach Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Step 1: Choose Your Coach
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {COACHES.map((coach) => (
            <Card
              key={coach.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCoach === coach.id
                  ? "ring-2 ring-purple-600 border-purple-600 bg-purple-50"
                  : "hover:border-purple-300"
              }`}
              onClick={() => setSelectedCoach(coach.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Coach Avatar */}
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${
                    coach.gender === "male" 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                      : "bg-gradient-to-br from-pink-500 to-purple-600"
                  }`}>
                    {coach.name.charAt(0)}
                  </div>

                  {/* Coach Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{coach.name}</h3>
                      {selectedCoach === coach.id && (
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{coach.title}</p>
                    <p className="text-sm text-gray-600 mb-3">{coach.bio}</p>
                    
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {coach.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Preference Option */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCoach(COACHES[Math.floor(Math.random() * COACHES.length)].id)}
            className="text-muted-foreground"
          >
            No preference - assign next available coach
          </Button>
        </div>
      </div>

      {/* Step 2: Date & Time Selection (only show after coach selected) */}
      {selectedCoach && (
        <>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Step 2: Select Date & Time
          </h2>
          
          <div className="grid gap-6 md:grid-cols-[1fr,400px]">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Select a Date
                </CardTitle>
                <CardDescription>
                  Viewing availability for {selectedCoachData?.name}
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
              {/* Selected Coach Summary */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                      selectedCoachData?.gender === "male" 
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                        : "bg-gradient-to-br from-pink-500 to-purple-600"
                    }`}>
                      {selectedCoachData?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedCoachData?.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedCoachData?.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                <button
                  ref={bookButtonRef}
                  id="book-session-btn"
                  type="button"
                  onClick={handleBookSession}
                  disabled={createCheckout.isPending}
                  className="w-full h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
                >
                  {createCheckout.isPending ? 'Processing...' : `Book Session with ${selectedCoachData?.name}`}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center">Session Booked!</DialogTitle>
            <DialogDescription className="text-center">
              Your session with {selectedCoachData?.name} has been successfully scheduled. You'll receive a confirmation email shortly.
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
