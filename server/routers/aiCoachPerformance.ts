/**
 * AI COACH PERFORMANCE ANALYTICS ROUTER
 * 
 * Provides comprehensive analytics on AI coach performance:
 * - Individual coach metrics
 * - Comparison between coaches
 * - What's working / what's not
 * - Technique effectiveness
 * - Evolution tracking
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { 
  aiCoachSessions, 
  aiCoachPerformanceAggregates,
  aiCoachTechniqueEffectiveness,
  aiCoachComparisonInsights,
  aiCoachEvolutionLog
} from "../../drizzle/schema";
import { eq, desc, and, sql, gte, lte, count, avg } from "drizzle-orm";

// Coach configuration
const COACH_CONFIG = {
  sage: { name: "Sage", type: "chat", description: "Main AI Life Coach (Chat)" },
  alex: { name: "Alex", type: "voice", description: "Speaker Training Coach" },
  jordan: { name: "Jordan", type: "voice", description: "Interview Prep Coach" },
  morgan: { name: "Morgan", type: "voice", description: "Coaching Practice Coach" },
  sam: { name: "Sam", type: "voice", description: "Compliance Monitor" },
  memphis: { name: "Memphis", type: "voice", description: "Singing Coach" },
};

export const aiCoachPerformanceRouter = router({
  /**
   * Get overview of all coaches' performance
   */
  getCoachOverview: publicProcedure
    .input(z.object({
      timeRange: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
    }))
    .query(async ({ input }) => {
      const { timeRange } = input;
      
      // Calculate date range
      const now = new Date();
      let startDate = new Date(0); // Beginning of time for "all"
      if (timeRange === "7d") startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (timeRange === "30d") startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (timeRange === "90d") startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      // Get aggregated stats per coach
      const coachStats = await db
        .select({
          coachType: aiCoachSessions.coachType,
          totalSessions: count(),
          completedSessions: sql<number>`COUNT(CASE WHEN ${aiCoachSessions.sessionCompleted} = true THEN 1 END)`,
          avgDuration: avg(aiCoachSessions.durationSeconds),
          avgRating: avg(aiCoachSessions.clientRating),
          totalRatings: sql<number>`COUNT(${aiCoachSessions.clientRating})`,
          totalBreakthroughs: sql<number>`SUM(COALESCE(${aiCoachSessions.breakthroughCount}, 0))`,
          avgMoodImprovement: avg(aiCoachSessions.moodImprovement),
          uniqueClients: sql<number>`COUNT(DISTINCT ${aiCoachSessions.clientId})`,
        })
        .from(aiCoachSessions)
        .where(gte(aiCoachSessions.startedAt, startDate))
        .groupBy(aiCoachSessions.coachType);

      // Build coach overview with config
      const overview = Object.entries(COACH_CONFIG).map(([key, config]) => {
        const stats = coachStats.find(s => s.coachType === key);
        
        return {
          id: key,
          ...config,
          stats: stats ? {
            totalSessions: Number(stats.totalSessions) || 0,
            completedSessions: Number(stats.completedSessions) || 0,
            completionRate: stats.totalSessions > 0 
              ? Math.round((Number(stats.completedSessions) / Number(stats.totalSessions)) * 100) 
              : 0,
            avgDuration: Math.round(Number(stats.avgDuration) || 0),
            avgRating: Number(stats.avgRating)?.toFixed(1) || "N/A",
            totalRatings: Number(stats.totalRatings) || 0,
            totalBreakthroughs: Number(stats.totalBreakthroughs) || 0,
            avgBreakthroughsPerSession: stats.totalSessions > 0
              ? (Number(stats.totalBreakthroughs) / Number(stats.totalSessions)).toFixed(2)
              : "0",
            avgMoodImprovement: Number(stats.avgMoodImprovement)?.toFixed(2) || "N/A",
            uniqueClients: Number(stats.uniqueClients) || 0,
          } : {
            totalSessions: 0,
            completedSessions: 0,
            completionRate: 0,
            avgDuration: 0,
            avgRating: "N/A",
            totalRatings: 0,
            totalBreakthroughs: 0,
            avgBreakthroughsPerSession: "0",
            avgMoodImprovement: "N/A",
            uniqueClients: 0,
          },
        };
      });

      // Calculate rankings
      const rankings = {
        byRating: [...overview]
          .filter(c => c.stats.avgRating !== "N/A")
          .sort((a, b) => parseFloat(b.stats.avgRating) - parseFloat(a.stats.avgRating))
          .map((c, i) => ({ coachId: c.id, rank: i + 1, value: c.stats.avgRating })),
        byBreakthroughs: [...overview]
          .sort((a, b) => parseFloat(b.stats.avgBreakthroughsPerSession) - parseFloat(a.stats.avgBreakthroughsPerSession))
          .map((c, i) => ({ coachId: c.id, rank: i + 1, value: c.stats.avgBreakthroughsPerSession })),
        byCompletionRate: [...overview]
          .sort((a, b) => b.stats.completionRate - a.stats.completionRate)
          .map((c, i) => ({ coachId: c.id, rank: i + 1, value: `${c.stats.completionRate}%` })),
        byVolume: [...overview]
          .sort((a, b) => b.stats.totalSessions - a.stats.totalSessions)
          .map((c, i) => ({ coachId: c.id, rank: i + 1, value: c.stats.totalSessions })),
      };

      return {
        coaches: overview,
        rankings,
        timeRange,
        generatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Get detailed performance for a specific coach
   */
  getCoachDetail: publicProcedure
    .input(z.object({
      coachType: z.string(),
      timeRange: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
    }))
    .query(async ({ input }) => {
      const { coachType, timeRange } = input;
      
      const now = new Date();
      let startDate = new Date(0);
      if (timeRange === "7d") startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (timeRange === "30d") startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (timeRange === "90d") startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      // Get all sessions for this coach
      const sessions = await db.query.aiCoachSessions.findMany({
        where: and(
          eq(aiCoachSessions.coachType, coachType),
          gte(aiCoachSessions.startedAt, startDate)
        ),
        orderBy: [desc(aiCoachSessions.startedAt)],
        limit: 100,
      });

      // Get technique effectiveness for this coach
      const techniques = await db.query.aiCoachTechniqueEffectiveness.findMany({
        where: eq(aiCoachTechniqueEffectiveness.coachType, coachType),
        orderBy: [desc(aiCoachTechniqueEffectiveness.avgClientRatingWhenUsed)],
      });

      // Get evolution log
      const evolutionLog = await db.query.aiCoachEvolutionLog.findMany({
        where: eq(aiCoachEvolutionLog.coachType, coachType),
        orderBy: [desc(aiCoachEvolutionLog.createdAt)],
        limit: 20,
      });

      // Calculate what's working / not working
      const whatWorks: string[] = [];
      const whatDoesntWork: string[] = [];
      
      sessions.forEach(session => {
        if (session.whatWorked && Array.isArray(session.whatWorked)) {
          whatWorks.push(...(session.whatWorked as string[]));
        }
        if (session.whatDidntWork && Array.isArray(session.whatDidntWork)) {
          whatDoesntWork.push(...(session.whatDidntWork as string[]));
        }
      });

      // Count occurrences
      const worksCounts = whatWorks.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const doesntWorkCounts = whatDoesntWork.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Sort by frequency
      const topWhatWorks = Object.entries(worksCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([item, count]) => ({ item, count }));

      const topWhatDoesntWork = Object.entries(doesntWorkCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([item, count]) => ({ item, count }));

      // Calculate daily trend
      const dailyTrend = sessions.reduce((acc, session) => {
        const date = session.startedAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, sessions: 0, avgRating: 0, totalRating: 0, ratingCount: 0 };
        }
        acc[date].sessions++;
        if (session.clientRating) {
          acc[date].totalRating += session.clientRating;
          acc[date].ratingCount++;
        }
        return acc;
      }, {} as Record<string, any>);

      // Calculate averages
      Object.values(dailyTrend).forEach((day: any) => {
        day.avgRating = day.ratingCount > 0 ? (day.totalRating / day.ratingCount).toFixed(1) : null;
        delete day.totalRating;
        delete day.ratingCount;
      });

      return {
        coachType,
        config: COACH_CONFIG[coachType as keyof typeof COACH_CONFIG],
        recentSessions: sessions.slice(0, 20).map(s => ({
          id: s.id,
          startedAt: s.startedAt,
          duration: s.durationSeconds,
          rating: s.clientRating,
          breakthroughs: s.breakthroughCount,
          moodImprovement: s.moodImprovement,
          rapportLevel: s.rapportLevel,
        })),
        techniques: techniques.map(t => ({
          name: t.techniqueName,
          timesUsed: t.timesUsed,
          avgRating: t.avgClientRatingWhenUsed?.toFixed(1) || "N/A",
          breakthroughCorrelation: t.breakthroughCorrelation?.toFixed(2) || "N/A",
        })),
        whatWorks: topWhatWorks,
        whatDoesntWork: topWhatDoesntWork,
        evolutionLog: evolutionLog.map(e => ({
          date: e.createdAt,
          changeType: e.changeType,
          description: e.changeDescription,
          impact: e.impactAssessment,
        })),
        dailyTrend: Object.values(dailyTrend).sort((a: any, b: any) => a.date.localeCompare(b.date)),
      };
    }),

  /**
   * Get comparison insights between coaches
   */
  getCoachComparison: publicProcedure
    .input(z.object({
      timeRange: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
    }))
    .query(async ({ input }) => {
      const { timeRange } = input;

      // Get the latest comparison insights
      const latestInsights = await db.query.aiCoachComparisonInsights.findFirst({
        orderBy: [desc(aiCoachComparisonInsights.generatedAt)],
      });

      // If no insights exist, generate basic comparison
      if (!latestInsights) {
        return {
          message: "No comparison data available yet. Insights will be generated after more sessions.",
          recommendations: [
            "Encourage more client sessions to gather comparison data",
            "Ask clients for feedback after sessions",
            "Monitor technique usage across coaches",
          ],
        };
      }

      return {
        generatedAt: latestInsights.generatedAt,
        rankings: latestInsights.overallRanking,
        topPerformerInsights: latestInsights.topPerformerInsights,
        improvementOpportunities: latestInsights.improvementOpportunities,
        recommendations: latestInsights.recommendations,
      };
    }),

  /**
   * Record a new coaching session (called after each session ends)
   */
  recordSession: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      coachType: z.string(),
      sessionMode: z.string().optional(),
      clientId: z.number().optional(),
      userId: z.number().optional(),
      durationSeconds: z.number(),
      messageCount: z.number().optional(),
      clientMessageCount: z.number().optional(),
      coachMessageCount: z.number().optional(),
      sessionCompleted: z.boolean().default(true),
      clientInitiatedEnd: z.boolean().default(true),
      startingMood: z.string().optional(),
      endingMood: z.string().optional(),
      moodImprovement: z.number().optional(),
      breakthroughMoments: z.array(z.string()).optional(),
      techniquesUsed: z.array(z.string()).optional(),
      clientRating: z.number().optional(),
      clientFeedback: z.string().optional(),
      wouldRecommend: z.boolean().optional(),
      whatWorked: z.array(z.string()).optional(),
      whatDidntWork: z.array(z.string()).optional(),
      rapportLevel: z.string().optional(),
      transcriptSummary: z.string().optional(),
      keyTopicsDiscussed: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const session = await db.insert(aiCoachSessions).values({
        sessionId: input.sessionId,
        coachType: input.coachType,
        sessionMode: input.sessionMode,
        clientId: input.clientId,
        userId: input.userId,
        startedAt: new Date(Date.now() - (input.durationSeconds * 1000)),
        endedAt: new Date(),
        durationSeconds: input.durationSeconds,
        messageCount: input.messageCount,
        clientMessageCount: input.clientMessageCount,
        coachMessageCount: input.coachMessageCount,
        sessionCompleted: input.sessionCompleted,
        clientInitiatedEnd: input.clientInitiatedEnd,
        startingMood: input.startingMood,
        endingMood: input.endingMood,
        moodImprovement: input.moodImprovement,
        breakthroughMoments: input.breakthroughMoments,
        breakthroughCount: input.breakthroughMoments?.length || 0,
        techniquesUsed: input.techniquesUsed,
        clientRating: input.clientRating,
        clientFeedback: input.clientFeedback,
        wouldRecommend: input.wouldRecommend,
        whatWorked: input.whatWorked,
        whatDidntWork: input.whatDidntWork,
        rapportLevel: input.rapportLevel,
        transcriptSummary: input.transcriptSummary,
        keyTopicsDiscussed: input.keyTopicsDiscussed,
      }).returning();

      // Update technique effectiveness if techniques were used
      if (input.techniquesUsed && input.techniquesUsed.length > 0) {
        for (const technique of input.techniquesUsed) {
          // Upsert technique effectiveness
          await db.execute(sql`
            INSERT INTO ai_coach_technique_effectiveness (coach_type, technique_name, times_used, avg_client_rating_when_used, last_updated)
            VALUES (${input.coachType}, ${technique}, 1, ${input.clientRating || null}, NOW())
            ON CONFLICT (coach_type, technique_name) 
            DO UPDATE SET 
              times_used = ai_coach_technique_effectiveness.times_used + 1,
              avg_client_rating_when_used = CASE 
                WHEN ${input.clientRating || null} IS NOT NULL THEN 
                  (COALESCE(ai_coach_technique_effectiveness.avg_client_rating_when_used, 0) * ai_coach_technique_effectiveness.times_used + ${input.clientRating || 0}) / (ai_coach_technique_effectiveness.times_used + 1)
                ELSE ai_coach_technique_effectiveness.avg_client_rating_when_used
              END,
              last_updated = NOW()
          `);
        }
      }

      return { success: true, sessionId: session[0].id };
    }),

  /**
   * Log a coach evolution/change
   */
  logEvolution: publicProcedure
    .input(z.object({
      coachType: z.string(),
      changeType: z.enum(["prompt_update", "technique_added", "technique_removed", "personality_tweak"]),
      changeDescription: z.string(),
      changeMadeBy: z.string().default("admin"),
    }))
    .mutation(async ({ input }) => {
      // Get current metrics as "before" snapshot
      const currentMetrics = await db
        .select({
          avgRating: avg(aiCoachSessions.clientRating),
          completionRate: sql<number>`COUNT(CASE WHEN ${aiCoachSessions.sessionCompleted} = true THEN 1 END)::float / NULLIF(COUNT(*), 0)`,
          avgBreakthroughs: avg(aiCoachSessions.breakthroughCount),
        })
        .from(aiCoachSessions)
        .where(and(
          eq(aiCoachSessions.coachType, input.coachType),
          gte(aiCoachSessions.startedAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        ));

      const log = await db.insert(aiCoachEvolutionLog).values({
        coachType: input.coachType,
        changeType: input.changeType,
        changeDescription: input.changeDescription,
        changeMadeBy: input.changeMadeBy,
        metricsBefore: currentMetrics[0] || {},
        impactAssessment: "pending",
      }).returning();

      return { success: true, logId: log[0].id };
    }),

  /**
   * Get quick stats for dashboard
   */
  getQuickStats: publicProcedure.query(async () => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [stats24h, stats7d, totalStats] = await Promise.all([
      db.select({
        sessions: count(),
        avgRating: avg(aiCoachSessions.clientRating),
      }).from(aiCoachSessions).where(gte(aiCoachSessions.startedAt, last24h)),
      
      db.select({
        sessions: count(),
        avgRating: avg(aiCoachSessions.clientRating),
        breakthroughs: sql<number>`SUM(COALESCE(${aiCoachSessions.breakthroughCount}, 0))`,
      }).from(aiCoachSessions).where(gte(aiCoachSessions.startedAt, last7d)),
      
      db.select({
        totalSessions: count(),
        uniqueClients: sql<number>`COUNT(DISTINCT ${aiCoachSessions.clientId})`,
      }).from(aiCoachSessions),
    ]);

    return {
      last24h: {
        sessions: Number(stats24h[0]?.sessions) || 0,
        avgRating: Number(stats24h[0]?.avgRating)?.toFixed(1) || "N/A",
      },
      last7d: {
        sessions: Number(stats7d[0]?.sessions) || 0,
        avgRating: Number(stats7d[0]?.avgRating)?.toFixed(1) || "N/A",
        breakthroughs: Number(stats7d[0]?.breakthroughs) || 0,
      },
      allTime: {
        totalSessions: Number(totalStats[0]?.totalSessions) || 0,
        uniqueClients: Number(totalStats[0]?.uniqueClients) || 0,
      },
    };
  }),
});
