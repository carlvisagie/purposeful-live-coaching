import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sun, Coffee, Dumbbell, BookOpen, Target, Heart, Brain,
  CheckCircle2, ArrowLeft, Sparkles, TrendingUp
} from "lucide-react";

const defaultRoutine = [
  { id: "wake", icon: Sun, title: "Wake Up", description: "Rise with intention", duration: "1 min", completed: false },
  { id: "hydrate", icon: Coffee, title: "Hydrate", description: "Drink 16oz water", duration: "2 min", completed: false },
  { id: "movement", icon: Dumbbell, title: "Movement", description: "5-10 min stretching or exercise", duration: "10 min", completed: false },
  { id: "mindfulness", icon: Brain, title: "Mindfulness", description: "Meditation or breathwork", duration: "5 min", completed: false },
  { id: "gratitude", icon: Heart, title: "Gratitude", description: "Write 3 things you're grateful for", duration: "3 min", completed: false },
  { id: "intentions", icon: Target, title: "Set Intentions", description: "Define your top 3 priorities", duration: "5 min", completed: false },
  { id: "reading", icon: BookOpen, title: "Learning", description: "Read or listen to something inspiring", duration: "10 min", completed: false },
];

export default function MorningRoutine() {
  const [routine, setRoutine] = useState(defaultRoutine);
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [intentions, setIntentions] = useState(["", "", ""]);
  const [reflection, setReflection] = useState("");

  const completedCount = routine.filter(item => item.completed).length;
  const progress = (completedCount / routine.length) * 100;

  const toggleComplete = (id: string) => {
    setRoutine(routine.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleComplete = () => {
    // TODO: Save to backend via tRPC
    console.log("Morning routine completed", { gratitude, intentions, reflection });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                  <Sun className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Morning Routine</h1>
                  <p className="text-sm text-gray-600">Start your day with purpose</p>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {completedCount}/{routine.length} Complete
            </Badge>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Routine Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              Your Morning Flow
            </CardTitle>
            <CardDescription>
              Complete each step to build momentum for your day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {routine.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    item.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleComplete(item.id)}
                    className="h-6 w-6"
                  />
                  
                  <div className={`p-2 rounded-lg ${item.completed ? "bg-green-100" : "bg-gray-100"}`}>
                    <Icon className={`h-5 w-5 ${item.completed ? "text-green-600" : "text-gray-600"}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${item.completed ? "text-green-900" : "text-gray-900"}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  
                  <Badge variant="outline">{item.duration}</Badge>
                  
                  {item.completed && (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Gratitude Practice */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600" />
              Gratitude Practice
            </CardTitle>
            <CardDescription>
              Write three things you're grateful for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {gratitude.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-400">{idx + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newGratitude = [...gratitude];
                    newGratitude[idx] = e.target.value;
                    setGratitude(newGratitude);
                  }}
                  placeholder="I'm grateful for..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Intentions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Today's Top 3 Priorities
            </CardTitle>
            <CardDescription>
              What are the most important things to accomplish today?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {intentions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-400">{idx + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newIntentions = [...intentions];
                    newIntentions[idx] = e.target.value;
                    setIntentions(newIntentions);
                  }}
                  placeholder="Today I will..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Morning Reflection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Morning Reflection
            </CardTitle>
            <CardDescription>
              How are you feeling? What's your energy level? Any insights?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="I'm feeling... My energy is... I notice..."
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Complete Button */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            onClick={handleComplete}
            disabled={progress < 100}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Complete Morning Routine
          </Button>
          
          <Link to="/dashboard">
            <Button size="lg" variant="outline">
              Save & Exit
            </Button>
          </Link>
        </div>

        {progress < 100 && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Complete all steps to finish your morning routine
          </p>
        )}
      </div>
    </div>
  );
}
