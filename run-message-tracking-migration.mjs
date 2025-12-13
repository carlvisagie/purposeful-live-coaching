import pg from 'pg';
import fs from 'fs';

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

try {
  await client.connect();
  console.log('✅ Connected to database');
  
  const sql = fs.readFileSync('add-message-tracking.sql', 'utf8');
  await client.query(sql);
  
  console.log('✅ Migration successful: ai_messages_used column added to usage_tracking table');
  
  await client.end();
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
