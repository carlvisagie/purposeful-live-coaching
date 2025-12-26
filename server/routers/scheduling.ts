/**
 * Scheduling router - session booking, rescheduling, cancellation
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getCoachAvailability,
  upsertCoachAvailability,
  deleteCoachAvailability,
  getAvailabilityExceptions,
  createAvailabilityException,
  deleteAvailabilityException,
  getCoachSessions,
  getClientSessions,
  getUpcomingClientSessions,
  createSession,
  updateSession,
  getSessionById,
  cancelSession,
  isTimeSlotAvailable,
} from "../db/scheduling";
import { getDb } from "../db";
import { coaches, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const schedulingRouter = router({
  /**
   * Get available spots remaining for the current week (PUBLIC - for scarcity display)
   */
  getWeeklyAvailability: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        sessionDuration: z.number().optional().default(60),
      })
    )
    .query(async ({ input }) => {
      // Get start and end of current week (Sunday to Saturday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Count booked sessions for this week
      const bookedSessions = await getCoachSessions(
        input.coachId,
        weekStart,
        weekEnd,
        ["scheduled"]
      );
      const bookedCount = bookedSessions.length;

      // Calculate total weekly capacity from availability
      const availability = await getCoachAvailability(input.coachId);
      const exceptions = await getAvailabilityExceptions(
        input.coachId,
        weekStart,
        weekEnd
      );

      // Calculate total available hours this week
      let totalMinutes = 0;
      const daysInWeek = 7;
      
      for (let i = 0; i < daysInWeek; i++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + i);
        const currentDayOfWeek = currentDate.getDay();

        // Check if this day is blocked by exception
        const isBlocked = exceptions.some(exc => {
          const excStart = new Date(exc.startDate);
          const excEnd = new Date(exc.endDate);
          excStart.setHours(0, 0, 0, 0);
          excEnd.setHours(23, 59, 59, 999);
          return currentDate >= excStart && currentDate <= excEnd;
        });

        if (isBlocked) continue;

        // Add available hours for this day
        const dayAvailability = availability.filter(
          a => a.dayOfWeek === currentDayOfWeek && a.isActive === true
        );

        for (const slot of dayAvailability) {
          const [startHour, startMin] = slot.startTime.split(":").map(Number);
          const [endHour, endMin] = slot.endTime.split(":").map(Number);
          const slotMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
          totalMinutes += slotMinutes;
        }
      }

      // Calculate max sessions based on duration
      const maxSessions = Math.floor(totalMinutes / input.sessionDuration);
      const remainingSpots = Math.max(0, maxSessions - bookedCount);

      return {
        totalCapacity: maxSessions,
        bookedCount,
        remainingSpots,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
      };
    }),

  /**
   * Get available time slots for a coach on a specific date (PUBLIC - for booking)
   */
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        date: z.string().or(z.date()),
        duration: z.number().default(60), // session duration in minutes
      })
    )
    .query(async ({ input }) => {
      const { coachId, duration } = input;
      const date = typeof input.date === 'string' ? new Date(input.date) : input.date;

      console.log('=== getAvailableSlots DEBUG ===');
      console.log('Input date:', date);
      console.log('Input date ISO:', date.toISOString());
      console.log('Current time:', new Date());
      console.log('Current time ISO:', new Date().toISOString());

      // Get day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = date.getDay();
      console.log('Day of week:', dayOfWeek);

      // Get coach availability for this day
      const availability = await getCoachAvailability(coachId, dayOfWeek);
      console.log('Availability records:', availability.length);
      console.log('Availability times:', availability.map(a => `${a.startTime}-${a.endTime}`));

      if (availability.length === 0) {
        console.log('No availability found for day', dayOfWeek);
        return { slots: [] };
      }

      // Get exceptions for this date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const exceptions = await getAvailabilityExceptions(coachId, startOfDay, endOfDay);

      // Check if this date has an exception
      const hasException = exceptions.some(exc => {
        const excStart = new Date(exc.startDate);
        const excEnd = new Date(exc.endDate);
        return date >= excStart && date <= excEnd;
      });

      if (hasException) {
        return { slots: [] };
      }

      // Get existing sessions for this date
      const sessions = await getCoachSessions(coachId, startOfDay, endOfDay, ["scheduled"]);

      // Generate time slots
      const slots: string[] = [];
      console.log('Generating slots for date:', date.toISOString());

      for (const avail of availability) {
        const [startHour, startMin] = avail.startTime.split(":").map(Number);
        const [endHour, endMin] = avail.endTime.split(":").map(Number);

        // Create slots in UTC to match database times
        const slotStart = new Date(date);
        slotStart.setUTCHours(startHour, startMin, 0, 0);

        const slotEnd = new Date(date);
        slotEnd.setUTCHours(endHour, endMin, 0, 0);

        // Generate slots every 30 minutes
        let currentSlot = new Date(slotStart);

        while (currentSlot.getTime() + duration * 60000 <= slotEnd.getTime()) {
          // Check if slot is at least 15 minutes in the future (buffer for booking)
          const now = new Date();
          const minimumBookingTime = new Date(now.getTime() + 15 * 60000); // 15 min buffer
          console.log('Checking slot:', currentSlot.toISOString(), 'vs minimum:', minimumBookingTime.toISOString(), 'passes:', currentSlot >= minimumBookingTime);
          if (currentSlot >= minimumBookingTime) {
            // Check if slot conflicts with existing session
            const hasConflict = sessions.some(s => {
              if (!s.session) return false; // Skip null sessions
              const sessionStart = new Date(s.session.scheduledDate);
              const sessionEnd = new Date(sessionStart.getTime() + (s.session.duration || 60) * 60000);
              const slotEndTime = new Date(currentSlot.getTime() + duration * 60000);

              return (
                (currentSlot >= sessionStart && currentSlot < sessionEnd) ||
                (slotEndTime > sessionStart && slotEndTime <= sessionEnd) ||
                (currentSlot <= sessionStart && slotEndTime >= sessionEnd)
              );
            });

            if (!hasConflict) {
              slots.push(currentSlot.toISOString());
            }
          }

          // Move to next slot (30 min intervals)
          currentSlot = new Date(currentSlot.getTime() + 30 * 60000);
        }
      }

      return { slots };
    }),

  /**
   * Book a free session (PUBLIC - no auth required)
   * Used for free Discovery Calls
   */
  bookFreeSession: publicProcedure
    .input(
      z.object({
        sessionTypeId: z.number(),
        scheduledDate: z.string(), // ISO datetime string
        clientEmail: z.string().email(),
        clientName: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const coachId = 1; // TODO: Get from session type
      const scheduledDateTime = new Date(input.scheduledDate);
      const duration = 15; // Discovery calls are 15 minutes

      // Check if time slot is available
      const available = await isTimeSlotAvailable(
        coachId,
        scheduledDateTime,
        duration
      );

      if (!available) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This time slot is no longer available",
        });
      }

      // Create or find guest client record
      const db = await import("../db").then(m => m.getDb());
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      const { clients } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      // Check if client already exists by email
      let clientId: number;
      const existingClient = await db.select().from(clients).where(eq(clients.email, input.clientEmail)).limit(1);
      
      if (existingClient.length > 0) {
        clientId = existingClient[0].id;
      } else {
        // Find or create user for this email
        let user = await db.query.users.findFirst({
          where: eq(users.email, input.clientEmail),
        });
        
        if (!user) {
          const [newUser] = await db.insert(users).values({
            openId: `booking_${Date.now()}`,
            email: input.clientEmail,
            name: input.clientName,
            loginMethod: "booking",
            role: "client",
          }).returning();
          user = newUser;
        }
        
        // Create new guest client linked to user
        const newClient = await db.insert(clients).values({
          coachId,
          userId: user.id,
          name: input.clientName,
          email: input.clientEmail,
          status: "guest",
          goals: "Free Discovery Call",
        }).returning({ id: clients.id });
        clientId = newClient[0].id;
      }

      // Create session
      await createSession({
        coachId,
        clientId: clientId,
        scheduledDate: scheduledDateTime,
        duration,
        sessionType: "Free Discovery Call",
        notes: input.notes || `Guest booking: ${input.clientName} (${input.clientEmail})`,
        status: "scheduled",
      });

      // Booking confirmation email can be added when email service is configured
      console.log("[Scheduling] Session booked:", { clientEmail: input.clientEmail, sessionDate: scheduledDateTime });

      return { 
        success: true,
        message: "Your free discovery call has been booked! Check your email for confirmation."
      };
    }),

  /**
   * Book a new session (PROTECTED - requires auth)
   */
  bookSession: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        client_id: z.number(),
        scheduledDate: z.date(),
        duration: z.number().default(60),
        sessionType: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if time slot is available
      const available = await isTimeSlotAvailable(
        input.coachId,
        input.scheduledDate,
        input.duration
      );

      if (!available) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This time slot is no longer available",
        });
      }

      // Create session
      await createSession({
        coachId: input.coachId,
        client_id: input.clientId,
        scheduledDate: input.scheduledDate,
        duration: input.duration,
        sessionType: input.sessionType,
        notes: input.notes,
        status: "scheduled",
      });

      // Booking confirmation email can be added when email service is configured
      console.log("[Scheduling] Session created:", { sessionDate: input.scheduledDate });

      return { success: true };
    }),

  /**
   * Reschedule a session
   */
  rescheduleSession: protectedProcedure
    .input(
      z.object({
        session_id: z.number(),
        newDate: z.date(),
        newDuration: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get existing session
      const sessionData = await getSessionById(input.sessionId);

      if (!sessionData || !sessionData.session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      const session = sessionData.session;

      // Check if user has permission (coach or client)
      // For now, allow any authenticated user
      // TODO: Add proper permission check

      // Check if new time slot is available
      const available = await isTimeSlotAvailable(
        session.coachId,
        input.newDate,
        input.newDuration || session.duration
      );

      if (!available) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The new time slot is not available",
        });
      }

      // Update session
      await updateSession(input.sessionId, {
        scheduledDate: input.newDate,
        duration: input.newDuration || session.duration,
      });

      // Reschedule notification email can be added when email service is configured
      console.log("[Scheduling] Session rescheduled:", { session_id: input.sessionId, newDate: input.newDate });

      return { success: true };
    }),

  /**
   * Cancel a session
   */
  cancelSession: publicProcedure
    .input(
      z.object({
        session_id: z.number(),
        cancelledBy: z.enum(["coach", "client"]),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const sessionData = await getSessionById(input.sessionId);

      if (!sessionData || !sessionData.session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      // Cancel session
      await cancelSession(input.sessionId, input.cancelledBy);

      // Update notes with cancellation reason
      if (input.reason) {
        await updateSession(input.sessionId, {
          notes: `Cancelled by ${input.cancelledBy}: ${input.reason}`,
        });
      }

      // Cancellation notification email can be added when email service is configured
      console.log("[Scheduling] Session cancelled:", { session_id: input.sessionId, reason: input.reason });

      return { success: true };
    }),

  /**
   * Get sessions for a client
   */
  getClientSessions: protectedProcedure
    .input(
      z.object({
        client_id: z.number(),
        status: z.array(z.enum(["scheduled", "completed", "cancelled", "no-show"])).optional(),
      })
    )
    .query(async ({ input }) => {
      const sessions = await getClientSessions(input.clientId, input.status);
      return { sessions };
    }),

  /**
   * Get upcoming sessions for a client
   */
  getUpcomingClientSessions: protectedProcedure
    .input(z.object({ client_id: z.number() }))
    .query(async ({ input }) => {
      const sessions = await getUpcomingClientSessions(input.clientId);
      return { sessions };
    }),

  /**
   * Get all upcoming sessions for a coach (PUBLIC - for owner dashboard)
   * No date range required - returns next 30 days of sessions
   */
  getCoachSessions: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);
      
      const sessionsData = await getCoachSessions(
        input.coachId,
        startDate,
        endDate
      );
      
      // Flatten the session data for easier frontend consumption
      return sessionsData.map(s => ({
        ...s.session,
        clientName: s.client?.name || 'Guest',
        clientEmail: s.client?.email || '',
      }));
    }),

  /**
   * Get sessions for a coach in a specific date range (PROTECTED)
   */
  getCoachSessionsRange: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
        status: z.array(z.enum(["scheduled", "completed", "cancelled", "no-show"])).optional(),
      })
    )
    .query(async ({ input }) => {
      const sessions = await getCoachSessions(
        input.coachId,
        input.startDate,
        input.endDate,
        input.status
      );
      return { sessions };
    }),

  /**
   * Get session by ID
   */
  getSession: protectedProcedure
    .input(z.object({ session_id: z.number() }))
    .query(async ({ input }) => {
      const session = await getSessionById(input.sessionId);

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      return session;
    }),

  /**
   * Get coach availability
   */
  getCoachAvailability: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        dayOfWeek: z.number().min(0).max(6).optional(),
      })
    )
    .query(async ({ input }) => {
      const availability = await getCoachAvailability(input.coachId, input.dayOfWeek);
      return { availability };
    }),

  /**
   * Set coach availability
   */
  setCoachAvailability: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string().regex(/^\d{2}:\d{2}$/),
        endTime: z.string().regex(/^\d{2}:\d{2}$/),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Frictionless principle: Auto-create coach if doesn't exist
      const existingCoach = await db.select().from(coaches).where(eq(coaches.id, input.coachId)).limit(1);
      
      if (existingCoach.length === 0) {
        // Create default user for coach if needed
        const existingUser = await db.select().from(users).where(eq(users.id, input.coachId)).limit(1);
        
        if (existingUser.length === 0) {
          await db.insert(users).values({
            id: input.coachId,
            email: `coach${input.coachId}@purposefullivecoaching.com`,
            name: "Platform Coach",
            role: "coach",
            tier: "premium"
          });
        }
        
        // Create coach record
        await db.insert(coaches).values({
          id: input.coachId,
          userId: input.coachId,
          specialization: "Wellness Coaching",
          bio: "Platform wellness coach",
          isActive: "active"
        });
      }

      await upsertCoachAvailability({
        coachId: input.coachId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
        isActive: true,
      });

      return { success: true };
    }),

  /**
   * Delete coach availability slot
   */
  deleteCoachAvailability: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCoachAvailability(input.id);
      return { success: true };
    }),

  /**
   * Get availability exceptions
   */
  getAvailabilityExceptions: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      const exceptions = await getAvailabilityExceptions(
        input.coachId,
        input.startDate,
        input.endDate
      );
      return { exceptions };
    }),

  /**
   * Create availability exception (time off)
   */
  createAvailabilityException: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createAvailabilityException({
        coachId: input.coachId,
        startDate: input.startDate,
        endDate: input.endDate,
        reason: input.reason,
      });

      return { success: true };
    }),

  /**
   * Delete availability exception
   */
  deleteAvailabilityException: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteAvailabilityException(input.id);
      return { success: true };
    }),

  /**
   * ADMIN: Seed default coach availability (Monday-Friday, 9 AM - 5 PM)
   * This is a one-time setup endpoint to populate initial availability
   */
  seedDefaultAvailability: publicProcedure
    .input(z.object({ coachId: z.number() }))
    .mutation(async ({ input }) => {
      // Check if availability already exists
      const existing = await getCoachAvailability(input.coachId, 1); // Check Monday
      if (existing.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Coach already has availability configured. Delete existing slots first if you want to reseed.",
        });
      }

      // Create default availability: Monday-Friday, 9 AM - 5 PM
      const availabilitySlots = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
      ];

      for (const slot of availabilitySlots) {
        await upsertCoachAvailability({
          coachId: input.coachId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: true,
        });
      }

      return {
        success: true,
        message: 'Default availability created: Monday-Friday, 9:00 AM - 5:00 PM',
        slotsCreated: availabilitySlots.length,
      };
    }),

  /**
   * Set Carl's custom availability:
   * Weekdays (Mon-Fri): 19:30 - 21:30
   * Weekends (Sat-Sun): 10:30 - 16:30
   */
  setOwnerAvailability: publicProcedure
    .input(z.object({ coachId: z.number() }))
    .mutation(async ({ input }) => {
      // Clear existing availability first
      const existing = await getCoachAvailability(input.coachId);
      for (const slot of existing) {
        await deleteCoachAvailability(slot.id);
      }

      // Carl's custom availability
      const availabilitySlots = [
        // Weekdays: 19:30 - 21:30
        { dayOfWeek: 1, startTime: '19:30', endTime: '21:30' }, // Monday
        { dayOfWeek: 2, startTime: '19:30', endTime: '21:30' }, // Tuesday
        { dayOfWeek: 3, startTime: '19:30', endTime: '21:30' }, // Wednesday
        { dayOfWeek: 4, startTime: '19:30', endTime: '21:30' }, // Thursday
        { dayOfWeek: 5, startTime: '19:30', endTime: '21:30' }, // Friday
        // Weekends: 10:30 - 16:30
        { dayOfWeek: 6, startTime: '10:30', endTime: '16:30' }, // Saturday
        { dayOfWeek: 0, startTime: '10:30', endTime: '16:30' }, // Sunday
      ];

      for (const slot of availabilitySlots) {
        await upsertCoachAvailability({
          coachId: input.coachId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: true,
        });
      }

      return {
        success: true,
        message: 'Owner availability set: Weekdays 19:30-21:30, Weekends 10:30-16:30',
        slotsCreated: availabilitySlots.length,
      };
    }),
});
