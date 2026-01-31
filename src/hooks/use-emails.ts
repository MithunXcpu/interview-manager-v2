"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Email, Company } from "@/types";

// =============================================================================
// Types
// =============================================================================

export interface TransformedEmail {
  id: string;
  gmailId: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  isRead: boolean;
  isRecruiterEmail: boolean;
  detectedCompany: string | null;
  companyId?: string | null;
  company?: Company | null;
  threadId: string;
}

export interface EmailWithCompany extends Email {
  company: Company | null;
}

interface EmailsResponse {
  emails: TransformedEmail[];
  isDemo?: boolean;
}

// =============================================================================
// Query Keys
// =============================================================================

export const emailKeys = {
  all: ["emails"] as const,
  filtered: (filter: string) => ["emails", filter] as const,
  detail: (id: string) => ["emails", id] as const,
};

// =============================================================================
// Fetcher Helpers
// =============================================================================

async function fetchEmails(
  filter?: string,
  sync?: boolean
): Promise<EmailsResponse> {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  if (sync) params.set("sync", "true");

  const res = await fetch(`/api/emails?${params}`);
  if (!res.ok) {
    throw new Error("Failed to fetch emails");
  }
  return res.json();
}

async function fetchEmail(id: string): Promise<EmailWithCompany> {
  const res = await fetch(`/api/emails/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch email");
  }
  return res.json();
}

async function emailAction(body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch("/api/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error("Email action failed");
  }
  return res.json();
}

// =============================================================================
// Query Hooks
// =============================================================================

export function useEmails(filter?: string) {
  return useQuery({
    queryKey: filter ? emailKeys.filtered(filter) : emailKeys.all,
    queryFn: () => fetchEmails(filter),
  });
}

export function useEmail(id: string) {
  return useQuery({
    queryKey: emailKeys.detail(id),
    queryFn: () => fetchEmail(id),
    enabled: !!id,
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

export function useSyncEmails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filter?: string) => fetchEmails(filter, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.all });
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      emailAction({ action: "mark_read", emailId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.all });
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      to: string;
      subject: string;
      body: string;
      threadId?: string;
    }) => emailAction({ action: "send", data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.all });
    },
  });
}

export function useReplyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      to: string;
      subject?: string;
      body: string;
      threadId?: string;
    }) => emailAction({ action: "reply", data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.all });
    },
  });
}

export function useLinkEmailToCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      emailId,
      companyId,
    }: {
      emailId: string;
      companyId: string;
    }) => emailAction({ action: "link_company", emailId, data: { companyId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.all });
    },
  });
}

export function useCreateCompanyFromEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ emailId }: { emailId: string }) =>
      emailAction({ action: "create_company", emailId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.all });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useGenerateReply() {
  return useMutation({
    mutationFn: ({
      emailId,
      tone,
    }: {
      emailId: string;
      tone?: "professional" | "friendly" | "enthusiastic";
    }) =>
      emailAction({
        action: "generate_reply",
        emailId,
        data: { tone },
      }) as Promise<{ success: boolean; reply: string }>,
  });
}
