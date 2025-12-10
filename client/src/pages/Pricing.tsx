import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Loader2, Bot, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Dual Pricing Page
 * Toggle between AI Coaching and Human Coaching
 * Individual/family focused (not enterprise)
 */
export default function Pricing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [coachingType, setCoachingType] = useState<"ai" | "human">("ai");

  // Disable subscription check for guest users (causes 401 errors)
  const { data: currentSub } = trpc.subscriptions.getMySubscription.useQuery(undefined, {
    enabled: false, // Always disabled - guests don't need to see "Current Plan"
  });
  const createCheckout = trpc.subscriptions.createCheckoutSession.useMutation();

  const handleSubscribe = async (tier: string, price: number) => {
    setLoadingTier(tier);
    try {
      const result = await createCheckout.mutateAsync({
        tier: tier as "ai_basic" | "ai_premium" | "ai_elite" | "human_basic" | "human_premium" | "human_elite",
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

  const isCurrentTier = (tier: string) => {
    return currentSub?.tier === tier && currentSub?.status === "active";
  };

  // AI Coaching Tiers
  const aiTiers = [
    {
      id: "ai_basic",
      name: "Basic",
      price: 29,
      description: "Start your journey 24/7",
      icon: <Sparkles className="h-6 w-6" />,
      color: "border-blue-500",
      popular: false,
      features: [
        "24/7 AI coaching via text",
        "Unlimited conversations",
        "Crisis detection & alerts",
        "Progress tracking",
        "Mobile & desktop access",
      ],
    },
    {
      id: "ai_premium",
      name: "Premium",
      price: 149,
      description: "AI + 1 human session",
      icon: <Zap className="h-6 w-6" />,
      color: "border-purple-500",
      popular: true,
      features: [
        "Everything in Basic",
        "1 live session per month (30 min)",
        "Priority email support",
        "Personalized action plans",
        "Session recordings",
      ],
    },
    {
      id: "ai_elite",
      name: "Elite",
      price: 299,
      description: "AI + 4 human sessions",
      icon: <Crown className="h-6 w-6" />,
      color: "border-amber-500",
      popular: false,
      features: [
        "Everything in Premium",
        "4 live sessions per month (30 min each)",
        "Priority scheduling (same-day available)",
        "Text, email & phone support",
        "Comprehensive wellness plans",
        "Family support resources",
        "Dedicated coach relationship",
      ],
    },
  ];

  // Human Coaching Tiers
  const humanTiers = [
    {
      id: "human_basic",
      name: "Starter",
      price: 800,
      description: "2 personal sessions + AI access",
      icon: <Users className="h-6 w-6" />,
      color: "border-emerald-500",
      popular: false,
      features: [
        "2 live sessions per month (60 min each)",
        "24/7 AI coaching between sessions",
        "Email support",
        "Progress tracking",
        "Session recordings",
      ],
    },
    {
      id: "human_premium",
      name: "Professional",
      price: 1200,
      description: "4 sessions + priority support",
      icon: <Zap className="h-6 w-6" />,
      color: "border-purple-500",
      popular: true,
      features: [
        "4 live sessions per month (60 min each)",
        "24/7 AI coaching between sessions",
        "Priority scheduling",
        "Text, email & phone support (business hours)",
        "Personalized action plans",
        "Family resources library",
      ],
    },
    {
      id: "human_elite",
      name: "Elite",
      price: 2000,
      description: "8 sessions + 24/7 direct coach access",
      icon: <Crown className="h-6 w-6" />,
      color: "border-amber-500",
      popular: false,
      features: [
        "8 live sessions per month (60 min each)",
        "24/7 AI coaching + direct coach texting",
        "Text, email & phone support (24/7 priority)",
        "Direct coach personal number",
        "Emergency session availability (same-day)",
        "Custom coaching & life plans",
        "Custom family resources & workshops",
        "Spouse/partner sessions included (2/month)",
      ],
    },
  ];

  const activeTiers = coachingType === "ai" ? aiTiers : humanTiers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="container py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-900">
            Flexible Pricing for Your Journey
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Choose Your Path to Wellness
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you prefer AI-powered coaching or personal human guidance, we're here to help you achieve emotional, mental, physical, nutritional, and spiritual wellness.
          </p>
        </div>

        {/* Toggle: AI vs Human Coaching */}
        <Tabs value={coachingType} onValueChange={(v) => setCoachingType(v as "ai" | "human")} className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14">
            <TabsTrigger value="ai" className="text-base">
              <Bot className="h-5 w-5 mr-2" />
              AI Coaching
            </TabsTrigger>
            <TabsTrigger value="human" className="text-base">
              <Users className="h-5 w-5 mr-2" />
              Human Coaching
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {activeTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative ${tier.color} border-2 ${
                tier.popular ? "shadow-2xl scale-105" : "shadow-lg"
              } transition-all hover:shadow-xl`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-6">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-fit">
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier.id, tier.price)}
                  disabled={loadingTier === tier.id || isCurrentTier(tier.id)}
                >
                  {loadingTier === tier.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentTier(tier.id) ? (
                    "Current Plan"
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600 mb-4">
            ✓ 7-day free trial • ✓ Cancel anytime • ✓ No long-term contracts
          </p>
          <p className="text-xs text-gray-500">
            Join hundreds of individuals on their wellness journey
          </p>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Questions?</h3>
          <p className="text-gray-600 mb-4">
            All plans include crisis detection, progress tracking, and mobile access. Human coaching plans include AI support between sessions for perfect continuity.
          </p>
          <Button variant="link" onClick={() => setLocation("/")}>
            Learn more about our approach →
          </Button>
        </div>
      </div>
    </div>
  );
}
