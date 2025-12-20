import { Router } from "express";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { subscriptions, users, sessions, clients, emailLogs } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover",
});

export const webhookRouter = Router();

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events and sends email notifications
 */
webhookRouter.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log("[Webhook] Received webhook request");
  console.log("[Webhook] Has signature:", !!sig);
  console.log("[Webhook] Signature value:", typeof sig === 'string' ? sig.substring(0, 50) + '...' : sig);
  console.log("[Webhook] Webhook secret configured:", !!ENV.stripeWebhookSecret);
  console.log("[Webhook] Webhook secret length:", ENV.stripeWebhookSecret?.length || 0);

  if (!sig) {
    console.error("[Webhook] Missing Stripe signature");
    return res.status(400).send("Missing signature");
  }

  if (!ENV.stripeWebhookSecret) {
    console.error("[Webhook] Webhook secret not configured!");
    return res.status(500).send("Webhook secret not configured");
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    console.log("[Webhook] About to verify signature with secret:", ENV.stripeWebhookSecret ? `${ENV.stripeWebhookSecret.substring(0, 10)}...` : 'NOT SET');
    console.log("[Webhook] req.body type:", typeof req.body);
    console.log("[Webhook] req.body is Buffer:", Buffer.isBuffer(req.body));
    
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
    console.log("[Webhook] Signature verification successful!");
  } catch (err) {
    console.error("[Webhook] Signature verification FAILED");
    console.error("[Webhook] Error:", err);
    console.error("[Webhook] Error message:", err instanceof Error ? err.message : 'Unknown error');
    console.error("[Webhook] Secret configured:", !!ENV.stripeWebhookSecret);
    console.error("[Webhook] Secret starts with:", ENV.stripeWebhookSecret ? ENV.stripeWebhookSecret.substring(0, 10) : 'N/A');
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  console.log(`[Webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing event ${event.type}:`, error);
    res.status(500).send("Webhook processing failed");
  }
});

// Helper to map Stripe status to our schema
function mapStripeStatus(status: string): "active" | "cancelled" | "past_due" | "unpaid" {
  const statusMap: Record<string, "active" | "cancelled" | "past_due" | "unpaid"> = {
    "active": "active",
    "canceled": "cancelled",
    "cancelled": "cancelled",
    "past_due": "past_due",
    "unpaid": "unpaid",
    "trialing": "active",
    "incomplete": "unpaid",
    "incomplete_expired": "cancelled",
  };
  return statusMap[status] || "active";
}

/**
 * Handle successful checkout session
 * Creates subscription record and sends welcome email
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Processing checkout.session.completed");
  console.log("[Webhook] Session mode:", session.mode);
  console.log("[Webhook] Metadata:", session.metadata);
  console.log("[Webhook] Customer:", session.customer);
  console.log("[Webhook] Customer Email:", session.customer_email);

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return;
  }

  // For guest checkout, we need to get/create user from customer email
  let userId = session.metadata?.user_id;
  const customerEmail = session.customer_email || session.metadata?.customer_email;
  const customerName = session.metadata?.customer_name;
  const tier = session.metadata?.tier;

  // Check if this is a one-time payment (coaching session booking) or subscription
  if (session.mode === 'payment') {
    if (!userId) {
      console.error("[Webhook] Missing user_id for payment mode");
      return;
    }
    // ONE-TIME PAYMENT: Create coaching session booking
    await handleSessionBooking(session, db, parseInt(userId));
    return;
  }

  // SUBSCRIPTION MODE: Handle guest checkout - create user if needed
  if (!userId && customerEmail) {
    console.log("[Webhook] Guest checkout - looking up or creating user for:", customerEmail);
    
    // Check if user exists by email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, customerEmail))
      .limit(1);
    
    if (existingUser.length > 0) {
      userId = existingUser[0].id.toString();
      console.log("[Webhook] Found existing user:", userId);
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          email: customerEmail,
          name: customerName || customerEmail.split('@')[0],
          role: 'client',
        })
        .returning({ id: users.id });
      userId = newUser.id.toString();
      console.log("[Webhook] Created new user:", userId);
    }
  }

  if (!userId) {
    console.error("[Webhook] Cannot determine user - no user_id and no customer_email");
    return;
  }

  // Get subscription ID from session
  const subscriptionId = session.subscription as string;

  if (!subscriptionId) {
    console.error("[Webhook] No subscription ID in checkout session");
    return;
  }

  // Fetch full subscription details
  const stripeSubscription: any = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Determine product_id from tier or subscription metadata
  const productId = tier || session.metadata?.product_id || stripeSubscription.metadata?.tier || 'ai_basic';

  console.log("[Webhook] Creating subscription for user:", userId, "product:", productId);

  // Check if subscription already exists (avoid duplicates)
  const existingSub = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (existingSub.length > 0) {
    console.log("[Webhook] Subscription already exists, updating...");
    await db
      .update(subscriptions)
      .set({
        status: mapStripeStatus(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
  } else {
    // Create subscription record
    await db.insert(subscriptions).values({
      userId: parseInt(userId),
      productId: productId,
      tier: productId,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: session.customer as string,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      status: mapStripeStatus(stripeSubscription.status),
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    });
    console.log(`[Webhook] Created subscription record for user ${userId}`);
  }
}

/**
 * Handle session booking from one-time payment
 * Creates coaching session record after successful payment
 */
