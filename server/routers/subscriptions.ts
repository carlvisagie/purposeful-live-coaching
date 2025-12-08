import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { subscriptions, usageTracking, humanSessionBookings, aiChatConversations } from "../../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import Stripe from "stripe";
import { ENV } from "../_core/env";

const stripe = new Stripe(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover",
});

// Real Stripe Price IDs from live products
const STRIPE_PRICE_IDS = {
  ai_basic: 'price_1ScBLlCoewQKHsplOoYSMraW', // $29/month
  ai_premium: 'price_1ScBLlCoewQKHsplhQPwTppM', // $149/month
  ai_elite: 'price_1ScBLmCoewQKHsplFU27FCJU', // $299/month
  human_basic: 'price_1ScBLmCoewQKHsplsWrQUuOt', // $800/month
  human_premium: 'price_1ScBLnCoewQKHspleJO6p8XJ', // $1200/month
  human_elite: 'price_1ScBLnCoewQKHspl9iyjwFJ8', // $2000/month
};

// Subscription tier configuration
const TIER_CONFIG = {
  ai_basic: {
    name: "AI Coaching - Basic",
    price: 2900, // $29.00/month
    humanSessionsIncluded: 0,
    stripePriceId: STRIPE_PRICE_IDS.ai_basic,
    features: [
      "24/7 AI coaching via text",
      "Unlimited conversations",
      "Crisis detection & alerts",
      "Progress tracking",
      "Mobile & desktop access",
    ],
  },
  ai_premium: {
    name: "AI Coaching - Premium",
    price: 14900, // $149.00/month
    humanSessionsIncluded: 1,
    stripePriceId: STRIPE_PRICE_IDS.ai_premium,
    features: [
      "Everything in AI Basic",
      "1 live session per month (30 min)",
      "Priority email support",
      "Personalized action plans",
      "Session recordings",
    ],
  },
  ai_elite: {
    name: "AI Coaching - Elite",
    price: 29900, // $299.00/month
    humanSessionsIncluded: 4,
    stripePriceId: STRIPE_PRICE_IDS.ai_elite,
    features: [
      "Everything in AI Premium",
      "4 live sessions per month (30 min each)",
      "Priority scheduling",
      "Text & email support",
      "Custom coaching plans",
      "Family support resources",
    ],
  },
  human_basic: {
    name: "Human Coaching - Basic",
    price: 80000, // $800.00/month
    humanSessionsIncluded: 2,
    stripePriceId: STRIPE_PRICE_IDS.human_basic,
    features: [
      "2 live sessions per month (60 min each)",
      "24/7 AI coaching between sessions",
      "Email support",
      "Progress tracking",
      "Session recordings",
    ],
  },
  human_premium: {
    name: "Human Coaching - Premium",
    price: 120000, // $1,200.00/month
    humanSessionsIncluded: 4,
    stripePriceId: STRIPE_PRICE_IDS.human_premium,
    features: [
      "4 live sessions per month (60 min each)",
      "24/7 AI coaching",
      "Priority scheduling",
      "Text, email & phone support",
      "Custom action plans",
      "Family resources",
    ],
  },
  human_elite: {
    name: "Human Coaching - Elite",
    price: 200000, // $2,000.00/month
    humanSessionsIncluded: 8,
    stripePriceId: STRIPE_PRICE_IDS.human_elite,
    features: [
      "8 live sessions per month (60 min each)",
      "24/7 AI coaching",
      "Direct coach access (text/email)",
      "Emergency session availability",
      "Comprehensive life planning",
      "Spouse/partner sessions included",
    ],
  },
};

type TierKey = keyof typeof TIER_CONFIG;

export const subscriptionsRouter = router({
  /**
   * Get current user's subscription status
   */
  getMySubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (subscription.length === 0) {
      return null;
    }

    const sub = subscription[0];

    // Get current period usage
    const usage = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.subscriptionId, sub.id),
          gte(usageTracking.periodStart, sub.currentPeriodStart!),
          lte(usageTracking.periodEnd, sub.currentPeriodEnd!)
        )
      )
      .limit(1);

    return {
      ...sub,
      usage: usage[0] || null,
      tierConfig: sub.tier ? TIER_CONFIG[sub.tier as TierKey] : null,
    };
  }),

  /**
   * Create Stripe checkout session for new subscription
   */
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        tier: z.enum(["ai_basic", "ai_premium", "ai_elite", "human_basic", "human_premium", "human_elite"]),
        email: z.string().email().optional(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const tierConfig = TIER_CONFIG[input.tier];
      const priceId = tierConfig.stripePriceId;

      // Create Stripe checkout session (guest checkout - no login required)
      const session = await stripe.checkout.sessions.create({
        customer_email: input.email || undefined,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_period_days: 7, // 7-day free trial
          metadata: {
            tier: input.tier,
          },
        },
        metadata: {
          tier: input.tier,
        },
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  /**
   * Create checkout session for extra human session (one-time payment)
   */
  createExtraSessionCheckout: protectedProcedure
    .input(
      z.object({
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user has an active subscription
      const sub = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, ctx.user.id),
            eq(subscriptions.status, "active")
          )
        )
        .limit(1);

      if (sub.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need an active subscription to book extra sessions.",
        });
      }

      // Only tiers with human sessions can book extras
      if (sub[0].tier === "ai_basic") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please upgrade to a tier with human coaching to book sessions.",
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer_email: ctx.user.email || undefined,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Extra Human Coaching Session",
                description: "30-minute live coaching session with expert coach",
              },
              unit_amount: 9900, // $99.00
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: ctx.user.id.toString(),
          subscriptionId: sub[0].id.toString(),
          type: "extra_session",
        },
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  /**
   * Get current usage for billing period
   */
  getCurrentUsage: protectedProcedure.query(async ({ ctx }) => {
    const sub = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (sub.length === 0) {
      return null;
    }

    const usage = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.subscriptionId, sub[0].id),
          gte(usageTracking.periodStart, sub[0].currentPeriodStart!),
          lte(usageTracking.periodEnd, sub[0].currentPeriodEnd!)
        )
      )
      .limit(1);

    if (usage.length === 0) {
      // Create initial usage tracking record
      const tierKey = sub[0].tier as TierKey;
      const newUsage = await db.insert(usageTracking).values({
        subscriptionId: sub[0].id,
        userId: ctx.user.id,
        periodStart: sub[0].currentPeriodStart!,
        periodEnd: sub[0].currentPeriodEnd!,
        aiSessionsUsed: 0,
        humanSessionsUsed: 0,
        humanSessionsIncluded: tierKey ? TIER_CONFIG[tierKey].humanSessionsIncluded : 0,
      });

      return {
        subscriptionId: sub[0].id,
        userId: ctx.user.id,
        periodStart: sub[0].currentPeriodStart!,
        periodEnd: sub[0].currentPeriodEnd!,
        aiSessionsUsed: 0,
        humanSessionsUsed: 0,
        humanSessionsIncluded: tierKey ? TIER_CONFIG[tierKey].humanSessionsIncluded : 0,
      };
    }

    return usage[0];
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const sub = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (sub.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active subscription found.",
      });
    }

    // Cancel in Stripe
    if (sub[0].stripeSubscriptionId) {
      await stripe.subscriptions.cancel(sub[0].stripeSubscriptionId);
    }

    // Update in database
    await db
      .update(subscriptions)
      .set({
        status: "canceled",
        canceledAt: new Date(),
      })
      .where(eq(subscriptions.id, sub[0].id));

    return { success: true };
  }),
});
