/**
 * EMOTIONAL ENGINE ROUTER
 * Evidence-based emotional regulation using DBT, ACT, and Emotion Science
 * Integrated with ProfileGuard for complete client context
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { 
  emotionalProfiles, 
  emotionEntries, 
  dbtSkillsPractice 
} from "../../drizzle/emotionalEngineSchema";
import { eq, desc, and, gte } from "drizzle-orm";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

export const emotionalEngineRouter = router({
  /**
   * Get or create emotional profile for user
   */
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      // ProfileGuard - Load complete client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "emotional_engine",
        logAccess: true,
      });

      // Get existing profile
      let profile = await db.query.emotionalProfiles?.findFirst({
        where: eq(emotionalProfiles.userId, String(userId)),
      });

      // Create if doesn't exist
      if (!profile) {
        const newProfile = {
          id: `emotional_${userId}_${Date.now()}`,
          userId: String(userId),
          regulationSkillLevel: 5,
          awarenessLevel: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await db.insert(emotionalProfiles).values(newProfile);
        profile = newProfile;
      }

      return {
        profile,
        clientContext,
      };
    }),

  /**
   * Update emotional profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        baselineEmotionalState: z.string().optional(),
        emotionalRange: z.string().optional(),
        emotionalIntensity: z.string().optional(),
        regulationSkillLevel: z.number().min(1).max(10).optional(),
        awarenessLevel: z.number().min(1).max(10).optional(),
        primaryChallenges: z.string().optional(),
        primaryGoal: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // ProfileGuard
      await ProfileGuard.getClientContext(userId, {
        moduleName: "emotional_engine",
      });

      // Get profile
      const profile = await db.query.emotionalProfiles?.findFirst({
        where: eq(emotionalProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Emotional profile not found",
        });
      }

      // Update
      await db
        .update(emotionalProfiles)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(emotionalProfiles.id, profile.id));

      // Track with SelfLearning
      SelfLearning.trackFeatureUsage(
        "emotional_engine/updateProfile",
        "Emotional Engine: Update Profile",
        userId
      );

      return { success: true };
    }),

  /**
   * Log an emotion entry
   */
  logEmotion: protectedProcedure
    .input(
      z.object({
        primaryEmotion: z.string(),
        secondaryEmotions: z.array(z.string()).optional(),
        intensity: z.number().min(1).max(10),
        valence: z.number().min(-5).max(5).optional(),
        arousal: z.number().min(1).max(10).optional(),
        trigger: z.string().optional(),
        situation: z.string().optional(),
        thoughts: z.string().optional(),
        physicalSensations: z.array(z.string()).optional(),
        urge: z.string().optional(),
        actualBehavior: z.string().optional(),
        durationMinutes: z.number().optional(),
        regulationUsed: z.boolean().optional(),
        regulationStrategy: z.string().optional(),
        regulationEffectiveness: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // ProfileGuard
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "emotional_engine",
      });

      // Get profile
      const profile = await db.query.emotionalProfiles?.findFirst({
        where: eq(emotionalProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Emotional profile not found. Create profile first.",
        });
      }

      // Create entry
      const entry = {
        id: `emotion_${userId}_${Date.now()}`,
        profileId: profile.id,
        userId: String(userId),
        entryDate: new Date(),
        primaryEmotion: input.primaryEmotion,
        secondaryEmotions: input.secondaryEmotions ? JSON.stringify(input.secondaryEmotions) : null,
        intensity: input.intensity,
        valence: input.valence || null,
        arousal: input.arousal || null,
        trigger: input.trigger || null,
        situation: input.situation || null,
        thoughts: input.thoughts || null,
        physicalSensations: input.physicalSensations ? JSON.stringify(input.physicalSensations) : null,
        urge: input.urge || null,
        actualBehavior: input.actualBehavior || null,
        durationMinutes: input.durationMinutes || null,
        regulationUsed: input.regulationUsed || false,
        regulationStrategy: input.regulationStrategy || null,
        regulationEffectiveness: input.regulationEffectiveness || null,
        createdAt: new Date(),
      };

      await db.insert(emotionEntries).values(entry);

      // Track with SelfLearning
      SelfLearning.trackFeatureUsage(
        "emotional_engine/logEmotion",
        "Emotional Engine: Log Emotion",
        userId
      );

      return { success: true, entryId: entry.id };
    }),

  /**
   * Get emotion history
   */
  getEmotionHistory: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
        limit: z.number().default(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // ProfileGuard
      await ProfileGuard.getClientContext(userId, {
        moduleName: "emotional_engine",
      });

      // Get profile
      const profile = await db.query.emotionalProfiles?.findFirst({
        where: eq(emotionalProfiles.userId, String(userId)),
      });

      if (!profile) {
        return { entries: [] };
      }

      // Get entries
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const entries = await db.query.emotionEntries?.findMany({
        where: and(
          eq(emotionEntries.profileId, profile.id),
          gte(emotionEntries.entryDate, daysAgo)
        ),
        orderBy: [desc(emotionEntries.entryDate)],
        limit: input.limit,
      });

      return { entries: entries || [] };
    }),

  /**
   * Get emotional insights (patterns, trends)
   */
  getInsights: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      // ProfileGuard
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "emotional_engine",
      });

      // Get profile
      const profile = await db.query.emotionalProfiles?.findFirst({
        where: eq(emotionalProfiles.userId, String(userId)),
      });

      if (!profile) {
        return {
          insights: [],
          patterns: [],
          recommendations: [],
        };
      }

      // Get recent entries (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const entries = await db.query.emotionEntries?.findMany({
        where: and(
          eq(emotionEntries.profileId, profile.id),
          gte(emotionEntries.entryDate, thirtyDaysAgo)
        ),
      });

      // Analyze patterns
      const insights = [];
      const patterns = [];
      const recommendations = [];

      if (entries && entries.length > 0) {
        // Most common emotions
        const emotionCounts: Record<string, number> = {};
        entries.forEach((entry) => {
          emotionCounts[entry.primaryEmotion] = (emotionCounts[entry.primaryEmotion] || 0) + 1;
        });

        const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
        if (topEmotion) {
          insights.push(`Your most common emotion is ${topEmotion[0]} (${topEmotion[1]} times in 30 days)`);
        }

        // Average intensity
        const avgIntensity = entries.reduce((sum, e) => sum + (e.intensity || 0), 0) / entries.length;
        insights.push(`Your average emotional intensity is ${avgIntensity.toFixed(1)}/10`);

        // Regulation effectiveness
        const regulationEntries = entries.filter((e) => e.regulationUsed && e.regulationEffectiveness);
        if (regulationEntries.length > 0) {
          const avgEffectiveness =
            regulationEntries.reduce((sum, e) => sum + (e.regulationEffectiveness || 0), 0) /
            regulationEntries.length;
          insights.push(
            `Your regulation strategies are ${avgEffectiveness.toFixed(1)}/10 effective on average`
          );
        }

        // Recommendations
        if (avgIntensity > 7) {
          recommendations.push("Consider practicing grounding techniques to reduce emotional intensity");
        }
        if (regulationEntries.length < entries.length * 0.3) {
          recommendations.push("Try using regulation strategies more often when emotions arise");
        }
      }

      return {
        insights,
        patterns,
        recommendations,
      };
    }),

  /**
   * Log DBT skills practice
   */
  logDBTSkill: protectedProcedure
    .input(
      z.object({
        dbtModule: z.string(),
        skillUsed: z.string(),
        situation: z.string().optional(),
        effectiveness: z.number().min(1).max(10),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // ProfileGuard
      await ProfileGuard.getClientContext(userId, {
        moduleName: "emotional_engine",
      });

      // Get profile
      const profile = await db.query.emotionalProfiles?.findFirst({
        where: eq(emotionalProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Emotional profile not found",
        });
      }

      // Create entry
      const entry = {
        id: `dbt_${userId}_${Date.now()}`,
        profileId: profile.id,
        userId: String(userId),
        practiceDate: new Date(),
        dbtModule: input.dbtModule,
        skillUsed: input.skillUsed,
        createdAt: new Date(),
      };

      await db.insert(dbtSkillsPractice).values(entry);

      // Track with SelfLearning
      SelfLearning.trackFeatureUsage(
        "emotional_engine/logDBTSkill",
        "Emotional Engine: Log DBT Skill",
        userId
      );

      return { success: true };
    }),
});

export type EmotionalEngineRouter = typeof emotionalEngineRouter;
