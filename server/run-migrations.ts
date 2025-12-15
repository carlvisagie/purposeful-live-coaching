/**
 * Run database migrations on server startup
 * This ensures the database schema is always up-to-date in production
 */

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function runMigrations() {
  try {
    console.log("[Migrations] Starting database migrations...");
    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error("[Migrations] ❌ DATABASE_URL not found, skipping migrations");
      return;
    }
    
    // Create a migration client (max 1 connection)
    const migrationClient = postgres(connectionString, { max: 1 });
    const db = drizzle(migrationClient);
    
    // Run migrations from ./drizzle folder
    await migrate(db, { migrationsFolder: "./drizzle" });
    
    console.log("[Migrations] ✅ Database migrations completed successfully");
    
    // Close the migration connection
    await migrationClient.end();
    
  } catch (error) {
    console.error("[Migrations] ❌ Failed to run migrations:", error);
    // Don't throw - let the server start anyway
    // This prevents the server from crashing if migrations fail
  }
}
