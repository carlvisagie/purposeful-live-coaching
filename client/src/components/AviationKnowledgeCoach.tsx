/**
 * AVIATION KNOWLEDGE COACH
 * 
 * Complete interview preparation system for Senior Maintenance Manager position
 * 10 Must-Know Areas with Learn, Quiz, Verbal Practice, and Scenario modes
 */

import React, { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  Mic, 
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Volume2,
  Star,
  Target,
  Award,
  Lightbulb,
  Video,
  StopCircle,
  Play
} from "lucide-react";

interface AviationKnowledgeCoachProps {
  onClose: () => void;
}

type StudyMode = "select" | "learn" | "quiz" | "verbal" | "scenario";

export function AviationKnowledgeCoach({ onClose }: AviationKnowledgeCoachProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>("select");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  // Fetch knowledge areas
  const { data: knowledgeAreas } = trpc.aviationKnowledge.getKnowledgeAreas.useQuery();
  
  // Fetch area content when selected
  const { data: areaContent } = trpc.aviationKnowledge.getAreaContent.useQuery(
    { areaId: selectedArea || "" },
    { enabled: !!selectedArea }
  );

  // Fetch quiz question
  const { data: quizQuestion, refetch: refetchQuiz } = trpc.aviationKnowledge.getQuizQuestion.useQuery(
    { areaId: selectedArea || "" },
    { enabled: !!selectedArea && studyMode === "quiz" }
  );

  // Fetch scenario
  const { data: scenario, refetch: refetchScenario } = trpc.aviationKnowledge.getScenario.useQuery(
    { areaId: selectedArea || "" },
    { enabled: !!selectedArea && studyMode === "scenario" }
  );

  // Fetch verbal prompt
  const { data: verbalPrompt, refetch: refetchVerbal } = trpc.aviationKnowledge.getVerbalPrompt.useQuery(
    { areaId: selectedArea || "" },
    { enabled: !!selectedArea && studyMode === "verbal" }
  );

  // Fetch golden rule
  const { data: goldenRule } = trpc.aviationKnowledge.getGoldenRule.useQuery();

  // Evaluate response mutation
  const evaluateMutation = trpc.aviationKnowledge.evaluateResponse.useMutation();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
    }
  }, []);

  // Start camera for verbal practice
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setEvaluation(null);
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Stop recording and evaluate
  const stopRecording = async () => {
    setIsRecording(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Evaluate the response
    if (transcript && selectedArea && verbalPrompt) {
      setIsEvaluating(true);
      try {
        const result = await evaluateMutation.mutateAsync({
          areaId: selectedArea,
          prompt: verbalPrompt.prompt,
          response: transcript,
        });
        setEvaluation(result);
      } catch (error) {
        console.error("Evaluation error:", error);
      }
      setIsEvaluating(false);
    }
  };

  // Handle quiz answer
  const handleQuizAnswer = (index: number) => {
    setQuizAnswer(index);
    setShowQuizResult(true);
  };

  // Next quiz question
  const nextQuizQuestion = () => {
    setQuizAnswer(null);
    setShowQuizResult(false);
    refetchQuiz();
  };

  // Render area selection
  const renderAreaSelection = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Aviation Knowledge Coach</h2>
        <p className="text-gray-600">Master the 10 Must-Know Areas for Senior Maintenance Manager</p>
      </div>

      {/* Golden Rule Banner */}
      {goldenRule && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            <span className="font-bold">THE GOLDEN RULE</span>
          </div>
          <p className="text-lg font-medium">"{goldenRule.goldenRule}"</p>
          <p className="text-sm opacity-90 mt-1">{goldenRule.summary}</p>
        </div>
      )}

      {/* Knowledge Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {knowledgeAreas?.map((area) => (
          <button
            key={area.id}
            onClick={() => {
              setSelectedArea(area.id);
              setStudyMode("select");
            }}
            className="flex items-start gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
          >
            <span className="text-3xl">{area.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{area.shortTitle}</h3>
              {area.regulation && (
                <p className="text-xs text-blue-600 font-mono">{area.regulation}</p>
              )}
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{area.anchorStatement}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );

  // Render mode selection
  const renderModeSelection = () => (
    <div className="p-6">
      <button
        onClick={() => setSelectedArea(null)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Topics
      </button>

      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">{areaContent?.icon}</span>
        <h2 className="text-2xl font-bold text-gray-900">{areaContent?.title}</h2>
        {areaContent?.regulation && (
          <p className="text-blue-600 font-mono text-sm">{areaContent.regulation}</p>
        )}
      </div>

      {/* Anchor Statement */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
        <p className="text-sm text-blue-600 font-medium mb-1">ANCHOR STATEMENT</p>
        <p className="text-gray-800 font-medium">"{areaContent?.anchorStatement}"</p>
      </div>

      {/* Study Mode Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setStudyMode("learn")}
          className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <BookOpen className="w-8 h-8" />
          <span className="font-bold">Learn</span>
          <span className="text-xs opacity-90">Deep dive into the concept</span>
        </button>

        <button
          onClick={() => setStudyMode("quiz")}
          className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <HelpCircle className="w-8 h-8" />
          <span className="font-bold">Quiz</span>
          <span className="text-xs opacity-90">Test your knowledge</span>
        </button>

        <button
          onClick={() => {
            setStudyMode("verbal");
            startCamera();
          }}
          className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Mic className="w-8 h-8" />
          <span className="font-bold">Verbal Practice</span>
          <span className="text-xs opacity-90">Practice explaining out loud</span>
        </button>

        <button
          onClick={() => setStudyMode("scenario")}
          className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <MessageSquare className="w-8 h-8" />
          <span className="font-bold">Scenarios</span>
          <span className="text-xs opacity-90">"What would you do if..."</span>
        </button>
      </div>
    </div>
  );

  // Render Learn mode
  const renderLearnMode = () => (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <button
        onClick={() => setStudyMode("select")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Modes
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{areaContent?.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{areaContent?.title}</h2>
          <p className="text-sm text-green-600 font-medium">Learning Mode</p>
        </div>
      </div>

      {/* Key Points */}
      <div className="bg-white border rounded-xl p-4 mb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Key Points
        </h3>
        <ul className="space-y-2">
          {areaContent?.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Deep Dive */}
      <div className="bg-white border rounded-xl p-4 mb-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-500" />
          Deep Dive
        </h3>
        <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
          {areaContent?.deepDive}
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
        <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          Common Mistakes to Avoid
        </h3>
        <ul className="space-y-2">
          {areaContent?.commonMistakes.map((mistake, i) => (
            <li key={i} className="flex items-start gap-2 text-red-700">
              <span className="text-red-500">✗</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interview Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Interview Tips
        </h3>
        <ul className="space-y-2">
          {areaContent?.interviewTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-amber-700">
              <span className="text-amber-500">💡</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Render Quiz mode
  const renderQuizMode = () => (
    <div className="p-6">
      <button
        onClick={() => setStudyMode("select")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Modes
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{areaContent?.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{areaContent?.title}</h2>
          <p className="text-sm text-purple-600 font-medium">Quiz Mode</p>
        </div>
      </div>

      {quizQuestion && (
        <div className="bg-white border rounded-xl p-6">
          <p className="text-lg font-medium text-gray-900 mb-6">{quizQuestion.question}</p>

          <div className="space-y-3">
            {quizQuestion.options.map((option, index) => {
              const isCorrect = index === quizQuestion.correctIndex;
              const isSelected = quizAnswer === index;
              
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              
              if (showQuizResult) {
                if (isCorrect) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 text-gray-500";
                }
              } else {
                buttonClass += "border-gray-200 hover:border-purple-500 hover:bg-purple-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => !showQuizResult && handleQuizAnswer(index)}
                  disabled={showQuizResult}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showQuizResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                    {showQuizResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showQuizResult && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${quizAnswer === quizQuestion.correctIndex ? 'bg-green-100' : 'bg-amber-100'}`}>
                <p className="font-medium mb-2">
                  {quizAnswer === quizQuestion.correctIndex ? '✅ Correct!' : '❌ Not quite...'}
                </p>
                <p className="text-sm text-gray-700">{quizQuestion.explanation}</p>
              </div>
              
              <button
                onClick={nextQuizQuestion}
                className="mt-4 w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render Verbal Practice mode
  const renderVerbalMode = () => (
    <div className="p-6">
      <button
        onClick={() => {
          setStudyMode("select");
          stopCamera();
          setTranscript("");
          setEvaluation(null);
        }}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Modes
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{areaContent?.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{areaContent?.title}</h2>
          <p className="text-sm text-orange-600 font-medium">Verbal Practice</p>
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Recording
          </div>
        )}
      </div>

      {/* Prompt */}
      {verbalPrompt && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-orange-600 font-medium mb-2">YOUR PROMPT:</p>
          <p className="text-gray-900 font-medium">{verbalPrompt.prompt}</p>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex justify-center gap-4 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Speaking
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 transition-colors"
          >
            <StopCircle className="w-5 h-5" />
            Stop & Evaluate
          </button>
        )}
        
        <button
          onClick={() => refetchVerbal()}
          className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
        >
          New Prompt
        </button>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-white border rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500 mb-2">Your Response:</p>
          <p className="text-gray-800">{transcript}</p>
        </div>
      )}

      {/* Evaluation */}
      {isEvaluating && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Evaluating your response...</p>
        </div>
      )}

      {evaluation && (
        <div className="bg-white border rounded-xl p-4 space-y-4">
          {/* Score */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${
              evaluation.overallScore >= 80 ? 'bg-green-100 text-green-600' :
              evaluation.overallScore >= 60 ? 'bg-amber-100 text-amber-600' :
              'bg-red-100 text-red-600'
            }`}>
              {evaluation.overallScore}
            </div>
            <p className="text-gray-600 mt-2">Overall Score</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-gray-500">Content</p>
              <p className="font-bold">{evaluation.contentAccuracy}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-gray-500">Completeness</p>
              <p className="font-bold">{evaluation.completeness}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-gray-500">Confidence</p>
              <p className="font-bold">{evaluation.confidence}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-gray-500">Clarity</p>
              <p className="font-bold">{evaluation.clarity}%</p>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 rounded-lg p-3">
            <p className="font-medium text-green-800 mb-2">✅ Strengths</p>
            <ul className="text-sm text-green-700 space-y-1">
              {evaluation.strengths?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="font-medium text-amber-800 mb-2">💡 Improvements</p>
            <ul className="text-sm text-amber-700 space-y-1">
              {evaluation.improvements?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          {/* Suggested Response */}
          {evaluation.suggestedResponse && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-800 mb-2">📝 Suggested Response</p>
              <p className="text-sm text-blue-700">{evaluation.suggestedResponse}</p>
            </div>
          )}

          {/* Encouragement */}
          <p className="text-center text-gray-600 italic">{evaluation.encouragement}</p>
        </div>
      )}
    </div>
  );

  // Render Scenario mode
  const renderScenarioMode = () => (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <button
        onClick={() => setStudyMode("select")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Modes
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{areaContent?.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{areaContent?.title}</h2>
          <p className="text-sm text-cyan-600 font-medium">Scenario Practice</p>
        </div>
      </div>

      {scenario && (
        <div className="space-y-4">
          {/* Situation */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <p className="text-sm text-cyan-600 font-medium mb-2">THE SITUATION:</p>
            <p className="text-gray-900">{scenario.situation}</p>
          </div>

          {/* Think about it prompt */}
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-gray-600 mb-2">Take a moment to think about how you would respond...</p>
            <p className="text-sm text-gray-500">What would you say? What actions would you take?</p>
          </div>

          {/* Good Response */}
          <details className="bg-white border rounded-xl overflow-hidden">
            <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
              👀 Click to see a good response
            </summary>
            <div className="p-4 border-t bg-green-50">
              <p className="text-gray-800 mb-4">{scenario.goodResponse}</p>
              
              <div className="bg-white rounded-lg p-3">
                <p className="font-medium text-gray-700 mb-2">Key Elements to Include:</p>
                <ul className="space-y-1">
                  {scenario.keyElements.map((element, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {element}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          {/* Next Scenario */}
          <button
            onClick={() => refetchScenario()}
            className="w-full py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
          >
            Next Scenario
          </button>
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <div>
              <h1 className="font-bold">Aviation Knowledge Coach</h1>
              <p className="text-xs opacity-90">Senior Maintenance Manager Interview Prep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {!selectedArea && renderAreaSelection()}
          {selectedArea && studyMode === "select" && renderModeSelection()}
          {selectedArea && studyMode === "learn" && renderLearnMode()}
          {selectedArea && studyMode === "quiz" && renderQuizMode()}
          {selectedArea && studyMode === "verbal" && renderVerbalMode()}
          {selectedArea && studyMode === "scenario" && renderScenarioMode()}
        </div>
      </div>
    </div>
  );
}
