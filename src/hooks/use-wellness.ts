"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { WellnessCheckIn, WellnessCheckInInput } from '@/types';

// =============================================================================
// Query Keys
// =============================================================================

export const wellnessKeys = {
  all: ['wellness'] as const,
};

// =============================================================================
// Fetcher Helpers
// =============================================================================

async function fetchCheckIns(): Promise<WellnessCheckIn[]> {
  const res = await fetch('/api/wellness');
  if (!res.ok) {
    throw new Error('Failed to fetch wellness check-ins');
  }
  return res.json();
}

async function createCheckIn(data: WellnessCheckInInput): Promise<WellnessCheckIn> {
  const res = await fetch('/api/wellness', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create wellness check-in');
  }
  return res.json();
}

// =============================================================================
// Query Hooks
// =============================================================================

export function useWellnessCheckIns() {
  return useQuery({
    queryKey: wellnessKeys.all,
    queryFn: fetchCheckIns,
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

export function useCreateCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wellnessKeys.all });
    },
  });
}

// =============================================================================
// Streak Calculator
// =============================================================================

/**
 * Calculate the consecutive day streak from sorted check-in data.
 * Data is expected to be sorted by date DESC (newest first).
 */
export function useStreak(checkIns: WellnessCheckIn[] | undefined): number {
  return useMemo(() => {
    if (!checkIns || checkIns.length === 0) return 0;

    // Get unique dates (normalized to YYYY-MM-DD)
    const dates = Array.from(
      new Set(
        checkIns.map((c) => {
          const d = new Date(c.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
      )
    ).sort((a, b) => b.localeCompare(a)); // newest first

    // Check if the most recent check-in is today or yesterday
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // If the most recent check-in is not today or yesterday, streak is 0
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
      return 0;
    }

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = Math.round(
        (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [checkIns]);
}
