/**
 * SESSION HEALTH DISCLAIMER
 * Shows before AI/Live coaching sessions if health assessment not completed
 * Encourages users to complete health intake for optimal coaching
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ClipboardList,
  Shield
} from "lucide-react";
import { HealthIntakeQuestionnaire } from "./HealthIntakeQuestionnaire";

interface SessionHealthDisclaimerProps {
  onProceed: () => void;
  sessionType: "ai_coach" | "live_session" | "voice_coach";
}

export function SessionHealthDisclaimer({ onProceed, sessionType }: SessionHealthDisclaimerProps) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  
  // Check if user has completed health assessment
  const { data: healthStatus, isLoading } = trpc.healthOptimization.getHealthStatus.useQuery();
  
  const hasCompletedAssessment = healthStatus?.hasCompletedIntake;
  const completionPercentage = healthStatus?.profileCompleteness || 0;
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  // If questionnaire is open, show it
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
  
  // If user has completed assessment, show quick confirmation
  if (hasCompletedAssessment && completionPercentage >= 50) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle>Health Profile Active</CardTitle>
          <CardDescription>
            Your health information will be used to personalize this session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Profile {completionPercentage}% Complete</span>
            </div>
            <p className="text-sm text-emerald-700 mt-1">
              Your coach will consider your health goals, conditions, and preferences.
            </p>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <Shield className="h-4 w-4 inline mr-1" />
            This is wellness coaching, not medical advice. Consult healthcare professionals for medical concerns.
          </div>
          
          <Button onClick={onProceed} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Start {sessionType === "ai_coach" ? "AI Coaching" : sessionType === "voice_coach" ? "Voice Coaching" : "Live Session"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // If user acknowledged but skipped, allow proceeding
  if (acknowledged) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle>Limited Personalization</CardTitle>
          <CardDescription>
            Without your health profile, coaching will be less personalized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              For the best coaching experience, we recommend completing your health assessment. 
              You can do this anytime from your profile.
            </p>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <Shield className="h-4 w-4 inline mr-1" />
            This is wellness coaching, not medical advice.
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowQuestionnaire(true)}
              className="flex-1"
            >
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
  
  // Default: Show the health assessment prompt
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
          <Heart className="h-6 w-6 text-emerald-600" />
        </div>
        <CardTitle>Complete Your Health Profile</CardTitle>
        <CardDescription>
          For optimal coaching, we need to understand your complete health picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Why This Matters</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Personalized coaching based on your health goals</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Recommendations tailored to your conditions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Better understanding of your stress and sleep patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Track progress toward your wellness goals</span>
            </li>
          </ul>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          Takes about 5 minutes • Your data is secure and private
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setAcknowledged(true)}
            className="flex-1"
          >
            Skip for Now
          </Button>
          <Button 
            onClick={() => setShowQuestionnaire(true)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Start Assessment
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          <Shield className="h-3 w-3 inline mr-1" />
          This is wellness coaching, not medical advice. In case of emergency, call 911.
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Hook to check if health assessment is required before session
 */
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
