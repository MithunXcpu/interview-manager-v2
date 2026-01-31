"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Command Palette (cmdk)
// ---------------------------------------------------------------------------
// Usage:
//   <CommandPalette open={open} onOpenChange={setOpen}>
//     <CommandInput placeholder="Search..." />
//     <CommandList>
//       <CommandGroup heading="Navigation">
//         <CommandItem onSelect={() => ...}>
//           Dashboard <CommandShortcut>Ctrl+D</CommandShortcut>
//         </CommandItem>
//       </CommandGroup>
//     </CommandList>
//     <CommandEmpty>No results found.</CommandEmpty>
//   </CommandPalette>
// ---------------------------------------------------------------------------

// -- Root with dialog overlay -----------------------------------------------

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function CommandPalette({ open, onOpenChange, children }: CommandPaletteProps) {
  // Close on Escape
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-150"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative flex items-start justify-center pt-[15vh]">
        <CommandPrimitive
          className={cn(
            "w-full max-w-xl",
            "overflow-hidden rounded-xl",
            "border border-zinc-700/80 bg-zinc-900",
            "shadow-2xl shadow-black/50",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
          )}
          loop
        >
          {children}
        </CommandPrimitive>
      </div>
    </div>
  );
}

CommandPalette.displayName = "CommandPalette";

// -- Input -------------------------------------------------------------------

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-2 border-b border-zinc-800 px-4">
    {/* Search icon */}
    <svg
      className="h-4 w-4 shrink-0 text-zinc-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex-1 h-12 bg-transparent text-sm text-zinc-100",
        "placeholder:text-zinc-600",
        "focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
    {/* Esc badge */}
    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] text-zinc-500">
      Esc
    </kbd>
  </div>
));
CommandInput.displayName = "CommandInput";

// -- List (scrollable area) --------------------------------------------------

const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[320px] overflow-y-auto overflow-x-hidden p-1.5",
      "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent",
      className
    )}
    {...props}
  />
));
CommandList.displayName = "CommandList";

// -- Empty state -------------------------------------------------------------

const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn(
      "py-10 text-center text-sm text-zinc-500",
      className
    )}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

// -- Group -------------------------------------------------------------------

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden py-1",
      "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5",
      "[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold",
      "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest",
      "[&_[cmdk-group-heading]]:text-zinc-500",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

// -- Separator ---------------------------------------------------------------

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-zinc-800", className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

// -- Item --------------------------------------------------------------------

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex items-center gap-2.5 rounded-md px-2.5 py-2",
      "text-sm text-zinc-300 cursor-default select-none outline-none",
      "transition-colors duration-75",
      // Highlight on select (keyboard / hover)
      "data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

// -- Keyboard shortcut badge -------------------------------------------------

function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ml-auto inline-flex items-center gap-0.5",
        className
      )}
      {...props}
    />
  );
}

CommandShortcut.displayName = "CommandShortcut";

/** Single key badge inside CommandShortcut */
function Kbd({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center",
        "rounded border border-zinc-700 bg-zinc-800",
        "px-1 font-mono text-[10px] text-zinc-500",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

Kbd.displayName = "Kbd";

export {
  CommandPalette,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandShortcut,
  Kbd,
};
