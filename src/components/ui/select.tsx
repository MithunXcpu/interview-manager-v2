"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Select
// ---------------------------------------------------------------------------
// A styled native <select> that matches the Input component design.
// For complex dropdowns with search/multi-select, compose with cmdk instead.
// ---------------------------------------------------------------------------

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  /** Label shown above the select */
  label?: string;
  /** Error message below the select */
  error?: string;
  /** Hint text when no error */
  hint?: string;
  /** Placeholder option text (first unselectable entry) */
  placeholder?: string;
  /** Flat options list */
  options?: SelectOption[];
  /** Grouped options */
  groups?: SelectOptionGroup[];
  /** Wrapper className */
  wrapperClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      placeholder,
      options,
      groups,
      wrapperClassName,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? React.useId();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-zinc-400 select-none"
          >
            {label}
          </label>
        )}

        {/* Select wrapper -- custom chevron */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // Base
              "h-9 w-full appearance-none rounded-lg border bg-zinc-900/80 px-3 pr-9 text-sm text-zinc-100",
              "transition-colors duration-150 ease-out",
              // Border
              error
                ? "border-red-500/60 focus:border-red-500"
                : "border-zinc-800 focus:border-indigo-500/60",
              // Focus
              "focus:outline-none focus:ring-2",
              error ? "focus:ring-red-500/20" : "focus:ring-indigo-500/20",
              // Disabled
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-zinc-600">
                {placeholder}
              </option>
            )}

            {/* Flat options */}
            {options?.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-zinc-900 text-zinc-100"
              >
                {opt.label}
              </option>
            ))}

            {/* Grouped options */}
            {groups?.map((group) => (
              <optgroup
                key={group.label}
                label={group.label}
                className="bg-zinc-900 text-zinc-400 font-semibold"
              >
                {group.options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-zinc-900 text-zinc-100 font-normal"
                  >
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Chevron icon */}
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" />
            </svg>
          </span>
        </div>

        {/* Error */}
        {error && (
          <p
            id={`${selectId}-error`}
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
        {!error && hint && <p className="text-xs text-zinc-600">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
