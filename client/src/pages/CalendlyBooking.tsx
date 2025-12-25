import { PopupWidget } from "react-calendly";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function CalendlyBooking() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Book Your Coaching Session</CardTitle>
          <CardDescription className="text-center text-lg mt-4">
            Schedule a 1-on-1 coaching session with Carl Visagie
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Ready to take the next step in your personal growth journey?
            </p>
            <p className="text-muted-foreground">
              Click below to choose a time that works best for you.
            </p>
          </div>
          
          <PopupWidget
            url="https://calendly.com/carlhvisagie-rxgb/new-meeting"
            rootElement={document.getElementById("root")!}
            text="Schedule Your Session"
            textColor="#ffffff"
            color="#000000"
          />
          
          <Button 
            size="lg"
            className="w-full max-w-md"
            onClick={() => window.open("https://calendly.com/carlhvisagie-rxgb/new-meeting", "_blank")}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Open Booking Calendar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
