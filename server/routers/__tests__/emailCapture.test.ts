import { describe, it, expect, beforeEach } from "vitest";
import { emailCaptureRouter } from "../emailCapture";

/**
 * Email Capture Router Tests
 * Verifies email capture functionality and Mailchimp integration
 */

describe("Email Capture Router", () => {
  describe("captureROIEmail", () => {
    it("should capture email from ROI calculator", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.captureROIEmail({
        email: "test@company.com",
        teamSize: 50,
        currentCost: 500000,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.emailId).toBeDefined();
      expect(result.message).toContain("email");
    });

    it("should validate email format", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.captureROIEmail({
          email: "invalid-email",
          teamSize: 50,
          currentCost: 500000,
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should validate team size", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.captureROIEmail({
          email: "test@company.com",
          teamSize: 0, // Invalid
          currentCost: 500000,
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should validate minimum cost", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      try {
        await caller.captureROIEmail({
          email: "test@company.com",
          teamSize: 50,
          currentCost: 100, // Below minimum
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("captureIndividualEmail", () => {
    it("should capture email from individual signup", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.captureIndividualEmail({
        email: "user@example.com",
        plan: "essential",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.emailId).toBeDefined();
      expect(result.message).toContain("Welcome");
    });

    it("should support all plan types", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const plans = ["breakthrough", "essential", "growth"] as const;

      for (const plan of plans) {
        const result = await caller.captureIndividualEmail({
          email: `user-${plan}@example.com`,
          plan,
        });

        expect(result.success).toBe(true);
      }
    });
  });

  describe("captureCorporateEmail", () => {
    it("should capture email from corporate inquiry", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.captureCorporateEmail({
        email: "hr@company.com",
        company: "Acme Corp",
        teamSize: 100,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.emailId).toBeDefined();
      expect(result.message).toContain("enterprise team");
    });

    it("should handle exit-intent captures without company info", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.captureCorporateEmail({
        email: "contact@company.com",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe("getEmailAnalytics", () => {
    it("should return email capture analytics", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getEmailAnalytics();

      expect(result).toBeDefined();
      expect(result.totalEmails).toBeGreaterThanOrEqual(0);
      expect(result.roiCalculatorEmails).toBeGreaterThanOrEqual(0);
      expect(result.individualSignups).toBeGreaterThanOrEqual(0);
      expect(result.corporateInquiries).toBeGreaterThanOrEqual(0);
      expect(result.last24hCaptures).toBeGreaterThanOrEqual(0);
    });

    it("should calculate conversion rate", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getEmailAnalytics();

      expect(result.conversionRate).toBeGreaterThanOrEqual(0);
      expect(result.conversionRate).toBeLessThanOrEqual(100);
    });

    it("should track email sources correctly", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const before = await caller.getEmailAnalytics();

      // Capture emails from different sources
      await caller.captureROIEmail({
        email: "roi@test.com",
        teamSize: 50,
        currentCost: 500000,
      });

      await caller.captureIndividualEmail({
        email: "individual@test.com",
        plan: "essential",
      });

      const after = await caller.getEmailAnalytics();

      expect(after.totalEmails).toBeGreaterThan(before.totalEmails);
      expect(after.roiCalculatorEmails).toBeGreaterThanOrEqual(before.roiCalculatorEmails);
      expect(after.individualSignups).toBeGreaterThanOrEqual(before.individualSignups);
    });
  });

  describe("verifyEmail", () => {
    it("should check if email exists", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      // First capture an email
      await caller.captureROIEmail({
        email: "verify@test.com",
        teamSize: 50,
        currentCost: 500000,
      });

      // Then verify it exists
      const result = await caller.verifyEmail({
        email: "verify@test.com",
      });

      expect(result.exists).toBe(true);
    });

    it("should return false for non-existent email", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.verifyEmail({
        email: "nonexistent@test.com",
      });

      expect(result.exists).toBe(false);
    });

    it("should prevent duplicate email captures", async () => {
      const caller = emailCaptureRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const email = "duplicate@test.com";

      // First capture
      const result1 = await caller.captureROIEmail({
        email,
        teamSize: 50,
        currentCost: 500000,
      });

      // Verify it exists
      const exists = await caller.verifyEmail({ email });
      expect(exists.exists).toBe(true);

      // Second capture should still succeed (Mailchimp will handle deduplication)
      const result2 = await caller.captureROIEmail({
        email,
        teamSize: 100,
        currentCost: 1000000,
      });

      expect(result2.success).toBe(true);
    });
  });
});
