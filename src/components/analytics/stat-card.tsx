"use client";

import { cn } from '@/lib/utils';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// =============================================================================
// StatCard -- Compact analytics stat with icon, value, and change indicator
// =============================================================================

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  /** Optional percentage change: positive = up (green), negative = down (red) */
  change?: number;
  className?: string;
}

export function StatCard({ icon, title, value, change, className }: StatCardProps) {
  const isPositive = change != null && change >= 0;
  const isNegative = change != null && change < 0;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* Icon container */}
      <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-indigo-500/10 shrink-0">
        <span className="text-indigo-400">{icon}</span>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-zinc-500 font-medium truncate">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-zinc-100 tabular-nums">
            {value}
          </span>
          {change != null && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                isPositive && 'text-emerald-400',
                isNegative && 'text-red-400'
              )}
            >
              {isPositive ? (
                <FiArrowUp className="h-3 w-3" />
              ) : (
                <FiArrowDown className="h-3 w-3" />
              )}
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
