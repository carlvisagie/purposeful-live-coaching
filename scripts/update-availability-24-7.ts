/**
 * Update coach availability to 24/7 in production database
 * Run this ONCE to fix same-day booking
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { coachAvailability } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function updateAvailability() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL, {
    max: 1,
    ssl: 'require',
  });
  
  const db = drizzle(client);
  
  try {
    console.log("🔄 Updating coach availability to 24/7...");
    
    // Update all days to 00:00 - 23:59
    for (let day = 0; day <= 6; day++) {
      const result = await db
        .update(coachAvailability)
        .set({
          startTime: "00:00",
          endTime: "23:59",
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(coachAvailability.dayOfWeek, day));
      
      const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];
      console.log(`✅ Updated ${dayName} to 00:00 - 23:59`);
    }
    
    console.log("✅ ALL DAYS NOW AVAILABLE 24/7");
    console.log("✅ Same-day booking is now enabled!");
    
  } catch (error) {
    console.error("❌ Failed to update availability:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

updateAvailability();
