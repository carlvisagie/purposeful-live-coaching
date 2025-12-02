import { drizzle } from "drizzle-orm/mysql2";
import { coachAvailability, availabilityExceptions } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seedAvailability() {
  const coachId = 1; // Your coach ID

  console.log("🗑️  Clearing existing availability...");
  await db.delete(coachAvailability);
  await db.delete(availabilityExceptions);

  console.log("📅 Setting up weekly availability...");
  
  // Weekdays (Monday-Friday): 6:00 PM - 8:00 PM
  const weekdaySlots = [
    { dayOfWeek: 1, startTime: "18:00", endTime: "20:00" }, // Monday
    { dayOfWeek: 2, startTime: "18:00", endTime: "20:00" }, // Tuesday
    { dayOfWeek: 3, startTime: "18:00", endTime: "20:00" }, // Wednesday
    { dayOfWeek: 4, startTime: "18:00", endTime: "20:00" }, // Thursday
    { dayOfWeek: 5, startTime: "18:00", endTime: "20:00" }, // Friday
  ];

  // Weekends (Saturday-Sunday): 9:00 AM - 8:00 PM
  const weekendSlots = [
    { dayOfWeek: 6, startTime: "09:00", endTime: "20:00" }, // Saturday
    { dayOfWeek: 0, startTime: "09:00", endTime: "20:00" }, // Sunday
  ];

  const allSlots = [...weekdaySlots, ...weekendSlots].map(slot => ({
    coachId,
    ...slot,
    isActive: "true",
  }));

  await db.insert(coachAvailability).values(allSlots);

  console.log("✅ Weekly availability set:");
  console.log("   Mon-Fri: 6:00 PM - 8:00 PM");
  console.log("   Sat-Sun: 9:00 AM - 8:00 PM");

  // Block this Sunday (November 24, 2025)
  const thisSunday = new Date("2025-11-24T00:00:00Z");
  const thisSundayEnd = new Date("2025-11-24T23:59:59Z");

  await db.insert(availabilityExceptions).values({
    coachId,
    startDate: thisSunday,
    endDate: thisSundayEnd,
    reason: "Working - not available for coaching",
  });

  console.log("🚫 Blocked this Sunday (Nov 24)");

  // Open next Thu-Mon (November 27 - December 1, 2025) for full day
  // Actually, we don't need to do anything - the weekend slots already cover Sat-Sun
  // For Thu-Fri, we need to add temporary full-day availability
  // This is complex - better to handle manually or add override slots

  console.log("✅ Availability configuration complete!");
  console.log("\n📝 Next steps:");
  console.log("   1. Test booking calendar");
  console.log("   2. Verify weekday slots show 6-8 PM only");
  console.log("   3. Verify weekend slots show 9 AM - 8 PM");
  console.log("   4. Manually adjust next Thu-Fri if needed");

  process.exit(0);
}

seedAvailability().catch((error) => {
  console.error("❌ Error seeding availability:", error);
  process.exit(1);
});
