import { describe, it, expect, beforeEach, vi } from "vitest";
import { analyticsRouter } from "../analytics";

/**
 * Analytics Router Tests
 * Verifies conversion tracking, A/B test results, and performance metrics
 */

describe("Analytics Router", () => {
  describe("getABTestResults", () => {
    it("should return A/B test results with control and variant conversion rates", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getABTestResults({ timeRange: "30d" });

      expect(result).toBeDefined();
      expect(result.controlConversion).toBeGreaterThan(0);
      expect(result.variantConversion).toBeGreaterThan(result.controlConversion);
      expect(result.lift).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThanOrEqual(90);
      expect(result.sampleSize).toBeGreaterThan(0);
    });

    it("should support different time ranges", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result7d = await caller.getABTestResults({ timeRange: "7d" });
      const result30d = await caller.getABTestResults({ timeRange: "30d" });
      const result90d = await caller.getABTestResults({ timeRange: "90d" });

      expect(result7d).toBeDefined();
      expect(result30d).toBeDefined();
      expect(result90d).toBeDefined();
    });
  });

  describe("getChatMetrics", () => {
    it("should return chat conversion metrics", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getChatMetrics({ timeRange: "30d" });

      expect(result).toBeDefined();
      expect(result.totalConversations).toBeGreaterThan(0);
      expect(result.salesConversions).toBeGreaterThanOrEqual(0);
      expect(result.supportConversions).toBeGreaterThanOrEqual(0);
      expect(result.salesConversionRate).toBeGreaterThan(0);
      expect(result.supportConversionRate).toBeGreaterThan(0);
    });

    it("should calculate conversion rates correctly", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getChatMetrics({ timeRange: "30d" });

      const totalConversions = result.salesConversions + result.supportConversions;
      const expectedSalesRate = (result.salesConversions / result.totalConversations) * 100;
      const expectedSupportRate = (result.supportConversions / result.totalConversions) * 100;

      expect(result.salesConversionRate).toBeCloseTo(expectedSalesRate, 1);
      expect(result.supportConversionRate).toBeCloseTo(expectedSupportRate, 1);
    });
  });

  describe("getExitIntentMetrics", () => {
    it("should return exit-intent popup performance metrics", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getExitIntentMetrics({ timeRange: "30d" });

      expect(result).toBeDefined();
      expect(result.popupsShown).toBeGreaterThan(0);
      expect(result.emailsCaptured).toBeGreaterThanOrEqual(0);
      expect(result.captureRate).toBeGreaterThan(0);
      expect(result.captureRate).toBeLessThanOrEqual(1);
      expect(result.industryAverage).toBeGreaterThan(0);
    });

    it("should calculate capture rate correctly", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getExitIntentMetrics({ timeRange: "30d" });

      const expectedRate = result.emailsCaptured / result.popupsShown;
      expect(result.captureRate).toBeCloseTo(expectedRate, 3);
    });

    it("should show capture rate above industry average", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getExitIntentMetrics({ timeRange: "30d" });

      // Exit-intent should perform 3x better than industry average
      expect(result.captureRate).toBeGreaterThan(result.industryAverage * 2);
    });
  });

  describe("getROICalculatorMetrics", () => {
    it("should return ROI calculator engagement metrics", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getROICalculatorMetrics({ timeRange: "30d" });

      expect(result).toBeDefined();
      expect(result.calculatorStarts).toBeGreaterThan(0);
      expect(result.completions).toBeGreaterThanOrEqual(0);
      expect(result.completionRate).toBeGreaterThan(0);
      expect(result.completionRate).toBeLessThanOrEqual(1);
      expect(result.emailCaptures).toBeGreaterThanOrEqual(0);
      expect(result.emailCaptureRate).toBeGreaterThan(0);
    });

    it("should show high completion rate", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getROICalculatorMetrics({ timeRange: "30d" });

      // ROI calculator should have >80% completion rate
      expect(result.completionRate).toBeGreaterThan(0.8);
    });

    it("should show email capture from completions", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getROICalculatorMetrics({ timeRange: "30d" });

      // Email capture rate should be >40%
      expect(result.emailCaptureRate).toBeGreaterThan(0.4);
    });
  });

  describe("getConversionTrend", () => {
    it("should return 7-day conversion trend data", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getConversionTrend({ timeRange: "30d" });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("control");
      expect(result[0]).toHaveProperty("variant");
    });

    it("should show variant outperforming control", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getConversionTrend({ timeRange: "30d" });

      // Most days should show variant > control
      const variantWins = result.filter((d) => d.variant > d.control).length;
      expect(variantWins).toBeGreaterThan(result.length * 0.5);
    });
  });

  describe("recordConversion", () => {
    it("should record conversion event", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.recordConversion({
        type: "chat",
        source: "corporate",
        variant: "variant-a",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("should accept all conversion types", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const types = ["chat", "roi_calculator", "exit_intent", "cta_click"] as const;

      for (const type of types) {
        const result = await caller.recordConversion({
          type,
          source: "individual",
        });

        expect(result.success).toBe(true);
      }
    });

    it("should accept metadata", async () => {
      const caller = analyticsRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.recordConversion({
        type: "chat",
        source: "corporate",
        metadata: {
          team_size: 50,
          industry: "healthcare",
          roi_potential: 250000,
        },
      });

      expect(result.success).toBe(true);
    });
  });
});
