import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { sessionTypes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover",
});

/**
 * Stripe router for session booking (human coaching sessions)
 * Note: Subscription management is in subscriptions.ts router
 */
export const stripeRouter = router({
  /**
   * Create Stripe checkout session for one-time human coaching session booking
   * Used by Hybrid/Premium subscribers to book their included human sessions
   */
  createSessionCheckout: publicProcedure
    .input(
      z.object({
        sessionTypeId: z.number(),
        scheduledDate: z.string(),
        notes: z.string().optional(),
        guestEmail: z.string().email().optional(),
        guestName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get session type details
      const [sessionType] = await db
        .select()
        .from(sessionTypes)
        .where(eq(sessionTypes.id, input.sessionTypeId))
        .limit(1);

      if (!sessionType) {
        throw new Error("Session type not found");
      }

      const priceId = sessionType.oneTimePriceId;

      if (!priceId) {
        throw new Error(`This session type is not available for booking. Please contact support.`);
      }

      const origin = ctx.req.headers.origin || "http://localhost:3000";

      // Create Stripe checkout session for one-time payment
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: ctx.user?.email || input.guestEmail || undefined,
        client_reference_id: ctx.user?.id?.toString() || 'guest',
        metadata: {
          user_id: ctx.user?.id?.toString() || 'guest',
          customer_email: ctx.user?.email || input.guestEmail || "",
          customer_name: ctx.user?.name || input.guestName || "Guest",
          session_type_id: sessionType.id.toString(),
          session_type_name: sessionType.name,
          scheduled_date: input.scheduledDate,
          notes: input.notes || "",
        },
        success_url: `${origin}/my-sessions?payment=success`,
        cancel_url: `${origin}/my-sessions?payment=cancelled`,
        allow_promotion_codes: true,
      });

      return {
        url: session.url,
        session_id: session.id,
      };
    }),

  /**
   * Verify payment and create booking (fallback for webhook failures)
   * Called from success page to ensure booking is created even if webhook fails
   * PUBLIC: No auth required - session_id from Stripe is the authentication proof
   */
  verifyAndCreateBooking: publicProcedure
    .input(
      z.object({
        session_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);

      // Verify payment was successful
      if (session.payment_status !== 'paid') {
        throw new Error("Payment not completed");
      }

      // Extract metadata
      const metadata = session.metadata;
      if (!metadata) {
        throw new Error("Missing session metadata");
      }

      // Check if booking already exists (prevent duplicates)
      const { sessions: sessionsTable, clients: clientsTable } = await import('../../drizzle/schema');
      const existingBooking = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.stripeSessionId, input.sessionId))
        .limit(1);

      if (existingBooking.length > 0) {
        // Booking already exists, return it
        return {
          success: true,
          bookingId: existingBooking[0].id,
          alreadyExists: true,
        };
      }

      // Create or get client record
      let client_id: number;
      const clientEmail = session.customer_email || metadata.customer_email;
      
      if (clientEmail) {
        const existingClient = await db
          .select()
          .from(clientsTable)
          .where(eq(clientsTable.email, clientEmail))
          .limit(1);

        if (existingClient.length > 0) {
          clientId = existingClient[0].id;
        } else {
          // Create new client
          const [newClient] = await db
            .insert(clientsTable)
            .values({
              coach_id: 1, // Default coach ID (you)
              name: session.customer_details?.name || metadata.customer_name || 'Unknown',
              email: clientEmail,
              phone: null,
              status: 'active',
            });
          clientId = newClient.insertId;
        }
      } else {
        throw new Error("Client email is required");
      }

      // Get session type to determine duration
      const [sessionType] = await db
        .select()
        .from(sessionTypes)
        .where(eq(sessionTypes.id, parseInt(metadata.session_type_id)))
        .limit(1);

      // Create booking
      const [newSession] = await db
        .insert(sessionsTable)
        .values({
          clientId,
          coach_id: 1, // Default coach ID (you)
          sessionTypeId: parseInt(metadata.session_type_id),
          scheduledDate: new Date(metadata.scheduled_date),
          duration: sessionType?.duration || 60, // Default to 60 minutes
          price: session.amount_total || 0, // in cents
          status: 'scheduled',
          notes: metadata.notes || null,
          paymentStatus: 'paid',
          stripePaymentIntentId: session.payment_intent as string || null,
          stripeSessionId: input.sessionId,
        });

      return {
        success: true,
        bookingId: newSession.insertId,
        alreadyExists: false,
      };
    }),
});
