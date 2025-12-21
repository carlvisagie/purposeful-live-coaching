/**
 * Profile Guard Monitor Router
 * 
 * Exposes endpoints for monitoring the ProfileGuard system:
 * - Health checks
 * - Access logs
 * - Alerts
 * - Statistics
 * 
 * This ensures we can monitor that the "never forget" system is working.
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import ProfileGuard from "../profileGuard";

export const profileGuardMonitorRouter = router({
  /**
   * Health check - is the ProfileGuard system working?
   */
  healthCheck: publicProcedure.query(async () => {
    const health = ProfileGuard.checkHealth();
    const stats = ProfileGuard.getAccessStats();
    
    return {
      status: health.healthy ? "healthy" : "degraded",
      issues: health.issues,
      stats: {
        totalAccesses: stats.totalAccesses,
        successRate: `${stats.successRate.toFixed(1)}%`,
        averageProfileCompleteness: `${stats.averageCompleteness.toFixed(0)}%`,
      },
      timestamp: new Date().toISOString(),
    };
  }),

  /**
   * Get detailed statistics
   */
  getStats: protectedProcedure.query(async () => {
    return ProfileGuard.getAccessStats();
  }),

  /**
   * Get recent access logs
   */
  getAccessLogs: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(1000).default(100),
    }))
    .query(async ({ input }) => {
      return ProfileGuard.getAccessLogs(input.limit);
    }),

  /**
   * Get recent alerts
   */
  getAlerts: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      return ProfileGuard.getAlerts(input.limit);
    }),

  /**
   * Get module breakdown - which modules are using ProfileGuard
   */
  getModuleBreakdown: protectedProcedure.query(async () => {
    const stats = ProfileGuard.getAccessStats();
    
    // Sort by usage
    const sorted = Object.entries(stats.moduleBreakdown)
      .sort(([, a], [, b]) => b - a)
      .map(([module, count]) => ({
        module,
        count,
        percentage: stats.totalAccesses > 0 
          ? `${((count / stats.totalAccesses) * 100).toFixed(1)}%` 
          : "0%",
      }));
    
    return {
      modules: sorted,
      totalModules: sorted.length,
      totalAccesses: stats.totalAccesses,
    };
  }),

  /**
   * Get continuity report - are we maintaining perfect continuity?
   */
  getContinuityReport: protectedProcedure.query(async () => {
    const stats = ProfileGuard.getAccessStats();
    const alerts = ProfileGuard.getAlerts(100);
    
    // Calculate continuity score
    const continuityScore = Math.min(100, Math.round(
      (stats.successRate * 0.5) + 
      (stats.averageCompleteness * 0.3) +
      (alerts.filter(a => a.severity === "critical").length === 0 ? 20 : 0)
    ));
    
    // Identify issues
    const issues: string[] = [];
    
    if (stats.successRate < 99) {
      issues.push(`Profile load success rate is ${stats.successRate.toFixed(1)}% - should be 99%+`);
    }
    
    if (stats.averageCompleteness < 30) {
      issues.push(`Average profile completeness is ${stats.averageCompleteness.toFixed(0)}% - users may feel unknown`);
    }
    
    const criticalAlerts = alerts.filter(a => a.severity === "critical");
    if (criticalAlerts.length > 0) {
      issues.push(`${criticalAlerts.length} critical alerts - some users may have been forgotten`);
    }
    
    // Recommendations
    const recommendations: string[] = [];
    
    if (stats.averageCompleteness < 50) {
      recommendations.push("Encourage AI coaches to ask more discovery questions");
    }
    
    if (stats.recentFailures.length > 0) {
      recommendations.push("Investigate recent profile load failures");
    }
    
    return {
      continuityScore,
      grade: continuityScore >= 95 ? "A+" : 
             continuityScore >= 90 ? "A" :
             continuityScore >= 80 ? "B" :
             continuityScore >= 70 ? "C" : "F",
      message: continuityScore >= 95 
        ? "Perfect continuity! Every client feels remembered." 
        : continuityScore >= 80 
        ? "Good continuity, but room for improvement."
        : "Continuity needs attention - clients may feel forgotten.",
      stats: {
        successRate: `${stats.successRate.toFixed(1)}%`,
        averageCompleteness: `${stats.averageCompleteness.toFixed(0)}%`,
        totalAccesses: stats.totalAccesses,
      },
      issues,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }),
});

export default profileGuardMonitorRouter;
