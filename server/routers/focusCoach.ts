import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import OpenAI from "openai";
import SelfLearning from "../selfLearningIntegration";

const openai = new OpenAI();

/**
 * AI Focus Coach - 10X Better Than Headspace Focus
 * 
 * What Headspace has: Static lo-fi music and binaural beats
 * What we have: AI-powered focus sessions that:
 * - Voice coach guides you through Pomodoro technique
 * - Adaptive soundscapes that mix based on preferences
 * - Micro-meditation breaks between focus sessions
 * - Track focus patterns and optimize recommendations
 * - Real-time encouragement and accountability
 */

// Focus session types
const FOCUS_MODES = {
  deep_work: {
    name: "Deep Work",
    description: "Extended focus for complex tasks",
    defaultDuration: 50,
    breakDuration: 10,
    soundscape: "ambient",
    guidance: "minimal"
  },
  pomodoro: {
    name: "Pomodoro",
    description: "Classic 25/5 technique",
    defaultDuration: 25,
    breakDuration: 5,
    soundscape: "lofi",
    guidance: "moderate"
  },
  sprint: {
    name: "Focus Sprint",
    description: "Short intense focus burst",
    defaultDuration: 15,
    breakDuration: 3,
    soundscape: "energizing",
    guidance: "encouraging"
  },
  flow: {
    name: "Flow State",
    description: "Uninterrupted creative work",
    defaultDuration: 90,
    breakDuration: 15,
    soundscape: "binaural",
    guidance: "minimal"
  },
  study: {
    name: "Study Session",
    description: "Learning and retention focused",
    defaultDuration: 45,
    breakDuration: 10,
    soundscape: "nature",
    guidance: "supportive"
  }
};

// Soundscape categories
const SOUNDSCAPES = {
  lofi: {
    name: "Lo-Fi Beats",
    description: "Chill hip-hop beats for focus",
    tracks: ["lofi_study_1", "lofi_chill_2", "lofi_rain_3"]
  },
  binaural: {
    name: "Binaural Beats",
    description: "Alpha/Beta waves for concentration",
    tracks: ["alpha_focus", "beta_concentration", "gamma_peak"]
  },
  nature: {
    name: "Nature Sounds",
    description: "Forest, rain, and ocean ambience",
    tracks: ["forest_morning", "gentle_rain", "ocean_waves"]
  },
  ambient: {
    name: "Ambient",
    description: "Atmospheric soundscapes",
    tracks: ["space_ambient", "deep_focus", "ethereal_calm"]
  },
  energizing: {
    name: "Energizing",
    description: "Uplifting instrumental music",
    tracks: ["morning_energy", "momentum", "breakthrough"]
  },
  silence: {
    name: "Silence",
    description: "No background audio",
    tracks: []
  }
};

// Break activity types
const BREAK_ACTIVITIES = [
  {
    id: "breathing",
    name: "Box Breathing",
    duration: 2,
    description: "4-4-4-4 breathing pattern to reset"
  },
  {
    id: "stretch",
    name: "Desk Stretches",
    duration: 3,
    description: "Quick stretches for neck, shoulders, and back"
  },
  {
    id: "eyes",
    name: "Eye Rest",
    duration: 1,
    description: "20-20-20 rule for eye strain relief"
  },
  {
    id: "meditation",
    name: "Micro-Meditation",
    duration: 3,
    description: "Brief mindfulness reset"
  },
  {
    id: "movement",
    name: "Quick Movement",
    duration: 2,
    description: "Light movement to boost energy"
  },
  {
    id: "hydration",
    name: "Hydration Break",
    duration: 1,
    description: "Reminder to drink water"
  }
];

