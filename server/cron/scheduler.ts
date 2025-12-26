/**
 * Cron Job Scheduler
 * 
 * Manages all scheduled tasks for the platform.
 */

import cron from "node-cron";
import { enforceTrialExpiration } from "./enforce-trial-expiration";
import { sendAllTrialEmails } from "./send-trial-emails";

export function startCronJobs() {
  console.log("[Cron] Starting scheduled jobs...");

  // Run trial expiration enforcement daily at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running daily trial expiration enforcement");
    await enforceTrialExpiration();
  });

  // Run trial conversion emails daily at 9 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("[Cron] Running daily trial conversion emails");
    await sendAllTrialEmails();
  });

  // Also run on startup to catch any that were missed
  console.log("[Cron] Running initial trial expiration enforcement");
  enforceTrialExpiration().catch((error) => {
    console.error("[Cron] Error in initial enforcement:", error);
  });

  console.log("[Cron] ✅ Scheduled jobs started");
  console.log("[Cron] - Trial expiration: Daily at midnight");
  console.log("[Cron] - Trial conversion emails: Daily at 9 AM");
}
