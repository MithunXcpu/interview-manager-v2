"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Signal -- Global Error Page (Next.js error boundary)
// ---------------------------------------------------------------------------
// This is a Next.js App Router error page. It must be a client component.
// It receives the error and a reset function as props.
// ---------------------------------------------------------------------------

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error on mount
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
        <FiAlertTriangle className="h-7 w-7 text-red-400" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
        Something went wrong
      </h1>

      {/* Description */}
      <p className="text-[14px] text-zinc-500 max-w-sm leading-relaxed mb-2">
        An unexpected error occurred. Please try again, and if the problem
        persists, contact support.
      </p>

      {/* Error detail (development only) */}
      {error?.message && (
        <p className="text-[12px] text-zinc-600 font-mono bg-zinc-800/50 rounded-lg px-4 py-2 mb-6 max-w-md break-words">
          {error.message}
        </p>
      )}

      {/* Retry button */}
      <Button
        variant="primary"
        size="md"
        onClick={reset}
        iconLeft={<FiRefreshCw className="h-4 w-4" />}
      >
        Try again
      </Button>
    </div>
  );
}
