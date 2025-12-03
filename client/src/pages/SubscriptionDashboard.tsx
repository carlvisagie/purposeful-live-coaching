import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Calendar, CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SubscriptionDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: subscription, isLoading, refetch } = trpc.subscriptions.getMySubscription.useQuery();
  const { data: usage } = trpc.subscriptions.getCurrentUsage.useQuery();
  const cancelSub = trpc.subscriptions.cancelSubscription.useMutation();
  const reactivateSub = trpc.subscriptions.reactivateSubscription.useMutation();
  const createExtraSession = trpc.subscriptions.createExtraSessionCheckout.useMutation();

  const handleCancel = async () => {
    try {
      await cancelSub.mutateAsync();
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will remain active until the end of the current billing period.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateSub.mutateAsync();
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription will continue automatically.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reactivate subscription",
        variant: "destructive",
      });
    }
  };

  const handleBuyExtraSession = async () => {
    try {
      const result = await createExtraSession.mutateAsync({
        successUrl: `${window.location.origin}/subscription/session-success`,
        cancelUrl: `${window.location.origin}/subscription`,
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
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription yet. Choose a plan to get started with 24/7 AI coaching.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation("/pricing")}>
              View Pricing Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "trialing":
        return <Badge className="bg-blue-500">Trial</Badge>;
      case "past_due":
        return <Badge variant="destructive">Past Due</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const humanSessionsUsed = usage?.humanSessionsUsed || 0;
  const humanSessionsIncluded = usage?.humanSessionsIncluded || 0;
  const humanSessionsRemaining = Math.max(0, humanSessionsIncluded - humanSessionsUsed);
  const humanSessionsProgress = humanSessionsIncluded > 0 
    ? (humanSessionsUsed / humanSessionsIncluded) * 100 
    : 0;

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription, view usage, and purchase additional sessions.
          </p>
        </div>

        {/* Cancellation Warning */}
        {subscription.cancelAtPeriodEnd === "true" && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Subscription Scheduled for Cancellation
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                    Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You'll still have access until then.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleReactivate}
                    disabled={reactivateSub.isPending}
                  >
                    {reactivateSub.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reactivating...
                      </>
                    ) : (
                      "Reactivate Subscription"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  {subscription.tierConfig?.name}
                </CardDescription>
              </div>
              {getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Billing Amount</p>
                  <p className="text-2xl font-bold">
                    ${subscription.tierConfig ? 
                      (subscription.billingFrequency === "yearly" 
                        ? (subscription.tierConfig.yearlyPrice / 100).toFixed(0) 
                        : (subscription.tierConfig.monthlyPrice / 100).toFixed(0)
                      ) : "0"}
                    <span className="text-sm text-muted-foreground font-normal">
                      /{subscription.billingFrequency === "yearly" ? "year" : "month"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Next Billing Date</p>
                  <p className="text-lg">{formatDate(subscription.currentPeriodEnd)}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Plan Features</h4>
              <ul className="space-y-2">
                {subscription.tierConfig?.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/pricing")}>
              Change Plan
            </Button>
            {subscription.cancelAtPeriodEnd !== "true" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Cancel Subscription</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your subscription will remain active until {formatDate(subscription.currentPeriodEnd)}. 
                      After that, you'll lose access to all features. You can reactivate anytime before then.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>

        {/* Usage Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Current Period Usage</CardTitle>
            <CardDescription>
              Usage resets on {formatDate(subscription.currentPeriodEnd)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Sessions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">AI Chat Sessions</p>
                <p className="text-sm text-muted-foreground">
                  {usage?.aiSessionsUsed || 0} sessions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-muted-foreground">Unlimited</p>
              </div>
            </div>

            {/* Human Sessions */}
            {humanSessionsIncluded > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Human Coaching Sessions</p>
                  <p className="text-sm text-muted-foreground">
                    {humanSessionsUsed} / {humanSessionsIncluded} used
                  </p>
                </div>
                <Progress value={humanSessionsProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {humanSessionsRemaining} session{humanSessionsRemaining !== 1 ? "s" : ""} remaining this period
                </p>
                {humanSessionsRemaining > 0 && (
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Booking System Coming Soon",
                          description: "For now, please email support@purposefullive.com to schedule your human coaching session. We'll have in-app booking ready soon!",
                        });
                        // TODO: Replace with Calendly link or in-app booking
                        // window.open("https://calendly.com/purposefullive/coaching-session", "_blank");
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Human Session
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {subscription.tier !== "ai_only" && (
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBuyExtraSession}
                disabled={createExtraSession.isPending}
              >
                {createExtraSession.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Buy Extra Session ($99)"
                )}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Upgrade CTA for AI-Only */}
        {subscription.tier === "ai_only" && (
          <Card className="border-purple-500 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
              <CardTitle>Upgrade to Hybrid or Premium</CardTitle>
              <CardDescription>
                Get access to live human coaching sessions with expert coaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  Personalized 1-on-1 sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  Session recordings & transcripts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  Priority support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setLocation("/pricing")}>
                View Upgrade Options
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
