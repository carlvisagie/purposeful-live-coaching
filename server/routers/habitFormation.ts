/**
 * HABIT FORMATION ROUTER
 * 
 * Comprehensive habit tracking system based on:
 * - James Clear's Atomic Habits (identity-based habits, habit stacking)
 * - BJ Fogg's Tiny Habits (start small, celebrate)
 * - Charles Duhigg's Habit Loop (cue-routine-reward)
 * - Streak tracking and automaticity levels
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { 
  habits, 
  habitProfiles, 
  habitTracking,
} from "../../drizzle/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";

export const habitFormationRouter = router({
  // ============================================================================
  // HABIT PROFILE
  // ============================================================================

  // Get or create user's habit profile
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      let profile = await db.query.habitProfiles.findFirst({
        where: eq(habitProfiles.userId, userId),
      });
      
      // Create profile if it doesn't exist
      if (!profile) {
        const newProfile = {
          id: `hp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          totalActiveHabits: 0,
          totalMasteredHabits: 0,
          longestStreak: 0,
        };
        
        await db.insert(habitProfiles).values(newProfile);
        profile = newProfile;
      }
      
      return profile;
    }),

  // ============================================================================
  // HABITS CRUD
  // ============================================================================

  // Create a new habit
  create: protectedProcedure
    .input(z.object({
      habitName: z.string().min(1).max(255),
      habitDescription: z.string().optional(),
      identityStatement: z.string().optional(), // "I am a person who..."
      habitType: z.enum(['build', 'break', 'improve']).optional(),
      category: z.enum(['health', 'productivity', 'relationships', 'mindfulness', 'learning', 'other']).optional(),
      tinyVersion: z.string().optional(), // Ridiculously small version
      fullVersion: z.string().optional(), // Full habit once established
      cue: z.string(), // What triggers the habit
      cueType: z.enum(['time', 'location', 'preceding_action', 'emotional_state', 'other_people']).optional(),
      routine: z.string(), // The habit itself
      reward: z.string().optional(), // What you get from it
      anchorHabit: z.string().optional(), // Existing habit to stack onto
      targetFrequency: z.enum(['daily', 'weekly', 'custom']).optional(),
      targetDuration: z.number().int().optional(), // minutes
      difficulty: z.number().int().min(1).max(10).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Get or create profile
      let profile = await db.query.habitProfiles.findFirst({
        where: eq(habitProfiles.userId, userId),
      });
      
      if (!profile) {
        const newProfile = {
          id: `hp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          totalActiveHabits: 0,
          totalMasteredHabits: 0,
          longestStreak: 0,
        };
        await db.insert(habitProfiles).values(newProfile);
        profile = newProfile;
      }
      
      // Create habit
      const habitId = `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Generate stacking formula if anchor habit provided
      let stackingFormula;
      if (input.anchorHabit) {
        stackingFormula = `After ${input.anchorHabit}, I will ${input.routine}`;
      }
      
      // Generate implementation intention
      let implementationIntention;
      if (input.cue) {
        implementationIntention = `If ${input.cue}, then I will ${input.routine}`;
      }
      
      const newHabit = {
        id: habitId,
        profileId: profile.id,
        userId,
        habitName: input.habitName,
        habitDescription: input.habitDescription,
        identityStatement: input.identityStatement,
        habitType: input.habitType,
        category: input.category,
        tinyVersion: input.tinyVersion,
        fullVersion: input.fullVersion,
        cue: input.cue,
        cueType: input.cueType,
        routine: input.routine,
        reward: input.reward,
        anchorHabit: input.anchorHabit,
        stackingFormula,
        implementationIntention,
        targetFrequency: input.targetFrequency || 'daily',
        targetDuration: input.targetDuration,
        difficulty: input.difficulty,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        successRate: '0',
        automaticityLevel: 1,
        status: 'active',
        startDate: new Date(),
      };
      
      await db.insert(habits).values(newHabit);
      
      // Update profile stats
      await db.update(habitProfiles)
        .set({ 
          totalActiveHabits: sql`${habitProfiles.totalActiveHabits} + 1`,
          updated_at: new Date(),
        })
        .where(eq(habitProfiles.id, profile.id));
      
      return newHabit;
    }),

  // Get all user's habits
  getAll: protectedProcedure
    .input(z.object({
      status: z.enum(['active', 'paused', 'mastered', 'abandoned']).optional(),
      category: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const conditions = [eq(habits.userId, userId)];
      
      if (input?.status) {
        conditions.push(eq(habits.status, input.status));
      }
      
      if (input?.category) {
        conditions.push(eq(habits.category, input.category));
      }
      
      const userHabits = await db.query.habits.findMany({
        where: and(...conditions),
        orderBy: [desc(habits.currentStreak), desc(habits.createdAt)],
      });
      
      return userHabits;
    }),

  // Get single habit with tracking history
  getById: protectedProcedure
    .input(z.object({
      habitId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const habit = await db.query.habits.findFirst({
        where: and(
          eq(habits.id, input.habitId),
          eq(habits.userId, userId)
        ),
      });
      
      if (!habit) {
        throw new Error("Habit not found");
      }
      
      // Get tracking history (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const trackingHistory = await db.query.habitTracking.findMany({
        where: and(
          eq(habitTracking.habitId, input.habitId),
          gte(habitTracking.trackingDate, thirtyDaysAgo)
        ),
        orderBy: [desc(habitTracking.trackingDate)],
      });
      
      return {
        ...habit,
        trackingHistory,
      };
    }),

  // Update habit
  update: protectedProcedure
    .input(z.object({
      habitId: z.string(),
      habitName: z.string().optional(),
      habitDescription: z.string().optional(),
      status: z.enum(['active', 'paused', 'mastered', 'abandoned']).optional(),
      targetFrequency: z.enum(['daily', 'weekly', 'custom']).optional(),
      targetDuration: z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { habitId, ...updates } = input;
      
      // Verify ownership
      const habit = await db.query.habits.findFirst({
        where: and(
          eq(habits.id, habitId),
          eq(habits.userId, userId)
        ),
      });
      
      if (!habit) {
        throw new Error("Habit not found");
      }
      
      await db.update(habits)
        .set({
          ...updates,
          updated_at: new Date(),
        })
        .where(eq(habits.id, habitId));
      
      return { success: true };
    }),

  // ============================================================================
  // HABIT TRACKING
  // ============================================================================

  // Log habit completion for today
  logCompletion: protectedProcedure
    .input(z.object({
      habitId: z.string(),
      completed: z.boolean(),
      duration: z.number().int().optional(), // minutes
      intensity: z.number().int().min(1).max(10).optional(),
      timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
      location: z.string().optional(),
      notes: z.string().optional(),
      resistanceLevel: z.number().int().min(1).max(10).optional(), // How hard was it to start?
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Verify ownership
      const habit = await db.query.habits.findFirst({
        where: and(
          eq(habits.id, input.habitId),
          eq(habits.userId, userId)
        ),
      });
      
      if (!habit) {
        throw new Error("Habit not found");
      }
      
      // Check if already logged today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingLog = await db.query.habitTracking.findFirst({
        where: and(
          eq(habitTracking.habitId, input.habitId),
          gte(habitTracking.trackingDate, today)
        ),
      });
      
      if (existingLog) {
        // Update existing log
        await db.update(habitTracking)
          .set({
            completed: input.completed,
            duration: input.duration,
            intensity: input.intensity,
            timeOfDay: input.timeOfDay,
            location: input.location,
            resistanceLevel: input.resistanceLevel,
          })
          .where(eq(habitTracking.id, existingLog.id));
      } else {
        // Create new log
        const trackingId = `ht_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await db.insert(habitTracking).values({
          id: trackingId,
          habitId: input.habitId,
          profileId: habit.profileId,
          userId,
          trackingDate: new Date(),
          completed: input.completed,
          duration: input.duration,
          intensity: input.intensity,
          timeOfDay: input.timeOfDay,
          location: input.location,
          resistanceLevel: input.resistanceLevel,
        });
      }
      
      // Update habit stats
      if (input.completed) {
        // Calculate new streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        const yesterdayLog = await db.query.habitTracking.findFirst({
          where: and(
            eq(habitTracking.habitId, input.habitId),
            gte(habitTracking.trackingDate, yesterday),
            eq(habitTracking.completed, true)
          ),
        });
        
        let newStreak = yesterdayLog ? habit.currentStreak + 1 : 1;
        let newLongestStreak = Math.max(newStreak, habit.longestStreak);
        let newTotalCompletions = habit.totalCompletions + 1;
        
        // Calculate success rate
        const totalLogs = await db.query.habitTracking.findMany({
          where: eq(habitTracking.habitId, input.habitId),
        });
        
        const completedLogs = totalLogs.filter(log => log.completed);
        const successRate = totalLogs.length > 0 
          ? ((completedLogs.length / totalLogs.length) * 100).toFixed(2)
          : '0';
        
        await db.update(habits)
          .set({
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            totalCompletions: newTotalCompletions,
            successRate,
            updated_at: new Date(),
          })
          .where(eq(habits.id, input.habitId));
        
        // Update profile longest streak if needed
        const profile = await db.query.habitProfiles.findFirst({
          where: eq(habitProfiles.userId, userId),
        });
        
        if (profile && newLongestStreak > profile.longestStreak) {
          await db.update(habitProfiles)
            .set({
              longestStreak: newLongestStreak,
              updated_at: new Date(),
            })
            .where(eq(habitProfiles.id, profile.id));
        }
        
        return { 
          success: true, 
          streak: newStreak,
          longestStreak: newLongestStreak,
          totalCompletions: newTotalCompletions,
        };
      } else {
        // Reset streak
        await db.update(habits)
          .set({
            currentStreak: 0,
            updated_at: new Date(),
          })
          .where(eq(habits.id, input.habitId));
        
        return { 
          success: true, 
          streak: 0,
          message: "Streak reset. Don't worry - you can start again tomorrow!",
        };
      }
    }),

  // Get today's habit checklist
  getTodayChecklist: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      // Get all active habits
      const activeHabits = await db.query.habits.findMany({
        where: and(
          eq(habits.userId, userId),
          eq(habits.status, 'active')
        ),
        orderBy: [desc(habits.currentStreak)],
      });
      
      // Get today's tracking logs
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayLogs = await db.query.habitTracking.findMany({
        where: and(
          eq(habitTracking.userId, userId),
          gte(habitTracking.trackingDate, today)
        ),
      });
      
      // Combine habits with today's completion status
      const checklist = activeHabits.map(habit => {
        const log = todayLogs.find(l => l.habitId === habit.id);
        return {
          ...habit,
          completedToday: log?.completed || false,
          todayLog: log,
        };
      });
      
      return checklist;
    }),

  // Get habit streak calendar (for visualization)
  getStreakCalendar: protectedProcedure
    .input(z.object({
      habitId: z.string(),
      days: z.number().int().min(7).max(365).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const days = input.days || 30;
      
      // Verify ownership
      const habit = await db.query.habits.findFirst({
        where: and(
          eq(habits.id, input.habitId),
          eq(habits.userId, userId)
        ),
      });
      
      if (!habit) {
        throw new Error("Habit not found");
      }
      
      // Get tracking logs for the period
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const logs = await db.query.habitTracking.findMany({
        where: and(
          eq(habitTracking.habitId, input.habitId),
          gte(habitTracking.trackingDate, startDate)
        ),
        orderBy: [desc(habitTracking.trackingDate)],
      });
      
      return {
        habit,
        logs,
        totalDays: days,
        completedDays: logs.filter(l => l.completed).length,
        missedDays: logs.filter(l => !l.completed).length,
      };
    }),

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  // Get habit statistics
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      const profile = await db.query.habitProfiles.findFirst({
        where: eq(habitProfiles.userId, userId),
      });
      
      const activeHabits = await db.query.habits.findMany({
        where: and(
          eq(habits.userId, userId),
          eq(habits.status, 'active')
        ),
      });
      
      const masteredHabits = await db.query.habits.findMany({
        where: and(
          eq(habits.userId, userId),
          eq(habits.status, 'mastered')
        ),
      });
      
      // Calculate total completions across all habits
      const totalCompletions = activeHabits.reduce((sum, h) => sum + h.totalCompletions, 0);
      
      // Find habit with longest current streak
      const longestStreakHabit = activeHabits.reduce((max, h) => 
        h.currentStreak > (max?.currentStreak || 0) ? h : max
      , activeHabits[0]);
      
      return {
        totalActiveHabits: profile?.totalActiveHabits || 0,
        totalMasteredHabits: profile?.totalMasteredHabits || 0,
        longestStreak: profile?.longestStreak || 0,
        totalCompletions,
        activeHabitsCount: activeHabits.length,
        masteredHabitsCount: masteredHabits.length,
        longestStreakHabit: longestStreakHabit ? {
          name: longestStreakHabit.habitName,
          streak: longestStreakHabit.currentStreak,
        } : null,
      };
    }),
});
