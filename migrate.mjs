import { createConnection } from 'mysql2/promise';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/purposeful_live_coaching';

async function runMigration() {
  const connection = await createConnection(connectionString);
  
  console.log('✅ Connected to database');
  
  const sql = fs.readFileSync('run_full_migration.sql', 'utf8');
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  
  console.log(`Running ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (stmt) {
      try {
        await connection.query(stmt);
        console.log(`✅ Statement ${i+1}/${statements.length} executed`);
      } catch (err) {
        console.error(`❌ Statement ${i+1} failed:`, err.message);
      }
    }
  }
  
  await connection.end();
  console.log('🎉 Migration complete!');
}

runMigration().catch(console.error);
