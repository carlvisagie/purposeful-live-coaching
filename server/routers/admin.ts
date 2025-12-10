import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { users, subscriptions, payments, therapySessions, crisisAlerts } from "../../drizzle/schema";
import { eq, gte, sql, and, desc } from "drizzle-orm";
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

      // Active sessions in time range
      const activeSessionsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(therapySessions)
        .where(
          and(
            gte(therapySessions.scheduledAt, startDate),
            eq(therapySessions.status, "scheduled")
          )
        );
      const activeSessions = Number(activeSessionsResult[0]?.count || 0);

      // Pending crisis alerts
      const crisisAlertsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(crisisAlerts)
        .where(eq(crisisAlerts.status, "pending"));
      const pendingCrisisAlerts = Number(crisisAlertsResult[0]?.count || 0);

      // Revenue in time range (MTD)
      const revenueResult = await db
        .select({ total: sql<number>`sum(${payments.amount})` })
        .from(payments)
        .where(
          and(
            gte(payments.createdAt, startDate),
            eq(payments.status, "completed")
          )
        );
      const revenueMTD = Number(revenueResult[0]?.total || 0);

      // Revenue growth (compare to previous period)
      const previousStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const previousRevenueResult = await db
        .select({ total: sql<number>`sum(${payments.amount})` })
        .from(payments)
        .where(
          and(
            gte(payments.createdAt, previousStartDate),
            sql`${payments.createdAt} < ${startDate}`,
            eq(payments.status, "completed")
          )
        );
      const previousRevenue = Number(previousRevenueResult[0]?.total || 0);
      const revenueGrowth = previousRevenue > 0 
        ? ((revenueMTD - previousRevenue) / previousRevenue) * 100 
        : 0;

      // Users by tier
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
        const tier = row.tier as "basic" | "premium" | "elite";
        usersByTier[tier] = Number(row.count);
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
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(input.limit);

      return recentUsers;
    }),

  /**
   * Get crisis alerts
   * Returns: list of crisis alerts with client info
   */
  getCrisisAlerts: adminProcedure
    .input(z.object({
      status: z.enum(["pending", "acknowledged", "resolved"]).optional(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const alerts = await db
        .select({
          id: crisisAlerts.id,
          clientId: crisisAlerts.clientId,
          severity: crisisAlerts.severity,
          triggerType: crisisAlerts.triggerType,
          message: crisisAlerts.message,
          status: crisisAlerts.status,
          createdAt: crisisAlerts.createdAt,
          clientName: users.name,
          clientEmail: users.email,
        })
        .from(crisisAlerts)
        .leftJoin(users, eq(crisisAlerts.clientId, users.id))
        .where(input.status ? eq(crisisAlerts.status, input.status) : undefined)
        .orderBy(desc(crisisAlerts.createdAt))
        .limit(input.limit);

      return alerts;
    }),

  /**
   * Acknowledge crisis alert
   * Marks a crisis alert as acknowledged by admin
   */
  acknowledgeCrisisAlert: adminProcedure
    .input(z.object({
      alertId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db
        .update(crisisAlerts)
        .set({ 
          status: "acknowledged",
          acknowledgedAt: new Date(),
        })
        .where(eq(crisisAlerts.id, input.alertId));

      return { success: true };
    }),

  /**
   * Resolve crisis alert
   * Marks a crisis alert as resolved
   */
  resolveCrisisAlert: adminProcedure
    .input(z.object({
      alertId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db
        .update(crisisAlerts)
        .set({ 
          status: "resolved",
          resolvedAt: new Date(),
          notes: input.notes,
        })
        .where(eq(crisisAlerts.id, input.alertId));

      return { success: true };
    }),

  /**
   * Get revenue analytics
   * Returns: revenue breakdown by period
   */
  getRevenueAnalytics: adminProcedure
    .input(z.object({
      timeRange: z.enum(["7d", "30d", "90d"]).default("30d"),
    }))
    .query(async ({ input }) => {
      const now = new Date();
      const daysAgo = input.timeRange === "7d" ? 7 : input.timeRange === "30d" ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Revenue by day
      const revenueByDay = await db
        .select({
          date: sql<string>`DATE(${payments.createdAt})`,
          total: sql<number>`sum(${payments.amount})`,
          count: sql<number>`count(*)`,
        })
        .from(payments)
        .where(
          and(
            gte(payments.createdAt, startDate),
            eq(payments.status, "completed")
          )
        )
        .groupBy(sql`DATE(${payments.createdAt})`)
        .orderBy(sql`DATE(${payments.createdAt})`);

      return revenueByDay.map(row => ({
        date: row.date,
        total: Number(row.total),
        count: Number(row.count),
      }));
    }),
});
