"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Signal -- 404 Not Found (Dashboard)
// ---------------------------------------------------------------------------

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 mb-6">
        <FiSearch className="h-7 w-7 text-zinc-500" />
      </div>

      {/* Status code */}
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-400 mb-2">
        404
      </p>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
        Page not found
      </h1>

      {/* Description */}
      <p className="text-[14px] text-zinc-500 max-w-sm leading-relaxed mb-8">
        The page you are looking for does not exist or may have been moved.
        Head back to the dashboard to continue.
      </p>

      {/* CTA */}
      <Button
        variant="primary"
        size="md"
        asChild
        iconLeft={<FiArrowLeft className="h-4 w-4" />}
      >
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
