/**
 * Push schema directly to database on server startup
 * Uses drizzle-kit push to sync schema without migrations
 */

import { execSync } from 'child_process';

export async function pushSchema() {
  if (!process.env.DATABASE_URL) {
    console.log("[Schema Push] DATABASE_URL not set, skipping schema push");
    return;
  }

  try {
    console.log("[Schema Push] Starting direct schema push to database...");
    
    // Use drizzle-kit push to directly sync schema
    // This bypasses migrations and just ensures tables match schema
    execSync('npx drizzle-kit push --yes', {
      stdio: 'inherit',
      env: process.env
    });
    
    console.log("[Schema Push] ✅ Schema pushed successfully!");
    console.log("[Schema Push] All tables should now exist in database");
    
  } catch (error) {
    console.error("[Schema Push] ❌ Failed to push schema:", error);
    // Don't throw - let server start anyway, but log the error
  }
}
