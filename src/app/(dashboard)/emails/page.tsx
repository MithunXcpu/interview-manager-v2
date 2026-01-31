"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmailList } from '@/components/email/email-list';
import { EmailThread } from '@/components/email/email-thread';
import { EmailCompose } from '@/components/email/email-compose';
import type { TransformedEmail } from '@/hooks/use-emails';
import { FiEdit, FiSearch } from 'react-icons/fi';

// =============================================================================
// Filter type
// =============================================================================

type EmailFilter = 'all' | 'unread' | 'recruiter';

const filterOptions: { key: EmailFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'recruiter', label: 'Recruiter' },
];

// =============================================================================
// Email Hub Page
// =============================================================================

export default function EmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState<TransformedEmail | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<EmailFilter>('all');
  const [composeOpen, setComposeOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-theme(spacing.14)-theme(spacing.12))]">
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
            Email Hub
          </h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Manage your interview-related emails
          </p>
        </div>

        <Button
          size="sm"
          iconLeft={<FiEdit className="w-3.5 h-3.5" />}
          onClick={() => setComposeOpen(true)}
        >
          Compose
        </Button>
      </div>

      {/* Main layout: sidebar + thread view */}
      <div className="flex rounded-xl border border-zinc-800/80 bg-zinc-900/70 overflow-hidden h-[calc(100%-4rem)]">
        {/* Left sidebar — email list */}
        <div className="w-80 shrink-0 border-r border-zinc-800/60 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-zinc-800/60">
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconPrefix={<FiSearch className="w-3.5 h-3.5" />}
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-800/60">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150',
                  filter === opt.key
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Email list */}
          <EmailList
            selectedEmailId={selectedEmail?.id ?? null}
            onSelectEmail={setSelectedEmail}
            searchQuery={searchQuery}
            filter={filter}
          />
        </div>

        {/* Right panel — thread view */}
        <div className="flex-1 flex flex-col min-w-0">
          <EmailThread selectedEmail={selectedEmail} />
        </div>
      </div>

      {/* Compose dialog */}
      <EmailCompose open={composeOpen} onOpenChange={setComposeOpen} />
    </div>
  );
}
