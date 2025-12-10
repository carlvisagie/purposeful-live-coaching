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
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LOGIN_URL } from "@/const";
import { Streamdown } from "streamdown";
import { useLocation } from "wouter";
import { ConversationRating } from "@/components/ConversationRating";
import { AIDisclosureDialog, useAIDisclosureReminder } from "@/components/AIDisclosureDialog";
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
  const { user, loading: authLoading } = useAuth();
  
  // Show AI disclosure dialog (CA/NY law compliance)
  useAIDisclosureReminder();
  const [, setLocation] = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check subscription status
  const { data: subscription, isLoading: subscriptionLoading } = 
    trpc.subscriptions.getMySubscription.useQuery(undefined, {
      enabled: !!user,
    });

  // Fetch conversations list
  const { data: conversationsData, refetch: refetchConversations } =
    trpc.aiChat.listConversations.useQuery(undefined, {
      enabled: !!user,
    });

  // Fetch selected conversation messages
  const { data: conversationData, refetch: refetchMessages } =
    trpc.aiChat.getConversation.useQuery(
      { conversationId: selectedConversationId! },
      { enabled: !!selectedConversationId }
    );

  // Track usage mutation
  const trackUsageMutation = trpc.subscriptions.trackAiSession.useMutation();

  // Mutations
  const createConversationMutation = trpc.aiChat.createConversation.useMutation({
    onSuccess: async (data) => {
      setSelectedConversationId(data.conversationId);
      refetchConversations();
      toast.success("New conversation started");
      
      // Track AI session usage for subscription
      try {
        await trackUsageMutation.mutateAsync({ conversationId: data.conversationId });
      } catch (error) {
        // Silently fail - don't block user if tracking fails
        console.error("Failed to track usage:", error);
      }
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
      if (data.crisisFlag === "critical" || data.crisisFlag === "high") {
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

  const handleNewConversation = () => {
    createConversationMutation.mutate({});
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

  const conversations = conversationsData?.conversations || [];
  const messages = conversationData?.messages || [];

  return (
    <>
      <AIDisclosureDialog />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-rose-500" />
                <span className="text-xl font-bold text-gray-900">AI Coach</span>
              </div>
              <Button variant="ghost" onClick={() => (window.location.href = "/dashboard")}>
                Back to Dashboard
              </Button>
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
                  disabled={createConversationMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Click + to start chatting</p>
                </div>
              ) : (
                conversations.map((conv) => (
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
                      <h3 className="text-lg font-semibold mb-2">Hi, I'm your AI coach!</h3>
                      <p className="text-sm max-w-md mx-auto">
                        I'm here to listen and support you 24/7. Share what's on your mind, and
                        let's work through it together.
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

                {/* Conversation Rating - Show after messages */}
                {messages.length > 0 && (
                  <div className="border-t border-gray-200 p-4">
                    <ConversationRating 
                      conversationId={selectedConversationId}
                      onRatingSubmitted={() => refetchConversations()}
                    />
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                      className="flex-1 min-h-[60px] max-h-[200px]"
                      disabled={isSending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
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
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation or start a new one</p>
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
