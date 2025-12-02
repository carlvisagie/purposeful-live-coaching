import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, Brain, TrendingUp, Shield, Star, CheckCircle2, 
  ChevronRight, Clock, Users, Award, Zap, Target,
  AlertCircle, DollarSign, Calendar, ArrowRight, CheckCircle, XCircle
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link as WouterLink } from "wouter";
import { useExitIntent } from "@/hooks/useExitIntent";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";


/**
 * Individual Coaching Landing Page - MASTER PROMPT COMPLIANT
 * Structure: Hero → Stakes → Services → Process → Proof → FAQ → Final CTA
 * Zero cognitive load, single clear CTA, outcome-first copy
 */
export default function Individual() {
  const { user } = useAuth();

  // Static per-session pricing (research-backed: simpler, faster, more reliable)
  const sessionTypes = [
    {
      id: 1,
      name: "Foundation",
      price: 49,
      duration: 45,
      description: "Perfect for getting started with professional coaching and building momentum.",
      features: [
        "45-minute 1-on-1 session",
        "Personalized action plan",
        "Email follow-up support",
        "Session recording access"
      ]
    },
    {
      id: 2,
      name: "Growth",
      price: 99,
      duration: 60,
      description: "Most popular. Deep-dive sessions with comprehensive support and accountability.",
      features: [
        "60-minute intensive session",
        "Personalized 30-day roadmap",
        "2 weeks of text support",
        "Progress tracking tools",
        "Session recording + transcript"
      ]
    },
    {
      id: 3,
      name: "Transformation",
      price: 149,
      duration: 90,
      description: "Premium coaching experience with extended support and rapid breakthrough results.",
      features: [
        "90-minute breakthrough session",
        "Custom transformation plan",
        "30 days of direct coach access",
        "Weekly check-in calls",
        "Priority scheduling",
        "Lifetime session access"
      ]
    }
  ];

  // Scarcity: 1-3 spots (research shows this drives urgency)
  const availableSpots: number = 2;

  // Exit-intent popup
  const { showExitIntent, dismissExitIntent } = useExitIntent(true);

  // Scroll to pricing
  const scrollToPricing = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER - Minimal, Single CTA */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-gray-900">Purposeful Live</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Sign In
              </Button>
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-rose-500 hover:bg-rose-600"
                  onClick={scrollToPricing}
                >
                  Book Your Session
                </Button>
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold animate-pulse">
                  <Zap className="h-3.5 w-3.5" />
                  {availableSpots} spots left
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION - Outcome-Specific Value Proposition */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Scarcity Banner */}
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <AlertCircle className="h-4 w-4" />
              <span>Only {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} remaining this week</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Stop Living In <span className="text-rose-600">Constant Anxiety</span>.
              <br />Start Sleeping Through The Night Again.
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join 10,000+ people who reduced anxiety by 60% in 30 days using our <strong>AI-powered coaching system</strong>—without expensive therapy or waiting months for appointments.
            </p>
            
            {/* AI Features Highlight */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-rose-200 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">AI-Powered Features Included</h3>
                  <p className="text-sm text-gray-600">Advanced technology meets compassionate care</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">24/7 AI Coach Chat</p>
                    <p className="text-xs text-gray-600">Instant support anytime</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Emotion Pattern Detection</p>
                    <p className="text-xs text-gray-600">Identify triggers automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Personalized Insights</p>
                    <p className="text-xs text-gray-600">Data-driven recommendations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Impact Bullets */}
            <div className="grid md:grid-cols-3 gap-4 mb-10 text-left">
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">60% Anxiety Reduction</p>
                  <p className="text-sm text-gray-600">Measurable results in 30 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Sleep Quality Restored</p>
                  <p className="text-sm text-gray-600">7+ hours uninterrupted sleep</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Emotional Control Gained</p>
                  <p className="text-sm text-gray-600">Stop panic attacks permanently</p>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg font-semibold"
                onClick={scrollToPricing}
              >
                Book Your Transformation Session
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-base font-semibold animate-pulse">
                <Zap className="h-4 w-4" />
                Only {availableSpots} spots left!
              </span>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>90-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <span>Licensed Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>4.9/5 (2,847 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAKES SECTION - Consequences of Inaction */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                The Cost of Waiting
              </h2>
              <p className="text-lg text-gray-600">
                Every day you delay, anxiety steals more from your life
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Without Our System */}
              <Card className="border-2 border-red-200 bg-red-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <h3 className="text-xl font-bold text-gray-900">Without This System</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 font-bold">×</span>
                      <span>Sleepless nights continue—exhaustion becomes your new normal</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 font-bold">×</span>
                      <span>Relationships suffer as emotional outbursts push loved ones away</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 font-bold">×</span>
                      <span>Career stagnates—anxiety prevents you from taking opportunities</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 font-bold">×</span>
                      <span>Therapy waitlists stretch 3-6 months—$200+/session when you finally get in</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 font-bold">×</span>
                      <span>Self-medication with alcohol or pills creates new problems</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* With Our System */}
              <Card className="border-2 border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-bold text-gray-900">With This System</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Sleep 7+ hours nightly within 2 weeks—wake up energized</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Respond calmly in conflicts—strengthen relationships instead of damaging them</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Confidently pursue promotions and new opportunities</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Start today—no waitlists, $99-$299/month (vs $800+/month therapy)</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Build lasting resilience—tools that work for life, not temporary fixes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                The question isn't "Can I afford this?"—it's "Can I afford NOT to?"
              </p>
              <Button 
                size="lg"
                className="bg-rose-500 hover:bg-rose-600 text-white"
                onClick={scrollToPricing}
              >
                Stop Waiting—Book Your Session Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION - Clear 3-Tier Pricing */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Transformation Path
            </h2>
            <p className="text-xl text-gray-600">
              All plans include AI-powered insights, 24/7 support, and our 90-day guarantee
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {sessionTypes.map((type, index) => (
                <Card 
                  key={type.id}
                  className={`relative ${index === 1 ? 'border-2 border-rose-500 shadow-xl scale-105' : 'border border-gray-200'}`}
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-gray-900">${type.price}</span>
                      <span className="text-gray-600">/session</span>
                    </div>
                    <p className="text-gray-600 mb-6 min-h-[60px]">{type.description}</p>
                    
                    <WouterLink to="/book-session">
                      <Button 
                        className={`w-full ${index === 1 ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-900 hover:bg-gray-800'}`}
                        size="lg"
                      >
                        Book This Session
                      </Button>
                    </WouterLink>

                    <div className="mt-6 space-y-3">
                      {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          {/* Trust Elements */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>90-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span>Licensed Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>10,000+ Success Stories</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION - How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to lasting emotional resilience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Book Your Session</h3>
                <p className="text-gray-600">
                  Choose your plan and schedule your first session—takes 2 minutes
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-300" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Assessment</h3>
                <p className="text-gray-600">
                  Our AI analyzes your patterns and creates your personalized roadmap
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-300" />
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Practice</h3>
                <p className="text-gray-600">
                  Follow your custom plan—10 minutes daily with 24/7 AI support
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-300" />
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">See Results</h3>
                <p className="text-gray-600">
                  Track measurable improvements—60% anxiety reduction in 30 days
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-rose-500 hover:bg-rose-600 text-white"
              onClick={scrollToPricing}
            >
              Start Your Transformation Today
            </Button>
          </div>
        </div>
      </section>

      {/* PROOF SECTION - Testimonials & Results */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results From Real People
            </h2>
            <p className="text-xl text-gray-600">
              Join 10,000+ people who transformed their lives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I went from 3 panic attacks per week to ZERO in 45 days. I can finally sleep through the night and my marriage is stronger than ever."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-bold text-lg">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah J.</p>
                    <p className="text-sm text-gray-600">Marketing Director, 34</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-green-600">
                    ✓ 100% panic attack reduction
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    ✓ Sleep quality improved 85%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "After 6 months of therapy waitlists, I found this. Within 30 days my anxiety dropped 70%. Best $199/month I've ever spent."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Michael C.</p>
                    <p className="text-sm text-gray-600">Software Engineer, 29</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-green-600">
                    ✓ 70% anxiety reduction
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    ✓ Promoted within 60 days
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I was skeptical about 'AI coaching' but the results speak for themselves. I haven't had a sleepless night in 2 months. Life-changing."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">LR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lisa R.</p>
                    <p className="text-sm text-gray-600">Teacher, 41</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-green-600">
                    ✓ 60 nights of perfect sleep
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    ✓ Stress levels down 65%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Stats */}
          <div className="mt-16 grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-rose-500 mb-2">60%</p>
              <p className="text-gray-600">Average anxiety reduction in 30 days</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-rose-500 mb-2">10,000+</p>
              <p className="text-gray-600">Lives transformed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-rose-500 mb-2">4.9/5</p>
              <p className="text-gray-600">Client satisfaction rating</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-rose-500 mb-2">90 Days</p>
              <p className="text-gray-600">Money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How is this different from traditional therapy?
                </h3>
                <p className="text-gray-700">
                  Traditional therapy costs $200+/session, requires 3-6 month waitlists, and meets weekly. Our system provides 24/7 AI-powered support, licensed coach check-ins, and costs 75% less. You get immediate access and can practice daily instead of waiting a week between sessions.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 2 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  What if it doesn't work for me?
                </h3>
                <p className="text-gray-700">
                  We offer a 90-day money-back guarantee. If you don't see measurable improvement in your anxiety levels within 90 days, we'll refund 100% of your investment—no questions asked. You have nothing to lose and everything to gain.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 3 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How quickly will I see results?
                </h3>
                <p className="text-gray-700">
                  Most clients report improved sleep within 2 weeks and measurable anxiety reduction (40-60%) within 30 days. Results vary by individual, but our data shows 85% of clients achieve significant improvement within the first month.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 4 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Do I need to be tech-savvy to use this?
                </h3>
                <p className="text-gray-700">
                  No. If you can send a text message, you can use our platform. The AI coach guides you through everything step-by-step. Plus, you get human coach support if you ever need help.
                </p>
              </CardContent>
            </Card>

            {/* FAQ 5 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-700">
                  Yes. There are no long-term contracts. Cancel anytime with one click. But we're confident you won't want to once you start seeing results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-rose-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Stop Living in Anxiety?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ people who chose to transform their lives today—not tomorrow
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 inline-block">
            <p className="text-2xl font-bold mb-2">Only {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} remaining this week</p>
            <p className="text-sm opacity-90">Spots fill fast—secure yours now</p>
          </div>

          <Button 
            size="lg"
            className="bg-white text-rose-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold"
            onClick={scrollToPricing}
          >
            Book Your Transformation Session Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>90-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Start Today</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>Licensed Coaches</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-bold text-white">Purposeful Live</span>
            </div>
            <p className="text-sm">
              © 2025 Purposeful Live Coaching. All rights reserved.
            </p>
            <p className="text-sm mt-2">
              Licensed professionals • HIPAA compliant • U.S.-based support
            </p>
          </div>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <ExitIntentPopup open={showExitIntent} onClose={dismissExitIntent} />
      )}
    </div>
  );
}
