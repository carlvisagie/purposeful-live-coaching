/**
 * NUTRITION ENGINE ROUTER
 * Evidence-based nutrition and supplement tracking
 * Integrated with ProfileGuard, SelfLearning, and SelfFixing
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { nutritionProfiles, mealEntries } from "../../drizzle/nutritionEngineSchema";
import { eq, desc, and, gte } from "drizzle-orm";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

export const nutritionEngineRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const clientContext = await ProfileGuard.getClientContext(userId, {
      moduleName: "nutrition_engine",
      logAccess: true,
    });

    let profile = await db.query.nutritionProfiles?.findFirst({
      where: eq(nutritionProfiles.userId, String(userId)),
    });

    if (!profile) {
      const newProfile = {
        id: `nutrition_${userId}_${Date.now()}`,
        userId: String(userId),
        energyLevel: 5,
        digestiveHealth: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.insert(nutritionProfiles).values(newProfile);
      profile = newProfile;
    }

    return { profile, clientContext };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        energyLevel: z.number().min(1).max(10).optional(),
        digestiveHealth: z.number().min(1).max(10).optional(),
        primaryGoal: z.string().optional(),
        dietaryRestrictions: z.string().optional(),
        foodSensitivities: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "nutrition_engine" });

      const profile = await db.query.nutritionProfiles?.findFirst({
        where: eq(nutritionProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Nutrition profile not found" });
      }

      await db.update(nutritionProfiles).set({ ...input, updatedAt: new Date() }).where(eq(nutritionProfiles.id, profile.id));

      SelfLearning.trackFeatureUsage("nutrition_engine/updateProfile", "Nutrition Engine: Update Profile", userId);
      return { success: true };
    }),

  logMeal: protectedProcedure
    .input(
      z.object({
        mealType: z.string(),
        foods: z.array(z.string()),
        calories: z.number().optional(),
        protein: z.number().optional(),
        carbs: z.number().optional(),
        fats: z.number().optional(),
        energyAfter: z.number().min(1).max(10).optional(),
        digestiveResponse: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "nutrition_engine" });

      const profile = await db.query.nutritionProfiles?.findFirst({
        where: eq(nutritionProfiles.userId, String(userId)),
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Nutrition profile not found" });
      }

      const meal = {
        id: `meal_${userId}_${Date.now()}`,
        profileId: profile.id,
        userId: String(userId),
        mealDate: new Date(),
        mealType: input.mealType,
        foods: JSON.stringify(input.foods),
        createdAt: new Date(),
      };

      await db.insert(mealEntries).values(meal);
      SelfLearning.trackFeatureUsage("nutrition_engine/logMeal", "Nutrition Engine: Log Meal", userId);
      return { success: true, mealId: meal.id };
    }),

  getMealHistory: protectedProcedure
    .input(z.object({ days: z.number().default(30), limit: z.number().default(100) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ProfileGuard.getClientContext(userId, { moduleName: "nutrition_engine" });

      const profile = await db.query.nutritionProfiles?.findFirst({
        where: eq(nutritionProfiles.userId, String(userId)),
      });

      if (!profile) return { meals: [] };

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const meals = await db.query.mealEntries?.findMany({
        where: and(eq(mealEntries.profileId, profile.id), gte(mealEntries.mealDate, daysAgo)),
        orderBy: [desc(mealEntries.mealDate)],
        limit: input.limit,
      });

      return { meals: meals || [] };
    }),
});

export type NutritionEngineRouter = typeof nutritionEngineRouter;
