import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://purposeful_live_coaching_production_user:l7WJPUNNTBJNgTcwmIGJHpLNdFf9Oj3t@dpg-d4ruf5aj1k6c73ccqh60-a.oregon-postgres.render.com:5432/purposeful_live_coaching_production',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('Connecting to production database...');
    await client.connect();
    console.log('Connected successfully!');
    
    const migrationSQL = fs.readFileSync('COMPLETE_DATABASE_MIGRATION.sql', 'utf8');
    
    console.log('Running migration...');
    await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the columns were added
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'aiChatConversations'
      ORDER BY ordinal_position
    `);
    
    console.log('\nColumns in aiChatConversations table:');
    result.rows.forEach(row => console.log(`  - ${row.column_name}`));
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

runMigration();
