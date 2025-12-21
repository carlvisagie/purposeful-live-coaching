import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import OpenAI from "openai";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Coach Router
 * Provides real-time coaching suggestions for the teleprompter
 */
export const aiCoachRouter = router({
  /**
   * Generate coaching suggestions based on client input
   * Used by the AI Teleprompter in the Control Center
   */
  generateCoachingSuggestion: publicProcedure
    .input(
      z.object({
        clientInput: z.string().min(1),
        clientName: z.string().optional().default("Client"),
        sessionType: z.string().optional().default("General Coaching"),
        clientContext: z.string().optional().default(""),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // PROFILE GUARD - Load client context
      const profileContext = await ProfileGuard.getClientContext(input.userId, {
        moduleName: "ai_coach",
        logAccess: true,
      });
      
      const { clientInput, clientName, sessionType, clientContext } = input;

      try {
        const systemPrompt = `You are an expert wellness and life coach assistant helping a coach during a live session. 
Your role is to provide suggested responses that the coach can read or adapt.

IMPORTANT GUIDELINES:
1. Generate 2-3 different response options
2. Each response should be complete, ready to read aloud
3. Use warm, empathetic language
4. Include evidence-based coaching techniques
5. Be compliance-safe (no medical advice, no diagnosis)
6. Adapt tone to the emotional content detected

Session Context:
- Client Name: ${clientName}
- Session Type: ${sessionType}
${clientContext ? `- Additional Context: ${clientContext}` : ""}

For each suggestion, provide:
- type: "response" | "empathy" | "technique" | "transition"
- title: Brief label for the suggestion
- content: The full script to read
- technique: The coaching technique being used (if applicable)
- priority: "low" | "medium" | "high"

Respond in JSON format with a "suggestions" array.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `The client just said: "${clientInput}"\n\nGenerate coaching response suggestions.` },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No response from AI");
        }

        const parsed = JSON.parse(content);
        return {
          suggestions: parsed.suggestions || [],
          success: true,
        };
      } catch (error: any) {
        console.error("AI Coach suggestion error:", error);
        
        // Return fallback suggestions if AI fails
        return {
          suggestions: generateFallbackSuggestions(clientInput, clientName),
          success: true,
          fallback: true,
        };
      }
    }),

  /**
   * Get quick scripts by category
   */
  getQuickScripts: publicProcedure
    .input(
      z.object({
        category: z.enum([
          "opening",
          "empathy",
          "grounding",
          "reframing",
          "closing",
          "crisis",
          "transition",
        ]),
      })
    )
    .query(({ input }) => {
      const scripts = QUICK_SCRIPTS[input.category] || [];
      return { scripts };
    }),

  /**
   * Analyze client emotion from text
   */
  analyzeEmotion: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // PROFILE GUARD - Load client context
      const profileContext = await ProfileGuard.getClientContext(input.userId, {
        moduleName: "ai_coach",
        logAccess: true,
      });
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Analyze the emotional content of the following text. Return JSON with:
- primaryEmotion: The main emotion detected
- intensity: "low" | "medium" | "high"
- triggers: Array of potential emotional triggers mentioned
- suggestedApproach: Brief coaching approach recommendation`,
            },
            { role: "user", content: input.text },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 300,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No response from AI");
        }

        return JSON.parse(content);
      } catch (error) {
        console.error("Emotion analysis error:", error);
        return {
          primaryEmotion: "unknown",
          intensity: "medium",
          triggers: [],
          suggestedApproach: "Use active listening and open-ended questions",
        };
      }
    }),
});

// Fallback suggestions when AI is unavailable
function generateFallbackSuggestions(clientInput: string, clientName: string) {
  const lowerInput = clientInput.toLowerCase();
  const suggestions = [];

  // Detect emotional keywords
  if (lowerInput.includes("anxious") || lowerInput.includes("worried") || lowerInput.includes("stress")) {
    suggestions.push({
      type: "empathy",
      title: "Acknowledge Anxiety",
      content: `I hear that you're feeling anxious, ${clientName}. That's a completely natural response to what you're going through. Let's take a moment to breathe together - would you be open to a quick grounding exercise?`,
      technique: "Validation + Grounding",
      priority: "high",
    });
    suggestions.push({
      type: "technique",
      title: "5-4-3-2-1 Grounding",
      content: "Let's try the 5-4-3-2-1 technique. Can you name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste?",
      technique: "Sensory Grounding",
      priority: "medium",
    });
  }

  if (lowerInput.includes("sad") || lowerInput.includes("depressed") || lowerInput.includes("hopeless")) {
    suggestions.push({
      type: "empathy",
      title: "Validate Sadness",
      content: `Thank you for sharing that with me, ${clientName}. It takes courage to acknowledge these feelings. I want you to know that what you're feeling is valid, and you don't have to face this alone.`,
      technique: "Emotional Validation",
      priority: "high",
    });
  }

  if (lowerInput.includes("angry") || lowerInput.includes("frustrated") || lowerInput.includes("mad")) {
    suggestions.push({
      type: "empathy",
      title: "Acknowledge Frustration",
      content: `I can hear the frustration in what you're sharing. That anger makes sense given what you've described. Let's explore what's underneath that feeling - often anger is protecting something deeper.`,
      technique: "Emotion Exploration",
      priority: "high",
    });
  }

  // Default suggestions if no specific triggers
  if (suggestions.length === 0) {
    suggestions.push({
      type: "response",
      title: "Reflective Response",
      content: `I appreciate you sharing that, ${clientName}. Can you tell me more about what that experience was like for you?`,
      technique: "Open-ended Inquiry",
      priority: "medium",
    });
    suggestions.push({
      type: "empathy",
      title: "Validate & Explore",
      content: `What you're describing sounds significant. How has this been affecting you day-to-day?`,
      technique: "Impact Assessment",
      priority: "medium",
    });
  }

  return suggestions;
}

