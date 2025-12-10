import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { aiChatConversations } from './drizzle/schema.js';

const DATABASE_URL = 'postgresql://purposefullive_db_user:l7FOZpyCwsHIKhiTwUhaFUDRSUd4N457@dpg-d4npae6uk2gs73fppev0-a.oregon-postgres.render.com:5432/purposefullive_db?sslmode=require';

async function main() {
  console.log('🔄 Connecting to production database...');
  
  const sql = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  console.log('📊 Testing INSERT with Drizzle ORM...');
  
  try {
    const [result] = await db
      .insert(aiChatConversations)
      .values({
        title: "Drizzle Test Conversation",
      })
      .returning();
    
    console.log('✅ INSERT successful!');
    console.log('Result:', result);
    console.log('ID:', result.id);
  } catch (error) {
    console.error('❌ INSERT failed:', error.message);
    console.error('Full error:', error);
  }
  
  await sql.end();
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
