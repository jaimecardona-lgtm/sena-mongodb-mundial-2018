import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AssistantContextType {
  isOpen: boolean;
  isMinimized: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  minimizeAssistant: () => void;
  toggleAssistant: () => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mundial-assistant-state');
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsOpen(parsed.isOpen || false);
        setIsMinimized(parsed.isMinimized || false);
      }
    } catch (error) {
      console.error('Failed to load assistant state:', error);
    }
    setIsLoaded(true);
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        const current = localStorage.getItem('mundial-assistant-state');
        const stored = current ? JSON.parse(current) : {};
        localStorage.setItem(
          'mundial-assistant-state',
          JSON.stringify({
            ...stored,
            isOpen,
            isMinimized,
          })
        );
      } catch (error) {
        console.error('Failed to save assistant state:', error);
      }
    }
  }, [isOpen, isMinimized, isLoaded]);

  const openAssistant = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const minimizeAssistant = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value: AssistantContextType = {
    isOpen,
    isMinimized,
    openAssistant,
    closeAssistant,
    minimizeAssistant,
    toggleAssistant,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
}
