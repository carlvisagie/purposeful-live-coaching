/**
 * Platform Usage Monitoring
 * 
 * Provides real-time visibility into who's using the platform,
 * how much it costs, and who's exceeding their tier limits.
 */

import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, subscriptions, aiChatConversations, aiChatMessages } from "../../drizzle/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export const platformUsageRouter = router({
  /**
   * Get all users with usage stats for the last 24 hours
   */
  getAllUsersWithUsage: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get all users with their subscriptions
    const allUsers = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        loginMethod: users.loginMethod,
        createdAt: users.createdAt,
        tier: subscriptions.tier,
        status: subscriptions.status,
        trialEnd: subscriptions.trialEnd,
        stripeSubscriptionId: subscriptions.stripeSubscriptionId,
      })
      .from(users)
      .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
      .orderBy(desc(users.createdAt));

    // Get message counts for last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messageCounts = await db.execute(sql`
      SELECT 
        u.id as user_id,
        COUNT(m.id) FILTER (WHERE m.created_at >= ${yesterday.toISOString()} AND m.role = 'user') as messages_24h,
        COUNT(m.id) FILTER (WHERE m.created_at >= ${today.toISOString()} AND m.role = 'user') as messages_today,
        COUNT(m.id) FILTER (WHERE m.role = 'user') as total_messages,
        MAX(m.created_at) as last_activity
      FROM users u
      LEFT JOIN ai_chat_conversations c ON u.id = c.user_id
      LEFT JOIN ai_chat_messages m ON c.id = m.conversation_id
      GROUP BY u.id
    `);

    const messageCountsMap = new Map(
      (messageCounts.rows as any[]).map((row) => [
        row.user_id,
        {
          messages24h: parseInt(row.messages_24h) || 0,
          messagesToday: parseInt(row.messages_today) || 0,
          totalMessages: parseInt(row.total_messages) || 0,
          lastActivity: row.last_activity,
        },
      ])
    );

    // Combine data
    return allUsers.map((user) => {
      const usage = messageCountsMap.get(user.userId) || {
        messages24h: 0,
        messagesToday: 0,
        totalMessages: 0,
        lastActivity: null,
      };

      const isTrialExpired = user.trialEnd ? new Date() > user.trialEnd : false;
      const isPaying = !!user.stripeSubscriptionId && user.status === "active";
      const daysRemaining = user.trialEnd
        ? Math.max(0, Math.ceil((user.trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

      // Determine user status
      let userStatus = "unknown";
      if (isPaying) {
        userStatus = "paying";
      } else if (isTrialExpired) {
        userStatus = "expired_trial";
      } else if (user.tier === "trial") {
        userStatus = "active_trial";
      } else if (user.tier === "free") {
        userStatus = "free";
      }

      // Estimate cost (rough: $0.002 per message for GPT-4)
      const estimatedCost = usage.totalMessages * 0.002;

      return {
        ...user,
        ...usage,
        isTrialExpired,
        isPaying,
        daysRemaining,
        userStatus,
        estimatedCost: Math.round(estimatedCost * 100) / 100,
      };
    });
  }),

  /**
   * Get platform summary stats
   */
  getPlatformStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get counts
    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);

    const [activeTrials] = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(and(eq(subscriptions.tier, "trial"), gte(subscriptions.trialEnd, now)));

    const [expiredTrials] = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM subscriptions
      WHERE trial_end < NOW() AND status != 'active'
    `);

    const [payingCustomers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(and(eq(subscriptions.status, "active"), sql`stripe_subscription_id IS NOT NULL`));

    const [messages24h] = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM ai_chat_messages
      WHERE created_at >= ${yesterday.toISOString()} AND role = 'user'
    `);

    const [activeUsers24h] = await db.execute(sql`
      SELECT COUNT(DISTINCT u.id) as count
      FROM users u
      JOIN ai_chat_conversations c ON u.id = c.user_id
      JOIN ai_chat_messages m ON c.id = m.conversation_id
      WHERE m.created_at >= ${yesterday.toISOString()}
    `);

    const messageCount = parseInt((messages24h.rows[0] as any)?.count || "0");
    const estimatedCost24h = Math.round(messageCount * 0.002 * 100) / 100;

    return {
      totalUsers: totalUsers.count,
      activeTrials: activeTrials.count,
      expiredTrials: parseInt((expiredTrials.rows[0] as any)?.count || "0"),
      payingCustomers: payingCustomers.count,
      activeUsers24h: parseInt((activeUsers24h.rows[0] as any)?.count || "0"),
      messages24h: messageCount,
      estimatedCost24h,
    };
  }),

  /**
   * Get users exceeding their tier limits
   */
  getUsersExceedingLimits: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await db.execute(sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        s.tier,
        s.trial_end,
        COUNT(m.id) as messages_today
      FROM users u
      JOIN subscriptions s ON u.id = s.user_id
      JOIN ai_chat_conversations c ON u.id = c.user_id
      JOIN ai_chat_messages m ON c.id = m.conversation_id
      WHERE m.created_at >= ${today.toISOString()}
        AND m.role = 'user'
        AND s.tier IN ('free', 'trial')
        AND (s.trial_end < NOW() OR s.tier = 'free')
      GROUP BY u.id, u.name, u.email, s.tier, s.trial_end
      HAVING COUNT(m.id) > 5
      ORDER BY COUNT(m.id) DESC
    `);

    return result.rows.map((row: any) => ({
      userId: row.id,
      name: row.name,
      email: row.email,
      tier: row.tier,
      trialEnd: row.trial_end,
      messagesToday: parseInt(row.messages_today),
      exceededBy: parseInt(row.messages_today) - 5,
    }));
  }),
});
