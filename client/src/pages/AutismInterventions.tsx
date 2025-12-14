import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Brain,
  MessageSquare,
  Users,
  Activity,
  Heart,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  PlayCircle,
  BookOpen
} from "lucide-react";

// Evidence-based intervention categories
const interventionCategories = [
  {
    id: "aba",
    title: "Applied Behavior Analysis (ABA)",
    icon: Brain,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Gold-standard behavioral intervention for autism",
    interventions: [
      {
        title: "Discrete Trial Training (DTT)",
        duration: "30 min/day",
        frequency: "5 days/week",
        description: "Structured teaching method breaking skills into small steps",
        evidence: "Strong research support"
      },
      {
        title: "Natural Environment Teaching",
        duration: "20 min/session",
        frequency: "3 sessions/day",
        description: "Teaching in natural settings during daily activities",
        evidence: "Strong research support"
      },
      {
        title: "Pivotal Response Training",
        duration: "25 min/session",
        frequency: "2 sessions/day",
        description: "Focus on pivotal areas that affect multiple behaviors",
        evidence: "Strong research support"
      }
    ]
  },
  {
    id: "communication",
    title: "Communication Interventions",
    icon: MessageSquare,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Develop functional communication skills",
    interventions: [
      {
        title: "Picture Exchange Communication (PECS)",
        duration: "15 min/session",
        frequency: "4 sessions/day",
        description: "Visual communication system using pictures",
        evidence: "Strong research support"
      },
      {
        title: "Speech Therapy",
        duration: "45 min/session",
        frequency: "2 sessions/week",
        description: "Professional speech and language therapy",
        evidence: "Strong research support"
      },
      {
        title: "Augmentative Communication (AAC)",
        duration: "20 min/session",
        frequency: "Daily practice",
        description: "Technology-assisted communication devices",
        evidence: "Moderate research support"
      }
    ]
  },
  {
    id: "social",
    title: "Social Skills Training",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Build social interaction and relationship skills",
    interventions: [
      {
        title: "Social Stories",
        duration: "10 min/day",
        frequency: "Daily",
        description: "Narrative-based teaching of social situations",
        evidence: "Moderate research support"
      },
      {
        title: "Peer-Mediated Interventions",
        duration: "30 min/session",
        frequency: "3 sessions/week",
        description: "Structured play with trained peers",
        evidence: "Strong research support"
      },
      {
        title: "Video Modeling",
        duration: "15 min/session",
        frequency: "Daily",
        description: "Learning through watching video demonstrations",
        evidence: "Strong research support"
      }
    ]
  },
  {
    id: "sensory",
    title: "Sensory Integration",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Address sensory processing challenges",
    interventions: [
      {
        title: "Occupational Therapy (OT)",
        duration: "45 min/session",
        frequency: "2 sessions/week",
        description: "Professional sensory integration therapy",
        evidence: "Moderate research support"
      },
      {
        title: "Sensory Diet",
        duration: "5-10 min/activity",
        frequency: "Throughout day",
        description: "Scheduled sensory activities",
        evidence: "Emerging research support"
      },
      {
        title: "Deep Pressure Activities",
        duration: "10 min/session",
        frequency: "As needed",
        description: "Calming deep pressure input",
        evidence: "Moderate research support"
      }
    ]
  },
  {
    id: "cognitive",
    title: "Cognitive & Academic",
    icon: BookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Support learning and cognitive development",
    interventions: [
      {
        title: "Visual Supports",
        duration: "Ongoing",
        frequency: "Daily use",
        description: "Visual schedules, timers, and organizers",
        evidence: "Strong research support"
      },
      {
        title: "Task Analysis",
        duration: "15 min/task",
        frequency: "As needed",
        description: "Breaking complex tasks into steps",
        evidence: "Strong research support"
      },
      {
        title: "Structured Teaching (TEACCH)",
        duration: "Ongoing",
        frequency: "Daily structure",
        description: "Organized environment and routines",
        evidence: "Strong research support"
      }
    ]
  },
  {
    id: "emotional",
    title: "Emotional Regulation",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    description: "Develop self-regulation and coping skills",
    interventions: [
      {
        title: "Zones of Regulation",
        duration: "20 min/session",
        frequency: "Daily",
        description: "Framework for self-regulation",
        evidence: "Emerging research support"
      },
      {
        title: "Mindfulness Practices",
        duration: "10 min/session",
        frequency: "Daily",
        description: "Age-appropriate mindfulness activities",
        evidence: "Emerging research support"
      },
      {
        title: "Emotion Recognition Training",
        duration: "15 min/session",
        frequency: "3 sessions/week",
        description: "Identifying and labeling emotions",
        evidence: "Moderate research support"
      }
    ]
  }
];

export default function AutismInterventions() {
  const [, params] = useRoute("/autism/interventions/:id");
  const profileId = parseInt(params?.id || "0");
  
  const { data: profile, isLoading } = trpc.autism.getProfileById.useQuery({ id: profileId });
  const [selectedCategory, setSelectedCategory] = useState(interventionCategories[0].id);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Profile not found</p>
          <Link to="/autism">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  const currentCategory = interventionCategories.find(c => c.id === selectedCategory);
  const Icon = currentCategory?.icon || Brain;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to={`/autism/profile/${profileId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Interventions for {profile.childName}
              </h1>
              <p className="text-gray-600">
                Evidence-based interventions tailored to your child's needs
              </p>
            </div>
            
            <Badge variant="outline" className="capitalize">
              {profile.severity} Severity
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Selection */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-8">
          {interventionCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all ${
                  selectedCategory === category.id
                    ? 'ring-2 ring-blue-600 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <CategoryIcon className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                  <p className="text-sm font-medium text-gray-900">{category.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Selected Category Details */}
        {currentCategory && (
          <div className="space-y-6">
            <Card className={currentCategory.bgColor}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${currentCategory.color}`} />
                  {currentCategory.title}
                </CardTitle>
                <CardDescription className="text-gray-700">
                  {currentCategory.description}
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Interventions List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentCategory.interventions.map((intervention, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{intervention.title}</CardTitle>
                    <CardDescription>{intervention.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{intervention.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium">{intervention.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Evidence:</span>
                        <Badge variant="secondary" className="text-xs">
                          {intervention.evidence}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Progress Tracking */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>
              Track your child's progress across intervention areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Start interventions to begin tracking progress
              </p>
              <p className="text-sm text-gray-500">
                Progress data will be displayed here as you complete intervention sessions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
