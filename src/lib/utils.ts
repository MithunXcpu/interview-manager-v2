// ============================================================================
// Signal Design System -- Utility Functions
// ============================================================================
// REQUIRED DEPENDENCIES (install before use):
//   npm install clsx tailwind-merge
// ============================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

/**
 * Merge Tailwind classes with conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (dedup/override).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as USD currency.
 * @example formatCurrency(125000) => "$125,000"
 * @example formatCurrency(125000, { decimals: 2 }) => "$125,000.00"
 * @example formatCurrency(125000, { compact: true }) => "$125K"
 */
export function formatCurrency(
  amount: number,
  options?: { decimals?: number; compact?: boolean }
): string {
  const { decimals = 0, compact = false } = options ?? {};

  if (compact) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return formatter.format(amount);
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(amount);
}

/**
 * Format a Date to a readable string.
 * @example formatDate(new Date()) => "Jan 29, 2026"
 * @example formatDate(new Date(), "full") => "Thursday, January 29, 2026"
 * @example formatDate(new Date(), "time") => "3:45 PM"
 */
export function formatDate(
  date: Date | string | number,
  variant: "short" | "full" | "time" | "datetime" = "short"
): string {
  const d = new Date(date);

  switch (variant) {
    case "short":
      return format(d, "MMM d, yyyy");
    case "full":
      return format(d, "EEEE, MMMM d, yyyy");
    case "time":
      return format(d, "h:mm a");
    case "datetime":
      return format(d, "MMM d, yyyy 'at' h:mm a");
    default:
      return format(d, "MMM d, yyyy");
  }
}

/**
 * Format a Date as a relative time string with smart thresholds.
 * Shows "Just now", "Today at ...", "Yesterday at ...", or "X days ago" etc.
 */
export function formatRelativeDate(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  if (isToday(d)) {
    return `Today at ${format(d, "h:mm a")}`;
  }

  if (isYesterday(d)) {
    return `Yesterday at ${format(d, "h:mm a")}`;
  }

  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) {
    return formatDistanceToNow(d, { addSuffix: true });
  }

  return format(d, "MMM d, yyyy");
}

/**
 * Truncate a string to a maximum length, appending an ellipsis.
 * @example truncate("Hello World", 8) => "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3).trimEnd() + "...";
}

/**
 * Generate initials from a full name.
 * Takes the first letter of the first and last words.
 * @example generateInitials("Mithun Manjunatha") => "MM"
 * @example generateInitials("Alice") => "A"
 * @example generateInitials("John Robert Smith") => "JS"
 */
export function generateInitials(name: string): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
