/**
 * PERPETUAL UPGRADE ROUTER
 * 
 * API endpoints for the self-improving code system
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import PerpetualUpgrade from "../perpetualUpgrade";

export const perpetualUpgradeRouter = router({
  /**
   * Get system health assessment
   */
  getSystemHealth: publicProcedure.query(async () => {
    return PerpetualUpgrade.assessSystemHealth();
  }),

  /**
   * Get feature usage report
   */
  getFeatureUsage: protectedProcedure.query(async () => {
    return PerpetualUpgrade.getFeatureUsageReport();
  }),

  /**
   * Get performance report
   */
  getPerformanceReport: protectedProcedure.query(async () => {
    return PerpetualUpgrade.getPerformanceReport();
  }),

  /**
   * Get upgrade recommendations
   */
  getRecommendations: protectedProcedure.query(async () => {
    return PerpetualUpgrade.getUpgradeRecommendations();
  }),

  /**
   * Run code quality scan
   */
  scanCodeQuality: protectedProcedure.mutation(async () => {
    return PerpetualUpgrade.scanCodeQuality();
  }),

  /**
   * Run daily health check
   */
  runHealthCheck: protectedProcedure.mutation(async () => {
    return PerpetualUpgrade.runDailyHealthCheck();
  }),

  /**
   * Get AI suggestions for code improvement
   */
  suggestImprovements: protectedProcedure
    .input(z.object({
      filePath: z.string(),
      code: z.string(),
    }))
    .mutation(async ({ input }) => {
      return PerpetualUpgrade.suggestCodeImprovements(input.filePath, input.code);
    }),

  /**
   * Report an error for learning
   */
  reportError: publicProcedure
    .input(z.object({
      endpoint: z.string(),
      errorMessage: z.string(),
      stackTrace: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const suggestion = await PerpetualUpgrade.learnFromError(
        input.endpoint,
        input.errorMessage,
        input.stackTrace
      );
      return { suggestion };
    }),

  /**
   * Track feature usage
   */
  trackUsage: publicProcedure
    .input(z.object({
      featureId: z.string(),
      featureName: z.string(),
      endpoint: z.string(),
      userId: z.number().optional(),
      responseTime: z.number().optional(),
      hadError: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      PerpetualUpgrade.trackFeatureUsage(
        input.featureId,
        input.featureName,
        input.endpoint,
        input.userId,
        input.responseTime,
        input.hadError
      );
      return { success: true };
    }),

  /**
   * Get dashboard summary for owner
   */
  getDashboard: protectedProcedure.query(async () => {
    const health = PerpetualUpgrade.assessSystemHealth();
    const features = PerpetualUpgrade.getFeatureUsageReport();
    const performance = PerpetualUpgrade.getPerformanceReport();
    const recommendations = PerpetualUpgrade.getUpgradeRecommendations();

    return {
      health,
      features: {
        total: features.totalFeatures,
        active: features.activeFeatures,
        unused: features.unusedFeatures.length,
        declining: features.decliningFeatures.length,
      },
      performance: {
        overallHealth: performance.overallHealth,
        slowEndpoints: performance.slowEndpoints.length,
        errorProne: performance.errorProneEndpoints.length,
      },
      recommendations: {
        total: recommendations.length,
        critical: recommendations.filter(r => r.priority === "critical").length,
        high: recommendations.filter(r => r.priority === "high").length,
      },
      lastUpdated: new Date(),
    };
  }),
});
