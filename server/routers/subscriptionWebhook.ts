import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { subscriptions, usageTracking, humanSessionBookings } from "../../drizzle/schema";
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
          const userId = parseInt(session.metadata?.userId || "0");
          const tier = session.metadata?.tier as "ai_only" | "hybrid" | "premium";
          const billingFrequency = (session.metadata?.billingFrequency || "monthly") as "monthly" | "yearly";
          
          if (!userId || !tier) {
            console.error("Missing userId or tier in checkout session metadata");
            break;
          }

          // Get subscription details from Stripe
          const stripeSubscription: any = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Create subscription record in database
          await db.insert(subscriptions).values({
            userId,
            stripeSubscriptionId: stripeSubscription.id,
            stripeCustomerId: stripeSubscription.customer as string,
            stripePriceId: stripeSubscription.items.data[0].price.id,
            productId: tier,
            tier,
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

          console.log(`✅ Created subscription for user ${userId} (${tier} - ${billingFrequency})`);
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
              user_id: subscription.userId,
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
