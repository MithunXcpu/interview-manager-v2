"use client";

import { useMemo } from 'react';
import {
  isSameMonth,
  isSameDay,
  isToday,
  format,
  startOfDay,
} from 'date-fns';
import { cn, formatDate } from '@/lib/utils';
import { getMonthDays } from '@/hooks/use-calendar';
import type { InterviewWithCompany, InterviewType } from '@/types';

// =============================================================================
// Types
// =============================================================================

interface CalendarMonthProps {
  currentDate: Date;
  interviews: InterviewWithCompany[];
  onDayClick: (date: Date) => void;
}

// =============================================================================
// Helpers
// =============================================================================

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MAX_PILLS_PER_DAY = 3;

/** Color mapping for interview types */
function getInterviewTypeColor(type: InterviewType): string {
  switch (type) {
    case 'PHONE_SCREEN':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'TECHNICAL':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'BEHAVIORAL':
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    case 'SYSTEM_DESIGN':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'CULTURE_FIT':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'PANEL':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'FINAL':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default:
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
}

// =============================================================================
// CalendarMonth Component
// =============================================================================

export function CalendarMonth({
  currentDate,
  interviews,
  onDayClick,
}: CalendarMonthProps) {
  const days = useMemo(() => getMonthDays(currentDate), [currentDate]);

  // Group interviews by date
  const interviewsByDate = useMemo(() => {
    const map = new Map<string, InterviewWithCompany[]>();
    for (const interview of interviews) {
      const dayKey = format(startOfDay(new Date(interview.scheduledAt)), 'yyyy-MM-dd');
      const existing = map.get(dayKey) ?? [];
      existing.push(interview);
      map.set(dayKey, existing);
    }
    return map;
  }, [interviews]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-zinc-800/60">
        {WEEKDAY_HEADERS.map((day) => (
          <div
            key={day}
            className="px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayInterviews = interviewsByDate.get(dayKey) ?? [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const extraCount = dayInterviews.length - MAX_PILLS_PER_DAY;

          return (
            <button
              key={idx}
              onClick={() => onDayClick(day)}
              className={cn(
                'relative min-h-[100px] p-1.5 text-left border-b border-r border-zinc-800/40 transition-colors duration-100',
                'hover:bg-zinc-800/30',
                !isCurrentMonth && 'opacity-40'
              )}
            >
              {/* Day number */}
              <span
                className={cn(
                  'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                  isCurrentDay
                    ? 'bg-indigo-500 text-white ring-2 ring-indigo-500/30'
                    : 'text-zinc-400'
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Interview pills */}
              <div className="mt-1 space-y-0.5">
                {dayInterviews.slice(0, MAX_PILLS_PER_DAY).map((interview) => (
                  <div
                    key={interview.id}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-medium truncate border',
                      getInterviewTypeColor(interview.type)
                    )}
                  >
                    {interview.company?.name ?? 'Interview'}{' '}
                    <span className="opacity-70">
                      {formatDate(interview.scheduledAt, 'time')}
                    </span>
                  </div>
                ))}
                {extraCount > 0 && (
                  <span className="block text-[10px] font-medium text-zinc-500 pl-1">
                    +{extraCount} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
