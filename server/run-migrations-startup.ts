/**
 * Run database migrations on server startup
 * This ensures tables exist before seeding
 */

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log("[Migrations] DATABASE_URL not set, skipping migrations");
    return;
  }

  try {
    console.log("[Migrations] Starting database migrations...");
    
    // Create a dedicated connection for migrations
    const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
    const db = drizzle(migrationClient);
    
    // Determine migrations folder path
    // In production (dist/), migrations are in ../drizzle
    // In development, migrations are in ../../drizzle
    const migrationsFolder = process.env.NODE_ENV === 'production' 
      ? join(__dirname, '../drizzle')
      : join(__dirname, '../../drizzle');
    
    console.log(`[Migrations] Using migrations folder: ${migrationsFolder}`);
    
    // Run migrations
    await migrate(db, { migrationsFolder });
    
    console.log("[Migrations] ✅ Migrations completed successfully!");
    
    // Close migration connection
    await migrationClient.end();
    
  } catch (error) {
    console.error("[Migrations] ❌ Failed to run migrations:", error);
    // Don't throw - let server start anyway, but log the error
  }
}
