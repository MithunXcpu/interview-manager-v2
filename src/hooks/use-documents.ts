"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Document } from '@/types';

// =============================================================================
// Query Keys
// =============================================================================

export const documentKeys = {
  all: ['documents'] as const,
};

// =============================================================================
// Types
// =============================================================================

interface CreateDocumentInput {
  companyId?: string;
  title: string;
  type: string;
  format: string;
  content?: string;
}

// =============================================================================
// Fetcher Helpers
// =============================================================================

async function fetchDocuments(): Promise<Document[]> {
  const res = await fetch('/api/documents');
  if (!res.ok) {
    throw new Error('Failed to fetch documents');
  }
  return res.json();
}

async function createDocument(data: CreateDocumentInput): Promise<Document> {
  const res = await fetch('/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create document');
  }
  return res.json();
}

// =============================================================================
// Query Hooks
// =============================================================================

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.all,
    queryFn: fetchDocuments,
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
}
