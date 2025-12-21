/**
 * Structured Programs Page
 * 
 * Displays available multi-week programs:
 * - 6-Week Anxiety Reset
 * - 21 Days of Mindfulness
 * - 7-Day Stress Detox
 * 
 * Research: Users who complete structured programs have 3x higher retention
 */

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, Calendar, Star, Users, ChevronRight, Play, 
  CheckCircle2, Lock, Award, Sparkles, Brain, Heart,
  Moon, Zap, Target, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  anxiety: <Brain className="h-5 w-5" />,
  mindfulness: <Heart className="h-5 w-5" />,
  stress: <Zap className="h-5 w-5" />,
  sleep: <Moon className="h-5 w-5" />,
  confidence: <Target className="h-5 w-5" />,
  depression: <Heart className="h-5 w-5" />
};

// Category colors
const categoryColors: Record<string, string> = {
  anxiety: "bg-purple-100 text-purple-800 border-purple-200",
  mindfulness: "bg-blue-100 text-blue-800 border-blue-200",
  stress: "bg-orange-100 text-orange-800 border-orange-200",
  sleep: "bg-indigo-100 text-indigo-800 border-indigo-200",
  confidence: "bg-green-100 text-green-800 border-green-200",
  depression: "bg-pink-100 text-pink-800 border-pink-200"
};

export default function Programs() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  // Fetch all programs
  const { data: programs, isLoading } = trpc.structuredPrograms.getAll.useQuery({
    category: selectedCategory || undefined
  });

  // Fetch user's enrollments
  const { data: enrollments } = trpc.structuredPrograms.getMyEnrollments.useQuery();

  // Enroll mutation
  const enrollMutation = trpc.structuredPrograms.enroll.useMutation({
    onSuccess: (data) => {
      // Show success message and redirect to program
      alert(data.message);
    }
  });

  const handleEnroll = (programId: number) => {
    enrollMutation.mutate({ programId });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading programs...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Structured Programs</h1>
          <p className="text-muted-foreground">
            Evidence-based programs designed to create lasting change. Complete daily activities, 
            track your progress, and earn certificates.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">17,000+</p>
                  <p className="text-sm opacity-80">People enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-sm opacity-80">Completion rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm opacity-80">Average rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">12,000+</p>
                  <p className="text-sm opacity-80">Certificates earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Programs
          </Button>
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="gap-2"
            >
              {icon}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs?.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onEnroll={() => handleEnroll(program.id)}
              onViewDetails={() => setSelectedProgram(program)}
              isEnrolling={enrollMutation.isPending}
            />
          ))}
        </div>

        {/* Program Detail Modal would go here */}
        {selectedProgram && (
          <ProgramDetailModal
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
            onEnroll={() => {
              handleEnroll(selectedProgram.id);
              setSelectedProgram(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// Program Card Component
function ProgramCard({ 
  program, 
  onEnroll, 
  onViewDetails,
  isEnrolling 
}: { 
  program: any; 
  onEnroll: () => void;
  onViewDetails: () => void;
  isEnrolling: boolean;
}) {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with gradient */}
      <div className={cn(
        "h-32 flex items-center justify-center text-6xl",
        program.category === "anxiety" && "bg-gradient-to-br from-purple-400 to-purple-600",
        program.category === "mindfulness" && "bg-gradient-to-br from-blue-400 to-blue-600",
        program.category === "stress" && "bg-gradient-to-br from-orange-400 to-orange-600"
      )}>
        {program.iconEmoji}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{program.title}</CardTitle>
            <CardDescription>{program.subtitle}</CardDescription>
          </div>
          {program.isFeatured && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        {/* Meta info */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {program.durationDays} days
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {program.estimatedMinutesPerDay} min/day
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            {(program.averageRating / 100).toFixed(1)}
          </div>
        </div>
        
        {/* Category badge */}
        <Badge variant="outline" className={cn("gap-1", categoryColors[program.category])}>
          {categoryIcons[program.category]}
          {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
        </Badge>
        
        {/* Benefits preview */}
        <div className="space-y-1">
          {program.benefits?.slice(0, 3).map((benefit: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
        
        {/* Enrollment count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {program.totalEnrollments?.toLocaleString()} enrolled
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onViewDetails}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Details
        </Button>
        <Button 
          className="flex-1"
          onClick={onEnroll}
          disabled={isEnrolling}
        >
          <Play className="h-4 w-4 mr-2" />
          Start Program
        </Button>
      </CardFooter>
    </Card>
  );
}

// Program Detail Modal
function ProgramDetailModal({ 
  program, 
  onClose, 
  onEnroll 
}: { 
  program: any; 
  onClose: () => void;
  onEnroll: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <span className="text-4xl">{program.iconEmoji}</span>
                {program.title}
              </CardTitle>
              <CardDescription className="mt-2">{program.subtitle}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Description */}
          <p className="text-muted-foreground">{program.description}</p>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{program.durationDays}</p>
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{program.estimatedMinutesPerDay}</p>
              <p className="text-xs text-muted-foreground">Min/Day</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{program.completionRate}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{(program.averageRating / 100).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
          
          {/* Benefits */}
          <div>
            <h4 className="font-semibold mb-3">What You'll Achieve</h4>
            <div className="space-y-2">
              {program.benefits?.map((benefit: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Science basis */}
          {program.scienceBasis && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Evidence-Based Approach
              </h4>
              <p className="text-sm text-muted-foreground">{program.scienceBasis}</p>
            </div>
          )}
          
          {/* Weekly breakdown */}
          <div>
            <h4 className="font-semibold mb-3">Program Structure</h4>
            <div className="space-y-3">
              {program.weeks?.map((week: any) => (
                <div key={week.weekNumber} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Week {week.weekNumber}: {week.theme}</p>
                      <p className="text-sm text-muted-foreground">{week.description}</p>
                    </div>
                    <Badge variant="outline">{week.days?.length || 7} days</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-3 border-t pt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={onEnroll} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Start Program Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
