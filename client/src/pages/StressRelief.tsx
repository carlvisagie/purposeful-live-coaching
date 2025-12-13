import { useState, useEffect } from "react";
import { Link } from "wouter";m "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Wind, Heart, Waves, Eye, Hand, Ear, Smile,
  ArrowLeft, Play, Pause, RotateCcw, CheckCircle2
} from "lucide-react";

export default function StressRelief() {
  // Box Breathing State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0); // 0: inhale, 1: hold, 2: exhale, 3: hold
  const [breathCount, setBreathCount] = useState(0);
  const breathPhases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
  const breathDuration = 4000; // 4 seconds per phase

  useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setBreathPhase((prev) => {
        const next = (prev + 1) % 4;
        if (next === 0) setBreathCount((c) => c + 1);
        return next;
      });
    }, breathDuration);

    return () => clearInterval(timer);
  }, [breathingActive]);

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathPhase(0);
    setBreathCount(0);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathPhase(0);
  };

  // 5-4-3-2-1 Grounding
  const [grounding, setGrounding] = useState({
    see: ["", "", "", "", ""],
    touch: ["", "", "", ""],
    hear: ["", "", ""],
    smell: ["", ""],
    taste: [""]
  });

  const groundingComplete = grounding.see.filter(Boolean).length === 5 &&
    grounding.touch.filter(Boolean).length === 4 &&
    grounding.hear.filter(Boolean).length === 3 &&
    grounding.smell.filter(Boolean).length === 2 &&
    grounding.taste.filter(Boolean).length === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stress Relief</h1>
                <p className="text-sm text-gray-600">Quick techniques to find calm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="breathing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="breathing">Box Breathing</TabsTrigger>
            <TabsTrigger value="grounding">5-4-3-2-1</TabsTrigger>
            <TabsTrigger value="quick">Quick Relief</TabsTrigger>
          </TabsList>

          {/* Box Breathing Tab */}
          <TabsContent value="breathing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-600" />
                  Box Breathing Exercise
                </CardTitle>
                <CardDescription>
                  A powerful technique used by Navy SEALs to reduce stress and improve focus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Breathing Animation */}
                <div className="relative h-80 flex items-center justify-center">
                  <div
                    className={`absolute w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 transition-all duration-[4000ms] ease-in-out ${
                      breathingActive
                        ? breathPhase === 0 || breathPhase === 1
                          ? "scale-150 opacity-70"
                          : "scale-100 opacity-40"
                        : "scale-100 opacity-40"
                    }`}
                  />
                  <div className="relative z-10 text-center">
                    <p className="text-3xl font-bold text-white mb-2">
                      {breathingActive ? breathPhases[breathPhase] : "Ready"}
                    </p>
                    {breathingActive && (
                      <p className="text-lg text-white">Round {breathCount + 1}</p>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3 justify-center">
                  {!breathingActive ? (
                    <Button size="lg" onClick={startBreathing} className="bg-blue-600 hover:bg-blue-700">
                      <Play className="h-5 w-5 mr-2" />
                      Start Exercise
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" onClick={stopBreathing} variant="outline">
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                      <Button size="lg" onClick={startBreathing} variant="outline">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Restart
                      </Button>
                    </>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
                  <ol className="space-y-2 text-gray-700">
                    <li>1. Breathe in for 4 seconds</li>
                    <li>2. Hold your breath for 4 seconds</li>
                    <li>3. Breathe out for 4 seconds</li>
                    <li>4. Hold for 4 seconds</li>
                    <li>5. Repeat for 5-10 rounds</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5-4-3-2-1 Grounding Tab */}
          <TabsContent value="grounding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hand className="h-5 w-5 text-teal-600" />
                  5-4-3-2-1 Grounding Technique
                </CardTitle>
                <CardDescription>
                  Anchor yourself in the present moment using your five senses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 5 Things You See */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">5 things you can SEE</h3>
                  </div>
                  <div className="space-y-2">
                    {grounding.see.map((item, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newSee = [...grounding.see];
                          newSee[idx] = e.target.value;
                          setGrounding({...grounding, see: newSee});
                        }}
                        placeholder={`Something you see...`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ))}
                  </div>
                </div>

                {/* 4 Things You Touch */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Hand className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">4 things you can TOUCH</h3>
                  </div>
                  <div className="space-y-2">
                    {grounding.touch.map((item, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newTouch = [...grounding.touch];
                          newTouch[idx] = e.target.value;
                          setGrounding({...grounding, touch: newTouch});
                        }}
                        placeholder={`Something you can touch...`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>

                {/* 3 Things You Hear */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Ear className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">3 things you can HEAR</h3>
                  </div>
                  <div className="space-y-2">
                    {grounding.hear.map((item, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newHear = [...grounding.hear];
                          newHear[idx] = e.target.value;
                          setGrounding({...grounding, hear: newHear});
                        }}
                        placeholder={`Something you hear...`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ))}
                  </div>
                </div>

                {/* 2 Things You Smell */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wind className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">2 things you can SMELL</h3>
                  </div>
                  <div className="space-y-2">
                    {grounding.smell.map((item, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newSmell = [...grounding.smell];
                          newSmell[idx] = e.target.value;
                          setGrounding({...grounding, smell: newSmell});
                        }}
                        placeholder={`Something you smell...`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ))}
                  </div>
                </div>

                {/* 1 Thing You Taste */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Smile className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">1 thing you can TASTE</h3>
                  </div>
                  <input
                    type="text"
                    value={grounding.taste[0]}
                    onChange={(e) => setGrounding({...grounding, taste: [e.target.value]})}
                    placeholder="Something you taste..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {groundingComplete && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-teal-600 mx-auto mb-3" />
                    <p className="font-semibold text-teal-900 text-lg">Exercise Complete!</p>
                    <p className="text-teal-700 mt-2">You're grounded in the present moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Relief Tab */}
          <TabsContent value="quick" className="space-y-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Progressive Muscle Relaxation</h3>
                    <p className="text-gray-600 mb-3">
                      Tense and release each muscle group from head to toe
                    </p>
                    <Badge variant="secondary">5 minutes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Waves className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Body Scan Meditation</h3>
                    <p className="text-gray-600 mb-3">
                      Bring awareness to each part of your body, releasing tension
                    </p>
                    <Badge variant="secondary">10 minutes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Wind className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">4-7-8 Breathing</h3>
                    <p className="text-gray-600 mb-3">
                      Inhale 4 counts, hold 7, exhale 8 - natural tranquilizer
                    </p>
                    <Badge variant="secondary">2 minutes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Smile className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gratitude Shift</h3>
                    <p className="text-gray-600 mb-3">
                      List 3 things you're grateful for right now
                    </p>
                    <Badge variant="secondary">1 minute</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-cyan-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Emergency Resources</h3>
              <p className="text-gray-700 mb-4">
                If you're experiencing a mental health crisis, please reach out:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>• National Crisis Hotline: 988</p>
                <p>• Crisis Text Line: Text HOME to 741741</p>
                <p>• Emergency: 911</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
