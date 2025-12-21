import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { dailyCheckIns, habits, habitCompletions } from "../../drizzle/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import ProfileGuard from "../profileGuard";
import SelfLearning from "../selfLearningIntegration";

export const dailyCheckInsRouter = router({
  /**
   * Create a daily check-in (morning or evening)
   */
  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["morning", "evening"]),
        gratitude: z.string().optional(),
        intention: z.string().optional(),
        reflection: z.string().optional(),
        wins: z.string().optional(),
        lessons: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      // Track check-in for self-learning
      if (userId) {
        SelfLearning.trackOutcome(userId, "daily_check_ins", {
          checkInType: input.type,
          hasGratitude: !!input.gratitude,
          hasIntention: !!input.intention,
        }).catch(console.error);
      }
      
      const checkIn = await db.insert(dailyCheckIns).values({
        userId: userId,
        type: input.type,
        gratitude: input.gratitude,
        intention: input.intention,
        reflection: input.reflection,
        wins: input.wins,
        lessons: input.lessons,
      }).returning();

      return checkIn[0];
    }),

  /**
   * Get recent check-ins
   */
  getRecent: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(7),
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      const checkIns = await db
        .select()
        .from(dailyCheckIns)
        .where(eq(dailyCheckIns.userId, userId))
        .orderBy(desc(dailyCheckIns.createdAt))
        .limit(input.limit);

      return checkIns;
    }),

  /**
   * Get check-ins for a specific date range
   */
  getByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      const checkIns = await db
        .select()
        .from(dailyCheckIns)
        .where(
          and(
            eq(dailyCheckIns.userId, userId),
            gte(dailyCheckIns.createdAt, new Date(input.startDate)),
            lte(dailyCheckIns.createdAt, new Date(input.endDate))
          )
        )
        .orderBy(desc(dailyCheckIns.createdAt));

      return checkIns;
    }),

  /**
   * Get today's check-ins
   */
  getToday: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const checkIns = await db
        .select()
        .from(dailyCheckIns)
        .where(
          and(
            eq(dailyCheckIns.userId, userId),
          gte(dailyCheckIns.createdAt, today),
          lte(dailyCheckIns.createdAt, tomorrow)
        )
      )
      .orderBy(desc(dailyCheckIns.createdAt));

    return {
      morning: checkIns.find((c) => c.type === "morning"),
      evening: checkIns.find((c) => c.type === "evening"),
    };
  }),

  /**
   * Create a habit
   */
  createHabit: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
        frequency: z.enum(["daily", "weekly"]).default("daily"),
        targetDays: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      const habit = await db.insert(habits).values({
        userId: userId,
        ...input,
      }).returning();

      return habit[0];
    }),

  /**
   * Get all habits
   */
  getHabits: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      const userHabits = await db
        .select()
        .from(habits)
        .where(and(eq(habits.userId, userId), eq(habits.isActive, true)))
      .orderBy(desc(habits.createdAt));

    return userHabits;
  }),

  /**
   * Complete a habit for today
   */
  completeHabit: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        notes: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // Check if already completed today
      const existing = await db
        .select()
        .from(habitCompletions)
        .where(
          and(
            eq(habitCompletions.habitId, input.habitId),
            eq(habitCompletions.userId, userId),
            eq(habitCompletions.date, today)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Habit already completed today",
        });
      }

      // Create completion
      const completion = await db.insert(habitCompletions).values({
        habitId: input.habitId,
        userId: userId,
        date: today,
        notes: input.notes,
      }).returning();

      // Update habit stats
      const habit = await db
        .select()
        .from(habits)
        .where(eq(habits.id, input.habitId))
        .limit(1);

      if (habit.length > 0) {
        const newStreak = (habit[0].currentStreak || 0) + 1;
        const newLongest = Math.max(newStreak, habit[0].longestStreak || 0);
        const newTotal = (habit[0].totalCompletions || 0) + 1;

        await db
          .update(habits)
          .set({
            currentStreak: newStreak,
            longestStreak: newLongest,
            totalCompletions: newTotal,
            updatedAt: new Date(),
          })
          .where(eq(habits.id, input.habitId));
      }

      return completion[0];
    }),

  /**
   * Get habit completions for a date range
   */
  getHabitCompletions: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      const completions = await db
        .select()
        .from(habitCompletions)
        .where(
          and(
            eq(habitCompletions.habitId, input.habitId),
            eq(habitCompletions.userId, userId),
            gte(habitCompletions.date, input.startDate),
            lte(habitCompletions.date, input.endDate)
          )
        )
        .orderBy(desc(habitCompletions.date));

      return completions;
    }),

  /**
   * Delete a habit
   */
  deleteHabit: protectedProcedure
    .input(z.object({ habitId: z.string(), userId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user?.id;
      
      // PROFILE GUARD - Load client context
      const clientContext = await ProfileGuard.getClientContext(userId, {
        moduleName: "daily_check_ins",
        logAccess: true,
      });
      
      await db
        .update(habits)
        .set({ isActive: false })
        .where(
          and(eq(habits.id, input.habitId), eq(habits.userId, userId))
        );

      return { success: true };
    }),
});
