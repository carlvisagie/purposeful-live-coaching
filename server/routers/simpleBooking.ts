/**
 * Simple Booking Router
 * 
 * A clean, working booking system that ACTUALLY WORKS.
 * No complex logic, no confusing timezone conversions.
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq, and, gte, lte, sql } from "drizzle-orm";

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
        duration: z.number().default(15),
      })
    )
    .query(async ({ input }) => {
      try {
      const { coachId, date, duration } = input;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Parse the date string
      const targetDate = new Date(date + 'T00:00:00Z');
      const dayOfWeek = targetDate.getUTCDay();

      console.log('[SimpleBooking] getAvailableSlots:', { coachId, date, dayOfWeek, duration });

      // Get coach availability for this day of week
      const availabilityResult = await db.execute(sql`
        SELECT * FROM coach_availability_slots
        WHERE coach_id = ${coachId}
        AND day_of_week = ${dayOfWeek}
        AND is_active = true
      `);
      const availability = availabilityResult.rows as any[];

      console.log('[SimpleBooking] Found availability records:', availability.length);

      if (availability.length === 0) {
        return { slots: [] };
      }

      // Get existing bookings for this date
      const dayStart = new Date(date + 'T00:00:00Z');
      const dayEnd = new Date(date + 'T23:59:59Z');

      const bookingsResult = await db.execute(sql`
        SELECT * FROM simple_bookings
        WHERE coach_id = ${coachId}
        AND booking_date_time >= ${dayStart}
        AND booking_date_time <= ${dayEnd}
        AND status = 'confirmed'
      `);
      const existingBookings = bookingsResult.rows as any[];

      console.log('[SimpleBooking] Found existing bookings:', existingBookings.length);

      // Generate time slots
      const slots: string[] = [];
      const now = new Date();
      const minimumBookingTime = new Date(now.getTime() + 3 * 60000); // 3 minutes from now

        for (const avail of availability) {
        const [startHour, startMin] = avail.start_time.split(":").map(Number);
        const [endHour, endMin] = avail.end_time.split(":").map(Number);

        // Generate slots every 30 minutes
        let currentHour = startHour;
        let currentMin = startMin;

        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
          // Create slot time
          const slotTime = new Date(date + `T${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}:00Z`);
          const slotEnd = new Date(slotTime.getTime() + duration * 60000);

          // Check if slot is in the future (at least 3 minutes from now)
          if (slotTime >= minimumBookingTime) {
            // Check if slot conflicts with existing booking
            const hasConflict = existingBookings.some(booking => {
              const bookingStart = new Date(booking.booking_date_time);
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

          // Move to next slot (30 min intervals)
          currentMin += 30;
          if (currentMin >= 60) {
            currentHour += 1;
            currentMin = 0;
          }
        }
      }

      console.log('[SimpleBooking] Generated slots:', slots.length);
      return { slots };
      } catch (error) {
        console.error('[SimpleBooking] ERROR in getAvailableSlots:', error);
        console.error('[SimpleBooking] Error stack:', error instanceof Error ? error.stack : 'No stack');
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error instanceof Error ? error.message : 'Unknown error' });
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
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      console.log('[SimpleBooking] bookSession:', input);

      // Check if slot is still available
      const bookingTime = new Date(input.bookingDateTime);
      const bookingEnd = new Date(bookingTime.getTime() + input.duration * 60000);

      const conflictingBookings = await db.query.simpleBookings.findMany({
        where: and(
          eq(sql`coach_id`, input.coachId),
          eq(sql`status`, 'confirmed'),
          sql`booking_date_time < ${bookingEnd} AND booking_date_time + (duration || ' minutes')::interval > ${bookingTime}`
        ),
      });

      if (conflictingBookings.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "This time slot is no longer available" });
      }

      // Create booking
      const result = await db.execute(sql`
        INSERT INTO simple_bookings (coach_id, client_name, client_email, client_phone, booking_date_time, duration, status, notes)
        VALUES (${input.coachId}, ${input.clientName}, ${input.clientEmail}, ${input.clientPhone || null}, ${bookingTime}, ${input.duration}, 'confirmed', ${input.notes || null})
        RETURNING id
      `);

      const bookingId = (result.rows[0] as any).id;

      console.log('[SimpleBooking] Booking created:', bookingId);

      return {
        success: true,
        bookingId,
        message: "Booking confirmed!",
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
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const conditions = [eq(sql`coach_id`, input.coachId)];

      if (input.startDate) {
        conditions.push(gte(sql`booking_date_time`, new Date(input.startDate)));
      }
      if (input.endDate) {
        conditions.push(lte(sql`booking_date_time`, new Date(input.endDate)));
      }

      const bookings = await db.query.simpleBookings.findMany({
        where: and(...conditions),
        orderBy: sql`booking_date_time ASC`,
      });

      return { bookings };
    }),

  /**
   * Cancel a booking
   * PROTECTED - coach only
   */
  cancelBooking: protectedProcedure
    .input(z.object({ bookingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.execute(sql`
        UPDATE simple_bookings
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = ${input.bookingId}
      `);

      return { success: true };
    }),
});
