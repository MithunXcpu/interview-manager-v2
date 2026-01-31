"use client";

import { useMemo } from "react";
import { FiHeart, FiActivity } from "react-icons/fi";
import { cn, formatDate } from "@/lib/utils";
import { useWellnessCheckIns, useStreak } from "@/hooks/use-wellness";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { MoodTracker } from "@/components/wellness/mood-tracker";
import { StreakDisplay } from "@/components/wellness/streak-display";
import type { WellnessCheckIn } from "@/types";

// =============================================================================
// Wellness Tracker Page
// =============================================================================

const moodEmojis: Record<number, string> = {
  1: "\u{1F614}",
  2: "\u{1F615}",
  3: "\u{1F610}",
  4: "\u{1F642}",
  5: "\u{1F60A}",
};

const moodLabels: Record<number, string> = {
  1: "Very Sad",
  2: "Sad",
  3: "Neutral",
  4: "Happy",
  5: "Very Happy",
};

const energyColors: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-amber-500",
  4: "bg-lime-500",
  5: "bg-emerald-500",
};

function CheckInItem({ checkIn }: { checkIn: WellnessCheckIn }) {
  return (
    <div className="flex items-start gap-4 py-3">
      {/* Mood emoji */}
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/60 shrink-0">
        <span className="text-xl">{moodEmojis[checkIn.mood] ?? "\u{1F610}"}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-zinc-200">
            {moodLabels[checkIn.mood] ?? "Unknown"}
          </span>
          <Badge size="sm" variant="default">
            Energy: {checkIn.energy}/5
          </Badge>
        </div>
        {checkIn.notes && (
          <p className="text-xs text-zinc-500 line-clamp-2">{checkIn.notes}</p>
        )}
      </div>

      {/* Date */}
      <span className="text-xs text-zinc-600 shrink-0">
        {formatDate(checkIn.date)}
      </span>
    </div>
  );
}

function MoodTrendChart({ checkIns }: { checkIns: WellnessCheckIn[] }) {
  // Take last 14 check-ins and reverse so oldest is first
  const data = useMemo(() => {
    return [...checkIns].slice(0, 14).reverse();
  }, [checkIns]);

  if (data.length < 2) return null;

  const maxVal = 5;
  const chartHeight = 120;
  const chartWidth = data.length * 40;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FiActivity className="w-4 h-4 text-cyan-400" />
          Mood & Energy Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg
            width={Math.max(chartWidth, 300)}
            height={chartHeight + 40}
            className="w-full"
            viewBox={`0 0 ${Math.max(chartWidth, 300)} ${chartHeight + 40}`}
          >
            {/* Grid lines */}
            {[1, 2, 3, 4, 5].map((val) => {
              const y = chartHeight - ((val - 1) / (maxVal - 1)) * chartHeight + 10;
              return (
                <line
                  key={val}
                  x1={30}
                  y1={y}
                  x2={Math.max(chartWidth, 300) - 10}
                  y2={y}
                  stroke="rgb(39 39 42)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Mood line */}
            <polyline
              fill="none"
              stroke="rgb(99 102 241)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data
                .map((d, i) => {
                  const x = 40 + i * ((Math.max(chartWidth, 300) - 60) / (data.length - 1));
                  const y =
                    chartHeight -
                    ((d.mood - 1) / (maxVal - 1)) * chartHeight +
                    10;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* Energy line */}
            <polyline
              fill="none"
              stroke="rgb(34 211 238)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 3"
              points={data
                .map((d, i) => {
                  const x = 40 + i * ((Math.max(chartWidth, 300) - 60) / (data.length - 1));
                  const y =
                    chartHeight -
                    ((d.energy - 1) / (maxVal - 1)) * chartHeight +
                    10;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* Mood dots */}
            {data.map((d, i) => {
              const x = 40 + i * ((Math.max(chartWidth, 300) - 60) / (data.length - 1));
              const y =
                chartHeight -
                ((d.mood - 1) / (maxVal - 1)) * chartHeight +
                10;
              return (
                <circle
                  key={`mood-${i}`}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="rgb(99 102 241)"
                />
              );
            })}

            {/* Energy dots */}
            {data.map((d, i) => {
              const x = 40 + i * ((Math.max(chartWidth, 300) - 60) / (data.length - 1));
              const y =
                chartHeight -
                ((d.energy - 1) / (maxVal - 1)) * chartHeight +
                10;
              return (
                <circle
                  key={`energy-${i}`}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="rgb(34 211 238)"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-indigo-500 rounded-full" />
            <span className="text-xs text-zinc-500">Mood</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-cyan-400 rounded-full" />
            <span className="text-xs text-zinc-500">Energy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyStats({ checkIns }: { checkIns: WellnessCheckIn[] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekCheckIns = checkIns.filter(
      (c) => new Date(c.date) >= weekAgo
    );

    if (weekCheckIns.length === 0) {
      return { avgMood: 0, avgEnergy: 0, count: 0 };
    }

    const avgMood =
      weekCheckIns.reduce((sum, c) => sum + c.mood, 0) / weekCheckIns.length;
    const avgEnergy =
      weekCheckIns.reduce((sum, c) => sum + c.energy, 0) / weekCheckIns.length;

    return {
      avgMood: Math.round(avgMood * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      count: weekCheckIns.length,
    };
  }, [checkIns]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">Avg Mood</p>
            <p className="text-xl font-bold text-indigo-400 tabular-nums">
              {stats.avgMood > 0 ? stats.avgMood.toFixed(1) : "--"}
            </p>
            {stats.avgMood > 0 && (
              <span className="text-sm">
                {moodEmojis[Math.round(stats.avgMood)]}
              </span>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">Avg Energy</p>
            <p className="text-xl font-bold text-cyan-400 tabular-nums">
              {stats.avgEnergy > 0 ? stats.avgEnergy.toFixed(1) : "--"}
            </p>
            <span className="text-xs text-zinc-600">/ 5</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">Check-Ins</p>
            <p className="text-xl font-bold text-zinc-200 tabular-nums">
              {stats.count}
            </p>
            <span className="text-xs text-zinc-600">this week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WellnessPage() {
  const { data: checkIns, isLoading } = useWellnessCheckIns();
  const streak = useStreak(checkIns);

  // Last 30 days of check-ins for history
  const recentCheckIns = useMemo(() => {
    if (!checkIns) return [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return checkIns.filter((c) => new Date(c.date) >= thirtyDaysAgo);
  }, [checkIns]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton variant="text" className="w-48 h-7" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
          Wellness Tracker
        </h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">
          Track your mood and energy throughout your job search
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: check-in form + trend */}
        <div className="lg:col-span-2 space-y-6">
          <MoodTracker />

          {/* Mood trend chart */}
          {checkIns && checkIns.length >= 2 && (
            <MoodTrendChart checkIns={checkIns} />
          )}

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Check-Ins</CardTitle>
            </CardHeader>
            <CardContent>
              {recentCheckIns.length === 0 ? (
                <EmptyState
                  icon={<FiHeart className="w-5 h-5" />}
                  title="No check-ins yet"
                  description="Start tracking your wellness by logging your first daily check-in above."
                  className="py-8"
                />
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {recentCheckIns.map((checkIn) => (
                    <CheckInItem key={checkIn.id} checkIn={checkIn} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: streak + weekly stats */}
        <div className="space-y-6">
          <StreakDisplay streak={streak} />

          {checkIns && checkIns.length > 0 && (
            <WeeklyStats checkIns={checkIns} />
          )}
        </div>
      </div>
    </div>
  );
}
