import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not set, skipping migrations');
    return;
  }

  console.log('🔄 Running database migrations...');

  const sql = postgres(DATABASE_URL, { max: 1 });

  try {
    // Read all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Run in alphabetical order

    for (const file of migrationFiles) {
      console.log(`  Running migration: ${file}`);
      const migrationSQL = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf8'
      );
      
      await sql.unsafe(migrationSQL);
      console.log(`  ✅ ${file} completed`);
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run migrations
runMigrations().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
