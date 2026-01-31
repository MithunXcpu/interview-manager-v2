"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompanyWithRelations } from "@/types";

// ---------------------------------------------------------------------------
// Pipeline Stats -- Row of stat cards at the top of the pipeline
// ---------------------------------------------------------------------------

interface PipelineStatsProps {
  companies: CompanyWithRelations[];
  isLoading?: boolean;
}

interface StatItem {
  label: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  color: string;
}

export function PipelineStats({ companies, isLoading }: PipelineStatsProps) {
  const stats: StatItem[] = useMemo(() => {
    if (!companies || companies.length === 0) {
      return [
        { label: "Total Companies", value: 0, color: "text-indigo-400" },
        { label: "Active Applications", value: 0, color: "text-cyan-400" },
        { label: "Interviews This Week", value: 0, color: "text-amber-400" },
        { label: "Response Rate", value: "0%", color: "text-emerald-400" },
      ];
    }

    const total = companies.length;

    // Active = not rejected or declined
    const active = companies.filter((c) => {
      const stageKey = c.userStage?.stageKey;
      return stageKey !== "REJECTED" && stageKey !== "DECLINED";
    }).length;

    // Interviews this week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const interviewsThisWeek = companies.reduce((count, company) => {
      return (
        count +
        company.interviews.filter((interview) => {
          const scheduled = new Date(interview.scheduledAt);
          return (
            scheduled >= weekStart &&
            scheduled < weekEnd &&
            interview.status === "SCHEDULED"
          );
        }).length
      );
    }, 0);

    // Response rate = companies that advanced past APPLIED / total applied
    const applied = companies.filter((c) => {
      const stageKey = c.userStage?.stageKey;
      return stageKey && stageKey !== "WISHLIST";
    }).length;

    const responded = companies.filter((c) => {
      const stageKey = c.userStage?.stageKey;
      return (
        stageKey &&
        stageKey !== "WISHLIST" &&
        stageKey !== "APPLIED"
      );
    }).length;

    const responseRate =
      applied > 0 ? Math.round((responded / applied) * 100) : 0;

    return [
      {
        label: "Total Companies",
        value: total,
        change: "+2 this week",
        changeType: "positive" as const,
        color: "text-indigo-400",
      },
      {
        label: "Active Applications",
        value: active,
        change: `${Math.round((active / Math.max(total, 1)) * 100)}% of total`,
        changeType: "neutral" as const,
        color: "text-cyan-400",
      },
      {
        label: "Interviews This Week",
        value: interviewsThisWeek,
        change: interviewsThisWeek > 0 ? "Stay prepared!" : "None scheduled",
        changeType: interviewsThisWeek > 0 ? ("positive" as const) : ("neutral" as const),
        color: "text-amber-400",
      },
      {
        label: "Response Rate",
        value: `${responseRate}%`,
        change: `${responded} of ${applied} responded`,
        changeType:
          responseRate >= 30
            ? ("positive" as const)
            : responseRate >= 15
              ? ("neutral" as const)
              : ("negative" as const),
        color: "text-emerald-400",
      },
    ];
  }, [companies]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="py-3 px-4">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
                <div className="h-7 w-16 bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} hover>
          <CardContent className="py-3 px-4">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={cn("text-2xl font-bold mt-1 tracking-tight", stat.color)}>
              {stat.value}
            </p>
            {stat.change && (
              <p
                className={cn(
                  "text-[11px] mt-1",
                  stat.changeType === "positive"
                    ? "text-emerald-400"
                    : stat.changeType === "negative"
                      ? "text-red-400"
                      : "text-zinc-500"
                )}
              >
                {stat.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
