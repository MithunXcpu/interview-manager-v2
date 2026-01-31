"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCompany, useDeleteCompany } from '@/hooks/use-companies';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CompanySidebar } from '@/components/company/company-sidebar';
import { CompanyOverview } from '@/components/company/company-overview';
import { InterviewList } from '@/components/company/interview-list';
import { EmailList } from '@/components/company/email-list';
import { CompanyEditDialog } from '@/components/company/company-edit-dialog';
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiExternalLink,
} from 'react-icons/fi';

// =============================================================================
// Priority Badge Config
// =============================================================================

const priorityConfig: Record<
  string,
  { variant: 'danger' | 'warning' | 'default'; label: string }
> = {
  HIGH: { variant: 'danger', label: 'High Priority' },
  MEDIUM: { variant: 'warning', label: 'Medium Priority' },
  LOW: { variant: 'default', label: 'Low Priority' },
};

// =============================================================================
// Company Detail Component
// =============================================================================

interface CompanyDetailProps {
  companyId: string;
}

export function CompanyDetail({ companyId }: CompanyDetailProps) {
  const router = useRouter();
  const { data: company, isLoading, error } = useCompany(companyId);
  const deleteCompany = useDeleteCompany();
  const [editOpen, setEditOpen] = useState(false);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return <CompanyDetailSkeleton />;
  }

  // Error state
  if (error || !company) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
            <FiSearch className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">
            Company not found
          </h2>
          <p className="text-sm text-zinc-500 mb-5">
            The company you&apos;re looking for doesn&apos;t exist or was removed.
          </p>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Pipeline
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const priority = priorityConfig[company.priority] ?? priorityConfig.MEDIUM;

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this company? This cannot be undone.')) {
      return;
    }
    deleteCompany.mutate(company.id, {
      onSuccess: () => {
        toast.success('Company deleted');
        router.push('/dashboard');
      },
      onError: () => {
        toast.error('Failed to delete company');
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top section: Back + Title + Actions */}
      <div className="mb-6">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          Pipeline
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Company Name + Meta */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
                {company.name}
              </h1>
              <Badge variant={priority.variant} size="sm" dot>
                {priority.label}
              </Badge>
            </div>

            {/* Job title + Website */}
            <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500">
              {company.jobTitle && (
                <span className="text-zinc-300">{company.jobTitle}</span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {new URL(company.website).hostname}
                  <FiExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<FiEdit2 className="w-3.5 h-3.5" />}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              iconLeft={<FiTrash2 className="w-3.5 h-3.5" />}
              onClick={handleDelete}
              loading={deleteCompany.isPending}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<FiSearch className="w-3.5 h-3.5" />}
            >
              Research
            </Button>
            <Button
              size="sm"
              iconLeft={<FiPlus className="w-3.5 h-3.5" />}
              onClick={() => setInterviewDialogOpen(true)}
            >
              Add Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Main layout: Left (2/3) + Right sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="interviews">
                Interviews
                {company.interviews.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
                    {company.interviews.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="emails">
                Emails
                {company.emails.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
                    {company.emails.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="prep">Prep</TabsTrigger>
              <TabsTrigger value="offers">
                Offers
                {company.offers.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
                    {company.offers.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <CompanyOverview company={company} />
            </TabsContent>

            <TabsContent value="interviews">
              <InterviewList
                companyId={company.id}
                interviews={company.interviews}
              />
            </TabsContent>

            <TabsContent value="emails">
              <EmailList emails={company.emails} />
            </TabsContent>

            <TabsContent value="prep">
              <PrepTab preps={company.interviewPreps} />
            </TabsContent>

            <TabsContent value="offers">
              <OffersTab offers={company.offers} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1">
          <CompanySidebar company={company} />
        </div>
      </div>

      {/* Edit Dialog */}
      <CompanyEditDialog
        company={company}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Additional Interview Dialog (triggered from header button) */}
      {interviewDialogOpen && (
        <InterviewDialogFromHeader
          companyId={company.id}
          open={interviewDialogOpen}
          onOpenChange={setInterviewDialogOpen}
        />
      )}
    </div>
  );
}

// =============================================================================
// Prep Tab (placeholder)
// =============================================================================

import type { InterviewPrep, Offer } from '@/types';
import { FiBookOpen, FiDollarSign } from 'react-icons/fi';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { InterviewFormDialog } from '@/components/company/interview-form-dialog';

function PrepTab({ preps }: { preps: InterviewPrep[] }) {
  if (preps.length === 0) {
    return (
      <EmptyState
        icon={<FiBookOpen className="w-5 h-5" />}
        title="No interview prep yet"
        description="Use the AI Research button to generate prep materials for your interviews."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200">
        Interview Prep ({preps.length})
      </h3>
      {preps.map((prep) => (
        <Card key={prep.id}>
          <CardHeader>
            <CardTitle>{prep.title}</CardTitle>
            <p className="text-xs text-zinc-500">
              {prep.type} &middot; {formatDate(prep.createdAt)}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {prep.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =============================================================================
// Offers Tab (placeholder)
// =============================================================================

const offerStatusConfig: Record<
  string,
  { variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  PENDING: { variant: 'info' },
  NEGOTIATING: { variant: 'warning' },
  ACCEPTED: { variant: 'success' },
  DECLINED: { variant: 'danger' },
  EXPIRED: { variant: 'default' },
};

function OffersTab({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) {
    return (
      <EmptyState
        icon={<FiDollarSign className="w-5 h-5" />}
        title="No offers yet"
        description="Offers from this company will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200">
        Offers ({offers.length})
      </h3>
      {offers.map((offer) => {
        const statusConf =
          offerStatusConfig[offer.status] ?? offerStatusConfig.PENDING;
        return (
          <Card key={offer.id}>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  {offer.baseSalary != null && (
                    <span className="text-lg font-bold text-emerald-400">
                      {formatCurrency(offer.baseSalary)}
                    </span>
                  )}
                </div>
                <Badge variant={statusConf.variant} dot>
                  {offer.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                {offer.equity && (
                  <span>Equity: {offer.equity}</span>
                )}
                {offer.signingBonus != null && (
                  <span>
                    Signing: {formatCurrency(offer.signingBonus)}
                  </span>
                )}
                {offer.annualBonus != null && (
                  <span>
                    Annual Bonus: {formatCurrency(offer.annualBonus)}
                  </span>
                )}
                {offer.deadline && (
                  <span>
                    Deadline: {formatDate(offer.deadline)}
                  </span>
                )}
              </div>

              {offer.notes && (
                <p className="text-sm text-zinc-400 mt-2">{offer.notes}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// =============================================================================
// Interview Dialog wrapper (triggered from header)
// =============================================================================

function InterviewDialogFromHeader({
  companyId,
  open,
  onOpenChange,
}: {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <InterviewFormDialog
      companyId={companyId}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function CompanyDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Back link skeleton */}
      <Skeleton className="w-20 h-4 mb-4" />

      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="w-64 h-7" />
          <Skeleton className="w-48 h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-16 h-7 rounded-lg" />
          <Skeleton className="w-16 h-7 rounded-lg" />
          <Skeleton className="w-20 h-7 rounded-lg" />
          <Skeleton className="w-28 h-7 rounded-lg" />
        </div>
      </div>

      {/* Layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs skeleton */}
          <Skeleton className="w-full h-10 rounded-lg" />
          {/* Content skeletons */}
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
