"use client";

import { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { useEmail } from '@/hooks/use-emails';
import type { TransformedEmail, EmailWithCompany } from '@/hooks/use-emails';
import {
  FiSend,
  FiZap,
  FiTag,
  FiMessageCircle,
  FiExternalLink,
} from 'react-icons/fi';

// =============================================================================
// Types
// =============================================================================

interface EmailThreadProps {
  selectedEmail: TransformedEmail | null;
}

// =============================================================================
// Helpers
// =============================================================================

function extractSenderName(from: string): string {
  const match = from.match(/^(.+?)\s*<.+>$/);
  if (match) return match[1].trim();
  return from.split('@')[0];
}

function extractEmail(from: string): string {
  const match = from.match(/<(.+?)>$/);
  if (match) return match[1];
  return from;
}

// =============================================================================
// Empty State
// =============================================================================

function EmailEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800/60 mb-4">
        <svg
          className="w-6 h-6 text-zinc-500"
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
      <h3 className="text-sm font-medium text-zinc-300 mb-1">
        Select an email
      </h3>
      <p className="text-xs text-zinc-500 max-w-[240px] leading-relaxed">
        Choose an email from the list to view the full conversation thread
      </p>
    </div>
  );
}

// =============================================================================
// AI Actions Bar
// =============================================================================

function AIActionsBar() {
  const handleSummarize = () => {
    toast.info('AI Summary feature coming soon');
  };

  const handleClassify = () => {
    toast.info('AI Classification feature coming soon');
  };

  const handleSuggestReply = () => {
    toast.info('AI Reply Suggestion feature coming soon');
  };

  return (
    <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/50">
      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mr-1">
        AI Actions
      </span>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={<FiZap className="w-3 h-3" />}
        onClick={handleSummarize}
      >
        Summarize
      </Button>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={<FiTag className="w-3 h-3" />}
        onClick={handleClassify}
      >
        Classify
      </Button>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={<FiMessageCircle className="w-3 h-3" />}
        onClick={handleSuggestReply}
      >
        Suggest Reply
      </Button>
    </div>
  );
}

// =============================================================================
// Reply Compose Area
// =============================================================================

function ReplyCompose({ to }: { to: string }) {
  const [replyBody, setReplyBody] = useState('');

  const handleSend = () => {
    if (!replyBody.trim()) return;
    toast.info('Email sending feature coming soon');
    setReplyBody('');
  };

  return (
    <div className="border-t border-zinc-800/60 p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 overflow-hidden">
        <div className="px-3 py-2 border-b border-zinc-800/60">
          <span className="text-xs text-zinc-500">
            Reply to{' '}
            <span className="text-zinc-400">{extractEmail(to)}</span>
          </span>
        </div>
        <textarea
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          placeholder="Write your reply..."
          rows={4}
          className={cn(
            'w-full bg-transparent px-3 py-2 text-sm text-zinc-200',
            'placeholder:text-zinc-600 resize-none',
            'focus:outline-none'
          )}
        />
        <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-zinc-800/60">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast.info('Draft with AI feature coming soon')}
            iconLeft={<FiZap className="w-3 h-3" />}
          >
            Draft with AI
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!replyBody.trim()}
            iconLeft={<FiSend className="w-3 h-3" />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EmailThread Component
// =============================================================================

export function EmailThread({ selectedEmail }: EmailThreadProps) {
  // Fetch full email data with body when selected
  const { data: fullEmail } = useEmail(selectedEmail?.id ?? '');

  if (!selectedEmail) {
    return <EmailEmptyState />;
  }

  // Normalize email data into a consistent shape
  const raw = fullEmail ?? selectedEmail;
  const email = {
    id: raw.id,
    from: raw.from,
    to: 'to' in raw ? raw.to : '',
    subject: raw.subject,
    body: raw.body ?? null,
    date: 'receivedAt' in raw ? String(raw.receivedAt) : ('date' in raw ? (raw as TransformedEmail).date : ''),
    isRead: raw.isRead,
    isRecruiterEmail: raw.isRecruiterEmail,
    detectedCompany: raw.detectedCompany ?? null,
    company: 'company' in raw ? raw.company : null,
    summary: 'summary' in raw ? (raw as EmailWithCompany).summary : null,
    preview: 'preview' in raw ? (raw as TransformedEmail).preview : ('snippet' in raw ? raw.snippet : ''),
  };
  const senderName = extractSenderName(email.from);
  const senderEmail = extractEmail(email.from);

  return (
    <div className="flex flex-col h-full">
      {/* AI Actions */}
      <AIActionsBar />

      {/* Email content — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <h2 className="text-lg font-semibold text-zinc-100 leading-tight mb-3">
            {email.subject}
          </h2>

          <div className="flex items-start gap-3">
            <Avatar name={senderName} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-zinc-200">
                  {senderName}
                </span>
                <span className="text-xs text-zinc-500">{senderEmail}</span>
                {email.isRecruiterEmail && (
                  <Badge variant="primary" size="sm">
                    Recruiter
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                <span>To: {email.to ? extractEmail(email.to) : 'me'}</span>
                <span className="text-zinc-700">|</span>
                <span>{formatDate(email.date, 'datetime')}</span>
              </div>
            </div>
          </div>

          {/* Detected company link */}
          {(email.detectedCompany || email.company) && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="info" size="sm" dot>
                {email.company?.name ?? email.detectedCompany}
              </Badge>
              {email.company && (
                <a
                  href={`/dashboard?company=${email.company.id}`}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View in Pipeline
                  <FiExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Summary */}
          {email.summary && (
            <div className="mt-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
              <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">
                AI Summary
              </span>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {email.summary}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Body */}
        <div className="px-5 py-4">
          {email.body ? (
            <div
              className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed
                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-zinc-200
                prose-headings:text-zinc-200
                prose-p:text-zinc-300
                [&_*]:max-w-full"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          ) : (
            <p className="text-sm text-zinc-400 leading-relaxed">
              {email.preview || 'No content available'}
            </p>
          )}
        </div>
      </div>

      {/* Reply area */}
      <ReplyCompose to={email.from} />
    </div>
  );
}
