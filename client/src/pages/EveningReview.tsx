import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Moon, Star, TrendingUp, Heart, Brain, Target, BookOpen,
  CheckCircle2, ArrowLeft, Sparkles, Award
} from "lucide-react";

export default function EveningReview() {
  const [wins, setWins] = useState(["", "", ""]);
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [tomorrow, setTomorrow] = useState(["", "", ""]);
  
  // Rating scales (0-10)
  const [productivity, setProductivity] = useState([7]);
  const [energy, setEnergy] = useState([7]);
  const [mood, setMood] = useState([7]);
  const [stress, setStress] = useState([3]);
  const [sleep, setSleep] = useState([7]);

  const isComplete = wins.some(w => w) && gratitude.some(g => g) && tomorrow.some(t => t);
  const progress = isComplete ? 100 : 60;

  const handleComplete = () => {
    // TODO: Save to backend via tRPC
    console.log("Evening review completed", {
      wins, challenges, lessons, gratitude, tomorrow,
      ratings: { productivity, energy, mood, stress, sleep }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
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
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                  <Moon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Evening Review</h1>
                  <p className="text-sm text-gray-600">Reflect and prepare for tomorrow</p>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {isComplete ? "Complete" : "In Progress"}
            </Badge>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Today's Wins */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              Today's Wins
            </CardTitle>
            <CardDescription>
              Celebrate three things that went well today (big or small)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {wins.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-500" />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newWins = [...wins];
                    newWins[idx] = e.target.value;
                    setWins(newWins);
                  }}
                  placeholder="Something that went well..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Challenges & Lessons */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                Challenges
              </CardTitle>
              <CardDescription>
                What was difficult today?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Today was challenging because..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Lessons Learned
              </CardTitle>
              <CardDescription>
                What did you learn or realize?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="I learned that..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Daily Ratings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Daily Metrics
            </CardTitle>
            <CardDescription>
              Rate your day on these dimensions (0-10)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Productivity</label>
                <span className="text-sm font-semibold text-blue-600">{productivity[0]}/10</span>
              </div>
              <Slider
                value={productivity}
                onValueChange={setProductivity}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Energy Level</label>
                <span className="text-sm font-semibold text-green-600">{energy[0]}/10</span>
              </div>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Mood</label>
                <span className="text-sm font-semibold text-purple-600">{mood[0]}/10</span>
              </div>
              <Slider
                value={mood}
                onValueChange={setMood}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Stress Level</label>
                <span className="text-sm font-semibold text-red-600">{stress[0]}/10</span>
              </div>
              <Slider
                value={stress}
                onValueChange={setStress}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Sleep Quality (last night)</label>
                <span className="text-sm font-semibold text-indigo-600">{sleep[0]}/10</span>
              </div>
              <Slider
                value={sleep}
                onValueChange={setSleep}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Evening Gratitude */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600" />
              Evening Gratitude
            </CardTitle>
            <CardDescription>
              End your day with appreciation
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tomorrow's Preparation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              Tomorrow's Top 3 Priorities
            </CardTitle>
            <CardDescription>
              Set yourself up for success tomorrow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tomorrow.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-400">{idx + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newTomorrow = [...tomorrow];
                    newTomorrow[idx] = e.target.value;
                    setTomorrow(newTomorrow);
                  }}
                  placeholder="Tomorrow I will..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Complete Button */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            onClick={handleComplete}
            disabled={!isComplete}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Complete Evening Review
          </Button>
          
          <Link to="/dashboard">
            <Button size="lg" variant="outline">
              Save & Exit
            </Button>
          </Link>
        </div>

        {!isComplete && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Fill in wins, gratitude, and tomorrow's priorities to complete
          </p>
        )}
      </div>
    </div>
  );
}
