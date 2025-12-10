/**
 * GOALS ROUTER
 * 
 * Comprehensive goal-setting and tracking system based on:
 * - SMART goals
 * - OKRs (Objectives & Key Results)
 * - WOOP method (Wish, Outcome, Obstacle, Plan)
 * - Implementation intentions
 * - Progress tracking and analytics
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { 
  goals, 
  goalProfiles, 
  goalProgressLogs, 
  goalMilestones,
  goalObstacles,
  okrs,
  keyResults,
  woopPlans,
  implementationIntentions
} from "../../drizzle/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";

// ============================================================================
// GOAL PROFILE
// ============================================================================

export const goalsRouter = router({
  // Get or create user's goal profile
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      let profile = await db.query.goalProfiles.findFirst({
        where: eq(goalProfiles.userId, userId),
      });
      
      // Create profile if it doesn't exist
      if (!profile) {
        const newProfile = {
          id: `gp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          totalGoalsSet: 0,
          totalGoalsAchieved: 0,
          totalGoalsAbandoned: 0,
        };
        
        await db.insert(goalProfiles).values(newProfile);
        profile = newProfile;
      }
      
      return profile;
    }),

  // ============================================================================
  // GOALS CRUD
  // ============================================================================

  // Create a new goal
  create: protectedProcedure
    .input(z.object({
      goalName: z.string().min(1).max(255),
      description: z.string().optional(),
      goalType: z.enum(['outcome', 'process', 'performance', 'learning', 'avoidance']).optional(),
      framework: z.enum(['smart', 'okr', 'woop', 'habit-based', 'identity-based']).optional(),
      category: z.enum(['career', 'health', 'relationships', 'financial', 'personal', 'spiritual', 'other']).optional(),
      difficulty: z.number().int().min(1).max(10).optional(),
      startDate: z.string().optional(),
      targetDate: z.string().optional(),
      metricType: z.string().optional(),
      currentValue: z.number().optional(),
      targetValue: z.number().optional(),
      unit: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      isPublic: z.boolean().optional(),
      relatedHabitId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Get or create profile
      let profile = await db.query.goalProfiles.findFirst({
        where: eq(goalProfiles.userId, userId),
      });
      
      if (!profile) {
        const newProfile = {
          id: `gp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          totalGoalsSet: 0,
          totalGoalsAchieved: 0,
          totalGoalsAbandoned: 0,
        };
        await db.insert(goalProfiles).values(newProfile);
        profile = newProfile;
      }
      
      // Create goal
      const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newGoal = {
        id: goalId,
        profileId: profile.id,
        userId,
        goalName: input.goalName,
        description: input.description,
        goalType: input.goalType,
        framework: input.framework,
        category: input.category,
        difficulty: input.difficulty,
        startDate: input.startDate ? new Date(input.startDate) : new Date(),
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
        metricType: input.metricType,
        currentValue: input.currentValue?.toString(),
        targetValue: input.targetValue?.toString(),
        unit: input.unit,
        progressPercent: '0',
        status: 'active',
        priority: input.priority || 'medium',
        isPublic: input.isPublic || false,
        relatedHabitId: input.relatedHabitId,
      };
      
      await db.insert(goals).values(newGoal);
      
      // Update profile stats
      await db.update(goalProfiles)
        .set({ 
          totalGoalsSet: sql`${goalProfiles.totalGoalsSet} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(goalProfiles.id, profile.id));
      
      return newGoal;
    }),

  // Get all user's goals
  getAll: protectedProcedure
    .input(z.object({
      status: z.enum(['active', 'completed', 'abandoned', 'paused']).optional(),
      category: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const conditions = [eq(goals.userId, userId)];
      
      if (input?.status) {
        conditions.push(eq(goals.status, input.status));
      }
      
      if (input?.category) {
        conditions.push(eq(goals.category, input.category));
      }
      
      const userGoals = await db.query.goals.findMany({
        where: and(...conditions),
        orderBy: [desc(goals.createdAt)],
      });
      
      return userGoals;
    }),

  // Get single goal with details
  getById: protectedProcedure
    .input(z.object({
      goalId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const goal = await db.query.goals.findFirst({
        where: and(
          eq(goals.id, input.goalId),
          eq(goals.userId, userId)
        ),
      });
      
      if (!goal) {
        throw new Error("Goal not found");
      }
      
      // Get related data
      const [progressLogs, milestones, obstacles] = await Promise.all([
        db.query.goalProgressLogs.findMany({
          where: eq(goalProgressLogs.goalId, input.goalId),
          orderBy: [desc(goalProgressLogs.logDate)],
          limit: 20,
        }),
        db.query.goalMilestones.findMany({
          where: eq(goalMilestones.goalId, input.goalId),
          orderBy: [sql`${goalMilestones.sequenceOrder} ASC`],
        }),
        db.query.goalObstacles.findMany({
          where: eq(goalObstacles.goalId, input.goalId),
          orderBy: [desc(goalObstacles.createdAt)],
        }),
      ]);
      
      return {
        ...goal,
        progressLogs,
        milestones,
        obstacles,
      };
    }),

  // Update goal
  update: protectedProcedure
    .input(z.object({
      goalId: z.string(),
      goalName: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(['active', 'completed', 'abandoned', 'paused']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      currentValue: z.number().optional(),
      targetValue: z.number().optional(),
      targetDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { goalId, ...updates } = input;
      
      // Verify ownership
      const goal = await db.query.goals.findFirst({
        where: and(
          eq(goals.id, goalId),
          eq(goals.userId, userId)
        ),
      });
      
      if (!goal) {
        throw new Error("Goal not found");
      }
      
      // Calculate progress if values updated
      let progressPercent = goal.progressPercent;
      if (updates.currentValue !== undefined && goal.targetValue) {
        const current = updates.currentValue;
        const target = parseFloat(goal.targetValue);
        progressPercent = ((current / target) * 100).toFixed(2);
      }
      
      const updateData: any = {
        ...updates,
        progressPercent,
        updatedAt: new Date(),
      };
      
      if (updates.targetDate) {
        updateData.targetDate = new Date(updates.targetDate);
      }
      
      if (updates.currentValue !== undefined) {
        updateData.currentValue = updates.currentValue.toString();
      }
      
      if (updates.targetValue !== undefined) {
        updateData.targetValue = updates.targetValue.toString();
      }
      
      await db.update(goals)
        .set(updateData)
        .where(eq(goals.id, goalId));
      
      return { success: true };
    }),

  // Log progress
  logProgress: protectedProcedure
    .input(z.object({
      goalId: z.string(),
      currentValue: z.number(),
      notes: z.string().optional(),
      momentum: z.enum(['accelerating', 'steady', 'slowing', 'stalled']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Verify ownership
      const goal = await db.query.goals.findFirst({
        where: and(
          eq(goals.id, input.goalId),
          eq(goals.userId, userId)
        ),
      });
      
      if (!goal) {
        throw new Error("Goal not found");
      }
      
      // Calculate progress
      let progressPercent = '0';
      if (goal.targetValue) {
        const target = parseFloat(goal.targetValue);
        progressPercent = ((input.currentValue / target) * 100).toFixed(2);
      }
      
      // Create progress log
      const logId = `gpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.insert(goalProgressLogs).values({
        id: logId,
        goalId: input.goalId,
        userId,
        currentValue: input.currentValue.toString(),
        progressPercent,
        notes: input.notes,
        momentum: input.momentum,
        logDate: new Date(),
      });
      
      // Update goal
      await db.update(goals)
        .set({
          currentValue: input.currentValue.toString(),
          progressPercent,
          updatedAt: new Date(),
        })
        .where(eq(goals.id, input.goalId));
      
      return { success: true, progressPercent };
    }),

  // Mark goal as complete
  complete: protectedProcedure
    .input(z.object({
      goalId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Verify ownership
      const goal = await db.query.goals.findFirst({
        where: and(
          eq(goals.id, input.goalId),
          eq(goals.userId, userId)
        ),
      });
      
      if (!goal) {
        throw new Error("Goal not found");
      }
      
      // Update goal
      await db.update(goals)
        .set({
          status: 'completed',
          progressPercent: '100',
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(goals.id, input.goalId));
      
      // Update profile stats
      await db.update(goalProfiles)
        .set({
          totalGoalsAchieved: sql`${goalProfiles.totalGoalsAchieved} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(goalProfiles.userId, userId));
      
      return { success: true };
    }),

  // Abandon goal
  abandon: protectedProcedure
    .input(z.object({
      goalId: z.string(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Verify ownership
      const goal = await db.query.goals.findFirst({
        where: and(
          eq(goals.id, input.goalId),
          eq(goals.userId, userId)
        ),
      });
      
      if (!goal) {
        throw new Error("Goal not found");
      }
      
      // Update goal
      await db.update(goals)
        .set({
          status: 'abandoned',
          abandonedAt: new Date(),
          abandonReason: input.reason,
          updatedAt: new Date(),
        })
        .where(eq(goals.id, input.goalId));
      
      // Update profile stats
      await db.update(goalProfiles)
        .set({
          totalGoalsAbandoned: sql`${goalProfiles.totalGoalsAbandoned} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(goalProfiles.userId, userId));
      
      return { success: true };
    }),

  // ============================================================================
  // MILESTONES
  // ============================================================================

  // Add milestone to goal
  addMilestone: protectedProcedure
    .input(z.object({
      goalId: z.string(),
      milestoneName: z.string(),
      description: z.string().optional(),
      targetValue: z.number().optional(),
      targetDate: z.string().optional(),
      sequenceOrder: z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Verify goal ownership
      const goal = await db.query.goals.findFirst({
        where: and(
          eq(goals.id, input.goalId),
          eq(goals.userId, userId)
        ),
      });
      
      if (!goal) {
        throw new Error("Goal not found");
      }
      
      const milestoneId = `gm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.insert(goalMilestones).values({
        id: milestoneId,
        goalId: input.goalId,
        userId,
        milestoneName: input.milestoneName,
        description: input.description,
        targetValue: input.targetValue?.toString(),
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
        sequenceOrder: input.sequenceOrder,
      });
      
      return { success: true, milestoneId };
    }),

  // Mark milestone as achieved
  achieveMilestone: protectedProcedure
    .input(z.object({
      milestoneId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Verify ownership
      const milestone = await db.query.goalMilestones.findFirst({
        where: and(
          eq(goalMilestones.id, input.milestoneId),
          eq(goalMilestones.userId, userId)
        ),
      });
      
      if (!milestone) {
        throw new Error("Milestone not found");
      }
      
      await db.update(goalMilestones)
        .set({
          achieved: true,
          achievedAt: new Date(),
        })
        .where(eq(goalMilestones.id, input.milestoneId));
      
      return { success: true };
    }),

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  // Get goal statistics
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      const profile = await db.query.goalProfiles.findFirst({
        where: eq(goalProfiles.userId, userId),
      });
      
      const activeGoals = await db.query.goals.findMany({
        where: and(
          eq(goals.userId, userId),
          eq(goals.status, 'active')
        ),
      });
      
      const completedGoals = await db.query.goals.findMany({
        where: and(
          eq(goals.userId, userId),
          eq(goals.status, 'completed')
        ),
      });
      
      // Calculate average progress
      const avgProgress = activeGoals.length > 0
        ? activeGoals.reduce((sum, g) => sum + parseFloat(g.progressPercent || '0'), 0) / activeGoals.length
        : 0;
      
      return {
        totalGoalsSet: profile?.totalGoalsSet || 0,
        totalGoalsAchieved: profile?.totalGoalsAchieved || 0,
        totalGoalsAbandoned: profile?.totalGoalsAbandoned || 0,
        achievementRate: profile?.achievementRate || '0',
        activeGoalsCount: activeGoals.length,
        completedGoalsCount: completedGoals.length,
        averageProgress: avgProgress.toFixed(2),
      };
    }),
});
