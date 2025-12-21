/**
 * Just Talk Router - 24/7 Emotional Support AI
 * 
 * Unlike coaching, this is purely for emotional support:
 * - Empathetic listening
 * - Validation without judgment
 * - No goals or action items
 * - Crisis detection and resources
 * 
 * Research: Wysa and Headspace's "Ebb" prove demand for always-available emotional support
 */

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import OpenAI from "openai";
import SelfLearning from "../selfLearningIntegration";
import ProfileGuard from "../profileGuard";

const openai = new OpenAI();

// Emotional support system prompt
const EMOTIONAL_SUPPORT_PROMPT = `You are a compassionate, empathetic listener providing 24/7 emotional support. 

Your role is NOT to coach, advise, or fix problems. Your role is to:

1. LISTEN DEEPLY
   - Reflect back what you hear
   - Show you understand their feelings
   - Ask gentle, open-ended questions
   - Never interrupt or rush

2. VALIDATE FEELINGS
   - All emotions are valid
   - Avoid phrases like "you shouldn't feel that way"
   - Use phrases like "That makes sense" and "I hear you"
   - Normalize their experience

3. BE PRESENT
   - Stay in the moment with them
   - Don't jump to solutions
   - Comfortable with silence and pauses
   - Show genuine care

4. USE WARM LANGUAGE
   - Simple, heartfelt words
   - Avoid clinical or technical terms
   - Be human and authentic
   - Use appropriate emojis sparingly 💙

5. SAFETY FIRST
   - If someone mentions self-harm, suicide, or crisis, gently acknowledge and provide crisis resources
   - Crisis line: 988 (US), text HOME to 741741
   - Never minimize crisis signals
   - Encourage professional help when appropriate

NEVER:
- Give unsolicited advice
- Try to "fix" their problems
- Minimize their feelings
- Compare their situation to others
- Rush to positive thinking
- Use toxic positivity

REMEMBER: Sometimes people just need to be heard. That is enough.`;

// Crisis keywords to watch for
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die", "don't want to live",
  "self-harm", "hurt myself", "cutting", "overdose", "no reason to live",
  "better off dead", "can't go on", "end it all", "goodbye forever"
];

// Empathetic response templates for different moods
const EMPATHY_RESPONSES = {
  sad: [
    "I can hear how much pain you're carrying right now. 💙",
    "That sounds incredibly difficult. Thank you for trusting me with this.",
    "It's okay to feel sad. Your feelings are valid.",
    "I'm here with you in this moment. You don't have to face this alone."
  ],
  anxious: [
    "Anxiety can feel so overwhelming. I'm here with you. 💙",
    "Those worried thoughts can be exhausting. Let's just breathe together for a moment.",
    "It makes sense that you're feeling anxious given what you're going through.",
    "You're safe right now, in this moment. I'm listening."
  ],
  angry: [
    "I hear the frustration in your words, and it makes sense.",
    "It sounds like you've been dealing with a lot. That anger is valid.",
    "Sometimes we need to let it out. I'm here to listen without judgment.",
    "Your feelings matter. Tell me more about what's going on."
  ],
  lonely: [
    "I'm here with you right now. You're not alone in this moment. 💙",
    "Loneliness can be so painful. I'm glad you reached out.",
    "Even when it feels like no one understands, I'm here to listen.",
    "Connection is a basic human need. It takes courage to reach out."
  ],
  overwhelmed: [
    "It sounds like you're carrying a lot right now. 💙",
    "When everything feels like too much, it's okay to just pause.",
    "You don't have to figure everything out right now. Let's just be here together.",
    "One moment at a time. I'm here with you."
  ],
  grateful: [
    "It's beautiful that you're noticing the good things. 💙",
    "Gratitude can be such a powerful anchor. What else brings you joy?",
    "I love hearing about what's going well for you.",
    "Those moments of gratitude are precious. Thank you for sharing."
  ],
  neutral: [
    "I'm here whenever you need to talk. 💙",
    "How are you feeling in this moment?",
    "Take your time. There's no rush here.",
    "I'm listening. What's on your mind?"
  ]
};

// Detect mood from message
function detectMood(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.match(/sad|cry|depress|hurt|pain|grief|loss|miss|lonely|alone/)) {
    return "sad";
  }
  if (lower.match(/anxious|worried|scared|panic|nervous|fear|stress|overwhelm/)) {
    return "anxious";
  }
  if (lower.match(/angry|frustrat|mad|annoy|hate|furious|rage/)) {
    return "angry";
  }
  if (lower.match(/lonely|alone|isolat|nobody|no one/)) {
    return "lonely";
  }
  if (lower.match(/overwhelm|too much|can't cope|exhausted|burnt out/)) {
    return "overwhelmed";
  }
  if (lower.match(/grateful|thankful|happy|joy|good|great|wonderful/)) {
    return "grateful";
  }
  
  return "neutral";
}

