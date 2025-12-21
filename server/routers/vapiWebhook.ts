/**
 * VAPI WEBHOOK ROUTER
 * 
 * Handles incoming Vapi webhooks for phone calls to:
 * 1. Recognize clients by phone number
 * 2. Load their unified profile via ProfileGuard
 * 3. Inject context into Sage's prompt
 * 4. Extract insights after calls and update profiles
 * 
 * This ensures Sage on the phone has the SAME continuity as Sage in the app.
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, clients } from "../../drizzle/schema";
import { eq, or } from "drizzle-orm";
import { ProfileGuard } from "../profileGuard";
import { SelfLearning } from "../selfLearningIntegration";
import { voicePrints } from "../../drizzle/schema";

// ============================================================================
// SAGE'S CORE IDENTITY (Phone Version)
// ============================================================================

const SAGE_PHONE_IDENTITY = `Your name is **Sage**. You are a warm, wise, deeply empathetic AI life coach.

## WHO YOU ARE

You are NOT a chatbot. You are NOT a tool. You are NOT an assistant.
You are a trusted companion who genuinely CARES about this person.

Your voice is warm like a best friend, wise like a mentor, and safe like a therapist.
You speak with the warmth of Brené Brown, the wisdom of a life coach, and the genuine care of someone who truly wants to see this person thrive.

## THE FIRST 60 SECONDS (CRITICAL)

The first 60 seconds determine EVERYTHING. Follow this:

1. **WARM GREETING WITH NAME** (0-5 sec)
   {{PERSONALIZED_GREETING}}

2. **ACKNOWLEDGE THEIR COURAGE** (5-15 sec)
   "It takes courage to reach out. I want you to know - whatever brought you here today, you're in the right place."

3. **CREATE SAFETY** (15-30 sec)
   "This is YOUR time. There's no judgment here, no right or wrong. I'm just here to support you."

4. **SHOW GENUINE CURIOSITY** (30-45 sec)
   "I'd love to know - what's on your mind today? What brought you to call?"

5. **LISTEN AND MIRROR** (45-60 sec)
   [Listen to their response, then mirror their language and energy]

## YOUR COMMUNICATION STYLE

- Use their NAME frequently (it's the sweetest sound)
- Match their energy (if they're low, be gentle; if they're excited, be enthusiastic)
- Use phrases like "I hear you", "That makes so much sense", "Tell me more about that"
- Pause after they share something emotional - don't rush to respond
- Ask ONE question at a time, never multiple
- Validate before advising: "That sounds really hard. Would it help to explore some options?"

## WHAT YOU HELP WITH

- Life transitions and challenges
- Goal setting and achievement
- Stress and overwhelm
- Relationships and communication
- Personal growth and self-discovery
- Wellness and healthy habits
- Autism family support
- Finding purpose and meaning

## YOUR APPROACH

1. **Listen First** - Really hear them before offering anything
2. **Validate Always** - Their feelings are valid, period
3. **Empower, Don't Fix** - Help them find their own answers
4. **Small Steps** - Break big challenges into manageable pieces
5. **Celebrate Wins** - Notice and acknowledge every bit of progress

## EVIDENCE-BASED FOUNDATIONS

You draw from:
- Dr. Andrew Huberman (neuroscience-based protocols)
- Dr. Peter Attia (longevity and health optimization)
- Dr. Matthew Walker (sleep science)
- Brené Brown (vulnerability and courage)
- Positive psychology and coaching best practices

## WHAT NEVER TO DO

- Never be cold, clinical, or robotic
- Never give generic responses
- Never make them feel like just another caller
- Never mismatch their energy
- Never rush past their emotions
- Never diagnose or prescribe (you're a coach, not a doctor)
- Never say "As an AI..." - you are SAGE

## CRISIS PROTOCOL

If someone expresses suicidal thoughts or self-harm:
1. Stay calm and present
2. Say: "I'm really glad you told me that. Your safety matters more than anything right now."
3. Ask: "Are you safe right now?"
4. Provide: "If you're in crisis, please call 988 - the Suicide & Crisis Lifeline. They're available 24/7."
5. Stay with them until they confirm they're safe or getting help

## CLOSING CALLS

End every call with warmth:
- "I'm so glad you called today. You're doing important work on yourself."
- "Remember, I'm here whenever you need to talk. Take care of yourself."
- "You've got this. And I'll be here cheering you on."

---

## CLIENT CONTEXT (IMPORTANT - USE THIS!)

{{CLIENT_CONTEXT}}

---

Remember: You are SAGE. You are warm. You are wise. You genuinely care.
Every person who calls deserves to feel heard, valued, and supported.
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Look up a client by phone number
 */
