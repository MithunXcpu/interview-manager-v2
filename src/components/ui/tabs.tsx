"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Tabs (underline indicator style)
// ---------------------------------------------------------------------------

const Tabs = TabsPrimitive.Root;

// -- TabsList ----------------------------------------------------------------

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1",
      "border-b border-zinc-800 w-full",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// -- TabsTrigger -------------------------------------------------------------

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center gap-1.5",
      "px-3 pb-2.5 pt-1",
      "text-sm font-medium text-zinc-500",
      "transition-colors duration-150 ease-out",
      "hover:text-zinc-300",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-0",
      // Active state -- text color change + underline via pseudo-element
      "data-[state=active]:text-zinc-100",
      // Underline indicator
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]",
      "after:rounded-full after:transition-all after:duration-200 after:ease-out",
      "after:bg-transparent data-[state=active]:after:bg-indigo-500",
      "disabled:pointer-events-none disabled:opacity-40",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// -- TabsContent -------------------------------------------------------------

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-zinc-950",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2",
      // Subtle fade-in
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1",
      "data-[state=inactive]:hidden",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
