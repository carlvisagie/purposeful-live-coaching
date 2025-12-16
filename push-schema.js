/**
 * Push schema directly to database using drizzle-kit push
 * This bypasses migrations and directly syncs the schema
 */

const { execSync } = require('child_process');

console.log('[Schema Push] Starting direct schema push to database...');

try {
  // Run drizzle-kit push which directly syncs schema to database
  execSync('npx drizzle-kit push', {
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('[Schema Push] ✅ Schema pushed successfully!');
  console.log('[Schema Push] All tables should now exist in database');
  
} catch (error) {
  console.error('[Schema Push] ❌ Failed to push schema:', error.message);
  process.exit(1);
}
