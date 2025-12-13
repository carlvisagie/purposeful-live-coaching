#!/usr/bin/env node
import postgres from 'postgres';

const DATABASE_URL = 'postgresql://purposefullive_db_user:l7FOZpyCwsHIKhiTwUhaFUDRSUd4N457@dpg-d4npae6uk2gs73fppev0-a.oregon-postgres.render.com:5432/purposefullive_db?sslmode=require';

async function main() {
  const sql = postgres(DATABASE_URL, { max: 1 });

  console.log('🔄 Dropping duplicate camelCase columns...\n');
  
  // Drop specific duplicate columns we know about
  const drops = [
    { table: 'ai_chat_messages', column: 'conversationId' },
    { table: 'ai_chat_messages', column: 'createdAt' },
    { table: 'ai_chat_conversations', column: 'createdAt' },
    { table: 'ai_chat_conversations', column: 'updatedAt' },
  ];
  
  for (const { table, column } of drops) {
    try {
      await sql.unsafe(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${column}"`);
      console.log(`✅ Dropped ${table}.${column}`);
    } catch (error) {
      console.log(`❌ ${table}.${column}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Cleanup complete!');
  await sql.end();
}

main();
