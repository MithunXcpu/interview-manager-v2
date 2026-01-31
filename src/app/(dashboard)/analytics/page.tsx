"use client";

import { useState, useMemo } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useCompanies } from '@/hooks/use-companies';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/analytics/stat-card';
import { FunnelChart } from '@/components/analytics/funnel-chart';
import { ActivityHeatmap } from '@/components/analytics/activity-heatmap';
import { SalaryChart } from '@/components/analytics/salary-chart';
import { TimelineChart } from '@/components/analytics/timeline-chart';
import {
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiActivity,
  FiDollarSign,
  FiTarget,
} from 'react-icons/fi';

// =============================================================================
// Analytics Dashboard Page
// =============================================================================

type DateRange = '30d' | '90d' | 'all';

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All Time', value: 'all' },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: companies } = useCompanies();

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!analytics) return null;

    if (dateRange === 'all') return analytics;

    const days = dateRange === '30d' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    // Filter activity data by date range
    const filteredActivity = analytics.activityByDate.filter(
      (a) => a.date >= cutoffStr
    );

    // Filter timeline data by date range
    const cutoffMonth = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}`;
    const filteredTimeline = analytics.applicationsOverTime.filter(
      (a) => a.month >= cutoffMonth
    );

    return {
      ...analytics,
      activityByDate: filteredActivity,
      applicationsOverTime: filteredTimeline,
    };
  }, [analytics, dateRange]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Pipeline insights and hiring metrics
          </p>
        </div>

        {/* Date range filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150',
                dateRange === option.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FiBriefcase className="h-4 w-4" />}
            title="Total Companies"
            value={filteredData?.totalCompanies ?? 0}
          />
          <StatCard
            icon={<FiCalendar className="h-4 w-4" />}
            title="Total Interviews"
            value={filteredData?.totalInterviews ?? 0}
          />
          <StatCard
            icon={<FiClock className="h-4 w-4" />}
            title="Avg Response Time"
            value={`${filteredData?.avgResponseDays ?? 0}d`}
          />
          <StatCard
            icon={<FiTarget className="h-4 w-4" />}
            title="Offer Rate"
            value={`${filteredData?.offerRate ?? 0}%`}
          />
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline funnel */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiBarChart2 className="h-4 w-4 text-indigo-400" />
              <CardTitle>Pipeline Funnel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton variant="chart" />
            ) : (
              <FunnelChart data={filteredData?.companiesByStage ?? []} />
            )}
          </CardContent>
        </Card>

        {/* Activity heatmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiActivity className="h-4 w-4 text-emerald-400" />
              <CardTitle>Activity (Last 12 Weeks)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton variant="chart" />
            ) : (
              <ActivityHeatmap
                activities={filteredData?.activityByDate ?? []}
              />
            )}
          </CardContent>
        </Card>

        {/* Salary analytics */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiDollarSign className="h-4 w-4 text-cyan-400" />
              <CardTitle>Salary Ranges</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton variant="chart" />
            ) : (
              <SalaryChart data={filteredData?.salaryData ?? []} />
            )}
          </CardContent>
        </Card>

        {/* Applications timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="h-4 w-4 text-indigo-400" />
              <CardTitle>Applications Over Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton variant="chart" />
            ) : (
              <TimelineChart
                data={filteredData?.applicationsOverTime ?? []}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
