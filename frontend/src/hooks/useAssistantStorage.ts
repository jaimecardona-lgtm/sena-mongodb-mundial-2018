import { useEffect, useState } from 'react';

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AssistantState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: StoredMessage[];
}

const STORAGE_KEY = 'mundial-assistant-state';
const MAX_STORED_MESSAGES = 50;

const DEFAULT_STATE: AssistantState = {
  isOpen: false,
  isMinimized: false,
  messages: [],
};

export function useAssistantStorage() {
  const [state, setState] = useState<AssistantState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch (error) {
      console.error('Failed to load assistant state:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save assistant state:', error);
      }
    }
  }, [state, isLoaded]);

  const setOpen = (isOpen: boolean) => {
    setState((prev) => ({ ...prev, isOpen }));
  };

  const setMinimized = (isMinimized: boolean) => {
    setState((prev) => ({ ...prev, isMinimized }));
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: StoredMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages.slice(-MAX_STORED_MESSAGES + 1),
        newMessage,
      ],
    }));
  };

  const clearMessages = () => {
    setState((prev) => ({ ...prev, messages: [] }));
  };

  return {
    state,
    isLoaded,
    setOpen,
    setMinimized,
    addMessage,
    clearMessages,
  };
}
