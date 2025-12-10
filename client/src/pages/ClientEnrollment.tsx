import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Mic,
  Camera,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  User,
  Shield
} from "lucide-react";

/**
 * CLIENT ENROLLMENT PAGE
 * 
 * Allows clients to enroll their voice and face for AI recognition.
 * 
 * Features:
 * - Voice enrollment (record 3 audio samples)
 * - Face enrollment (capture 3 photos)
 * - Enrollment status tracking
 * - Re-enrollment capability
 * - Privacy information
 */

export default function ClientEnrollment() {
  const [voiceStep, setVoiceStep] = useState(0); // 0-3 (0 = not started, 1-3 = samples)
  const [faceStep, setFaceStep] = useState(0); // 0-3
  const [voiceSamples, setVoiceSamples] = useState<string[]>([]);
  const [facePhotos, setFacePhotos] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Queries
  const { data: voiceStatus, refetch: refetchVoiceStatus } = 
    trpc.voiceRecognition.getEnrollmentStatus.useQuery();
  const { data: faceStatus, refetch: refetchFaceStatus } = 
    trpc.faceRecognition.getEnrollmentStatus.useQuery();
  
  // Mutations
  const enrollVoiceMutation = trpc.voiceRecognition.enrollVoice.useMutation({
    onSuccess: () => {
      toast.success("Voice enrolled successfully!");
      refetchVoiceStatus();
      setVoiceStep(0);
      setVoiceSamples([]);
    },
    onError: (error) => {
      toast.error(`Voice enrollment failed: ${error.message}`);
    },
  });
  
  const enrollFaceMutation = trpc.faceRecognition.enrollFace.useMutation({
    onSuccess: () => {
      toast.success("Face enrolled successfully!");
      refetchFaceStatus();
      setFaceStep(0);
      setFacePhotos([]);
    },
    onError: (error) => {
      toast.error(`Face enrollment failed: ${error.message}`);
    },
  });
  
  // Voice Recording Functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(",")[1];
          setVoiceSamples(prev => [...prev, base64Audio]);
          setVoiceStep(prev => prev + 1);
        };
        
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopVoiceRecording();
        }
      }, 5000);
    } catch (error) {
      toast.error("Failed to access microphone");
      console.error(error);
    }
  };
  
  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const submitVoiceEnrollment = () => {
    if (voiceSamples.length < 3) {
      toast.error("Please record at least 3 voice samples");
      return;
    }
    
    enrollVoiceMutation.mutate({ audioSamples: voiceSamples });
  };
  
  // Face Capture Functions
  const startFaceCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      toast.error("Failed to access camera");
      console.error(error);
    }
  };
  
  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const base64Photo = canvas.toDataURL("image/jpeg").split(",")[1];
      setFacePhotos(prev => [...prev, base64Photo]);
      setFaceStep(prev => prev + 1);
      
      if (faceStep >= 2) {
        stopFaceCapture();
      }
    }
  };
  
  const stopFaceCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCapturing(false);
    }
  };
  
  const submitFaceEnrollment = () => {
    if (facePhotos.length < 3) {
      toast.error("Please capture at least 3 photos");
      return;
    }
    
    enrollFaceMutation.mutate({ photos: facePhotos });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <User className="h-8 w-8 text-rose-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Client Recognition Enrollment
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enroll your voice and face so our AI can recognize you in future sessions. 
            This creates a more personalized coaching experience.
          </p>
        </div>
        
        {/* Privacy Notice */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900 dark:text-blue-100">Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>• All biometric data is encrypted and stored securely</p>
            <p>• Your voice and face data is never shared with third parties</p>
            <p>• You can disable recognition at any time</p>
            <p>• Recognition is optional - you can still use the platform without it</p>
          </CardContent>
        </Card>
        
        {/* Voice Enrollment */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-rose-500" />
                <CardTitle>Voice Enrollment</CardTitle>
              </div>
              {voiceStatus?.enrolled && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Enrolled
                </Badge>
              )}
            </div>
            <CardDescription>
              Record 3 short voice samples (5 seconds each) so we can recognize your voice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {voiceStatus?.enrolled ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quality</p>
                    <p className="font-medium capitalize">{voiceStatus.quality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Verifications</p>
                    <p className="font-medium">{voiceStatus.verificationCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-medium">{voiceStatus.averageAccuracy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enrolled</p>
                    <p className="font-medium">
                      {voiceStatus.enrolledAt ? new Date(voiceStatus.enrolledAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setVoiceStep(1);
                    setVoiceSamples([]);
                  }}
                >
                  Re-enroll Voice
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {voiceStep}/3 samples</span>
                    <span>{Math.floor((voiceStep / 3) * 100)}%</span>
                  </div>
                  <Progress value={(voiceStep / 3) * 100} />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`p-4 rounded-lg border-2 flex items-center justify-center ${
                        voiceStep >= num
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      {voiceStep >= num ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Mic className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {voiceStep < 3 && (
                    <Button
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      disabled={isRecording}
                      className="flex-1"
                    >
                      {isRecording ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Recording... (5s)
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Record Sample {voiceStep + 1}
                        </>
                      )}
                    </Button>
                  )}
                  
                  {voiceStep === 3 && (
                    <Button
                      onClick={submitVoiceEnrollment}
                      disabled={enrollVoiceMutation.isPending}
                      className="flex-1"
                    >
                      {enrollVoiceMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Complete Voice Enrollment
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Face Enrollment */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-500" />
                <CardTitle>Face Enrollment</CardTitle>
              </div>
              {faceStatus?.enrolled && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Enrolled
                </Badge>
              )}
            </div>
            <CardDescription>
              Capture 3 photos of your face from different angles for recognition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faceStatus?.enrolled ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quality</p>
                    <p className="font-medium capitalize">{faceStatus.quality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Verifications</p>
                    <p className="font-medium">{faceStatus.verificationCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-medium">{faceStatus.averageAccuracy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enrolled</p>
                    <p className="font-medium">
                      {faceStatus.enrolledAt ? new Date(faceStatus.enrolledAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFaceStep(1);
                    setFacePhotos([]);
                    startFaceCapture();
                  }}
                >
                  Re-enroll Face
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {faceStep}/3 photos</span>
                    <span>{Math.floor((faceStep / 3) * 100)}%</span>
                  </div>
                  <Progress value={(faceStep / 3) * 100} />
                </div>
                
                {isCapturing && (
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`p-4 rounded-lg border-2 flex items-center justify-center ${
                        faceStep >= num
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      {faceStep >= num ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {!isCapturing && faceStep < 3 && (
                    <Button
                      onClick={startFaceCapture}
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  )}
                  
                  {isCapturing && faceStep < 3 && (
                    <>
                      <Button
                        onClick={capturePhoto}
                        className="flex-1"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Capture Photo {faceStep + 1}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={stopFaceCapture}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {faceStep === 3 && (
                    <Button
                      onClick={submitFaceEnrollment}
                      disabled={enrollFaceMutation.isPending}
                      className="flex-1"
                    >
                      {enrollFaceMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Complete Face Enrollment
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
