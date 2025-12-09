#!/usr/bin/env node
/**
 * Migration script: Make userId nullable in aiChatConversations
 * This allows guest users to create conversations without authentication
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

async function migrate() {
  console.log('🔄 Starting migration: Make userId nullable...');
  
  // Get database URL from environment
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable not set');
  }
  
  // Create connection
  const sql = postgres(dbUrl);
  const db = drizzle(sql);
  
  try {
    // Run migration
    console.log('📝 Altering aiChatConversations table...');
    await sql`
      ALTER TABLE "aiChatConversations" 
      ALTER COLUMN "userId" DROP NOT NULL
    `;
    
    console.log('✅ Migration completed successfully!');
    console.log('✅ userId is now nullable in aiChatConversations');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