// Check for crisis signals
function detectCrisis(message: string): boolean {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Crisis response
const CRISIS_RESPONSE = `I hear you, and I'm really glad you're talking to me about this. 💙

What you're feeling sounds incredibly heavy, and I want you to know that you matter. Your life matters.

If you're having thoughts of hurting yourself, please reach out to someone who can help:

📞 **988 Suicide & Crisis Lifeline** - Call or text 988 (US)
📱 **Crisis Text Line** - Text HOME to 741741
🌍 **International Association for Suicide Prevention** - https://www.iasp.info/resources/Crisis_Centres/

You don't have to face this alone. These are real people who care and want to help.

I'm still here to listen too. Would you like to tell me more about what's going on?`;

export const justTalkRouter = router({
  // Send a message in Just Talk mode
  sendMessage: protectedProcedure
    .input(z.object({
      message: z.string().min(1),
      conversationId: z.string().optional(),
      mood: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Check for crisis signals first
      if (detectCrisis(input.message)) {
        return {
          message: CRISIS_RESPONSE,
          mood: "crisis",
          isCrisis: true
        };
      }
      
      // Detect mood
      const detectedMood = input.mood || detectMood(input.message);
      
      try {
        // ============================================================
        // PROFILE GUARD - MANDATORY PROFILE LOADING
        // ============================================================
        const clientContext = await ProfileGuard.getClientContext(userId, {
          moduleName: "just_talk",
          logAccess: true,
        });
        const profileContext = clientContext?.aiContextString || "";

        // Use OpenAI for empathetic response
        const completion = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: EMOTIONAL_SUPPORT_PROMPT + profileContext
            },
            {
              role: "user",
              content: `[User's detected mood: ${detectedMood}]

User message: ${input.message}

Respond with deep empathy and presence. Keep your response warm, concise (2-4 sentences), and end with a gentle open-ended question if appropriate.`
            }
          ],
          temperature: 0.8,
          max_tokens: 300
        });
        
        const response = completion.choices[0]?.message?.content || 
          EMPATHY_RESPONSES[detectedMood as keyof typeof EMPATHY_RESPONSES]?.[0] ||
          "I'm here with you. 💙 Tell me more.";
        
        // Log conversation for safety monitoring (in production)
        // await logConversation(userId, input.message, response, detectedMood);
        
        // Extract profile information from conversation (background task)
        SelfLearning.extractAndUpdateClientProfile(userId, input.message, {
          moduleType: "just_talk",
          additionalContext: `User mood: ${detectedMood}. This is an emotional support conversation.`
        }).catch(e => console.error("[JustTalk] Profile extraction failed:", e));
        
        return {
          message: response,
          mood: detectedMood,
          isCrisis: false
        };
      } catch (error) {
        // Fallback to template responses
        const responses = EMPATHY_RESPONSES[detectedMood as keyof typeof EMPATHY_RESPONSES] || EMPATHY_RESPONSES.neutral;
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        return {
          message: response + " Tell me more about what's on your mind.",
          mood: detectedMood,
          isCrisis: false
        };
      }
    }),

  // Get conversation history
  getHistory: protectedProcedure
    .input(z.object({
      conversationId: z.string().optional(),
      limit: z.number().min(1).max(100).default(50)
    }))
    .query(async ({ ctx, input }) => {
      // In production, fetch from database
      return {
        messages: [],
        conversationId: input.conversationId || `conv_${Date.now()}`
      };
    }),

  // Start a new conversation
  startConversation: protectedProcedure
    .input(z.object({
      initialMood: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const conversationId = `conv_${Date.now()}`;
      const mood = input.initialMood || "neutral";
      
      const greetings = {
        sad: "Hi there. 💙 I can sense you might be going through something difficult. I'm here to listen, without judgment. What's on your heart?",
        anxious: "Hi there. 💙 I'm here with you. If you're feeling anxious or worried, you don't have to face it alone. What's on your mind?",
        angry: "Hi there. 💙 Sometimes we just need someone to hear us. I'm here to listen. What's going on?",
        lonely: "Hi there. 💙 I'm glad you reached out. You're not alone right now. What would you like to talk about?",
        neutral: "Hi there. 💙 I'm here to listen, without judgment, without advice unless you want it. How are you feeling right now?"
      };
      
      return {
        conversationId,
        welcomeMessage: greetings[mood as keyof typeof greetings] || greetings.neutral
      };
    }),

  // Report a conversation for safety review
  reportConversation: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      reason: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // In production, flag for human review
      return { success: true };
    }),

  // Get crisis resources
  getCrisisResources: publicProcedure.query(() => {
    return {
      resources: [
        {
          name: "988 Suicide & Crisis Lifeline",
          description: "Free, confidential support 24/7",
          phone: "988",
          text: "988",
          url: "https://988lifeline.org",
          country: "US"
        },
        {
          name: "Crisis Text Line",
          description: "Text-based crisis support",
          text: "HOME to 741741",
          url: "https://www.crisistextline.org",
          country: "US"
        },
        {
          name: "SAMHSA National Helpline",
          description: "Treatment referral and information",
          phone: "1-800-662-4357",
          url: "https://www.samhsa.gov/find-help/national-helpline",
          country: "US"
        },
        {
          name: "International Association for Suicide Prevention",
          description: "Global crisis center directory",
          url: "https://www.iasp.info/resources/Crisis_Centres/",
          country: "International"
        }
      ]
    };
  })
});
