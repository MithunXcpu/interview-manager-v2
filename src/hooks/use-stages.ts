"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserStage } from "@/types";

// =============================================================================
// Query Keys
// =============================================================================

export const stageKeys = {
  all: ["stages"] as const,
};

// =============================================================================
// Fetchers
// =============================================================================

async function fetchStages(): Promise<UserStage[]> {
  const res = await fetch("/api/user/stages");
  if (!res.ok) {
    throw new Error("Failed to fetch stages");
  }
  return res.json();
}

async function updateStages(
  stages: Array<{
    stageKey: string;
    name: string;
    emoji: string;
    color: string;
    order: number;
    isEnabled: boolean;
  }>
): Promise<UserStage[]> {
  const res = await fetch("/api/user/stages", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stages }),
  });
  if (!res.ok) {
    throw new Error("Failed to update stages");
  }
  return res.json();
}

// =============================================================================
// Hooks
// =============================================================================

export function useUserStages() {
  return useQuery({
    queryKey: stageKeys.all,
    queryFn: fetchStages,
  });
}

export function useUpdateStages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stageKeys.all });
    },
  });
}
