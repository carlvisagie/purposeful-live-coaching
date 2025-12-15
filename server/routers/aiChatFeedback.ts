/**
 * AI Chat Feedback Router
 * Handles conversation ratings, feedback collection, and quality monitoring
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { aiChatConversations } from "../../drizzle/schema";
import { eq, and, isNull, isNotNull, desc, sql } from "drizzle-orm";

export const aiChatFeedbackRouter = router({
  /**
   * Rate a conversation (thumbs up/down or 1-5 stars)
   */
  rateConversation: publicProcedure
    .input(
      z.object({
        conversationId: z.number(),
        wasHelpful: z.enum(["yes", "no"]).optional(),
        rating: z.number().min(1).max(5).optional(),
        feedbackText: z.string().optional(),
        feedbackCategory: z.enum(["helpful", "unhelpful", "inappropriate", "technical_error", "other"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get user ID (null for anonymous users)
      const userId = ctx.user?.id || null;

      // Verify conversation exists and belongs to user (or is anonymous)
      const [conversation] = await db
        .select()
        .from(aiChatConversations)
        .where(
          and(
            eq(aiChatConversations.id, input.conversationId),
            userId !== null 
              ? eq(aiChatConversations.userId, userId)
              : isNull(aiChatConversations.userId)
          )
        )
        .limit(1);

      if (!conversation) {
        throw new Error("Conversation not found or access denied");
      }

      // Update conversation with rating/feedback
      await db
        .update(aiChatConversations)
        .set({
          wasHelpful: input.wasHelpful,
          rating: input.rating,
          feedbackText: input.feedbackText,
          feedbackCategory: input.feedbackCategory,
          updated_at: new Date(),
        })
        .where(eq(aiChatConversations.id, input.conversationId));

      return { success: true };
    }),

  /**
   * Get quality metrics for admin dashboard
   */
  getQualityMetrics: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    // Only allow admins to view quality metrics
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get overall statistics
    const [totalConversations] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiChatConversations);

    const [ratedConversations] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiChatConversations)
      .where(isNotNull(aiChatConversations.rating));

    const [helpfulCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiChatConversations)
      .where(eq(aiChatConversations.wasHelpful, "yes"));

    const [unhelpfulCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiChatConversations)
      .where(eq(aiChatConversations.wasHelpful, "no"));

    const [avgRating] = await db
      .select({ avg: sql<number>`avg(rating)` })
      .from(aiChatConversations)
      .where(isNotNull(aiChatConversations.rating));

    // Get feedback breakdown by category
    const feedbackByCategory = await db
      .select({
        category: aiChatConversations.feedbackCategory,
        count: sql<number>`count(*)`,
      })
      .from(aiChatConversations)
      .where(isNotNull(aiChatConversations.feedbackCategory))
      .groupBy(aiChatConversations.feedbackCategory);

    return {
      totalConversations: totalConversations.count || 0,
      ratedConversations: ratedConversations.count || 0,
      helpfulCount: helpfulCount.count || 0,
      unhelpfulCount: unhelpfulCount.count || 0,
      averageRating: avgRating.avg ? parseFloat(avgRating.avg.toFixed(2)) : null,
      feedbackByCategory,
      ratingPercentage: totalConversations.count > 0 
        ? ((ratedConversations.count / totalConversations.count) * 100).toFixed(1)
        : "0",
      helpfulPercentage: (helpfulCount.count + unhelpfulCount.count) > 0
        ? ((helpfulCount.count / (helpfulCount.count + unhelpfulCount.count)) * 100).toFixed(1)
        : "0",
    };
  }),

  /**
   * Get conversations that need review (low ratings, negative feedback, crisis flags)
   */
  getConversationsNeedingReview: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    // Only allow admins
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Get conversations with low ratings or negative feedback
    const conversations = await db
      .select()
      .from(aiChatConversations)
      .where(
        and(
          eq(aiChatConversations.reviewedByAdmin, "no"),
          sql`(
            rating <= 2 OR 
            wasHelpful = 'no' OR 
            feedbackCategory IN ('unhelpful', 'inappropriate', 'technical_error')
          )`
        )
      )
      .orderBy(desc(aiChatConversations.createdAt))
      .limit(50);

    return conversations;
  }),

  /**
   * Mark conversation as reviewed by admin
   */
  markAsReviewed: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only allow admins
      if (ctx.user.role !== "admin") {
        throw new Error("Admin access required");
      }

      await db
        .update(aiChatConversations)
        .set({
          reviewedByAdmin: "yes",
          adminNotes: input.adminNotes,
          updated_at: new Date(),
        })
        .where(eq(aiChatConversations.id, input.conversationId));

      return { success: true };
    }),

  /**
   * Get all conversations with ratings/feedback for admin review
   */
  getAllConversationsWithFeedback: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        filterBy: z.enum(["all", "rated", "unrated", "helpful", "unhelpful", "needs_review"]).default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { conversations: [], total: 0 };

      // Only allow admins
      if (ctx.user.role !== "admin") {
        throw new Error("Admin access required");
      }

      // Build filter condition
      let filterCondition = undefined;
      if (input.filterBy === "rated") {
        filterCondition = isNotNull(aiChatConversations.rating);
      } else if (input.filterBy === "unrated") {
        filterCondition = isNull(aiChatConversations.rating);
      } else if (input.filterBy === "helpful") {
        filterCondition = eq(aiChatConversations.wasHelpful, "yes");
      } else if (input.filterBy === "unhelpful") {
        filterCondition = eq(aiChatConversations.wasHelpful, "no");
      } else if (input.filterBy === "needs_review") {
        filterCondition = eq(aiChatConversations.reviewedByAdmin, "no");
      }

      // Get conversations
      const conversations = await db
        .select()
        .from(aiChatConversations)
        .where(filterCondition)
        .orderBy(desc(aiChatConversations.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      // Get total count
      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(aiChatConversations)
        .where(filterCondition);

      return {
        conversations,
        total: countResult.count || 0,
      };
    }),
});
