/**
 * One-time database seed for coach availability
 * Runs automatically on server startup if no availability exists
 */

import { db } from "./db";
import { coaches, coachAvailability } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function seedCoachAvailability(force: boolean = false) {
  try {
    console.log("[Seed] Checking if coach availability needs to be seeded...");
    
    // Check if availability already exists
    const existing = await db
      .select()
      .from(coachAvailability)
      .limit(1);
    
    if (existing.length > 0 && !force) {
      console.log("[Seed] Coach availability already exists, skipping seed");
      return { success: true, message: "Availability already exists", skipped: true };
    }
    
    if (force) {
      console.log("[Seed] Force flag set, deleting existing availability...");
      await db.delete(coachAvailability).where(eq(coachAvailability.coachId, 1));
    }
    
    console.log("[Seed] Seeding coach availability...");
    
    // Ensure coach exists
    const existingCoach = await db
      .select()
      .from(coaches)
      .where(eq(coaches.id, 1))
      .limit(1);
    
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
    // Weekdays (Mon-Fri): 19:45 - 21:45 (7:45 PM - 9:45 PM)
    // Weekends (Sat-Sun): 09:00 - 16:30 (9:00 AM - 4:30 PM)
    console.log("[Seed] Creating availability slots...");
    const availabilitySlots = [
      // Monday (1)
      { coachId: 1, dayOfWeek: 1, startTime: "19:45", endTime: "21:45", isActive: true },
      // Tuesday (2)
      { coachId: 1, dayOfWeek: 2, startTime: "19:45", endTime: "21:45", isActive: true },
      // Wednesday (3)
      { coachId: 1, dayOfWeek: 3, startTime: "19:45", endTime: "21:45", isActive: true },
      // Thursday (4)
      { coachId: 1, dayOfWeek: 4, startTime: "19:45", endTime: "21:45", isActive: true },
      // Friday (5)
      { coachId: 1, dayOfWeek: 5, startTime: "19:45", endTime: "21:45", isActive: true },
      // Saturday (6)
      { coachId: 1, dayOfWeek: 6, startTime: "09:00", endTime: "16:30", isActive: true },
      // Sunday (0)
      { coachId: 1, dayOfWeek: 0, startTime: "09:00", endTime: "16:30", isActive: true },
    ];
    
    for (const slot of availabilitySlots) {
      await db.insert(coachAvailability).values({
        ...slot,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    console.log("[Seed] ✅ Created 7 availability slots");
    console.log("[Seed]    Weekdays (Mon-Fri): 19:45 - 21:45");
    console.log("[Seed]    Weekends (Sat-Sun): 09:00 - 16:30");
    console.log("[Seed] ✅ Booking system is now ready!");
    
    return { 
      success: true, 
      message: "Availability seeded successfully", 
      slotsCreated: 7,
      schedule: {
        weekdays: "19:45 - 21:45",
        weekends: "09:00 - 16:30"
      }
    };
    
  } catch (error) {
    console.error("[Seed] Failed to seed coach availability:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error",
      error: true
    };
  }
}
