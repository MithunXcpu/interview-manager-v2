"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Input
// ---------------------------------------------------------------------------

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label shown above the input */
  label?: string;
  /** Error message shown below the input; also applies error styling */
  error?: string;
  /** Hint text shown below the input when no error is present */
  hint?: string;
  /** Icon or element rendered at the start of the input */
  iconPrefix?: React.ReactNode;
  /** Icon or element rendered at the end of the input */
  iconSuffix?: React.ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      iconPrefix,
      iconSuffix,
      wrapperClassName,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-zinc-400 select-none"
          >
            {label}
          </label>
        )}

        {/* Input container */}
        <div className="relative flex items-center">
          {/* Prefix icon */}
          {iconPrefix && (
            <span className="pointer-events-none absolute left-3 flex items-center text-zinc-500">
              {iconPrefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              // Base
              "h-9 w-full rounded-lg border bg-zinc-900/80 px-3 text-sm text-zinc-100",
              "placeholder:text-zinc-600",
              "transition-colors duration-150 ease-out",
              // Border
              error
                ? "border-red-500/60 focus:border-red-500"
                : "border-zinc-800 focus:border-indigo-500/60",
              // Focus
              "focus:outline-none focus:ring-2",
              error
                ? "focus:ring-red-500/20"
                : "focus:ring-indigo-500/20",
              // Disabled
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Icon padding
              iconPrefix && "pl-9",
              iconSuffix && "pr-9",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {/* Suffix icon */}
          {iconSuffix && (
            <span className="pointer-events-none absolute right-3 flex items-center text-zinc-500">
              {iconSuffix}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <svg
              className="h-3 w-3 shrink-0"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zM8 11a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            {error}
          </p>
        )}

        {/* Hint */}
        {!error && hint && (
          <p className="text-xs text-zinc-600">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
