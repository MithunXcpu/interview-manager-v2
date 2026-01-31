"use client";

import { cn, formatCurrency, formatDate, formatRelativeDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { CompanyWithRelations } from '@/types';
import {
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiLayers,
} from 'react-icons/fi';

// =============================================================================
// Stage color mapping
// =============================================================================

const stageColorMap: Record<string, string> = {
  WISHLIST: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
  APPLIED: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  RECRUITER_SCREEN: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  PHONE_SCREEN: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  TECHNICAL: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  SYSTEM_DESIGN: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  BEHAVIORAL: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  ONSITE: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  TEAM_MATCH: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  HIRING_MANAGER: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  FINAL_ROUND: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  OFFER: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  REJECTED: 'bg-red-500/15 text-red-400 border-red-500/20',
  ACCEPTED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  DECLINED: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
};

// =============================================================================
// Company Sidebar
// =============================================================================

interface CompanySidebarProps {
  company: CompanyWithRelations;
}

export function CompanySidebar({ company }: CompanySidebarProps) {
  const stage = company.userStage;
  const stageKey = stage?.stageKey ?? '';
  const stageColor = stageColorMap[stageKey] ?? stageColorMap.WISHLIST;

  const salaryRange =
    company.salaryMin != null && company.salaryMax != null
      ? `${formatCurrency(company.salaryMin, { compact: true })} - ${formatCurrency(company.salaryMax, { compact: true })}`
      : company.salaryMin != null
        ? `From ${formatCurrency(company.salaryMin, { compact: true })}`
        : company.salaryMax != null
          ? `Up to ${formatCurrency(company.salaryMax, { compact: true })}`
          : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FiLayers className="w-4 h-4 text-zinc-500" />
          Quick Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage */}
        <InfoRow label="Stage">
          {stage ? (
            <Badge
              className={cn('text-xs', stageColor)}
              dot
            >
              {stage.emoji} {stage.name}
            </Badge>
          ) : (
            <span className="text-zinc-600">&mdash;</span>
          )}
        </InfoRow>

        <Separator />

        {/* Salary Range */}
        <InfoRow
          label="Salary Range"
          icon={<FiDollarSign className="w-3.5 h-3.5" />}
        >
          {salaryRange ? (
            <span className="text-emerald-400 font-medium text-sm">
              {salaryRange}
            </span>
          ) : (
            <span className="text-zinc-600">&mdash;</span>
          )}
        </InfoRow>

        <Separator />

        {/* Recruiter */}
        <InfoRow
          label="Recruiter"
          icon={<FiUser className="w-3.5 h-3.5" />}
        >
          {company.recruiterName ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-200 text-sm">
                {company.recruiterName}
              </span>
              {company.recruiterEmail && (
                <a
                  href={`mailto:${company.recruiterEmail}`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <FiMail className="w-3 h-3" />
                  {company.recruiterEmail}
                </a>
              )}
            </div>
          ) : (
            <span className="text-zinc-600">&mdash;</span>
          )}
        </InfoRow>

        <Separator />

        {/* Location */}
        <InfoRow
          label="Location"
          icon={<FiMapPin className="w-3.5 h-3.5" />}
        >
          {company.location ? (
            <span className="text-zinc-200 text-sm">{company.location}</span>
          ) : (
            <span className="text-zinc-600">&mdash;</span>
          )}
        </InfoRow>

        <Separator />

        {/* Applied Date */}
        <InfoRow
          label="Applied Date"
          icon={<FiCalendar className="w-3.5 h-3.5" />}
        >
          {company.appliedDate ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-200 text-sm">
                {formatDate(company.appliedDate)}
              </span>
              <span className="text-xs text-zinc-500">
                {formatRelativeDate(company.appliedDate)}
              </span>
            </div>
          ) : (
            <span className="text-zinc-600">&mdash;</span>
          )}
        </InfoRow>

        <Separator />

        {/* Job URL */}
        <InfoRow
          label="Job Posting"
          icon={<FiExternalLink className="w-3.5 h-3.5" />}
        >
          {company.jobUrl ? (
            <a
              href={company.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 truncate"
            >
              View posting
              <FiExternalLink className="w-3 h-3 shrink-0" />
            </a>
          ) : (
            <span className="text-zinc-600">&mdash;</span>
          )}
        </InfoRow>

        <Separator />

        {/* Last Activity */}
        <InfoRow
          label="Last Activity"
          icon={<FiClock className="w-3.5 h-3.5" />}
        >
          {company.lastActivityDate ? (
            <span className="text-zinc-200 text-sm">
              {formatRelativeDate(company.lastActivityDate)}
            </span>
          ) : (
            <span className="text-zinc-600">&mdash;</span>
          )}
        </InfoRow>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Info Row helper
// =============================================================================

function InfoRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}
