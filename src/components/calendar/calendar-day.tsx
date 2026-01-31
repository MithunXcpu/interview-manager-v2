"use client";

import { useMemo } from 'react';
import { format, getHours, getMinutes, subMinutes } from 'date-fns';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { InterviewWithCompany, InterviewType } from '@/types';

// =============================================================================
// Types
// =============================================================================

interface CalendarDayProps {
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
const HOUR_HEIGHT = 80; // larger than week view for more detail

function getInterviewTypeColor(type: InterviewType): string {
  switch (type) {
    case 'PHONE_SCREEN':
      return 'bg-emerald-500/20 border-emerald-500/40';
    case 'TECHNICAL':
      return 'bg-cyan-500/20 border-cyan-500/40';
    case 'BEHAVIORAL':
      return 'bg-indigo-500/20 border-indigo-500/40';
    case 'SYSTEM_DESIGN':
      return 'bg-purple-500/20 border-purple-500/40';
    case 'CULTURE_FIT':
      return 'bg-amber-500/20 border-amber-500/40';
    case 'PANEL':
      return 'bg-rose-500/20 border-rose-500/40';
    case 'FINAL':
      return 'bg-orange-500/20 border-orange-500/40';
    default:
      return 'bg-zinc-500/20 border-zinc-500/40';
  }
}

function getInterviewTypeBadgeVariant(
  type: InterviewType
): 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default' {
  switch (type) {
    case 'PHONE_SCREEN':
      return 'success';
    case 'TECHNICAL':
      return 'info';
    case 'BEHAVIORAL':
      return 'primary';
    case 'SYSTEM_DESIGN':
      return 'info';
    case 'CULTURE_FIT':
      return 'warning';
    case 'PANEL':
      return 'danger';
    case 'FINAL':
      return 'warning';
    default:
      return 'default';
  }
}

function formatInterviewType(type: InterviewType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getBlockStyle(scheduledAt: Date | string, duration: number) {
  const date = new Date(scheduledAt);
  const hour = getHours(date);
  const minute = getMinutes(date);
  const topOffset =
    (hour - START_HOUR) * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT;
  const height = (duration / 60) * HOUR_HEIGHT;
  return {
    top: `${Math.max(0, topOffset)}px`,
    height: `${Math.max(HOUR_HEIGHT / 3, height)}px`,
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
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 -ml-1 shrink-0" />
        <div className="flex-1 h-px bg-cyan-400/60" />
      </div>
    </div>
  );
}

// =============================================================================
// CalendarDay Component
// =============================================================================

export function CalendarDay({
  currentDate,
  interviews,
  onInterviewClick,
}: CalendarDayProps) {
  // Sort interviews for the day
  const sortedInterviews = useMemo(
    () =>
      [...interviews].sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime()
      ),
    [interviews]
  );

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 overflow-hidden">
      {/* Day header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">
            {format(currentDate, 'EEEE')}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {format(currentDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <span className="text-xs text-zinc-500">
          {sortedInterviews.length} interview
          {sortedInterviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto max-h-[600px]">
        <div
          className="grid grid-cols-[60px_1fr] relative"
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

          {/* Content column */}
          <div className="relative">
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

            {/* Current time indicator */}
            <CurrentTimeIndicator />

            {/* Prep time blocks and interview blocks */}
            {sortedInterviews.map((interview) => {
              const interviewDate = new Date(interview.scheduledAt);
              const blockStyle = getBlockStyle(interviewDate, interview.duration);

              // Prep time block (30 min before)
              const prepDate = subMinutes(interviewDate, 30);
              const prepStyle = getBlockStyle(prepDate, 30);

              return (
                <div key={interview.id}>
                  {/* Prep time block */}
                  <div
                    className="absolute left-1 right-1 z-5 rounded-md border border-dashed border-zinc-700/60 bg-zinc-800/30 px-3 py-1.5 overflow-hidden"
                    style={prepStyle}
                  >
                    <span className="text-[10px] font-medium text-zinc-500">
                      Prep: {interview.company?.name ?? interview.title}
                    </span>
                  </div>

                  {/* Interview block */}
                  <button
                    onClick={() => onInterviewClick(interview)}
                    className={cn(
                      'absolute left-1 right-1 z-10 rounded-lg border px-3 py-2',
                      'overflow-hidden cursor-pointer transition-all duration-150',
                      'hover:brightness-110 hover:shadow-lg',
                      getInterviewTypeColor(interview.type)
                    )}
                    style={blockStyle}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold text-zinc-200 truncate">
                          {interview.company?.name ?? 'Interview'}
                        </span>
                        <span className="block text-xs text-zinc-400 truncate mt-0.5">
                          {interview.title}
                        </span>
                      </div>
                      <Badge
                        variant={getInterviewTypeBadgeVariant(interview.type)}
                        size="sm"
                      >
                        {formatInterviewType(interview.type)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                      <span>
                        {formatDate(interview.scheduledAt, 'time')} -{' '}
                        {format(
                          new Date(
                            new Date(interview.scheduledAt).getTime() +
                              interview.duration * 60000
                          ),
                          'h:mm a'
                        )}
                      </span>
                      <span className="text-zinc-600">|</span>
                      <span>{interview.duration} min</span>
                    </div>

                    {interview.meetingLink && (
                      <div className="mt-1.5">
                        <span className="text-[11px] text-cyan-400 hover:text-cyan-300">
                          Join Meeting
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
