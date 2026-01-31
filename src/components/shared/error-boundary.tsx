"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Signal Design System -- Error Boundary
// ---------------------------------------------------------------------------
// Catches rendering errors in the React component tree and displays a styled
// fallback UI. Exports both a class-based ErrorBoundary and a functional
// ErrorFallback for flexible usage.
// ---------------------------------------------------------------------------

// -- Types ------------------------------------------------------------------

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  className?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional custom fallback component */
  FallbackComponent?: React.ComponentType<ErrorFallbackProps>;
  /** Called when the error boundary resets */
  onReset?: () => void;
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// -- ErrorFallback (functional) ---------------------------------------------

export function ErrorFallback({
  error,
  resetErrorBoundary,
  className,
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-center min-h-[320px] p-6",
        className
      )}
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-sm p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
          <FiAlertTriangle className="h-6 w-6 text-red-400" />
        </div>

        {/* Heading */}
        <h3 className="text-[15px] font-semibold text-zinc-100 mb-2">
          Something went wrong
        </h3>

        {/* Error message */}
        <p className="text-[13px] text-zinc-500 leading-relaxed mb-1">
          An unexpected error occurred while rendering this section.
        </p>

        {/* Error detail (dev-friendly) */}
        {error?.message && (
          <p className="text-[12px] text-zinc-600 font-mono bg-zinc-800/50 rounded-lg px-3 py-2 mt-3 mb-5 break-words max-h-24 overflow-y-auto text-left">
            {error.message}
          </p>
        )}

        {/* Retry button */}
        <Button
          variant="primary"
          size="md"
          onClick={resetErrorBoundary}
          iconLeft={<FiRefreshCw className="h-4 w-4" />}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

// -- ErrorBoundary (class-based) --------------------------------------------

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging; optionally call onError callback
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.FallbackComponent ?? ErrorFallback;
      return (
        <Fallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}
