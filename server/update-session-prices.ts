/**
 * One-time script to update session prices in the database
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sessionTypes } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function updateSessionPrices() {
  if (!process.env.DATABASE_URL) {
    console.log("[UpdatePrices] DATABASE_URL not set");
    return { success: false, message: "DATABASE_URL not set" };
  }

  let client: postgres.Sql | null = null;
  
  try {
    console.log("[UpdatePrices] Connecting to database...");
    
    client = postgres(process.env.DATABASE_URL, {
      max: 1,
      ssl: 'require',
      connect_timeout: 30,
    });
    
    const db = drizzle(client);
    console.log("[UpdatePrices] Connected");
    
    // Update Initial Consultation to $175
    await db.update(sessionTypes)
      .set({ price: 17500 })
      .where(eq(sessionTypes.name, "Initial Consultation"));
    console.log("[UpdatePrices] ✅ Initial Consultation updated to $175");
    
    // Update Follow-up Session to $125
    await db.update(sessionTypes)
      .set({ price: 12500 })
      .where(eq(sessionTypes.name, "Follow-up Session"));
    console.log("[UpdatePrices] ✅ Follow-up Session updated to $125");
    
    // Update Deep Dive Session to $250 (and rename)
    await db.update(sessionTypes)
      .set({ price: 25000, name: "Deep Dive Intensive" })
      .where(eq(sessionTypes.name, "Deep Dive Session"));
    console.log("[UpdatePrices] ✅ Deep Dive Intensive updated to $250");
    
    // Also update Quick Check-in if it exists
    await db.update(sessionTypes)
      .set({ price: 7500 })
      .where(eq(sessionTypes.name, "Quick Check-in"));
    console.log("[UpdatePrices] ✅ Quick Check-in updated to $75 (if exists)");
    
    await client.end();
    console.log("[UpdatePrices] ✅ All prices updated successfully!");
    
    return { success: true, message: "Prices updated" };
    
  } catch (error) {
    console.error("[UpdatePrices] Error:", error);
    if (client) await client.end();
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}
