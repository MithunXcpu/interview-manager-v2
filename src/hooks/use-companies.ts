"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CompanyWithRelations,
  CreateCompanyInput,
  UpdateCompanyInput,
  StageKey,
} from '@/types';

// =============================================================================
// Query Keys
// =============================================================================

export const companyKeys = {
  all: ['companies'] as const,
  detail: (id: string) => ['companies', id] as const,
};

// =============================================================================
// Fetcher Helpers
// =============================================================================

async function fetchCompanies(): Promise<CompanyWithRelations[]> {
  const res = await fetch('/api/companies');
  if (!res.ok) {
    throw new Error('Failed to fetch companies');
  }
  return res.json();
}

async function fetchCompany(id: string): Promise<CompanyWithRelations> {
  const res = await fetch(`/api/companies/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch company');
  }
  return res.json();
}

async function createCompany(data: CreateCompanyInput): Promise<CompanyWithRelations> {
  const res = await fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create company');
  }
  return res.json();
}

async function updateCompany({
  id,
  data,
}: {
  id: string;
  data: UpdateCompanyInput;
}): Promise<CompanyWithRelations> {
  const res = await fetch(`/api/companies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update company');
  }
  return res.json();
}

async function deleteCompany(id: string): Promise<void> {
  const res = await fetch(`/api/companies/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete company');
  }
}

async function moveCompany({
  id,
  userStageId,
}: {
  id: string;
  userStageId: string;
}): Promise<CompanyWithRelations> {
  const res = await fetch(`/api/companies/${id}/stage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userStageId }),
  });
  if (!res.ok) {
    throw new Error('Failed to move company');
  }
  return res.json();
}

// =============================================================================
// Query Hooks
// =============================================================================

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.all,
    queryFn: fetchCompanies,
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => fetchCompany(id),
    enabled: !!id,
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useMoveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveCompany,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(variables.id),
      });
    },
  });
}
