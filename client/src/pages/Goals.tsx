import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Plus, TrendingUp, Calendar, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Goals() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goalName: "",
    description: "",
    goalType: "outcome" as const,
    framework: "smart" as const,
    category: "personal" as const,
    difficulty: 5,
    targetDate: "",
    priority: "medium" as const,
  });

  // Fetch user's goals
  const { data: goals, isLoading, refetch } = trpc.goals.listGoals.useQuery();
  const { data: profile } = trpc.goals.getProfile.useQuery();

  // Create goal mutation
  const createGoalMutation = trpc.goals.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Goal Created!",
        description: "Your new goal has been added successfully.",
      });
      setShowCreateForm(false);
      setNewGoal({
        goalName: "",
        description: "",
        goalType: "outcome",
        framework: "smart",
        category: "personal",
        difficulty: 5,
        targetDate: "",
        priority: "medium",
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

  const handleCreateGoal = () => {
    if (!newGoal.goalName.trim()) {
      toast({
        title: "Goal Name Required",
        description: "Please enter a name for your goal.",
        variant: "destructive",
      });
      return;
    }

    createGoalMutation.mutate(newGoal);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "on-hold":
        return "text-yellow-600";
      case "abandoned":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const calculateProgress = (currentValue: number | null, targetValue: number | null) => {
    if (!currentValue || !targetValue) return 0;
    return Math.min(100, Math.round((currentValue / targetValue) * 100));
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Target className="w-10 h-10 text-primary" />
            Goals
          </h1>
          <p className="text-muted-foreground mt-2">
            Set SMART goals, track progress, and achieve your dreams
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Profile Stats */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.totalGoalsSet}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Achieved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{profile.totalGoalsAchieved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {profile.totalGoalsSet > 0
                  ? Math.round((profile.totalGoalsAchieved / profile.totalGoalsSet) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Goal Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
            <CardDescription>Define your goal using the SMART framework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goalName">Goal Name *</Label>
              <Input
                id="goalName"
                placeholder="e.g., Run a marathon"
                value={newGoal.goalName}
                onChange={(e) => setNewGoal({ ...newGoal, goalName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your goal in detail..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value: any) => setNewGoal({ ...newGoal, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="relationships">Relationships</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="spiritual">Spiritual</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newGoal.priority}
                  onValueChange={(value: any) => setNewGoal({ ...newGoal, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="framework">Framework</Label>
                <Select
                  value={newGoal.framework}
                  onValueChange={(value: any) => setNewGoal({ ...newGoal, framework: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smart">SMART</SelectItem>
                    <SelectItem value="okr">OKR</SelectItem>
                    <SelectItem value="woop">WOOP</SelectItem>
                    <SelectItem value="habit-based">Habit-Based</SelectItem>
                    <SelectItem value="identity-based">Identity-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty: {newGoal.difficulty}/10</Label>
              <input
                id="difficulty"
                type="range"
                min="1"
                max="10"
                value={newGoal.difficulty}
                onChange={(e) => setNewGoal({ ...newGoal, difficulty: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateGoal} disabled={createGoalMutation.isPending}>
                {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {isLoading ? (
            <p>Loading goals...</p>
          ) : !goals || goals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>No goals yet. Create your first goal to get started!</p>
              </CardContent>
            </Card>
          ) : (
            goals
              .filter((goal: any) => goal.status === "in-progress" || goal.status === "not-started")
              .map((goal: any) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {goal.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-blue-600" />
                          )}
                          {goal.goalName}
                        </CardTitle>
                        <CardDescription className="mt-1">{goal.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status?.replace("-", " ").toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">{goal.category}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {goal.currentValue !== null && goal.targetValue !== null && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                        </div>
                        <Progress value={calculateProgress(goal.currentValue, goal.targetValue)} />
                      </div>
                    )}
                    {goal.targetDate && (
                      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {goals
            ?.filter((goal: any) => goal.status === "completed")
            .map((goal: any) => (
              <Card key={goal.id} className="opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {goal.goalName}
                  </CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {goals?.map((goal: any) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {goal.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-blue-600" />
                  )}
                  {goal.goalName}
                </CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
