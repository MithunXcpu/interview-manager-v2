"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    /** Optional label text rendered centered on the separator */
    label?: string;
  }
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      label,
      ...props
    },
    ref
  ) => {
    if (label) {
      return (
        <div
          className={cn(
            "flex items-center gap-3",
            orientation === "vertical" && "flex-col",
            className
          )}
          role="none"
        >
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0 bg-zinc-800",
              orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1"
            )}
            {...props}
          />
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600 select-none whitespace-nowrap">
            {label}
          </span>
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0 bg-zinc-800",
              orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1"
            )}
          />
        </div>
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-zinc-800",
          orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
