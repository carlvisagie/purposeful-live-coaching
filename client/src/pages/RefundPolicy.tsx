import { useEffect, useState } from "react";

export default function RefundPolicy() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/refund-policy.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Failed to load refund policy:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
      <div className="container max-w-4xl py-12">
        <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-8 md:p-12">
          <div className="prose prose-sage max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-charcoal-600">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
