import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Zap,
  Moon,
  Brain,
  CheckCircle2,
  ArrowRight,
  Star,
  Sparkles,
  MessageCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useLocation } from "wouter";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { LiveChatWidget } from "@/components/LiveChatWidget";

/**
 * Individual Landing Page
 * Promotes new subscription model: $29/$149/$299 per month
 * AI-first with human session upgrades
 */
export default function IndividualLanding() {
  const [, setLocation] = useLocation();
  const [showExitPopup, setShowExitPopup] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= window.innerHeight * 0.05 && !showExitPopup) {
        const hasShown = sessionStorage.getItem("exitPopupIndividual");
        if (!hasShown) {
          setShowExitPopup(true);
          sessionStorage.setItem("exitPopupIndividual", "true");
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [showExitPopup]);

  return (
    <div className="min-h-screen bg-white">
      <ExitIntentPopup
        open={showExitPopup}
        onClose={() => setShowExitPopup(false)}
        type="individual"
      />
      <LiveChatWidget type="individual" routeToTeam="support" />
      
      {/* HERO SECTION - Emotional Focus */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-emerald-200 text-emerald-900">
              For You
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Feel Calm, Confident & In Control Again
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              You're overwhelmed. Stressed. Maybe you can't sleep. Your mind won't stop racing. You know you need help, but therapy wait lists are months long.
            </p>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-semibold text-emerald-700">
              What if you had a personal AI coach available 24/7? Someone who listens without judgment. Who helps you process emotions in real-time. Who's always there when you need them most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                onClick={() => setLocation("/pricing")}
              >
                Start 7-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS - What You're Feeling */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              You're Not Alone
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Millions struggle with stress, anxiety, and overwhelm. Here's what you might be experiencing:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Moon,
                title: "Can't Sleep",
                description: "Your mind races at night. You're exhausted but can't turn off your thoughts.",
              },
              {
                icon: Brain,
                title: "Constant Worry",
                description: "Anxiety about work, relationships, the future. It never stops.",
              },
              {
                icon: Heart,
                title: "Feeling Alone",
                description: "No one understands what you're going through. You feel isolated.",
              },
              {
                icon: Zap,
                title: "Overwhelmed",
                description: "Too much to do. Too little time. You're drowning in responsibilities.",
              },
            ].map((pain, idx) => (
              <Card key={idx} className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <pain.icon className="h-12 w-12 text-emerald-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{pain.title}</h3>
                  <p className="text-gray-600 text-sm">{pain.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION - How It Works */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your AI Coach Is Always There
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant support whenever you need it. No appointments. No waiting. Just open the app and start talking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "24/7 AI Support",
                description: "Chat anytime, day or night. Your AI coach never sleeps and is always ready to listen.",
              },
              {
                icon: Calendar,
                title: "Add Human Sessions",
                description: "Upgrade to include monthly check-ins with a real human coach for deeper support.",
              },
              {
                icon: TrendingUp,
                title: "Track Your Progress",
                description: "See your emotional patterns, celebrate wins, and understand what helps you feel better.",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="border-2 border-emerald-200">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real People, Real Results
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Marketing Manager",
                quote: "I finally sleep through the night. The AI coach helped me process my work anxiety in ways therapy never did.",
                rating: 5,
              },
              {
                name: "James K.",
                role: "Software Engineer",
                quote: "Having someone available at 2am when I'm spiraling? Life-changing. I don't feel alone anymore.",
                rating: 5,
              },
              {
                name: "Lisa P.",
                role: "Teacher",
                quote: "The monthly human check-ins keep me accountable. The AI handles the daily stuff. Perfect combination.",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-2 border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include a 7-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "AI-Only",
                price: "$29",
                period: "/month",
                description: "24/7 AI coaching support",
                features: [
                  "Unlimited AI chat",
                  "Crisis detection",
                  "Emotion tracking",
                  "Progress insights",
                ],
                cta: "Start Free Trial",
                popular: false,
              },
              {
                name: "Hybrid",
                price: "$149",
                period: "/month",
                description: "AI + 1 human session/month",
                features: [
                  "Everything in AI-Only",
                  "1 human coaching session",
                  "Priority support",
                  "Advanced insights",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Premium",
                price: "$299",
                period: "/month",
                description: "AI + 4 human sessions/month",
                features: [
                  "Everything in Hybrid",
                  "4 human coaching sessions",
                  "Custom goal tracking",
                  "Family resources",
                ],
                cta: "Start Free Trial",
                popular: false,
              },
            ].map((tier, idx) => (
              <Card
                key={idx}
                className={`relative border-2 ${
                  tier.popular ? "border-emerald-500 shadow-lg" : "border-gray-200"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white px-4 py-1">
                      <Sparkles className="h-3 w-3 mr-1 inline" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      tier.popular
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    onClick={() => setLocation("/pricing")}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Save 17% with yearly billing • Cancel anytime
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation("/pricing")}
            >
              View All Pricing Options
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is this a replacement for therapy?",
                a: "No. This is a supportive tool for emotional wellness. If you're in crisis, please reach out to a mental health professional or crisis line.",
              },
              {
                q: "How is my data kept private?",
                a: "Your conversations are encrypted and stored securely. We never share your data with third parties. HIPAA compliant.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel your subscription anytime with no penalties. You'll keep access until the end of your billing period.",
              },
              {
                q: "What's included in the free trial?",
                a: "Full access to all features of your chosen plan for 7 days. No credit card required. Cancel before the trial ends and you won't be charged.",
              },
              {
                q: "How quickly does it work?",
                a: "Many people feel better after their first conversation. Real transformation takes time, but you'll notice improvements in mood and stress within weeks.",
              },
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            You Deserve to Feel Better
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Your AI coach is ready to support you. Start your 7-day free trial today.
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
            onClick={() => setLocation("/pricing")}
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-emerald-100 mt-4">
            No credit card required • Cancel anytime • Save 17% with yearly billing
          </p>
        </div>
      </section>
    </div>
  );
}
