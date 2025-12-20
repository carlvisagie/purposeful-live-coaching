import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Clock, Save, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

const DAYS = [
  { id: 0, name: "Sunday", short: "Sun" },
  { id: 1, name: "Monday", short: "Mon" },
  { id: 2, name: "Tuesday", short: "Tue" },
  { id: 3, name: "Wednesday", short: "Wed" },
  { id: 4, name: "Thursday", short: "Thu" },
  { id: 5, name: "Friday", short: "Fri" },
  { id: 6, name: "Saturday", short: "Sat" },
];

// Generate time options in 30-minute increments (24-hour format)
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  }
}

interface DaySchedule {
  dayOfWeek: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export default function AvailabilityEditor({ coachId = 1 }: { coachId?: number }) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS.map(day => ({
      dayOfWeek: day.id,
      isActive: false,
      startTime: "09:00",
      endTime: "17:00",
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current availability
  const { data: availabilityData, refetch } = trpc.scheduling.getCoachAvailability.useQuery(
    { coachId },
    { enabled: true }
  );

  // Update schedule mutation
  const updateAvailability = trpc.scheduling.setCoachAvailability.useMutation({
    onSuccess: () => {
      // Don't show toast for each day - we'll show one at the end
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  // Delete availability mutation
  const deleteAvailability = trpc.scheduling.deleteCoachAvailability.useMutation();

  // Load existing availability into state
  useEffect(() => {
    if (availabilityData?.availability) {
      const newSchedule = DAYS.map(day => {
        const existing = availabilityData.availability.find(a => a.dayOfWeek === day.id);
        if (existing) {
          return {
            dayOfWeek: day.id,
            isActive: existing.isActive ?? true,
            startTime: existing.startTime,
            endTime: existing.endTime,
          };
        }
        return {
          dayOfWeek: day.id,
          isActive: false,
          startTime: "09:00",
          endTime: "17:00",
        };
      });
      setSchedule(newSchedule);
    }
  }, [availabilityData]);

  const handleDayToggle = (dayId: number, isActive: boolean) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayId ? { ...day, isActive } : day
      )
    );
  };

  const handleTimeChange = (dayId: number, field: "startTime" | "endTime", value: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayId ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save each active day
      for (const day of schedule) {
        if (day.isActive) {
          await updateAvailability.mutateAsync({
            coachId,
            dayOfWeek: day.dayOfWeek,
            startTime: day.startTime,
            endTime: day.endTime,
          });
        }
      }
      
      toast.success("Availability schedule saved!");
      refetch();
    } catch (error) {
      toast.error("Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick presets
  const applyWeekdayPreset = (start: string, end: string) => {
    setSchedule(prev =>
      prev.map(day => ({
        ...day,
        isActive: day.dayOfWeek >= 1 && day.dayOfWeek <= 5,
        startTime: day.dayOfWeek >= 1 && day.dayOfWeek <= 5 ? start : day.startTime,
        endTime: day.dayOfWeek >= 1 && day.dayOfWeek <= 5 ? end : day.endTime,
      }))
    );
  };

  const applyWeekendPreset = (start: string, end: string) => {
    setSchedule(prev =>
      prev.map(day => ({
        ...day,
        isActive: day.dayOfWeek === 0 || day.dayOfWeek === 6 ? true : day.isActive,
        startTime: day.dayOfWeek === 0 || day.dayOfWeek === 6 ? start : day.startTime,
        endTime: day.dayOfWeek === 0 || day.dayOfWeek === 6 ? end : day.endTime,
      }))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Availability Schedule
        </CardTitle>
        <CardDescription>
          Set your available hours for coaching sessions. Times are in 24-hour format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              applyWeekdayPreset("19:30", "21:30");
              applyWeekendPreset("10:30", "16:30");
            }}
          >
            Your Schedule (Weekdays 19:30-21:30, Weekends 10:30-16:30)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyWeekdayPreset("09:00", "17:00")}
          >
            Weekdays 9-5
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyWeekendPreset("10:00", "16:00")}
          >
            Weekends 10-4
          </Button>
        </div>

        {/* Day-by-day schedule */}
        <div className="space-y-3">
          {DAYS.map(day => {
            const daySchedule = schedule.find(s => s.dayOfWeek === day.id)!;
            return (
              <div
                key={day.id}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  daySchedule.isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                {/* Day toggle */}
                <div className="flex items-center gap-2 w-28">
                  <Switch
                    checked={daySchedule.isActive}
                    onCheckedChange={(checked) => handleDayToggle(day.id, checked)}
                  />
                  <Label className="font-medium">{day.short}</Label>
                </div>

                {/* Time selectors */}
                {daySchedule.isActive ? (
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      value={daySchedule.startTime}
                      onChange={(e) => handleTimeChange(day.id, "startTime", e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white text-sm"
                    >
                      {TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">to</span>
                    <select
                      value={daySchedule.endTime}
                      onChange={(e) => handleTimeChange(day.id, "endTime", e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white text-sm"
                    >
                      {TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Not available</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
