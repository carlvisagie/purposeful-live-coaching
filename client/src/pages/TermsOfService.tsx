import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";

export default function TermsOfService() {
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/terms-of-service.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Failed to load terms:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-purple max-w-none">
            <Streamdown>{content}</Streamdown>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
