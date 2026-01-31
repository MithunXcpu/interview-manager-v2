"use client";

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  eachDayOfInterval,
  format,
} from 'date-fns';
import type { InterviewWithCompany } from '@/types';

// =============================================================================
// Types
// =============================================================================

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// =============================================================================
// Query Keys
// =============================================================================

export const calendarKeys = {
  interviews: (start: string, end: string) =>
    ['calendar', 'interviews', start, end] as const,
};

// =============================================================================
// Fetcher
// =============================================================================

async function fetchInterviewsByDateRange(
  start: string,
  end: string
): Promise<InterviewWithCompany[]> {
  const res = await fetch(
    `/api/calendar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch calendar interviews');
  }
  return res.json();
}

// =============================================================================
// Date Helpers
// =============================================================================

/** Get all days displayed in a month grid (includes padding days from adjacent months) */
export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

/** Get all 7 days of the week containing the given date */
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

// =============================================================================
// Calendar State Hook
// =============================================================================

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  const navigateForward = useCallback(() => {
    setCurrentDate((prev) => {
      switch (view) {
        case 'month':
          return addMonths(prev, 1);
        case 'week':
          return addWeeks(prev, 1);
        case 'day':
          return addDays(prev, 1);
        case 'agenda':
          return addMonths(prev, 1);
        default:
          return prev;
      }
    });
  }, [view]);

  const navigateBack = useCallback(() => {
    setCurrentDate((prev) => {
      switch (view) {
        case 'month':
          return subMonths(prev, 1);
        case 'week':
          return subWeeks(prev, 1);
        case 'day':
          return subDays(prev, 1);
        case 'agenda':
          return subMonths(prev, 1);
        default:
          return prev;
      }
    });
  }, [view]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // Calculate date range for data fetching based on current view
  const dateRange = useMemo(() => {
    let start: Date;
    let end: Date;

    switch (view) {
      case 'month': {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        start = startOfWeek(monthStart, { weekStartsOn: 0 });
        end = endOfWeek(monthEnd, { weekStartsOn: 0 });
        break;
      }
      case 'week': {
        start = startOfWeek(currentDate, { weekStartsOn: 0 });
        end = endOfWeek(currentDate, { weekStartsOn: 0 });
        break;
      }
      case 'day': {
        start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(currentDate);
        end.setHours(23, 59, 59, 999);
        break;
      }
      case 'agenda': {
        // Show 60 days ahead from today for agenda
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end = addDays(start, 60);
        break;
      }
    }

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }, [currentDate, view]);

  // Label for the header
  const headerLabel = useMemo(() => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week': {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        const startStr = format(weekStart, 'MMM d');
        const endStr = format(weekEnd, 'MMM d, yyyy');
        return `${startStr} - ${endStr}`;
      }
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'agenda':
        return 'Upcoming Interviews';
      default:
        return '';
    }
  }, [currentDate, view]);

  return {
    currentDate,
    view,
    setView,
    navigateForward,
    navigateBack,
    goToToday,
    goToDate,
    dateRange,
    headerLabel,
  };
}

// =============================================================================
// Data Hook
// =============================================================================

export function useInterviewsByDateRange(start: string, end: string) {
  return useQuery({
    queryKey: calendarKeys.interviews(start, end),
    queryFn: () => fetchInterviewsByDateRange(start, end),
    enabled: !!start && !!end,
  });
}
