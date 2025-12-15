/**
 * One-time database seed for coach availability
 * Runs automatically on server startup if no availability exists
 */

import { db } from "./db";
import { coaches, coachAvailability } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function seedCoachAvailability() {
  try {
    console.log("[Seed] Checking if coach availability needs to be seeded...");
    
    // Check if availability already exists
    const existing = await db
      .select()
      .from(coachAvailability)
      .limit(1);
    
    if (existing.length > 0) {
      console.log("[Seed] Coach availability already exists, skipping seed");
      return;
    }
    
    console.log("[Seed] No availability found, seeding default data...");
    
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
    
    // Create default availability (Monday-Friday, 9 AM - 5 PM)
    console.log("[Seed] Creating availability slots...");
    const availabilitySlots = [
      { coachId: 1, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: true },
      { coachId: 1, dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: true },
      { coachId: 1, dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isActive: true },
      { coachId: 1, dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: true },
      { coachId: 1, dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isActive: true },
    ];
    
    for (const slot of availabilitySlots) {
      await db.insert(coachAvailability).values({
        ...slot,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    console.log("[Seed] ✅ Created 5 availability slots (Mon-Fri, 9 AM - 5 PM)");
    console.log("[Seed] ✅ Booking system is now ready!");
    
  } catch (error) {
    console.error("[Seed] Failed to seed coach availability:", error);
    // Don't throw - let the server start anyway
  }
}
