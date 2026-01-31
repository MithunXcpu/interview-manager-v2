"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Badge
// ---------------------------------------------------------------------------

const variantStyles = {
  default:
    "bg-zinc-800 text-zinc-300 border-zinc-700/60",
  primary:
    "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  success:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  warning:
    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  danger:
    "bg-red-500/15 text-red-400 border-red-500/20",
  info:
    "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
} as const;

const dotColors = {
  default: "bg-zinc-400",
  primary: "bg-indigo-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-cyan-400",
} as const;

const sizeStyles = {
  sm: "h-5 text-[10px] px-1.5 gap-1",
  md: "h-6 text-xs px-2 gap-1.5",
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  /** Show a small colored dot before the label */
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "default", size = "md", dot = false, children, ...props },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        // Base -- pill shape
        "inline-flex items-center justify-center font-medium",
        "rounded-full border",
        "select-none whitespace-nowrap",
        "leading-none",
        // Variant + Size
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "rounded-full shrink-0",
            size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
            dotColors[variant]
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
);

Badge.displayName = "Badge";

export { Badge };
