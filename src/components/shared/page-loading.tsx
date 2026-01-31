"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------------------------------------
// Signal Design System -- Loading States
// ---------------------------------------------------------------------------
// Full-page spinner and reusable skeleton layout for dashboard pages.
// ---------------------------------------------------------------------------

// -- Full-page loading spinner ----------------------------------------------

interface PageLoadingProps {
  /** Optional message below the spinner */
  message?: string;
  className?: string;
}

export function PageLoading({ message, className }: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        className
      )}
    >
      {/* Spinner */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />

        {/* Spinning ring */}
        <svg
          className="relative h-10 w-10 animate-spin"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background track */}
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            className="text-zinc-800"
          />
          {/* Indigo arc */}
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="80 100"
            className="text-indigo-500"
          />
        </svg>
      </div>

      {/* Optional message */}
      {message && (
        <p className="text-[13px] text-zinc-500 animate-pulse">{message}</p>
      )}
    </div>
  );
}

// -- Dashboard skeleton layout ----------------------------------------------

interface DashboardSkeletonProps {
  /** Number of card skeletons to render (default: 4) */
  cards?: number;
  className?: string;
}

export function DashboardSkeleton({
  cards = 4,
  className,
}: DashboardSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5 space-y-3"
          >
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        ))}
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-1/3 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
