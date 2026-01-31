import { create } from 'zustand';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiContext {
  companyId?: string;
  page?: string;
}

interface AiState {
  // Messages
  messages: AiMessage[];
  addMessage: (message: Omit<AiMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Context
  context: AiContext;
  setContext: (context: AiContext) => void;

  // Input
  inputValue: string;
  setInputValue: (value: string) => void;
}

let messageCounter = 0;

export const useAiStore = create<AiState>()((set) => ({
  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${++messageCounter}-${Date.now()}`,
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Context
  context: {},
  setContext: (context) => set({ context }),

  // Input
  inputValue: '',
  setInputValue: (value) => set({ inputValue: value }),
}));
