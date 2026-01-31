"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Card
// ---------------------------------------------------------------------------

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add a subtle border-glow on hover */
  hover?: boolean;
  /** Render as a clickable card with cursor-pointer and active state */
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base
        "rounded-xl border border-zinc-800/80 bg-zinc-900/70",
        "backdrop-blur-sm",
        "transition-all duration-200 ease-out",
        // Hover glow
        hover &&
          "hover:border-zinc-700 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]",
        // Interactive
        interactive &&
          "cursor-pointer hover:border-indigo-500/30 hover:bg-zinc-900/90 active:scale-[0.995] active:bg-zinc-900",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// -- CardHeader --------------------------------------------------------------

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1.5 px-5 pt-5 pb-0",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// -- CardTitle ---------------------------------------------------------------

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-semibold text-zinc-100 tracking-tight leading-snug",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// -- CardDescription ---------------------------------------------------------

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-zinc-500 leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// -- CardContent -------------------------------------------------------------

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-5 py-4", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// -- CardFooter --------------------------------------------------------------

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 px-5 pb-5 pt-0",
      "border-t border-zinc-800/60 mt-auto",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
