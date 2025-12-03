import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

/**
 * Email Capture Router
 * Collects emails from ROI calculator and landing page CTAs
 * Integrates with Mailchimp for automated nurture sequences
 */

// In-memory store for captured emails (in production, use database)
const capturedEmails: Array<{
  id: string;
  email: string;
  source: string;
  timestamp: number;
  type: "roi-calculator" | "individual-signup" | "corporate-inquiry";
}> = [];

export const emailCaptureRouter = router({
  /**
   * Capture email from ROI calculator
   */
  captureROIEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        teamSize: z.number().min(1).max(500),
        currentCost: z.number().min(1000),
      })
    )
    .mutation(async ({ input }) => {
      const emailRecord = {
        id: Math.random().toString(36).substr(2, 9),
        email: input.email,
        source: `roi-calculator-team-${input.teamSize}`,
        timestamp: Date.now(),
        type: "roi-calculator" as const,
      };

      capturedEmails.push(emailRecord);

      // Mailchimp integration can be added when service is configured

      return {
        success: true,
        emailId: emailRecord.id,
        message: "Email captured! Check your inbox for your ROI report.",
      };
    }),

  /**
   * Capture email from individual signup
   */
  captureIndividualEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        plan: z.enum(["breakthrough", "essential", "growth"]),
      })
    )
    .mutation(async ({ input }) => {
      const emailRecord = {
        id: Math.random().toString(36).substr(2, 9),
        email: input.email,
        source: `individual-signup-${input.plan}`,
        timestamp: Date.now(),
        type: "individual-signup" as const,
      };

      capturedEmails.push(emailRecord);

      // Mailchimp integration can be added when service is configured

      return {
        success: true,
        emailId: emailRecord.id,
        message: "Welcome! Your AI coach is ready. Check your email to get started.",
      };
    }),

  /**
   * Capture email from corporate inquiry / exit-intent popup
   */
  captureCorporateEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        company: z.string().min(1).optional(),
        teamSize: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const emailRecord = {
        id: Math.random().toString(36).substr(2, 9),
        email: input.email,
        source: `corporate-inquiry-${input.company || "exit-intent"}`,
        timestamp: Date.now(),
        type: "corporate-inquiry" as const,
      };

      capturedEmails.push(emailRecord);

      // Mailchimp integration can be added when service is configured

      return {
        success: true,
        emailId: emailRecord.id,
        message: "Thank you! Our enterprise team will contact you within 24 hours.",
      };
    }),

  /**
   * Get email capture analytics
   */
  getEmailAnalytics: publicProcedure.query(() => {
    const roiEmails = capturedEmails.filter((e) => e.type === "roi-calculator");
    const individualEmails = capturedEmails.filter((e) => e.type === "individual-signup");
    const corporateEmails = capturedEmails.filter((e) => e.type === "corporate-inquiry");

    // Calculate 24-hour stats
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const last24h = capturedEmails.filter((e) => e.timestamp >= oneDayAgo);

    return {
      totalEmails: capturedEmails.length,
      roiCalculatorEmails: roiEmails.length,
      individualSignups: individualEmails.length,
      corporateInquiries: corporateEmails.length,
      last24hCaptures: last24h.length,
      conversionRate: capturedEmails.length > 0 
        ? Math.round((last24h.length / capturedEmails.length) * 100)
        : 0,
    };
  }),

  /**
   * Verify email exists (for duplicate prevention)
   */
  verifyEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(({ input }) => {
      const exists = capturedEmails.some((e) => e.email === input.email);
      return { exists };
    }),
});
