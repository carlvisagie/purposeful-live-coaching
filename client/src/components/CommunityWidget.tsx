/**
 * COMMUNITY WIDGET - Stupid Simple, Always Accessible
 * 
 * Design Philosophy:
 * - Floating bubble in bottom-right corner
 * - One tap to expand
 * - Maximum 2 taps to post anything
 * - Voice, photo, video - all converted in background
 * - User does MINIMUM, we do MAXIMUM
 */

import { useState, useRef, useEffect } from "react";
import { trpc } from "../lib/trpc";
import {
  Trophy,
  Heart,
  Mic,
  Camera,
  X,
  Send,
  Users,
  Loader2,
  MessageCircle,
  Check,
  Volume2,
  Pause,
  Play,
  Image as ImageIcon,
  Video,
  Sparkles,
} from "lucide-react";

// Post type configurations - BIG friendly buttons
const QUICK_ACTIONS = {
  win: {
    icon: Trophy,
    emoji: "🎉",
    label: "Share a Win",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
    placeholder: "What are you celebrating?",
    prompts: [
      "I did something great today!",
      "I'm proud of myself for...",
      "Small win: ",
      "Big win: ",
    ],
  },
  support: {
    icon: Heart,
    emoji: "💙",
    label: "Need Support",
    color: "from-blue-400 to-purple-500",
    bgColor: "bg-gradient-to-br from-blue-400 to-purple-500",
    placeholder: "What's on your mind?",
    prompts: [
      "I'm struggling with...",
      "I need encouragement about...",
      "Today is hard because...",
      "Can anyone relate to...",
    ],
  },
};

type QuickActionType = keyof typeof QUICK_ACTIONS;

interface CommunityWidgetProps {
  className?: string;
}

