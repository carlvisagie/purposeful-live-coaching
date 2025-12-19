/**
 * REALTIME VOICE ROUTER
 * 
 * Enables true real-time voice conversation with AI Coach using OpenAI Realtime API.
 * Uses WebRTC for browser connections (recommended by OpenAI for consistent performance).
 * 
 * This creates a WebRTC-based voice session where:
 * - User speaks through microphone
 * - AI hears in real-time (streaming audio)
 * - AI responds immediately through speakers/headset
 * - AI can interrupt when user says something wrong
 * 
 * Updated December 2024 to use correct GA API session configuration format.
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";

// Session configuration for different coaching modes
const COACHING_INSTRUCTIONS: Record<string, string> = {
  speaker_training: `You are a real-time speaking coach in the user's ear. Your job is to help them become a powerful, authoritative speaker.

LISTEN ACTIVELY and respond IMMEDIATELY when you notice:
- Filler words (um, uh, like, you know) - INTERRUPT and say "No filler words. Start again."
- Speaking too fast - Say "Slow down. Breathe."
- Hedging language (I think, maybe, sort of) - Say "Be definitive. Say it with conviction."
- Trailing off - Say "Finish strong. Complete your thought."
- Good delivery - Say "Good. Keep that energy."

Be direct, concise, and immediate. You're a coach, not a friend. Short responses only.
When they're doing well, stay quiet and let them practice. Only speak when correction is needed or to encourage.`,

  interview_prep: `You are a real-time interview coach helping the user prepare for a Senior Maintenance Manager position in aviation.

LISTEN to their answers and provide IMMEDIATE feedback:
- If they're vague, say "Be specific. Give an example."
- If they use weak language, say "More authority. You're the expert."
- If they ramble, say "Concise. Get to the point."
- If they miss key points, say "Mention [specific thing]."
- If they nail it, say "Strong answer. Next question."

Key topics they should hit:
- Accountable Manager authority
- ADs are mandatory, SBs conditionally mandatory
- QC finds defects, QA prevents them
- Safety before schedule - always
- Documentation discipline

Be direct and coaching-focused. Help them sound like a leader.`,

  coaching_practice: `You are helping the user practice being a wellness coach. Listen to how they coach and provide feedback:
- If they give advice instead of asking questions, say "Ask, don't tell."
- If they interrupt, say "Let them finish."
- If they're judgmental, say "Stay neutral. No judgment."
- If they're doing well, say "Good technique."

Help them become a better coach through real-time correction.`,

  compliance_monitor: `You are a compliance monitor for a wellness coaching session. Your job is to IMMEDIATELY stop the user if they say anything that could be:
- Medical advice - INTERRUPT: "Stop. That's medical advice. Refer to a doctor."
- Diagnosis - INTERRUPT: "Stop. You cannot diagnose. Suggest they see a professional."
- Legal advice - INTERRUPT: "Stop. That's legal advice. Refer to a lawyer."
- Harmful content - INTERRUPT: "Stop. Rephrase that safely."

Be vigilant and immediate. Patient safety comes first.`,

  singing: `You are a vocal coach helping the user improve their singing. Listen and provide real-time feedback:
- Pitch issues - "You're flat/sharp. Adjust."
- Breath support - "Breathe from your diaphragm."
- Tension - "Relax your jaw/throat."
- Good moments - "Beautiful tone. Keep it."

Be encouraging but honest. Help them improve.`,
};

export const realtimeVoiceRouter = router({
  /**
   * Create a WebRTC session using the unified interface
   * Client sends SDP offer, server returns SDP answer
   */
  createWebRTCSession: publicProcedure
    .input(z.object({
      sdp: z.string(), // Client's SDP offer
      mode: z.enum(["speaker_training", "interview_prep", "coaching_practice", "compliance_monitor", "singing"]),
      voice: z.enum(["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse", "marin"]).default("coral"),
    }))
    .mutation(async ({ input }) => {
      const { sdp, mode, voice } = input;
      
      try {
        // Create session config using the CORRECT format from OpenAI GA API docs
        // Note: audio.input.transcription and turn_detection are nested under audio.input
        const sessionConfig = JSON.stringify({
          type: "realtime",
          model: "gpt-realtime",
          instructions: COACHING_INSTRUCTIONS[mode] || COACHING_INSTRUCTIONS.speaker_training,
          audio: {
            input: {
              transcription: {
                model: "whisper-1",
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500,
              },
            },
            output: {
              voice: voice,
            },
          },
        });

        // Create FormData with SDP and session config
        const formData = new FormData();
        formData.set("sdp", sdp);
        formData.set("session", sessionConfig);

        // Call OpenAI's unified interface endpoint
        const response = await fetch("https://api.openai.com/v1/realtime/calls", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("[Realtime WebRTC] Session creation failed:", error);
          throw new Error(`Failed to create realtime session: ${response.statusText} - ${error}`);
        }

        // Return the SDP answer from OpenAI
        const sdpAnswer = await response.text();
        
        return {
          sdp: sdpAnswer,
          mode: mode,
          voice: voice,
        };
      } catch (error) {
        console.error("[Realtime WebRTC] Error:", error);
        throw new Error("Failed to initialize realtime voice session");
      }
    }),

  /**
   * Legacy: Get a session token for ephemeral key method (fallback)
   * This uses the client_secrets endpoint for direct WebRTC connection
   */
  getSessionToken: publicProcedure
    .input(z.object({
      mode: z.enum(["speaker_training", "interview_prep", "coaching_practice", "compliance_monitor", "singing"]),
      voice: z.enum(["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse", "marin"]).default("coral"),
    }))
    .mutation(async ({ input }) => {
      const { mode, voice } = input;
      
      try {
        // Create session config using the CORRECT format from OpenAI GA API docs
        const sessionConfig = {
          session: {
            type: "realtime",
            model: "gpt-realtime",
            instructions: COACHING_INSTRUCTIONS[mode] || COACHING_INSTRUCTIONS.speaker_training,
            audio: {
              input: {
                transcription: {
                  model: "whisper-1",
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 500,
                },
              },
              output: {
                voice: voice,
              },
            },
          },
        };

        // Create ephemeral token for client-side connection
        const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionConfig),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("[Realtime] Session creation failed:", error);
          throw new Error(`Failed to create realtime session: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
          clientSecret: data.value,
          expiresAt: data.expires_at,
          voice: voice,
          mode: mode,
        };
      } catch (error) {
        console.error("[Realtime] Error:", error);
        throw new Error("Failed to initialize realtime voice session");
      }
    }),

  /**
   * Get available voices for the realtime API
   */
  getVoices: publicProcedure.query(() => {
    return [
      { id: "coral", name: "Coral", description: "Warm, professional female voice - recommended for coaching" },
      { id: "marin", name: "Marin", description: "Clear, articulate voice - great for instructions" },
      { id: "sage", name: "Sage", description: "Calm, wise female voice" },
      { id: "alloy", name: "Alloy", description: "Neutral, balanced voice" },
      { id: "echo", name: "Echo", description: "Warm male voice" },
      { id: "shimmer", name: "Shimmer", description: "Bright, energetic female voice" },
      { id: "ash", name: "Ash", description: "Direct, confident voice" },
      { id: "ballad", name: "Ballad", description: "Soft, gentle voice" },
      { id: "verse", name: "Verse", description: "Dynamic, expressive voice" },
    ];
  }),

  /**
   * Get coaching modes available for realtime voice
   */
  getModes: publicProcedure.query(() => {
    return [
      { 
        id: "speaker_training", 
        name: "Speaker Training", 
        description: "Real-time feedback on your speaking presence, filler words, and delivery",
        icon: "🎤",
      },
      { 
        id: "interview_prep", 
        name: "Interview Prep", 
        description: "Practice interview answers with immediate coaching feedback",
        icon: "💼",
      },
      { 
        id: "coaching_practice", 
        name: "Coaching Practice", 
        description: "Practice your coaching skills with real-time technique feedback",
        icon: "💬",
      },
      { 
        id: "compliance_monitor", 
        name: "Compliance Monitor", 
        description: "AI monitors your coaching for compliance issues in real-time",
        icon: "🛡️",
      },
      { 
        id: "singing", 
        name: "Singing Coach", 
        description: "Real-time vocal coaching and feedback",
        icon: "🎵",
      },
    ];
  }),
});
