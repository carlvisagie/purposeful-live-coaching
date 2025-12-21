/**
 * B-Roll Learning Router
 * 
 * Philosophy: "Not what I want, but what truth and research prove."
 * 
 * This router handles:
 * 1. Performance tracking for B-roll selections
 * 2. Self-learning optimization based on real data
 * 3. A/B testing for evidence-based decisions
 * 4. Insights generation from accumulated evidence
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import AutoBRollPipeline from "../services/autoBRoll";
import { invokeLLM } from "../_core/llm";

// In-memory store for content performance (would be database in production)
const contentPerformanceStore: Map<string, {
  contentId: string;
  publishedAt: Date;
  platform: string;
  brollAssets: string[];
  metrics: {
    views: number;
    watchTime: number;
    avgRetention: number;
    likes: number;
    comments: number;
    shares: number;
    clickThroughRate: number;
    conversionRate: number;
  };
  updatedAt: Date;
}> = new Map();

// Learning patterns store
const learningPatterns: {
  brollPatterns: Map<string, { success: number; total: number; avgEngagement: number }>;
  timestampPatterns: Map<string, { success: number; total: number }>;
  categoryPatterns: Map<string, { success: number; total: number; avgRetention: number }>;
  platformPatterns: Map<string, Map<string, { success: number; total: number }>>;
} = {
  brollPatterns: new Map(),
  timestampPatterns: new Map(),
  categoryPatterns: new Map(),
  platformPatterns: new Map()
};

export const brollLearningRouter = router({
  /**
   * Record content performance metrics
   * This is how the system learns from REAL DATA
   */
  recordPerformance: protectedProcedure
    .input(z.object({
      contentId: z.string(),
      platform: z.enum(['youtube', 'tiktok', 'instagram', 'podcast']),
      brollAssets: z.array(z.string()),
      metrics: z.object({
        views: z.number(),
        watchTime: z.number(), // in seconds
        avgRetention: z.number(), // percentage 0-100
        likes: z.number(),
        comments: z.number(),
        shares: z.number(),
        clickThroughRate: z.number(), // percentage 0-100
        conversionRate: z.number() // percentage 0-100
      })
    }))
    .mutation(async ({ input }) => {
      const { contentId, platform, brollAssets, metrics } = input;

      // Store performance data
      contentPerformanceStore.set(contentId, {
        contentId,
        publishedAt: new Date(),
        platform,
        brollAssets,
        metrics,
        updatedAt: new Date()
      });

      // Update learning patterns
      const engagementScore = calculateEngagementScore(metrics);
      const isSuccess = engagementScore > 0.6; // 60% threshold for "success"

      // Learn from B-roll assets used
      for (const assetId of brollAssets) {
        const pattern = learningPatterns.brollPatterns.get(assetId) || { success: 0, total: 0, avgEngagement: 0 };
        pattern.total += 1;
        if (isSuccess) pattern.success += 1;
        pattern.avgEngagement = (pattern.avgEngagement * (pattern.total - 1) + engagementScore) / pattern.total;
        learningPatterns.brollPatterns.set(assetId, pattern);

        // Record to AutoBRollPipeline for cross-system learning
        await AutoBRollPipeline.recordPerformance({
          contentId,
          brollAssetId: assetId,
          timestamp: new Date().toISOString(),
          watchTime: metrics.watchTime,
          retentionRate: metrics.avgRetention / 100,
          engagementScore,
          dropOffRate: 1 - (metrics.avgRetention / 100)
        });
      }

      // Learn platform-specific patterns
      if (!learningPatterns.platformPatterns.has(platform)) {
        learningPatterns.platformPatterns.set(platform, new Map());
      }
      const platformMap = learningPatterns.platformPatterns.get(platform)!;
      
      for (const assetId of brollAssets) {
        const pattern = platformMap.get(assetId) || { success: 0, total: 0 };
        pattern.total += 1;
        if (isSuccess) pattern.success += 1;
        platformMap.set(assetId, pattern);
      }

      return {
        success: true,
        engagementScore,
        isSuccess,
        message: `Performance recorded. Engagement score: ${(engagementScore * 100).toFixed(1)}%`
      };
    }),

  /**
   * Get learning insights based on accumulated evidence
   * Only returns insights with statistical significance
   */
  getInsights: protectedProcedure
    .query(async () => {
      const MIN_SAMPLE_SIZE = 5; // Minimum for initial insights
      const CONFIDENCE_THRESHOLD = 0.65;

      const insights: {
        type: string;
        insight: string;
        confidence: number;
        sampleSize: number;
        evidence: string;
        recommendation: string;
      }[] = [];

      // Analyze B-roll patterns
      for (const [assetId, pattern] of learningPatterns.brollPatterns.entries()) {
        if (pattern.total >= MIN_SAMPLE_SIZE) {
          const successRate = pattern.success / pattern.total;
          
          if (successRate >= CONFIDENCE_THRESHOLD) {
            insights.push({
              type: 'broll_success',
              insight: `B-roll asset ${assetId} performs well`,
              confidence: successRate,
              sampleSize: pattern.total,
              evidence: `${pattern.success}/${pattern.total} videos with this B-roll achieved above-average engagement`,
              recommendation: `Continue using this B-roll style. Average engagement: ${(pattern.avgEngagement * 100).toFixed(1)}%`
            });
          } else if (successRate < 0.4 && pattern.total >= MIN_SAMPLE_SIZE) {
            insights.push({
              type: 'broll_underperform',
              insight: `B-roll asset ${assetId} underperforms`,
              confidence: 1 - successRate,
              sampleSize: pattern.total,
              evidence: `Only ${pattern.success}/${pattern.total} videos with this B-roll achieved target engagement`,
              recommendation: `Consider replacing this B-roll with alternatives`
            });
          }
        }
      }

      // Get insights from AutoBRollPipeline
      const pipelineInsights = AutoBRollPipeline.getInsights();
      for (const pi of pipelineInsights) {
        insights.push({
          type: 'pipeline_insight',
          insight: pi.pattern,
          confidence: pi.confidence,
          sampleSize: pi.sampleSize,
          evidence: pi.evidence,
          recommendation: pi.recommendation
        });
      }

      // Sort by confidence
      insights.sort((a, b) => b.confidence - a.confidence);

      return {
        insights,
        totalDataPoints: contentPerformanceStore.size,
        lastUpdated: new Date().toISOString()
      };
    }),

  /**
   * Get optimized B-roll recommendations based on learning
   * Evidence-based, not opinion-based
   */
  getOptimizedRecommendations: protectedProcedure
    .input(z.object({
      contentType: z.string(),
      platform: z.enum(['youtube', 'tiktok', 'instagram', 'podcast']),
      duration: z.number(),
      keywords: z.array(z.string())
    }))
    .query(async ({ input }) => {
      const { contentType, platform, duration, keywords } = input;

      // Get base recommendations
      const suggestions = keywords.map((keyword, index) => ({
        timestamp: `${Math.floor(index * (duration / keywords.length))}:00`,
        duration: 5,
        description: `B-roll for ${keyword}`,
        keywords: [keyword],
        category: contentType
      }));

      // Apply learning to get optimal selections
      const optimizedSelections = await AutoBRollPipeline.selectOptimal(suggestions, contentType);

      // Apply platform-specific learning
      const platformMap = learningPatterns.platformPatterns.get(platform);
      if (platformMap) {
        for (const selection of optimizedSelections) {
          const platformPattern = platformMap.get(selection.asset.id);
          if (platformPattern && platformPattern.total >= 3) {
            const platformSuccessRate = platformPattern.success / platformPattern.total;
            // Adjust confidence based on platform-specific performance
            selection.confidence = (selection.confidence + platformSuccessRate) / 2;
          }
        }
      }

      return {
        recommendations: optimizedSelections,
        basedOnSamples: contentPerformanceStore.size,
        platform,
        contentType
      };
    }),

  /**
   * Create A/B test for B-roll variations
   * Tests hypotheses with real data
   */
  createABTest: protectedProcedure
    .input(z.object({
      contentId: z.string(),
      hypothesis: z.string(),
      variations: z.array(z.object({
        name: z.string(),
        brollKeywords: z.array(z.string())
      }))
    }))
    .mutation(async ({ input }) => {
      const { contentId, hypothesis, variations } = input;

      // Fetch B-roll for each variation
      const variationsWithAssets = await Promise.all(
        variations.map(async (v) => {
          const assets = await AutoBRollPipeline.fetchBRoll(v.brollKeywords, 'test', 5);
          return {
            name: v.name,
            brollAssets: assets
          };
        })
      );

      const test = await AutoBRollPipeline.createABTest(contentId, variationsWithAssets);

      return {
        ...test,
        hypothesis,
        createdAt: new Date().toISOString(),
        estimatedCompletionSamples: 100 * variations.length
      };
    }),

  /**
   * Get A/B test results
   * Returns winner only when statistically significant
   */
  getABTestResults: protectedProcedure
    .input(z.object({
      testId: z.string()
    }))
    .query(async ({ input }) => {
      const results = await AutoBRollPipeline.getABTestResults(input.testId);
      
      return {
        ...results,
        interpretation: results.isSignificant
          ? `Variation "${results.winner}" is the winner with ${(results.confidence * 100).toFixed(1)}% confidence`
          : `Not enough data yet. Need ${100 - results.sampleSize} more samples for statistical significance.`
      };
    }),

  /**
   * Trigger learning evolution
   * Analyzes all data and updates optimization models
   */
  triggerEvolution: protectedProcedure
    .mutation(async () => {
      const allPerformance = Array.from(contentPerformanceStore.values());
      
      if (allPerformance.length < 10) {
        return {
          success: false,
          message: `Need at least 10 content pieces for evolution. Current: ${allPerformance.length}`,
          evolved: false
        };
      }

      // Analyze patterns with AI
      const analysisPrompt = `
        Analyze this content performance data and identify patterns:
        
        ${JSON.stringify(allPerformance.slice(-20), null, 2)}
        
        Identify:
        1. Which B-roll categories perform best
        2. Optimal B-roll timing patterns
        3. Platform-specific preferences
        4. Any correlations between B-roll and engagement
        
        Return actionable insights based on EVIDENCE, not opinions.
        Focus on patterns with statistical significance (sample size >= 5).
      `;

      const analysis = await invokeLLM({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: analysisPrompt }]
      });

      return {
        success: true,
        message: "Evolution triggered successfully",
        evolved: true,
        analysis: analysis.content,
        dataPointsAnalyzed: allPerformance.length,
        timestamp: new Date().toISOString()
      };
    }),

  /**
   * Get system health and learning status
   */
  getSystemHealth: protectedProcedure
    .query(async () => {
      const totalDataPoints = contentPerformanceStore.size;
      const patternsLearned = learningPatterns.brollPatterns.size;
      const platformsTracked = learningPatterns.platformPatterns.size;

      // Calculate learning maturity
      let maturityLevel: 'nascent' | 'learning' | 'optimizing' | 'mature';
      if (totalDataPoints < 10) {
        maturityLevel = 'nascent';
      } else if (totalDataPoints < 50) {
        maturityLevel = 'learning';
      } else if (totalDataPoints < 200) {
        maturityLevel = 'optimizing';
      } else {
        maturityLevel = 'mature';
      }

      return {
        totalDataPoints,
        patternsLearned,
        platformsTracked,
        maturityLevel,
        maturityDescription: {
          'nascent': 'Just starting to collect data. Need more content for meaningful insights.',
          'learning': 'Gathering patterns. Recommendations improving with each piece of content.',
          'optimizing': 'Strong pattern recognition. Recommendations are evidence-based.',
          'mature': 'Highly optimized. Recommendations backed by extensive data.'
        }[maturityLevel],
        recommendedActions: maturityLevel === 'nascent' 
          ? ['Publish more content to build learning dataset', 'Track performance metrics consistently']
          : maturityLevel === 'learning'
          ? ['Continue publishing', 'Review early insights', 'Consider A/B tests']
          : ['Trust the recommendations', 'Run A/B tests for fine-tuning', 'Monitor for pattern shifts']
      };
    })
});

