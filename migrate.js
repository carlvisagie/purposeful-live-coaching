/**
 * Standalone migration script
 * Run this manually: node migrate.js
 */

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  try {
    console.log("=".repeat(60));
    console.log("RUNNING DATABASE MIGRATIONS");
    console.log("=".repeat(60));
    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error("❌ DATABASE_URL environment variable not found!");
      console.error("   Set it with: export DATABASE_URL='your-connection-string'");
      process.exit(1);
    }
    
    console.log("✓ Database URL found");
    console.log(`  Connection: ${connectionString.substring(0, 30)}...`);
    
    // Create migration client
    console.log("\n📡 Connecting to database...");
    const migrationClient = postgres(connectionString, { max: 1 });
    const db = drizzle(migrationClient);
    console.log("✓ Connected successfully");
    
    // Find migrations folder
    const migrationsPath = join(__dirname, "drizzle");
    console.log(`\n📂 Looking for migrations in: ${migrationsPath}`);
    
    // Run migrations
    console.log("\n🔄 Running migrations...");
    await migrate(db, { migrationsFolder: migrationsPath });
    console.log("✓ Migrations completed successfully!");
    
    // Close connection
    await migrationClient.end();
    console.log("✓ Database connection closed");
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL MIGRATIONS COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ MIGRATION FAILED!");
    console.error("=".repeat(60));
    console.error("\nError details:");
    console.error(error);
    console.error("\nStack trace:");
    console.error(error.stack);
    process.exit(1);
  }
}

runMigrations();