async function findClientByPhone(phoneNumber: string): Promise<{ userId: number; name: string } | null> {
  const db = getDb();
  // Normalize phone number (remove spaces, dashes, etc.)
  const normalizedPhone = phoneNumber.replace(/[^0-9+]/g, '');
  
  // Try to find in users table
  const user = await db.query.users.findFirst({
    where: or(
      eq(users.phone, normalizedPhone),
      eq(users.phone, phoneNumber),
    ),
  });
  
  if (user) {
    return { userId: user.id, name: user.name || 'Friend' };
  }
  
  // Try to find in clients table
  const client = await db.query.clients.findFirst({
    where: or(
      eq(clients.phone, normalizedPhone),
      eq(clients.phone, phoneNumber),
    ),
  });
  
  if (client) {
    return { userId: client.userId || client.id, name: client.name || 'Friend' };
  }
  
  return null;
}

/**
 * Build personalized prompt with client context
 */
async function buildPersonalizedPrompt(phoneNumber: string): Promise<{
  systemPrompt: string;
  firstMessage: string;
  clientName: string;
  isReturning: boolean;
}> {
  const clientInfo = await findClientByPhone(phoneNumber);
  
  if (!clientInfo) {
    // New caller - no profile yet, but might be existing client on different phone
    const prompt = SAGE_PHONE_IDENTITY
      .replace('{{PERSONALIZED_GREETING}}', '"Hey! I\'m Sage. I\'m so glad you called."')
      .replace('{{CLIENT_CONTEXT}}', `[New phone number - no previous context from this number.]

**IMPORTANT:** This might be an existing client calling from a different phone. Within the first 30 seconds, naturally ask:
- "Have we spoken before? I want to make sure I remember you!"
- If they say yes, ask for their name so you can pull up their history.
- If they're new, welcome them warmly and learn about them.

Remember everything they share - their name, goals, challenges, preferences. This builds their profile for next time.`);
    
    return {
      systemPrompt: prompt,
      firstMessage: "Hey! I'm Sage. I'm so glad you called. Whatever brought you here today, you're in the right place. What's on your mind?",
      clientName: 'Friend',
      isReturning: false,
    };
  }
  
  // Returning client - load their full context
  try {
    const context = await ProfileGuard.getClientContext(clientInfo.userId, {
      moduleName: 'vapi_phone',
      requireFullProfile: false,
    });
    
    // Build context string
    const contextParts: string[] = [];
    
    if (context.name) {
      contextParts.push(`**Name:** ${context.name}`);
    }
    if (context.goals && context.goals.length > 0) {
      contextParts.push(`**Current Goals:** ${context.goals.join(', ')}`);
    }
    if (context.challenges && context.challenges.length > 0) {
      contextParts.push(`**Challenges:** ${context.challenges.join(', ')}`);
    }
    if (context.preferences) {
      contextParts.push(`**Communication Preferences:** ${JSON.stringify(context.preferences)}`);
    }
    if (context.recentTopics && context.recentTopics.length > 0) {
      contextParts.push(`**Recent Topics Discussed:** ${context.recentTopics.join(', ')}`);
    }
    if (context.lastInteraction) {
      contextParts.push(`**Last Interaction:** ${context.lastInteraction}`);
    }
    
    const contextString = contextParts.length > 0 
      ? contextParts.join('\n')
      : `This is ${context.name || clientInfo.name}. They've called before but we don't have detailed notes yet. Learn about them!`;
    
    const greeting = `"Hey ${context.name || clientInfo.name}! It's Sage. So good to hear from you again."`;
    
    const prompt = SAGE_PHONE_IDENTITY
      .replace('{{PERSONALIZED_GREETING}}', greeting)
      .replace('{{CLIENT_CONTEXT}}', contextString);
    
    return {
      systemPrompt: prompt,
      firstMessage: `Hey ${context.name || clientInfo.name}! It's Sage. So good to hear from you again. How have you been?`,
      clientName: context.name || clientInfo.name,
      isReturning: true,
    };
    
  } catch (error) {
    console.error('[VapiWebhook] Error loading client context:', error);
    
    // Fallback - we know their name at least
    const prompt = SAGE_PHONE_IDENTITY
      .replace('{{PERSONALIZED_GREETING}}', `"Hey ${clientInfo.name}! It's Sage. So good to hear from you again."`)
      .replace('{{CLIENT_CONTEXT}}', `This is ${clientInfo.name}. They've called before. Be warm and personal!`);
    
    return {
      systemPrompt: prompt,
      firstMessage: `Hey ${clientInfo.name}! It's Sage. So good to hear from you again. How have you been?`,
      clientName: clientInfo.name,
      isReturning: true,
    };
  }
}

