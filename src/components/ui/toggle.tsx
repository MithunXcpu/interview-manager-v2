"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Toggle (Switch-style)
// ---------------------------------------------------------------------------

export interface ToggleProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    "children"
  > {
  /** Label text rendered beside the toggle */
  label?: string;
  /** Description text below the label */
  description?: string;
  /** Size variant */
  size?: "sm" | "md";
}

const sizeStyles = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-3.5 w-3.5",
    translate: "translate-x-4",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-4.5 w-4.5",
    translate: "translate-x-5",
  },
} as const;

const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(
  (
    { className, label, description, size = "md", disabled, ...props },
    ref
  ) => {
    const s = sizeStyles[size];
    const id = React.useId();

    const toggle = (
      <TogglePrimitive.Root
        ref={ref}
        disabled={disabled}
        className={cn(
          "group relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
          "transition-colors duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          // Off state
          "bg-zinc-700",
          // On state
          "data-[state=on]:bg-indigo-600",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          s.track,
          className
        )}
        aria-labelledby={label ? id : undefined}
        {...props}
      >
        {/* Thumb circle */}
        <span
          className={cn(
            "pointer-events-none block rounded-full bg-white shadow-sm",
            "transition-transform duration-200 ease-out",
            "translate-x-0.5",
            "group-data-[state=on]:" + s.translate,
            s.thumb
          )}
          aria-hidden="true"
        />
      </TogglePrimitive.Root>
    );

    if (!label) return toggle;

    return (
      <div
        className={cn(
          "flex items-start gap-3",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        {toggle}
        <div className="flex flex-col gap-0.5 select-none">
          <label
            id={id}
            className="text-sm font-medium text-zinc-200 cursor-pointer leading-snug"
          >
            {label}
          </label>
          {description && (
            <span className="text-xs text-zinc-500 leading-relaxed">
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
