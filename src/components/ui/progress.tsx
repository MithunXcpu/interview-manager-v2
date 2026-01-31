"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Progress Bar
// ---------------------------------------------------------------------------

const sizeStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
} as const;

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value 0-100 */
  value?: number;
  /** Maximum value (default 100) */
  max?: number;
  size?: keyof typeof sizeStyles;
  /** Show percentage label */
  showLabel?: boolean;
  /** Custom label text (overrides percentage) */
  label?: string;
  /** Bar color variant */
  color?: "indigo" | "emerald" | "amber" | "red" | "cyan";
}

const colorStyles = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  cyan: "bg-cyan-500",
} as const;

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = "md",
      showLabel = false,
      label,
      color = "indigo",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className={cn("flex flex-col gap-1.5", className)} ref={ref} {...props}>
        {/* Label row */}
        {(showLabel || label) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className="text-xs font-medium text-zinc-400">{label}</span>
            )}
            {showLabel && (
              <span className="text-xs tabular-nums font-mono text-zinc-500 ml-auto">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        {/* Track */}
        <div
          className={cn(
            "w-full overflow-hidden rounded-full bg-zinc-800",
            sizeStyles[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {/* Fill */}
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              colorStyles[color],
              // Subtle glow on the bar
              "shadow-[0_0_8px_rgba(99,102,241,0.25)]"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
