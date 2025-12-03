import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const { data: tiers, isLoading } = trpc.subscriptions.getPricingTiers.useQuery();
  const { data: currentSub } = trpc.subscriptions.getMySubscription.useQuery();
  const createCheckout = trpc.subscriptions.createCheckoutSession.useMutation();

  const handleSubscribe = async (tier: string) => {
    setLoadingTier(tier);
    try {
      const result = await createCheckout.mutateAsync({
        tier: tier as "ai_only" | "hybrid" | "premium",
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
      setLoadingTier(null);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "ai_only":
        return <Sparkles className="h-6 w-6" />;
      case "hybrid":
        return <Zap className="h-6 w-6" />;
      case "premium":
        return <Crown className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "ai_only":
        return "border-blue-500";
      case "hybrid":
        return "border-purple-500";
      case "premium":
        return "border-amber-500";
      default:
        return "";
    }
  };

  const isCurrentTier = (tier: string) => {
    return currentSub?.tier === tier && currentSub?.status === "active";
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Coaching Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start with 24/7 AI coaching or upgrade to include live human sessions. All plans include a 7-day free trial.
        </p>
      </div>

      {/* Current Subscription Alert */}
      {currentSub && currentSub.status === "active" && (
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <p className="text-center text-sm">
                You're currently on the <strong>{currentSub.tierConfig?.name}</strong> plan.{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setLocation("/subscription")}
                >
                  Manage subscription →
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers?.map((tier) => (
          <Card
            key={tier.tier}
            className={`relative ${getTierColor(tier.tier)} ${
              tier.tier === "hybrid" ? "border-2 shadow-lg scale-105" : ""
            }`}
          >
            {tier.tier === "hybrid" && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500">
                Most Popular
              </Badge>
            )}

            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  tier.tier === "ai_only" ? "bg-blue-100 text-blue-600" :
                  tier.tier === "hybrid" ? "bg-purple-100 text-purple-600" :
                  "bg-amber-100 text-amber-600"
                }`}>
                  {getTierIcon(tier.tier)}
                </div>
                {isCurrentTier(tier.tier) && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Current Plan
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  ${(tier.price / 100).toFixed(0)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={tier.tier === "hybrid" ? "default" : "outline"}
                disabled={isCurrentTier(tier.tier) || loadingTier !== null}
                onClick={() => handleSubscribe(tier.tier)}
              >
                {loadingTier === tier.tier ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentTier(tier.tier) ? (
                  "Current Plan"
                ) : (
                  "Start Free Trial"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">What happens after the 7-day trial?</h3>
            <p className="text-muted-foreground">
              Your card will be charged on day 8. You can cancel anytime during the trial with no charge.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I upgrade or downgrade later?</h3>
            <p className="text-muted-foreground">
              Yes! You can change your plan anytime from your subscription dashboard. Changes take effect at the next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What if I need more human sessions?</h3>
            <p className="text-muted-foreground">
              Hybrid and Premium subscribers can purchase additional sessions for $99 each from their dashboard.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is my data secure?</h3>
            <p className="text-muted-foreground">
              Absolutely. All conversations are encrypted and HIPAA-compliant. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
