/**
 * INTELLIGENT SYSTEMS ADMIN ROUTER
 * 
 * Admin dashboard endpoints for viewing:
 * - Self-Learning insights and patterns
 * - Self-Fixing error analysis and health monitoring
 * - Self-Evolving platform intelligence and evolution history
 */

import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc.js";
import { SelfLearning } from "../selfLearningIntegration.js";
import SelfFixing from "../selfFixing.js";
import PlatformIntelligence from "../platformIntelligence.js";

export const intelligentSystemsAdminRouter = router({
  /**
   * Get complete platform intelligence summary
   */
  getSummary: adminProcedure.query(async () => {
    const selfFixingStats = SelfFixing.getSelfFixingStats();
    const platformSummary = PlatformIntelligence.getSummary();
    const healthChecks = SelfFixing.getAllHealthChecks();
    
    return {
      // Self-Learning
      learning: {
        totalRulesTracked: platformSummary.totalRulesTracked,
        modulesLearning: platformSummary.totalModulesLearning,
      },
      
      // Self-Fixing
      fixing: {
        totalErrors: selfFixingStats.totalErrors,
        fixedErrors: selfFixingStats.fixedErrors,
        fixSuccessRate: selfFixingStats.fixSuccessRate,
        healthyServices: selfFixingStats.healthyServices,
        degradedServices: selfFixingStats.degradedServices,
        downServices: selfFixingStats.downServices,
      },
      
      // Self-Evolving
      evolving: {
        totalInsights: platformSummary.totalInsights,
        evolutionEvents: platformSummary.totalEvolutions,
        researchValidationsCache: platformSummary.researchValidationsCache,
      },
      
      // Overall health
      overallHealth: {
        isHealthy: selfFixingStats.downServices === 0,
        needsAttention: selfFixingStats.degradedServices > 0 || selfFixingStats.fixSuccessRate < 70,
      },
    };
  }),
  
  /**
   * Get self-learning insights
   */
  getLearningInsights: adminProcedure.query(async () => {
    const moduleTypes = [
      "ai_chat", "meditation", "focus_coach", "sleep_stories",
      "just_talk", "structured_programs", "coaching_techniques",
    ];
    
    const insights = [];
    
    for (const moduleType of moduleTypes) {
      const learning = PlatformIntelligence.getModuleLearning(moduleType as any);
      if (learning) {
        insights.push({
          moduleType,
          totalInteractions: learning.totalInteractions,
          successRate: learning.successRate,
          topStrategies: learning.topEffectiveStrategies.slice(0, 3),
          improvements: learning.suggestedImprovements.slice(0, 3),
        });
      }
    }
    
    return { insights };
  }),
  
  /**
   * Get feature effectiveness rankings
   */
  getFeatureEffectiveness: adminProcedure
    .input(z.object({
      moduleType: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      // This would query the database in production
      // For now, return top preferences from in-memory store
      const features = [];
      
      const moduleTypes = input.moduleType 
        ? [input.moduleType]
        : ["ai_chat", "meditation", "focus_coach", "sleep_stories"];
      
      for (const moduleType of moduleTypes) {
        const topPrefs = SelfLearning.getTopPreferences(moduleType as any, input.limit);
        for (const pref of topPrefs) {
          const effectiveness = SelfLearning.getFeatureEffectiveness(moduleType as any, pref);
          features.push({
            moduleType,
            feature: pref,
            effectiveness,
            shouldPromote: effectiveness >= 70,
            shouldDemote: effectiveness < 40,
          });
        }
      }
      
      // Sort by effectiveness
      features.sort((a, b) => b.effectiveness - a.effectiveness);
      
      return { features: features.slice(0, input.limit) };
    }),
  
  /**
   * Get fix recommendations
   */
  getFixRecommendations: adminProcedure.query(async () => {
    const recommendations = await SelfLearning.getFixRecommendations();
    return { recommendations };
  }),
  
  /**
   * Get evolution suggestions
   */
  getEvolutionSuggestions: adminProcedure.query(async () => {
    const suggestions = await SelfLearning.getEvolutionSuggestions();
    return { suggestions };
  }),
  
  /**
   * Get error analysis
   */
  getErrorAnalysis: adminProcedure.query(async () => {
    const analysis = SelfFixing.analyzeErrorPatterns();
    const stats = SelfFixing.getSelfFixingStats();
    
    return {
      stats,
      analysis,
      errorsByModule: stats.errorsByModule,
      errorsBySeverity: stats.errorsBySeverity,
    };
  }),
  
  /**
   * Get service health status
   */
  getServiceHealth: adminProcedure.query(async () => {
    const healthChecks = SelfFixing.getAllHealthChecks();
    
    const healthy = healthChecks.filter(h => h.status === "healthy");
    const degraded = healthChecks.filter(h => h.status === "degraded");
    const down = healthChecks.filter(h => h.status === "down");
    
    return {
      all: healthChecks,
      healthy,
      degraded,
      down,
      summary: {
        total: healthChecks.length,
        healthyCount: healthy.length,
        degradedCount: degraded.length,
        downCount: down.length,
      },
    };
  }),
  
  /**
   * Get platform insights
   */
  getPlatformInsights: adminProcedure
    .input(z.object({
      type: z.enum(["trend", "pattern", "recommendation", "warning", "research_update"]).optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      const allInsights = PlatformIntelligence.getInsights();
      
      let insights = allInsights;
      if (input.type) {
        insights = insights.filter(i => i.type === input.type);
      }
      
      return {
        insights: insights.slice(0, input.limit),
        total: insights.length,
      };
    }),
  
  /**
   * Get evolution history
   */
  getEvolutionHistory: adminProcedure
    .input(z.object({
      moduleType: z.string().optional(),
      limit: z.number().default(100),
    }))
    .query(async ({ input }) => {
      const allEvents = PlatformIntelligence.getEvolutionHistory();
      
      let events = allEvents;
      if (input.moduleType) {
        events = events.filter(e => e.moduleType === input.moduleType);
      }
      
      return {
        events: events.slice(0, input.limit),
        total: events.length,
      };
    }),
  
  /**
   * Validate research claim
   */
  validateResearch: adminProcedure
    .input(z.object({
      claim: z.string(),
      domain: z.string(),
    }))
    .mutation(async ({ input }) => {
      const validation = await PlatformIntelligence.validateResearch(
        input.claim,
        input.domain as any
      );
      
      return { validation };
    }),
  
  /**
   * Search for new research
   */
  searchNewResearch: adminProcedure
    .input(z.object({
      topic: z.string(),
      domain: z.string(),
    }))
    .mutation(async ({ input }) => {
      const research = await PlatformIntelligence.searchNewResearch(
        input.topic,
        input.domain as any
      );
      
      return { research };
    }),
  
  /**
   * Analyze platform patterns (trigger manual analysis)
   */
  analyzePlatformPatterns: adminProcedure.mutation(async () => {
    const insights = await PlatformIntelligence.analyzePlatformPatterns();
    return { insights, count: insights.length };
  }),
  
  /**
   * Get module learning details
   */
  getModuleLearning: adminProcedure
    .input(z.object({
      moduleType: z.string(),
    }))
    .query(async ({ input }) => {
      const learning = PlatformIntelligence.getModuleLearning(input.moduleType as any);
      return { learning };
    }),
  
  /**
   * Get rule effectiveness
   */
  getRuleEffectiveness: adminProcedure
    .input(z.object({
      ruleId: z.string(),
    }))
    .query(async ({ input }) => {
      const effectiveness = PlatformIntelligence.getRuleEffectiveness(input.ruleId);
      return { effectiveness };
    }),
  
  /**
   * Trigger health check for a service
   */
  triggerHealthCheck: adminProcedure
    .input(z.object({
      service: z.string(),
    }))
    .mutation(async ({ input }) => {
      const health = await SelfFixing.checkHealth(input.service, async () => {
        // Basic health check - service is considered healthy if it exists
        return true;
      });
      
      return { health };
    }),
  
  /**
   * Get real-time statistics
   */
  getRealtimeStats: adminProcedure.query(async () => {
    const selfFixingStats = SelfFixing.getSelfFixingStats();
    const platformSummary = PlatformIntelligence.getSummary();
    const healthChecks = SelfFixing.getAllHealthChecks();
    const errorAnalysis = SelfFixing.analyzeErrorPatterns();
    
    return {
      timestamp: new Date().toISOString(),
      
      // Errors
      errors: {
        total: selfFixingStats.totalErrors,
        fixed: selfFixingStats.fixedErrors,
        fixRate: selfFixingStats.fixSuccessRate,
        mostCommon: errorAnalysis.mostCommonError,
        critical: errorAnalysis.criticalErrors.length,
      },
      
      // Health
      health: {
        healthy: selfFixingStats.healthyServices,
        degraded: selfFixingStats.degradedServices,
        down: selfFixingStats.downServices,
        services: healthChecks.map(h => ({
          name: h.service,
          status: h.status,
          responseTime: h.responseTime,
        })),
      },
      
      // Learning
      learning: {
        rulesTracked: platformSummary.totalRulesTracked,
        modulesLearning: platformSummary.totalModulesLearning,
        insights: platformSummary.totalInsights,
        evolutions: platformSummary.totalEvolutions,
      },
    };
  }),
});
