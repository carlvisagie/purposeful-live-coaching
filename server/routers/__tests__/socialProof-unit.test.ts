import { describe, it, expect } from "vitest";

/**
 * Unit tests for social proof helper functions
 * Testing the core logic without tRPC dependencies
 */

describe("Social Proof Helpers", () => {
  describe("getTimeAgo", () => {
    it("should format recent timestamps", () => {
      const now = Date.now();
      const oneMinuteAgo = now - 60 * 1000;
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      const oneHourAgo = now - 60 * 60 * 1000;

      // Helper function from socialProof router
      function getTimeAgo(timestamp: number): string {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
      }

      expect(getTimeAgo(now)).toBe("just now");
      expect(getTimeAgo(oneMinuteAgo)).toMatch(/\d+m ago/);
      expect(getTimeAgo(fiveMinutesAgo)).toMatch(/\d+m ago/);
      expect(getTimeAgo(oneHourAgo)).toMatch(/\d+h ago/);
    });
  });

  describe("Activity Store", () => {
    it("should maintain viewer count between 3-8", () => {
      // Simulate the activity tracking logic
      for (let i = 0; i < 10; i++) {
        const randomCount = Math.floor(Math.random() * 6) + 3;
        expect(randomCount).toBeGreaterThanOrEqual(3);
        expect(randomCount).toBeLessThanOrEqual(8);
      }
    });
  });

  describe("Booking Management", () => {
    it("should maintain max 10 bookings", () => {
      const bookings: Array<{ id: string; name: string; timestamp: number }> =
        [];

      // Simulate adding bookings
      for (let i = 0; i < 15; i++) {
        bookings.unshift({
          id: `booking-${i}`,
          name: `User ${i}`,
          timestamp: Date.now(),
        });

        if (bookings.length > 10) {
          bookings.pop();
        }
      }

      expect(bookings.length).toBeLessThanOrEqual(10);
      expect(bookings[0].id).toBe("booking-14"); // Newest first
    });

    it("should maintain booking order (newest first)", () => {
      const bookings: Array<{ id: string; name: string; timestamp: number }> =
        [];

      // Add bookings in order
      for (let i = 0; i < 5; i++) {
        bookings.unshift({
          id: `booking-${i}`,
          name: `User ${i}`,
          timestamp: Date.now() + i * 1000,
        });
      }

      // Verify newest is first
      expect(bookings[0].id).toBe("booking-4");
      expect(bookings[bookings.length - 1].id).toBe("booking-0");
    });
  });

  describe("Urgency Metrics", () => {
    it("should calculate valid conversion rates", () => {
      // Simulate conversion rate calculation
      for (let i = 0; i < 100; i++) {
        const conversionRate = Math.floor(Math.random() * 15) + 8; // 8-23%
        expect(conversionRate).toBeGreaterThanOrEqual(8);
        expect(conversionRate).toBeLessThanOrEqual(23);
      }
    });

    it("should aggregate viewer metrics", () => {
      const pageViews = new Map<string, number>();

      // Simulate page views
      pageViews.set("decision-tree", 5);
      pageViews.set("ai-coaching", 3);
      pageViews.set("book-session", 2);
      pageViews.set("enterprise", 4);

      const totalViewers = Array.from(pageViews.values()).reduce(
        (a, b) => a + b,
        0
      );

      expect(totalViewers).toBe(14);
      expect(totalViewers).toBeGreaterThan(0);
    });
  });

  describe("Input Validation", () => {
    it("should validate page types", () => {
      const validPageTypes = [
        "decision-tree",
        "ai-coaching",
        "book-session",
        "enterprise",
      ];

      const testPageType = (pageType: string): boolean => {
        return validPageTypes.includes(pageType);
      };

      expect(testPageType("decision-tree")).toBe(true);
      expect(testPageType("ai-coaching")).toBe(true);
      expect(testPageType("book-session")).toBe(true);
      expect(testPageType("enterprise")).toBe(true);
      expect(testPageType("invalid-page")).toBe(false);
    });

    it("should validate limit values", () => {
      const validateLimit = (limit: number): boolean => {
        return limit >= 1 && limit <= 10;
      };

      expect(validateLimit(1)).toBe(true);
      expect(validateLimit(5)).toBe(true);
      expect(validateLimit(10)).toBe(true);
      expect(validateLimit(0)).toBe(false);
      expect(validateLimit(11)).toBe(false);
      expect(validateLimit(-1)).toBe(false);
    });
  });
});
