"use client";

import { useQuery } from '@tanstack/react-query';
import type { AnalyticsData } from '@/app/api/analytics/route';

// =============================================================================
// Query Keys
// =============================================================================

export const analyticsKeys = {
  all: ['analytics'] as const,
};

// =============================================================================
// Fetcher
// =============================================================================

async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch('/api/analytics');
  if (!res.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return res.json();
}

// =============================================================================
// Hook
// =============================================================================

export function useAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.all,
    queryFn: fetchAnalytics,
  });
}
