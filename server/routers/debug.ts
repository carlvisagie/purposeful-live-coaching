/**
 * Debug endpoints to check database state
 */

import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { coachAvailability, coaches, sessions } from "../../drizzle/schema";

export const debugRouter = router({
  /**
   * Check if database tables exist and have data
   */
  checkDatabase: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        return {
          status: "error",
          message: "Database connection failed",
        };
      }

      // Check coaches table
      let coachesCount = 0;
      try {
        const coachesData = await db.select().from(coaches).limit(5);
        coachesCount = coachesData.length;
      } catch (error: any) {
        return {
          status: "error",
          table: "coaches",
          message: error.message,
        };
      }

      // Check coachAvailability table
      let availabilityCount = 0;
      let availabilityData: any[] = [];
      try {
        availabilityData = await db.select().from(coachAvailability).limit(10);
        availabilityCount = availabilityData.length;
      } catch (error: any) {
        return {
          status: "error",
          table: "coachAvailability",
          message: error.message,
        };
      }

      // Check sessions table
      let sessionsCount = 0;
      try {
        const sessionsData = await db.select().from(sessions).limit(5);
        sessionsCount = sessionsData.length;
      } catch (error: any) {
        return {
          status: "error",
          table: "sessions",
          message: error.message,
        };
      }

      return {
        status: "success",
        tables: {
          coaches: {
            count: coachesCount,
            exists: true,
          },
          coachAvailability: {
            count: availabilityCount,
            exists: true,
            sample: availabilityData.slice(0, 3),
          },
          sessions: {
            count: sessionsCount,
            exists: true,
          },
        },
        message: availabilityCount === 0 
          ? "⚠️ Tables exist but coachAvailability is EMPTY - auto-seed did not run!"
          : "✅ All tables exist and have data",
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Unexpected error: ${error.message}`,
        stack: error.stack,
      };
    }
  }),
});
