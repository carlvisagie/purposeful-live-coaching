/**
 * Voice Coach Page
 * 
 * Dedicated page for real-time voice conversations with AI Coach.
 * Uses OpenAI Realtime API with WebRTC for natural voice interaction.
 */
import { OpenAIVoiceCoach } from "@/components/OpenAIVoiceCoach";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceCoach() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setLocation("/dashboard")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-white">Voice Coach</h1>
      </div>

      {/* Voice Coach Component */}
      <div className="container mx-auto px-4 py-8">
        <OpenAIVoiceCoach 
          mode="coaching_practice"
          showCliffsNotes={true}
        />
      </div>
    </div>
  );
}