// Pre-built quick scripts
const QUICK_SCRIPTS: Record<string, Array<{ title: string; content: string; technique?: string }>> = {
  opening: [
    {
      title: "Warm Welcome",
      content: "Thank you for joining me today. Before we begin, I want you to know this is a safe space where you can share openly.",
      technique: "Rapport Building",
    },
    {
      title: "Check-In",
      content: "I'm glad you're here. Let's start by checking in - how are you feeling right now, in this moment?",
      technique: "Present-Moment Awareness",
    },
    {
      title: "Returning Client",
      content: "Welcome back! I've been looking forward to our session. What's been on your mind since we last spoke?",
      technique: "Continuity",
    },
  ],
  empathy: [
    {
      title: "Acknowledge Challenge",
      content: "I hear you, and that sounds really challenging. It takes courage to share that.",
      technique: "Validation",
    },
    {
      title: "Trust Appreciation",
      content: "Thank you for trusting me with this. Your feelings are completely valid.",
      technique: "Emotional Validation",
    },
    {
      title: "Difficulty Recognition",
      content: "That must be difficult to carry. I appreciate you opening up about this.",
      technique: "Empathic Reflection",
    },
  ],
  grounding: [
    {
      title: "Breathing Exercise",
      content: "Let's pause for a moment. Can you take a deep breath with me? Inhale for 4 counts... hold for 4... exhale for 6...",
      technique: "Box Breathing",
    },
    {
      title: "5-4-3-2-1 Technique",
      content: "I notice this is bringing up strong emotions. Let's ground ourselves - can you name 5 things you can see right now?",
      technique: "Sensory Grounding",
    },
    {
      title: "Body Scan",
      content: "Before we continue, let's do a quick body scan. Where are you holding tension right now?",
      technique: "Somatic Awareness",
    },
  ],
  reframing: [
    {
      title: "Self-Compassion",
      content: "I'm curious - what would it look like if you approached this situation with self-compassion?",
      technique: "Cognitive Reframing",
    },
    {
      title: "Friend Perspective",
      content: "Let's explore another perspective. What advice would you give a close friend in this situation?",
      technique: "Perspective Taking",
    },
    {
      title: "Positive Focus",
      content: "What's one small thing that went well today, even if it feels insignificant?",
      technique: "Gratitude Practice",
    },
  ],
  closing: [
    {
      title: "Key Takeaway",
      content: "We've covered a lot today. What's one insight you're taking away from our conversation?",
      technique: "Integration",
    },
    {
      title: "Action Step",
      content: "Before we end, what's one small action you feel ready to take this week?",
      technique: "Goal Setting",
    },
    {
      title: "Appreciation",
      content: "Thank you for your openness today. Remember, progress isn't always linear, and you're doing important work.",
      technique: "Encouragement",
    },
  ],
  crisis: [
    {
      title: "Safety Check",
      content: "I want to make sure I understand - are you having thoughts of harming yourself right now?",
      technique: "Risk Assessment",
    },
    {
      title: "Explore Experience",
      content: "Your safety is my top priority. Can you tell me more about what you're experiencing?",
      technique: "Active Listening",
    },
    {
      title: "Support Network",
      content: "I'm here with you. Let's talk about what support you have available right now.",
      technique: "Resource Identification",
    },
  ],
  transition: [
    {
      title: "Topic Shift",
      content: "I'd like to explore something you mentioned earlier. Would you be open to talking more about that?",
      technique: "Guided Exploration",
    },
    {
      title: "Deeper Dive",
      content: "That's really insightful. Let's go a bit deeper - what do you think is at the root of that?",
      technique: "Root Cause Analysis",
    },
    {
      title: "Progress Check",
      content: "We're about halfway through our session. How are you feeling about what we've discussed so far?",
      technique: "Session Management",
    },
  ],
};
