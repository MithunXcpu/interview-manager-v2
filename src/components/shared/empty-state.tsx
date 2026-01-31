"use client";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Reusable Empty State component
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  /** Icon element rendered in a circular container */
  icon?: React.ReactNode;
  /** Main heading */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Optional CTA button or action element */
  action?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      {/* Icon container */}
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 text-zinc-500 mb-4">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-zinc-100 mb-1.5">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[13px] text-zinc-500 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}

      {/* Action slot */}
      {action && <div>{action}</div>}
    </div>
  );
}
