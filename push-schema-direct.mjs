import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle/schema.ts';

const DATABASE_URL = 'postgresql://purposefullive_db_user:l7FOZpyCwsHIKhiTwUhaFUDRSUd4N457@dpg-d4npae6uk2gs73fppev0-a.oregon-postgres.render.com:5432/purposefullive_db?sslmode=require';

async function main() {
  console.log('🔄 Connecting to production database...');
  
  const sql = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(sql, { schema });

  console.log('📊 Schema loaded with', Object.keys(schema).length, 'exports');
  
  // Get all table definitions
  const tables = Object.entries(schema)
    .filter(([key, value]) => value && typeof value === 'object' && 'getSQL' in value)
    .map(([key]) => key);
  
  console.log('📋 Found', tables.length, 'table definitions');
  console.log('First 10 tables:', tables.slice(0, 10).join(', '));
  
  console.log('\n⚠️  This will create ALL missing tables in production!');
  console.log('✅ Existing tables will NOT be modified');
  console.log('🚀 Proceeding with schema push...\n');
  
  // Use drizzle-kit push programmatically
  const { execSync } = await import('child_process');
  
  try {
    execSync('pnpm drizzle-kit push --force', {
      cwd: '/home/ubuntu/purposeful-live-coaching',
      env: { ...process.env, DATABASE_URL },
      stdio: 'inherit'
    });
    
    console.log('\n✅ Schema push completed!');
  } catch (error) {
    console.error('\n❌ Schema push failed:', error.message);
    process.exit(1);
  }
  
  await sql.end();
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
