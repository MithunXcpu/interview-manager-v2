"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Button
// ---------------------------------------------------------------------------

const variantStyles = {
  primary:
    "bg-indigo-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none",
  secondary:
    "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 active:bg-zinc-900",
  ghost:
    "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 active:bg-zinc-800",
  danger:
    "bg-red-600/90 text-white shadow-[0_1px_2px_rgba(0,0,0,0.45)] hover:bg-red-500 active:bg-red-700",
  success:
    "bg-emerald-600/90 text-white shadow-[0_1px_2px_rgba(0,0,0,0.45)] hover:bg-emerald-500 active:bg-emerald-700",
} as const;

const sizeStyles = {
  sm: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
  md: "h-9 px-3.5 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-sm gap-2.5 rounded-lg",
} as const;

const iconOnlySizeStyles = {
  sm: "h-7 w-7 p-0",
  md: "h-9 w-9 p-0",
  lg: "h-11 w-11 p-0",
} as const;

// Spinner SVG for loading state
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Show a loading spinner and disable interactions */
  loading?: boolean;
  /** Icon element rendered before children */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after children */
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const isIconOnly = !children && (iconLeft || iconRight);

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          "relative inline-flex items-center justify-center font-medium",
          "select-none whitespace-nowrap",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          // Variant + Size
          variantStyles[variant],
          isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
          // Disabled / loading
          isDisabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        {loading && (
          <Spinner
            className={cn(
              size === "sm" ? "h-3 w-3" : "h-4 w-4",
              children && "mr-1.5"
            )}
          />
        )}

        {!loading && iconLeft && (
          <span className="inline-flex shrink-0">{iconLeft}</span>
        )}

        {children && (
          <span className={cn(loading && "opacity-0 sr-only")}>{children}</span>
        )}
        {/* Re-render children visible when loading has spinner before */}
        {loading && children && <span>{children}</span>}

        {!loading && iconRight && (
          <span className="inline-flex shrink-0">{iconRight}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
