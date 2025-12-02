import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Sparkles, Heart, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";

/**
 * IDENTITY STATEMENT VIEW
 * 
 * Display user's completed identity statement
 * Use as decision filter and daily reminder
 */

export default function IdentityView() {
  const [, navigate] = useLocation();
  const { data: identity, isLoading } = trpc.identity.getCurrentStatement.useQuery();

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <p>Loading your identity statement...</p>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container max-w-3xl mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>No Identity Statement Yet</CardTitle>
            <CardDescription>
              Build your identity foundation to unlock lasting transformation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/identity/builder")}>
              <Sparkles className="mr-2 h-4 w-4" />
              Build Your Identity Statement
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate("/master")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Master Systems
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Sparkles className="h-10 w-10 text-purple-500" />
              Your Identity Statement
            </h1>
            <p className="text-muted-foreground mt-2">
              Your decision filter and transformation foundation
            </p>
          </div>
          <Button onClick={() => navigate("/identity/builder")}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Identity Statement */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-2 border-purple-300 dark:border-purple-700">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">
            I am someone who...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-medium leading-relaxed text-purple-900 dark:text-purple-100">
            {identity.identityStatement}
          </p>
        </CardContent>
      </Card>

      {/* Core Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Core Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{identity.coreValues}</p>
        </CardContent>
      </Card>

      {/* Strengths & Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Strengths & Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{identity.strengthsAndSkills}</p>
        </CardContent>
      </Card>

      {/* Ideal Self */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Ideal Self (3 Years)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{identity.idealSelfDescription}</p>
        </CardContent>
      </Card>

      {/* Life Purpose */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Life Purpose
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{identity.lifePurpose}</p>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            How to Use Your Identity Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-900 dark:text-blue-100">
          <p><strong>1. Decision Filter:</strong> When facing a choice, ask: "Would someone who [your identity] do this?"</p>
          <p><strong>2. Morning Reminder:</strong> Read your identity statement every morning to prime your day</p>
          <p><strong>3. Habit Formation:</strong> Frame new habits as identity: "I'm the kind of person who..."</p>
          <p><strong>4. Accountability:</strong> When you slip, reconnect with your identity, not your failure</p>
        </CardContent>
      </Card>
    </div>
  );
}
