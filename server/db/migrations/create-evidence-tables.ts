/**
 * Database Migration: Create Evidence Validation Tables
 * 
 * This migration creates the Keepers of the Truth evidence validation system tables.
 * 
 * Tables to create:
 * - evidence_records: Main evidence validation records
 * - evidence_sources: Individual research sources backing each recommendation
 * - evidence_updates: Audit log of evidence rating changes
 * 
 * Usage:
 * - Call via API: POST /api/trpc/migrations.createEvidenceTables
 * - Or import and call: await createEvidenceTables()
 * 
 * NOTE: Do NOT add self-executing code here as this file gets bundled with the main app.
 */

import postgres from 'postgres';

export async function createEvidenceTables() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = postgres(DATABASE_URL, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 30,
    ssl: 'require',
  });

  try {
    console.log('[Evidence Migration] Starting table creation...');
    
    // Create evidence_records table
    console.log('[Evidence Migration] Creating evidence_records table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS evidence_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recommendation_id TEXT NOT NULL UNIQUE,
        recommendation_text TEXT NOT NULL,
        category TEXT NOT NULL,
        evidence_strength INTEGER NOT NULL,
        confidence_score INTEGER NOT NULL,
        source_count INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
        controversy_flag BOOLEAN DEFAULT FALSE,
        quality_assessment TEXT
      )
    `);
    console.log('[Evidence Migration] ✓ evidence_records table created');

    // Create evidence_sources table
    console.log('[Evidence Migration] Creating evidence_sources table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS evidence_sources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evidence_id UUID NOT NULL REFERENCES evidence_records(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        authors JSONB NOT NULL,
        journal TEXT,
        year INTEGER NOT NULL,
        doi TEXT,
        pubmed_id TEXT,
        url TEXT NOT NULL,
        study_type TEXT NOT NULL,
        sample_size INTEGER,
        quality INTEGER NOT NULL,
        added_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('[Evidence Migration] ✓ evidence_sources table created');

    // Create evidence_updates table
    console.log('[Evidence Migration] Creating evidence_updates table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS evidence_updates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evidence_id UUID NOT NULL REFERENCES evidence_records(id) ON DELETE CASCADE,
        update_type TEXT NOT NULL,
        previous_rating INTEGER,
        new_rating INTEGER,
        reason TEXT,
        updated_by TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('[Evidence Migration] ✓ evidence_updates table created');

    // Create indexes for better performance
    console.log('[Evidence Migration] Creating indexes...');
    
    const indexes = [
      {
        name: 'idx_evidence_records_recommendation_id',
        sql: 'CREATE INDEX IF NOT EXISTS idx_evidence_records_recommendation_id ON evidence_records(recommendation_id)'
      },
      {
        name: 'idx_evidence_records_category',
        sql: 'CREATE INDEX IF NOT EXISTS idx_evidence_records_category ON evidence_records(category)'
      },
      {
        name: 'idx_evidence_records_strength',
        sql: 'CREATE INDEX IF NOT EXISTS idx_evidence_records_strength ON evidence_records(evidence_strength)'
      },
      {
        name: 'idx_evidence_sources_evidence_id',
        sql: 'CREATE INDEX IF NOT EXISTS idx_evidence_sources_evidence_id ON evidence_sources(evidence_id)'
      },
      {
        name: 'idx_evidence_sources_quality',
        sql: 'CREATE INDEX IF NOT EXISTS idx_evidence_sources_quality ON evidence_sources(quality)'
      },
      {
        name: 'idx_evidence_updates_evidence_id',
        sql: 'CREATE INDEX IF NOT EXISTS idx_evidence_updates_evidence_id ON evidence_updates(evidence_id)'
      },
    ];

    for (const index of indexes) {
      try {
        await sql.unsafe(index.sql);
        console.log(`[Evidence Migration] ✓ Index ${index.name} created`);
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          console.log(`[Evidence Migration] ℹ Index ${index.name} already exists`);
        } else {
          console.error(`[Evidence Migration] ✗ Error creating index ${index.name}:`, error.message);
          throw error;
        }
      }
    }

    // Verify tables were created
    console.log('[Evidence Migration] Verifying tables...');
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE 'evidence%'
      ORDER BY tablename
    `;
    
    console.log(`[Evidence Migration] Found ${tables.length} evidence tables:`);
    tables.forEach((row: any) => {
      console.log(`[Evidence Migration]   - ${row.tablename}`);
    });
    
    console.log('[Evidence Migration] ✓ Migration completed successfully');
    return true;
  } catch (error) {
    console.error('[Evidence Migration] Migration failed:', error);
    throw error;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
