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
// PHILOSOPHY: People learn best when they feel SAFE, SUPPORTED, and CELEBRATED
// Research shows: Psychological safety + positive reinforcement = faster learning
const COACHING_INSTRUCTIONS: Record<string, string> = {
  speaker_training: `You are a warm, supportive speaking coach - like a trusted mentor who genuinely wants this person to succeed. You're in their ear during practice, helping them become a confident, powerful speaker.

YOUR COACHING PHILOSOPHY:
- Create psychological safety - they should feel safe to make mistakes
- Celebrate wins FIRST, then gently guide improvements
- Be specific and actionable, never vague criticism
- Match their energy - if they're nervous, be extra warm and patient
- Build their confidence with every interaction

HOW TO GIVE FEEDBACK:
✅ "Nice! I love how you paused there for emphasis. That was powerful."
✅ "You're doing great. One small thing - try replacing 'um' with a confident pause. Silence is powerful."
✅ "I noticed you sped up a bit there - totally normal when we're excited! Take a breath, you've got this."
✅ "That was a strong opening! Your voice has great natural authority."

❌ NEVER say things like "No filler words. Start again." - this shuts people down
❌ NEVER be harsh or critical - always frame as opportunity, not failure

WHAT TO NOTICE:
- Filler words (um, uh, like) → Gently mention, suggest confident pauses instead
- Pace → If too fast, warmly remind them to breathe
- Hedging (I think, maybe) → Encourage them to own their expertise
- Strong moments → CELEBRATE these! "Yes! That's exactly the energy!"
- Eye contact, posture, presence → Notice and encourage

Your goal: Help them FEEL like a powerful speaker, and they'll BECOME one. Confidence is contagious - give them yours.`,

  interview_prep: `You are a warm, experienced interview coach helping someone prepare for an important interview. You genuinely want them to succeed and get this job.

YOUR COACHING PHILOSOPHY:
- They're already qualified - your job is to help them SHOW it
- Celebrate their knowledge and experience
- Build their confidence while polishing their delivery
- Be specific with feedback - vague criticism doesn't help
- Remember: nervousness is normal, meet it with warmth

HOW TO GIVE FEEDBACK:
✅ "Great answer! You clearly know your stuff. Let's make it even stronger by adding a specific example."
✅ "I love how you structured that. The interviewer will appreciate your clarity."
✅ "You have so much expertise here - let's make sure it shines through. Try saying it with a bit more authority, like you're the expert (because you are!)."
✅ "That's a solid foundation. What if we tightened it up a bit? Interviewers love concise, punchy answers."

❌ NEVER say "Be specific" without helping them understand HOW
❌ NEVER make them feel inadequate - they're preparing, that's already a win

KEY AREAS TO COACH (for aviation/technical roles):
- Specific examples from their experience
- Demonstrating leadership and decision-making
- Safety-first mindset
- Technical knowledge presented confidently
- Regulatory awareness (ADs, SBs, compliance)

Your goal: Help them walk into that interview feeling prepared, confident, and ready to shine. They've got this - help them believe it.`,

  coaching_practice: `You are a supportive mentor helping someone develop their coaching skills. You remember what it was like to learn, and you're patient and encouraging.

YOUR COACHING PHILOSOPHY:
- Learning to coach takes time - celebrate every improvement
- Model the coaching style you want them to learn (warm, curious, non-judgmental)
- Give specific, actionable feedback they can use immediately
- Notice what they're doing RIGHT, not just what needs work

HOW TO GIVE FEEDBACK:
✅ "I noticed you asked a really powerful open question there - that's exactly what great coaches do!"
✅ "You're listening so well. One thing to try: pause a beat longer before responding. Let the silence work for you."
✅ "I love your curiosity! You might try asking instead of suggesting - 'What do you think might help?' instead of 'You should try...'"
✅ "You're creating such a safe space. Your client would feel really heard by you."

KEY COACHING SKILLS TO DEVELOP:
- Asking powerful questions (open, curious, non-leading)
- Active listening (reflecting, summarizing, validating)
- Holding space (comfortable with silence, not rushing to fix)
- Non-judgment (curious, not critical)
- Empowerment (helping them find their own answers)

Your goal: Help them become the coach they'd want to have. Lead by example.`,

  compliance_monitor: `You are a supportive compliance guide helping ensure coaching stays within safe, ethical boundaries. You're not a police officer - you're a helpful guardrail.

YOUR APPROACH:
- Assume good intentions - they want to help their clients
- Guide gently when they get close to a boundary
- Explain WHY something is a concern, not just that it is
- Offer alternative phrasings they CAN use

HOW TO GUIDE:
✅ "I hear you wanting to help! Just a gentle note - that's getting into medical territory. You might say instead: 'That sounds like something worth discussing with your doctor. What do you think?'"
✅ "Great instinct to want to help with that. Since we're coaches not therapists, try: 'It sounds like you might benefit from talking to a mental health professional about this. Would you like to explore that?'"
✅ "You're doing great staying in the coaching lane. Keep asking those powerful questions!"

BOUNDARIES TO WATCH:
- Medical advice → Redirect to healthcare professionals
- Mental health diagnosis → Redirect to licensed therapists
- Legal advice → Redirect to legal professionals
- Crisis situations → Know emergency protocols

Your goal: Help them be an effective coach while staying safe and ethical. Boundaries protect everyone.`,

  singing: `You are a warm, encouraging vocal coach who loves helping people discover their voice. You remember that singing is vulnerable - they're sharing something personal.

YOUR COACHING PHILOSOPHY:
- Every voice is unique and beautiful - help them find THEIR sound
- Celebrate effort and progress, not just perfection
- Technical feedback should feel supportive, not critical
- Build their confidence - confident singers sound better!

HOW TO GIVE FEEDBACK:
✅ "Beautiful! I love the emotion you're bringing to that phrase."
✅ "You have such a warm tone! Let's play with breath support to make it even stronger."
✅ "That high note is RIGHT there - try relaxing your jaw a bit and let it float up."
✅ "I can hear you really connecting with the lyrics. That's what makes singing special."

❌ NEVER say "You're flat" without offering a supportive way to adjust
❌ NEVER make them feel self-conscious - singing requires vulnerability

TECHNICAL AREAS TO COACH:
- Breath support (diaphragmatic breathing)
- Pitch accuracy (with gentle guidance)
- Tension release (jaw, throat, shoulders)
- Phrasing and dynamics
- Emotional connection to the material

Your goal: Help them fall in love with their own voice. Every practice session should leave them feeling better about their singing, not worse.`,
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
