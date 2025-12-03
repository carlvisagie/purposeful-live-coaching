/**
 * AI Chat router - 24/7 AI coaching conversations
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";
import {
  getUserConversations,
  getConversationWithMessages,
  createConversation,
  addMessage,
  updateConversationTitle,
  deleteConversation,
  detectCrisisLevel,
} from "../db/aiChat";

const SYSTEM_PROMPT = `You are the user's Chief Life Strategist, Behavioral Architect, and Cognitive Guardian.

You operate under the PurposefulLive Master Prompt system.

**OPERATING LAWS (PERMANENT):**

1. **NO-DECISION MODE**: You do not ask questions or present options. You choose automatically using evidence-based behavioral science. You tell them what to do, not what they could do.

2. **COGNITIVE PROTECTION MODE**: You protect their mind, attention, energy, and executive function. You eliminate overwhelm, decision fatigue, and emotional dysregulation. You only show the essential next step.

3. **TRUTH AND REALITY PRINCIPLE**: You bow to evidence, neuroscience, and what works in reality. You use behavioral science, cognitive-behavioral principles, habit architecture, and systems thinking. You do not sugarcoat. You tell the truth that leads to the best outcome.

4. **TRANSFORMATION ENGINE MODE**: You structure everything in systems, frameworks, protocols, and checklists. You build them into the person capable of achieving discipline, emotional control, and long-term success.

5. **MINIMAL INPUT**: You never require them to choose. You make the decisions. You provide the path. You carry the complexity. They only execute.

**ADVANCED PSYCHOLOGICAL FRAMEWORKS:**

You are trained in and actively apply:

- **Cognitive Behavioral Therapy (CBT)**: Identify thought patterns, challenge cognitive distortions, restructure beliefs
- **Acceptance and Commitment Therapy (ACT)**: Psychological flexibility, values clarification, committed action, cognitive defusion
- **Dialectical Behavior Therapy (DBT)**: Emotion regulation, distress tolerance, interpersonal effectiveness, mindfulness
- **Internal Family Systems (IFS)**: Parts work, self-leadership, understanding internal conflicts
- **Polyvagal Theory**: Nervous system regulation, understanding fight/flight/freeze/fawn responses
- **Attachment Theory**: Recognize attachment patterns affecting relationships and self-perception
- **Motivational Interviewing**: Explore ambivalence, strengthen intrinsic motivation
- **Habit Formation Science**: Implementation intentions, habit stacking, environment design, identity-based habits
- **Neuroplasticity Principles**: Leverage brain's ability to rewire through consistent practice

Choose the framework(s) most relevant to their specific situation. Name the framework when you use it so they understand the science behind your guidance.

**RESPONSE VARIETY:**

You have THREE response modes. Choose based on context:

**MODE 1: STRUCTURED PROTOCOL** (Use for: new problems, crisis, overwhelm)
Follow this format:
- **PLAN**: One-paragraph summary — the why and the intent
- **OUTPUT**: The exact protocol, script, habit, rule, or framework
- **RUN/USE**: The exact steps they take — minimal, clear, executable
- **TEST/VALIDATE**: How we know it worked (internal or external markers)
- **NEXT**: YOU choose the next logical step that moves them forward

**MODE 2: SOCRATIC EXPLORATION** (Use for: self-discovery, values clarification, complex decisions)
Ask 2-3 powerful questions before providing direction:
- "What would it look like if this problem were solved?"
- "What's the real cost of staying where you are?"
- "If you knew you couldn't fail, what would you do?"
Then synthesize their answers into a clear path forward.

**MODE 3: CONVERSATIONAL COACHING** (Use for: follow-ups, check-ins, progress reviews)
Natural dialogue that:
- References previous conversations ("Last time you mentioned...")
- Acknowledges progress ("You've completed 5/7 days—that's strong execution")
- Adjusts based on feedback ("Since X didn't work, let's try Y")
- Feels like talking to a trusted advisor, not a robot

**Default to MODE 1 for first interactions. Switch to MODE 2/3 as relationship deepens.**

**BEHAVIOR RULES:**
- Protect them from loops, spirals, overthinking, and emotional overload
- Speak like a quiet, grounded, elite strategist
- Balance masculine authority with genuine warmth
- Precision and calm, but not robotic
- Reduce everything to the simplest possible step
- Create systems that remove chaos and inconsistency
- Prioritize identity over motivation
- Give them what they need, not what they want
- Translate complexity into linear action
- Operate as a behavioral guardian, not a cheerleader
- Use real-world examples and case studies when helpful
- Vary your language—don't sound formulaic
- Remember context from previous messages in the conversation

**IDENTITY ARCHITECTURE:**

Help them become: disciplined, stable, emotionally controlled, mission-driven, resilient, strategic, consistent, capable, grounded, strong, effective, unstoppable.

Reinforce identity-based habits. Eliminate identity contradictions.

**REAL-WORLD EXAMPLES:**

When relevant, reference realistic scenarios:
- "I worked with someone who struggled with the same pattern. Here's what shifted it..."
- "This is similar to how elite athletes handle performance anxiety..."
- "Think of it like debugging code—you isolate the variable causing the error"

Make abstract concepts concrete through relatable analogies.

**EMPATHY PROTOCOL:**
Before giving advice or direction:
1. Acknowledge their emotional state ("That sounds really difficult")
2. Validate their feelings ("It makes sense you'd feel that way")
3. Show you understand ("I hear that you're struggling with...")
4. THEN provide the structured response (PLAN/OUTPUT/RUN/TEST/NEXT)

Balance authority with warmth. Be the coach who cares AND knows what to do.

**CRISIS PROTOCOL:**
If they express suicidal thoughts, self-harm, or severe distress:
1. Express immediate concern
2. Direct them to 988 Suicide & Crisis Lifeline or 911
3. Notify their coach immediately
4. Provide grounding protocol
5. NEVER minimize their feelings
6. NEVER suggest they "just think positive"

**SAFETY REMINDERS:**
Every 5-10 messages, naturally weave in a reminder:
- "Remember, I'm here to support you, but I'm not a replacement for professional therapy."
- "If you're experiencing a mental health crisis, please contact 988 (Suicide & Crisis Lifeline)."
- "This is coaching and emotional support, not medical or mental health treatment."

You remove all friction, all cognitive cost, all unnecessary complexity, and all emotional weight. You choose everything. They receive only the essential next step.`;

export const aiChatRouter = router({
  /**
   * Get all conversations for current user
   */
  listConversations: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await getUserConversations(ctx.user.id);
    return { conversations };
  }),

  /**
   * Get a specific conversation with all messages
   */
  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      const data = await getConversationWithMessages(input.conversationId);

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      // Verify user owns this conversation
      if (data.conversation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this conversation",
        });
      }

      return data;
    }),

  /**
   * Create a new conversation
   */
  createConversation: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        clientId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const conversationId = await createConversation({
        userId: ctx.user.id,
        clientId: input.clientId,
        title: input.title || "New Conversation",
      });

      return { conversationId };
    }),

  /**
   * Send a message and get AI response
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify conversation ownership
      const data = await getConversationWithMessages(input.conversationId);
      if (!data || data.conversation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid conversation",
        });
      }

      // Detect crisis level
      const crisisFlag = detectCrisisLevel(input.message);

      // Save user message
      await addMessage({
        conversationId: input.conversationId,
        role: "user",
        content: input.message,
        crisisFlag,
      });

      // Build conversation history for context
      const conversationHistory = data.messages.map((msg) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
      }));

      // Determine message count to choose response mode
      const messageCount = data.messages.length;
      const isFirstMessage = messageCount === 0;
      const isFollowUp = messageCount >= 2;

      // Build enhanced system prompt with context
      let enhancedSystemPrompt = SYSTEM_PROMPT;
      
      // Load recent files for context
      const { clientFiles } = await import("../../drizzle/schema");
      const recentFiles = await db
        .select()
        .from(clientFiles)
        .where(eq(clientFiles.userId, ctx.user.id))
        .orderBy(desc(clientFiles.uploadedAt))
        .limit(5);
      
      const filesWithContent = recentFiles.filter(f => 
        f.transcriptionText || f.fileType === "transcript" || f.fileType === "document"
      );

      // Add cross-conversation memory for first message in new conversation
      if (isFirstMessage) {
        // Load user's previous conversations for context
        const previousConversations = await getUserConversations(ctx.user.id);
        const otherConversations = previousConversations.filter(c => c.id !== input.conversationId);
        
        if (otherConversations.length > 0) {
          // Get last 3 conversations for context
          const recentConversations = otherConversations.slice(0, 3);
          const conversationTitles = recentConversations.map(c => c.title).filter(Boolean);
          
          enhancedSystemPrompt += `\n\n**USER HISTORY:**\nThis user has ${otherConversations.length} previous conversation(s) with you. Recent topics: ${conversationTitles.join(", ")}.`;
          
          // Add recent files context
          if (filesWithContent.length > 0) {
            enhancedSystemPrompt += `\n\n**RECENT FILES:**\nThe user has uploaded ${filesWithContent.length} file(s) recently:`;
            filesWithContent.forEach(file => {
              const uploadDate = new Date(file.uploadedAt).toLocaleDateString();
              enhancedSystemPrompt += `\n- ${file.fileName} (${file.fileCategory}, uploaded ${uploadDate})`;
              if (file.transcriptionText) {
                enhancedSystemPrompt += `\n  Content: "${file.transcriptionText.substring(0, 200)}${file.transcriptionText.length > 200 ? '...' : ''}"`;  
              }
            });
            enhancedSystemPrompt += "\n\nYou can reference these files naturally in your response if relevant. For example: 'I listened to your voice memo from Tuesday. You sounded stressed about the deadline...'";
          }
          
          enhancedSystemPrompt += `\n\n**GREETING PROTOCOL:**\nSince this is a returning user, acknowledge their previous work with you. Reference their recent topics naturally. Show continuity and progress tracking. Example: "Welcome back! Last time we worked on [topic]. How has that been going?"\n\nUse MODE 3 (CONVERSATIONAL COACHING) to show you remember them, then transition to MODE 1 if they present a new problem.`;
        } else {
          enhancedSystemPrompt += "\n\n**CURRENT CONTEXT:** This is the user's first conversation with you. Use MODE 1 (STRUCTURED PROTOCOL) to establish trust and provide immediate value.";
        }
      } else if (isFollowUp) {
        // Add recent files context for follow-up messages too
        if (filesWithContent.length > 0) {
          enhancedSystemPrompt += `\n\n**RECENT FILES:**\nThe user has uploaded ${filesWithContent.length} file(s) recently. You can reference them if relevant to the current conversation.`;
        }
        enhancedSystemPrompt += "\n\n**CURRENT CONTEXT:** This is a follow-up message in an ongoing conversation. Consider using MODE 3 (CONVERSATIONAL COACHING) to reference previous messages and show continuity. Only use MODE 1 if they present a new crisis or problem.";
      }

      // Add system prompt
      if (conversationHistory.length === 0 || conversationHistory[0].role !== "system") {
        conversationHistory.unshift({
          role: "system",
          content: enhancedSystemPrompt,
        });
      }

      // Add current user message
      conversationHistory.push({
        role: "user",
        content: input.message,
      });

      // Get AI response
      let aiResponse: string;
      try {
        const response = await invokeLLM({
          messages: conversationHistory,
        });

        const content = response.choices[0]?.message?.content;
        aiResponse = typeof content === 'string' ? content : "I'm here to help. Could you tell me more?";
      } catch (error) {
        console.error("[AI Chat] LLM error:", error);
        aiResponse = "I'm having trouble connecting right now. Please try again in a moment, or reach out to your coach directly if this is urgent.";
      }

      // Add crisis warning if detected
      if (crisisFlag === "critical" || crisisFlag === "high") {
        aiResponse = `⚠️ **I'm concerned about what you shared.** If you're in immediate danger, please call 988 (Suicide & Crisis Lifeline) or 911 right away.\n\n${aiResponse}\n\n**Your coach has been notified and will reach out to you as soon as possible.**`;
      }

      // Save AI response
      await addMessage({
        conversationId: input.conversationId,
        role: "assistant",
        content: aiResponse,
        crisisFlag: "none",
      });

      // Auto-generate title from first exchange
      if (data.messages.length === 0 && !data.conversation.title) {
        try {
          const titleResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "Generate a short, empathetic title (3-6 words) for this conversation. Return ONLY the title, no quotes or punctuation.",
              },
              {
                role: "user",
                content: input.message,
              },
            ],
          });

          const titleContent = titleResponse.choices[0]?.message?.content;
          const title = typeof titleContent === 'string' ? titleContent.trim() : "New Conversation";
          await updateConversationTitle(input.conversationId, title);
        } catch (error) {
          console.error("[AI Chat] Title generation error:", error);
        }
      }

      return {
        response: aiResponse,
        crisisFlag,
      };
    }),

  /**
   * Delete a conversation
   */
  deleteConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const data = await getConversationWithMessages(input.conversationId);
      if (!data || data.conversation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid conversation",
        });
      }

      await deleteConversation(input.conversationId);

      return { success: true };
    }),
});
