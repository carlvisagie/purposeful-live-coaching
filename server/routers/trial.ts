/**
 * Trial Router - tRPC endpoints for trial system
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { 
  getOrCreateAnonymousUser, 
  canSendAiMessage, 
  getUserTierStatus,
  TIERS,
  TIER_LIMITS 
} from "../trialSystem";

export const trialRouter = router({
  /**
   * Initialize or retrieve anonymous user
   */
  initializeUser: publicProcedure
    .input(z.object({
      anonymousId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await getOrCreateAnonymousUser(input.anonymousId);
        return {
          userId: result.userId,
          tier: result.tier,
          trialEndsAt: result.trialEndsAt?.toISOString() || null,
          isTrialExpired: result.isTrialExpired,
          daysRemaining: result.daysRemaining,
        };
      } catch (error) {
        console.error("[Trial] Failed to initialize user:", error);
        throw error;
      }
    }),

  /**
   * Check if user can send an AI message
   */
  checkMessageLimit: publicProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await canSendAiMessage(input.userId);
        return result;
      } catch (error) {
        console.error("[Trial] Failed to check message limit:", error);
        return { allowed: false, reason: "Error checking limit" };
      }
    }),

  /**
   * Get user's current tier status
   */
  getTierStatus: publicProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const status = await getUserTierStatus(input.userId);
        return {
          tier: status.tier,
          status: status.status,
          trialEndsAt: status.trialEndsAt?.toISOString() || null,
          isTrialExpired: status.isTrialExpired,
          daysRemaining: status.daysRemaining,
          limits: status.limits,
        };
      } catch (error) {
        console.error("[Trial] Failed to get tier status:", error);
        return {
          tier: TIERS.FREE,
          status: "error",
          trialEndsAt: null,
          isTrialExpired: true,
          daysRemaining: 0,
          limits: TIER_LIMITS[TIERS.FREE],
        };
      }
    }),

  /**
   * Get tier definitions (for UI display)
   */
  getTierDefinitions: publicProcedure.query(() => {
    return {
      tiers: TIERS,
      limits: TIER_LIMITS,
    };
  }),
});
