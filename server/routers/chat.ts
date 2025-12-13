import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import OpenAI from "openai";
import { db } from "../db";
import { aiChatConversations, aiChatMessages, clients } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { extractProfileFromConversation } from "../lib/ai/extraction";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * Chat Router
 * Truly conversational AI chat that remembers context and responds naturally
 */
export const chatRouter = router({
  /**
   * Send a chat message - CONVERSATIONAL AI
   * Remembers context, extracts profile data, detects escalations
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string().min(1),
        type: z.enum(["corporate", "individual"]),
        routeToTeam: z.enum(["sales", "support"]),
        session_id: z.string().optional(), // For conversation continuity
      })
    )
    .mutation(async ({ input }) => {
      console.log("Chat message received:", {
        ...input,
        timestamp: new Date().toISOString(),
      });

      try {
        // Get or create conversation
        let conversationId = input.sessionId;
        let conversationHistory: any[] = [];

        if (conversationId) {
          // Load existing conversation
          const messages = await db
            .select()
            .from(aiChatMessages)
            .where(eq(aiChatMessages.conversationId, parseInt(conversationId)))
            .orderBy(aiChatMessages.createdAt)
            .limit(20); // Last 20 messages for context

          conversationHistory = messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));
        } else {
          // Create new conversation
          const [newConv] = await db
            .insert(aiChatConversations)
            .values({
              user_id: null, // Anonymous for now
              client_id: null,
              startedAt: new Date(),
            })
            .$returningId();

          conversationId = newConv.id.toString();
        }

        // Save user message
        await db.insert(aiChatMessages).values({
          conversationId: parseInt(conversationId),
          role: "user",
          content: input.message,
          created_at: new Date(),
        });

        // Build system prompt based on type
        const systemPrompt =
          input.type === "corporate"
            ? `You are a helpful sales assistant for Purposeful Live Coaching's enterprise platform. 
Your goal is to:
1. Understand the company's needs (size, industry, pain points)
2. Explain how our emotional resilience platform helps organizations
3. Guide them to book a demo or speak with sales
4. Be warm, professional, and consultative

Key offerings:
- Enterprise plans start at $2,500/month for up to 50 employees
- Custom pricing for larger organizations
- 24/7 AI coaching + human coaching options
- Analytics dashboard for HR teams
- Crisis detection and escalation

Keep responses concise (2-3 sentences). Ask clarifying questions.`
            : `You are a compassionate AI coach for Purposeful Live Coaching. 
Your goal is to:
1. Listen without judgment and validate their feelings
2. Understand what brings them here (stress, anxiety, life transitions, etc.)
3. Gently guide them toward our coaching plans
4. Detect if they need immediate human support or crisis intervention

Pricing:
- AI Coaching: $29/mo (24/7 AI chat)
- Hybrid: $149/mo (AI + 1 human session/month)
- Premium: $299/mo (AI + 4 human sessions/month)

Keep responses warm, empathetic, and conversational (2-4 sentences). 
Focus on understanding their situation before pitching.`;

        // Call OpenAI with conversation history
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: input.message },
          ],
          temperature: 0.8,
          max_tokens: 200,
        });

        const aiReply = completion.choices[0]?.message?.content || "I'm here to help. Could you tell me more?";

        // Save AI response
        await db.insert(aiChatMessages).values({
          conversationId: parseInt(conversationId),
          role: "assistant",
          content: aiReply,
          created_at: new Date(),
        });

        // Extract profile data in background (for individual chats)
        if (input.type === "individual" && conversationHistory.length >= 4) {
          // Only extract after a few exchanges
          extractProfileFromConversation(parseInt(conversationId))
            .then((extracted) => {
              console.log("Profile extracted:", extracted);
              // Profile will be saved by the extraction function
            })
            .catch((err) => console.error("Profile extraction failed:", err));
        }

        // Detect escalation needs
        const needsEscalation = detectEscalation(input.message);

        return {
          success: true,
          reply: aiReply,
          conversationId,
          routedTo: input.routeToTeam,
          timestamp: new Date().toISOString(),
          needsEscalation,
        };
      } catch (error) {
        console.error("Chat error:", error);
        
        // Fallback response
        return {
          success: false,
          reply: "I'm having trouble connecting right now. Please try again in a moment, or call us directly if it's urgent.",
          conversationId: input.sessionId || "",
          routedTo: input.routeToTeam,
          timestamp: new Date().toISOString(),
          needsEscalation: false,
        };
      }
    }),

  /**
   * Get chat history for a session
   */
  getHistory: publicProcedure
    .input(
      z.object({
        session_id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const messages = await db
        .select()
        .from(aiChatMessages)
        .where(eq(aiChatMessages.conversationId, parseInt(input.sessionId)))
        .orderBy(aiChatMessages.createdAt);

      return {
        session_id: input.sessionId,
        messages: messages.map((msg) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
        })),
      };
    }),
});

/**
 * Detect if message indicates need for human escalation
 */
function detectEscalation(message: string): boolean {
  const escalationKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "harm myself",
    "emergency",
    "crisis",
    "urgent",
    "can't go on",
  ];

  const lowerMessage = message.toLowerCase();
  return escalationKeywords.some((keyword) => lowerMessage.includes(keyword));
}
