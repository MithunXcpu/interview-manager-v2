// ============================================================================
// Signal -- Input Sanitization Utility
// ============================================================================
// Defensive sanitization helpers to strip dangerous content from user input
// before storing or rendering. Works entirely on the server or client side
// with zero external dependencies.
//
// Usage:
//   import { sanitizeHtml, sanitizeInput, sanitizeObject } from "@/lib/sanitize";
//
//   const safe = sanitizeInput(formData.name);
//   const safeBody = sanitizeHtml(formData.body);
//   const safePayload = sanitizeObject(requestBody);
// ============================================================================

/**
 * Strip all HTML tags from a string, with special attention to script/style
 * elements whose inner content should also be removed.
 *
 * @example sanitizeHtml("<b>Hello</b> <script>alert(1)</script>") => "Hello "
 */
export function sanitizeHtml(input: string): string {
  if (!input) return "";

  let result = input;

  // 1. Remove <script>...</script> and <style>...</style> blocks (including
  //    content between tags) — case-insensitive, dotAll for multiline.
  result = result.replace(/<script[\s>][\s\S]*?<\/script>/gi, "");
  result = result.replace(/<style[\s>][\s\S]*?<\/style>/gi, "");

  // 2. Remove on* event handler attributes (e.g. onerror, onclick)
  result = result.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");

  // 3. Remove remaining HTML tags
  result = result.replace(/<[^>]*>/g, "");

  // 4. Decode common HTML entities to plain text
  result = result
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");

  return result.trim();
}

/**
 * General-purpose input sanitizer: trim leading/trailing whitespace and
 * collapse multiple consecutive whitespace characters into a single space.
 *
 * @example sanitizeInput("  Hello   world  ") => "Hello world"
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Deep-sanitize all string values in an object (or nested objects / arrays).
 * Non-string primitives (numbers, booleans, null) are passed through unchanged.
 *
 * Applies both `sanitizeHtml` and `sanitizeInput` to every string field.
 *
 * @example
 * sanitizeObject({ name: "  <b>Acme</b>  ", salary: 120000 })
 * // => { name: "Acme", salary: 120000 }
 */
export function sanitizeObject(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeValue(value);
  }

  return result;
}

// -- Internal helpers -------------------------------------------------------

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeInput(sanitizeHtml(value));
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === "object") {
    return sanitizeObject(value as Record<string, unknown>);
  }

  // numbers, booleans, null, undefined — pass through
  return value;
}
