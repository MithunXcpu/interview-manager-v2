"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarMonth } from "@/components/calendar/calendar-month";
import { CalendarWeek } from "@/components/calendar/calendar-week";
import { CalendarDay } from "@/components/calendar/calendar-day";
import { useCalendar, useInterviewsByDateRange } from "@/hooks/use-calendar";
import type { InterviewWithCompany } from "@/types";

type CalendarView = "month" | "week" | "day" | "agenda";

export default function CalendarPage() {
  const { currentDate, navigateForward, navigateBack, goToToday } = useCalendar();
  const [view, setView] = useState<CalendarView>("month");

  // Calculate date range based on view
  const { start, end } = useMemo(() => {
    if (view === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return {
        start: startOfWeek(monthStart).toISOString(),
        end: endOfWeek(monthEnd).toISOString(),
      };
    }
    if (view === "week") {
      return {
        start: startOfWeek(currentDate).toISOString(),
        end: endOfWeek(currentDate).toISOString(),
      };
    }
    // day or agenda
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    return { start: dayStart.toISOString(), end: dayEnd.toISOString() };
  }, [currentDate, view]);

  const { data: interviews = [], isLoading } = useInterviewsByDateRange(start, end);

  const handleDayClick = (date: Date) => {
    goToToday(); // Reset to today first, then we'd navigate to that date
    setView("day");
  };

  const handleInterviewClick = (interview: InterviewWithCompany) => {
    // Could open a detail dialog — for now just log
  };

  // Title for header
  const headerTitle = useMemo(() => {
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }
    return format(currentDate, "EEEE, MMMM d, yyyy");
  }, [currentDate, view]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Calendar</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{headerTitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={navigateBack}>
              <FiChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={navigateForward}>
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View switcher */}
          <div className="flex items-center rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-0.5">
            {(["month", "week", "day", "agenda"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  view === v
                    ? "bg-indigo-500/15 text-indigo-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <Button size="sm" iconLeft={<FiPlus className="w-3.5 h-3.5" />}>
            Add Interview
          </Button>
        </div>
      </div>

      {/* Calendar content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      ) : (
        <>
          {view === "month" && (
            <CalendarMonth
              currentDate={currentDate}
              interviews={interviews}
              onDayClick={handleDayClick}
            />
          )}
          {view === "week" && (
            <CalendarWeek
              currentDate={currentDate}
              interviews={interviews}
              onInterviewClick={handleInterviewClick}
            />
          )}
          {view === "day" && (
            <CalendarDay
              currentDate={currentDate}
              interviews={interviews}
              onInterviewClick={handleInterviewClick}
            />
          )}
          {view === "agenda" && (
            <CalendarAgenda interviews={interviews} />
          )}
        </>
      )}
    </div>
  );
}

// Inline agenda view
function CalendarAgenda({ interviews }: { interviews: InterviewWithCompany[] }) {
  const sorted = [...interviews].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 mb-4">
          <FiPlus className="w-5 h-5 text-zinc-500" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-1">No upcoming interviews</h3>
        <p className="text-xs text-zinc-600">Schedule an interview to see it here.</p>
      </div>
    );
  }

  // Group by date
  const grouped = new Map<string, InterviewWithCompany[]>();
  for (const interview of sorted) {
    const dateKey = format(new Date(interview.scheduledAt), "yyyy-MM-dd");
    const existing = grouped.get(dateKey) ?? [];
    existing.push(interview);
    grouped.set(dateKey, existing);
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([dateKey, dayInterviews]) => (
        <div key={dateKey}>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            {format(new Date(dateKey), "EEEE, MMMM d")}
          </h3>
          <div className="space-y-2">
            {dayInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center gap-4 p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors"
              >
                <span className="text-xs font-mono text-cyan-400 w-16 shrink-0">
                  {format(new Date(interview.scheduledAt), "h:mm a")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {interview.company?.name ?? "Interview"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{interview.title}</p>
                </div>
                <span className="text-xs text-zinc-600">{interview.duration}m</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
