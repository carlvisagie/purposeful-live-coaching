#!/usr/bin/env node
import postgres from 'postgres';

const DATABASE_URL = 'postgresql://purposefullive_db_user:l7FOZpyCwsHIKhiTwUhaFUDRSUd4N457@dpg-d4npae6uk2gs73fppev0-a.oregon-postgres.render.com:5432/purposefullive_db?sslmode=require';

async function main() {
  const sql = postgres(DATABASE_URL, { max: 1 });

  console.log('🔄 Renaming ALL camelCase columns to snake_case...\n');
  
  // Get all tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  for (const { table_name } of tables) {
    console.log(`\n📊 Table: ${table_name}`);
    
    // Get all columns for this table
    const columns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = ${table_name}
      ORDER BY ordinal_position;
    `;
    
    for (const { column_name } of columns) {
      // Convert camelCase to snake_case
      const snake_case = column_name.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      if (snake_case !== column_name && !column_name.includes('_')) {
        try {
          await sql.unsafe(`ALTER TABLE "${table_name}" RENAME COLUMN "${column_name}" TO "${snake_case}"`);
          console.log(`  ✅ ${column_name} → ${snake_case}`);
        } catch (error) {
          console.log(`  ❌ ${column_name}: ${error.message}`);
        }
      }
    }
  }
  
  console.log('\n✅ All columns renamed!');
  await sql.end();
}

main();
