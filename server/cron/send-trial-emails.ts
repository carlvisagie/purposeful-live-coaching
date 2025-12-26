/**
 * Send Trial Conversion Emails
 * 
 * Sends automated emails to users at key points in their trial:
 * - Day 5: Reminder that trial ends in 2 days
 * - Day 7 (expiration): Trial has ended, upgrade to continue
 * - Day 10: Follow-up for users who didn't upgrade
 */

import { getDb } from "../db";
import { subscriptions, users, emailLogs } from "../../drizzle/schema";
import { eq, and, gte, lte, lt, desc } from "drizzle-orm";
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.mailgun.org";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@purposefullivecoaching.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://purposefullivecoaching.com";

async function sendEmail(params: {
  to: string;
  subject: string;
  content: string;
  emailType: string;
  userId: number;
  metadata?: any;
}): Promise<boolean> {
  const db = await getDb();
  
  if (!SMTP_USER || !SMTP_PASS) {
    console.log(`[EMAIL] SMTP not configured. Would have sent ${params.emailType} to ${params.to}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${params.content.replace(/\n/g, '<br>')}</div>`,
    });

    // Log email
    if (db) {
      await db.insert(emailLogs).values({
        userId: params.userId,
        emailType: params.emailType,
        subject: params.subject,
        content: params.content,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        sentAt: new Date(),
      });
    }

    console.log(`[EMAIL] ✅ Sent ${params.emailType} to ${params.to}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] ❌ Failed to send ${params.emailType}:`, error);
    return false;
  }
}

/**
 * Send Day 5 reminder (2 days before trial ends)
 */
export async function sendDay5Reminders() {
  console.log("[EMAIL] Checking for Day 5 trial reminders...");
  
  const db = await getDb();
  if (!db) {
    console.error("[EMAIL] Database unavailable");
    return { sent: 0, errors: 0 };
  }

  // Find trials that started 5 days ago (trial ends in 2 days)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  fiveDaysAgo.setHours(0, 0, 0, 0);
  
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  sixDaysAgo.setHours(0, 0, 0, 0);

  const trialingUsers = await db
    .select({
      subscription: subscriptions,
      user: users,
    })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .where(
      and(
        eq(subscriptions.tier, "trial"),
        eq(subscriptions.status, "trialing"),
        gte(subscriptions.trialStart!, sixDaysAgo),
        lt(subscriptions.trialStart!, fiveDaysAgo)
      )
    );

  let sent = 0;
  let errors = 0;

  for (const { subscription, user } of trialingUsers) {
    if (!user.email) continue;

    // Check if already sent
    const existing = await db
      .select()
      .from(emailLogs)
      .where(
        and(
          eq(emailLogs.userId, user.id),
          eq(emailLogs.emailType, "trial_day5_reminder")
        )
      )
      .limit(1);

    if (existing.length > 0) continue;

    const subject = "⏰ Your trial ends in 2 days - Don't lose your progress!";
    const content = `
Hi ${user.name || "there"},

Your 7-day free trial of Purposeful Live Coaching ends in **2 days**.

**What happens if you don't subscribe:**
❌ You'll lose access to unlimited AI coaching
❌ Limited to just 5 messages per day
❌ Can't book live coaching sessions
❌ Your momentum will stall

**Continue your transformation:**
Subscribe now to keep full access. Plans start at just $29/month.

👉 **[Upgrade Now](${FRONTEND_URL}/#pricing)**

Questions? Just reply to this email.

- Carl & The Purposeful Live Team
    `.trim();

    const success = await sendEmail({
      to: user.email,
      subject,
      content,
      emailType: "trial_day5_reminder",
      userId: user.id,
      metadata: { subscriptionId: subscription.id },
    });

    if (success) sent++;
    else errors++;
  }

  console.log(`[EMAIL] Day 5 reminders: ${sent} sent, ${errors} errors`);
  return { sent, errors };
}

/**
 * Send trial expiration email (day trial ends)
 */
