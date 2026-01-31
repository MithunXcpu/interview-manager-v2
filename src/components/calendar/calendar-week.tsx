"use client";

import { useMemo } from 'react';
import { isSameDay, isToday, format, getHours, getMinutes } from 'date-fns';
import { cn, formatDate } from '@/lib/utils';
import { getWeekDays } from '@/hooks/use-calendar';
import type { InterviewWithCompany, InterviewType } from '@/types';

// =============================================================================
// Types
// =============================================================================

interface CalendarWeekProps {
  currentDate: Date;
  interviews: InterviewWithCompany[];
  onInterviewClick: (interview: InterviewWithCompany) => void;
}

// =============================================================================
// Constants & Helpers
// =============================================================================

const START_HOUR = 8;
const END_HOUR = 20;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);
const HOUR_HEIGHT = 64; // px per hour slot

function getInterviewTypeColor(type: InterviewType): string {
  switch (type) {
    case 'PHONE_SCREEN':
      return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
    case 'TECHNICAL':
      return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300';
    case 'BEHAVIORAL':
      return 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300';
    case 'SYSTEM_DESIGN':
      return 'bg-purple-500/20 border-purple-500/40 text-purple-300';
    case 'CULTURE_FIT':
      return 'bg-amber-500/20 border-amber-500/40 text-amber-300';
    case 'PANEL':
      return 'bg-rose-500/20 border-rose-500/40 text-rose-300';
    case 'FINAL':
      return 'bg-orange-500/20 border-orange-500/40 text-orange-300';
    default:
      return 'bg-zinc-500/20 border-zinc-500/40 text-zinc-300';
  }
}

/** Calculate position and height for an interview block */
function getBlockStyle(interview: InterviewWithCompany) {
  const date = new Date(interview.scheduledAt);
  const hour = getHours(date);
  const minute = getMinutes(date);
  const topOffset =
    (hour - START_HOUR) * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT;
  const height = (interview.duration / 60) * HOUR_HEIGHT;
  return {
    top: `${Math.max(0, topOffset)}px`,
    height: `${Math.max(HOUR_HEIGHT / 4, height)}px`,
  };
}

// =============================================================================
// Current Time Indicator
// =============================================================================

function CurrentTimeIndicator() {
  const now = new Date();
  const hour = getHours(now);
  const minute = getMinutes(now);

  if (hour < START_HOUR || hour >= END_HOUR) return null;

  const topOffset =
    (hour - START_HOUR) * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: `${topOffset}px` }}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-cyan-400 -ml-1 shrink-0" />
        <div className="flex-1 h-px bg-cyan-400/60" />
      </div>
    </div>
  );
}

// =============================================================================
// CalendarWeek Component
// =============================================================================

export function CalendarWeek({
  currentDate,
  interviews,
  onInterviewClick,
}: CalendarWeekProps) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Group interviews by day
  const interviewsByDay = useMemo(() => {
    const map = new Map<string, InterviewWithCompany[]>();
    for (const interview of interviews) {
      const dayKey = format(new Date(interview.scheduledAt), 'yyyy-MM-dd');
      const existing = map.get(dayKey) ?? [];
      existing.push(interview);
      map.set(dayKey, existing);
    }
    return map;
  }, [interviews]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-zinc-800/60">
        {/* Empty corner for time labels */}
        <div className="border-r border-zinc-800/40" />
        {weekDays.map((day, idx) => {
          const today = isToday(day);
          return (
            <div
              key={idx}
              className={cn(
                'px-2 py-2.5 text-center border-r border-zinc-800/40 last:border-r-0',
                today && 'bg-indigo-500/5'
              )}
            >
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
                {format(day, 'EEE')}
              </span>
              <span
                className={cn(
                  'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mt-0.5',
                  today
                    ? 'bg-indigo-500 text-white'
                    : 'text-zinc-300'
                )}
              >
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto max-h-[600px]">
        <div
          className="grid grid-cols-[60px_repeat(7,1fr)] relative"
          style={{ height: `${(END_HOUR - START_HOUR) * HOUR_HEIGHT}px` }}
        >
          {/* Time labels column */}
          <div className="relative border-r border-zinc-800/40">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 pr-2 -mt-2"
                style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
              >
                <span className="block text-right text-[11px] text-zinc-500">
                  {format(new Date(2024, 0, 1, hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIdx) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayInterviews = interviewsByDay.get(dayKey) ?? [];
            const today = isToday(day);

            return (
              <div
                key={dayIdx}
                className={cn(
                  'relative border-r border-zinc-800/40 last:border-r-0',
                  today && 'bg-indigo-500/[0.03]'
                )}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-zinc-800/30"
                    style={{
                      top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
                    }}
                  />
                ))}

                {/* Current time line for today */}
                {today && <CurrentTimeIndicator />}

                {/* Interview blocks */}
                {dayInterviews.map((interview) => {
                  const blockStyle = getBlockStyle(interview);
                  return (
                    <button
                      key={interview.id}
                      onClick={() => onInterviewClick(interview)}
                      className={cn(
                        'absolute left-0.5 right-0.5 z-10 rounded-md border px-1.5 py-1',
                        'overflow-hidden cursor-pointer transition-all duration-150',
                        'hover:brightness-110 hover:shadow-lg',
                        getInterviewTypeColor(interview.type)
                      )}
                      style={blockStyle}
                    >
                      <span className="block text-[11px] font-semibold truncate">
                        {interview.company?.name ?? 'Interview'}
                      </span>
                      <span className="block text-[10px] opacity-80 truncate">
                        {formatDate(interview.scheduledAt, 'time')}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
