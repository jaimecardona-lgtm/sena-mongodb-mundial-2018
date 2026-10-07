import { useAssistant } from '../context/AssistantContext';
import { useAssistantStorage } from '../hooks/useAssistantStorage';
import { AssistantBubble } from './AssistantBubble';
import { AssistantPanel } from './AssistantPanel';

export function AssistantWidget() {
  const { isOpen, isMinimized, closeAssistant, minimizeAssistant } = useAssistant();
  const { state: messages, isLoaded, addMessage, clearMessages } = useAssistantStorage();

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {isOpen ? (
        <AssistantPanel
          isMinimized={isMinimized}
          messages={messages.messages}
          onAddMessage={addMessage}
          onClose={closeAssistant}
          onMinimize={minimizeAssistant}
          onClearMessages={clearMessages}
        />
      ) : (
        <AssistantBubble />
      )}
    </>
  );
}
