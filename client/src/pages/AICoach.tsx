import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  Plus,
  Trash2,
  AlertTriangle,
  Heart,
  Loader2,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientRecognition } from "@/hooks/useClientRecognition";
// Guest access enabled - no login required
import { Streamdown } from "streamdown";
import { useLocation } from "wouter";
import { ConversationRating } from "@/components/ConversationRating";
import { EmailCapturePrompt } from "@/components/EmailCapturePrompt";
// AI Disclosure removed per user request
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * AI Coaching Chat - 24/7 Emotional Support
 * Features:
 * - Real-time AI coaching conversations
 * - Crisis detection and alerts
 * - Conversation history
 * - Context-aware responses
 * - Beautiful, empathetic UI
 */
export default function AICoach() {
  const { user, isLoading: authLoading } = useAuth();
  
  /**
   * ⚠️ CRITICAL: CLIENT RECOGNITION SYSTEM - DO NOT REMOVE!
   * 
   * This is the MORAL FOUNDATION of our platform.
   * 
   * WHY THIS EXISTS:
   * - We have a MORAL OBLIGATION to help every person who reaches out
   * - We can't help people we lose to anonymity
   * - Instant recognition (voice/face) creates trust and continuity
   * - 110 people visited and left without help - THIS PREVENTS THAT
   * 
   * WHAT IT DOES:
   * 1. Recognizes returning clients instantly (0-3 words spoken)
   * 2. Greets them by name ("Welcome back, Sarah!")
   * 3. Creates unified profile for new visitors
   * 4. Enables Sage to convert visitors into family members
   * 
   * IF YOU REMOVE THIS:
   * - Clients will feel anonymous and disconnected
   * - Conversion rate will drop to near 0%
   * - We fail our moral obligation to help people
   * - 100+ people will visit and leave without getting help
   * 
   * LAST INCIDENT: Dec 27, 2025 - Recognition was disconnected
   * RESULT: 110 visitors, 0 conversions, 100% failure rate
   * 
   * DO NOT TOUCH THIS CODE WITHOUT OWNER APPROVAL.
   */
  const { 
    recognitionResult, 
    isRecognizing, 
    startRecognition,
    confirmRecognition,
    denyRecognition 
  } = useClientRecognition({
    enableVoice: true,
    enableFace: false, // Enable when video is added
    onRecognized: (result) => {
      console.log('[AICoach] Client recognized:', result);
      if (result.confidence >= 80) {
        toast.success(result.greeting, { duration: 5000 });
      }
    }
  });
  
  // Note: user is always null in frictionless mode, but backend tracks anonymous sessions
  
  // Frictionless platform - no compliance dialogs
  const [, setLocation] = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailPromptDismissed, setEmailPromptDismissed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("plc_user_email"));
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('plc_voice_enabled') === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Frictionless - no subscription required for AI chat
  const subscription = null;
  const subscriptionLoading = false;

  // Fetch conversations list - guest access enabled
  const { data: conversationsData, refetch: refetchConversations } =
    trpc.aiChat.listConversations.useQuery();
  
  // For anonymous users, track conversations in local state
  const [anonymousConversations, setAnonymousConversations] = useState<number[]>([]);
  
  // Combine server conversations with anonymous conversations
  const allConversations = conversationsData?.conversations || [];

  // Fetch usage stats for tier limits (works for anonymous users too)
  const { data: usageData } = trpc.subscriptions.getCurrentUsage.useQuery();
  
  // Usage data loaded from subscription API

  // Fetch selected conversation messages
  const { data: conversationData, refetch: refetchMessages } =
    trpc.aiChat.getConversation.useQuery(
      { conversationId: selectedConversationId! },
      { enabled: !!selectedConversationId }
    );

  // Track usage mutation (disabled - endpoint may not exist)
  // const trackUsageMutation = trpc.subscriptions.trackAiSession.useMutation();

  // Trial signup mutation
  const trialSignupMutation = trpc.trialSignup.updateTrialUser.useMutation();
  
  // Mutations
  const createConversationMutation = trpc.aiChat.createConversation.useMutation({
    onSuccess: async (data) => {
      setSelectedConversationId(data.conversationId);
      
      // Add to anonymous conversations if user not logged in
      if (!user) {
        setAnonymousConversations(prev => [data.conversationId, ...prev]);
      }
      
      await refetchConversations(); // Await to ensure sidebar updates
      toast.success("New conversation started");
      
      // Track AI session usage for subscription (disabled)
      // try {
      //   await trackUsageMutation.mutateAsync({ conversationId: data.conversationId });
      // } catch (error) {
      //   console.error("Failed to track usage:", error);
      // }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });

  const sendMessageMutation = trpc.aiChat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessage("");
      refetchMessages();
      
      // Show crisis alert if detected
      if ((data as any).crisisFlag === "critical" || (data as any).crisisFlag === "high") {
        toast.error("Crisis detected - Your coach has been notified", {
          duration: 10000,
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
    onSettled: () => {
      setIsSending(false);
    },
  });

  const deleteConversationMutation = trpc.aiChat.deleteConversation.useMutation({
    onSuccess: () => {
      setSelectedConversationId(null);
      refetchConversations();
      toast.success("Conversation deleted");
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete conversation");
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationData?.messages]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedConversationId && conversationsData?.conversations.length) {
      setSelectedConversationId(conversationsData.conversations[0].id);
    }
  }, [conversationsData, selectedConversationId]);

  // Process trial signup if pending
  useEffect(() => {
    const signupPending = localStorage.getItem('trial_signup_pending');
    if (signupPending === 'true') {
      const name = localStorage.getItem('trial_name');
      const email = localStorage.getItem('trial_email');
      const anonymousId = localStorage.getItem('plc_anonymous_id');
      
      if (name && email && anonymousId) {
        console.log('[AICoach] Processing trial signup...');
        trialSignupMutation.mutate(
          { anonymousId, name, email },
          {
            onSuccess: () => {
              console.log('[AICoach] Trial signup processed successfully');
              localStorage.removeItem('trial_signup_pending');
            },
            onError: (error) => {
              console.error('[AICoach] Trial signup failed:', error);
            }
          }
        );
      }
    }
  }, []);

  // AUTO-START: Create conversation immediately when page loads with no conversations
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [hasTriedRecognition, setHasTriedRecognition] = useState(false);
  
  useEffect(() => {
    // Only auto-start once, and only if no conversations exist
    if (!hasAutoStarted && conversationsData && conversationsData.conversations.length === 0 && !createConversationMutation.isPending) {
      setHasAutoStarted(true);
      console.log('[AICoach] Auto-starting first conversation for frictionless experience');
      createConversationMutation.mutate({});
      
      // Start client recognition immediately
      if (!hasTriedRecognition && !isRecognizing) {
        setHasTriedRecognition(true);
        console.log('[AICoach] Starting client recognition...');
        startRecognition();
      }
    }
  }, [conversationsData, hasAutoStarted, createConversationMutation.isPending, hasTriedRecognition, isRecognizing, startRecognition]);

  const handleNewConversation = () => {
    console.log('[AICoach] Creating new conversation...');
    createConversationMutation.mutate({});
    console.log('[AICoach] Mutation called, isPending:', createConversationMutation.isPending);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversationId || isSending) return;

    setIsSending(true);
    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      message: message.trim(),
    });
  };

  const handleDeleteConversation = (id: number) => {
    setConversationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (conversationToDelete) {
      deleteConversationMutation.mutate({ conversationId: conversationToDelete });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        // Upload to S3 and transcribe
        try {
          // Convert blob to base64 for upload
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(",")[1];
            
            // TODO: Upload to S3 and get URL
            // For now, we'll use a placeholder - need to implement S3 upload
            toast.info("Voice transcription coming soon! For now, please type your message.");
            setIsTranscribing(false);
            
            // Future implementation:
            // 1. Upload audio to S3
            // 2. Call transcription API with S3 URL
            // 3. Set transcribed text to message input
          };
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error("Failed to transcribe audio. Please try typing instead.");
          setIsTranscribing(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started. Click again to stop.");
    } catch (error) {
      console.error("Microphone access error:", error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  // Auth requirement disabled for demo mode
  // if (!authLoading && !user) {
  //   window.location.href = LOGIN_URL;
  //   return null;
  // }

  // Auth and subscription checks disabled for demo/development
  // if (authLoading || subscriptionLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
  //     </div>
  //   );
  // }

  // Subscription requirement disabled for demo
  if (false && (!subscription || subscription?.status !== 'active')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center">Subscription Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-rose-50 p-4 rounded-lg">
              <Heart className="h-12 w-12 text-rose-500 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">
                AI coaching requires an active subscription
              </p>
            </div>
            <p className="text-muted-foreground">
              Start your 7-day free trial to access 24/7 AI coaching support.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => setLocation("/pricing")}
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                View Pricing & Start Free Trial
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/subscription")}
                className="w-full"
              >
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show conversations from server OR current anonymous conversation
  const conversations = conversationsData?.conversations || [];
  
  // If anonymous user has active conversation, show it in sidebar
  const displayConversations = user ? conversations : (
    selectedConversationId ? [{
      id: selectedConversationId,
      title: conversationData?.conversation?.title || "Current Conversation",
      lastMessageAt: new Date().toISOString(),
      userId: null,
      clientId: null,
      createdAt: new Date().toISOString(),
      rating: null,
      ratingComment: null
    }] : []
  );
  const messages = conversationData?.messages || [];

  return (
    <>
      {/* AI Disclosure removed per user request */}
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-rose-500" />
                <span className="text-xl font-bold text-gray-900">Sage</span>
              </div>
              <div className="flex items-center gap-4">
                {/* Usage Counter & Tier Badge */}
                {usageData && (
                  <div className="flex items-center gap-3">
                    {/* Tier Badge */}
                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 to-purple-600 text-white">
                      {usageData.tierName || 'Basic'}
                    </div>
                    {/* Usage Counter */}
                    <div className="text-sm font-medium">
                      {usageData.messagesRemaining === -1 ? (
                        <span className="text-green-600">✨ Unlimited</span>
                      ) : (
                        <span className="text-gray-700">
                          <span className="font-bold">{usageData.messagesUsed}</span>
                          <span className="text-gray-500"> / {usageData.messageLimit}</span>
                          {usageData.messagesRemaining <= 10 && usageData.messagesRemaining > 0 && (
                            <span className="text-orange-600 ml-1 font-semibold">({usageData.messagesRemaining} left!)</span>
                          )}
                          {usageData.messagesRemaining === 0 && (
                            <span className="text-red-600 ml-1 font-semibold">(Limit reached)</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <Button variant="ghost" onClick={() => (window.location.href = "/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations Sidebar */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button
                  size="sm"
                  onClick={handleNewConversation}
                  disabled={false}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {usageData && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {usageData.messagesRemaining === -1 ? (
                    <span className="text-green-600 font-medium">✨ Unlimited messages</span>
                  ) : (
                    <span>
                      {usageData.messagesUsed} / {usageData.messageLimit} messages used
                      {usageData.messagesRemaining <= 10 && usageData.messagesRemaining > 0 && (
                        <span className="text-orange-600 ml-1">({usageData.messagesRemaining} left)</span>
                      )}
                    </span>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
              {displayConversations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50 animate-pulse" />
                  <p className="text-sm">Starting your conversation with Sage...</p>
                  <p className="text-xs mt-1 text-rose-500">Just a moment...</p>
                </div>
              ) : (
                displayConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                      selectedConversationId === conv.id
                        ? "bg-rose-100 border-2 border-rose-300"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedConversationId(conv.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conv.title || "New Conversation"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col">
            {selectedConversationId ? (
              <>
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <Bot className="h-16 w-16 mx-auto mb-4 text-rose-400" />
                      <h3 className="text-lg font-semibold mb-2 text-rose-600">Hey there 💜 I'm Sage</h3>
                      <p className="text-sm max-w-md mx-auto text-gray-600">
                        I'm genuinely glad you're here. Whatever brought you to me today—whether it's something heavy on your mind, a goal you're chasing, or just needing someone to talk to—I'm all ears.
                      </p>
                      <p className="text-sm max-w-md mx-auto mt-3 text-gray-500 italic">
                        No judgment, no agenda. Just you and me. What's on your heart right now?
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-4 ${
                            msg.role === "user"
                              ? "bg-rose-500 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          {msg.crisisFlag && msg.crisisFlag !== "none" && (
                            <div className="flex items-center gap-2 mb-2 text-red-600 font-semibold">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-xs">Crisis Alert</span>
                            </div>
                          )}
                          <div className={msg.role === "user" ? "text-white" : "text-gray-900"}>
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                          <p className="text-xs mt-2 opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        {msg.role === "user" && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Smart Email Capture - Show after 5+ messages if not captured */}
                {messages.length >= 5 && !emailPromptDismissed && !userEmail && (
                  <EmailCapturePrompt
                    messageCount={messages.length}
                    onDismiss={() => setEmailPromptDismissed(true)}
                    onEmailCaptured={(email) => setUserEmail(email)}
                  />
                )}

                {/* Conversation Rating - Show after messages */}
                {messages.length > 0 && (
                  <div className="border-t border-gray-200 p-4">
                    <ConversationRating 
                      conversationId={selectedConversationId}
                      onRatingSubmitted={() => refetchConversations()}
                    />
                  </div>
                )}

                {/* Upgrade Prompt Banner */}
                {usageData && usageData.messagesRemaining !== -1 && usageData.messagesRemaining <= 20 && (
                  <div className={`border-t p-4 ${
                    usageData.messagesRemaining === 0 
                      ? 'bg-red-50 border-red-200' 
                      : usageData.messagesRemaining <= 10
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {usageData.messagesRemaining === 0 ? (
                          <>
                            <p className="text-sm font-semibold text-red-900">🚫 Message limit reached</p>
                            <p className="text-xs text-red-700 mt-1">Upgrade to continue chatting with your AI coach</p>
                          </>
                        ) : usageData.messagesRemaining <= 10 ? (
                          <>
                            <p className="text-sm font-semibold text-orange-900">⚠️ Only {usageData.messagesRemaining} messages left</p>
                            <p className="text-xs text-orange-700 mt-1">Upgrade now to avoid interruption</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-yellow-900">💡 {usageData.messagesRemaining} messages remaining</p>
                            <p className="text-xs text-yellow-700 mt-1">Upgrade for unlimited access</p>
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => (window.location.href = "/pricing")}
                        className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                      >
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={isRecording ? "Recording..." : "Type your message... (Press Enter to send, Shift+Enter for new line)"}
                      className="flex-1 min-h-[60px] max-h-[200px]"
                      disabled={isSending || isRecording || isTranscribing}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleVoiceInput}
                        disabled={isSending || isTranscribing}
                        variant={isRecording ? "destructive" : "outline"}
                        title={isRecording ? "Stop recording" : "Voice input"}
                      >
                        {isTranscribing ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isRecording ? (
                          <MicOff className="h-5 w-5 animate-pulse" />
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSending || isRecording || isTranscribing}
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        {isSending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 This AI coach provides support, but is not a replacement for professional
                    therapy. If you're in crisis, call 988 (Suicide & Crisis Lifeline).
                  </p>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-rose-400 animate-pulse" />
                  <p className="text-rose-600 font-medium">Sage is getting ready to chat with you...</p>
                  <p className="text-sm text-gray-500 mt-2">Just a moment while we set things up</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its messages. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}
