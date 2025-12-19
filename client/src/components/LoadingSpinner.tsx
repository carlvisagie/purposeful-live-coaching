import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * LoadingSpinner - Consistent loading indicator across the app
 * 
 * Used for:
 * - Page loading states
 * - Button loading states
 * - Data fetching indicators
 */
export default function LoadingSpinner({ 
  size = "md", 
  text, 
  fullScreen = false,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-purple-500", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * PageLoader - Full page loading state
 */
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

/**
 * CardLoader - Loading state for card content
 */
export function CardLoader() {
  return (
    <div className="p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
    </div>
  );
}

/**
 * InlineLoader - Small inline loading indicator
 */
export function InlineLoader({ text }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </span>
  );
}
