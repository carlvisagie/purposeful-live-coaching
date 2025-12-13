import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sunrise, Moon, CheckCircle, Star, Target, Heart, Sparkles } from "lucide-react";

export default function DailyCheckIn() {
  const [checkInType, setCheckInType] = useState<"morning" | "evening">("morning");
  const [gratitude, setGratitude] = useState("");
  const [intention, setIntention] = useState("");
  const [reflection, setReflection] = useState("");
  const [wins, setWins] = useState("");
  const [lessons, setLessons] = useState("");

  const createCheckInMutation = trpc.dailyCheckIns.create.useMutation({
    onSuccess: () => {
      toast.success(checkInType === "morning" ? "Morning check-in saved!" : "Evening reflection saved!");
      // Reset form
      setGratitude("");
      setIntention("");
      setReflection("");
      setWins("");
      setLessons("");
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    createCheckInMutation.mutate({
      type: checkInType,
      gratitude,
      intention: checkInType === "morning" ? intention : undefined,
      reflection: checkInType === "evening" ? reflection : undefined,
      wins: checkInType === "evening" ? wins : undefined,
      lessons: checkInType === "evening" ? lessons : undefined,
    });
  };

  const isMorning = checkInType === "morning";
  const Icon = isMorning ? Sunrise : Moon;
  const title = isMorning ? "Morning Check-In" : "Evening Reflection";
  const subtitle = isMorning 
    ? "Set your intention and start your day with purpose"
    : "Reflect on your day and celebrate your progress";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <Icon className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl">{subtitle}</p>
        </div>
      </div>

      {/* Type Toggle */}
      <div className="container py-8">
        <div className="flex gap-4 justify-center">
          <Button
            variant={isMorning ? "default" : "outline"}
            size="lg"
            onClick={() => setCheckInType("morning")}
            className="gap-2"
          >
            <Sunrise className="h-5 w-5" />
            Morning Check-In
          </Button>
          <Button
            variant={!isMorning ? "default" : "outline"}
            size="lg"
            onClick={() => setCheckInType("evening")}
            className="gap-2"
          >
            <Moon className="h-5 w-5" />
            Evening Reflection
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="container pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Gratitude (Both) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-100 rounded-xl">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle>Gratitude</CardTitle>
                  <CardDescription>What are you grateful for today?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="I'm grateful for..."
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Morning: Intention */}
          {isMorning && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Today's Intention</CardTitle>
                    <CardDescription>What do you want to focus on today?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Today I will focus on..."
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          )}

          {/* Evening: Reflection */}
          {!isMorning && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Sparkles className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Daily Reflection</CardTitle>
                      <CardDescription>How did your day go?</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Today was..."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Today's Wins</CardTitle>
                      <CardDescription>What did you accomplish?</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="I accomplished..."
                    value={wins}
                    onChange={(e) => setWins(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Star className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle>Lessons Learned</CardTitle>
                      <CardDescription>What did you learn today?</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="I learned..."
                    value={lessons}
                    onChange={(e) => setLessons(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={createCheckInMutation.isPending || !gratitude}
              className="gap-2 px-12"
            >
              {createCheckInMutation.isPending ? (
                "Saving..."
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Save {isMorning ? "Check-In" : "Reflection"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
