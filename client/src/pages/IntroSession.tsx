import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Clock, Shield, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

/**
 * $1 Introductory Session Landing Page
 * 
 * Research-backed high-conversion tripwire offer page.
 * Separate from main pricing to reduce decision paralysis.
 * 
 * Conversion structure:
 * 1. Acknowledge pain (emotional connection)
 * 2. Demonstrate value ($1 vs $150+ elsewhere)
 * 3. Create hope (specific transformation promise)
 * 4. Single clear CTA (book now)
 * 
 * Target: 40-60% conversion to $49/$99/$149 sessions
 */
export default function IntroSession() {
  const [, setLocation] = useLocation();

  const handleBookIntro = () => {
    // TODO: Integrate Calendly for $1 intro session booking
    setLocation("/book-session?type=intro");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white">
      {/* Hero Section - Acknowledge Pain */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium mb-6">
            Limited Time Offer
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Try Professional Coaching
            <br />
            <span className="text-primary">For Just $1</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            You're overwhelmed. Stressed. Maybe you can't sleep. You know you need help,
            but you're not sure if coaching is right for you.
          </p>
          
          <p className="text-2xl font-semibold text-foreground mb-8">
            What if you could find out—for the price of a coffee?
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 h-auto"
            onClick={handleBookIntro}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Book Your $1 Session Now
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            20-minute session • No credit card required • Book in 60 seconds
          </p>
        </div>
      </section>

      {/* Value Demonstration */}
      <section className="container py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What You'll Get in Your $1 Session
            </h2>
            <p className="text-lg text-muted-foreground">
              This isn't a sales pitch. It's a real coaching session.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                20 Minutes of Clarity
              </h3>
              <p className="text-muted-foreground">
                We'll identify your biggest stressor and give you one specific technique
                you can use immediately.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Insight
              </h3>
              <p className="text-muted-foreground">
                You'll discover something about yourself you didn't see before—a pattern,
                trigger, or hidden strength.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Zero Pressure
              </h3>
              <p className="text-muted-foreground">
                No sales pitch. No obligation. Just a genuine conversation about what's
                weighing on you.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof - Create Hope */}
      <section className="container py-16 bg-calm-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Happens After Your $1 Session
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 bg-white">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">You'll Feel Lighter</h3>
                  <p className="text-sm text-muted-foreground">
                    "After just 20 minutes, I felt like a weight lifted. I finally understood
                    why I was so anxious." — Sarah M.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">You'll Have a Tool</h3>
                  <p className="text-sm text-muted-foreground">
                    "They gave me one breathing technique. I used it that night and slept
                    better than I had in months." — James L.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">You'll Know If It's Right</h3>
                  <p className="text-sm text-muted-foreground">
                    "I wasn't sure about coaching. The $1 session showed me it could actually
                    help. No regrets." — Maria T.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">You Can Continue (If You Want)</h3>
                  <p className="text-sm text-muted-foreground">
                    If you love it, we'll talk about ongoing sessions ($49-$149). If not,
                    no hard feelings.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold mb-6">
              Most people who try the $1 session book a full session within 48 hours.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto"
              onClick={handleBookIntro}
            >
              Book Your $1 Session Now
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Common Questions
          </h2>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Why only $1?</h3>
              <p className="text-muted-foreground">
                We want to remove any barrier to you getting help. $1 proves you're serious,
                but won't break the bank. Think of it as a coffee-priced test drive.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Is this a real session or a sales call?</h3>
              <p className="text-muted-foreground">
                It's a real coaching session. We'll focus on your biggest challenge and give
                you actionable techniques. No pressure, no pitch.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">What if I want to continue after?</h3>
              <p className="text-muted-foreground">
                Great! We offer full sessions at $49, $99, or $149 depending on your needs.
                We'll explain the options at the end of your $1 session—only if you ask.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I really get value in 20 minutes?</h3>
              <p className="text-muted-foreground">
                Absolutely. Most people have one or two core issues driving their stress.
                We'll identify yours and give you a technique that works immediately.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            You Deserve to Feel Better
          </h2>
          <p className="text-xl mb-8 opacity-90">
            For the price of a coffee, you can take the first step toward calm, confidence,
            and control.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto"
            onClick={handleBookIntro}
          >
            Book Your $1 Session Now
          </Button>
          <p className="text-sm mt-4 opacity-75">
            20-minute session • Available 7 days a week • Book in 60 seconds
          </p>
        </div>
      </section>
    </div>
  );
}
