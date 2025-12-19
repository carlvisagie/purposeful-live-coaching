import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Sparkles, Target, Heart, Brain, Zap } from "lucide-react";

interface OnboardingQuizProps {
  onComplete: (answers: QuizAnswers) => void;
  onSkip?: () => void;
}

interface QuizAnswers {
  primaryGoal: string;
  currentChallenges: string[];
  coachingStyle: string;
  timeCommitment: string;
  experienceLevel: string;
}

const questions = [
  {
    id: "primaryGoal",
    title: "What's your primary wellness goal?",
    description: "This helps us personalize your experience",
    icon: Target,
    type: "single",
    options: [
      { value: "stress", label: "Reduce stress & anxiety", icon: "😌" },
      { value: "productivity", label: "Boost productivity & focus", icon: "🎯" },
      { value: "health", label: "Improve physical health", icon: "💪" },
      { value: "relationships", label: "Better relationships", icon: "❤️" },
      { value: "purpose", label: "Find purpose & meaning", icon: "✨" },
      { value: "balance", label: "Work-life balance", icon: "⚖️" },
    ],
  },
  {
    id: "currentChallenges",
    title: "What challenges are you facing?",
    description: "Select all that apply",
    icon: Heart,
    type: "multiple",
    options: [
      { value: "overwhelm", label: "Feeling overwhelmed" },
      { value: "sleep", label: "Sleep issues" },
      { value: "motivation", label: "Lack of motivation" },
      { value: "anxiety", label: "Anxiety or worry" },
      { value: "focus", label: "Difficulty focusing" },
      { value: "energy", label: "Low energy" },
      { value: "confidence", label: "Low confidence" },
      { value: "habits", label: "Breaking bad habits" },
    ],
  },
  {
    id: "coachingStyle",
    title: "What coaching style resonates with you?",
    description: "How do you prefer to receive guidance?",
    icon: Brain,
    type: "single",
    options: [
      { value: "gentle", label: "Gentle & supportive", description: "Encouraging, patient approach" },
      { value: "direct", label: "Direct & action-oriented", description: "Clear, no-nonsense guidance" },
      { value: "analytical", label: "Analytical & evidence-based", description: "Data-driven insights" },
      { value: "motivational", label: "Motivational & inspiring", description: "High-energy encouragement" },
    ],
  },
  {
    id: "timeCommitment",
    title: "How much time can you commit daily?",
    description: "Be realistic - consistency beats intensity",
    icon: Zap,
    type: "single",
    options: [
      { value: "5min", label: "5 minutes", description: "Quick daily check-in" },
      { value: "15min", label: "15 minutes", description: "Focused practice" },
      { value: "30min", label: "30 minutes", description: "Deep work session" },
      { value: "60min", label: "60+ minutes", description: "Comprehensive practice" },
    ],
  },
  {
    id: "experienceLevel",
    title: "What's your wellness journey experience?",
    description: "This helps us tailor content complexity",
    icon: Sparkles,
    type: "single",
    options: [
      { value: "beginner", label: "Just starting out", description: "New to wellness practices" },
      { value: "intermediate", label: "Some experience", description: "Tried various approaches" },
      { value: "advanced", label: "Experienced practitioner", description: "Looking to deepen practice" },
    ],
  },
];

export default function OnboardingQuiz({ onComplete, onSkip }: OnboardingQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    primaryGoal: "",
    currentChallenges: [],
    coachingStyle: "",
    timeCommitment: "",
    experienceLevel: "",
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const QuestionIcon = currentQuestion.icon;

  const handleSingleSelect = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleMultipleSelect = (value: string, checked: boolean) => {
    const current = answers.currentChallenges;
    if (checked) {
      setAnswers({ ...answers, currentChallenges: [...current, value] });
    } else {
      setAnswers({ ...answers, currentChallenges: current.filter((v) => v !== value) });
    }
  };

  const canProceed = () => {
    if (currentQuestion.type === "single") {
      return !!answers[currentQuestion.id as keyof QuizAnswers];
    }
    if (currentQuestion.type === "multiple") {
      return answers.currentChallenges.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-fit">
            <QuestionIcon className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
          <CardDescription>{currentQuestion.description}</CardDescription>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentStep + 1} of {questions.length}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentQuestion.type === "single" && (
            <RadioGroup
              value={answers[currentQuestion.id as keyof QuizAnswers] as string}
              onValueChange={handleSingleSelect}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex flex-col items-start gap-1 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2">
                      {"icon" in option && <span className="text-xl">{option.icon}</span>}
                      <span className="font-medium">{option.label}</span>
                    </div>
                    {"description" in option && (
                      <span className="text-sm text-muted-foreground">{option.description}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "multiple" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    answers.currentChallenges.includes(option.value)
                      ? "border-purple-500 bg-purple-50"
                      : "border-muted hover:bg-accent"
                  }`}
                  onClick={() =>
                    handleMultipleSelect(
                      option.value,
                      !answers.currentChallenges.includes(option.value)
                    )
                  }
                >
                  <Checkbox
                    checked={answers.currentChallenges.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleMultipleSelect(option.value, checked as boolean)
                    }
                  />
                  <Label className="cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {onSkip && currentStep === 0 && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip for now
                </Button>
              )}
              <Button onClick={handleNext} disabled={!canProceed()}>
                {currentStep === questions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
