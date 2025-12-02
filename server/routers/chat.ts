import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

/**
 * Chat Router
 * Handles live chat messages and routing to sales/support teams
 */
export const chatRouter = router({
  /**
   * Send a chat message
   * Routes to appropriate team based on type
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string().min(1),
        type: z.enum(["corporate", "individual"]),
        routeToTeam: z.enum(["sales", "support"]),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Chat message received:", {
        ...input,
        timestamp: new Date().toISOString(),
      });

      // In production, you would:
      // 1. Store message in database
      // 2. Route to appropriate team queue
      // 3. Send notification to team
      // 4. Use AI to generate initial response

      // For now, return a helpful response based on type
      let reply = "";

      if (input.type === "corporate") {
        if (input.message.toLowerCase().includes("price")) {
          reply =
            "Great question! Our enterprise plans start at $2,500/month for up to 50 employees. We also offer custom pricing for larger organizations. Would you like to schedule a call to discuss your specific needs?";
        } else if (input.message.toLowerCase().includes("demo")) {
          reply =
            "Absolutely! I'd love to show you how our platform works. Let me schedule a personalized demo with our sales team. What time works best for you this week?";
        } else {
          reply =
            "Thanks for reaching out! Our sales team is here to help. Can you tell me more about what you're looking for? Are you interested in learning about our emotional resilience platform for your organization?";
        }
      } else {
        if (input.message.toLowerCase().includes("price")) {
          reply =
            "Our plans start at just $1/month for a trial, then $49/month for Essential or $99/month for Growth. Which sounds like a better fit for you?";
        } else if (input.message.toLowerCase().includes("free")) {
          reply =
            "Yes! You can start with a $1 trial to experience our AI coaching firsthand. No credit card required. Would you like to get started?";
        } else {
          reply =
            "Welcome! I'm here to help you get started with AI coaching. What brings you here today? Are you looking for support with stress, anxiety, or something else?";
        }
      }

      return {
        success: true,
        reply,
        routedTo: input.routeToTeam,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get chat history for a session
   */
  getHistory: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      // In production, query database for chat history
      return {
        sessionId: input.sessionId,
        messages: [],
      };
    }),
});
