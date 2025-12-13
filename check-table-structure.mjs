#!/usr/bin/env node
import postgres from 'postgres';

const DATABASE_URL = 'postgresql://purposefullive_db_user:l7FOZpyCwsHIKhiTwUhaFUDRSUd4N457@dpg-d4npae6uk2gs73fppev0-a.oregon-postgres.render.com:5432/purposefullive_db?sslmode=require';

async function main() {
  const sql = postgres(DATABASE_URL, { max: 1 });

  console.log('Checking ai_chat_conversations table structure...\n');
  
  const columns = await sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'ai_chat_conversations'
    ORDER BY ordinal_position;
  `;
  
  console.log('Columns:');
  columns.forEach(col => {
    console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default || ''}`);
  });
  
  await sql.end();
}

main();
