/**
 * Trial Signup - Capture email before trial access
 */

import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, clients, coaches } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const trialSignupRouter = router({
  /**
   * Update user with email and name from trial signup form
   */
  updateTrialUser: publicProcedure
    .input(
      z.object({
        anonymousId: z.string(),
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Find user by anonymous ID
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.openId, input.anonymousId))
        .limit(1);

      if (existingUser) {
        // Update existing user with email and name
        await db
          .update(users)
          .set({
            name: input.name,
            email: input.email,
            loginMethod: "email",
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser.id));

        // Create unified client profile if it doesn't exist
        const existingClient = await db
          .select()
          .from(clients)
          .where(eq(clients.userId, existingUser.id))
          .limit(1);

        if (existingClient.length === 0) {
          // Get default coach (owner)
          const [defaultCoach] = await db
            .select()
            .from(coaches)
            .limit(1);

          if (defaultCoach) {
            await db.insert(clients).values({
              coachId: defaultCoach.id,
              userId: existingUser.id,
              name: input.name,
              email: input.email,
              status: "active",
              goals: "AI Coaching Trial",
            });
          }
        }

        return { success: true, userId: existingUser.id };
      }

      // Create new user with email
      const [newUser] = await db
        .insert(users)
        .values({
          openId: input.anonymousId,
          name: input.name,
          email: input.email,
          role: "user",
          loginMethod: "email",
        })
        .returning();

      // Create unified client profile
      const [defaultCoach] = await db
        .select()
        .from(coaches)
        .limit(1);

      if (defaultCoach) {
        await db.insert(clients).values({
          coachId: defaultCoach.id,
          userId: newUser.id,
          name: input.name,
          email: input.email,
          status: "active",
          goals: "AI Coaching Trial",
        });
      }

      return { success: true, userId: newUser.id };
    }),
});
