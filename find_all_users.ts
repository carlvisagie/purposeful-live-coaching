import { db } from "./server/db";
import { users } from "./drizzle/schema";
import { sql } from "drizzle-orm";

async function findAllUsers() {
  console.log("🔍 Finding all users in database...\n");
  
  // Get total count
  const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
  const totalUsers = countResult.rows[0]?.count || 0;
  console.log(`📊 Total users in database: ${totalUsers}\n`);
  
  // Get all users
  const allUsers = await db.select().from(users).orderBy(users.createdAt);
  
  console.log("👥 All Users:\n");
  allUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name || 'No name'} (${user.email || 'No email'})`);
    console.log(`   ID: ${user.id}`);
    console.log(`   OpenID: ${user.openId}`);
    console.log(`   Role: ${user.role || 'No role'}`);
    console.log(`   Login Method: ${user.loginMethod || 'Unknown'}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   Profile Completeness: ${user.profileCompleteness || 0}%`);
    console.log("");
  });
  
  // Group by login method
  const byLoginMethod: Record<string, number> = {};
  allUsers.forEach(user => {
    const method = user.loginMethod || 'Unknown';
    byLoginMethod[method] = (byLoginMethod[method] || 0) + 1;
  });
  
  console.log("\n📈 Users by Login Method:");
  Object.entries(byLoginMethod).forEach(([method, count]) => {
    console.log(`   ${method}: ${count}`);
  });
  
  // Find suspicious accounts
  console.log("\n⚠️  Suspicious Accounts (no email, no name, or incomplete):");
  const suspicious = allUsers.filter(u => !u.email || !u.name || (u.profileCompleteness || 0) < 10);
  console.log(`   Found ${suspicious.length} suspicious accounts`);
  suspicious.forEach(user => {
    console.log(`   - ${user.name || 'No name'} (${user.email || 'No email'}) - ID: ${user.id}`);
  });
  
  process.exit(0);
}

findAllUsers().catch(console.error);
