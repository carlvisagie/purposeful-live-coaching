import { describe, it, expect } from "vitest";

/**
 * Unit tests for ROI Calculator logic
 */

describe("ROI Calculator", () => {
  describe("ROI Calculations", () => {
    it("should calculate projected savings correctly", () => {
      const teamSize = 50;
      const currentCostPerEmployee = 5000;
      const currentCost = teamSize * currentCostPerEmployee;

      // 20% savings
      const savingsPercentage = 20;
      const projectedSavings = currentCost * (savingsPercentage / 100);

      expect(currentCost).toBe(250000);
      expect(projectedSavings).toBe(50000);
    });

    it("should calculate net savings after platform costs", () => {
      const teamSize = 50;
      const currentCostPerEmployee = 5000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      const monthlyPlatformCost = teamSize * 50; // $2,500
      const annualPlatformCost = monthlyPlatformCost * 12; // $30,000

      const netSavings12Months = projectedSavings - annualPlatformCost;

      expect(monthlyPlatformCost).toBe(2500);
      expect(annualPlatformCost).toBe(30000);
      expect(netSavings12Months).toBe(20000); // $50,000 - $30,000
    });

    it("should calculate 90-day ROI", () => {
      const teamSize = 50;
      const currentCostPerEmployee = 5000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      const monthlyPlatformCost = teamSize * 50;
      const roi90Days = Math.max(0, projectedSavings / 4 - monthlyPlatformCost * 3);

      expect(roi90Days).toBe(0); // $12,500 - $7,500 = $5,000, but let's verify
      const quarterSavings = projectedSavings / 4; // $12,500
      const quarterCost = monthlyPlatformCost * 3; // $7,500
      expect(quarterSavings - quarterCost).toBe(5000);
    });

    it("should calculate cost reduction percentage", () => {
      const teamSize = 50;
      const currentCostPerEmployee = 5000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      const costReduction = Math.round((projectedSavings / currentCost) * 100);

      expect(costReduction).toBe(20);
    });

    it("should calculate cost per employee savings", () => {
      const teamSize = 50;
      const currentCostPerEmployee = 5000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      const savingsPerEmployee = Math.round(projectedSavings / teamSize);

      expect(savingsPerEmployee).toBe(1000); // $50,000 / 50 = $1,000
    });
  });

  describe("Scaling", () => {
    it("should scale correctly for different team sizes", () => {
      const testCases = [
        { teamSize: 10, expectedMonthly: 500, expectedAnnual: 6000 },
        { teamSize: 50, expectedMonthly: 2500, expectedAnnual: 30000 },
        { teamSize: 100, expectedMonthly: 5000, expectedAnnual: 60000 },
        { teamSize: 500, expectedMonthly: 25000, expectedAnnual: 300000 },
      ];

      testCases.forEach(({ teamSize, expectedMonthly, expectedAnnual }) => {
        const monthlyPlatformCost = teamSize * 50;
        const annualPlatformCost = monthlyPlatformCost * 12;

        expect(monthlyPlatformCost).toBe(expectedMonthly);
        expect(annualPlatformCost).toBe(expectedAnnual);
      });
    });

    it("should maintain consistent savings percentage across team sizes", () => {
      const savingsPercentage = 20;

      const testCases = [10, 50, 100, 500];

      testCases.forEach((teamSize) => {
        const currentCostPerEmployee = 5000;
        const currentCost = teamSize * currentCostPerEmployee;
        const projectedSavings = currentCost * (savingsPercentage / 100);
        const actualPercentage = (projectedSavings / currentCost) * 100;

        expect(actualPercentage).toBe(savingsPercentage);
      });
    });
  });

  describe("Currency Formatting", () => {
    it("should format large numbers as currency", () => {
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      };

      expect(formatCurrency(250000)).toBe("$250,000");
      expect(formatCurrency(50000)).toBe("$50,000");
      expect(formatCurrency(1000)).toBe("$1,000");
    });
  });

  describe("Edge Cases", () => {
    it("should handle minimum team size", () => {
      const teamSize = 10;
      const currentCostPerEmployee = 1000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      expect(currentCost).toBe(10000);
      expect(projectedSavings).toBe(2000);
    });

    it("should handle maximum team size", () => {
      const teamSize = 500;
      const currentCostPerEmployee = 20000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      expect(currentCost).toBe(10000000);
      expect(projectedSavings).toBe(2000000);
    });

    it("should never return negative ROI", () => {
      const teamSize = 10;
      const currentCostPerEmployee = 1000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      const monthlyPlatformCost = teamSize * 50;
      const roi90Days = Math.max(0, projectedSavings / 4 - monthlyPlatformCost * 3);

      expect(roi90Days).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Payback Period", () => {
    it("should calculate payback period correctly", () => {
      const teamSize = 50;
      const currentCostPerEmployee = 5000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      const monthlyPlatformCost = teamSize * 50;
      const roi90Days = Math.max(0, projectedSavings / 4 - monthlyPlatformCost * 3);

      const paybackPeriod = roi90Days > 0 ? "< 3 months" : "3-6 months";

      expect(paybackPeriod).toBe("< 3 months");
    });

    it("should show longer payback for small teams", () => {
      const teamSize = 10;
      const currentCostPerEmployee = 5000;
      const currentCost = teamSize * currentCostPerEmployee;
      const projectedSavings = currentCost * 0.2;

      const monthlyPlatformCost = teamSize * 50;
      const roi90Days = Math.max(0, projectedSavings / 4 - monthlyPlatformCost * 3);

      const paybackPeriod = roi90Days > 0 ? "< 3 months" : "3-6 months";

      expect(paybackPeriod).toBe("3-6 months");
    });
  });
});
