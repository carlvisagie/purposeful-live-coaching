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

// Subscription tier configuration
const TIER_CONFIG = {
  ai_only: {
    name: "AI Coaching",
    monthlyPrice: 2900, // $29.00/month
    yearlyPrice: 29000, // $290.00/year (save $58 - 2 months free)
    humanSessionsIncluded: 0,
    stripePriceId: {
      monthly: "price_ai_only_monthly_placeholder", // TODO: Replace with actual Stripe Price ID
      yearly: "price_ai_only_yearly_placeholder", // TODO: Replace with actual Stripe Price ID
    },
    features: [
      "Unlimited 24/7 AI chat sessions",
      "Emotion tracking & insights",
      "Progress dashboard",
      "Coping strategies library",
      "Crisis detection",
      "Email support",
    ],
  },
  hybrid: {
    name: "Hybrid Coaching",
    monthlyPrice: 14900, // $149.00/month
    yearlyPrice: 149000, // $1,490.00/year (save $298 - 2 months free)
    humanSessionsIncluded: 1,
    stripePriceId: {
      monthly: "price_hybrid_monthly_placeholder", // TODO: Replace with actual Stripe Price ID
      yearly: "price_hybrid_yearly_placeholder", // TODO: Replace with actual Stripe Price ID
    },
    features: [
      "Everything in AI Coaching",
      "1 live human coaching session/month",
      "Priority support",
      "Advanced analytics",
      "Personalized action plans",
      "Session recordings & transcripts",
    ],
  },
  premium: {
    name: "Premium Coaching",
    monthlyPrice: 29900, // $299.00/month
    yearlyPrice: 299000, // $2,990.00/year (save $598 - 2 months free)
    humanSessionsIncluded: 4,
    stripePriceId: {
      monthly: "price_premium_monthly_placeholder", // TODO: Replace with actual Stripe Price ID
      yearly: "price_premium_yearly_placeholder", // TODO: Replace with actual Stripe Price ID
    },
    features: [
      "Everything in Hybrid Coaching",
      "4 live human coaching sessions/month",
      "Direct SMS access to coach",
      "Custom coping strategies",
      "Weekly check-ins",
      "Quarterly deep-dive reviews",
    ],
  },
};

// Helper to get price based on billing frequency
function getTierPrice(tier: keyof typeof TIER_CONFIG, frequency: "monthly" | "yearly") {
  return frequency === "monthly" ? TIER_CONFIG[tier].monthlyPrice : TIER_CONFIG[tier].yearlyPrice;
}

function getTierPriceId(tier: keyof typeof TIER_CONFIG, frequency: "monthly" | "yearly") {
  return TIER_CONFIG[tier].stripePriceId[frequency];
}

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
      tierConfig: sub.tier ? TIER_CONFIG[sub.tier] : null,
    };
  }),

  /**
   * Create Stripe checkout session for new subscription
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        tier: z.enum(["ai_only", "hybrid", "premium"]),
        billingFrequency: z.enum(["monthly", "yearly"]).default("monthly"),
        enableSplitPayment: z.boolean().default(false),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tierConfig = TIER_CONFIG[input.tier];
      const priceId = getTierPriceId(input.tier, input.billingFrequency);

      // Check if user already has an active subscription
      const existingSub = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, ctx.user.id),
            eq(subscriptions.status, "active")
          )
        )
        .limit(1);

      if (existingSub.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have an active subscription. Please cancel it first or upgrade instead.",
        });
      }

      // Create Stripe checkout session config
      const sessionConfig: any = {
        customer_email: ctx.user.email || undefined,
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
            userId: ctx.user.id.toString(),
            tier: input.tier,
            billingFrequency: input.billingFrequency,
          },
        },
        metadata: {
          userId: ctx.user.id.toString(),
          tier: input.tier,
          billingFrequency: input.billingFrequency,
        },
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      };

      // Enable split payment for yearly subscriptions (Stripe Installments)
      // Note: This requires enabling "Installment plans" in Stripe Dashboard
      if (input.billingFrequency === "yearly" && input.enableSplitPayment) {
        sessionConfig.payment_method_options = {
          card: {
            installments: {
              enabled: true,
              plan: {
                count: 3, // 3 installments
                type: "fixed_count" as const,
              },
            },
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

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

      // Only Hybrid and Premium tiers can book extra sessions
      if (sub[0].tier === "ai_only") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please upgrade to Hybrid or Premium tier to book human coaching sessions.",
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
      const newUsage = await db.insert(usageTracking).values({
        subscriptionId: sub[0].id,
        userId: ctx.user.id,
        periodStart: sub[0].currentPeriodStart!,
        periodEnd: sub[0].currentPeriodEnd!,
        aiSessionsUsed: 0,
        humanSessionsUsed: 0,
        humanSessionsIncluded: sub[0].tier ? TIER_CONFIG[sub[0].tier].humanSessionsIncluded : 0,
      });

      return {
        subscriptionId: sub[0].id,
        userId: ctx.user.id,
        periodStart: sub[0].currentPeriodStart!,
        periodEnd: sub[0].currentPeriodEnd!,
        aiSessionsUsed: 0,
        humanSessionsUsed: 0,
        humanSessionsIncluded: sub[0].tier ? TIER_CONFIG[sub[0].tier].humanSessionsIncluded : 0,
      };
    }

    return usage[0];
  }),

  /**
   * Track AI session usage (called when user starts AI chat)
   */
  trackAiSession: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
          message: "No active subscription found.",
        });
      }

      // Get or create usage tracking record
      let usage = await db
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
        // Create initial usage record
        await db.insert(usageTracking).values({
          subscriptionId: sub[0].id,
          userId: ctx.user.id,
          periodStart: sub[0].currentPeriodStart!,
          periodEnd: sub[0].currentPeriodEnd!,
          aiSessionsUsed: 1,
          humanSessionsUsed: 0,
          humanSessionsIncluded: sub[0].tier ? TIER_CONFIG[sub[0].tier].humanSessionsIncluded : 0,
        });
      } else {
        // Increment AI session count
        await db
          .update(usageTracking)
          .set({
            aiSessionsUsed: usage[0].aiSessionsUsed + 1,
          })
          .where(eq(usageTracking.id, usage[0].id));
      }

      // Link conversation to subscription
      await db
        .update(aiChatConversations)
        .set({
          subscriptionId: sub[0].id,
        })
        .where(eq(aiChatConversations.id, input.conversationId));

      return { success: true };
    }),

  /**
   * Cancel subscription at period end
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
        code: "BAD_REQUEST",
        message: "No active subscription found.",
      });
    }

    // Cancel in Stripe
    if (sub[0].stripeSubscriptionId) {
      await stripe.subscriptions.update(sub[0].stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    // Update database
    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: "true" as const,
      })
      .where(eq(subscriptions.id, sub[0].id));

    return { success: true };
  }),

  /**
   * Reactivate canceled subscription
   */
  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
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
        message: "No subscription found.",
      });
    }

    if (!sub[0].cancelAtPeriodEnd) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Subscription is not scheduled for cancellation.",
      });
    }

    // Reactivate in Stripe
    if (sub[0].stripeSubscriptionId) {
      await stripe.subscriptions.update(sub[0].stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
    }

    // Update database
    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: "false" as const,
      })
      .where(eq(subscriptions.id, sub[0].id));

    return { success: true };
  }),

  /**
   * Get pricing tiers (public)
   */
  getPricingTiers: publicProcedure.query(async () => {
    return Object.entries(TIER_CONFIG).map(([key, config]) => ({
      tier: key,
      ...config,
    }));
  }),
});
