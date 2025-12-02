import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Circle, Plus, Trash2, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * HABIT TRACKER PAGE
 * 
 * Identity-based habit tracking system
 * Based on James Clear's "Atomic Habits" and BJ Fogg's "Tiny Habits"
 * 
 * Core Principles:
 * - Identity-first: "I am a person who..." not "I want to..."
 * - Tiny habits: Start ridiculously small
 * - Celebration: Immediate positive reinforcement
 * - Stacking: Anchor new habits to existing ones
 */
export default function HabitTracker() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitIdentity, setNewHabitIdentity] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState("daily");

  const { data: habits, refetch } = trpc.identity.getHabits.useQuery();
  const { data: completions } = trpc.identity.getTodayCompletions.useQuery();

  const createHabit = trpc.identity.createHabit.useMutation({
    onSuccess: () => {
      refetch();
      setIsAddDialogOpen(false);
      setNewHabitName("");
      setNewHabitIdentity("");
    },
  });

  const toggleCompletion = trpc.identity.toggleHabitCompletion.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteHabit = trpc.identity.deleteHabit.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const isCompleted = (habitId: number) => {
    return completions?.some((c) => c.habitId === habitId) || false;
  };

  const handleToggle = (habitId: number) => {
    toggleCompletion.mutate({ habitId });
  };

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    createHabit.mutate({
      name: newHabitName,
      identityStatement: newHabitIdentity,
      frequency: newHabitFrequency as "daily" | "weekly",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Habit Tracker</h1>
            <p className="text-gray-400">Build your identity one tiny habit at a time</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-5 h-5 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-white mb-2 block">Habit Name</Label>
                  <Input
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g., Morning meditation"
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">
                    Identity Statement (Optional)
                  </Label>
                  <Input
                    value={newHabitIdentity}
                    onChange={(e) => setNewHabitIdentity(e.target.value)}
                    placeholder="I am a person who..."
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Example: "I am a person who prioritizes mental clarity"
                  </p>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Frequency</Label>
                  <select
                    value={newHabitFrequency}
                    onChange={(e) => setNewHabitFrequency(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <Button
                  onClick={handleAddHabit}
                  disabled={createHabit.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {createHabit.isPending ? "Creating..." : "Create Habit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Habits List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {!habits || habits.length === 0 ? (
            <Card className="p-12 bg-gray-800/50 border-gray-700 text-center">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No habits yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start building your identity with tiny, consistent habits
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Habit
              </Button>
            </Card>
          ) : (
            habits.map((habit) => {
              const completed = isCompleted(habit.id);
              const streak = habit.currentStreak || 0;

              return (
                <Card
                  key={habit.id}
                  className="p-6 bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Completion Toggle */}
                    <button
                      onClick={() => handleToggle(habit.id)}
                      className="flex-shrink-0"
                    >
                      {completed ? (
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-600 hover:text-gray-500" />
                      )}
                    </button>

                    {/* Habit Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {habit.name}
                      </h3>
                      {habit.identityStatement && (
                        <p className="text-sm text-gray-400 italic">
                          "{habit.identityStatement}"
                        </p>
                      )}
                    </div>

                    {/* Streak */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {streak}
                      </div>
                      <div className="text-xs text-gray-400">day streak</div>
                    </div>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit.mutate({ habitId: habit.id })}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Habit Building Tips */}
        <Card className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            🎯 Habit Building Principles
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">Start Tiny</h4>
              <p className="text-gray-300">
                Make it so small you can't say no. 1 push-up, 1 minute of meditation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Identity First</h4>
              <p className="text-gray-300">
                Focus on who you want to become, not what you want to achieve.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Celebrate Wins</h4>
              <p className="text-gray-300">
                Every completion matters. Celebrate immediately to wire the habit.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
