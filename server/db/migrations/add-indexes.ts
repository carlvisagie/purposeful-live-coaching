/**
 * Database Migration: Add Performance Indexes
 * 
 * This migration adds indexes to the ai_chat_conversations table to improve INSERT performance.
 * 
 * Problem: INSERT operations taking 60+ seconds due to foreign key constraint checks
 * Solution: Add indexes on foreign key columns to speed up constraint validation
 * 
 * Indexes to add:
 * - user_id (foreign key to users.id)
 * - client_id (foreign key to clients.id)
 * - subscription_id (foreign key to subscriptions.id)
 * - created_at (for sorting/filtering)
 */

import postgres from 'postgres';

export async function addPerformanceIndexes() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = postgres(DATABASE_URL, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 30,
  });

  try {
    console.log('[Migration] Starting index creation...');
    
    const indexes = [
      {
        name: 'idx_ai_chat_conversations_user_id',
        table: 'ai_chat_conversations',
        column: 'user_id',
        reason: 'Foreign key to users.id - speeds up constraint checks on INSERT'
      },
      {
        name: 'idx_ai_chat_conversations_client_id',
        table: 'ai_chat_conversations',
        column: 'client_id',
        reason: 'Foreign key to clients.id - speeds up constraint checks on INSERT'
      },
      {
        name: 'idx_ai_chat_conversations_subscription_id',
        table: 'ai_chat_conversations',
        column: 'subscription_id',
        reason: 'Foreign key to subscriptions.id - speeds up constraint checks on INSERT'
      },
      {
        name: 'idx_ai_chat_conversations_created_at',
        table: 'ai_chat_conversations',
        column: 'created_at',
        reason: 'Improves sorting and filtering by creation date'
      },
    ];

    for (const index of indexes) {
      try {
        const startTime = Date.now();
        console.log(`[Migration] Creating index: ${index.name}...`);
        console.log(`[Migration]   Reason: ${index.reason}`);
        
        await sql.unsafe(`
          CREATE INDEX IF NOT EXISTS ${index.name} 
          ON ${index.table}(${index.column})
        `);
        
        const elapsed = Date.now() - startTime;
        console.log(`[Migration] ✓ Index created in ${elapsed}ms`);
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          console.log(`[Migration] ℹ Index ${index.name} already exists, skipping`);
        } else {
          console.error(`[Migration] ✗ Error creating index ${index.name}:`, error.message);
          throw error;
        }
      }
    }

    console.log('[Migration] ✓ All indexes created successfully');
    
    // Verify indexes were created
    console.log('[Migration] Verifying indexes...');
    const result = await sql`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'ai_chat_conversations'
      ORDER BY indexname
    `;
    
    console.log(`[Migration] Found ${result.length} indexes on ai_chat_conversations:`);
    result.forEach((row: any) => {
      console.log(`[Migration]   - ${row.indexname}`);
    });
    
    return true;
  } catch (error) {
    console.error('[Migration] Migration failed:', error);
    throw error;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addPerformanceIndexes()
    .then(() => {
      console.log('[Migration] Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Migration] Migration failed:', error);
      process.exit(1);
    });
}
