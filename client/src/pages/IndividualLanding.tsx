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
import { Link, useLocation } from "wouter";
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
      id: "free_discovery",
      name: "Free Discovery",
      price: 0,
      description: "Try before you commit",
      icon: <Sparkles className="h-6 w-6" />,
      color: "border-green-500",
      popular: false,
      features: [
        "15-minute discovery call",
        "Meet your coach",
        "Discuss your goals",
        "No commitment required",
        "Book instantly",
      ],
      isFree: true,
    },
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
      description: "Ultimate AI wellness",
      icon: <Crown className="h-6 w-6" />,
      color: "border-amber-500",
      popular: false,
      features: [
        "Everything in Premium",
        "All 34 wellness modules unlocked",
        "UNLIMITED AI messages (vs 500 limit in Premium)",
        "Fully customizable AI coaching experience & preferences",
        "AI-powered comprehensive LIFE planning (beyond wellness)",
        "ADVANCED progress analytics & predictive insights",
        "Custom AI coaching plans tailored to your unique goals",
        "Family wellness resources (spouse & children support)",
      ],
    },
  ];

  const humanTiers = [
    {
      id: "free_discovery_human",
      name: "Free Discovery",
      price: 0,
      description: "Try before you commit",
      icon: <Sparkles className="h-6 w-6" />,
      color: "border-green-500",
      popular: false,
      features: [
        "15-minute discovery call",
        "Meet your coach",
        "Discuss your goals",
        "No commitment required",
        "Book instantly",
      ],
      isFree: true,
    },
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
            <span className="ml-2 px-2 py-1 text-xs font-bold uppercase bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full">Beta</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Transform Your Life with AI-Powered<br />Evidence-Based Coaching
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Meet Sage—your warm, wise AI life coach trained on cutting-edge research from Huberman, Attia, Walker, and leading scientists. Start your transformation journey in seconds—no signup required.
          </p>

          {/* Direct Access - Frictionless Onboarding */}
          <div className="max-w-md mx-auto mb-8">
            <Link href="/ai-coach">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-8 text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="h-8 w-8 mr-3" />
                Talk to Sage Now →
              </Button>
            </Link>
            <p className="text-sm text-center text-gray-600 mt-4">
              No signup required • Start instantly • 100% free to try
            </p>
          </div>

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
            Talk to Sage anytime, day or night.
          </p>

          {/* Social Proof - Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">34</div>
              <div className="text-sm text-gray-600">Wellness Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Evidence-Based</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Signup Required</div>
            </div>
          </div>

          {/* What Makes Sage Different */}
          <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">What makes Sage different?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Genuinely Empathetic</div>
                  <div className="text-sm text-gray-600">Not a chatbot. A companion who truly cares.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Science-Backed</div>
                  <div className="text-sm text-gray-600">Trained on Huberman, Attia, Walker research.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Remembers You</div>
                  <div className="text-sm text-gray-600">Your story matters. Sage remembers every detail.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Instant Value</div>
                  <div className="text-sm text-gray-600">No forms, no waiting. Help starts immediately.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Wellness Modules - Integrated */}
      <div className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-900 text-base px-4 py-2">
              34 Evidence-Based Modules
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Complete Wellness Transformation
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform every area of your life with our comprehensive, science-backed wellness system. All modules included in every plan.
            </p>
            <Link to="/wellness-modules">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Explore All 34 Modules
              </Button>
            </Link>
          </div>

          {/* Featured Core Modules */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {modules.map((module, idx) => (
              <Card key={idx} className="border-2 hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Module Categories Summary */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm font-semibold text-gray-700">Core Pillars</div>
              <div className="text-xs text-gray-500 mt-1">Essential foundation</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-sm font-semibold text-gray-700">Lifestyle</div>
              <div className="text-xs text-gray-500 mt-1">Daily wellness</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">8</div>
              <div className="text-sm font-semibold text-gray-700">Growth</div>
              <div className="text-xs text-gray-500 mt-1">Personal development</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl font-bold text-indigo-600 mb-2">8</div>
              <div className="text-sm font-semibold text-gray-700">Advanced</div>
              <div className="text-xs text-gray-500 mt-1">Deep transformation</div>
            </div>
          </div>
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
                  className={`w-full ${tier.isFree ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                  size="lg"
                  variant={tier.popular ? "default" : tier.isFree ? "default" : "outline"}
                  onClick={() => tier.isFree ? setLocation('/sessions/book') : handleSubscribe(tier.id)}
                  disabled={loadingTier === tier.id}
                >
                  {loadingTier === tier.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : tier.isFree ? (
                    "Book Free Call →"
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
