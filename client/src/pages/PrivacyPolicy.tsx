import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/privacy-policy-v2.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Failed to load privacy policy:", err));
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
              <Shield className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-blue max-w-none">
            <Streamdown>{content}</Streamdown>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
