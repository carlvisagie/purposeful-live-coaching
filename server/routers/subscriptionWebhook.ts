import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { subscriptions, usageTracking, humanSessionBookings, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { ENV } from "../_core/env";

const stripe = new Stripe(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover",
});

/**
 * Stripe webhook handler for subscription events
 * 
 * This router handles all Stripe webhook events related to subscriptions:
 * - checkout.session.completed: Create new subscription
 * - customer.subscription.updated: Update subscription status
 * - customer.subscription.deleted: Cancel subscription
 * - invoice.payment_succeeded: Renew subscription period
 * - invoice.payment_failed: Mark subscription as past_due
 */
export const subscriptionWebhookRouter = router({
  /**
   * Handle Stripe webhook events
   * This is called by Stripe when subscription events occur
   */
  handleWebhook: publicProcedure.mutation(async ({ ctx }) => {
    const signature = ctx.req.headers["stripe-signature"];
    
    if (!signature) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing stripe-signature header",
      });
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      const rawBody = (ctx.req as any).rawBody || JSON.stringify(ctx.req.body);
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        ENV.stripeWebhookSecret
      );
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Webhook signature verification failed: ${err.message}`,
      });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only handle subscription checkouts (not one-time payments)
        if (session.mode === "subscription" && session.subscription) {
          const tier = session.metadata?.tier as "ai_basic" | "ai_premium" | "ai_elite" | "human_starter" | "human_professional" | "human_elite";
          const billingFrequency = (session.metadata?.billingFrequency || "monthly") as "monthly" | "yearly";
          const customerEmail = session.customer_email || session.customer_details?.email;
          
          if (!customerEmail) {
            console.error("[Webhook] Missing customer email in checkout session");
            console.error("[Webhook] Session ID:", session.id);
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Missing customer email",
            });
          }
          
          if (!tier) {
            console.warn("[Webhook] Missing tier metadata, will infer from price");
          }

          console.log(`[Webhook] Processing subscription for ${customerEmail}, tier: ${tier}`);

          // Find or create user by email (frictionless onboarding)
          let user = await db.query.users.findFirst({
            where: eq(users.email, customerEmail),
          });

          if (!user) {
            // Create new user with email (voice/face recognition will identify them later)
            console.log(`[Webhook] Creating new user for ${customerEmail}`);
            const [newUser] = await db.insert(users).values({
              openId: `stripe_${session.customer}`, // Use Stripe customer ID as openId
              email: customerEmail,
              name: session.customer_details?.name || null,
              loginMethod: "stripe_checkout",
              role: "client",
            }).returning();
            user = newUser;
            console.log(`[Webhook] ✅ Created new user ${user.id} for ${customerEmail}`);
          } else {
            console.log(`[Webhook] Found existing user ${user.id} for ${customerEmail}`);
          }

          const userId = user.id;

          // Get subscription details from Stripe
          const stripeSubscription: any = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Infer tier from price if not in metadata
          let finalTier = tier;
          if (!finalTier) {
            const priceId = stripeSubscription.items.data[0].price.id;
            // Map price IDs to tiers (you'll need to add your actual price IDs)
            if (priceId.includes('29')) finalTier = 'ai_basic';
            else if (priceId.includes('149')) finalTier = 'ai_premium';
            else if (priceId.includes('299')) finalTier = 'ai_elite';
            else if (priceId.includes('800')) finalTier = 'human_starter';
            else if (priceId.includes('1200')) finalTier = 'human_professional';
            else finalTier = 'ai_basic'; // default fallback
            console.log(`[Webhook] Inferred tier: ${finalTier} from price ${priceId}`);
          }

          // Create subscription record in database
          await db.insert(subscriptions).values({
            userId,
            stripeSubscriptionId: stripeSubscription.id,
            stripeCustomerId: stripeSubscription.customer as string,
            stripePriceId: stripeSubscription.items.data[0].price.id,
            productId: finalTier,
            tier: finalTier,
            billingFrequency,
            status: stripeSubscription.status === "trialing" ? "trialing" : "active",
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            trialStart: stripeSubscription.trial_start 
              ? new Date(stripeSubscription.trial_start * 1000) 
              : null,
            trialEnd: stripeSubscription.trial_end 
              ? new Date(stripeSubscription.trial_end * 1000) 
              : null,
            cancelAtPeriodEnd: "false",
          });

          console.log(`✅ Created subscription for user ${userId} (${finalTier} - ${billingFrequency})`);
        }
        
        // Handle one-time session purchases
        if (session.mode === "payment" && session.metadata?.type === "extra_session") {
          const userId = parseInt(session.metadata?.userId || "0");
          const subscriptionId = parseInt(session.metadata?.subscriptionId || "0");
          
          if (!userId || !subscriptionId) {
            console.error("Missing userId or subscriptionId in session metadata");
            break;
          }

          // Credit will be tracked when user books the session
          console.log(`✅ Extra session purchased by user ${userId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        
        // Update subscription in database
        await db
          .update(subscriptions)
          .set({
            status: subscription.status === "trialing" ? "trialing" : 
                   subscription.status === "active" ? "active" :
                   subscription.status === "past_due" ? "past_due" :
                   subscription.status === "canceled" ? "cancelled" : "unpaid",
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end ? "true" : "false",
            cancelledAt: subscription.canceled_at 
              ? new Date(subscription.canceled_at * 1000) 
              : null,
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        console.log(`✅ Updated subscription ${subscription.id}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as cancelled
        await db
          .update(subscriptions)
          .set({
            status: "cancelled",
            cancelledAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        console.log(`✅ Cancelled subscription ${subscription.id}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        
        if (subscriptionId) {
          // Get subscription from database
          const sub = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
            .limit(1);

          if (sub.length > 0) {
            // Create new usage tracking record for the new billing period
            const subscription = sub[0];
            
            await db.insert(usageTracking).values({
              subscriptionId: subscription.id,
              userId: subscription.userId,
              periodStart: subscription.currentPeriodStart!,
              periodEnd: subscription.currentPeriodEnd!,
              aiSessionsUsed: 0,
              humanSessionsUsed: 0,
              humanSessionsIncluded: 
                subscription.tier === "ai_only" ? 0 :
                subscription.tier === "hybrid" ? 1 :
                subscription.tier === "premium" ? 4 : 0,
            });

            console.log(`✅ Created usage tracking for new billing period (subscription ${subscription.id})`);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        
        if (subscriptionId) {
          // Mark subscription as past_due
          await db
            .update(subscriptions)
            .set({
              status: "past_due",
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

          console.log(`⚠️ Payment failed for subscription ${subscriptionId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }),
});
