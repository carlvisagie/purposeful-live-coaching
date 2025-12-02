import { Button } from "@/components/ui/button";
import { Check, Calendar, Mail } from "lucide-react";
import { useLocation } from "wouter";

/**
 * PAYMENT SUCCESS PAGE
 * 
 * Shown after successful Stripe checkout
 * Guides user to next steps: book session, check email
 */
export default function PaymentSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Payment Successful!
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          Your session has been purchased. You're one step closer to transformation.
        </p>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold mb-4">What happens next:</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Check your email</p>
                <p className="text-sm text-muted-foreground">
                  We've sent you a confirmation with your receipt and next steps
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Book your session</p>
                <p className="text-sm text-muted-foreground">
                  Choose a time that works for you from our calendar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setLocation("/book-session")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Session Now
          </Button>

          <Button
            onClick={() => setLocation("/dashboard")}
            variant="outline"
            className="px-8 py-6 text-lg"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Support */}
        <p className="text-sm text-muted-foreground mt-8">
          Questions? Email us at{" "}
          <a href="mailto:support@purposefullive.com" className="text-primary hover:underline">
            support@purposefullive.com
          </a>
        </p>
      </div>
    </div>
  );
}
