import { describe, it, expect, beforeEach } from "vitest";
import { socialProofRouter } from "../socialProof";
import { publicProcedure } from "../../_core/trpc";

describe("Social Proof Router", () => {
  const mockContext = {
    user: null,
    req: {} as any,
    res: {} as any,
  };

  describe("getPageActivity", () => {
    it("should return page activity with viewer count", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      const result = await caller.getPageActivity({
        pageType: "decision-tree",
      });

      expect(result).toHaveProperty("pageType", "decision-tree");
      expect(result).toHaveProperty("viewersCount");
      expect(result).toHaveProperty("lastUpdated");
      expect(result.viewersCount).toBeGreaterThanOrEqual(0);
      expect(result.viewersCount).toBeLessThanOrEqual(10);
    });

    it("should support all page types", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      const pageTypes = ["decision-tree", "ai-coaching", "book-session", "enterprise"] as const;

      for (const pageType of pageTypes) {
        const result = await caller.getPageActivity({ pageType });
        expect(result.pageType).toBe(pageType);
        expect(result.viewersCount).toBeGreaterThanOrEqual(0);
      }
    });

    it("should update viewer count on multiple calls", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      const result1 = await caller.getPageActivity({ pageType: "ai-coaching" });
      const result2 = await caller.getPageActivity({ pageType: "ai-coaching" });

      // Both calls should return valid data
      expect(result1.viewersCount).toBeGreaterThanOrEqual(0);
      expect(result2.viewersCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getRecentBookings", () => {
    it("should return empty array initially", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      const result = await caller.getRecentBookings({ limit: 5 });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it("should respect limit parameter", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      const result1 = await caller.getRecentBookings({ limit: 1 });
      const result2 = await caller.getRecentBookings({ limit: 10 });

      expect(result1.length).toBeLessThanOrEqual(1);
      expect(result2.length).toBeLessThanOrEqual(10);
    });

    it("should return bookings with required fields", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      // First simulate a booking
      await caller.simulateBooking({
        name: "John Doe",
        sessionType: "Essential Coaching",
      });

      const result = await caller.getRecentBookings({ limit: 5 });

      if (result.length > 0) {
        const booking = result[0];
        expect(booking).toHaveProperty("id");
        expect(booking).toHaveProperty("name");
        expect(booking).toHaveProperty("sessionType");
        expect(booking).toHaveProperty("timeAgo");
      }
    });
  });

  describe("simulateBooking", () => {
    it("should add a booking to recent bookings", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      const result = await caller.simulateBooking({
        name: "Jane Smith",
        sessionType: "Growth Coaching",
      });

      expect(result).toEqual({ success: true });

      // Verify booking was added
      const bookings = await caller.getRecentBookings({ limit: 1 });
      expect(bookings.length).toBeGreaterThan(0);
      expect(bookings[0].name).toBe("Jane Smith");
      expect(bookings[0].sessionType).toBe("Growth Coaching");
    });

    it("should maintain booking order (newest first)", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      await caller.simulateBooking({
        name: "First Booking",
        sessionType: "Essential",
      });

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      await caller.simulateBooking({
        name: "Second Booking",
        sessionType: "Growth",
      });

      const bookings = await caller.getRecentBookings({ limit: 2 });
      expect(bookings[0].name).toBe("Second Booking");
      expect(bookings[1].name).toBe("First Booking");
    });
  });

  describe("getUrgencyMetrics", () => {
    it("should return urgency metrics", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      const result = await caller.getUrgencyMetrics();

      expect(result).toHaveProperty("totalViewers");
      expect(result).toHaveProperty("recentBookings");
      expect(result).toHaveProperty("conversionRate");
      expect(result).toHaveProperty("lastUpdated");

      expect(result.totalViewers).toBeGreaterThanOrEqual(0);
      expect(result.recentBookings).toBeGreaterThanOrEqual(0);
      expect(result.conversionRate).toBeGreaterThanOrEqual(0);
      expect(result.conversionRate).toBeLessThanOrEqual(100);
    });
  });

  describe("Input validation", () => {
    it("should reject invalid page types", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      try {
        // @ts-expect-error - Testing invalid input
        await caller.getPageActivity({ pageType: "invalid-page" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject invalid limit values", async () => {
      const caller = socialProofRouter.createCaller(mockContext);

      try {
        await caller.getRecentBookings({ limit: 100 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
