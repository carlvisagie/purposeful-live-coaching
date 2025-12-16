/**
 * Health check endpoint to verify database and seeding status
 */

import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { coachAvailability } from "../../drizzle/schema";

export const healthRouter = router({
  check: publicProcedure.query(async () => {
    const db = await getDb();
    
    if (!db) {
      return {
        status: "error",
        message: "Database connection failed",
        dbConnected: false,
        tablesExist: false,
        availabilityCount: 0
      };
    }

    try {
      // Try to query coach availability table
      const availability = await db.select().from(coachAvailability).limit(10);
      
      return {
        status: "ok",
        message: "Database connected and tables exist",
        dbConnected: true,
        tablesExist: true,
        availabilityCount: availability.length,
        sampleData: availability.map(a => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
          isActive: a.isActive
        }))
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error.message,
        dbConnected: true,
        tablesExist: false,
        availabilityCount: 0
      };
    }
  })
});
