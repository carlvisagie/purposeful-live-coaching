/**
 * Seed Coach Data
 * Creates Carl and Besarta as coaches in the database
 */

import { db } from "../db";
import { users, coaches } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function seedCoaches() {
  console.log("[Migration] Seeding coach data...");

  try {
    // Create Carl's user account
    let carlUser = await db.query.users.findFirst({
      where: eq(users.email, "carlhvisagie@yahoo.com"),
    });

    if (!carlUser) {
      const [newCarl] = await db.insert(users).values({
        openId: "coach_carl_001",
        name: "Carl Visagie",
        email: "carlhvisagie@yahoo.com",
        loginMethod: "admin",
        role: "coach",
      }).returning();
      carlUser = newCarl;
      console.log("[Migration] Created Carl's user account");
    }

    // Create Besarta's user account
    let besartaUser = await db.query.users.findFirst({
      where: eq(users.email, "besarta@purposefullivecoaching.com"),
    });

    if (!besartaUser) {
      const [newBesarta] = await db.insert(users).values({
        openId: "coach_besarta_001",
        name: "Besarta",
        email: "besarta@purposefullivecoaching.com",
        loginMethod: "admin",
        role: "coach",
      }).returning();
      besartaUser = newBesarta;
      console.log("[Migration] Created Besarta's user account");
    }

    // Create Carl as coach (coachId = 1)
    const existingCarlCoach = await db.query.coaches.findFirst({
      where: eq(coaches.userId, carlUser.id),
    });

    if (!existingCarlCoach) {
      await db.insert(coaches).values({
        userId: carlUser.id,
        specialization: "Life Coach",
        bio: "Transformational life coach specializing in personal development and goal achievement",
        certifications: "Certified Life Coach",
        yearsExperience: 10,
        isActive: "active",
      });
      console.log("[Migration] Created Carl as coach");
    }

    // Create Besarta as coach (coachId = 2)
    const existingBesartaCoach = await db.query.coaches.findFirst({
      where: eq(coaches.userId, besartaUser.id),
    });

    if (!existingBesartaCoach) {
      await db.insert(coaches).values({
        userId: besartaUser.id,
        specialization: "Wellness Coach",
        bio: "Holistic wellness coach focusing on mind-body connection and healthy lifestyle habits",
        certifications: "Certified Wellness Coach",
        yearsExperience: 8,
        isActive: "active",
      });
      console.log("[Migration] Created Besarta as coach");
    }

    console.log("[Migration] ✅ Coach data seeded successfully");
  } catch (error) {
    console.error("[Migration] ❌ Error seeding coaches:", error);
    throw error;
  }
}
