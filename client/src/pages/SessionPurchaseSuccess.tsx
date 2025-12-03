import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar } from "lucide-react";
import { useLocation } from "wouter";

export default function SessionPurchaseSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-500">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Session Purchased! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Your extra coaching session has been added to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Ready to Schedule
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your session credit is now available. Book a time that works for you with one of our expert coaches.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">What's included:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>30-minute live 1-on-1 coaching session</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Session recording & transcript</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>AI-generated session summary & insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Personalized action plan</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                A receipt has been sent to your email. You can view this session credit in your subscription dashboard.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button onClick={() => setLocation("/book-session")} className="flex-1">
              Schedule Session Now
            </Button>
            <Button variant="outline" onClick={() => setLocation("/subscription")}>
              View Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
