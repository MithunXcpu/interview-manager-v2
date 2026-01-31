"use client";

// ============================================================================
// useAi Hook -- Send messages to the AI assistant
// ============================================================================
// Orchestrates the AI chat flow:
// 1. Adds user message to store
// 2. Calls /api/ai/chat via the AI client
// 3. Adds assistant response to store
// 4. Manages loading state throughout
// ============================================================================

import { useCallback } from 'react';
import { useAiStore } from '@/stores/ai-store';
import { chat, type ChatMessage } from '@/lib/ai';
import { toast } from '@/components/ui/toast';

/**
 * Hook that provides a `sendMessage` function and loading state.
 * Handles the full round-trip: user message -> API call -> assistant response.
 */
export function useSendMessage() {
  const addMessage = useAiStore((s) => s.addMessage);
  const setIsLoading = useAiStore((s) => s.setIsLoading);
  const isLoading = useAiStore((s) => s.isLoading);
  const messages = useAiStore((s) => s.messages);
  const context = useAiStore((s) => s.context);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // 1. Add user message to store
      addMessage({ role: 'user', content: trimmed });
      setIsLoading(true);

      try {
        // 2. Build chat history for the API
        const chatHistory: ChatMessage[] = [
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user' as const, content: trimmed },
        ];

        // 3. Call the AI endpoint
        const response = await chat(chatHistory, {
          page: context.page,
          companyId: context.companyId,
        });

        // 4. Add assistant response to store
        addMessage({ role: 'assistant', content: response });
      } catch (error) {
        console.error('[useAi] Failed to send message:', error);
        toast.error('Failed to get AI response. Please try again.');
        addMessage({
          role: 'assistant',
          content:
            "I'm sorry, something went wrong. Please try again in a moment.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, setIsLoading, isLoading, messages, context]
  );

  return { sendMessage, isLoading };
}
