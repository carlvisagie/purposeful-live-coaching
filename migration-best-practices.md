# Safe Database Migration Best Practices

**Research Source:** hoop.dev/blog/managing-safe-schema-changes-in-production/

## Key Principles for Adding Columns to Production Database

### 1. **Use NULL-Friendly Designs**
- Add new columns as `NULL` initially to avoid full table rewrites
- Avoid `NOT NULL` constraints on initial deployment
- This prevents PostgreSQL from locking the entire table

### 2. **Phased Deployment Pattern**
1. **Phase 1:** Add the new column without using it (schema only)
2. **Phase 2:** Write to both old and new fields
3. **Phase 3:** Switch reads to new column after confirming write parity
4. **Phase 4:** Remove legacy field in separate migration

### 3. **Safe Migration Execution**
- Use `IF NOT EXISTS` checks to make migrations idempotent
- Backfill in small, throttled batches to keep load low
- Use online migrations when engine supports them
- Avoid blocking writes during migration

### 4. **Testing & Validation**
- Use staging environment with production-like datasets
- Validate data integrity before and after changes
- Automate checks for missing or malformed values
- Measure query performance (new indexes/wider rows affect execution)

### 5. **Monitoring During Migration**
- Monitor replication lag
- Track query latency
- Watch error rates during and after deployment
- If metrics drift, pause or roll back immediately

## Our Migration Script Analysis

Our `COMPLETE_DATABASE_MIGRATION.sql` follows best practices:

✅ Uses `IF NOT EXISTS` checks (idempotent)
✅ Adds columns as nullable (no table locks)
✅ Uses `DO $$` blocks for safe execution
✅ Includes verification queries at end

**Safe to execute:** YES

**Recommended execution method:**
1. Execute via Drizzle Kit (preferred - uses migration framework)
2. Execute via direct SQL (backup option - manual but safe)

## Decision: Use Drizzle Kit Migration

**Why:** 
- Drizzle Kit is designed for production migrations
- Tracks migration history
- Integrates with our existing schema
- Follows framework best practices

**Command:** `pnpm db:push`
