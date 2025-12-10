import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Global Loading Component
 * 
 * Shows a professional loading screen while pages/data are loading.
 * Automatically hides after content is ready.
 * 
 * Features:
 * - Smooth fade in/out
 * - Brand colors
 * - Prevents layout shift
 * - Accessible
 */

interface GlobalLoadingProps {
  isLoading: boolean;
  message?: string;
  delay?: number; // Delay before showing (prevents flash for fast loads)
}

export function GlobalLoading({ 
  isLoading, 
  message = "Loading your dashboard...",
  delay = 200 
}: GlobalLoadingProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Delay showing loader to prevent flash on fast loads
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isLoading, delay]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center z-50 animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-6 max-w-md px-8">
        {/* Animated Loader */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative" />
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">
            {message}
          </h2>
          <p className="text-sm text-slate-600">
            This will only take a moment
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}

/**
 * Page Loading Skeleton
 * 
 * Use this for individual page sections that need skeleton loaders
 */

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
          <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
              <div className="h-6 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-4/5" />
              <div className="h-10 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Card Loading Skeleton
 * 
 * Use this for individual cards that are loading
 */

export function CardLoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
      <div className="h-10 bg-slate-200 rounded w-full" />
    </div>
  );
}

/**
 * Table Loading Skeleton
 * 
 * Use this for tables that are loading
 */

export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Table Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-slate-200 rounded" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-slate-100 p-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * List Loading Skeleton
 * 
 * Use this for lists that are loading
 */

export function ListLoadingSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="w-20 h-8 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Chart Loading Skeleton
 * 
 * Use this for charts/graphs that are loading
 */

export function ChartLoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-100 rounded flex items-end gap-2 p-4">
          {[40, 70, 50, 80, 60, 90, 75].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-slate-200 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
