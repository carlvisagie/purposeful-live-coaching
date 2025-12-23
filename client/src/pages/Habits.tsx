import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, Plus, Flame, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Habits() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    habitName: "",
    description: "",
    frequency: "daily" as const,
    category: "health" as const,
    cue: "",
    routine: "",
    reward: "",
    difficulty: 5,
  });

  // Fetch user's habits
  const { data: habits, isLoading, refetch } = trpc.habitFormation.listHabits.useQuery();
  const { data: profile } = trpc.habitFormation.getProfile.useQuery();

  // Create habit mutation
  const createHabitMutation = trpc.habitFormation.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Habit Created!",
        description: "Your new habit has been added successfully.",
      });
      setShowCreateForm(false);
      setNewHabit({
        habitName: "",
        description: "",
        frequency: "daily",
        category: "health",
        cue: "",
        routine: "",
        reward: "",
        difficulty: 5,
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateHabit = () => {
    if (!newHabit.habitName.trim()) {
      toast({
        title: "Habit Name Required",
        description: "Please enter a name for your habit.",
        variant: "destructive",
      });
      return;
    }

    createHabitMutation.mutate(newHabit);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "paused":
        return "text-yellow-600";
      case "abandoned":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Flame className="w-10 h-10 text-orange-500" />
            Habits
          </h1>
          <p className="text-muted-foreground mt-2">
            Build keystone habits, track streaks, and transform your life
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          New Habit
        </Button>
      </div>

      {/* Profile Stats */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.totalHabitsCreated}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{profile.activeHabits}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500 flex items-center gap-2">
                <Flame className="w-8 h-8" />
                {profile.longestStreak}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {profile.completionRate ? Math.round(profile.completionRate) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Habit Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Habit</CardTitle>
            <CardDescription>Design your habit using the Cue-Routine-Reward framework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="habitName">Habit Name *</Label>
              <Input
                id="habitName"
                placeholder="e.g., Morning meditation"
                value={newHabit.habitName}
                onChange={(e) => setNewHabit({ ...newHabit, habitName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your habit in detail..."
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newHabit.category}
                  onValueChange={(value: any) => setNewHabit({ ...newHabit, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="relationships">Relationships</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newHabit.frequency}
                  onValueChange={(value: any) => setNewHabit({ ...newHabit, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm">Cue-Routine-Reward Framework</h3>
              
              <div>
                <Label htmlFor="cue">Cue (Trigger)</Label>
                <Input
                  id="cue"
                  placeholder="e.g., After I wake up and brush my teeth"
                  value={newHabit.cue}
                  onChange={(e) => setNewHabit({ ...newHabit, cue: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="routine">Routine (Behavior)</Label>
                <Input
                  id="routine"
                  placeholder="e.g., I will meditate for 10 minutes"
                  value={newHabit.routine}
                  onChange={(e) => setNewHabit({ ...newHabit, routine: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="reward">Reward</Label>
                <Input
                  id="reward"
                  placeholder="e.g., I'll feel calm and centered for the day"
                  value={newHabit.reward}
                  onChange={(e) => setNewHabit({ ...newHabit, reward: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty: {newHabit.difficulty}/10</Label>
              <input
                id="difficulty"
                type="range"
                min="1"
                max="10"
                value={newHabit.difficulty}
                onChange={(e) => setNewHabit({ ...newHabit, difficulty: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateHabit} disabled={createHabitMutation.isPending}>
                {createHabitMutation.isPending ? "Creating..." : "Create Habit"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habits List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {isLoading ? (
            <p>Loading habits...</p>
          ) : !habits || habits.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Flame className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>No habits yet. Create your first habit to get started!</p>
              </CardContent>
            </Card>
          ) : (
            habits
              .filter((habit: any) => habit.status === "active")
              .map((habit: any) => (
                <Card key={habit.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          {habit.habitName}
                        </CardTitle>
                        <CardDescription className="mt-1">{habit.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <Flame className="w-5 h-5 text-orange-500" />
                          <span className="text-2xl font-bold">{habit.currentStreak || 0}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">day streak</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {habit.cue && (
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Cue:</span> {habit.cue}
                        </div>
                        {habit.routine && (
                          <div>
                            <span className="font-medium">Routine:</span> {habit.routine}
                          </div>
                        )}
                        {habit.reward && (
                          <div>
                            <span className="font-medium">Reward:</span> {habit.reward}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span className="capitalize">{habit.frequency}</span>
                      <span>•</span>
                      <span className="capitalize">{habit.category}</span>
                      {habit.longestStreak && habit.longestStreak > 0 && (
                        <>
                          <span>•</span>
                          <span>Best: {habit.longestStreak} days</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4 mt-6">
          {habits
            ?.filter((habit: any) => habit.status === "paused")
            .map((habit: any) => (
              <Card key={habit.id} className="opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Circle className="w-5 h-5 text-yellow-600" />
                    {habit.habitName}
                  </CardTitle>
                  <CardDescription>{habit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {habits?.map((habit: any) => (
            <Card key={habit.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {habit.status === "active" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                      {habit.habitName}
                    </CardTitle>
                    <CardDescription>{habit.description}</CardDescription>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(habit.status)}`}>
                    {habit.status?.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
