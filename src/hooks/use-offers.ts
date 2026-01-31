"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { OfferWithCompany, CreateOfferInput, Offer } from '@/types';
import { companyKeys } from '@/hooks/use-companies';

// =============================================================================
// Query Keys
// =============================================================================

export const offerKeys = {
  all: ['offers'] as const,
  detail: (id: string) => ['offers', id] as const,
};

// =============================================================================
// Fetcher Helpers
// =============================================================================

async function fetchOffers(): Promise<OfferWithCompany[]> {
  const res = await fetch('/api/offers');
  if (!res.ok) {
    throw new Error('Failed to fetch offers');
  }
  return res.json();
}

async function createOffer(data: CreateOfferInput): Promise<OfferWithCompany> {
  const res = await fetch('/api/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create offer');
  }
  return res.json();
}

async function updateOffer({
  id,
  data,
}: {
  id: string;
  data: Partial<Offer>;
}): Promise<OfferWithCompany> {
  const res = await fetch(`/api/offers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update offer');
  }
  return res.json();
}

async function deleteOffer(id: string): Promise<void> {
  const res = await fetch(`/api/offers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete offer');
  }
}

// =============================================================================
// Query Hooks
// =============================================================================

export function useOffers() {
  return useQuery({
    queryKey: offerKeys.all,
    queryFn: fetchOffers,
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOffer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(data.companyId),
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOffer,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({
        queryKey: offerKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(data.companyId),
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offerKeys.all });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
