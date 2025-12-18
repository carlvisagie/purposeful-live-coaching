/**
 * Trial System - Manages anonymous users and 7-day trial periods
 * 
 * Flow:
 * 1. New visitor → Auto-create anonymous user with 7-day full access trial
 * 2. During trial → Full AI coaching, all modules, booking access
 * 3. After 7 days → Prompt to subscribe or downgrade to free tier
 * 4. Free tier → Limited AI messages per day (5), basic modules only
 */

import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import { users, subscriptions, usageTracking } from "../drizzle/schema";
// Note: Using openId from client-side generated anonymous ID

// Tier definitions
export const TIERS = {
  TRIAL: "trial",
  FREE: "free",
  BASIC: "basic",
  PREMIUM: "premium",
  ELITE: "elite",
} as const;

// Tier limits
export const TIER_LIMITS = {
  [TIERS.TRIAL]: {
    aiMessagesPerDay: -1, // Unlimited during trial
    modulesAccess: "all",
    bookingAccess: true,
    voiceCallAccess: true,
  },
  [TIERS.FREE]: {
    aiMessagesPerDay: 5,
    modulesAccess: "basic", // Only first 5 modules
    bookingAccess: false,
    voiceCallAccess: false,
  },
  [TIERS.BASIC]: {
    aiMessagesPerDay: -1, // Unlimited
    modulesAccess: "all",
    bookingAccess: false,
    voiceCallAccess: false,
  },
  [TIERS.PREMIUM]: {
    aiMessagesPerDay: -1,
    modulesAccess: "all",
    bookingAccess: true,
    voiceCallAccess: true,
  },
  [TIERS.ELITE]: {
    aiMessagesPerDay: -1,
    modulesAccess: "all",
    bookingAccess: true,
    voiceCallAccess: true,
  },
};

// Trial duration in days
const TRIAL_DURATION_DAYS = 7;

/**
 * Create or retrieve an anonymous user based on browser fingerprint
 */
export async function getOrCreateAnonymousUser(anonymousId: string): Promise<{
  userId: number;
  tier: string;
  trialEndsAt: Date | null;
  isTrialExpired: boolean;
  daysRemaining: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user exists with this anonymous ID
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.openId, anonymousId))
    .limit(1);

  if (existingUser) {
    // Get subscription status
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, existingUser.id))
      .limit(1);

    if (subscription) {
      const now = new Date();
      const trialEnd = subscription.trialEnd;
      const isTrialExpired = trialEnd ? now > trialEnd : false;
      const daysRemaining = trialEnd 
        ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      // Determine current tier
      let currentTier = subscription.tier || TIERS.TRIAL;
      
      // If trial expired and not subscribed, downgrade to free
      if (isTrialExpired && subscription.status !== "active") {
        currentTier = TIERS.FREE;
        // Update subscription tier
        await db
          .update(subscriptions)
          .set({ tier: TIERS.FREE, updatedAt: new Date() })
          .where(eq(subscriptions.id, subscription.id));
      }

      return {
        userId: existingUser.id,
        tier: currentTier,
        trialEndsAt: trialEnd,
        isTrialExpired,
        daysRemaining,
      };
    }

    // User exists but no subscription - create trial subscription
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

    await db.insert(subscriptions).values({
      userId: existingUser.id,
      productId: "trial",
      tier: TIERS.TRIAL,
      status: "trialing",
      trialStart: new Date(),
      trialEnd: trialEnd,
    });

    return {
      userId: existingUser.id,
      tier: TIERS.TRIAL,
      trialEndsAt: trialEnd,
      isTrialExpired: false,
      daysRemaining: TRIAL_DURATION_DAYS,
    };
  }

  // Create new anonymous user
  const [newUser] = await db
    .insert(users)
    .values({
      openId: anonymousId,
      name: "Guest User",
      role: "user",
      loginMethod: "anonymous",
    })
    .returning();

  // Create trial subscription
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

  await db.insert(subscriptions).values({
    userId: newUser.id,
    productId: "trial",
    tier: TIERS.TRIAL,
    status: "trialing",
    trialStart: new Date(),
    trialEnd: trialEnd,
  });

  return {
    userId: newUser.id,
    tier: TIERS.TRIAL,
    trialEndsAt: trialEnd,
    isTrialExpired: false,
    daysRemaining: TRIAL_DURATION_DAYS,
  };
}

