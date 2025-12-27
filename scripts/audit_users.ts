import { db } from "../server/db";
import { users, clients } from "../drizzle/schema";

async function auditUsers() {
  console.log("🔍 Auditing all users and clients...\n");
  
  // Get all users (auth accounts)
  const allUsers = await db.select().from(users).orderBy(users.createdAt);
  
  // Get all clients (coaching profiles)
  const allClients = await db.select().from(clients);
  
  const clientUserIds = new Set(allClients.map(c => c.userId));
  
  console.log(`📊 AUDIT RESULTS:`);
  console.log(`   Total auth accounts (users): ${allUsers.length}`);
  console.log(`   Total coaching clients: ${allClients.length}`);
  console.log(`   Accounts without client profiles: ${allUsers.length - allClients.length}\n`);
  
  // Find users without client profiles
  const usersWithoutProfiles = allUsers.filter(u => !clientUserIds.has(u.id));
  
  console.log(`⚠️  USERS WITHOUT CLIENT PROFILES (${usersWithoutProfiles.length}):\n`);
  usersWithoutProfiles.forEach((user, i) => {
    console.log(`${i + 1}. ${user.name || 'No name'} (${user.email || 'No email'})`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   OpenID: ${user.openId}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   Login Method: ${user.loginMethod || 'Unknown'}`);
    console.log("");
  });
  
  console.log(`\n✅ REAL CLIENTS (${allClients.length}):\n`);
  allClients.forEach((client, i) => {
    console.log(`${i + 1}. ${client.name || 'No name'} (${client.email || 'No email'})`);
    console.log(`   Client ID: ${client.id}`);
    console.log(`   User ID: ${client.userId}`);
    console.log(`   Profile Completeness: ${client.profileCompleteness || 0}%`);
    console.log(`   Primary Goal: ${client.primaryGoal || 'Not set'}`);
    console.log(`   Created: ${client.createdAt}`);
    console.log(`   Updated: ${client.updatedAt}`);
    console.log("");
  });
  
  process.exit(0);
}

auditUsers().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