export default function CommunityWidget({ className = "" }: CommunityWidgetProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<QuickActionType | null>(null);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Queries
  const { data: stats } = trpc.community.getStats.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mutations
  const createPost = trpc.community.createPost.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        setIsOpen(false);
      }, 1500);
    },
  });

  // Reset form
  const resetForm = () => {
    setSelectedAction(null);
    setContent("");
    setAudioBlob(null);
    setAudioUrl(null);
    setMediaFile(null);
    setMediaPreview(null);
    setRecordingTime(0);
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        
        // Auto-transcribe
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access microphone. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  // tRPC mutation for voice transcription
  const transcribeVoice = trpc.community.transcribeVoice.useMutation({
    onSuccess: (data) => {
      if (data.success && data.transcription) {
        setContent(data.transcription);
      } else {
        setContent("(Could not transcribe - please type your message)");
      }
      setIsTranscribing(false);
      // Auto-select support type for voice notes
      if (!selectedAction) {
        setSelectedAction("support");
      }
    },
    onError: () => {
      setContent("(Could not transcribe - please type your message)");
      setIsTranscribing(false);
    },
  });

  // Transcribe audio to text
  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64Audio = base64Data.split(',')[1];
        
        // Call backend transcription
        transcribeVoice.mutate({
          audioBase64: base64Audio,
          mimeType: blob.type || "audio/webm",
        });
      };
    } catch (error) {
      console.error("Transcription failed:", error);
      setContent("(Could not transcribe - please type your message)");
      setIsTranscribing(false);
    }
  };

  // Handle media file selection
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    
    // Create preview
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    
    // Auto-select win type for photos
    if (!selectedAction) {
      setSelectedAction("win");
    }
  };

  // Quick post mutation (optimized for widget)
  const quickPost = trpc.community.quickPost.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        setIsOpen(false);
      }, 1500);
    },
    onError: (error) => {
      console.error("Failed to post:", error);
      alert("Failed to share. Please try again.");
    },
  });

  // Handle post submission
  const handlePost = async () => {
    if (!selectedAction) return;
    if (!content.trim() && !mediaFile && !audioBlob) return;

    setIsUploading(true);
    
    try {
      // Determine source based on how content was created
      const source = audioBlob ? "voice" : "widget";
      
      await quickPost.mutateAsync({
        postType: selectedAction,
        content: content.trim() || "(Media post)",
        isAnonymous: false,
        source,
      });
    } catch (error) {
      console.error("Failed to post:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [audioUrl, mediaPreview]);

  // Auto-focus textarea when action selected
  useEffect(() => {
    if (selectedAction && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedAction]);

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-purple-500 to-purple-700
          shadow-lg shadow-purple-500/30
          flex items-center justify-center
          hover:scale-110 active:scale-95
          transition-all duration-200
          ${isOpen ? 'rotate-90' : ''}
          ${className}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <Users className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          
          {/* Success State */}
          {showSuccess ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-gray-800">Shared! 🎉</p>
              <p className="text-sm text-gray-500">Your community thanks you</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Quick Share</span>
                  </div>
                  {stats && (
                    <span className="text-purple-200 text-xs">
                      {stats.todayPosts} posts today
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Quick Action Buttons */}
                {!selectedAction && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 text-center mb-4">
                      What would you like to share?
                    </p>
                    
                    {/* Win & Support Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.entries(QUICK_ACTIONS) as [QuickActionType, typeof QUICK_ACTIONS.win][]).map(([type, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={type}
                            onClick={() => setSelectedAction(type)}
                            className={`
                              p-4 rounded-xl ${config.bgColor} text-white
                              flex flex-col items-center gap-2
                              hover:opacity-90 active:scale-95
                              transition-all duration-150
                              shadow-lg
                            `}
                          >
                            <span className="text-2xl">{config.emoji}</span>
                            <span className="text-sm font-medium">{config.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Voice & Media Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {/* Voice Button */}
                      <button
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onMouseLeave={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
                        className={`
                          p-4 rounded-xl border-2 border-dashed
                          flex flex-col items-center gap-2
                          transition-all duration-150
                          ${isRecording 
                            ? 'border-red-400 bg-red-50 text-red-600' 
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 text-gray-600'
                          }
                        `}
                      >
                        <Mic className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`} />
                        <span className="text-xs font-medium">
                          {isRecording ? formatTime(recordingTime) : 'Hold to Talk'}
                        </span>
                      </button>

                      {/* Photo/Video Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 flex flex-col items-center gap-2 text-gray-600 transition-all duration-150"
                      >
                        <Camera className="w-6 h-6" />
                        <span className="text-xs font-medium">Photo/Video</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                {/* Compose Area */}
                {selectedAction && (
                  <div className="space-y-3">
                    {/* Back Button */}
                    <button
                      onClick={() => resetForm()}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      ← Back
                    </button>

                    {/* Selected Type Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${QUICK_ACTIONS[selectedAction].bgColor} text-white text-sm`}>
                      <span>{QUICK_ACTIONS[selectedAction].emoji}</span>
                      <span>{QUICK_ACTIONS[selectedAction].label}</span>
                    </div>

                    {/* Media Preview */}
                    {mediaPreview && (
                      <div className="relative">
                        {mediaFile?.type.startsWith('video') ? (
                          <video src={mediaPreview} className="w-full rounded-lg" controls />
                        ) : (
                          <img src={mediaPreview} className="w-full rounded-lg" alt="Preview" />
                        )}
                        <button
                          onClick={() => {
                            setMediaFile(null);
                            setMediaPreview(null);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}

                    {/* Audio Preview */}
                    {audioUrl && (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                        <Volume2 className="w-4 h-4 text-gray-500" />
                        <audio src={audioUrl} controls className="flex-1 h-8" />
                        <button
                          onClick={() => {
                            setAudioBlob(null);
                            setAudioUrl(null);
                          }}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}

                    {/* Text Input */}
                    <textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={QUICK_ACTIONS[selectedAction].placeholder}
                      className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      rows={3}
                      maxLength={500}
                    />

                    {/* Quick Prompts */}
                    <div className="flex flex-wrap gap-2">
                      {QUICK_ACTIONS[selectedAction].prompts.slice(0, 2).map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => setContent(prompt)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    {/* Post Button */}
                    <button
                      onClick={handlePost}
                      disabled={(!content.trim() && !mediaFile && !audioBlob) || createPost.isPending || isUploading}
                      className={`
                        w-full py-3 rounded-xl font-medium
                        flex items-center justify-center gap-2
                        transition-all duration-150
                        ${(content.trim() || mediaFile || audioBlob)
                          ? `${QUICK_ACTIONS[selectedAction].bgColor} text-white hover:opacity-90 active:scale-[0.98]`
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {(createPost.isPending || isUploading || isTranscribing) ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {isTranscribing ? 'Transcribing...' : 'Sharing...'}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Share with Community
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      {content.length}/500 characters
                    </p>
                  </div>
                )}
              </div>

              {/* Footer - View Full Community */}
              <div className="border-t border-gray-100 p-3">
                <a
                  href="/community"
                  className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  View Full Community
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
