/**
 * Migration Runner
 * Runs all migrations on server startup
 */

import { seedCoaches } from "./seed-coaches";

export async function runMigrations() {
  console.log("[Migrations] Starting migrations...");
  
  try {
    await seedCoaches();
    console.log("[Migrations] ✅ All migrations completed successfully");
  } catch (error) {
    console.error("[Migrations] ❌ Migration failed:", error);
    // Don't throw - let the server start even if migrations fail
  }
}
