import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function AITierToggle() {
  const { data: isEnabled, isLoading, refetch } = trpc.platformSettings.isAITierEnabled.useQuery();
  const [isToggling, setIsToggling] = useState(false);

  const toggleMutation = trpc.platformSettings.toggleAITier.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.enabled 
          ? "AI Tier activated! Clients can now subscribe at /ai-coaching" 
          : "AI Tier deactivated. Landing page is now hidden."
      );
      refetch();
      setIsToggling(false);
    },
    onError: (error) => {
      toast.error(`Failed to toggle AI tier: ${error.message}`);
      setIsToggling(false);
    },
  });

  const handleToggle = (enabled: boolean) => {
    setIsToggling(true);
    toggleMutation.mutate({ enabled });
  };

  if (isLoading) {
    return (
      <Card className="mb-8 border-l-4 border-l-purple-500">
        <CardContent className="pt-6">
          <div className="animate-pulse flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Coaching Tier
                {isEnabled && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    ACTIVE
                  </span>
                )}
                {!isEnabled && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    HIDDEN
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {isEnabled 
                  ? "AI tier is visible to clients. They can subscribe at /ai-coaching" 
                  : "AI tier is hidden. Activate to allow client subscriptions ($49-99/month)"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={isEnabled || false}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {isEnabled ? (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">✅ AI tier is ready for clients</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>24/7 AI coaching chat available</li>
                  <li>Crisis detection & escalation active</li>
                  <li>3 pricing tiers: $49, $79, $99/month</li>
                  <li>Stripe integration ready</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">⏸️ AI tier is currently hidden</p>
                <p className="text-gray-600">
                  Turn on the toggle above to activate the AI coaching tier. This will:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Make /ai-coaching landing page accessible</li>
                  <li>Allow clients to subscribe to AI coaching</li>
                  <li>Enable 24/7 automated coaching support</li>
                  <li>Start generating passive revenue</li>
                </ul>
              </div>
            )}
          </div>
          {isEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/ai-coaching', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Page
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
