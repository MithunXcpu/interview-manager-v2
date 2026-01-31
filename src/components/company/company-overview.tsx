"use client";

import { useState, useCallback } from 'react';
import { cn, formatRelativeDate, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUpdateCompany } from '@/hooks/use-companies';
import { toast } from '@/components/ui/toast';
import type { CompanyWithRelations } from '@/types';
import {
  FiFileText,
  FiClock,
  FiCalendar,
  FiMail,
  FiActivity,
  FiLayers,
  FiCode,
  FiGlobe,
  FiUsers,
  FiInfo,
} from 'react-icons/fi';

// =============================================================================
// Company Overview Tab
// =============================================================================

interface CompanyOverviewProps {
  company: CompanyWithRelations;
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  const updateCompany = useUpdateCompany();
  const [notes, setNotes] = useState(company.notes ?? '');

  const handleNotesBlur = useCallback(() => {
    if (notes !== (company.notes ?? '')) {
      updateCompany.mutate(
        { id: company.id, data: { notes } },
        {
          onSuccess: () => toast.success('Notes saved'),
          onError: () => toast.error('Failed to save notes'),
        }
      );
    }
  }, [notes, company.notes, company.id, updateCompany]);

  // Calculate metrics
  const daysInPipeline = Math.floor(
    (Date.now() - new Date(company.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const interviewCount = company.interviews?.length ?? 0;
  const emailCount = company.emails?.length ?? 0;

  // Build activity timeline from interviews and emails
  const activities = buildTimeline(company);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          icon={<FiClock className="w-4 h-4 text-cyan-400" />}
          label="Days in Pipeline"
          value={daysInPipeline}
        />
        <MetricCard
          icon={<FiCalendar className="w-4 h-4 text-indigo-400" />}
          label="Interviews"
          value={interviewCount}
        />
        <MetricCard
          icon={<FiMail className="w-4 h-4 text-emerald-400" />}
          label="Emails"
          value={emailCount}
        />
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiFileText className="w-4 h-4 text-zinc-500" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add notes about this company..."
            className={cn(
              'w-full min-h-[120px] rounded-lg border bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100',
              'placeholder:text-zinc-600',
              'border-zinc-800 focus:border-indigo-500/60',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
              'transition-colors duration-150 ease-out resize-y'
            )}
          />
          <p className="text-xs text-zinc-600 mt-1.5">
            Auto-saves when you click away
          </p>
        </CardContent>
      </Card>

      {/* Company Research Card */}
      {company.research && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiGlobe className="w-4 h-4 text-cyan-400" />
              Company Research
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.research.description && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Description</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {company.research.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {company.research.industry && (
                <ResearchField
                  icon={<FiLayers className="w-3.5 h-3.5" />}
                  label="Industry"
                  value={company.research.industry}
                />
              )}
              {company.research.size && (
                <ResearchField
                  icon={<FiUsers className="w-3.5 h-3.5" />}
                  label="Company Size"
                  value={company.research.size}
                />
              )}
              {company.research.founded && (
                <ResearchField
                  icon={<FiInfo className="w-3.5 h-3.5" />}
                  label="Founded"
                  value={company.research.founded}
                />
              )}
            </div>

            {company.research.techStack && company.research.techStack.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-2 flex items-center gap-1.5">
                  <FiCode className="w-3.5 h-3.5" />
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {company.research.techStack.map((tech) => (
                    <Badge key={tech} variant="info" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiActivity className="w-4 h-4 text-zinc-500" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">
              No activity recorded yet
            </p>
          ) : (
            <div className="space-y-0">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-3">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-2 shrink-0',
                        activity.dotColor
                      )}
                    />
                    {index < activities.length - 1 && (
                      <div className="w-px flex-1 bg-zinc-800 min-h-[24px]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4 min-w-0">
                    <p className="text-sm text-zinc-200">{activity.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatRelativeDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Metric Card
// =============================================================================

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-3 px-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/60 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-zinc-100 leading-tight">
            {value}
          </p>
          <p className="text-[11px] text-zinc-500 leading-tight">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Research Field
// =============================================================================

function ResearchField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500 mb-0.5 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-sm text-zinc-200">{value}</p>
    </div>
  );
}

// =============================================================================
// Timeline Builder
// =============================================================================

interface TimelineItem {
  id: string;
  title: string;
  date: Date | string;
  dotColor: string;
}

function buildTimeline(company: CompanyWithRelations): TimelineItem[] {
  const items: TimelineItem[] = [];

  // Add interviews
  for (const interview of company.interviews ?? []) {
    items.push({
      id: `interview-${interview.id}`,
      title: `Interview: ${interview.title} (${interview.type.replace(/_/g, ' ')})`,
      date: interview.scheduledAt,
      dotColor: 'bg-indigo-400',
    });
  }

  // Add emails
  for (const email of company.emails ?? []) {
    items.push({
      id: `email-${email.id}`,
      title: `Email: ${email.subject}`,
      date: email.receivedAt,
      dotColor: 'bg-emerald-400',
    });
  }

  // Add creation event
  items.push({
    id: `created-${company.id}`,
    title: 'Added to pipeline',
    date: company.createdAt,
    dotColor: 'bg-cyan-400',
  });

  // Sort by date, newest first
  items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return items;
}