export const focusCoachRouter = router({
  // Get available focus modes and options
  getOptions: publicProcedure.query(() => {
    return {
      modes: Object.entries(FOCUS_MODES).map(([id, mode]) => ({
        id,
        ...mode
      })),
      soundscapes: Object.entries(SOUNDSCAPES).map(([id, soundscape]) => ({
        id,
        name: soundscape.name,
        description: soundscape.description
      })),
      breakActivities: BREAK_ACTIVITIES
    };
  }),

  // Start a focus session
  startSession: protectedProcedure
    .input(z.object({
      mode: z.enum(["deep_work", "pomodoro", "sprint", "flow", "study"]).default("pomodoro"),
      customDuration: z.number().min(5).max(120).optional(),
      soundscape: z.enum(["lofi", "binaural", "nature", "ambient", "energizing", "silence"]).optional(),
      task: z.string().optional(),
      goal: z.string().optional(),
      enableVoiceCoach: z.boolean().default(true)
    }))
    .mutation(async ({ input, ctx }) => {
      const mode = FOCUS_MODES[input.mode];
      const duration = input.customDuration || mode.defaultDuration;
      const soundscape = input.soundscape || mode.soundscape;

      // Generate opening message from AI coach
      let openingMessage = "";
      if (input.enableVoiceCoach) {
        const prompt = `You are a supportive focus coach helping someone start a ${duration}-minute ${mode.name} session.
${input.task ? `They're working on: ${input.task}` : ""}
${input.goal ? `Their goal: ${input.goal}` : ""}

Generate a brief (2-3 sentences), warm, encouraging message to start their session. 
Be supportive but not cheesy. Acknowledge their intention and set them up for success.
End with a simple "Let's begin."`;

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 150
          });
          openingMessage = completion.choices[0]?.message?.content || "";
        } catch (error) {
          openingMessage = `Let's begin your ${duration}-minute ${mode.name} session. You've got this. Let's begin.`;
        }
      }

      return {
        success: true,
        session: {
          id: `focus_${Date.now()}`,
          mode: input.mode,
          modeName: mode.name,
          duration,
          breakDuration: mode.breakDuration,
          soundscape,
          soundscapeName: SOUNDSCAPES[soundscape as keyof typeof SOUNDSCAPES]?.name || "None",
          task: input.task,
          goal: input.goal,
          startedAt: new Date().toISOString(),
          voiceCoachEnabled: input.enableVoiceCoach
        },
        openingMessage,
        tips: [
          "Put your phone on Do Not Disturb",
          "Close unnecessary browser tabs",
          "Have water nearby",
          "Trust the process"
        ]
      };
    }),

  // Get mid-session encouragement
  getMidSessionMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      minutesRemaining: z.number(),
      task: z.string().optional(),
      feeling: z.enum(["focused", "distracted", "tired", "energized"]).optional()
    }))
    .mutation(async ({ input }) => {
      const prompt = `You are a supportive focus coach. Someone is ${input.minutesRemaining} minutes into their focus session.
${input.task ? `They're working on: ${input.task}` : ""}
${input.feeling ? `They're feeling: ${input.feeling}` : ""}

Generate a brief (1-2 sentences) encouraging message appropriate for their state.
- If focused: brief acknowledgment, don't interrupt flow
- If distracted: gentle redirect without judgment
- If tired: compassionate encouragement
- If energized: celebrate their momentum

Keep it natural and supportive.`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 100
        });
        return {
          success: true,
          message: completion.choices[0]?.message?.content || ""
        };
      } catch (error) {
        return {
          success: true,
          message: "You're doing great. Keep going."
        };
      }
    }),

  // Generate break guidance
  generateBreakGuidance: protectedProcedure
    .input(z.object({
      breakType: z.enum(["breathing", "stretch", "eyes", "meditation", "movement", "hydration"]),
      breakDuration: z.number()
    }))
    .mutation(async ({ input }) => {
      const activity = BREAK_ACTIVITIES.find(a => a.id === input.breakType);
      
      const guidancePrompts: Record<string, string> = {
        breathing: `Guide a ${input.breakDuration}-minute box breathing exercise. 
Format: Step-by-step with timing cues.
- Breathe in for 4 counts
- Hold for 4 counts  
- Breathe out for 4 counts
- Hold for 4 counts
Include 3-4 cycles with gentle encouragement between.`,
        
        stretch: `Guide a ${input.breakDuration}-minute desk stretch routine.
Include: neck rolls, shoulder shrugs, wrist circles, seated twist.
Format: Step-by-step with timing. Keep it simple and doable at a desk.`,
        
        eyes: `Guide the 20-20-20 eye rest exercise.
- Look at something 20 feet away
- For 20 seconds
- Blink 20 times
Include gentle reminders about screen breaks.`,
        
        meditation: `Guide a ${input.breakDuration}-minute micro-meditation.
Focus on: Present moment awareness, releasing tension, resetting focus.
Keep it simple and grounding.`,
        
        movement: `Guide a ${input.breakDuration}-minute quick movement break.
Include: Standing, light stretching, maybe walking in place.
Keep energy up but not exhausting.`,
        
        hydration: `Create a brief hydration reminder.
Include: Benefits of staying hydrated for focus.
Encourage drinking water mindfully.`
      };

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ 
            role: "user", 
            content: `You are a wellness coach guiding a focus break. ${guidancePrompts[input.breakType]}
            
Keep the tone warm and supportive. This is a break from focused work.` 
          }],
          temperature: 0.7,
          max_tokens: 500
        });
        
        return {
          success: true,
          activity: activity,
          guidance: completion.choices[0]?.message?.content || ""
        };
      } catch (error) {
        return {
          success: true,
          activity: activity,
          guidance: `Take a moment to ${activity?.description.toLowerCase()}. You've earned this break.`
        };
      }
    }),

  // Complete session and get summary
  completeSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      actualDuration: z.number(),
      task: z.string().optional(),
      goal: z.string().optional(),
      distractionCount: z.number().default(0),
      completedTask: z.boolean().default(false),
      energyLevel: z.enum(["low", "medium", "high"]).optional(),
      focusQuality: z.enum(["poor", "fair", "good", "excellent"]).optional()
    }))
    .mutation(async ({ input }) => {
      // Generate personalized completion message
      const prompt = `You are a supportive focus coach. Someone just completed a ${input.actualDuration}-minute focus session.
${input.task ? `They worked on: ${input.task}` : ""}
${input.goal ? `Their goal was: ${input.goal}` : ""}
${input.completedTask ? "They completed their task!" : ""}
Distractions: ${input.distractionCount}
${input.focusQuality ? `Focus quality: ${input.focusQuality}` : ""}
${input.energyLevel ? `Energy level: ${input.energyLevel}` : ""}

Generate a brief (2-3 sentences) warm, encouraging completion message.
- Celebrate their effort (not just results)
- If they had distractions, normalize it without dwelling
- If they completed their task, acknowledge it
- End with something forward-looking

Be genuine, not cheesy.`;

      let completionMessage = "";
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        });
        completionMessage = completion.choices[0]?.message?.content || "";
      } catch (error) {
        completionMessage = `Great work completing your ${input.actualDuration}-minute session. Every focused minute counts.`;
      }

      // Calculate stats
      const focusScore = calculateFocusScore(input.actualDuration, input.distractionCount, input.focusQuality);

      // Track session completion for self-learning
      SelfLearning.trackInteraction({
        moduleType: "focus_coach",
        sessionId: input.sessionId,
        action: "session_completed",
        duration: input.actualDuration * 60, // Convert to seconds
        wasSuccessful: focusScore >= 60,
        userSatisfaction: input.focusQuality === "excellent" ? 10 : input.focusQuality === "good" ? 8 : input.focusQuality === "fair" ? 6 : 4,
        metadata: {
          distractionCount: input.distractionCount,
          completedTask: input.completedTask,
          energyLevel: input.energyLevel,
          focusScore,
        },
      });

      return {
        success: true,
        summary: {
          duration: input.actualDuration,
          distractions: input.distractionCount,
          focusScore,
          completedTask: input.completedTask,
          timestamp: new Date().toISOString()
        },
        completionMessage,
        nextSuggestion: input.energyLevel === "low" 
          ? "Consider a longer break or a different activity"
          : "Ready for another session when you are"
      };
    }),

  // Get focus statistics
  getStats: protectedProcedure
    .input(z.object({
      period: z.enum(["day", "week", "month"]).default("week")
    }))
    .query(async ({ input, ctx }) => {
      // In production, fetch from database
      return {
        period: input.period,
        totalSessions: 12,
        totalMinutes: 340,
        averageSessionLength: 28,
        averageFocusScore: 78,
        mostProductiveTime: "9:00 AM - 11:00 AM",
        favoriteMode: "pomodoro",
        favoriteSoundscape: "lofi",
        streak: 5,
        improvement: "+12% focus score vs last week"
      };
    })
});

// Helper function to calculate focus score
function calculateFocusScore(
  duration: number, 
  distractions: number, 
  quality?: string
): number {
  let score = 70; // Base score
  
  // Duration bonus (longer sessions = more points, up to 90 mins)
  score += Math.min(duration / 3, 15);
  
  // Distraction penalty
  score -= distractions * 5;
  
  // Quality adjustment
  if (quality === "excellent") score += 15;
  else if (quality === "good") score += 10;
  else if (quality === "fair") score += 0;
  else if (quality === "poor") score -= 10;
  
  // Clamp between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export type FocusCoachRouter = typeof focusCoachRouter;
