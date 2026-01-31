// ============================================================================
// Signal -- API Error Handler Utility
// ============================================================================
// Standardized error handling for Next.js API routes.
//
// Usage:
//   import { ApiError, handleApiError, notFound, badRequest } from "@/lib/api-errors";
//
//   export async function GET() {
//     try {
//       const item = await db.item.findUnique({ where: { id } });
//       if (!item) throw notFound("Item not found");
//       return NextResponse.json(item);
//     } catch (error) {
//       return handleApiError(error);
//     }
//   }
// ============================================================================

import { NextResponse } from "next/server";

// -- ApiError class ---------------------------------------------------------

export class ApiError extends Error {
  /** HTTP status code */
  readonly status: number;
  /** Machine-readable error code (e.g. "NOT_FOUND") */
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// -- Error response shape ---------------------------------------------------

interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

// -- handleApiError ---------------------------------------------------------

/**
 * Convert any thrown error into a well-formed NextResponse with the correct
 * HTTP status code and a JSON body.
 *
 * - `ApiError` instances use their own status and code.
 * - Zod `ZodError` instances return 400 with validation details.
 * - All other errors return a generic 500 response (message is sanitized in
 *   production so internal details are never leaked to clients).
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { message: error.message, code: error.code } },
      { status: error.status }
    );
  }

  // Zod validation errors (duck-type check to avoid import dependency)
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown[] }).issues)
  ) {
    return NextResponse.json(
      {
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
        },
      },
      { status: 400 }
    );
  }

  // Unexpected errors — log server-side, return safe message to client
  console.error("[API Error]", error);

  const message =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : "Internal server error";

  return NextResponse.json(
    { error: { message, code: "INTERNAL_ERROR" } },
    { status: 500 }
  );
}

// -- Factory functions for common errors ------------------------------------

/** 400 Bad Request */
export function badRequest(message = "Bad request"): ApiError {
  return new ApiError(message, 400, "BAD_REQUEST");
}

/** 401 Unauthorized */
export function unauthorized(message = "Unauthorized"): ApiError {
  return new ApiError(message, 401, "UNAUTHORIZED");
}

/** 403 Forbidden */
export function forbidden(message = "Forbidden"): ApiError {
  return new ApiError(message, 403, "FORBIDDEN");
}

/** 404 Not Found */
export function notFound(message = "Not found"): ApiError {
  return new ApiError(message, 404, "NOT_FOUND");
}
