import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Confetti effect or celebration animation could go here
  }, []);

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-500">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Welcome to PurposefulLive! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Your subscription is now active and your 7-day free trial has begun
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Your AI Coach is Ready!
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Start chatting with your 24/7 AI coach right now. No waiting, no scheduling required.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">Day 1-7:</span>
                  <span>Explore all features completely free. No charges during trial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">Day 8:</span>
                  <span>Your subscription begins and your card will be charged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">Anytime:</span>
                  <span>Cancel from your subscription dashboard with no penalties.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to your inbox with all the details.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button onClick={() => setLocation("/ai-coach")} className="flex-1">
              Start AI Coaching Now
            </Button>
            <Button variant="outline" onClick={() => setLocation("/subscription")}>
              View Subscription
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
