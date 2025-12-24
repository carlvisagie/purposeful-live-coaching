import { db } from "./db";
import { subscriptions, usageTracking } from "../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Subscription Tier Enforcement
 * 
 * This module enforces subscription tier limits across all AI modules.
 * During the 7-day trial, users have full access.
 * After trial ends, limits are enforced based on their tier.
 */

export interface TierLimits {
  aiMessagesPerMonth: number | "unlimited";
  sleepStoriesPerMonth: number | "unlimited";
  focusSessionsPerMonth: number | "unlimited";
  meditationSessionsPerMonth: number | "unlimited";
  humanSessionsPerMonth: number;
  canAccessAllModules: boolean;
  canAccessAdvancedFeatures: boolean;
}

export const TIER_LIMITS: Record<string, TierLimits> = {
  free: {
    aiMessagesPerMonth: 100,
    sleepStoriesPerMonth: 5,
    focusSessionsPerMonth: 5,
    meditationSessionsPerMonth: 5,
    humanSessionsPerMonth: 0,
    canAccessAllModules: false,
    canAccessAdvancedFeatures: false,
  },
  ai_basic: {
    aiMessagesPerMonth: 500,
    sleepStoriesPerMonth: "unlimited",
    focusSessionsPerMonth: "unlimited",
    meditationSessionsPerMonth: "unlimited",
    humanSessionsPerMonth: 0,
    canAccessAllModules: true,
    canAccessAdvancedFeatures: false,
  },
  ai_premium: {
    aiMessagesPerMonth: 1000,
    sleepStoriesPerMonth: "unlimited",
    focusSessionsPerMonth: "unlimited",
    meditationSessionsPerMonth: "unlimited",
    humanSessionsPerMonth: 0,
    canAccessAllModules: true,
    canAccessAdvancedFeatures: true,
  },
  ai_elite: {
    aiMessagesPerMonth: "unlimited",
    sleepStoriesPerMonth: "unlimited",
    focusSessionsPerMonth: "unlimited",
    meditationSessionsPerMonth: "unlimited",
    humanSessionsPerMonth: 0,
    canAccessAllModules: true,
    canAccessAdvancedFeatures: true,
  },
  human_starter: {
    aiMessagesPerMonth: "unlimited",
    sleepStoriesPerMonth: "unlimited",
    focusSessionsPerMonth: "unlimited",
    meditationSessionsPerMonth: "unlimited",
    humanSessionsPerMonth: 2,
    canAccessAllModules: true,
    canAccessAdvancedFeatures: true,
  },
  human_professional: {
    aiMessagesPerMonth: "unlimited",
    sleepStoriesPerMonth: "unlimited",
    focusSessionsPerMonth: "unlimited",
    meditationSessionsPerMonth: "unlimited",
    humanSessionsPerMonth: 4,
    canAccessAllModules: true,
    canAccessAdvancedFeatures: true,
  },
  human_elite: {
    aiMessagesPerMonth: "unlimited",
    sleepStoriesPerMonth: "unlimited",
    focusSessionsPerMonth: "unlimited",
    meditationSessionsPerMonth: "unlimited",
    humanSessionsPerMonth: 8,
    canAccessAllModules: true,
    canAccessAdvancedFeatures: true,
  },
};

export interface SubscriptionStatus {
  tier: string;
  status: "trialing" | "active" | "past_due" | "cancelled" | "unpaid" | "free";
  limits: TierLimits;
  usage: {
    aiMessagesUsed: number;
    sleepStoriesUsed: number;
    focusSessionsUsed: number;
    meditationSessionsUsed: number;
    humanSessionsUsed: number;
  };
  isTrialing: boolean;
  trialEndsAt: Date | null;
}

/**
 * Get user's subscription status and enforce limits
 */
export async function getUserSubscriptionStatus(userId: number): Promise<SubscriptionStatus> {
  // Get active subscription
  const subscription = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "active")
    ),
  });

  // If no subscription, user is on free tier
  if (!subscription) {
    return {
      tier: "free",
      status: "free",
      limits: TIER_LIMITS.free,
      usage: {
        aiMessagesUsed: 0,
        sleepStoriesUsed: 0,
        focusSessionsUsed: 0,
        meditationSessionsUsed: 0,
        humanSessionsUsed: 0,
      },
      isTrialing: false,
      trialEndsAt: null,
    };
  }

  // Check if user is in trial period
  const now = new Date();
  const isTrialing = subscription.trialEnd ? now < subscription.trialEnd : false;

  // Get current usage
  const usage = await db.query.usageTracking.findFirst({
    where: and(
      eq(usageTracking.subscriptionId, subscription.id),
      lte(usageTracking.periodStart, now),
      gte(usageTracking.periodEnd, now)
    ),
  });

  const tier = subscription.tier || "free";
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;

  return {
    tier,
    status: isTrialing ? "trialing" : subscription.status as any,
    limits,
    usage: {
      aiMessagesUsed: usage?.aiSessionsUsed || 0,
      sleepStoriesUsed: 0, // TODO: Track in usageTracking
      focusSessionsUsed: 0, // TODO: Track in usageTracking
      meditationSessionsUsed: 0, // TODO: Track in usageTracking
      humanSessionsUsed: usage?.humanSessionsUsed || 0,
    },
    isTrialing,
    trialEndsAt: subscription.trialEnd,
  };
}

