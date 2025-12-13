import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Calendar, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminSetup() {
  const [coachId] = useState(1); // Default coach ID

  // Seed availability mutation
  const seedAvailability = trpc.scheduling.seedDefaultAvailability.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSeedAvailability = () => {
    if (confirm('This will create default availability (Mon-Fri, 9 AM - 5 PM) for coach ID ' + coachId + '. Continue?')) {
      seedAvailability.mutate({ coachId });
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Setup</h1>
        <p className="text-muted-foreground">
          One-time setup tasks for platform configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Coach Availability Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Coach Availability Setup
            </CardTitle>
            <CardDescription>
              Seed default availability schedule for the booking system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This creates default availability: <strong>Monday-Friday, 9:00 AM - 5:00 PM</strong>
                <br />
                Coach ID: {coachId}
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleSeedAvailability}
                disabled={seedAvailability.isPending}
                size="lg"
              >
                {seedAvailability.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Availability...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Seed Coach Availability
                  </>
                )}
              </Button>

              {seedAvailability.isSuccess && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Availability Created!</span>
                </div>
              )}
            </div>

            {seedAvailability.isSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> Default availability has been created.
                  <br />
                  The booking system is now ready to use. Users can book sessions Monday-Friday between 9:00 AM and 5:00 PM.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>What this does:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Creates 5 availability slots (Monday through Friday)</li>
                <li>Sets working hours: 9:00 AM - 5:00 PM</li>
                <li>Enables the booking system to show available time slots</li>
                <li>Can only be run once (prevents duplicate entries)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Future Setup Tasks */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle>Additional Setup Tasks</CardTitle>
            <CardDescription>
              Coming soon: Email configuration, payment testing, analytics setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Additional admin tools will be added here as needed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
