/**
 * Database Health Check Router
 * Tests database connectivity and table existence
 */

import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { sql } from "drizzle-orm";

export const dbHealthRouter = router({
  /**
   * Check database health
   */
  check: publicProcedure.query(async () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {},
    };

    try {
      // Test 1: Basic connection
      results.tests.connection = { status: "testing..." };
      const connectionTest = await db.execute(sql`SELECT 1 as test`);
      results.tests.connection = { 
        status: "✅ SUCCESS", 
        result: connectionTest 
      };
    } catch (error) {
      results.tests.connection = { 
        status: "❌ FAILED", 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      };
      return results; // Stop if we can't even connect
    }

    try {
      // Test 2: Check if ai_chat_conversations table exists
      results.tests.tableExists = { status: "testing..." };
      const tableCheck = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'ai_chat_conversations'
        );
      `);
      results.tests.tableExists = { 
        status: "✅ SUCCESS", 
        exists: tableCheck 
      };
    } catch (error) {
      results.tests.tableExists = { 
        status: "❌ FAILED", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }

    try {
      // Test 3: List all tables
      results.tests.allTables = { status: "testing..." };
      const allTables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      results.tests.allTables = { 
        status: "✅ SUCCESS", 
        tables: allTables 
      };
    } catch (error) {
      results.tests.allTables = { 
        status: "❌ FAILED", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }

    try {
      // Test 4: Check ai_chat_conversations schema
      results.tests.tableSchema = { status: "testing..." };
      const schemaCheck = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'ai_chat_conversations'
        ORDER BY ordinal_position;
      `);
      results.tests.tableSchema = { 
        status: "✅ SUCCESS", 
        columns: schemaCheck 
      };
    } catch (error) {
      results.tests.tableSchema = { 
        status: "❌ FAILED", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }

    try {
      // Test 5: Try to INSERT a test conversation
      results.tests.insertTest = { status: "testing..." };
      const insertResult = await db.execute(sql`
        INSERT INTO ai_chat_conversations 
        (user_id, client_id, subscription_id, title, last_message_at, created_at, updated_at)
        VALUES 
        (NULL, NULL, NULL, 'Health Check Test', NOW(), NOW(), NOW())
        RETURNING id;
      `);
      results.tests.insertTest = { 
        status: "✅ SUCCESS", 
        insertedId: insertResult 
      };

      // Clean up test record
      if (insertResult && insertResult[0]?.id) {
        await db.execute(sql`DELETE FROM ai_chat_conversations WHERE id = ${insertResult[0].id}`);
        results.tests.insertTest.cleaned = true;
      }
    } catch (error) {
      results.tests.insertTest = { 
        status: "❌ FAILED", 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      };
    }

    return results;
  }),
});
