#!/usr/bin/env node
import postgres from 'postgres';
import { readFileSync } from 'fs';

const DATABASE_URL = 'postgresql://purposefullive_db_user:l7FOZpyCwsHIKhiTwUhaFUDRSUd4N457@dpg-d4npae6uk2gs73fppev0-a.oregon-postgres.render.com:5432/purposefullive_db?sslmode=require';

async function main() {
  console.log('🔄 Connecting to database...');
  const sql = postgres(DATABASE_URL, { max: 1 });

  console.log('📝 Renaming tables to snake_case...');
  
  try {
    await sql.unsafe(`ALTER TABLE IF EXISTS "aiChatConversations" RENAME TO "ai_chat_conversations"`);
    console.log('✅ Renamed aiChatConversations → ai_chat_conversations');
    
    await sql.unsafe(`ALTER TABLE IF EXISTS "aiChatMessages" RENAME TO "ai_chat_messages"`);
    console.log('✅ Renamed aiChatMessages → ai_chat_messages');
    
    await sql.unsafe(`ALTER TABLE IF EXISTS "aiInsights" RENAME TO "ai_insights"`);
    console.log('✅ Renamed aiInsights → ai_insights');
    
    console.log('✅ All tables renamed successfully!');
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
