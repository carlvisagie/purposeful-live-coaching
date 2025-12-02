import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { sendPaymentConfirmation } from "../email";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

/**
 * PAYMENT SYSTEM - tRPC ROUTER
 * 
 * Handles session purchases, payment processing, and revenue tracking
 */

export const paymentsRouter = router({
  // Create Stripe checkout session for session purchase
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        sessionType: z.enum(["intro", "foundation", "breakthrough", "transformation"]),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const priceMap = {
        intro: 100, // $1.00 in cents
        foundation: 4900, // $49.00
        breakthrough: 9900, // $99.00
        transformation: 14900, // $149.00
      };

      const sessionNames = {
        intro: "Introductory Session (30 min)",
        foundation: "Foundation Session (30 min)",
        breakthrough: "Breakthrough Session (60 min)",
        transformation: "Transformation Session (90 min)",
      };

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: sessionNames[input.sessionType],
                  description: `One-on-one coaching session with professional life coach`,
                },
                unit_amount: priceMap[input.sessionType],
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            userId: ctx.user.id.toString(),
            sessionType: input.sessionType,
          },
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Stripe checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  // Get payment history for current user
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 100,
      });

      // Filter by user's email or metadata
      const userPayments = paymentIntents.data.filter((payment) => {
        return payment.metadata?.userId === ctx.user.id.toString();
      });

      return userPayments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        created: new Date(payment.created * 1000),
        sessionType: payment.metadata?.sessionType,
      }));
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      return [];
    }
  }),

  // Webhook handler for Stripe events (called from webhook endpoint)
  handleWebhook: publicProcedure
    .input(
      z.object({
        signature: z.string(),
        rawBody: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const event = stripe.webhooks.constructEvent(
          input.rawBody,
          input.signature,
          ENV.stripeWebhookSecret
        );

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            
            // Send payment confirmation email
            if (session.customer_details?.email && session.customer_details?.name) {
              await sendPaymentConfirmation({
                clientName: session.customer_details.name,
                clientEmail: session.customer_details.email,
                sessionType: session.metadata?.sessionType || "Coaching Session",
                amount: session.amount_total || 0,
                transactionId: session.payment_intent as string || session.id,
              });
            }
            
            console.log("Payment successful:", {
              userId: session.client_reference_id,
              sessionType: session.metadata?.sessionType,
              amount: session.amount_total,
            });
            
            break;
          }

          case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            
            // TODO: Send payment failed email
            
            console.log("Payment failed:", {
              userId: paymentIntent.metadata?.userId,
              error: paymentIntent.last_payment_error?.message,
            });
            
            break;
          }

          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
      } catch (error) {
        console.error("Webhook error:", error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Webhook signature verification failed",
        });
      }
    }),
});
