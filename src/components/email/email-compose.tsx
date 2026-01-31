"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { FiSend, FiZap, FiChevronDown } from 'react-icons/fi';

// =============================================================================
// Types
// =============================================================================

interface EmailComposeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyTo?: string;
  replySubject?: string;
}

// Mock templates for the template picker
const TEMPLATES = [
  {
    id: 'follow-up',
    name: 'Follow Up After Interview',
    subject: 'Thank you for the interview',
    body: 'Dear [Name],\n\nThank you for taking the time to speak with me today about the [Position] role. I really enjoyed learning more about the team and the exciting work you are doing.\n\nI look forward to hearing from you about next steps.\n\nBest regards',
  },
  {
    id: 'availability',
    name: 'Share Availability',
    subject: 'Re: Interview Scheduling',
    body: 'Hi [Name],\n\nThank you for reaching out. I am available at the following times:\n\n- [Day/Time 1]\n- [Day/Time 2]\n- [Day/Time 3]\n\nPlease let me know which works best for your schedule.\n\nBest regards',
  },
  {
    id: 'negotiate',
    name: 'Offer Negotiation',
    subject: 'Re: Offer Discussion',
    body: 'Dear [Name],\n\nThank you for extending the offer for the [Position] role. I am excited about the opportunity to join [Company].\n\nAfter careful consideration, I would like to discuss the compensation package. Based on my experience and market research, I was hoping we could explore a base salary of [Amount].\n\nI look forward to discussing this further.\n\nBest regards',
  },
  {
    id: 'accept',
    name: 'Accept Offer',
    subject: 'Offer Acceptance',
    body: 'Dear [Name],\n\nI am pleased to accept the offer for the [Position] role at [Company]. I am excited to join the team and contribute to the great work being done.\n\nPlease let me know the next steps for onboarding.\n\nBest regards',
  },
] as const;

// =============================================================================
// EmailCompose Component
// =============================================================================

export function EmailCompose({
  open,
  onOpenChange,
  replyTo,
  replySubject,
}: EmailComposeProps) {
  const [to, setTo] = useState(replyTo ?? '');
  const [subject, setSubject] = useState(
    replySubject ? `Re: ${replySubject}` : ''
  );
  const [body, setBody] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSend = () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.info('Email sending feature coming soon');
    onOpenChange(false);
    // Reset fields
    setTo('');
    setSubject('');
    setBody('');
  };

  const handleTemplateSelect = (template: (typeof TEMPLATES)[number]) => {
    setSubject(template.subject);
    setBody(template.body);
    setShowTemplates(false);
  };

  const handleDraftWithAI = () => {
    toast.info('AI Draft feature coming soon');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {replyTo ? 'Reply' : 'Compose Email'}
          </DialogTitle>
          <DialogDescription>
            {replyTo
              ? `Replying to ${replyTo}`
              : 'Write a new email to a recruiter or company'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 py-4 flex-1 overflow-y-auto">
          {/* To field */}
          <Input
            label="To"
            type="email"
            placeholder="recruiter@company.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          {/* Subject field */}
          <Input
            label="Subject"
            placeholder="Interview follow-up"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          {/* Template picker */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium',
                'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/60',
                'border border-zinc-800 transition-colors duration-150'
              )}
            >
              Use Template
              <FiChevronDown
                className={cn(
                  'w-3 h-3 transition-transform',
                  showTemplates && 'rotate-180'
                )}
              />
            </button>

            {showTemplates && (
              <div className="absolute z-10 mt-1 w-64 rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full text-left px-3 py-2.5 hover:bg-zinc-800/60 transition-colors border-b border-zinc-800/50 last:border-0"
                  >
                    <span className="text-sm text-zinc-200 block">
                      {template.name}
                    </span>
                    <span className="text-xs text-zinc-500 block mt-0.5">
                      {template.subject}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-zinc-400">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              className={cn(
                'flex-1 min-h-[200px] w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2',
                'text-sm text-zinc-100 placeholder:text-zinc-600',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60',
                'resize-none'
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-6 pb-6 pt-2 border-t border-zinc-800/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDraftWithAI}
            iconLeft={<FiZap className="w-3.5 h-3.5" />}
          >
            Draft with AI
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!to.trim() || !body.trim()}
              iconLeft={<FiSend className="w-3.5 h-3.5" />}
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
