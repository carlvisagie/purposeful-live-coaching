import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Brain,
  Activity,
  Apple,
  Sparkles,
  Phone,
  Check,
  Zap,
  Crown,
  Bot,
  Users,
  Loader2,
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";

export default function IndividualLanding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [coachingType, setCoachingType] = useState<"ai" | "human">("ai");

  const createCheckout = trpc.subscriptions.createCheckoutSession.useMutation();

  const handleSubscribe = async (tier: string) => {
    setLoadingTier(tier);
    try {
      const result = await createCheckout.mutateAsync({
        tier: tier as "ai_basic" | "ai_premium" | "ai_elite" | "human_basic" | "human_premium" | "human_elite",
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/`,
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

  const modules = [
    {
      icon: <Heart className="h-8 w-8 text-rose-500" />,
      title: "Emotional Wellness",
      description: "Master your emotions and build resilience",
      color: "bg-rose-50",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Mental Health",
      description: "Clarity, focus, and peace of mind",
      color: "bg-purple-50",
    },
    {
      icon: <Activity className="h-8 w-8 text-emerald-500" />,
      title: "Physical Fitness",
      description: "Strength, energy, and vitality",
      color: "bg-emerald-50",
    },
    {
      icon: <Apple className="h-8 w-8 text-orange-500" />,
      title: "Nutrition",
      description: "Fuel your body for optimal performance",
      color: "bg-orange-50",
    },
  ];

  const aiTiers = [
    {
      id: "ai_basic",
      name: "AI Chat",
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
      name: "AI + Monthly Check-in",
      price: 149,
      description: "AI + 1 human session",
      icon: <Zap className="h-6 w-6" />,
      color: "border-purple-500",
      popular: true,
      features: [
        "Everything in AI Chat",
        "1 live session per month (30 min)",
        "Priority email support",
        "Personalized action plans",
        "Session recordings",
      ],
    },
    {
      id: "ai_elite",
      name: "AI + Weekly Support",
      price: 299,
      description: "AI + 4 human sessions",
      icon: <Crown className="h-6 w-6" />,
      color: "border-amber-500",
      popular: false,
      features: [
        "Everything in AI Premium",
        "4 live sessions per month (30 min each)",
        "Priority scheduling",
        "Text & email support",
        "Custom coaching plans",
        "Family support resources",
      ],
    },
  ];

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
        "24/7 AI coaching",
        "Priority scheduling",
        "Text, email & phone support",
        "Custom action plans",
        "Family resources",
      ],
    },
    {
      id: "human_elite",
      name: "Elite",
      price: 2000,
      description: "8 sessions + 24/7 access to your coach",
      icon: <Crown className="h-6 w-6" />,
      color: "border-amber-500",
      popular: false,
      features: [
        "8 live sessions per month (60 min each)",
        "24/7 AI coaching",
        "Direct coach access (text/email)",
        "Emergency session availability",
        "Comprehensive life planning",
        "Spouse/partner sessions included",
      ],
    },
  ];

  const activeTiers = coachingType === "ai" ? aiTiers : humanTiers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Purposeful Live Coaching
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Transform Your Life with AI-Powered<br />Evidence-Based Coaching
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant support from an AI coach trained on cutting-edge research from Huberman, Attia, Walker, and leading scientists. Start your transformation journey in seconds—no signup required.
          </p>

          {/* Big Purple Button */}
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-8 text-xl font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all mb-4"
            onClick={() => setLocation("/ai-coach")}
          >
            <Sparkles className="h-6 w-6 mr-3" />
            Start Talking to Your AI Coach Now
          </Button>
          
          <p className="text-sm text-gray-500 mb-8">
            No signup. No credit card. Just start talking.
          </p>

          {/* OR Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto mb-8">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Call Option */}
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
            onClick={() => window.location.href = "tel:+15645296454"}
          >
            <Phone className="h-5 w-5 mr-2" />
            Call 24/7: +1 (564) 529-6454
          </Button>
          
          <p className="text-sm text-gray-500 mt-2">
            Talk to your AI coach anytime, day or night.
          </p>
        </div>
      </div>

      {/* Wellness Modules */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            Comprehensive Wellness Modules
          </h3>
          <p className="text-lg text-gray-600">
            Achieve emotional, mental, physical, nutritional, and spiritual wellness
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
          {modules.map((module, idx) => (
            <Card key={idx} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center mb-4`}>
                  {module.icon}
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="link" className="text-purple-600 text-lg">
            Explore All 31 Wellness Modules →
          </Button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-900">
            Flexible Pricing for Your Journey
          </Badge>
          <h3 className="text-4xl font-bold mb-4 text-gray-900">
            Choose Your Path to Wellness
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you prefer AI-powered coaching or personal human guidance, we're here to help you achieve your goals.
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
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={loadingTier === tier.id}
                >
                  {loadingTier === tier.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
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
      </div>
    </div>
  );
}
