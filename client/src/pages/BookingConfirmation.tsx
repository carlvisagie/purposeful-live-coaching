import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Calendar, Clock, Video, Mail, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Booking Confirmation Page
 * 
 * This page handles payment success from Stripe checkout.
 * It does NOT require authentication - the Stripe session_id is proof of payment.
 * 
 * Flow:
 * 1. Customer completes Stripe checkout (not logged in)
 * 2. Redirected here with ?session_id=xxx
 * 3. We call verifyAndCreateBooking API (public, no auth)
 * 4. Show confirmation with session details
 * 5. Offer to create account or login
 */
export default function BookingConfirmation() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Extract session_id from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    if (id) {
      setSessionId(id);
    } else {
      // No session_id, redirect to booking page
      setLocation('/book-session');
    }
  }, [setLocation]);

  // Verify payment and create booking
  const verifyPayment = trpc.stripe.verifyAndCreateBooking.useMutation({
    onSuccess: (data) => {
      setBookingDetails(data);
      // Clean up URL
      window.history.replaceState({}, '', '/booking-confirmation');
    },
    onError: (error) => {
      console.error('Payment verification failed:', error);
      setErrorMessage(error.message || 'Payment verification failed');
    },
  });

  // Trigger verification when session_id is available
  useEffect(() => {
    if (sessionId && !verifyPayment.isPending && !bookingDetails && !hasTimedOut) {
      verifyPayment.mutate({ sessionId });
    }
  }, [sessionId, verifyPayment, bookingDetails, hasTimedOut]);

  // Add timeout to prevent infinite loading (Master Prompt: Zero Cognitive Load)
  useEffect(() => {
    if (sessionId && verifyPayment.isPending) {
      const timeout = setTimeout(() => {
        setHasTimedOut(true);
        setErrorMessage(`Verification is taking longer than expected. Your payment may have been successful. Please check your email or contact support with session ID: ${sessionId}`);
      }, 15000); // 15 seconds

      return () => clearTimeout(timeout);
    }
  }, [sessionId, verifyPayment.isPending]);

  // Loading state (only show if not timed out)
  if (verifyPayment.isPending && !hasTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
            <h3 className="font-semibold text-lg mb-2">Confirming Your Booking...</h3>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we process your payment and create your session.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state (API error or timeout)
  if (verifyPayment.isError || errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-center text-red-900">Verification Delayed</CardTitle>
            <CardDescription className="text-center">
              {errorMessage || verifyPayment.error?.message || 'We encountered an issue confirming your booking.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessionId && (
              <div className="bg-gray-100 p-3 rounded text-xs font-mono text-center">
                <strong>Session ID:</strong> {sessionId}
              </div>
            )}
            <p className="text-sm text-center text-muted-foreground">
              Don't worry - if your payment was successful, we'll create your booking and send you an email confirmation.
              Please save the session ID above and contact support if you don't receive confirmation within 10 minutes.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setLocation('/book-session')}
              >
                Try Again
              </Button>
              <Button
                className="flex-1"
                onClick={() => window.location.href = 'mailto:support@purposelivecoaching.com'}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="container max-w-3xl">
          {/* Success Header */}
          <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-900">
                🎉 Booking Confirmed!
              </CardTitle>
              <CardDescription className="text-lg text-green-700">
                Your coaching session has been successfully scheduled
              </CardDescription>
            </CardHeader>
          </Card>

          {/* What Happens Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">📋 What Happens Next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Check Your Email</h4>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your session details and Zoom link.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Add to Calendar</h4>
                  <p className="text-sm text-muted-foreground">
                    Save your session to your calendar so you don't miss it.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Prepare for Your Session</h4>
                  <p className="text-sm text-muted-foreground">
                    Think about what you'd like to discuss and any questions you have.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Join Your Session</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the Zoom link in your email 5 minutes before your session starts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">📅 Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">Check your confirmation email</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">15-60 minutes (based on session type)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Zoom (link in confirmation email)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Confirmation</p>
                  <p className="font-medium">Sent to your email address</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🚀 Next Steps</CardTitle>
              <CardDescription>
                Create an account to manage your sessions and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  // Redirect to login with return URL
                  window.location.href = `${window.location.origin}/my-sessions`;
                }}
              >
                Create Account / Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => setLocation('/')}
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Questions or need to reschedule?</p>
            <a
              href="mailto:support@purposelivecoaching.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
