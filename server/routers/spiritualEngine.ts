/**
 * SPIRITUAL ENGINE ROUTER
 * Evidence-based spiritual practices and meditation tracking
 * Integrated with ProfileGuard, SelfLearning, and SelfFixing
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { spiritualProfiles, meditationSessions } from "../../drizzle/spiritualEngineSchema";
import { eq, desc, and, gte } from "drizzle-orm";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

export const spiritualEngineRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const clientContext = await ProfileGuard.getClientContext(userId, {
      moduleName: "spiritual_engine",
      logAccess: true,
    });

    let profile = await db.query.spiritualProfiles?.findFirst({
      where: eq(spiritualProfiles.userId, String(userId)),
    });

    if (!profile) {
      const newProfile = {
        id: `spiritual_${userId}_${Date.now()}`,
        userId: String(userId),
        spiritualWellbeing: 5,
        innerPeace: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.insert(spiritualProfiles).values(newProfile);
      profile = newProfile;
    }

    return { profile, clientContext };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        spiritualWellbeing: z.number().min(1).max(10).optional(),
        innerPeace: z.number().min(1).max(10).optional(),
        primaryGoal: z.string().optional(),
        spiritualTradition: z.string().optional(),
        practiceFrequency: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "spiritual_engine" });

      const profile = await db.query.spiritualProfiles?.findFirst({
        where: eq(spiritualProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Spiritual profile not found" });
      }

      await db.update(spiritualProfiles).set({ ...input, updatedAt: new Date() }).where(eq(spiritualProfiles.id, profile.id));

      SelfLearning.trackFeatureUsage("spiritual_engine/updateProfile", "Spiritual Engine: Update Profile", userId);
      return { success: true };
    }),

  logMeditation: protectedProcedure
    .input(
      z.object({
        meditationType: z.string(),
        duration: z.number(),
        focusQuality: z.number().min(1).max(10),
        innerPeaceBefore: z.number().min(1).max(10),
        innerPeaceAfter: z.number().min(1).max(10),
        insights: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "spiritual_engine" });

      const profile = await db.query.spiritualProfiles?.findFirst({
        where: eq(spiritualProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Spiritual profile not found" });
      }

      const session = {
        id: `meditation_${userId}_${Date.now()}`,
        profileId: profile.id,
        userId: String(userId),
        sessionDate: new Date(),
        meditationType: input.meditationType,
        duration: input.duration,
        createdAt: new Date(),
      };

      await db.insert(meditationSessions).values(session);
      SelfLearning.trackFeatureUsage("spiritual_engine/logMeditation", "Spiritual Engine: Log Meditation", userId);
      return { success: true, sessionId: session.id };
    }),

  getMeditationHistory: protectedProcedure
    .input(z.object({ days: z.number().default(30), limit: z.number().default(100) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "spiritual_engine" });

      const profile = await db.query.spiritualProfiles?.findFirst({
        where: eq(spiritualProfiles.userId, String(userId)),
      });

      if (!profile) return { sessions: [] };

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const sessions = await db.query.meditationSessions?.findMany({
        where: and(eq(meditationSessions.profileId, profile.id), gte(meditationSessions.sessionDate, daysAgo)),
        orderBy: [desc(meditationSessions.sessionDate)],
        limit: input.limit,
      });

      return { sessions: sessions || [] };
    }),
});

export type SpiritualEngineRouter = typeof spiritualEngineRouter;
