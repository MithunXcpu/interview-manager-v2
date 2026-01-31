"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// ActivityHeatmap -- GitHub-style contribution grid (12 weeks x 7 days)
// =============================================================================

export interface ActivityDay {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  activities: ActivityDay[];
}

/** Map activity count to intensity color */
function getIntensityColor(count: number): string {
  if (count === 0) return '#1a1a2e';
  if (count === 1) return '#1e3a5f';
  if (count === 2) return 'rgba(37,99,235,0.2)';
  if (count === 3) return 'rgba(59,130,246,0.4)';
  return '#6366f1';
}

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

export function ActivityHeatmap({ activities }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Build a map from date string to count
  const activityMap: Record<string, number> = {};
  for (const a of activities) {
    activityMap[a.date] = a.count;
  }

  // Generate 12 weeks (84 days) grid
  // Each column = 1 week, each row = day of week (Mon=0, Sun=6)
  const weeks: { date: string; count: number }[][] = [];

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 83);

  // Find the first Monday on or before startDate
  const dayOfWeek = startDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(startDate.getDate() + mondayOffset);

  let currentDate = new Date(startDate);
  let currentWeek: { date: string; count: number }[] = [];

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dow = currentDate.getDay();
    // Convert Sunday(0)=6, Monday(1)=0, ... Saturday(6)=5
    const rowIndex = dow === 0 ? 6 : dow - 1;

    if (rowIndex === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push({
      date: dateStr,
      count: activityMap[dateStr] ?? 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Ensure we have at most 12 full weeks + partial
  const displayWeeks = weeks.slice(-12);

  return (
    <div className="relative">
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-2 pt-0">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="h-[14px] flex items-center text-[10px] text-zinc-600 leading-none"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1">
          {displayWeeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const cell = week[dayIdx];
                if (!cell) {
                  return (
                    <div
                      key={dayIdx}
                      className="h-[14px] w-[14px] rounded-[3px]"
                      style={{ background: '#1a1a2e' }}
                    />
                  );
                }
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      'h-[14px] w-[14px] rounded-[3px] cursor-pointer',
                      'transition-all duration-100',
                      'hover:ring-1 hover:ring-zinc-500'
                    )}
                    style={{ background: getIntensityColor(cell.count) }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        date: cell.date,
                        count: cell.count,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-md border border-zinc-700/80 bg-zinc-800 text-xs text-zinc-200 font-medium shadow-lg pointer-events-none"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 36,
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredCell.count} {hoveredCell.count === 1 ? 'activity' : 'activities'} on{' '}
          {new Date(hoveredCell.date + 'T12:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] text-zinc-600">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-[10px] w-[10px] rounded-[2px]"
            style={{ background: getIntensityColor(level) }}
          />
        ))}
        <span className="text-[10px] text-zinc-600">More</span>
      </div>
    </div>
  );
}
