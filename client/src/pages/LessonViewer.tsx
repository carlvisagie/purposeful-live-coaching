import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  FileText,
  Headphones,
  Download,
  BookOpen
} from "lucide-react";
import { wellnessModulesData } from "@/data/wellnessModulesData";

/**
 * Lesson Viewer
 * Displays individual lesson content with video player, exercises, or audio
 */
export default function LessonViewer() {
  const [, params] = useRoute("/wellness-modules/:moduleSlug/lesson/:lessonIndex");
  const [, setLocation] = useLocation();
  
  const moduleSlug = params?.moduleSlug || "";
  const lessonIndex = parseInt(params?.lessonIndex || "0");
  
  const module = wellnessModulesData[moduleSlug];
  const lesson = module?.lessons[lessonIndex];
  
  const [completed, setCompleted] = useState(false);
  
  if (!module || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Lesson not found</p>
          <Link to="/wellness-modules">
            <Button>Back to Modules</Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  const handleNext = () => {
    if (lessonIndex < module.lessons.length - 1) {
      setLocation(`/wellness-modules/${moduleSlug}/lesson/${lessonIndex + 1}`);
    } else {
      setLocation(`/wellness-modules/${moduleSlug}`);
    }
  };
  
  const handlePrevious = () => {
    if (lessonIndex > 0) {
      setLocation(`/wellness-modules/${moduleSlug}/lesson/${lessonIndex - 1}`);
    }
  };
  
  const handleComplete = () => {
    setCompleted(true);
    // TODO: Save completion to backend
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={`/wellness-modules/${moduleSlug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Module
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Lesson {lessonIndex + 1} of {module.lessons.length}
              </span>
              <Progress value={((lessonIndex + 1) / module.lessons.length) * 100} className="w-32" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="p-8">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {lesson.type === "video" && <PlayCircle className="h-6 w-6 text-blue-600" />}
                {lesson.type === "exercise" && <FileText className="h-6 w-6 text-green-600" />}
                {lesson.type === "practice" && <Headphones className="h-6 w-6 text-purple-600" />}
                <Badge variant="outline" className="capitalize">{lesson.type}</Badge>
                <span className="text-sm text-gray-600">{lesson.duration}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              
              <p className="text-gray-600">
                {module.title} - Lesson {lessonIndex + 1}
              </p>
            </div>
            
            {/* Video Player (for video lessons) */}
            {lesson.type === "video" && (
              <div className="mb-8">
                {lesson.videoUrl ? (
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      key={lesson.videoUrl}
                      src={lesson.videoUrl}
                      controls
                      className="w-full h-full"
                      poster="/api/placeholder/1280/720"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Video Content</p>
                      <p className="text-sm text-gray-400">Video not available for this lesson</p>
                      <p className="text-xs text-gray-500 mt-2">Duration: {lesson.duration}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Audio Player (for practice lessons) */}
            {lesson.type === "practice" && (
              <div className="mb-8">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-8 text-center">
                  <Headphones className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                  <p className="text-lg font-semibold text-purple-900 mb-2">Audio Practice</p>
                  <p className="text-purple-700 mb-4">Guided audio session for daily practice</p>
                  <p className="text-sm text-purple-600">Duration: {lesson.duration}</p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Play Audio
                  </Button>
                </div>
              </div>
            )}
            
            {/* Exercise Content (for exercise lessons) */}
            {lesson.type === "exercise" && (
              <div className="mb-8">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <FileText className="h-8 w-8 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Practical Exercise</h3>
                      <p className="text-green-700">
                        Complete this exercise to apply what you've learned and build practical skills.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 bg-white rounded-lg p-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Review the concepts covered in previous lessons</li>
                        <li>Download the exercise worksheet below</li>
                        <li>Complete each section thoughtfully</li>
                        <li>Reflect on your responses and insights</li>
                        <li>Mark this lesson as complete when finished</li>
                      </ol>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Get worksheet filename from lesson title
                        const worksheetName = lesson.title.toLowerCase().replace(/\s+/g, '_');
                        window.open(`/guides/${worksheetName}.md`, '_blank');
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Exercise Guide
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Lesson Content */}
            <div className="prose max-w-none mb-8">
              {lesson.description && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Overview</h2>
                  <p className="text-gray-700 mb-6">
                    {lesson.description}
                  </p>
                </>
              )}
              
              {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways:</h3>
                  <ul className="space-y-2 text-gray-700 mb-6">
                    {lesson.keyPoints.map((point: string, index: number) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {lesson.content && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Content</h3>
                  <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                    {lesson.content}
                  </div>
                </>
              )}
              
              {!lesson.description && !lesson.keyPoints && !lesson.content && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Overview</h2>
                  
                  <p className="text-gray-700 mb-4">
                    This lesson is part of the {module.title} module, designed to help you develop
                    practical skills and sustainable habits for lasting transformation.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways:</h3>
                  <ul className="space-y-2 text-gray-700 mb-6">
                    <li>Understand the core principles and concepts</li>
                    <li>Learn evidence-based techniques and strategies</li>
                    <li>Practice applying skills in real-world scenarios</li>
                    <li>Build confidence and competence through repetition</li>
                  </ul>
                </>
              )}
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Pro Tip</p>
                    <p className="text-blue-800 text-sm">
                      Take notes as you go through this lesson. Writing down key insights helps
                      reinforce learning and makes it easier to review later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Completion Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={lessonIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Lesson
              </Button>
              
              <div className="flex gap-3">
                {!completed && (
                  <Button
                    variant="outline"
                    onClick={handleComplete}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                
                {completed && (
                  <div className="flex items-center gap-2 text-green-600 px-4">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Completed!</span>
                  </div>
                )}
                
                <Button onClick={handleNext}>
                  {lessonIndex < module.lessons.length - 1 ? (
                    <>
                      Next Lesson
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Back to Module
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Resources */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Additional Resources</h3>
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => window.open(`/lesson-notes/${moduleSlug}-lesson-${lessonIndex + 1}.md`, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Lesson Notes (Markdown)
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => window.open(`/transcripts/${moduleSlug}-lesson-${lessonIndex + 1}.md`, '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Lesson Transcript
              </Button>
              <Link to={`/wellness-modules/${moduleSlug}/resources`}>
                <Button variant="outline" className="justify-start w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Related Reading Materials
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
