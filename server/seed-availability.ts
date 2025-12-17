/**
 * One-time database seed for coach availability
 * Runs automatically on server startup if no availability exists
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { coaches, coachAvailability } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function seedCoachAvailability(force: boolean = false) {
  if (!process.env.DATABASE_URL) {
    console.log("[Seed] DATABASE_URL not set, skipping seed");
    return { success: false, message: "DATABASE_URL not set", skipped: true };
  }

  // Create a dedicated connection for seeding (same pattern as migrations)
  let seedClient: postgres.Sql | null = null;
  
  try {
    console.log("[Seed] Checking if coach availability needs to be seeded...");
    console.log("[Seed] Creating dedicated database connection for seeding...");
    
    seedClient = postgres(process.env.DATABASE_URL, {
      max: 1,
      ssl: 'require',
      connect_timeout: 30,
      idle_timeout: 10,
    });
    
    const db = drizzle(seedClient);
    console.log("[Seed] Database connection created");
    
    // Check if availability already exists
    console.log("[Seed] Querying existing availability...");
    const existing = await db
      .select()
      .from(coachAvailability)
      .limit(1);
    console.log("[Seed] Query complete, found:", existing.length, "records");
    
    if (existing.length > 0 && !force) {
      console.log("[Seed] Coach availability already exists, skipping seed");
      await seedClient.end();
      return { success: true, message: "Availability already exists", skipped: true };
    }
    
    if (force) {
      console.log("[Seed] Force flag set, deleting existing availability...");
      await db.delete(coachAvailability).where(eq(coachAvailability.coachId, 1));
      console.log("[Seed] Existing availability deleted");
    }
    
    console.log("[Seed] Seeding coach availability...");
    
    // Ensure coach exists
    console.log("[Seed] Checking for existing coach...");
    const existingCoach = await db
      .select()
      .from(coaches)
      .where(eq(coaches.id, 1))
      .limit(1);
    console.log("[Seed] Coach query complete, found:", existingCoach.length, "coaches");
    
    if (existingCoach.length === 0) {
      console.log("[Seed] Creating default coach (ID: 1)...");
      await db.insert(coaches).values({
        id: 1,
        name: "Carl Visagie",
        email: "carl@purposefullive.com",
        bio: "Professional Life Coach specializing in holistic wellness and personal transformation",
        specialties: "Emotional Wellness, Mental Health, Physical Fitness, Nutrition, Spiritual Wellness",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("[Seed] ✅ Coach created");
    }
    
    // Create availability with correct schedule
    // Weekdays (Mon-Fri): 19:45 - 21:55 (7:45 PM - 9:55 PM)
    // Weekends (Sat-Sun): 10:30 - 16:30 (10:30 AM - 4:30 PM)
    console.log("[Seed] Creating availability slots...");
    const availabilitySlots = [
      // Monday (1)
      { coachId: 1, dayOfWeek: 1, startTime: "19:45", endTime: "21:55", isActive: true },
      // Tuesday (2)
      { coachId: 1, dayOfWeek: 2, startTime: "19:45", endTime: "21:55", isActive: true },
      // Wednesday (3)
      { coachId: 1, dayOfWeek: 3, startTime: "19:45", endTime: "21:55", isActive: true },
      // Thursday (4)
      { coachId: 1, dayOfWeek: 4, startTime: "19:45", endTime: "21:55", isActive: true },
      // Friday (5)
      { coachId: 1, dayOfWeek: 5, startTime: "19:45", endTime: "21:55", isActive: true },
      // Saturday (6)
      { coachId: 1, dayOfWeek: 6, startTime: "10:30", endTime: "16:30", isActive: true },
      // Sunday (0)
      { coachId: 1, dayOfWeek: 0, startTime: "10:30", endTime: "16:30", isActive: true },
    ];
    
    for (let i = 0; i < availabilitySlots.length; i++) {
      const slot = availabilitySlots[i];
      console.log(`[Seed] Creating slot ${i + 1}/7 for day ${slot.dayOfWeek}...`);
      await db.insert(coachAvailability).values({
        ...slot,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    console.log("[Seed] ✅ Created 7 availability slots");
    console.log("[Seed]    Weekdays (Mon-Fri): 19:45 - 21:55");
    console.log("[Seed]    Weekends (Sat-Sun): 10:30 - 16:30");
    console.log("[Seed] ✅ Booking system is now ready!");
    
    // Close the dedicated connection
    console.log("[Seed] Closing database connection...");
    await seedClient.end();
    console.log("[Seed] Database connection closed");
    
    return { 
      success: true, 
      message: "Availability seeded successfully", 
      slotsCreated: 7,
      schedule: {
        weekdays: "19:45 - 21:55",
        weekends: "10:30 - 16:30"
      }
    };
    
  } catch (error) {
    console.error("[Seed] Failed to seed coach availability:", error);
    console.error("[Seed] Error stack:", error instanceof Error ? error.stack : "No stack");
    
    // Make sure to close the connection on error
    if (seedClient) {
      try {
        await seedClient.end();
        console.log("[Seed] Database connection closed after error");
      } catch (closeError) {
        console.error("[Seed] Failed to close connection:", closeError);
      }
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error",
      error: true
    };
  }
}
