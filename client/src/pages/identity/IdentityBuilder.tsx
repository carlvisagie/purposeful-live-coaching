import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

/**
 * IDENTITY STATEMENT BUILDER
 * 
 * Core principle: "Who you are determines what you do" - James Clear
 * 
 * 5 guided questions to build identity statement:
 * 1. Core Values - What matters most?
 * 2. Strengths & Skills - What are you naturally good at?
 * 3. Ideal Self - Who do you want to become?
 * 4. Life Purpose - Why are you here?
 * 5. Identity Statement - "I am someone who..."
 */

const QUESTIONS = [
  {
    id: "coreValues",
    title: "What are your core values?",
    description: "What principles guide your life? What matters most to you?",
    placeholder: "Example: Integrity, growth, family, service, excellence, authenticity...",
    hint: "List 3-5 values that define who you are at your core.",
  },
  {
    id: "strengthsAndSkills",
    title: "What are your natural strengths and skills?",
    description: "What do you do better than most people? What comes naturally to you?",
    placeholder: "Example: Problem-solving, empathy, leadership, creativity, discipline...",
    hint: "Think about what others compliment you on and what energizes you.",
  },
  {
    id: "idealSelfDescription",
    title: "Describe your ideal self in 3 years",
    description: "Who do you want to become? What does the best version of you look like?",
    placeholder: "Example: I am confident, healthy, financially secure, deeply connected to my family...",
    hint: "Be specific. Use present tense as if it's already true.",
  },
  {
    id: "lifePurpose",
    title: "What is your life purpose?",
    description: "Why are you here? What impact do you want to make?",
    placeholder: "Example: To help others overcome adversity, to build something meaningful, to raise conscious children...",
    hint: "This doesn't have to be grand. It just has to be true for you.",
  },
  {
    id: "identityStatement",
    title: "Create your identity statement",
    description: "Based on your answers, complete this: \"I am someone who...\"",
    placeholder: "Example: I am someone who shows up every day, honors my commitments, and leads by example.",
    hint: "This becomes your decision filter. When in doubt, ask: 'Would someone who [identity] do this?'",
  },
];

export default function IdentityBuilder() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    coreValues: "",
    strengthsAndSkills: "",
    idealSelfDescription: "",
    lifePurpose: "",
    identityStatement: "",
  });

  const { data: existing } = trpc.identity.getCurrentStatement.useQuery();
  const utils = trpc.useUtils();

  const upsertMutation = trpc.identity.upsertStatement.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.identity.getCurrentStatement.invalidate();
      navigate("/identity/view");
    },
    onError: (error) => {
      toast.error("Failed to save: " + error.message);
    },
  });

  // Load existing data if available
  useState(() => {
    if (existing) {
      setAnswers({
        coreValues: existing.coreValues || "",
        strengthsAndSkills: existing.strengthsAndSkills || "",
        idealSelfDescription: existing.idealSelfDescription || "",
        lifePurpose: existing.lifePurpose || "",
        identityStatement: existing.identityStatement || "",
      });
    }
  });

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    if (!answers[currentQuestion.id]?.trim()) {
      toast.error("Please answer this question before continuing");
      return;
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - save
      upsertMutation.mutate(answers as any);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate("/master")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Master Systems
        </Button>
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Sparkles className="h-10 w-10 text-purple-500" />
          Identity Statement Builder
        </h1>
        <p className="text-muted-foreground mt-2">
          Who you are determines what you do. Build your identity foundation.
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
          <CardDescription className="text-base">{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Textarea
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="min-h-[150px] text-base"
              autoFocus
            />
            <p className="text-sm text-muted-foreground italic">
              💡 {currentQuestion.hint}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={upsertMutation.isPending}
            >
              {currentStep === QUESTIONS.length - 1 ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {upsertMutation.isPending ? "Saving..." : "Complete"}
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Principle Card */}
      <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
            <strong>Why this matters:</strong> Your identity is the foundation of lasting change. 
            When you shift from "I want to do X" to "I am someone who does X," behavior change becomes inevitable. 
            This is the difference between motivation (temporary) and identity (permanent).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
