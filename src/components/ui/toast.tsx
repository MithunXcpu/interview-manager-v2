"use client";

import { Toaster as SonnerToaster } from "sonner";

// ---------------------------------------------------------------------------
// Signal Design System -- Toast (Sonner wrapper)
// ---------------------------------------------------------------------------
// Re-exports sonner's `toast` function for imperative use:
//   import { toast } from "sonner";
//   toast.success("Saved!");
//
// Mount <Toaster /> once in your root layout.
// ---------------------------------------------------------------------------

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "rgb(24 24 27)", // zinc-900
          border: "1px solid rgb(39 39 42)", // zinc-800
          color: "rgb(228 228 231)", // zinc-200
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.45)",
          borderRadius: "0.75rem",
          fontSize: "0.8125rem",
        },
        classNames: {
          title: "text-zinc-100 font-medium text-sm",
          description: "text-zinc-400 text-xs",
          actionButton:
            "bg-indigo-600 text-white hover:bg-indigo-500 rounded-md px-3 py-1.5 text-xs font-medium",
          cancelButton:
            "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-md px-3 py-1.5 text-xs font-medium",
          closeButton:
            "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700",
          success: "border-emerald-500/30",
          error: "border-red-500/30",
          warning: "border-amber-500/30",
          info: "border-cyan-500/30",
        },
      }}
    />
  );
}

Toaster.displayName = "Toaster";

// Re-export toast for convenience
export { toast } from "sonner";
