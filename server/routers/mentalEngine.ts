/**
 * MENTAL ENGINE ROUTER
 * Evidence-based cognitive enhancement using Neuroscience, Learning Science, and Memory Research
 * Integrated with ProfileGuard, SelfLearning, and SelfFixing
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { mentalProfiles, focusSessions } from "../../drizzle/mentalEngineSchema";
import { eq, desc, and, gte } from "drizzle-orm";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

export const mentalEngineRouter = router({
  /**
   * Get or create mental profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // ProfileGuard - Load complete client context
    const clientContext = await ProfileGuard.getClientContext(userId, {
      moduleName: "mental_engine",
      logAccess: true,
    });

    // Get existing profile
    let profile = await db.query.mentalProfiles?.findFirst({
      where: eq(mentalProfiles.userId, String(userId)),
    });

    // Create if doesn't exist
    if (!profile) {
      const newProfile = {
        id: `mental_${userId}_${Date.now()}`,
        userId: String(userId),
        mentalClarity: 5,
        focusAbility: 5,
        memoryQuality: 5,
        cognitiveEnergy: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(mentalProfiles).values(newProfile);
      profile = newProfile;
    }

    return {
      profile,
      clientContext,
    };
  }),

  /**
   * Update mental profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        mentalClarity: z.number().min(1).max(10).optional(),
        focusAbility: z.number().min(1).max(10).optional(),
        memoryQuality: z.number().min(1).max(10).optional(),
        cognitiveEnergy: z.number().min(1).max(10).optional(),
        primaryChallenges: z.string().optional(),
        primaryGoal: z.string().optional(),
        learningStyle: z.string().optional(),
        bestLearningTime: z.string().optional(),
        sleepQuality: z.number().min(1).max(10).optional(),
        exerciseFrequency: z.string().optional(),
        screenTimeHours: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // ProfileGuard
      await ProfileGuard.getClientContext(userId, {
        moduleName: "mental_engine",
      });

      // Get profile
      const profile = await db.query.mentalProfiles?.findFirst({
        where: eq(mentalProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mental profile not found",
        });
      }

      // Update
      await db
        .update(mentalProfiles)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(mentalProfiles.id, profile.id));

      // Track with SelfLearning
      SelfLearning.trackFeatureUsage(
        "mental_engine/updateProfile",
        "Mental Engine: Update Profile",
        userId
      );

      return { success: true };
    }),

  /**
   * Log a focus session
   */
  logFocusSession: protectedProcedure
    .input(
      z.object({
        sessionType: z.string(),
        task: z.string(),
        taskType: z.string().optional(),
        plannedDuration: z.number(),
        actualDuration: z.number(),
        location: z.string().optional(),
        noiseLevel: z.string().optional(),
        usedNoiseBlocking: z.boolean().optional(),
        energyBefore: z.number().min(1).max(10),
        focusBefore: z.number().min(1).max(10),
        stressBefore: z.number().min(1).max(10),
        energyAfter: z.number().min(1).max(10).optional(),
        focusAfter: z.number().min(1).max(10).optional(),
        stressAfter: z.number().min(1).max(10).optional(),
        flowState: z.boolean().optional(),
        distractions: z.number().optional(),
        productivity: z.number().min(1).max(10).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // ProfileGuard
      await ProfileGuard.getClientContext(userId, {
        moduleName: "mental_engine",
      });

      // Get profile
      const profile = await db.query.mentalProfiles?.findFirst({
        where: eq(mentalProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mental profile not found. Create profile first.",
        });
      }

      // Create session entry
      const session = {
        id: `focus_${userId}_${Date.now()}`,
        profileId: profile.id,
        userId: String(userId),
        sessionDate: new Date(),
        sessionType: input.sessionType,
        task: input.task,
        taskType: input.taskType || null,
        plannedDuration: input.plannedDuration,
        actualDuration: input.actualDuration,
        location: input.location || null,
        noiseLevel: input.noiseLevel || null,
        usedNoiseBlocking: input.usedNoiseBlocking || false,
        energyBefore: input.energyBefore,
        focusBefore: input.focusBefore,
        stressBefore: input.stressBefore,
        createdAt: new Date(),
      };

      await db.insert(focusSessions).values(session);

      // Track with SelfLearning
      SelfLearning.trackFeatureUsage(
        "mental_engine/logFocusSession",
        "Mental Engine: Log Focus Session",
        userId
      );

      return { success: true, sessionId: session.id };
    }),

  /**
   * Get focus session history
   */
  getFocusHistory: protectedProcedure
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
        moduleName: "mental_engine",
      });

      // Get profile
      const profile = await db.query.mentalProfiles?.findFirst({
        where: eq(mentalProfiles.userId, String(userId)),
      });

      if (!profile) {
        return { sessions: [] };
      }

      // Get sessions
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const sessions = await db.query.focusSessions?.findMany({
        where: and(
          eq(focusSessions.profileId, profile.id),
          gte(focusSessions.sessionDate, daysAgo)
        ),
        orderBy: [desc(focusSessions.sessionDate)],
        limit: input.limit,
      });

      return { sessions: sessions || [] };
    }),

  /**
   * Get cognitive insights (patterns, peak times, recommendations)
   */
  getInsights: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // ProfileGuard
    const clientContext = await ProfileGuard.getClientContext(userId, {
      moduleName: "mental_engine",
    });

    // Get profile
    const profile = await db.query.mentalProfiles?.findFirst({
      where: eq(mentalProfiles.userId, String(userId)),
    });

    if (!profile) {
      return {
        insights: [],
        peakFocusTimes: [],
        recommendations: [],
      };
    }

    // Get recent sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await db.query.focusSessions?.findMany({
      where: and(
        eq(focusSessions.profileId, profile.id),
        gte(focusSessions.sessionDate, thirtyDaysAgo)
      ),
    });

    // Analyze patterns
    const insights = [];
    const peakFocusTimes = [];
    const recommendations = [];

    if (sessions && sessions.length > 0) {
      // Average focus before sessions
      const avgFocusBefore =
        sessions.reduce((sum, s) => sum + (s.focusBefore || 0), 0) / sessions.length;
      insights.push(`Your average focus level is ${avgFocusBefore.toFixed(1)}/10`);

      // Average session duration
      const avgDuration =
        sessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0) / sessions.length;
      insights.push(`Your average focus session is ${Math.round(avgDuration)} minutes`);

      // Peak focus times (analyze by hour of day)
      const hourlyFocus: Record<number, { count: number; totalFocus: number }> = {};
      sessions.forEach((s) => {
        const hour = new Date(s.sessionDate).getHours();
        if (!hourlyFocus[hour]) {
          hourlyFocus[hour] = { count: 0, totalFocus: 0 };
        }
        hourlyFocus[hour].count++;
        hourlyFocus[hour].totalFocus += s.focusBefore || 0;
      });

      const bestHour = Object.entries(hourlyFocus)
        .map(([hour, data]) => ({
          hour: parseInt(hour),
          avgFocus: data.totalFocus / data.count,
        }))
        .sort((a, b) => b.avgFocus - a.avgFocus)[0];

      if (bestHour) {
        const timeStr =
          bestHour.hour < 12
            ? `${bestHour.hour}am`
            : bestHour.hour === 12
            ? "12pm"
            : `${bestHour.hour - 12}pm`;
        peakFocusTimes.push(`Your best focus time is around ${timeStr}`);
      }

      // Recommendations
      if (avgFocusBefore < 6) {
        recommendations.push("Consider improving sleep quality to boost focus");
      }
      if (avgDuration < 25) {
        recommendations.push("Try extending focus sessions to 25-50 minutes for deeper work");
      }
      if (profile.screenTimeHours && profile.screenTimeHours > 8) {
        recommendations.push("Reduce screen time to improve cognitive energy");
      }
    }

    return {
      insights,
      peakFocusTimes,
      recommendations,
    };
  }),
});

export type MentalEngineRouter = typeof mentalEngineRouter;
