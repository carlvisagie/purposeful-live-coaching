import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Brain,
  Sparkles,
  Phone,
  Star,
} from "lucide-react";
import { Link } from "wouter";

/**
 * STRESS & ANXIETY LANDING PAGE
 * 
 * Target: People experiencing stress, anxiety, overwhelm
 * Focus: Immediate relief, empathy, 24/7 availability
 * CTA: Start talking to AI Coach NOW
 */
export default function StressAnxietyLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section - Empathetic & Immediate */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Badge */}
          <Badge className="mb-6 bg-green-100 text-green-700 px-4 py-2 text-sm">
            <Clock className="h-4 w-4 mr-2 inline" />
            Available Right Now - No Waiting
          </Badge>

          {/* Empathetic Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Feeling Overwhelmed?
            <span className="block text-blue-600 mt-2">You Don't Have to Face It Alone</span>
          </h1>

          {/* Validation */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether it's racing thoughts at 3am, work pressure, or just feeling stuck — 
            our AI coach is here to listen and help you find calm. <strong>Right now.</strong>
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/ai-coach">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full shadow-lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Talking Now - It's Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              100% Confidential
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              Available 24/7
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-rose-500" />
              No Judgment
            </span>
          </div>
        </div>
      </section>

      {/* Immediate Relief Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Get Relief in Minutes, Not Weeks
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Talk It Out</h3>
                <p className="text-gray-600 text-sm">
                  Express what you're feeling without fear. Our AI listens without judgment and helps you process emotions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Evidence-Based Techniques</h3>
                <p className="text-gray-600 text-sm">
                  Get guided through proven methods like breathing exercises, grounding, and cognitive reframing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Feel Better Fast</h3>
                <p className="text-gray-600 text-sm">
                  Most people feel calmer within 5-10 minutes. Build lasting resilience with continued practice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            You're Not Alone
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "I was having a panic attack at 2am. The AI coach walked me through breathing exercises and helped me calm down. It felt like having a supportive friend available whenever I needed one."
                </p>
                <p className="text-sm text-gray-500">— Sarah M., Teacher</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Work stress was destroying my sleep. After just one week of using the AI coach, I learned techniques that actually work. I finally feel in control again."
                </p>
                <p className="text-sm text-gray-500">— Michael R., Software Engineer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Your Personal Stress Relief Toolkit
          </h2>

          <div className="space-y-4">
            {[
              "24/7 AI coach available whenever anxiety strikes",
              "Guided breathing and grounding exercises",
              "Cognitive behavioral techniques (CBT) for racing thoughts",
              "Progress tracking to see your improvement",
              "Crisis detection with immediate support resources",
              "Completely confidential - your privacy protected",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take the First Step Right Now
          </h2>
          <p className="text-xl text-white/90 mb-8">
            You don't have to wait for an appointment. Start feeling better in the next 5 minutes.
          </p>

          <Link href="/ai-coach">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Your Free Session
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>

          <p className="mt-6 text-sm text-white/70">
            Free to start • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Crisis Footer */}
      <section className="py-6 px-4 bg-gray-900 text-white text-center">
        <p className="text-sm">
          <Phone className="h-4 w-4 inline mr-2" />
          If you're in crisis, please call <strong>988</strong> (Suicide & Crisis Lifeline) or text HOME to <strong>741741</strong>
        </p>
      </section>
    </div>
  );
}
