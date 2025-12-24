/**
 * SELF-FIXING ROUTER
 * 
 * API endpoints for monitoring self-fixing capabilities and viewing error analytics.
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import SelfFixing from "../selfFixing";

export const selfFixingRouter = router({
  /**
   * Get self-fixing statistics
   */
  getStats: publicProcedure.query(() => {
    return SelfFixing.getSelfFixingStats();
  }),

  /**
   * Get all health checks
   */
  getHealthChecks: publicProcedure.query(() => {
    return SelfFixing.getAllHealthChecks();
  }),

  /**
   * Get health check for specific service
   */
  getServiceHealth: publicProcedure
    .input(z.object({ service: z.string() }))
    .query(({ input }) => {
      return SelfFixing.getServiceHealth(input.service);
    }),

  /**
   * Analyze error patterns and get recommendations
   */
  analyzeErrors: protectedProcedure.query(() => {
    return SelfFixing.analyzeErrorPatterns();
  }),

  /**
   * Trigger manual health check for a service
   */
  triggerHealthCheck: protectedProcedure
    .input(z.object({
      service: z.string(),
      endpoint: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await SelfFixing.checkHealth(input.service, async () => {
        // Basic connectivity check
        try {
          if (input.endpoint) {
            const response = await fetch(input.endpoint, { method: "HEAD" });
            return response.ok;
          }
          return true;
        } catch {
          return false;
        }
      });
    }),
});
