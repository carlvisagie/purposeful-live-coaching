/**
 * Just Talk - 24/7 Emotional Support AI
 * 
 * Unlike coaching mode, this is purely for emotional support:
 * - No goals or action items
 * - Just listening and empathy
 * - Available anytime
 * - Like talking to a supportive friend
 * 
 * Research: Wysa and Headspace's "Ebb" prove demand for always-available emotional support
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, Send, Mic, MicOff, Phone, PhoneOff, 
  Sparkles, Moon, Sun, Cloud, Loader2, Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mood?: string;
}

// Empathetic responses for different emotional states
const EMPATHY_STARTERS = {
  sad: [
    "I hear you, and I'm here with you in this.",
    "That sounds really difficult. Thank you for sharing that with me.",
    "It takes courage to talk about how you're feeling. I'm listening.",
  ],
  anxious: [
    "I can sense you're feeling overwhelmed. Let's take this moment together.",
    "Anxiety can feel so heavy. You don't have to carry it alone right now.",
    "Whatever you're feeling is valid. I'm here to listen.",
  ],
  angry: [
    "It sounds like you're going through something really frustrating.",
    "Those feelings make sense given what you're experiencing.",
    "I hear the frustration in your words. Tell me more.",
  ],
  lonely: [
    "I'm here with you right now. You're not alone in this moment.",
    "Loneliness can be so painful. I'm glad you reached out.",
    "Even when it feels like no one understands, I'm here to listen.",
  ],
  neutral: [
    "I'm here whenever you need to talk.",
    "How are you feeling right now?",
    "Take your time. I'm listening.",
  ]
};

export default function JustTalk() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there. 💙 I'm here to listen, without judgment, without advice unless you want it. How are you feeling right now?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("neutral");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // tRPC mutation for chat
  const chatMutation = trpc.aiChat.sendMessage.useMutation({
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    },
    onError: () => {
      // Fallback to local empathetic response
      const responses = EMPATHY_STARTERS[currentMood as keyof typeof EMPATHY_STARTERS] || EMPATHY_STARTERS.neutral;
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: response + " Tell me more about what's on your mind.",
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Detect mood from message
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("sad") || lowerInput.includes("cry") || lowerInput.includes("depressed") || lowerInput.includes("hurt")) {
      setCurrentMood("sad");
    } else if (lowerInput.includes("anxious") || lowerInput.includes("worried") || lowerInput.includes("scared") || lowerInput.includes("panic")) {
      setCurrentMood("anxious");
    } else if (lowerInput.includes("angry") || lowerInput.includes("frustrated") || lowerInput.includes("mad") || lowerInput.includes("annoyed")) {
      setCurrentMood("angry");
    } else if (lowerInput.includes("lonely") || lowerInput.includes("alone") || lowerInput.includes("isolated")) {
      setCurrentMood("lonely");
    }

    // Send to AI with emotional support context
    try {
      await chatMutation.mutateAsync({
        message: input.trim(),
        context: "just-talk-emotional-support",
        systemPrompt: `You are a compassionate, empathetic listener providing emotional support. 
Your role is NOT to coach, advise, or fix problems. Your role is to:
- Listen deeply and reflect back what you hear
- Validate feelings without judgment
- Ask gentle, open-ended questions
- Be warm, present, and caring
- Use simple, heartfelt language
- Never rush to solutions unless explicitly asked
- Remember: sometimes people just need to be heard

Current detected mood: ${currentMood}
Respond with empathy and presence.`
      });
    } catch (error) {
      // Error handled in onError
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording would be implemented here
  };

  // Quick mood buttons
  const moodButtons = [
    { mood: "sad", emoji: "😢", label: "Sad" },
    { mood: "anxious", emoji: "😰", label: "Anxious" },
    { mood: "angry", emoji: "😤", label: "Frustrated" },
    { mood: "lonely", emoji: "😔", label: "Lonely" },
    { mood: "neutral", emoji: "😊", label: "Just want to talk" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-2xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Just Talk</h1>
          <p className="text-muted-foreground mt-1">
            I'm here to listen. No judgment, no advice unless you want it.
          </p>
        </div>

        {/* Mood Quick Select (shown at start) */}
        {messages.length <= 1 && (
          <Card className="mb-4 border-none shadow-sm bg-white/80 backdrop-blur">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                How are you feeling right now?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {moodButtons.map(({ mood, emoji, label }) => (
                  <Button
                    key={mood}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-2 transition-all",
                      currentMood === mood && "ring-2 ring-blue-400 bg-blue-50"
                    )}
                    onClick={() => {
                      setCurrentMood(mood);
                      setInput(`I'm feeling ${label.toLowerCase()}...`);
                      inputRef.current?.focus();
                    }}
                  >
                    <span className="text-lg">{emoji}</span>
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-lg bg-white/90 backdrop-blur">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        <Heart className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-700 rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1 opacity-60",
                      message.role === "user" ? "text-right" : ""
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-blue-500 text-white">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                      <Heart className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-white/50">
            {isVoiceMode ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  className={cn(
                    "w-20 h-20 rounded-full",
                    isRecording && "animate-pulse"
                  )}
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {isRecording ? "Listening... tap to stop" : "Tap to speak"}
                </p>
                <Button variant="ghost" size="sm" onClick={toggleVoiceMode}>
                  Switch to text
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share what's on your mind..."
                  className="min-h-[60px] max-h-[120px] resize-none bg-white"
                  rows={2}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="h-[60px] w-12"
                  >
                    {isTyping ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Mode toggle */}
            <div className="flex justify-center gap-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceMode}
                className="text-muted-foreground"
              >
                {isVoiceMode ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Type instead
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Voice mode
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Supportive Footer */}
        <div className="text-center py-4 text-sm text-muted-foreground">
          <p>
            Remember: You matter. If you're in crisis, please reach out to a{" "}
            <a href="tel:988" className="text-blue-500 hover:underline">
              crisis helpline (988)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
