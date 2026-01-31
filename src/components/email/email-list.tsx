"use client";

import { useMemo } from 'react';
import { cn, formatRelativeDate, truncate } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useEmails, useMarkRead } from '@/hooks/use-emails';
import type { TransformedEmail } from '@/hooks/use-emails';

// =============================================================================
// Types
// =============================================================================

interface EmailThread {
  threadId: string;
  latestEmail: TransformedEmail;
  emails: TransformedEmail[];
  hasUnread: boolean;
}

interface EmailListProps {
  selectedEmailId: string | null;
  onSelectEmail: (email: TransformedEmail) => void;
  searchQuery: string;
  filter: 'all' | 'unread' | 'recruiter';
}

// =============================================================================
// Helpers
// =============================================================================

/** Extract sender display name from email "from" field */
function extractSenderName(from: string): string {
  // Handle "Name <email@example.com>" format
  const match = from.match(/^(.+?)\s*<.+>$/);
  if (match) return match[1].trim();
  // Handle plain email
  return from.split('@')[0];
}

// =============================================================================
// Loading skeleton
// =============================================================================

function EmailListSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-full h-3" />
            <Skeleton variant="text" className="w-1/2 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// EmailList Component
// =============================================================================

export function EmailList({
  selectedEmailId,
  onSelectEmail,
  searchQuery,
  filter,
}: EmailListProps) {
  const { data, isLoading } = useEmails();
  const emails = data?.emails;
  const markRead = useMarkRead();

  // Group emails by threadId and get latest from each thread
  const threads = useMemo(() => {
    if (!emails) return [];

    const threadMap = new Map<string, TransformedEmail[]>();

    for (const email of emails) {
      const existing = threadMap.get(email.threadId);
      if (existing) {
        existing.push(email);
      } else {
        threadMap.set(email.threadId, [email]);
      }
    }

    const threadList: EmailThread[] = [];

    for (const [threadId, threadEmails] of threadMap) {
      // Sort emails in thread by date desc
      const sorted = [...threadEmails].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      threadList.push({
        threadId,
        latestEmail: sorted[0],
        emails: sorted,
        hasUnread: sorted.some((e) => !e.isRead),
      });
    }

    // Sort threads by latest email date
    threadList.sort(
      (a, b) =>
        new Date(b.latestEmail.date).getTime() -
        new Date(a.latestEmail.date).getTime()
    );

    return threadList;
  }, [emails]);

  // Apply filters
  const filteredThreads = useMemo(() => {
    let result = threads;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.latestEmail.subject.toLowerCase().includes(query) ||
          t.latestEmail.from.toLowerCase().includes(query) ||
          t.latestEmail.preview?.toLowerCase().includes(query)
      );
    }

    // Type filter
    switch (filter) {
      case 'unread':
        result = result.filter((t) => t.hasUnread);
        break;
      case 'recruiter':
        result = result.filter((t) =>
          t.emails.some((e) => e.isRecruiterEmail)
        );
        break;
    }

    return result;
  }, [threads, searchQuery, filter]);

  const handleSelect = (thread: EmailThread) => {
    onSelectEmail(thread.latestEmail);
    // Mark as read if unread
    if (!thread.latestEmail.isRead) {
      markRead.mutate({ id: thread.latestEmail.id });
    }
  };

  if (isLoading) {
    return <EmailListSkeleton />;
  }

  if (!filteredThreads.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/60 mb-3">
          <svg
            className="w-5 h-5 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-400">No emails found</p>
        <p className="text-xs text-zinc-600 mt-1">
          {searchQuery ? 'Try a different search term' : 'Your inbox is empty'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      <div className="space-y-0.5 p-2">
        {filteredThreads.map((thread) => {
          const email = thread.latestEmail;
          const senderName = extractSenderName(email.from);
          const isSelected = selectedEmailId === email.id;
          const threadCount = thread.emails.length;

          return (
            <button
              key={thread.threadId}
              onClick={() => handleSelect(thread)}
              className={cn(
                'w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all duration-150',
                'hover:bg-zinc-800/50',
                isSelected
                  ? 'bg-zinc-800/70 border-l-2 border-l-indigo-500'
                  : 'border-l-2 border-l-transparent'
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mt-0.5">
                <Avatar name={senderName} size="md" />
                {/* Unread indicator */}
                {thread.hasUnread && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-[#0a0f1e]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Top row: sender + date */}
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span
                    className={cn(
                      'text-sm truncate',
                      thread.hasUnread
                        ? 'font-semibold text-zinc-100'
                        : 'font-medium text-zinc-300'
                    )}
                  >
                    {senderName}
                    {threadCount > 1 && (
                      <span className="ml-1.5 text-xs text-zinc-500 font-normal">
                        ({threadCount})
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-zinc-500 shrink-0">
                    {formatRelativeDate(email.date)}
                  </span>
                </div>

                {/* Subject */}
                <p
                  className={cn(
                    'text-[13px] truncate',
                    thread.hasUnread ? 'text-zinc-200' : 'text-zinc-400'
                  )}
                >
                  {email.subject}
                </p>

                {/* Snippet */}
                {email.preview && (
                  <p className="text-xs text-zinc-500 truncate mt-0.5 leading-relaxed">
                    {truncate(email.preview, 80)}
                  </p>
                )}

                {/* Recruiter badge */}
                {email.isRecruiterEmail && (
                  <span className="inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    Recruiter
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