/**
 * Check if user can perform an action based on their tier
 */
export async function checkTierLimit(
  userId: number,
  action: "ai_message" | "sleep_story" | "focus_session" | "meditation_session" | "human_session"
): Promise<{ allowed: boolean; reason?: string; upgradeUrl?: string }> {
  const status = await getUserSubscriptionStatus(userId);

  // During trial, allow everything
  if (status.isTrialing) {
    return { allowed: true };
  }

  // Check specific limits
  switch (action) {
    case "ai_message":
      if (status.limits.aiMessagesPerMonth === "unlimited") {
        return { allowed: true };
      }
      if (status.usage.aiMessagesUsed >= status.limits.aiMessagesPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your monthly limit of ${status.limits.aiMessagesPerMonth} AI messages. Upgrade to get more!`,
          upgradeUrl: "/pricing",
        };
      }
      return { allowed: true };

    case "sleep_story":
      if (status.limits.sleepStoriesPerMonth === "unlimited") {
        return { allowed: true };
      }
      if (status.usage.sleepStoriesUsed >= status.limits.sleepStoriesPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your monthly limit of ${status.limits.sleepStoriesPerMonth} sleep stories. Upgrade to get unlimited!`,
          upgradeUrl: "/pricing",
        };
      }
      return { allowed: true };

    case "focus_session":
      if (status.limits.focusSessionsPerMonth === "unlimited") {
        return { allowed: true };
      }
      if (status.usage.focusSessionsUsed >= status.limits.focusSessionsPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your monthly limit of ${status.limits.focusSessionsPerMonth} focus sessions. Upgrade to get unlimited!`,
          upgradeUrl: "/pricing",
        };
      }
      return { allowed: true };

    case "meditation_session":
      if (status.limits.meditationSessionsPerMonth === "unlimited") {
        return { allowed: true };
      }
      if (status.usage.meditationSessionsUsed >= status.limits.meditationSessionsPerMonth) {
        return {
          allowed: false,
          reason: `You've reached your monthly limit of ${status.limits.meditationSessionsPerMonth} meditation sessions. Upgrade to get unlimited!`,
          upgradeUrl: "/pricing",
        };
      }
      return { allowed: true };

    case "human_session":
      if (status.usage.humanSessionsUsed >= status.limits.humanSessionsPerMonth) {
        return {
          allowed: false,
          reason: `You've used all ${status.limits.humanSessionsPerMonth} human coaching sessions this month. Upgrade or purchase extra sessions!`,
          upgradeUrl: "/pricing",
        };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}

/**
 * Increment usage counter for an action
 */
export async function incrementUsage(
  userId: number,
  action: "ai_message" | "sleep_story" | "focus_session" | "meditation_session" | "human_session"
): Promise<void> {
  const subscription = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "active")
    ),
  });

  if (!subscription) {
    return; // Free tier, no tracking needed
  }

  const now = new Date();
  const usage = await db.query.usageTracking.findFirst({
    where: and(
      eq(usageTracking.subscriptionId, subscription.id),
      lte(usageTracking.periodStart, now),
      gte(usageTracking.periodEnd, now)
    ),
  });

  if (!usage) {
    console.error(`No usage tracking record found for subscription ${subscription.id}`);
    return;
  }

  // Increment the appropriate counter
  switch (action) {
    case "ai_message":
      await db
        .update(usageTracking)
        .set({ aiSessionsUsed: (usage.aiSessionsUsed || 0) + 1 })
        .where(eq(usageTracking.id, usage.id));
      break;

    case "human_session":
      await db
        .update(usageTracking)
        .set({ humanSessionsUsed: (usage.humanSessionsUsed || 0) + 1 })
        .where(eq(usageTracking.id, usage.id));
      break;

    // TODO: Add tracking for sleep stories, focus sessions, meditation sessions
    default:
      break;
  }
}