/**
 * Check if user can send AI message based on tier limits
 */
export async function canSendAiMessage(userId: number): Promise<{
  allowed: boolean;
  reason?: string;
  messagesUsedToday?: number;
  limit?: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get user's subscription
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (!subscription) {
    return { allowed: false, reason: "No subscription found" };
  }

  const tier = subscription.tier || TIERS.FREE;
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS[TIERS.FREE];

  // Check if trial expired
  if (tier === TIERS.TRIAL && subscription.trialEnd) {
    const now = new Date();
    if (now > subscription.trialEnd) {
      // Trial expired - check free tier limits
      return checkDailyLimit(userId, TIER_LIMITS[TIERS.FREE].aiMessagesPerDay);
    }
  }

  // Unlimited messages
  if (limits.aiMessagesPerDay === -1) {
    return { allowed: true };
  }

  // Check daily limit
  return checkDailyLimit(userId, limits.aiMessagesPerDay);
}

/**
 * Check daily message limit for a user
 */
async function checkDailyLimit(userId: number, limit: number): Promise<{
  allowed: boolean;
  reason?: string;
  messagesUsedToday?: number;
  limit?: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get today's start and end
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Count messages sent today
  const result = await db.execute(`
    SELECT COUNT(*) as count 
    FROM ai_chat_messages m
    JOIN ai_chat_conversations c ON m.conversation_id = c.id
    WHERE c.user_id = ${userId}
    AND m.role = 'user'
    AND m.created_at >= '${today.toISOString()}'
    AND m.created_at < '${tomorrow.toISOString()}'
  `);

  const messagesUsedToday = parseInt((result.rows[0] as any)?.count || "0", 10);

  if (messagesUsedToday >= limit) {
    return {
      allowed: false,
      reason: `Daily limit reached. You've used ${messagesUsedToday}/${limit} messages today. Upgrade to continue.`,
      messagesUsedToday,
      limit,
    };
  }

  return {
    allowed: true,
    messagesUsedToday,
    limit,
  };
}

/**
 * Get user's current tier and status
 */
export async function getUserTierStatus(userId: number): Promise<{
  tier: string;
  status: string;
  trialEndsAt: Date | null;
  isTrialExpired: boolean;
  daysRemaining: number;
  limits: typeof TIER_LIMITS[keyof typeof TIER_LIMITS];
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (!subscription) {
    return {
      tier: TIERS.FREE,
      status: "none",
      trialEndsAt: null,
      isTrialExpired: true,
      daysRemaining: 0,
      limits: TIER_LIMITS[TIERS.FREE],
    };
  }

  const now = new Date();
  const trialEnd = subscription.trialEnd;
  const isTrialExpired = trialEnd ? now > trialEnd : false;
  const daysRemaining = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  let currentTier = subscription.tier || TIERS.TRIAL;
  
  // If trial expired and not actively subscribed, use free tier
  if (isTrialExpired && subscription.status !== "active") {
    currentTier = TIERS.FREE;
  }

  return {
    tier: currentTier,
    status: subscription.status || "none",
    trialEndsAt: trialEnd,
    isTrialExpired,
    daysRemaining,
    limits: TIER_LIMITS[currentTier as keyof typeof TIER_LIMITS] || TIER_LIMITS[TIERS.FREE],
  };
}

/**
 * Upgrade user to paid tier after Stripe payment
 */
export async function upgradeUserTier(
  userId: number,
  tier: string,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  stripePriceId: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({
      tier,
      status: "active",
      stripeSubscriptionId,
      stripeCustomerId,
      stripePriceId,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));
}
