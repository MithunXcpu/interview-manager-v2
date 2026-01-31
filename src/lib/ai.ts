// ============================================================================
// AI Client Configuration
// ============================================================================
// Wrapper around the /api/ai/chat endpoint.
// Handles request formatting, error handling, and fallback responses.
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    page?: string;
    companyId?: string;
  };
}

export interface ChatResponse {
  content: string;
}

const FALLBACK_MESSAGE =
  "I'm sorry, I wasn't able to process that request. Please try again in a moment.";

/**
 * Send a chat request to the AI endpoint.
 * Returns the assistant's response content string.
 */
export async function chat(
  messages: ChatMessage[],
  context?: ChatRequest['context']
): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context } satisfies ChatRequest),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(
        `[AI] Chat request failed: ${res.status} ${res.statusText}`,
        errorBody
      );
      return FALLBACK_MESSAGE;
    }

    const data: ChatResponse = await res.json();
    return data.content;
  } catch (error) {
    console.error('[AI] Chat request error:', error);
    return FALLBACK_MESSAGE;
  }
}