export async function sendTrialExpirationEmails() {
  console.log("[EMAIL] Checking for trial expiration emails...");
  
  const db = await getDb();
  if (!db) {
    console.error("[EMAIL] Database unavailable");
    return { sent: 0, errors: 0 };
  }

  // Find trials that expired today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const expiredTrials = await db
    .select({
      subscription: subscriptions,
      user: users,
    })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .where(
      and(
        eq(subscriptions.tier, "free"), // Already downgraded by cron
        gte(subscriptions.trialEnd!, today),
        lt(subscriptions.trialEnd!, tomorrow)
      )
    );

  let sent = 0;
  let errors = 0;

  for (const { subscription, user } of expiredTrials) {
    if (!user.email) continue;

    // Check if already sent
    const existing = await db
      .select()
      .from(emailLogs)
      .where(
        and(
          eq(emailLogs.userId, user.id),
          eq(emailLogs.emailType, "trial_expired")
        )
      )
      .limit(1);

    if (existing.length > 0) continue;

    const subject = "🔔 Your trial has ended - Upgrade to continue";
    const content = `
Hi ${user.name || "there"},

Your 7-day free trial has ended.

**Your account has been downgraded to the free tier:**
✅ 5 AI messages per day
❌ No live coaching sessions
❌ Limited module access

**Want to continue your transformation?**
Upgrade now to get back:
✨ Unlimited AI coaching 24/7
✨ Live coaching sessions
✨ All 34 wellness modules
✨ Progress tracking & insights

Plans start at just $29/month with a 7-day money-back guarantee.

👉 **[Upgrade Now](${FRONTEND_URL}/#pricing)**

Questions? Just reply to this email.

- Carl & The Purposeful Live Team
    `.trim();

    const success = await sendEmail({
      to: user.email,
      subject,
      content,
      emailType: "trial_expired",
      userId: user.id,
      metadata: { subscriptionId: subscription.id },
    });

    if (success) sent++;
    else errors++;
  }

  console.log(`[EMAIL] Trial expiration: ${sent} sent, ${errors} errors`);
  return { sent, errors };
}

/**
 * Send follow-up to users 3 days after trial expired
 */
export async function sendTrialFollowupEmails() {
  console.log("[EMAIL] Checking for trial follow-up emails...");
  
  const db = await getDb();
  if (!db) {
    console.error("[EMAIL] Database unavailable");
    return { sent: 0, errors: 0 };
  }

  // Find trials that expired 3 days ago
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(0, 0, 0, 0);
  
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
  fourDaysAgo.setHours(0, 0, 0, 0);

  const expiredTrials = await db
    .select({
      subscription: subscriptions,
      user: users,
    })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .where(
      and(
        eq(subscriptions.tier, "free"),
        gte(subscriptions.trialEnd!, fourDaysAgo),
        lt(subscriptions.trialEnd!, threeDaysAgo)
      )
    );

  let sent = 0;
  let errors = 0;

  for (const { subscription, user } of expiredTrials) {
    if (!user.email) continue;

    // Check if already sent
    const existing = await db
      .select()
      .from(emailLogs)
      .where(
        and(
          eq(emailLogs.userId, user.id),
          eq(emailLogs.emailType, "trial_followup")
        )
      )
      .limit(1);

    if (existing.length > 0) continue;

    const subject = "💭 Missing your AI coach? Come back!";
    const content = `
Hi ${user.name || "there"},

It's been a few days since your trial ended. How are you doing?

I noticed you haven't upgraded yet. I wanted to reach out personally because I believe this platform can truly help you.

**What's holding you back?**
- Price? We have flexible plans starting at $29/month
- Not sure it's working? Give it another shot - most breakthroughs happen after week 1
- Technical issues? Reply to this email and I'll help personally

**Special offer: 20% off your first month**
Use code COMEBACK20 at checkout.

👉 **[Claim Your Discount](${FRONTEND_URL}/#pricing)**

I'm here if you have questions.

- Carl Visagie
  Founder, Purposeful Live Coaching
    `.trim();

    const success = await sendEmail({
      to: user.email,
      subject,
      content,
      emailType: "trial_followup",
      userId: user.id,
      metadata: { subscriptionId: subscription.id },
    });

    if (success) sent++;
    else errors++;
  }

  console.log(`[EMAIL] Trial follow-up: ${sent} sent, ${errors} errors`);
  return { sent, errors };
}

// Export all functions
export async function sendAllTrialEmails() {
  const day5 = await sendDay5Reminders();
  const expired = await sendTrialExpirationEmails();
  const followup = await sendTrialFollowupEmails();

  return {
    day5Reminders: day5,
    expirationEmails: expired,
    followupEmails: followup,
    totalSent: day5.sent + expired.sent + followup.sent,
    totalErrors: day5.errors + expired.errors + followup.errors,
  };
}
