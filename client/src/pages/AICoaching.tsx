import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Shield, Clock, TrendingUp, Heart, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

/**
 * AI-First Coaching Landing Page
 * Following Master Prompt principles: Hero → Stakes → Services → Process → Proof → FAQ → CTA
 * Hidden until activated by coach via dashboard toggle
 */
export default function AICoaching() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [availableSpots, setAvailableSpots] = useState(40);

  // Fetch AI products
  const { data: aiProducts, isLoading } = trpc.stripe.getAIProducts.useQuery();

  // Subscribe mutation
  const subscribeMutation = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleSubscribe = (productId: string) => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }

    // Convert product key to uppercase for type safety
    subscribeMutation.mutate({ productId: productId.toUpperCase() });
  };

  // Simulate scarcity (always show minimum 1 spot)
  useEffect(() => {
    const spots = Math.max(1, Math.floor(Math.random() * 3) + 1);
    setAvailableSpots(spots);
  }, []);

  const getUrgencyColor = (spots: number) => {
    if (spots <= 1) return "text-red-600 bg-red-50";
    if (spots <= 2) return "text-orange-600 bg-orange-50";
    return "text-yellow-600 bg-yellow-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>24/7 AI-Powered Coaching</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Never Face Your Struggles <span className="text-purple-600">Alone</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant emotional support, crisis detection, and personalized coping strategies from our AI coach—available 24/7, even at 3 AM when you need it most.
          </p>

          {/* Scarcity Banner */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg mb-8 ${getUrgencyColor(availableSpots)}`}>
            <Zap className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">
              Join thousands getting results with 24/7 AI coaching
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Your Transformation
            </Button>

          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>24/7 Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span>Crisis Detection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stakes Section - What happens if you don't act */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              The Cost of Waiting
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 bg-white border-red-200">
                <h3 className="text-xl font-bold text-red-600 mb-4">Without AI Coaching</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Struggle alone during late-night anxiety attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Wait days or weeks for your next therapy appointment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Miss early warning signs of emotional crisis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Pay $150-300 per traditional therapy session</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <h3 className="text-xl font-bold text-purple-600 mb-4">With AI Coaching</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Instant support whenever you need it—even at 3 AM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Unlimited daily check-ins and coaching conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Automatic crisis detection with human coach escalation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Affordable monthly subscription starting at $49</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - What you get */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Your AI Coach Never Sleeps
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Get the support you need, exactly when you need it
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">24/7 AI Chat</h3>
                <p className="text-gray-600">
                  Talk to your AI coach anytime, anywhere. No appointments needed.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Crisis Detection</h3>
                <p className="text-gray-600">
                  AI monitors for warning signs and escalates to human coach when needed.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
                <p className="text-gray-600">
                  Visualize your emotional patterns and celebrate your growth.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - How it works */}
      <section id="how-it-works" className="bg-gray-50 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How AI Coaching Works
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Choose Your Plan",
                  description: "Select the AI coaching tier that fits your needs and budget.",
                },
                {
                  step: 2,
                  title: "Start Chatting Immediately",
                  description: "Access your AI coach 24/7 through our secure platform. No waiting.",
                },
                {
                  step: 3,
                  title: "Track Your Progress",
                  description: "Daily check-ins, emotion tracking, and personalized insights help you grow.",
                },
                {
                  step: 4,
                  title: "Get Human Support When Needed",
                  description: "Crisis detection automatically escalates to a human coach for urgent situations.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Choose Your AI Coaching Plan
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Affordable, unlimited support—starting at just $49/month
            </p>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {aiProducts?.map((product: any) => (
                  <Card
                    key={product.id}
                    className={`p-8 relative ${
                      product.featured ? "border-2 border-purple-600 shadow-xl" : ""
                    }`}
                  >
                    {product.featured && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </div>
                    )}

                    <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold">${product.priceMonthly / 100}</span>
                      <span className="text-gray-600">/month</span>
                    </div>

                    <Button
                      className="w-full mb-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => handleSubscribe(product.id)}
                      disabled={subscribeMutation.isPending}
                    >
                      {subscribeMutation.isPending ? "Processing..." : "Start Now"}
                    </Button>

                    <ul className="space-y-3">
                      {product.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            )}

            {/* Money-back guarantee */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-lg">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">90-Day Money-Back Guarantee</span>
              </div>
              <p className="text-gray-600 mt-4">
                Not seeing results? Get a full refund within 90 days. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Section - Testimonials */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Real Results from Real People
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                    SM
                  </div>
                  <div>
                    <div className="font-bold">Sarah M.</div>
                    <div className="text-sm text-gray-600">AI Growth Plan</div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Having 24/7 access to my AI coach changed everything. I used to spiral during late-night anxiety attacks. Now I have instant support whenever I need it."
                </p>
                <div className="text-sm text-purple-600 font-semibold">
                  Anxiety reduced by 65% in 6 weeks
                </div>
              </Card>

              <Card className="p-6 bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    JR
                  </div>
                  <div>
                    <div className="font-bold">James R.</div>
                    <div className="text-sm text-gray-600">AI Transformation Plan</div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "The crisis detection feature literally saved my life. The AI noticed warning signs I didn't even recognize and connected me with a human coach immediately."
                </p>
                <div className="text-sm text-blue-600 font-semibold">
                  Crisis intervention within 15 minutes
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Is AI coaching as effective as human therapy?",
                  a: "AI coaching is designed to complement, not replace, human therapy. It provides 24/7 support, crisis detection, and evidence-based coping strategies. For serious mental health conditions, we recommend combining AI coaching with professional therapy.",
                },
                {
                  q: "What happens during a crisis?",
                  a: "Our AI monitors every conversation for crisis indicators (suicidal ideation, self-harm, severe depression). When detected, you're immediately connected with a human coach and given emergency resources. Response time is typically under 15 minutes.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes! Cancel your subscription anytime with one click. No contracts, no cancellation fees. Plus, we offer a 90-day money-back guarantee if you're not satisfied.",
                },
                {
                  q: "Is my data secure?",
                  a: "Absolutely. We use bank-level encryption, comply with HIPAA standards, and never share your data with third parties. Your conversations are completely confidential.",
                },
              ].map((faq, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Transformation Starts Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who've found relief, growth, and hope with 24/7 AI coaching.
            </p>

            {/* Scarcity reminder */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-lg mb-8">
              <Zap className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">
                Only {availableSpots} {availableSpots === 1 ? "spot" : "spots"} remaining this week
              </span>
            </div>

            <Button
              size="lg"
              className="text-lg px-12 py-6 bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Choose Your Plan Now
            </Button>

            <p className="mt-6 text-sm opacity-75">
              90-day money-back guarantee • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
