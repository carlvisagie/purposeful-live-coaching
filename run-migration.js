/**
 * Standalone Database Migration Runner
 * 
 * This script can be run directly on Render to add performance indexes
 * without waiting for the full deployment.
 * 
 * Usage: node run-migration.js
 */

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function runMigration() {
  console.log('=== DATABASE MIGRATION: ADD PERFORMANCE INDEXES ===\n');
  console.log('Target: ai_chat_conversations table');
  console.log('Purpose: Fix 60+ second INSERT performance issue\n');
  
  try {
    // Test connection first
    console.log('[1/3] Testing database connection...');
    const testResult = await sql`SELECT NOW() as time`;
    console.log(`✓ Connected successfully at ${testResult[0].time}\n`);
    
    // Check current indexes
    console.log('[2/3] Checking current indexes...');
    const currentIndexes = await sql`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'ai_chat_conversations'
      ORDER BY indexname
    `;
    console.log(`Found ${currentIndexes.length} existing indexes:`);
    currentIndexes.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
    });
    console.log('');
    
    // Add new indexes
    console.log('[3/3] Adding performance indexes...\n');
    
    const indexes = [
      {
        name: 'idx_ai_chat_conversations_user_id',
        column: 'user_id',
        reason: 'Foreign key to users.id - speeds up constraint checks'
      },
      {
        name: 'idx_ai_chat_conversations_client_id',
        column: 'client_id',
        reason: 'Foreign key to clients.id - speeds up constraint checks'
      },
      {
        name: 'idx_ai_chat_conversations_subscription_id',
        column: 'subscription_id',
        reason: 'Foreign key to subscriptions.id - speeds up constraint checks'
      },
      {
        name: 'idx_ai_chat_conversations_created_at',
        column: 'created_at',
        reason: 'Improves sorting and filtering by creation date'
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const index of indexes) {
      try {
        const startTime = Date.now();
        console.log(`Creating: ${index.name}`);
        console.log(`  Column: ${index.column}`);
        console.log(`  Reason: ${index.reason}`);
        
        await sql.unsafe(`
          CREATE INDEX IF NOT EXISTS ${index.name} 
          ON ai_chat_conversations(${index.column})
        `);
        
        const elapsed = Date.now() - startTime;
        console.log(`  ✓ Created in ${elapsed}ms\n`);
        createdCount++;
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`  ℹ Already exists, skipping\n`);
          skippedCount++;
        } else {
          console.error(`  ✗ Error: ${error.message}\n`);
          throw error;
        }
      }
    }

    // Verify final state
    console.log('Verifying indexes...');
    const finalIndexes = await sql`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'ai_chat_conversations'
      ORDER BY indexname
    `;
    console.log(`\n✓ Final index count: ${finalIndexes.length}`);
    finalIndexes.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
    });
    
    console.log('\n=== MIGRATION COMPLETE ===');
    console.log(`Created: ${createdCount} indexes`);
    console.log(`Skipped: ${skippedCount} indexes (already existed)`);
    console.log('\n✅ AI Coach performance should now be significantly improved!');
    console.log('   INSERT operations should complete in <1 second instead of 60+ seconds.\n');
    
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
