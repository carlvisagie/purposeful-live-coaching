import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, CheckCircle2, PlayCircle, FileText, Headphones, Sparkles
} from "lucide-react";
import { wellnessModulesData } from "@/data/wellnessModulesData";
import { exerciseMaterialsMap } from "@/data/exerciseMaterialsMap";

const moduleData = wellnessModulesData;

// Generate default content for modules not explicitly defined
const generateDefaultModule = (slug: string) => {
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    icon: Sparkles,
    title,
    description: `Comprehensive guide to ${title.toLowerCase()}`,
    category: "Wellness",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    longDescription: `Discover evidence-based strategies and practical techniques to enhance your ${title.toLowerCase()}. This module provides comprehensive guidance, exercises, and tools for lasting transformation.`,
    benefits: [
      `Understand the fundamentals of ${title.toLowerCase()}`,
      "Develop practical skills and strategies",
      "Build sustainable habits for long-term success",
      "Track your progress and celebrate wins",
      "Access expert guidance and support"
    ],
    lessons: [
      { title: "Introduction and Foundations", duration: "15 min", type: "video" },
      { title: "Core Concepts and Principles", duration: "20 min", type: "video" },
      { title: "Practical Application Exercise", duration: "10 min", type: "exercise" },
      { title: "Daily Practice Routine", duration: "8 min", type: "practice" },
      { title: "Advanced Techniques", duration: "18 min", type: "video" }
    ],
    exercises: [
      "Self-Assessment Worksheet",
      "Goal Setting Template",
      "Progress Tracking Sheet",
      "Daily Practice Guide"
    ]
  };
};

export default function WellnessModuleDetail() {
  const [, params] = useRoute("/wellness-modules/:slug");
  const slug = params?.slug || "";
  
  const module = moduleData[slug] || generateDefaultModule(slug);
  const Icon = module.icon;
  
  const [progress, setProgress] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className={`${module.bgColor} border-b`}>
        <div className="container mx-auto px-4 py-8">
          <Link to="/wellness-modules">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
          </Link>
          
          <div className="flex items-start gap-6">
            <div className={`p-4 ${module.bgColor} rounded-2xl`}>
              <Icon className={`h-12 w-12 ${module.color}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary">{module.category}</Badge>
                <span className="text-sm text-gray-600">{module.lessons.length} Lessons</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{module.title}</h1>
              <p className="text-xl text-gray-700 mb-4">{module.longDescription}</p>
              
              <div className="flex gap-3">
                <Link to={`/wellness-modules/${slug}/lesson/0`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Start Module
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.open(`/workbooks/${slug}-workbook.md`, '_blank')}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Download Workbook
                </Button>
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Your Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
                <CardDescription>Key benefits and outcomes from this module</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {module.benefits.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Structure</CardTitle>
                <CardDescription>How this module is organized</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Video Lessons</h4>
                  <p className="text-gray-600">Expert-led video content covering core concepts and techniques</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Practical Exercises</h4>
                  <p className="text-gray-600">Hands-on activities to apply what you've learned</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Daily Practices</h4>
                  <p className="text-gray-600">Simple routines to integrate into your daily life</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Downloadable Resources</h4>
                  <p className="text-gray-600">Worksheets, templates, and guides for ongoing practice</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            {module.lessons.map((lesson: any, idx: number) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex-shrink-0">
                    {lesson.type === "video" && <PlayCircle className="h-8 w-8 text-blue-600" />}
                    {lesson.type === "exercise" && <FileText className="h-8 w-8 text-green-600" />}
                    {lesson.type === "practice" && <Headphones className="h-8 w-8 text-purple-600" />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Lesson {idx + 1}: {lesson.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{lesson.duration}</span>
                      <Badge variant="outline" className="capitalize">{lesson.type}</Badge>
                    </div>
                  </div>
                  
                  <Link to={`/wellness-modules/${slug}/lesson/${idx}`}>
                    <Button>Start</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {module.exercises.map((exercise: string, idx: number) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{exercise}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Downloadable worksheet to practice and track your progress
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Find matching material file
                        const materialPath = exerciseMaterialsMap[exercise] || 
                                           exerciseMaterialsMap[exercise.replace(/-/g, ' ')];
                        if (materialPath) {
                          window.open(materialPath, '_blank');
                        } else {
                          console.error('Material not found for:', exercise);
                        }
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Material
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Reading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">Curated books and articles to deepen your understanding</p>
                <Link to={`/wellness-modules/${slug}/resources`}>
                  <Button variant="outline">View Reading List</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">Connect with others on the same journey</p>
                <a href="https://community.purposefullivecoaching.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Join Discussion</Button>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">Get personalized support from our coaches</p>
                <Link to="/sessions/book">
                  <Button variant="outline">Book a Session</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
