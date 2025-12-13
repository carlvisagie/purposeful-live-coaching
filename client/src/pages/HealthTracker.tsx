import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Heart, Activity, Apple, Droplet, Moon, TrendingUp,
  Plus, Check, ArrowLeft, Dumbbell, Clock, Flame
} from "lucide-react";

export default function HealthTracker() {
  // Movement tracking
  const [exercises, setExercises] = useState<Array<{type: string, duration: number, calories: number}>>([]);
  const [newExercise, setNewExercise] = useState({ type: "", duration: 0, calories: 0 });
  
  // Nutrition tracking
  const [meals, setMeals] = useState<Array<{name: string, calories: number, protein: number}>>([]);
  const [newMeal, setNewMeal] = useState({ name: "", calories: 0, protein: 0 });
  
  // Hydration tracking
  const [waterIntake, setWaterIntake] = useState(0); // in oz
  const waterGoal = 64; // oz per day
  
  // Sleep tracking
  const [sleepHours, setSleepHours] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0); // 1-10
  const sleepGoal = 8;

  const addExercise = () => {
    if (newExercise.type && newExercise.duration > 0) {
      setExercises([...exercises, newExercise]);
      setNewExercise({ type: "", duration: 0, calories: 0 });
    }
  };

  const addMeal = () => {
    if (newMeal.name && newMeal.calories > 0) {
      setMeals([...meals, newMeal]);
      setNewMeal({ name: "", calories: 0, protein: 0 });
    }
  };

  const addWater = (amount: number) => {
    setWaterIntake(Math.min(waterIntake + amount, 200)); // max 200oz
  };

  const totalCaloriesBurned = exercises.reduce((sum, ex) => sum + ex.calories, 0);
  const totalCaloriesConsumed = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const waterProgress = (waterIntake / waterGoal) * 100;
  const sleepProgress = (sleepHours / sleepGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Health Tracker</h1>
                  <p className="text-sm text-gray-600">Track movement, nutrition, sleep & hydration</p>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Today
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Calories Burned</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCaloriesBurned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Apple className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Calories In</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCaloriesConsumed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Droplet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Water</p>
                  <p className="text-2xl font-bold text-gray-900">{waterIntake}oz</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Moon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sleep</p>
                  <p className="text-2xl font-bold text-gray-900">{sleepHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="movement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="movement">Movement</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="hydration">Hydration</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>

          {/* Movement Tab */}
          <TabsContent value="movement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-orange-600" />
                  Log Exercise
                </CardTitle>
                <CardDescription>Track your physical activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Exercise type"
                    value={newExercise.type}
                    onChange={(e) => setNewExercise({...newExercise, type: e.target.value})}
                    className="md:col-span-2"
                  />
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={newExercise.duration || ""}
                    onChange={(e) => setNewExercise({...newExercise, duration: parseInt(e.target.value) || 0})}
                  />
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={newExercise.calories || ""}
                    onChange={(e) => setNewExercise({...newExercise, calories: parseInt(e.target.value) || 0})}
                  />
                </div>
                <Button onClick={addExercise} className="mt-3 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {exercises.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No exercises logged yet</p>
                ) : (
                  <div className="space-y-3">
                    {exercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{ex.type}</p>
                            <p className="text-sm text-gray-600">{ex.duration} minutes</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{ex.calories} cal</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  Log Meal
                </CardTitle>
                <CardDescription>Track what you eat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Meal name"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                    className="md:col-span-2"
                  />
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={newMeal.calories || ""}
                    onChange={(e) => setNewMeal({...newMeal, calories: parseInt(e.target.value) || 0})}
                  />
                  <Input
                    type="number"
                    placeholder="Protein (g)"
                    value={newMeal.protein || ""}
                    onChange={(e) => setNewMeal({...newMeal, protein: parseInt(e.target.value) || 0})}
                  />
                </div>
                <Button onClick={addMeal} className="mt-3 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Nutrition</CardTitle>
                <CardDescription>
                  Total: {totalCaloriesConsumed} calories • {totalProtein}g protein
                </CardDescription>
              </CardHeader>
              <CardContent>
                {meals.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No meals logged yet</p>
                ) : (
                  <div className="space-y-3">
                    {meals.map((meal, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Apple className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{meal.name}</p>
                            <p className="text-sm text-gray-600">{meal.protein}g protein</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{meal.calories} cal</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hydration Tab */}
          <TabsContent value="hydration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-600" />
                  Water Intake
                </CardTitle>
                <CardDescription>
                  Goal: {waterGoal}oz per day
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{waterIntake}oz</span>
                    <span>{waterGoal}oz</span>
                  </div>
                  <Progress value={waterProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button onClick={() => addWater(8)} variant="outline" className="h-20">
                    <div className="text-center">
                      <Droplet className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm">8oz</p>
                    </div>
                  </Button>
                  <Button onClick={() => addWater(16)} variant="outline" className="h-20">
                    <div className="text-center">
                      <Droplet className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm">16oz</p>
                    </div>
                  </Button>
                  <Button onClick={() => addWater(32)} variant="outline" className="h-20">
                    <div className="text-center">
                      <Droplet className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm">32oz</p>
                    </div>
                  </Button>
                </div>

                {waterProgress >= 100 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <Check className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-blue-900">Daily goal achieved!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sleep Tab */}
          <TabsContent value="sleep" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-purple-600" />
                  Sleep Tracking
                </CardTitle>
                <CardDescription>
                  Goal: {sleepGoal} hours per night
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Hours Slept</label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="7.5"
                    value={sleepHours || ""}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sleep Quality (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="8"
                    value={sleepQuality || ""}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{sleepHours}h</span>
                    <span>{sleepGoal}h</span>
                  </div>
                  <Progress value={sleepProgress} className="h-3" />
                </div>

                {sleepProgress >= 100 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <Check className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold text-purple-900">Great sleep!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
