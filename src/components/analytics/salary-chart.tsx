"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

// =============================================================================
// SalaryChart -- Grouped bar chart: min/max salary per company
// =============================================================================

export interface SalaryChartData {
  company: string;
  min: number;
  max: number;
}

interface SalaryChartProps {
  data: SalaryChartData[];
}

function formatAxisTick(value: number): string {
  return formatCurrency(value, { compact: true });
}

export function SalaryChart({ data }: SalaryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
        No salary data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, left: 8, bottom: 4 }}
        barCategoryGap="25%"
        barGap={2}
      >
        <CartesianGrid
          stroke="#27272a"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="company"
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatAxisTick}
          width={70}
        />
        <Tooltip
          contentStyle={{
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '0.5rem',
            color: '#e4e4e7',
            fontSize: '0.8125rem',
          }}
          cursor={{ fill: 'rgba(99,102,241,0.06)' }}
          formatter={(value, name) => [
            formatCurrency(value as number),
            name === 'min' ? 'Min Salary' : 'Max Salary',
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
          formatter={(value: string) =>
            value === 'min' ? 'Min Salary' : 'Max Salary'
          }
        />
        <Bar
          dataKey="min"
          fill="#6366f1"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
        <Bar
          dataKey="max"
          fill="#22d3ee"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
