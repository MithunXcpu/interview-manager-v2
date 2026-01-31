"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Skeleton (shimmer loading placeholders)
// ---------------------------------------------------------------------------

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pre-built shape variants for common use cases */
  variant?: "text" | "card" | "avatar" | "chart";
  /** Explicit width (CSS value). Overridden by variant defaults. */
  width?: string | number;
  /** Explicit height (CSS value). Overridden by variant defaults. */
  height?: string | number;
}

/**
 * Base shimmer skeleton block.
 * The shimmer effect uses a gradient sweep via CSS animation defined below.
 */
function Skeleton({
  className,
  variant,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  // Variant dimension defaults
  const variantClasses: Record<string, string> = {
    text: "h-4 w-full rounded",
    card: "h-32 w-full rounded-xl",
    avatar: "h-9 w-9 rounded-full",
    chart: "h-48 w-full rounded-xl",
  };

  return (
    <div
      className={cn(
        "signal-skeleton relative overflow-hidden",
        "bg-zinc-800/60 rounded-md",
        variant ? variantClasses[variant] : undefined,
        className
      )}
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";

// -- Composite skeletons for common patterns ---------------------------------

/** A row with an avatar skeleton + two text lines */
function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
    </div>
  );
}

SkeletonRow.displayName = "SkeletonRow";

/** A card skeleton with header and body lines */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}

SkeletonCard.displayName = "SkeletonCard";

export { Skeleton, SkeletonRow, SkeletonCard };
