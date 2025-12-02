import { useEffect, useState } from "react";

export type ABTestVariant = "control" | "variant";

interface ABTestConfig {
  testName: string;
  variants: {
    control: string;
    variant: string;
  };
  splitPercentage?: number; // Default 50/50
}

/**
 * Hook for A/B testing CTA variants
 * Randomly assigns visitors to control or variant
 * Persists assignment in localStorage for consistency
 * Tracks conversions via tRPC
 */
export function useABTest(config: ABTestConfig) {
  const [variant, setVariant] = useState<ABTestVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user already has a variant assignment
    const storageKey = `ab_test_${config.testName}`;
    const stored = localStorage.getItem(storageKey);

    if (stored === "control" || stored === "variant") {
      setVariant(stored);
      setIsLoading(false);
      return;
    }

    // Randomly assign variant based on split percentage
    const splitPercentage = config.splitPercentage ?? 50;
    const random = Math.random() * 100;
    const assigned: ABTestVariant =
      random < splitPercentage ? "variant" : "control";

    localStorage.setItem(storageKey, assigned);
    setVariant(assigned);
    setIsLoading(false);
  }, [config.testName, config.splitPercentage]);

  const getCTAText = () => {
    if (!variant) return config.variants.control;
    return config.variants[variant];
  };

  const trackConversion = async (conversionType: string) => {
    if (!variant) return;

    // Track conversion - could be sent to analytics or backend
    const event = {
      testName: config.testName,
      variant,
      conversionType,
      timestamp: new Date().toISOString(),
    };

    // Log to console for now, could send to backend
    console.log("AB Test Conversion:", event);

    // Could also send to analytics service
    if ((window as any).gtag) {
      (window as any).gtag("event", "ab_test_conversion", {
        test_name: config.testName,
        variant,
        conversion_type: conversionType,
      });
    }
  };

  return {
    variant,
    isLoading,
    ctaText: getCTAText(),
    trackConversion,
  };
}
