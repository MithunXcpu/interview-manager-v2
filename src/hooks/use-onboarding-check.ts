"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Checks if the user has completed onboarding.
 * If not, redirects to /onboarding.
 * Returns `isReady` (true once check is done and user is onboarded).
 */
export function useOnboardingCheck() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/user/settings");
        if (!res.ok) {
          // User not found or error — skip redirect, let dashboard render
          if (!cancelled) setIsReady(true);
          return;
        }
        const data = await res.json();
        if (data.onboardingComplete === false) {
          router.replace("/onboarding");
          return;
        }
      } catch {
        // Network error — don't block the dashboard
      }
      if (!cancelled) setIsReady(true);
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return isReady;
}
