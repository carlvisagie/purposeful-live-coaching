/**
 * Cron Job: Enforce Trial Expiration
 * 
 * Runs daily to check for expired trials and downgrade them to free tier.
 * This ensures users can't use the platform for free forever.
 * 
 * Schedule: Daily at midnight
 */

import { getDb } from "../db";
import { subscriptions } from "../../drizzle/schema";
import { and, eq, lt, isNull } from "drizzle-orm";

export async function enforceTrialExpiration() {
  console.log("[Cron] Starting trial expiration enforcement...");
  
  const db = await getDb();
  if (!db) {
    console.error("[Cron] Database not available");
    return;
  }

  try {
    // Find all expired trials that haven't been downgraded
    const now = new Date();
    
    const result = await db
      .update(subscriptions)
      .set({ 
        tier: "free", 
        updatedAt: now 
      })
      .where(
        and(
          eq(subscriptions.tier, "trial"),
          eq(subscriptions.status, "trialing"),
          lt(subscriptions.trialEnd, now),
          isNull(subscriptions.stripeSubscriptionId)
        )
      );

    const count = result.rowsAffected || 0;
    
    if (count > 0) {
      console.log(`[Cron] ✅ Downgraded ${count} expired trials to free tier`);
    } else {
      console.log("[Cron] No expired trials to downgrade");
    }

    // Log summary
    const summary = await db.execute(`
      SELECT 
        tier,
        COUNT(*) as count,
        COUNT(CASE WHEN trial_end < NOW() THEN 1 END) as expired_count,
        COUNT(CASE WHEN stripe_subscription_id IS NOT NULL THEN 1 END) as paid_count
      FROM subscriptions
      GROUP BY tier
    `);

    console.log("[Cron] Subscription summary:", summary.rows);

  } catch (error) {
    console.error("[Cron] Error enforcing trial expiration:", error);
  }
}

// If run directly (not imported)
if (require.main === module) {
  enforceTrialExpiration()
    .then(() => {
      console.log("[Cron] Trial expiration enforcement complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("[Cron] Fatal error:", error);
      process.exit(1);
    });
}
