/**
 * Database Migrations Router
 * 
 * Provides endpoints to run database migrations manually.
 * This is useful for adding indexes and schema changes without downtime.
 */

import { router, publicProcedure } from "../_core/trpc";
import { addPerformanceIndexes } from "../db/migrations/add-indexes";
import { createEvidenceTables } from "../db/migrations/create-evidence-tables";

export const migrationsRouter = router({
  /**
   * Add performance indexes to ai_chat_conversations table
   * 
   * This migration adds indexes on foreign key columns to speed up INSERT operations.
   * Can be called multiple times safely (uses IF NOT EXISTS).
   */
  addIndexes: publicProcedure
    .mutation(async () => {
      try {
        console.log('[Migrations API] Starting index migration...');
        await addPerformanceIndexes();
        console.log('[Migrations API] Index migration completed successfully');
        return {
          success: true,
          message: 'Performance indexes added successfully',
        };
      } catch (error: any) {
        console.error('[Migrations API] Migration failed:', error);
        return {
          success: false,
          message: `Migration failed: ${error.message}`,
          error: error.message,
        };
      }
    }),

  /**
   * Create evidence validation tables
   * 
   * This migration creates the Keepers of the Truth evidence validation system.
   * Can be called multiple times safely (uses IF NOT EXISTS).
   */
  createEvidenceTables: publicProcedure
    .mutation(async () => {
      try {
        console.log('[Migrations API] Starting evidence tables migration...');
        await createEvidenceTables();
        console.log('[Migrations API] Evidence tables migration completed successfully');
        return {
          success: true,
          message: 'Evidence validation tables created successfully',
        };
      } catch (error: any) {
        console.error('[Migrations API] Evidence migration failed:', error);
        return {
          success: false,
          message: `Migration failed: ${error.message}`,
          error: error.message,
        };
      }
    }),
});
