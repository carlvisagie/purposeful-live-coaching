/**
 * PHYSICAL ENGINE ROUTER
 * Evidence-based fitness and movement tracking
 * Integrated with ProfileGuard, SelfLearning, and SelfFixing
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { physicalProfiles, workouts } from "../../drizzle/physicalEngineSchema";
import { eq, desc, and, gte } from "drizzle-orm";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

export const physicalEngineRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const clientContext = await ProfileGuard.getClientContext(userId, {
      moduleName: "physical_engine",
      logAccess: true,
    });

    let profile = await db.query.physicalProfiles?.findFirst({
      where: eq(physicalProfiles.userId, String(userId)),
    });

    if (!profile) {
      const newProfile = {
        id: `physical_${userId}_${Date.now()}`,
        userId: String(userId),
        fitnessLevel: 5,
        energyLevel: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.insert(physicalProfiles).values(newProfile);
      profile = newProfile;
    }

    return { profile, clientContext };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        fitnessLevel: z.number().min(1).max(10).optional(),
        energyLevel: z.number().min(1).max(10).optional(),
        primaryGoal: z.string().optional(),
        currentWeight: z.number().optional(),
        targetWeight: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "physical_engine" });

      const profile = await db.query.physicalProfiles?.findFirst({
        where: eq(physicalProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Physical profile not found" });
      }

      await db.update(physicalProfiles).set({ ...input, updatedAt: new Date() }).where(eq(physicalProfiles.id, profile.id));

      SelfLearning.trackFeatureUsage("physical_engine/updateProfile", "Physical Engine: Update Profile", userId);
      return { success: true };
    }),

  logWorkout: protectedProcedure
    .input(
      z.object({
        workoutType: z.string(),
        duration: z.number(),
        intensity: z.number().min(1).max(10),
        caloriesBurned: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "physical_engine" });

      const profile = await db.query.physicalProfiles?.findFirst({
        where: eq(physicalProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Physical profile not found" });
      }

      const workout = {
        id: `workout_${userId}_${Date.now()}`,
        profileId: profile.id,
        userId: String(userId),
        workoutDate: new Date(),
        workoutType: input.workoutType,
        duration: input.duration,
        createdAt: new Date(),
      };

      await db.insert(workouts).values(workout);
      SelfLearning.trackFeatureUsage("physical_engine/logWorkout", "Physical Engine: Log Workout", userId);
      return { success: true, workoutId: workout.id };
    }),

  getWorkoutHistory: protectedProcedure
    .input(z.object({ days: z.number().default(30), limit: z.number().default(100) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "physical_engine" });

      const profile = await db.query.physicalProfiles?.findFirst({
        where: eq(physicalProfiles.userId, String(userId)),
      });

      if (!profile) return { workouts: [] };

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const workoutList = await db.query.workouts?.findMany({
        where: and(eq(workouts.profileId, profile.id), gte(workouts.workoutDate, daysAgo)),
        orderBy: [desc(workouts.workoutDate)],
        limit: input.limit,
      });

      return { workouts: workoutList || [] };
    }),
});

export type PhysicalEngineRouter = typeof physicalEngineRouter;
