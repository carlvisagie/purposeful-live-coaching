/**
 * SESSION HEALTH DISCLAIMER
 * Shows before AI/Live coaching sessions if health assessment not completed
 * Now offers CHOICE between conversational AI or form-based intake
 * Research shows 70% prefer conversational, but we let users choose
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ClipboardList,
  Shield,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { HealthIntakeQuestionnaire } from "./HealthIntakeQuestionnaire";
import { trackOnboardingChoice } from "@/lib/onboardingAnalytics";

interface SessionHealthDisclaimerProps {
  onProceed: () => void;
  sessionType: "ai_coach" | "live_session" | "voice_coach";
}

export function SessionHealthDisclaimer({ onProceed, sessionType }: SessionHealthDisclaimerProps) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [preferConversational, setPreferConversational] = useState(false);
  
  const { data: healthStatus, isLoading } = trpc.healthOptimization.getHealthStatus.useQuery();
  
  const hasCompletedAssessment = healthStatus?.hasCompletedIntake;
  const completionPercentage = healthStatus?.profileCompleteness || 0;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  if (showQuestionnaire) {
    return (
      <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <HealthIntakeQuestionnaire 
            onComplete={() => {
              setShowQuestionnaire(false);
              onProceed();
            }}
            onSkip={() => {
              setShowQuestionnaire(false);
              setAcknowledged(true);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }
  
  if (preferConversational) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <MessageCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle>Great Choice!</CardTitle>
          <CardDescription>I will learn about you naturally as we chat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Conversational Onboarding</span>
            </div>
            <p className="text-sm text-emerald-700 mt-1">
              No forms needed. I will ask questions naturally during our conversation.
            </p>
          </div>
          <div className="text-xs text-gray-500 text-center">
            <Shield className="h-4 w-4 inline mr-1" />
            This is wellness coaching, not medical advice.
          </div>
          <Button onClick={onProceed} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Start Chatting
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (hasCompletedAssessment && completionPercentage >= 50) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle>Health Profile Active</CardTitle>
          <CardDescription>Your health information will personalize this session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Profile {completionPercentage}% Complete</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            <Shield className="h-4 w-4 inline mr-1" />
            This is wellness coaching, not medical advice.
          </div>
          <Button onClick={onProceed} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Start {sessionType === "ai_coach" ? "AI Coaching" : sessionType === "voice_coach" ? "Voice Coaching" : "Live Session"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (acknowledged) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle>Limited Personalization</CardTitle>
          <CardDescription>Without your health profile, coaching will be less personalized</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              For the best experience, we recommend sharing your health information.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowQuestionnaire(true)} className="flex-1">
              <ClipboardList className="h-4 w-4 mr-2" />
              Complete Assessment
            </Button>
            <Button onClick={onProceed} className="flex-1">
              Continue Anyway
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
          <Heart className="h-6 w-6 text-emerald-600" />
        </div>
        <CardTitle>Let us Get to Know You</CardTitle>
        <CardDescription>How would you prefer to share about yourself?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div 
            className="border-2 border-transparent hover:border-emerald-500 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md bg-gradient-to-br from-emerald-50 to-white"
            onClick={() => { trackOnboardingChoice("conversational"); setPreferConversational(true); }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Let us Chat</h4>
                <p className="text-xs text-gray-500">Most popular</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">I will learn about you naturally as we talk. No forms.</p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={(e) => { e.stopPropagation(); trackOnboardingChoice("conversational"); setPreferConversational(true); }}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chatting
            </Button>
          </div>
          
          <div 
            className="border-2 border-transparent hover:border-blue-500 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md bg-gradient-to-br from-blue-50 to-white"
            onClick={() => { trackOnboardingChoice("form"); setShowQuestionnaire(true); }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Complete Profile</h4>
                <p className="text-xs text-gray-500">5 minutes</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Structured questionnaire for your complete health picture.</p>
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50" onClick={(e) => { e.stopPropagation(); trackOnboardingChoice("form"); setShowQuestionnaire(true); }}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Start Questionnaire
            </Button>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <Button variant="ghost" size="sm" onClick={() => setAcknowledged(true)} className="text-gray-500 hover:text-gray-700">
            Skip for now
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          <Shield className="h-3 w-3 inline mr-1" />
          This is wellness coaching, not medical advice. Your data is secure.
        </div>
      </CardContent>
    </Card>
  );
}

export function useHealthAssessmentRequired() {
  const { data: healthStatus, isLoading } = trpc.healthOptimization.getHealthStatus.useQuery();
  return {
    isLoading,
    isRequired: !healthStatus?.hasCompletedIntake,
    completionPercentage: healthStatus?.profileCompleteness || 0,
    hasCompletedIntake: healthStatus?.hasCompletedIntake || false,
  };
}

export default SessionHealthDisclaimer;