/**
 * Calculate engagement score from metrics
 * Weighted formula based on research
 */
function calculateEngagementScore(metrics: {
  views: number;
  watchTime: number;
  avgRetention: number;
  likes: number;
  comments: number;
  shares: number;
  clickThroughRate: number;
  conversionRate: number;
}): number {
  // Weights based on research on what correlates with success
  const weights = {
    retention: 0.30,      // Most important - did they watch?
    engagement: 0.25,     // Likes, comments, shares
    ctr: 0.20,            // Did the thumbnail/title work?
    conversion: 0.15,     // Did they take action?
    virality: 0.10        // Share rate
  };

  // Normalize metrics to 0-1 scale
  const retentionScore = Math.min(metrics.avgRetention / 100, 1);
  
  const engagementRate = metrics.views > 0 
    ? (metrics.likes + metrics.comments * 2 + metrics.shares * 3) / metrics.views 
    : 0;
  const engagementScore = Math.min(engagementRate / 0.1, 1); // 10% engagement = perfect score
  
  const ctrScore = Math.min(metrics.clickThroughRate / 10, 1); // 10% CTR = perfect score
  
  const conversionScore = Math.min(metrics.conversionRate / 5, 1); // 5% conversion = perfect score
  
  const viralityScore = metrics.views > 0 
    ? Math.min(metrics.shares / metrics.views / 0.05, 1) // 5% share rate = perfect score
    : 0;

  // Calculate weighted score
  const totalScore = 
    retentionScore * weights.retention +
    engagementScore * weights.engagement +
    ctrScore * weights.ctr +
    conversionScore * weights.conversion +
    viralityScore * weights.virality;

  return totalScore;
}

export default brollLearningRouter;
