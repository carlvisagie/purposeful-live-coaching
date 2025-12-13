/**
 * Coach Client History router - View complete client interaction history
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { 
  aiChatConversations,
  aiChatMessages,
  humanSessionBookings,
  users,
  subscriptions
} from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const coachClientHistoryRouter = router({
  /**
   * Get complete client history for coach preparation
   */
  getClientHistory: protectedProcedure
    .input(z.object({ 
      clientUserId: z.number() 
    }))
    .query(async ({ input, ctx }) => {
      // Only coaches/admins can access client history
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only coaches can access client history",
        });
      }

      // Get client basic info
      const [client] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.clientUserId))
        .limit(1);

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // Get client subscription info
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, input.clientUserId))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      // Get all AI conversations
      const aiConversations = await db
        .select()
        .from(aiChatConversations)
        .where(eq(aiChatConversations.userId, input.clientUserId))
        .orderBy(desc(aiChatConversations.createdAt));

      // Get all AI messages for these conversations
      const conversationIds = aiConversations.map(c => c.id);
      const aiMessages = conversationIds.length > 0
        ? await db
            .select()
            .from(aiChatMessages)
            .where(
              and(
                ...conversationIds.map(id => 
                  eq(aiChatMessages.conversationId, id)
                )
              )
            )
            .orderBy(aiChatMessages.createdAt)
        : [];

      // Get all human session bookings
      const humanSessions = await db
        .select()
        .from(humanSessionBookings)
        .where(eq(humanSessionBookings.userId, input.clientUserId))
        .orderBy(desc(humanSessionBookings.sessionDate));

      // Count crisis flags
      const crisisCount = aiMessages.filter(m => m.crisisFlag).length;

      // Get most recent topics (last 5 AI conversations)
      const recentTopics = aiConversations
        .slice(0, 5)
        .map(c => c.title)
        .filter(Boolean);

      // Calculate engagement metrics
      const totalAIMessages = aiMessages.filter(m => m.role === "user").length;
      const totalHumanSessions = humanSessions.length;
      const lastActivity = aiConversations[0]?.updatedAt || humanSessions[0]?.updatedAt;

      return {
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          created_at: client.createdAt,
          lastActivity,
        },
        subscription: subscription || null,
        aiConversations: aiConversations.map(conv => ({
          ...conv,
          messages: aiMessages.filter(m => m.conversationId === conv.id),
        })),
        humanSessions,
        summary: {
          totalAIConversations: aiConversations.length,
          totalAIMessages,
          totalHumanSessions,
          crisisCount,
          recentTopics,
        },
      };
    }),

  /**
   * Get pre-call brief for a specific client
   */
  getPreCallBrief: protectedProcedure
    .input(z.object({ 
      clientUserId: z.number() 
    }))
    .query(async ({ input, ctx }) => {
      // Only coaches/admins can access
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only coaches can access pre-call briefs",
        });
      }

      // Get last 3 AI conversations
      const recentConversations = await db
        .select()
        .from(aiChatConversations)
        .where(eq(aiChatConversations.userId, input.clientUserId))
        .orderBy(desc(aiChatConversations.updatedAt))
        .limit(3);

      // Get messages from these conversations
      const conversationIds = recentConversations.map(c => c.id);
      const recentMessages = conversationIds.length > 0
        ? await db
            .select()
            .from(aiChatMessages)
            .where(
              and(
                ...conversationIds.map(id => 
                  eq(aiChatMessages.conversationId, id)
                )
              )
            )
            .orderBy(desc(aiChatMessages.createdAt))
            .limit(10)
        : [];

      // Get last human session
      const [lastSession] = await db
        .select()
        .from(humanSessionBookings)
        .where(eq(humanSessionBookings.userId, input.clientUserId))
        .orderBy(desc(humanSessionBookings.sessionDate))
        .limit(1);

      // Check for recent crisis flags
      const recentCrisisMessages = recentMessages.filter(m => m.crisisFlag);

      return {
        recentConversations: recentConversations.map(conv => ({
          title: conv.title,
          updated_at: conv.updatedAt,
        })),
        lastSessionNotes: lastSession?.coachNotes || null,
        lastSessionDate: lastSession?.sessionDate || null,
        recentCrisisCount: recentCrisisMessages.length,
        keyTopics: recentConversations.map(c => c.title).filter(Boolean),
      };
    }),

  /**
   * Add session notes after a human coaching call
   */
  addSessionNotes: protectedProcedure
    .input(z.object({
      session_id: z.number(),
      notes: z.string().min(1).max(10000),
    }))
    .mutation(async ({ input, ctx }) => {
      // Only coaches/admins can add notes
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only coaches can add session notes",
        });
      }

      await db
        .update(humanSessionBookings)
        .set({
          coachNotes: input.notes,
          updated_at: new Date(),
        })
        .where(eq(humanSessionBookings.id, input.sessionId));

      return { success: true };
    }),
});
