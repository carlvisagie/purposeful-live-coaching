import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { users, clients, coaches, sessions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

/**
 * Zapier booking handler - Simple endpoint for Zapier to send Calendly bookings
 * 
 * Zapier will send:
 * - name: Invitee name
 * - email: Invitee email  
 * - scheduledDate: Booking date/time (ISO string)
 * - duration: Meeting duration in minutes (optional, default 60)
 */
export const zapierBookingRouter = router({
  /**
   * Create booking from Zapier
   * This is called by Zapier when a Calendly booking is made
   */
  createBooking: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      scheduledDate: z.string(), // ISO date string
      duration: z.number().optional().default(60),
      eventName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { name, email, scheduledDate, duration, eventName } = input;
        
        console.log(`[Zapier Booking] Processing booking for ${name} (${email}) at ${scheduledDate}`);
        
        // Parse the scheduled date
        const bookingDate = new Date(scheduledDate);
        if (isNaN(bookingDate.getTime())) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid scheduledDate format",
          });
        }
        
        // Find or create user
        let user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        
        if (!user) {
          console.log(`[Zapier Booking] Creating new user for ${email}`);
          const [newUser] = await db.insert(users).values({
            openId: `zapier_${Date.now()}`,
            email: email,
            name: name,
            loginMethod: "calendly_booking",
            role: "client",
          }).returning();
          user = newUser;
          console.log(`[Zapier Booking] ✅ Created user ${user.id}`);
        } else {
          console.log(`[Zapier Booking] Found existing user ${user.id}`);
        }
        
        // Get default coach (Carl)
        const defaultCoach = await db.query.coaches.findFirst();
        if (!defaultCoach) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No default coach found",
          });
        }
        
        // Find or create client profile
        let client = await db.query.clients.findFirst({
          where: eq(clients.email, email),
        });
        
        if (!client) {
          console.log(`[Zapier Booking] Creating client profile for ${email}`);
          const [newClient] = await db.insert(clients).values({
            userId: user.id,
            coachId: defaultCoach.id,
            name: name,
            email: email,
            status: "active",
            goals: "Free Discovery Call (Calendly)",
            startDate: new Date(),
          }).returning();
          client = newClient;
          console.log(`[Zapier Booking] ✅ Created client ${client.id}`);
        } else {
          console.log(`[Zapier Booking] Found existing client ${client.id}`);
          
          // Update to link to user if not already linked
          if (!client.userId) {
            await db.update(clients)
              .set({ userId: user.id })
              .where(eq(clients.id, client.id));
            console.log(`[Zapier Booking] ✅ Linked client ${client.id} to user ${user.id}`);
          }
        }
        
        // Create session record
        const [newSession] = await db.insert(sessions).values({
          coachId: defaultCoach.id,
          clientId: client.id,
          scheduledDate: bookingDate,
          duration: duration,
          sessionType: eventName || "Free Discovery Call",
          status: "scheduled",
          paymentStatus: "free",
          notes: `Booked via Calendly (Zapier) - ${email}`,
        }).returning();
        
        console.log(`[Zapier Booking] ✅ Created session ${newSession.id} for ${bookingDate.toISOString()}`);
        
        return {
          success: true,
          userId: user.id,
          clientId: client.id,
          sessionId: newSession.id,
          message: "Booking created successfully",
        };
        
      } catch (error: any) {
        console.error("[Zapier Booking] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Zapier booking processing failed: ${error.message}`,
        });
      }
    }),
});
