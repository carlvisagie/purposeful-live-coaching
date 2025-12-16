import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { users, subscriptions, sessions, aiChatMessages, coachAvailability, coaches } from "../../drizzle/schema";
import { eq, gte, sql, and, desc, isNotNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Admin Router
 * 
 * Provides admin-only endpoints for platform management:
 * - User statistics
 * - Revenue tracking
 * - Crisis alert monitoring
 * - Analytics and insights
 * 
 * All procedures require admin role.
 * 
 * FIXED: Uses correct table names (sessions, aiChatMessages) instead of non-existent tables
 */

// Admin-only procedure wrapper
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Admin access required' 
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /**
   * Get platform statistics
   * Returns: total users, new users, active sessions, crisis alerts, revenue
   */
  getStats: adminProcedure
    .input(z.object({
      timeRange: z.enum(["7d", "30d", "90d"]).default("30d"),
    }))
    .query(async ({ input }) => {
      const now = new Date();
      const daysAgo = input.timeRange === "7d" ? 7 : input.timeRange === "30d" ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Total users
      const totalUsersResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users);
      const totalUsers = Number(totalUsersResult[0]?.count || 0);

      // New users in time range
      const newUsersResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(gte(users.createdAt, startDate));
      const newUsers = Number(newUsersResult[0]?.count || 0);

      // Active sessions in time range (using sessions table, not therapySessions)
      const activeSessionsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(sessions)
        .where(
          and(
            gte(sessions.scheduledDate, startDate),
            eq(sessions.status, "scheduled")
          )
        );
      const activeSessions = Number(activeSessionsResult[0]?.count || 0);

      // Pending crisis alerts (using aiChatMessages.crisisFlag)
      const crisisAlertsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(aiChatMessages)
        .where(eq(aiChatMessages.crisisFlag, "true"));
      const pendingCrisisAlerts = Number(crisisAlertsResult[0]?.count || 0);

      // Revenue in time range (using sessions.price, not payments table)
      const revenueResult = await db
        .select({ total: sql<number>`sum(${sessions.price})` })
        .from(sessions)
        .where(
          and(
            gte(sessions.createdAt, startDate),
            eq(sessions.paymentStatus, "paid")
          )
        );
      const revenueMTD = Number(revenueResult[0]?.total || 0) / 100; // Convert cents to dollars

      // Revenue growth (compare to previous period)
      const previousStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const previousRevenueResult = await db
        .select({ total: sql<number>`sum(${sessions.price})` })
        .from(sessions)
        .where(
          and(
            gte(sessions.createdAt, previousStartDate),
            sql`${sessions.createdAt} < ${startDate}`,
            eq(sessions.paymentStatus, "paid")
          )
        );
      const previousRevenue = Number(previousRevenueResult[0]?.total || 0) / 100;
      const revenueGrowth = previousRevenue > 0 
        ? Math.round(((revenueMTD - previousRevenue) / previousRevenue) * 100) 
        : 0;

      // Users by tier (subscription tiers)
      const usersByTierResult = await db
        .select({
          tier: subscriptions.tier,
          count: sql<number>`count(*)`,
        })
        .from(subscriptions)
        .where(eq(subscriptions.status, "active"))
        .groupBy(subscriptions.tier);

      const usersByTier = {
        basic: 0,
        premium: 0,
        elite: 0,
      };

      usersByTierResult.forEach((row) => {
        const tier = (row.tier || "").toLowerCase();
        if (tier === "basic" || tier === "ai_basic") {
          usersByTier.basic += Number(row.count);
        } else if (tier === "premium" || tier === "ai_premium" || tier === "professional") {
          usersByTier.premium += Number(row.count);
        } else if (tier === "elite" || tier === "ai_elite") {
          usersByTier.elite += Number(row.count);
        }
      });

      return {
        totalUsers,
        newUsersThisMonth: newUsers,
        activeSessions,
        pendingCrisisAlerts,
        revenueMTD,
        revenueGrowth,
        usersByTier,
      };
    }),

  /**
   * Get recent users
   * Returns: list of recently registered users
   */
  getRecentUsers: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ input }) => {
      const recentUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          created_at: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(input.limit);

      return recentUsers;
    }),

  /**
   * Get crisis alerts
   * Returns: list of crisis alerts from AI chat messages
   */
  getCrisisAlerts: adminProcedure
    .input(z.object({
      status: z.enum(["pending", "acknowledged", "resolved"]).optional(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      // Crisis alerts are stored in aiChatMessages with crisisFlag = "true"
      // For now, we'll return all flagged messages (status filtering can be added later)
      const alerts = await db
        .select({
          id: aiChatMessages.id,
          user_id: aiChatMessages.userId,
          message: aiChatMessages.message,
          crisisFlag: aiChatMessages.crisisFlag,
          created_at: aiChatMessages.createdAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(aiChatMessages)
        .leftJoin(users, eq(aiChatMessages.userId, users.id))
        .where(eq(aiChatMessages.crisisFlag, "true"))
        .orderBy(desc(aiChatMessages.createdAt))
        .limit(input.limit);

      // Transform to match expected format
      return alerts.map(alert => ({
        id: alert.id,
        client_id: alert.userId || 0,
        severity: "high", // Default severity since we don't have this field
        triggerType: "ai_detected", // Default trigger type
        message: alert.message || "Crisis flag detected in AI conversation",
        status: "pending", // Default status (we don't track this yet)
        created_at: alert.createdAt,
        clientName: alert.userName || "Unknown",
        clientEmail: alert.userEmail || "N/A",
      }));
    }),

  /**
   * Acknowledge crisis alert
   * Marks a crisis alert as acknowledged by admin
   * NOTE: Currently a no-op since we don't have a crisisAlerts table
   * In the future, add a separate crisis_alerts table or add status field to aiChatMessages
   */
  acknowledgeCrisisAlert: adminProcedure
    .input(z.object({
      alertId: z.number(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Add crisis alert status tracking
      // For now, just return success
      return { success: true, message: "Crisis alert acknowledgment not yet implemented" };
    }),

  /**
   * Resolve crisis alert
   * Marks a crisis alert as resolved
   * NOTE: Currently a no-op since we don't have a crisisAlerts table
   */
  resolveCrisisAlert: adminProcedure
    .input(z.object({
      alertId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Add crisis alert status tracking
      // For now, just return success
      return { success: true, message: "Crisis alert resolution not yet implemented" };
    }),

  /**
   * Get revenue analytics
   * Returns: revenue breakdown by period (using sessions.price)
   */
  getRevenueAnalytics: adminProcedure
    .input(z.object({
      timeRange: z.enum(["7d", "30d", "90d"]).default("30d"),
    }))
    .query(async ({ input }) => {
      const now = new Date();
      const daysAgo = input.timeRange === "7d" ? 7 : input.timeRange === "30d" ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Revenue by day (using sessions table)
      const revenueByDay = await db
        .select({
          date: sql<string>`DATE(${sessions.createdAt})`,
          total: sql<number>`sum(${sessions.price})`,
          count: sql<number>`count(*)`,
        })
        .from(sessions)
        .where(
          and(
            gte(sessions.createdAt, startDate),
            eq(sessions.paymentStatus, "paid")
          )
        )
        .groupBy(sql`DATE(${sessions.createdAt})`)
        .orderBy(sql`DATE(${sessions.createdAt})`);

      return revenueByDay.map(row => ({
        date: row.date,
        total: Number(row.total) / 100, // Convert cents to dollars
        count: Number(row.count),
      }));
    }),

  /**
   * Seed coach availability
   * Creates availability schedule:
   * - Weekdays (Mon-Fri): 19:45 - 21:45 (7:45 PM - 9:45 PM)
   * - Weekends (Sat-Sun): 09:00 - 16:30 (9:00 AM - 4:30 PM)
   */
  seedDefaultAvailability: adminProcedure
    .mutation(async () => {
      // First, ensure coach exists
      const existingCoach = await db
        .select()
        .from(coaches)
        .where(eq(coaches.id, 1))
        .limit(1);

      if (existingCoach.length === 0) {
        // Create default coach
        await db.insert(coaches).values({
          id: 1,
          name: "Carl Visagie",
          email: "carl@purposefullive.com",
          bio: "Professional Life Coach specializing in holistic wellness and personal transformation",
          specialties: "Emotional Wellness, Mental Health, Physical Fitness, Nutrition, Spiritual Wellness",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Delete existing availability for coach ID 1 (allows re-seeding)
      await db
        .delete(coachAvailability)
        .where(eq(coachAvailability.coachId, 1));

      // Create availability with correct schedule
      // Weekdays: 19:45 - 21:45 (7:45 PM - 9:45 PM)
      // Weekends: 09:00 - 16:30 (9:00 AM - 4:30 PM)
      const availabilitySlots = [
        // Monday (1)
        { coachId: 1, dayOfWeek: 1, startTime: "19:45", endTime: "21:45", isActive: true },
        // Tuesday (2)
        { coachId: 1, dayOfWeek: 2, startTime: "19:45", endTime: "21:45", isActive: true },
        // Wednesday (3)
        { coachId: 1, dayOfWeek: 3, startTime: "19:45", endTime: "21:45", isActive: true },
        // Thursday (4)
        { coachId: 1, dayOfWeek: 4, startTime: "19:45", endTime: "21:45", isActive: true },
        // Friday (5)
        { coachId: 1, dayOfWeek: 5, startTime: "19:45", endTime: "21:45", isActive: true },
        // Saturday (6)
        { coachId: 1, dayOfWeek: 6, startTime: "09:00", endTime: "16:30", isActive: true },
        // Sunday (0)
        { coachId: 1, dayOfWeek: 0, startTime: "09:00", endTime: "16:30", isActive: true },
      ];

      for (const slot of availabilitySlots) {
        await db.insert(coachAvailability).values({
          ...slot,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return {
        success: true,
        message: "Availability created: Weekdays 19:45-21:45, Weekends 09:00-16:30",
        slotsCreated: 7,
      };
    }),
});
