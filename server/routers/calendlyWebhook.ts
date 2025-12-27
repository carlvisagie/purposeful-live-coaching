import { router, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { users, clients, coaches, sessions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Calendly webhook handler for booking events
 * 
 * When someone books through Calendly:
 * 1. Extract name + email from webhook payload
 * 2. Find or create user account
 * 3. Create unified client profile linked to user
 * 4. Now ProfileGuard can load their context
 */
export const calendlyWebhookRouter = router({
  /**
   * Handle Calendly webhook events
   * This is called by Calendly when booking events occur
   */
  handleWebhook: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const payload = ctx.req.body;
      
      console.log("[Calendly Webhook] Received event:", payload.event);
      
      // Only handle invitee.created events (new bookings)
      if (payload.event !== "invitee.created") {
        console.log("[Calendly Webhook] Ignoring event type:", payload.event);
        return { success: true, message: "Event type ignored" };
      }
      
      // Extract invitee and event data
      const invitee = payload.payload?.invitee;
      const event = payload.payload?.event;
      
      if (!invitee) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing invitee data in webhook payload",
        });
      }
      
      const email = invitee.email;
      const name = invitee.name;
      const scheduledDate = event?.start_time ? new Date(event.start_time) : null;
      const duration = event?.duration ? parseInt(event.duration) : 60; // Default 60 minutes
      
      if (!email || !name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing email or name in invitee data",
        });
      }
      
      console.log(`[Calendly Webhook] Processing booking for ${name} (${email})`);
      
      // Find or create user
      let user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      
      if (!user) {
        console.log(`[Calendly Webhook] Creating new user for ${email}`);
        const [newUser] = await db.insert(users).values({
          openId: `calendly_${invitee.uuid || Date.now()}`,
          email: email,
          name: name,
          loginMethod: "calendly_booking",
          role: "client",
        }).returning();
        user = newUser;
        console.log(`[Calendly Webhook] ✅ Created user ${user.id}`);
      } else {
        console.log(`[Calendly Webhook] Found existing user ${user.id}`);
      }
      
      // Check if client profile already exists
      const existingClient = await db.query.clients.findFirst({
        where: eq(clients.email, email),
      });
      
      if (existingClient) {
        console.log(`[Calendly Webhook] Client profile already exists: ${existingClient.id}`);
        
        // Update to link to user if not already linked
        if (!existingClient.userId) {
          await db.update(clients)
            .set({ userId: user.id })
            .where(eq(clients.id, existingClient.id));
          console.log(`[Calendly Webhook] ✅ Linked existing client ${existingClient.id} to user ${user.id}`);
        }
        
        // Create session record if we have booking time and don't have a duplicate
        let sessionId = null;
        if (scheduledDate) {
          const [newSession] = await db.insert(sessions).values({
            coachId: existingClient.coachId,
            clientId: existingClient.id,
            scheduledDate: scheduledDate,
            duration: duration,
            sessionType: "Free Discovery Call",
            status: "scheduled",
            paymentStatus: "free",
            notes: `Booked via Calendly - ${email}`,
          }).returning();
          sessionId = newSession.id;
          console.log(`[Calendly Webhook] ✅ Created session ${sessionId} for existing client`);
        }
        
        return { 
          success: true, 
          userId: user.id, 
          clientId: existingClient.id,
          sessionId: sessionId,
          message: "Session created for existing user and client"
        };
      }
      
      // Get default coach (Carl)
      const defaultCoach = await db.query.coaches.findFirst();
      if (!defaultCoach) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No default coach found",
        });
      }
      
      // Create unified client profile
      const [newClient] = await db.insert(clients).values({
        userId: user.id,
        coachId: defaultCoach.id,
        name: name,
        email: email,
        status: "active",
        goals: "Free Discovery Call (Calendly)",
        startDate: new Date(),
      }).returning();
      
      console.log(`[Calendly Webhook] ✅ Created unified client profile ${newClient.id} for user ${user.id}`);
      
      // Create session record if we have booking time
      let sessionId = null;
      if (scheduledDate) {
        const [newSession] = await db.insert(sessions).values({
          coachId: defaultCoach.id,
          clientId: newClient.id,
          scheduledDate: scheduledDate,
          duration: duration,
          sessionType: "Free Discovery Call",
          status: "scheduled",
          paymentStatus: "free",
          notes: `Booked via Calendly - ${email}`,
        }).returning();
        sessionId = newSession.id;
        console.log(`[Calendly Webhook] ✅ Created session ${sessionId} for ${scheduledDate.toISOString()}`);
      } else {
        console.log(`[Calendly Webhook] ⚠️ No start_time in event data, session not created`);
      }
      
      return { 
        success: true, 
        userId: user.id, 
        clientId: newClient.id,
        sessionId: sessionId,
        message: "User, client profile, and session created successfully"
      };
      
    } catch (error: any) {
      console.error("[Calendly Webhook] Error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Calendly webhook processing failed: ${error.message}`,
      });
    }
  }),
});
