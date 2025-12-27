/**
 * Simple Booking Router - FIXED VERSION
 * 
 * Uses the EXISTING sessions table so bookings show in Control Center.
 * No external apps, no complex logic, just works.
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { sessions, coaches, clients, users } from "../../drizzle/schema";
import { eq, and, gte, lte, between } from "drizzle-orm";

export const simpleBookingRouter = router({
  /**
   * Get available time slots for a coach on a specific date
   * PUBLIC - anyone can see available slots
   */
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        date: z.string(), // YYYY-MM-DD format
        duration: z.number().default(60), // Default 60 minutes
      })
    )
    .query(async ({ input }) => {
      try {
        const { coachId, date, duration } = input;

        console.log('[SimpleBooking] getAvailableSlots:', { coachId, date, duration });

        // Parse the date
        const targetDate = new Date(date + 'T00:00:00Z');
        const dayStart = new Date(date + 'T00:00:00Z');
        const dayEnd = new Date(date + 'T23:59:59Z');

        // Get existing bookings for this date
        const existingBookings = await db.query.sessions.findMany({
          where: and(
            eq(sessions.coachId, coachId),
            gte(sessions.scheduledDate, dayStart),
            lte(sessions.scheduledDate, dayEnd),
            eq(sessions.status, 'scheduled')
          ),
        });

        console.log('[SimpleBooking] Found existing bookings:', existingBookings.length);

        // Generate time slots (24/7 in 30-minute intervals)
        const slots: string[] = [];
        // TESTING MODE: Allow all slots (no time restriction)
        // const now = new Date();
        // const minimumBookingTime = new Date(now.getTime() + 3 * 60000);

        for (let hour = 0; hour < 24; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const slotTime = new Date(date + `T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`);
            const slotEnd = new Date(slotTime.getTime() + duration * 60000);

            // TESTING MODE: Skip time check
            // if (slotTime < minimumBookingTime) continue;

            // Check if slot conflicts with existing booking
            const hasConflict = existingBookings.some(booking => {
              const bookingStart = new Date(booking.scheduledDate);
              const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);

              return (
                (slotTime >= bookingStart && slotTime < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotTime <= bookingStart && slotEnd >= bookingEnd)
              );
            });

            if (!hasConflict) {
              slots.push(slotTime.toISOString());
            }
          }
        }

        console.log('[SimpleBooking] Generated slots:', slots.length);
        return { slots };
      } catch (error) {
        console.error('[SimpleBooking] ERROR in getAvailableSlots:', error);
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }),

  /**
   * Book a session
   * PUBLIC - anyone can book
   */
  bookSession: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        clientName: z.string().min(1),
        clientEmail: z.string().email(),
        clientPhone: z.string().optional(),
        bookingDateTime: z.string(), // ISO string
        duration: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[SimpleBooking] bookSession:', input);

      const bookingTime = new Date(input.bookingDateTime);
      const bookingEnd = new Date(bookingTime.getTime() + input.duration * 60000);

      // Check if slot is still available
      const conflictingBookings = await db.query.sessions.findMany({
        where: and(
          eq(sessions.coachId, input.coachId),
          eq(sessions.status, 'scheduled'),
          gte(sessions.scheduledDate, new Date(bookingTime.getTime() - 24 * 60 * 60 * 1000)), // Within 24 hours
          lte(sessions.scheduledDate, new Date(bookingTime.getTime() + 24 * 60 * 60 * 1000))
        ),
      });

      // Check for actual time conflicts
      const hasConflict = conflictingBookings.some(booking => {
        const bookingStart = new Date(booking.scheduledDate);
        const bookingEndTime = new Date(bookingStart.getTime() + booking.duration * 60000);
        
        return (
          (bookingTime >= bookingStart && bookingTime < bookingEndTime) ||
          (bookingEnd > bookingStart && bookingEnd <= bookingEndTime) ||
          (bookingTime <= bookingStart && bookingEnd >= bookingEndTime)
        );
      });

      if (hasConflict) {
        throw new TRPCError({ code: "CONFLICT", message: "This time slot is no longer available" });
      }

      // Find or create user
      let user = await db.query.users.findFirst({
        where: eq(users.email, input.clientEmail),
      });

      if (!user) {
        const [newUser] = await db.insert(users).values({
          openId: `booking_${Date.now()}`,
          email: input.clientEmail,
          name: input.clientName,
          loginMethod: "simple_booking",
          role: "client",
        }).returning();
        user = newUser;
        console.log('[SimpleBooking] Created user:', user.id);
      }

      // Find or create client
      let client = await db.query.clients.findFirst({
        where: eq(clients.email, input.clientEmail),
      });

      if (!client) {
        const [newClient] = await db.insert(clients).values({
          userId: user.id,
          coachId: input.coachId,
          name: input.clientName,
          email: input.clientEmail,
          phone: input.clientPhone,
          status: "active",
          goals: "Free Discovery Call",
          startDate: new Date(),
        }).returning();
        client = newClient;
        console.log('[SimpleBooking] Created client:', client.id);
      }

      // Create session
      const [newSession] = await db.insert(sessions).values({
        coachId: input.coachId,
        clientId: client.id,
        scheduledDate: bookingTime,
        duration: input.duration,
        sessionType: "Free Discovery Call",
        status: "scheduled",
        paymentStatus: "free",
        notes: input.notes || `Booked by ${input.clientName} (${input.clientEmail})`,
      }).returning();

      console.log('[SimpleBooking] Booking created:', newSession.id);

      return {
        success: true,
        bookingId: newSession.id,
        message: "Booking confirmed! You'll receive a confirmation email shortly.",
      };
    }),

  /**
   * Get coach bookings
   * PROTECTED - coach only
   */
  getCoachBookings: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = [eq(sessions.coachId, input.coachId)];

      if (input.startDate) {
        conditions.push(gte(sessions.scheduledDate, new Date(input.startDate)));
      }
      if (input.endDate) {
        conditions.push(lte(sessions.scheduledDate, new Date(input.endDate)));
      }

      const bookings = await db.query.sessions.findMany({
        where: and(...conditions),
        with: {
          client: true,
        },
      });

      return { bookings };
    }),

  /**
   * Cancel a booking
   * PUBLIC - anyone with booking ID can cancel
   */
  cancelBooking: publicProcedure
    .input(z.object({ bookingId: z.number() }))
    .mutation(async ({ input }) => {
      await db.update(sessions)
        .set({ 
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, input.bookingId));

      return { success: true, message: "Booking cancelled successfully" };
    }),
});
