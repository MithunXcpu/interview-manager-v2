"use client";

import { cn } from "@/lib/utils";

// =============================================================================
// Streak Display — shows consecutive day streak with fire emoji
// =============================================================================

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export function StreakDisplay({ streak, className }: StreakDisplayProps) {
  const isActive = streak > 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-xl",
        "border transition-all duration-200",
        isActive
          ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20"
          : "bg-zinc-900/70 border-zinc-800/80",
        className
      )}
    >
      {/* Fire icon + number */}
      <div
        className={cn(
          "flex items-center justify-center w-20 h-20 rounded-full mb-3",
          "transition-all duration-200",
          isActive
            ? "bg-amber-500/15 ring-2 ring-amber-500/30"
            : "bg-zinc-800/60 ring-1 ring-zinc-700/40"
        )}
      >
        <div className="flex flex-col items-center">
          <span className="text-3xl leading-none">
            {isActive ? "\u{1F525}" : "\u{1F4A4}"}
          </span>
          <span
            className={cn(
              "text-2xl font-bold mt-0.5 tabular-nums",
              isActive ? "text-amber-400" : "text-zinc-600"
            )}
          >
            {streak}
          </span>
        </div>
      </div>

      {/* Label */}
      <p
        className={cn(
          "text-sm font-semibold",
          isActive ? "text-amber-300" : "text-zinc-500"
        )}
      >
        {isActive
          ? `${streak} day${streak !== 1 ? "s" : ""}`
          : "No active streak"}
      </p>

      {/* Subtext */}
      <p
        className={cn(
          "text-xs mt-1",
          isActive ? "text-amber-400/60" : "text-zinc-600"
        )}
      >
        {isActive ? "Keep it going!" : "Start a new streak!"}
      </p>
    </div>
  );
}
