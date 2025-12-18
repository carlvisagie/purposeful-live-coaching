/**
 * PLATFORM INTELLIGENCE ROUTER
 * 
 * API for the self-learning, self-evolving platform intelligence system.
 * Integrates Truth Keepers research validation with adaptive learning.
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import PlatformIntelligence, { ModuleType } from "../platformIntelligence";

const moduleTypeEnum = z.enum([
  "compliance",
  "emotional_wellness",
  "mental_health",
  "physical_fitness",
  "nutrition",
  "sleep",
  "relationships",
  "financial",
  "spiritual",
  "career",
  "coaching_techniques",
  "crisis_intervention",
]);

export const platformIntelligenceRouter = router({
  // ============================================================================
  // TRUTH KEEPERS - RESEARCH VALIDATION
  // ============================================================================

  /**
   * Validate a claim against empirical research
   * Only Level A and B evidence accepted
   */
  validateResearch: publicProcedure
    .input(z.object({
      claim: z.string().min(10).max(500),
      domain: moduleTypeEnum,
    }))
    .mutation(async ({ input }) => {
      const validation = await PlatformIntelligence.validateResearch(
        input.claim,
        input.domain
      );
      return validation;
    }),

  /**
   * Search for new research on a topic
   */
  searchNewResearch: publicProcedure
    .input(z.object({
      topic: z.string().min(5).max(200),
      domain: moduleTypeEnum,
    }))
    .mutation(async ({ input }) => {
      const research = await PlatformIntelligence.searchNewResearch(
        input.topic,
        input.domain
      );
      return research;
    }),

  /**
   * Discover evidence-based treatments for a condition
   * Includes conventional and emerging treatments (if empirically proven)
   */
  discoverTreatments: publicProcedure
    .input(z.object({
      condition: z.string().min(3).max(200),
    }))
    .mutation(async ({ input }) => {
      const treatments = await PlatformIntelligence.discoverTreatments(
        input.condition
      );
      return treatments;
    }),

  // ============================================================================
  // SELF-LEARNING ENGINE
  // ============================================================================

  /**
   * Record rule effectiveness from client interaction
   */
  recordRuleEffectiveness: publicProcedure
    .input(z.object({
      ruleId: z.string(),
      outcome: z.enum(["positive", "negative", "neutral"]),
      clientSatisfaction: z.number().min(1).max(10).optional(),
    }))
    .mutation(({ input }) => {
      PlatformIntelligence.recordRuleEffectiveness(
        input.ruleId,
        input.outcome,
        input.clientSatisfaction
      );
      return { success: true };
    }),

  /**
   * Record module interaction for learning
   */
  recordModuleInteraction: publicProcedure
    .input(z.object({
      moduleType: moduleTypeEnum,
      wasSuccessful: z.boolean(),
      strategy: z.string(),
      clientPreference: z.string().optional(),
    }))
    .mutation(({ input }) => {
      PlatformIntelligence.recordModuleInteraction(
        input.moduleType,
        input.wasSuccessful,
        input.strategy,
        input.clientPreference
      );
      return { success: true };
    }),

  /**
   * Update compliance rule based on client feedback
   */
  updateComplianceRuleFeedback: publicProcedure
    .input(z.object({
      ruleId: z.string(),
      wasHelpful: z.boolean(),
      clientFeedback: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await PlatformIntelligence.updateRuleFromFeedback(
        input.ruleId,
        input.wasHelpful,
        input.clientFeedback
      );
      return { success: true };
    }),

  // ============================================================================
  // PLATFORM INSIGHTS
  // ============================================================================

  /**
   * Analyze platform patterns and generate insights
   */
  analyzePlatformPatterns: protectedProcedure
    .mutation(async () => {
      const insights = await PlatformIntelligence.analyzePlatformPatterns();
      return { insights };
    }),

  /**
   * Get recent platform insights
   */
  getInsights: publicProcedure
    .query(() => {
      return { insights: PlatformIntelligence.getInsights() };
    }),

  /**
   * Get evolution history
   */
  getEvolutionHistory: publicProcedure
    .query(() => {
      return { history: PlatformIntelligence.getEvolutionHistory() };
    }),

  /**
   * Get rule effectiveness data
   */
  getRuleEffectiveness: publicProcedure
    .input(z.object({ ruleId: z.string() }))
    .query(({ input }) => {
      return { effectiveness: PlatformIntelligence.getRuleEffectiveness(input.ruleId) };
    }),

  /**
   * Get module learning data
   */
  getModuleLearning: publicProcedure
    .input(z.object({ moduleType: moduleTypeEnum }))
    .query(({ input }) => {
      return { learning: PlatformIntelligence.getModuleLearning(input.moduleType) };
    }),

  /**
   * Get adaptive compliance rules (sorted by effectiveness)
   */
  getAdaptiveComplianceRules: publicProcedure
    .query(() => {
      return { rules: PlatformIntelligence.getAdaptiveRules() };
    }),

  /**
   * Get platform intelligence summary
   */
  getSummary: publicProcedure
    .query(() => {
      return PlatformIntelligence.getSummary();
    }),

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Batch validate multiple claims
   */
  batchValidateResearch: protectedProcedure
    .input(z.object({
      claims: z.array(z.object({
        claim: z.string(),
        domain: moduleTypeEnum,
      })).max(10),
    }))
    .mutation(async ({ input }) => {
      const results = await Promise.all(
        input.claims.map(({ claim, domain }) =>
          PlatformIntelligence.validateResearch(claim, domain)
        )
      );
      return { results };
    }),

  /**
   * Run full platform analysis (scheduled job)
   */
  runFullAnalysis: protectedProcedure
    .mutation(async () => {
      // Analyze patterns
      const insights = await PlatformIntelligence.analyzePlatformPatterns();
      
      // Get summary
      const summary = PlatformIntelligence.getSummary();
      
      return {
        insights,
        summary,
        analyzedAt: new Date(),
      };
    }),
});
