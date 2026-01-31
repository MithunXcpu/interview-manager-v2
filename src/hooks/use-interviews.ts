"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Interview, InterviewWithCompany, CreateInterviewInput } from '@/types';
import { companyKeys } from '@/hooks/use-companies';

// =============================================================================
// Query Keys
// =============================================================================

export const interviewKeys = {
  all: ['interviews'] as const,
  byCompany: (companyId: string) => ['interviews', 'company', companyId] as const,
  detail: (id: string) => ['interviews', id] as const,
};

// =============================================================================
// Fetcher Helpers
// =============================================================================

async function fetchInterviews(companyId?: string): Promise<InterviewWithCompany[]> {
  const url = companyId
    ? `/api/interviews?companyId=${companyId}`
    : '/api/interviews';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch interviews');
  }
  return res.json();
}

async function fetchInterview(id: string): Promise<InterviewWithCompany> {
  const res = await fetch(`/api/interviews/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch interview');
  }
  return res.json();
}

async function createInterview(data: CreateInterviewInput): Promise<InterviewWithCompany> {
  const res = await fetch('/api/interviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create interview');
  }
  return res.json();
}

async function updateInterview({
  id,
  data,
}: {
  id: string;
  data: Partial<Interview>;
}): Promise<InterviewWithCompany> {
  const res = await fetch(`/api/interviews/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update interview');
  }
  return res.json();
}

async function deleteInterview(id: string): Promise<void> {
  const res = await fetch(`/api/interviews/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete interview');
  }
}

// =============================================================================
// Query Hooks
// =============================================================================

export function useInterviews(companyId?: string) {
  return useQuery({
    queryKey: companyId ? interviewKeys.byCompany(companyId) : interviewKeys.all,
    queryFn: () => fetchInterviews(companyId),
  });
}

export function useInterview(id: string) {
  return useQuery({
    queryKey: interviewKeys.detail(id),
    queryFn: () => fetchInterview(id),
    enabled: !!id,
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

export function useCreateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterview,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all });
      queryClient.invalidateQueries({
        queryKey: interviewKeys.byCompany(data.companyId),
      });
      // Also refresh the company detail to pick up the new interview
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(data.companyId),
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInterview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all });
      queryClient.invalidateQueries({
        queryKey: interviewKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: interviewKeys.byCompany(data.companyId),
      });
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(data.companyId),
      });
    },
  });
}

export function useDeleteInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.all });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
