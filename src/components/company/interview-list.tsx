"use client";

import { useState, useMemo } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { InterviewFormDialog } from '@/components/company/interview-form-dialog';
import type { Interview } from '@/types';
import { FiCalendar, FiPlus, FiClock, FiUser, FiExternalLink } from 'react-icons/fi';

// =============================================================================
// Interview type badge color map
// =============================================================================

const typeColorMap: Record<string, { variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'; className?: string }> = {
  TECHNICAL: { variant: 'primary', className: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  BEHAVIORAL: { variant: 'warning' },
  PHONE_SCREEN: { variant: 'info' },
  SYSTEM_DESIGN: { variant: 'primary', className: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  CULTURE_FIT: { variant: 'success', className: 'bg-teal-500/15 text-teal-400 border-teal-500/20' },
  PANEL: { variant: 'primary' },
  FINAL: { variant: 'warning', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  OTHER: { variant: 'default' },
};

const statusColorMap: Record<string, { variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }> = {
  SCHEDULED: { variant: 'info' },
  COMPLETED: { variant: 'success' },
  CANCELLED: { variant: 'danger' },
  RESCHEDULED: { variant: 'warning' },
  NO_SHOW: { variant: 'danger' },
};

// =============================================================================
// Interview List Component
// =============================================================================

interface InterviewListProps {
  companyId: string;
  interviews: Interview[];
}

export function InterviewList({ companyId, interviews }: InterviewListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sort by date (newest first)
  const sorted = useMemo(
    () =>
      [...interviews].sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
      ),
    [interviews]
  );

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">
          Interviews ({interviews.length})
        </h3>
        <Button
          size="sm"
          iconLeft={<FiPlus className="w-3.5 h-3.5" />}
          onClick={() => setDialogOpen(true)}
        >
          Add Interview
        </Button>
      </div>

      {/* Interview items */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={<FiCalendar className="w-5 h-5" />}
          title="No interviews yet"
          description="Schedule your first interview for this company."
          action={
            <Button
              size="sm"
              iconLeft={<FiPlus className="w-3.5 h-3.5" />}
              onClick={() => setDialogOpen(true)}
            >
              Add Interview
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((interview) => (
            <InterviewItem key={interview.id} interview={interview} />
          ))}
        </div>
      )}

      {/* Add Interview Dialog */}
      <InterviewFormDialog
        companyId={companyId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

// =============================================================================
// Single Interview Item
// =============================================================================

function InterviewItem({ interview }: { interview: Interview }) {
  const typeConfig = typeColorMap[interview.type] ?? typeColorMap.OTHER;
  const statusConfig = statusColorMap[interview.status] ?? statusColorMap.SCHEDULED;

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4',
        'hover:border-zinc-700 transition-colors duration-200'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Title + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h4 className="text-sm font-medium text-zinc-100">
              {interview.title}
            </h4>
            <Badge
              size="sm"
              variant={typeConfig.variant}
              className={typeConfig.className}
            >
              {interview.type.replace(/_/g, ' ')}
            </Badge>
            <Badge
              size="sm"
              variant={statusConfig.variant}
              dot
            >
              {interview.status}
            </Badge>
          </div>

          {/* Date & time */}
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <FiCalendar className="w-3 h-3" />
              {formatDate(interview.scheduledAt, 'datetime')}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {interview.duration} min
            </span>
          </div>

          {/* Interviewer & meeting info */}
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 flex-wrap">
            {interview.interviewerName && (
              <span className="flex items-center gap-1">
                <FiUser className="w-3 h-3" />
                {interview.interviewerName}
                {interview.interviewerRole && (
                  <span className="text-zinc-600">
                    ({interview.interviewerRole})
                  </span>
                )}
              </span>
            )}
            {interview.meetingLink && (
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <FiExternalLink className="w-3 h-3" />
                Join meeting
              </a>
            )}
          </div>

          {/* Notes preview */}
          {interview.notes && (
            <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
              {interview.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
