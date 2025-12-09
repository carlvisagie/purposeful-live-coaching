/**
 * Email Automation Router
 * Handles automated emails for trial conversion, payment recovery, and engagement
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { subscriptions, usageTracking, emailLogs, users } from "../../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email using standard SMTP (Nodemailer)
 */
async function sendEmail(params: {
  userId: number;
  emailType: string;
  subject: string;
  content: string;
  metadata?: any;
}) {
  const { userId, emailType, subject, content, metadata } = params;

  // Get user email from database
  const db = await getDb();
  if (!db) return false;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user.length || !user[0].email) {
    console.warn(`[EMAIL] No email found for user ${userId}`);
    return false;
  }

  const recipient = user[0].email;
  let success = false;

  try {
    await transporter.sendMail({
      from: `"Purposeful Live Coaching" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      text: content,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${content.replace(/\n/g, '<br>')}</div>`,
    });
    success = true;
    console.log(`[EMAIL] Sent ${emailType} to ${recipient}`);
  } catch (error) {
    console.error(`[EMAIL] Failed to send ${emailType}:`, error);
  }

  // Log email
  const db = await getDb();
  if (db) {
    await db.insert(emailLogs).values({
      userId,
      emailType: emailType as any,
      subject,
      status: success ? "sent" : "failed",
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  }

  return success;
}

/**
 * Calculate days since trial started
 */
function daysSince(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export const emailAutomationRouter = router({
  /**
   * Send trial day-5 reminder email
   * Should be called daily by a cron job
   */
  sendTrialReminders: publicProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Find all trialing subscriptions that started 5 days ago
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const trialingSubscriptions = await db
      .select({
        subscription: subscriptions,
        user: users,
      })
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.userId, users.id))
      .where(
        and(
          eq(subscriptions.status, "trialing"),
          gte(subscriptions.trialStart!, sixDaysAgo),
          lte(subscriptions.trialStart!, fiveDaysAgo)
        )
      );

    let sentCount = 0;
    let errorCount = 0;

    for (const { subscription, user } of trialingSubscriptions) {
      // Check if we already sent this email
      const existingEmail = await db
        .select()
        .from(emailLogs)
        .where(
          and(
            eq(emailLogs.userId, user.id),
            eq(emailLogs.emailType, "trial_day5_reminder")
          )
        )
        .limit(1);

      if (existingEmail.length > 0) {
        continue; // Already sent
      }

      // Get usage stats
      const usage = await db
        .select()
        .from(usageTracking)
        .where(eq(usageTracking.subscriptionId, subscription.id))
        .orderBy(desc(usageTracking.createdAt))
        .limit(1);

      const aiSessionsUsed = usage[0]?.aiSessionsUsed || 0;
      const humanSessionsUsed = usage[0]?.humanSessionsUsed || 0;

      const subject = "Your trial ends in 2 days - here's what you'll miss";
      const content = `
Hi ${user.name || "there"},

Your 7-day free trial of PurposefulLive ends in 2 days.

**Here's what you've accomplished so far:**
- ${aiSessionsUsed} AI coaching sessions completed
- ${humanSessionsUsed > 0 ? `${humanSessionsUsed} human coaching sessions booked` : "24/7 AI support whenever you needed it"}

**What happens if you don't subscribe:**
- You'll lose access to your AI coach
- Your conversation history will be saved, but you won't be able to continue
- You'll miss out on the progress you've been making

**Continue your journey:**
Subscribe now to keep the momentum going. Starting at just $29/month.

[Subscribe Now] → https://your-domain.com/pricing

Questions? Just reply to this email.

- The PurposefulLive Team
      `.trim();

      const success = await sendEmail({
        userId: user.id,
        emailType: "trial_day5_reminder",
        subject,
        content,
        metadata: { aiSessionsUsed, humanSessionsUsed },
      });

      if (success) {
        sentCount++;
      } else {
        errorCount++;
      }
    }

    return {
      sentCount,
      errorCount,
      message: `Sent ${sentCount} trial reminder emails, ${errorCount} errors`,
    };
  }),

  /**
   * Send welcome email when trial starts
   */
  sendWelcomeEmail: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const subject = "Welcome to PurposefulLive - Your AI coach is ready!";
      const content = `
Hi ${user.name || "there"},

Welcome to PurposefulLive! 🎉

Your 7-day free trial has started, and your AI coach is ready to help you 24/7.

**Quick Start Guide:**
1. Go to your dashboard → Click "AI Coach"
2. Start a conversation about what's on your mind
3. Your AI coach will provide structured, actionable guidance
4. Come back anytime - your coach never sleeps!

**What to expect:**
- Evidence-based behavioral science techniques
- Structured action plans (not vague advice)
- Crisis detection and support resources
- 24/7 availability whenever you need it

**Your trial includes:**
- Unlimited AI coaching sessions
- 7 days to explore all features
- No credit card required to start

[Start Your First Session] → https://your-domain.com/ai-coach

Questions? Just reply to this email.

- The PurposefulLive Team
      `.trim();

      return await sendEmail({
        userId: user.id,
        emailType: "welcome",
        subject,
        content,
      });
    }),

  /**
   * Send failed payment recovery email
   */
  sendPaymentFailedEmail: publicProcedure
    .input(z.object({ userId: z.number(), subscriptionId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const subject = "Your payment failed - update your card to keep access";
      const content = `
Hi ${user.name || "there"},

We tried to process your payment for PurposefulLive, but it didn't go through.

**What this means:**
- Your access will be suspended in 3 days if we can't process payment
- You'll lose access to your AI coach
- Your conversation history will be saved

**Fix it now (takes 30 seconds):**
[Update Payment Method] → https://your-domain.com/subscription

**Common reasons payments fail:**
- Expired card
- Insufficient funds
- Bank declined the charge

If you're having trouble, just reply to this email and we'll help.

- The PurposefulLive Team
      `.trim();

      return await sendEmail({
        userId: user.id,
        emailType: "payment_failed",
        subject,
        content,
        metadata: { subscriptionId: input.subscriptionId },
      });
    }),

  /**
   * Send monthly usage summary email
   */
  sendMonthlySummary: publicProcedure
    .input(z.object({ userId: z.number(), subscriptionId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      // Get usage for current period
      const usage = await db
        .select()
        .from(usageTracking)
        .where(eq(usageTracking.subscriptionId, input.subscriptionId))
        .orderBy(desc(usageTracking.createdAt))
        .limit(1);

      const aiSessionsUsed = usage[0]?.aiSessionsUsed || 0;
      const humanSessionsUsed = usage[0]?.humanSessionsUsed || 0;
      const humanSessionsIncluded = usage[0]?.humanSessionsIncluded || 0;

      const subject = "Your PurposefulLive monthly report";
      const content = `
Hi ${user.name || "there"},

Here's your PurposefulLive activity for this month:

**Your Progress:**
- ${aiSessionsUsed} AI coaching sessions completed
- ${humanSessionsUsed}/${humanSessionsIncluded} human coaching sessions used
- You're building momentum! 🚀

**Keep Going:**
The most successful users engage with their AI coach at least 3x per week.

${aiSessionsUsed < 12 ? "**Tip:** Try starting your day with a quick check-in with your AI coach. Even 5 minutes can set the tone for your whole day." : "**Amazing!** You're one of our most engaged users. Keep up the great work!"}

[Continue Your Journey] → https://your-domain.com/ai-coach

Questions or feedback? Just reply to this email.

- The PurposefulLive Team
      `.trim();

      return await sendEmail({
        userId: user.id,
        emailType: "monthly_summary",
        subject,
        content,
        metadata: { aiSessionsUsed, humanSessionsUsed, humanSessionsIncluded },
      });
    }),

  /**
   * Get email log history for a user
   */
  getEmailHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { emails: [] };

    const emails = await db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.userId, ctx.user.id))
      .orderBy(desc(emailLogs.sentAt))
      .limit(50);

    return { emails };
  }),
});
