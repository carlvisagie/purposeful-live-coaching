/**
 * ONBOARDING CHOICE COMPONENT
 * Lets users choose their preferred onboarding method:
 * - Conversational AI (chat naturally, AI learns about them)
 * - Form-based (complete health intake questionnaire)
 * 
 * Tracks user preference for platform learning
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ClipboardList, Sparkles, Clock, Heart } from "lucide-react";

interface OnboardingChoiceProps {
  onChooseConversational: () => void;
  onChooseForm: () => void;
  userName?: string;
}

const PREFERENCE_STORAGE_KEY = "purposeful_onboarding_preference";

// Track user preference for platform learning
function trackPreference(choice: "conversational" | "form") {
  try {
    const existing = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    const data = existing ? JSON.parse(existing) : { choices: [] };
    data.choices.push({
      choice,
      timestamp: new Date().toISOString(),
    });
    data.lastChoice = choice;
    localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[Onboarding] Could not save preference");
  }
}

export function OnboardingChoice({ onChooseConversational, onChooseForm, userName }: OnboardingChoiceProps) {
  const [hoveredOption, setHoveredOption] = useState<"conversational" | "form" | null>(null);

  const handleConversational = () => {
    trackPreference("conversational");
    onChooseConversational();
  };

  const handleForm = () => {
    trackPreference("form");
    onChooseForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome{userName ? `, ${userName}` : ""}! 👋
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            To give you the best coaching experience, I'd love to learn about you. 
            How would you prefer to share?
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Option A: Conversational */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
              hoveredOption === "conversational" ? "border-emerald-500 shadow-lg" : "border-transparent"
            }`}
            onMouseEnter={() => setHoveredOption("conversational")}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={handleConversational}
          >
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mx-auto mb-3">
                <MessageCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Let's Chat</CardTitle>
              <CardDescription>
                Natural conversation with your AI coach
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>I'll learn about you naturally as we talk</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>Start immediately, no forms</span>
                </div>
              </div>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConversational();
                }}
              >
                Start Chatting
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Most popular choice • 70% of users prefer this
              </p>
            </CardContent>
          </Card>

          {/* Option B: Form */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
              hoveredOption === "form" ? "border-blue-500 shadow-lg" : "border-transparent"
            }`}
            onMouseEnter={() => setHoveredOption("form")}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={handleForm}
          >
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mx-auto mb-3">
                <ClipboardList className="w-7 h-7 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Complete Profile</CardTitle>
              <CardDescription>
                Quick health questionnaire
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <ClipboardList className="w-4 h-4 text-blue-500" />
                  <span>Structured questions about your health</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Takes about 5 minutes</span>
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleForm();
                }}
              >
                Start Questionnaire
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Comprehensive • Get personalized coaching faster
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reassurance */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Either way, your information is secure and helps us personalize your coaching experience.
            <br />
            You can always update your profile later.
          </p>
        </div>
      </div>
    </div>
  );
}

// Export helper to get user's preference history
export function getOnboardingPreferences() {
  try {
    const data = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
