"use client";

import { useState } from 'react';
import { cn, formatRelativeDate, truncate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import type { Email } from '@/types';
import { FiMail, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// =============================================================================
// Email List Component
// =============================================================================

interface EmailListProps {
  emails: Email[];
}

export function EmailList({ emails }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <EmptyState
        icon={<FiMail className="w-5 h-5" />}
        title="No emails yet"
        description="Emails associated with this company will appear here once synced."
      />
    );
  }

  // Sort by receivedAt, newest first
  const sorted = [...emails].sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-200">
        Emails ({emails.length})
      </h3>
      <div className="space-y-2">
        {sorted.map((email) => (
          <EmailItem key={email.id} email={email} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Single Email Item
// =============================================================================

function EmailItem({ email }: { email: Email }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-800/80 bg-zinc-900/70',
        'hover:border-zinc-700 transition-colors duration-200',
        'cursor-pointer'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-zinc-100 truncate">
              {email.subject || '(No subject)'}
            </span>
            {!email.isRead && (
              <Badge variant="info" size="sm" dot>
                New
              </Badge>
            )}
            {email.isRecruiterEmail && (
              <Badge variant="primary" size="sm">
                Recruiter
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="truncate">From: {email.from}</span>
            <span className="shrink-0">{formatRelativeDate(email.receivedAt)}</span>
          </div>

          {/* Snippet (when collapsed) */}
          {!expanded && email.snippet && (
            <p className="text-xs text-zinc-500 mt-1.5 line-clamp-1">
              {truncate(email.snippet, 120)}
            </p>
          )}
        </div>

        <button
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? (
            <FiChevronUp className="w-4 h-4" />
          ) : (
            <FiChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800/60 pt-3">
          {email.summary && (
            <div className="mb-3 p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs font-medium text-cyan-400 mb-0.5">
                AI Summary
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {email.summary}
              </p>
            </div>
          )}
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {email.body || email.snippet || 'No content available.'}
          </div>
        </div>
      )}
    </div>
  );
}
