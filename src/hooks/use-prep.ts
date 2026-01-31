"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InterviewPrep, Company } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface InterviewPrepWithCompany extends InterviewPrep {
  company: Company;
}

export interface CreatePrepInput {
  companyId: string;
  type: string;
  title: string;
  content: string;
}

export interface UpdatePrepInput {
  type?: string;
  title?: string;
  content?: string;
}

// =============================================================================
// Query Keys
// =============================================================================

export const prepKeys = {
  all: ['preps'] as const,
  byCompany: (companyId: string) => ['preps', 'company', companyId] as const,
};

// =============================================================================
// Fetcher Helpers
// =============================================================================

async function fetchPreps(companyId?: string): Promise<InterviewPrepWithCompany[]> {
  const url = companyId ? `/api/prep?companyId=${companyId}` : '/api/prep';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch interview preps');
  }
  return res.json();
}

async function createPrep(data: CreatePrepInput): Promise<InterviewPrepWithCompany> {
  const res = await fetch('/api/prep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create interview prep');
  }
  return res.json();
}

async function updatePrep({
  id,
  data,
}: {
  id: string;
  data: UpdatePrepInput;
}): Promise<InterviewPrepWithCompany> {
  const res = await fetch(`/api/prep/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update interview prep');
  }
  return res.json();
}

async function deletePrep(id: string): Promise<void> {
  const res = await fetch(`/api/prep/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete interview prep');
  }
}

// =============================================================================
// Query Hooks
// =============================================================================

export function usePreps(companyId?: string) {
  return useQuery({
    queryKey: companyId ? prepKeys.byCompany(companyId) : prepKeys.all,
    queryFn: () => fetchPreps(companyId),
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

export function useCreatePrep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prepKeys.all });
    },
  });
}

export function useUpdatePrep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prepKeys.all });
    },
  });
}

export function useDeletePrep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prepKeys.all });
    },
  });
}
