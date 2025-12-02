import { useEffect } from "react";

interface CalendlyEmbedProps {
  url: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
}

/**
 * CALENDLY EMBED COMPONENT
 * 
 * Embeds Calendly scheduling widget
 * Requires Calendly event URL from environment variables
 */
export default function CalendlyEmbed({ url, prefill }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const calendlyUrl = new URL(url);
  
  // Add prefill parameters
  if (prefill) {
    if (prefill.name) calendlyUrl.searchParams.set("name", prefill.name);
    if (prefill.email) calendlyUrl.searchParams.set("email", prefill.email);
    
    // Add custom answers
    if (prefill.customAnswers) {
      Object.entries(prefill.customAnswers).forEach(([key, value]) => {
        calendlyUrl.searchParams.set(`a${key}`, value);
      });
    }
  }

  return (
    <div
      className="calendly-inline-widget"
      data-url={calendlyUrl.toString()}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