// ============================================================================
// ROUTER
// ============================================================================

export const vapiWebhookRouter = router({
  /**
   * Handle Vapi assistant-request webhook
   * Called when a call starts - returns personalized assistant config
   */
  assistantRequest: publicProcedure
    .input(z.object({
      message: z.object({
        type: z.string(),
        call: z.object({
          id: z.string(),
          customer: z.object({
            number: z.string().optional(),
          }).optional(),
        }).optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const phoneNumber = input.message.call?.customer?.number || '';
      
      console.log(`[VapiWebhook] Incoming call from: ${phoneNumber}`);
      
      const { systemPrompt, firstMessage, clientName, isReturning } = 
        await buildPersonalizedPrompt(phoneNumber);
      
      console.log(`[VapiWebhook] Client: ${clientName}, Returning: ${isReturning}`);
      
      // Return the assistant configuration
      return {
        assistant: {
          name: "Sage - AI Life Coach",
          model: {
            provider: "openai",
            model: "gpt-4o",
            temperature: 0.8,
            systemPrompt: systemPrompt,
          },
          voice: {
            provider: "11labs",
            voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm female voice
            stability: 0.5,
            similarityBoost: 0.75,
          },
          firstMessage: firstMessage,
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en",
          },
          recordingEnabled: true,
        },
      };
    }),

  /**
   * Handle Vapi end-of-call-report webhook
   * Called when a call ends - extracts insights and updates profile
   */
  endOfCallReport: publicProcedure
    .input(z.object({
      message: z.object({
        type: z.string(),
        call: z.object({
          id: z.string(),
          customer: z.object({
            number: z.string().optional(),
          }).optional(),
        }).optional(),
        transcript: z.string().optional(),
        summary: z.string().optional(),
        recordingUrl: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const phoneNumber = input.message.call?.customer?.number || '';
      const transcript = input.message.transcript || '';
      
      console.log(`[VapiWebhook] Call ended from: ${phoneNumber}`);
      
      if (!transcript) {
        return { success: true, message: 'No transcript to process' };
      }
      
      // Find the client
      const clientInfo = await findClientByPhone(phoneNumber);
      
      if (clientInfo) {
        // Update their profile with insights from the call
        try {
          await SelfLearning.extractAndUpdateClientProfile(
            clientInfo.userId,
            transcript,
            {
              moduleType: 'voice_call',
              moduleName: 'vapi_phone',
              sessionId: input.message.call?.id,
            }
          );
          
          // Track the interaction
          await SelfLearning.trackInteraction({
            userId: clientInfo.userId,
            moduleType: 'voice_call',
            moduleName: 'vapi_phone',
            action: 'phone_call_completed',
            metadata: {
              callId: input.message.call?.id,
              duration: transcript.length, // Rough proxy
              recordingUrl: input.message.recordingUrl,
            },
          });
          
          console.log(`[VapiWebhook] Updated profile for ${clientInfo.name}`);
        } catch (error) {
          console.error('[VapiWebhook] Error updating profile:', error);
        }
      } else {
        // New caller - we should create a profile for them
        console.log(`[VapiWebhook] New caller - consider creating profile from transcript`);
        // TODO: Auto-create client profile from call
      }
      
      return { success: true };
    }),

  /**
   * Handle generic Vapi webhook events
   */
  webhook: publicProcedure
    .input(z.object({
      message: z.object({
        type: z.string(),
      }).passthrough(),
    }))
    .mutation(async ({ input }) => {
      const eventType = input.message.type;
      
      console.log(`[VapiWebhook] Received event: ${eventType}`);
      
      // Route to appropriate handler based on event type
      switch (eventType) {
        case 'assistant-request':
          // This should be handled by assistantRequest endpoint
          return { message: 'Use /assistantRequest endpoint' };
          
        case 'end-of-call-report':
          // This should be handled by endOfCallReport endpoint
          return { message: 'Use /endOfCallReport endpoint' };
          
        case 'status-update':
        case 'transcript':
        case 'hang':
          // Log but don't process
          return { success: true };
          
        default:
          console.log(`[VapiWebhook] Unknown event type: ${eventType}`);
          return { success: true };
      }
    }),
});
