// ============================================================================
// Signal -- Rate Limiting Utility
// ============================================================================
// Simple in-memory rate limiter for API routes.
// Uses a Map with IP-based bucketing and auto-cleanup of expired entries.
//
// Usage in an API route:
//   import { rateLimit } from "@/lib/rate-limit";
//
//   const limiter = rateLimit({ windowMs: 60_000, max: 100 });
//
//   export async function GET(request: NextRequest) {
//     const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
//     const { success, remaining } = limiter.check(ip);
//     if (!success) {
//       return NextResponse.json({ error: "Too many requests" }, { status: 429 });
//     }
//     // ... handle request
//   }
// ============================================================================

interface RateLimitEntry {
  count: number;
  /** Timestamp (ms) when this window started */
  resetAt: number;
}

interface RateLimitConfig {
  /** Time window in milliseconds (default: 60 000 = 60s) */
  windowMs?: number;
  /** Maximum number of requests per window (default: 100) */
  max?: number;
}

interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Number of requests remaining in this window */
  remaining: number;
}

interface RateLimiter {
  /** Check whether the given key (e.g. IP address) is allowed. */
  check: (key: string) => RateLimitResult;
  /** Reset all tracked entries. Useful for testing. */
  reset: () => void;
}

/**
 * Create a rate limiter instance.
 *
 * Each instance maintains its own in-memory Map so you can create separate
 * limiters for different API routes with different thresholds.
 */
export function rateLimit(config: RateLimitConfig = {}): RateLimiter {
  const { windowMs = 60_000, max = 100 } = config;

  const entries = new Map<string, RateLimitEntry>();

  // Periodic cleanup of stale entries to prevent memory leaks.
  // Runs every 60 seconds. Uses unref() so the timer does not keep
  // the Node process alive.
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (now >= entry.resetAt) {
        entries.delete(key);
      }
    }
  }, 60_000);

  // Allow the process to exit even if the interval is still scheduled
  if (typeof cleanupInterval === "object" && "unref" in cleanupInterval) {
    cleanupInterval.unref();
  }

  function check(key: string): RateLimitResult {
    const now = Date.now();
    const existing = entries.get(key);

    // If no entry or the window has expired, start a fresh window
    if (!existing || now >= existing.resetAt) {
      entries.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return { success: true, remaining: max - 1 };
    }

    // Increment within the current window
    existing.count += 1;

    if (existing.count > max) {
      return { success: false, remaining: 0 };
    }

    return { success: true, remaining: max - existing.count };
  }

  function reset() {
    entries.clear();
  }

  return { check, reset };
}
