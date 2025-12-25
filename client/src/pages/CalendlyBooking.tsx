import { InlineWidget } from "react-calendly";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendlyBooking() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Book Your Coaching Session</CardTitle>
        </CardHeader>
        <CardContent>
          <InlineWidget
            url="https://calendly.com/carlhvisagie-rxgb/new-meeting"
            styles={{
              height: "700px",
              width: "100%",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