async function handleSessionBooking(session: Stripe.Checkout.Session, db: any, userId: number) {
  console.log("[Webhook] Creating session booking for one-time payment");

  const sessionTypeId = session.metadata?.session_type_id;
  const scheduledDate = session.metadata?.scheduled_date;
  const notes = session.metadata?.notes;
  const sessionTypeName = session.metadata?.session_type_name;

  if (!sessionTypeId || !scheduledDate) {
    console.error("[Webhook] Missing session booking metadata");
    return;
  }

  const customerEmail = session.customer_email || session.metadata?.customer_email;
  
  // Get or create client record for this user (lookup by email)
  let clientRecord = customerEmail ? await db
    .select()
    .from(clients)
    .where(eq(clients.email, customerEmail))
    .limit(1) : [];

  let clientId: number;

  if (clientRecord.length === 0) {
    // Create client record
    const [newClient] = await db
      .insert(clients)
      .values({
        coachId: 1, // Default coach ID - adjust if needed
        name: session.metadata?.customer_name || "New Client",
        email: customerEmail || "",
        phone: "",
        status: "active",
      })
      .returning({ id: clients.id });
    clientId = newClient[0].id;
    console.log("[Webhook] Created new client record:", clientId);
  } else {
    clientId = clientRecord[0].id;
    console.log("[Webhook] Using existing client record:", clientId);
  }

  // Get session type details for duration and price
  const sessionTypeDetails = await db.query.sessionTypes.findFirst({
    where: (sessionTypes: any, { eq }: any) => eq(sessionTypes.id, parseInt(sessionTypeId)),
  });

  // Create session booking
  await db.insert(sessions).values({
    coachId: 1, // Default coach ID - adjust if needed
    clientId: clientId,
    sessionTypeId: parseInt(sessionTypeId),
    scheduledDate: new Date(scheduledDate),
    duration: sessionTypeDetails?.duration || 15,
    price: session.amount_total || 0,
    sessionType: sessionTypeName || "Breakthrough Discovery Session",
    notes: notes || "",
    status: "scheduled",
    paymentStatus: "paid",
    stripePaymentIntentId: session.payment_intent as string,
  });

  console.log("[Webhook] Session booking created successfully");
  console.log("[Webhook] Client ID:", clientId, "Session Type:", sessionTypeName, "Date:", scheduledDate);
}

/**
 * Handle successful payment
 * Updates subscription status
 */
async function handlePaymentSucceeded(invoice: any) {
  console.log("[Webhook] Processing invoice.payment_succeeded");

  const db = await getDb();
  if (!db) return;

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  // Update subscription status
  await db
    .update(subscriptions)
    .set({ status: "active" })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  console.log(`[Webhook] Payment confirmed for subscription ${subscriptionId}`);
}

/**
 * Handle failed payment
 * Updates subscription status to past_due
 */
async function handlePaymentFailed(invoice: any) {
  console.log("[Webhook] Processing invoice.payment_failed");

  const db = await getDb();
  if (!db) return;

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  // Get subscription to find user
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (!subscription) {
    console.log(`[Webhook] Subscription not found: ${subscriptionId}`);
    return;
  }

  // Update subscription status
  await db
    .update(subscriptions)
    .set({ status: "past_due" })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // Send payment failed email
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, subscription.userId))
      .limit(1);

    if (user && user.email) {
      const subject = "Your payment failed - update your card to keep access";
      const content = `
Hi ${user.name || "there"},

We tried to process your payment for PurposefulLive, but it didn't go through.

**What happens next:**
- We'll automatically retry the payment 3 times over the next 2 weeks
- Your access continues during this time
- If all retries fail, your access will be suspended

**To fix this now:**
1. Log in to your account
2. Go to Subscription Settings
3. Update your payment method

**Need help?** Reply to this email and we'll assist you.

Thank you,
- The PurposefulLive Team
      `.trim();

      // Log email to database (actual sending handled by email automation system)
      await db.insert(emailLogs).values({
        userId: user.id,
        emailType: "payment_failed",
        subject,
        status: "sent",
        metadata: JSON.stringify({ 
          subscriptionId: subscription.id,
          emailContent: content 
        }),
      });

      console.log(`[Webhook] Payment failed email sent to user ${user.id}`);
    }
  } catch (error) {
    console.error("[Webhook] Failed to send payment failed email:", error);
  }

  console.log(`[Webhook] Payment failed for subscription ${subscriptionId}`);
}

/**
 * Handle subscription cancellation
 * Updates subscription status to cancelled
 */
async function handleSubscriptionCancelled(subscription: any) {
  console.log("[Webhook] Processing customer.subscription.deleted");

  const db = await getDb();
  if (!db) return;

  // Update subscription status
  await db
    .update(subscriptions)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  console.log(`[Webhook] Subscription cancelled: ${subscription.id}`);
}

/**
 * Handle subscription updates
 * Updates local subscription record
 */
async function handleSubscriptionUpdated(subscription: any) {
  console.log("[Webhook] Processing customer.subscription.updated");

  const db = await getDb();
  if (!db) return;

  await db
    .update(subscriptions)
    .set({
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}
