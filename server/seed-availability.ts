/**
 * One-time database seed for coach availability
 * Runs automatically on server startup if no availability exists
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, coaches, coachAvailability, sessionTypes } from "../drizzle/schema";
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
    
    // First, ensure we have a user for the coach
    console.log("[Seed] Checking for existing coach user...");
    let coachUserId: number;
    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "carl@purposefullive.com"))
      .limit(1);
    
    if (existingUser.length === 0) {
      console.log("[Seed] Creating coach user...");
      const [newUser] = await db.insert(users).values({
        openId: "coach_carl_" + Date.now(), // Unique openId
        name: "Carl Visagie",
        email: "carl@purposefullive.com",
        role: "coach",
      }).returning();
      coachUserId = newUser.id;
      console.log("[Seed] ✅ Coach user created with ID:", coachUserId);
    } else {
      coachUserId = existingUser[0].id;
      console.log("[Seed] Found existing coach user with ID:", coachUserId);
    }
    
    // Now ensure coach record exists
    console.log("[Seed] Checking for existing coach record...");
    const existingCoach = await db
      .select()
      .from(coaches)
      .where(eq(coaches.userId, coachUserId))
      .limit(1);
    
    let coachId: number;
    
    if (existingCoach.length === 0) {
      console.log("[Seed] Creating coach record...");
      const [newCoach] = await db.insert(coaches).values({
        userId: coachUserId,
        specialization: "Holistic Wellness, Personal Transformation",
        bio: "Professional Life Coach specializing in holistic wellness and personal transformation. Trained in evidence-based coaching methods.",
        certifications: "ICF Certified Coach, NLP Practitioner",
        yearsExperience: 10,
        isActive: "active",
      }).returning();
      coachId = newCoach.id;
      console.log("[Seed] ✅ Coach record created with ID:", coachId);
    } else {
      coachId = existingCoach[0].id;
      console.log("[Seed] Found existing coach record with ID:", coachId);
    }
    
    // Create availability with correct schedule
    // Weekdays (Mon-Fri): 19:45 - 21:55 (7:45 PM - 9:55 PM)
    // Weekends (Sat-Sun): 10:30 - 16:30 (10:30 AM - 4:30 PM)
    console.log("[Seed] Creating availability slots for coach ID:", coachId);
    const availabilitySlots = [
      // Monday (1)
      { coachId, dayOfWeek: 1, startTime: "19:45", endTime: "21:55", isActive: true },
      // Tuesday (2)
      { coachId, dayOfWeek: 2, startTime: "19:45", endTime: "21:55", isActive: true },
      // Wednesday (3)
      { coachId, dayOfWeek: 3, startTime: "19:45", endTime: "21:55", isActive: true },
      // Thursday (4)
      { coachId, dayOfWeek: 4, startTime: "19:45", endTime: "21:55", isActive: true },
      // Friday (5)
      { coachId, dayOfWeek: 5, startTime: "19:45", endTime: "21:55", isActive: true },
      // Saturday (6)
      { coachId, dayOfWeek: 6, startTime: "10:30", endTime: "16:30", isActive: true },
      // Sunday (0)
      { coachId, dayOfWeek: 0, startTime: "10:30", endTime: "16:30", isActive: true },
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
    
    // Seed session types
    console.log("[Seed] Checking for existing session types...");
    const existingSessionTypes = await db
      .select()
      .from(sessionTypes)
      .where(eq(sessionTypes.coachId, coachId))
      .limit(1);
    
    if (existingSessionTypes.length === 0) {
      console.log("[Seed] Creating session types...");
      
      // Create session types for the coach
      const sessionTypeData = [
        {
          coachId,
          name: "Initial Consultation",
          description: "60-minute discovery session to understand your goals and create a personalized coaching plan.",
          duration: 60,
          price: 9900, // $99.00
          isActive: "active",
          displayOrder: 1,
        },
        {
          coachId,
          name: "Follow-up Session",
          description: "45-minute coaching session to continue your transformation journey.",
          duration: 45,
          price: 7500, // $75.00
          isActive: "active",
          displayOrder: 2,
        },
        {
          coachId,
          name: "Deep Dive Session",
          description: "90-minute intensive session for breakthrough work on specific challenges.",
          duration: 90,
          price: 14900, // $149.00
          isActive: "active",
          displayOrder: 3,
        },
      ];
      
      for (const sessionType of sessionTypeData) {
        await db.insert(sessionTypes).values(sessionType);
        console.log(`[Seed] ✅ Created session type: ${sessionType.name}`);
      }
      
      console.log("[Seed] ✅ Created 3 session types");
    } else {
      console.log("[Seed] Session types already exist, skipping");
    }
    
    console.log("[Seed] ✅ Booking system is now ready!");
    
    // Close the dedicated connection
    console.log("[Seed] Closing database connection...");
    await seedClient.end();
    console.log("[Seed] Database connection closed");
    
    return { 
      success: true, 
      message: "Availability seeded successfully", 
      coachId,
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
