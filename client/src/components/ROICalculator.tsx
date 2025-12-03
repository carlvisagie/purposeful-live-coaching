import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react";

interface ROIResult {
  teamSize: number;
  currentCost: number;
  projectedSavings: number;
  savingsPercentage: number;
  roi90Days: number;
  roi12Months: number;
  roi24Months: number;
  costPerEmployee: number;
  costReduction: number;
}

/**
 * Interactive ROI Calculator for Enterprise coaching platform
 */
export function ROICalculator() {
  const [teamSize, setTeamSize] = useState(50);
  const [currentCostPerEmployee, setCurrentCostPerEmployee] = useState(5000);

  // Calculate ROI metrics
  const roi = useMemo<ROIResult>(() => {
    const currentCost = teamSize * currentCostPerEmployee;

    // Industry average: emotional resilience coaching reduces healthcare costs by 15-30%
    // We use 20% as conservative estimate
    const savingsPercentage = 20;
    const projectedSavings = currentCost * (savingsPercentage / 100);

    // Our platform cost: $2,500-7,500/month depending on team size
    // Formula: $50 per employee per month (scales with team)
    const monthlyPlatformCost = teamSize * 50;
    const annualPlatformCost = monthlyPlatformCost * 12;

    // Net savings after platform cost
    const netSavings90Days = projectedSavings / 4 - (monthlyPlatformCost * 3);
    const netSavings12Months = projectedSavings - annualPlatformCost;
    const netSavings24Months = projectedSavings * 2 - annualPlatformCost * 2;

    return {
      teamSize,
      currentCost,
      projectedSavings,
      savingsPercentage,
      roi90Days: Math.max(0, netSavings90Days),
      roi12Months: Math.max(0, netSavings12Months),
      roi24Months: Math.max(0, netSavings24Months),
      costPerEmployee: currentCostPerEmployee,
      costReduction: Math.round((projectedSavings / currentCost) * 100),
    };
  }, [teamSize, currentCostPerEmployee]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Calculate Your ROI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Size Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Team Size: <span className="text-blue-600 font-bold">{teamSize}</span> employees
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10</span>
              <span>500+</span>
            </div>
          </div>

          {/* Current Cost Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Current Annual Healthcare Cost per Employee: ${currentCostPerEmployee.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={currentCostPerEmployee}
              onChange={(e) => setCurrentCostPerEmployee(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$1,000</span>
              <span>$20,000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Current Spend */}
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Current Annual Spend</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(roi.currentCost)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {roi.teamSize} employees × ${roi.costPerEmployee.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Projected Savings */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-green-700 font-medium mb-1">
              Projected Annual Savings ({roi.savingsPercentage}%)
            </p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(roi.projectedSavings)}
            </p>
            <p className="text-xs text-green-600 mt-2">
              Reduced healthcare costs through emotional resilience
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROI Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            ROI Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 90 Days */}
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm font-medium text-gray-700">90 Days</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(roi.roi90Days)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Net savings after platform costs
              </p>
            </div>

            {/* 12 Months */}
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm font-medium text-gray-700">12 Months</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(roi.roi12Months)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Full year net savings
              </p>
            </div>

            {/* 24 Months */}
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm font-medium text-gray-700">24 Months</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(roi.roi24Months)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Two-year cumulative savings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Cost Reduction</p>
            <p className="text-3xl font-bold text-blue-600">{roi.costReduction}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Cost per Employee</p>
            <p className="text-3xl font-bold text-green-600">
              ${Math.round(roi.projectedSavings / roi.teamSize).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Payback Period</p>
            <p className="text-3xl font-bold text-purple-600">
              {roi.roi90Days > 0 ? "< 3 months" : "3-6 months"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to Transform Your Organization?
        </h3>
        <p className="text-gray-600 mb-4">
          Get a custom quote based on your team size and current spending.
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => window.open("https://calendly.com/carlhvisagie-rxgb", "_blank")}
        >
          Schedule Strategy Call
        </Button>
      </div>
    </div>
  );
}
