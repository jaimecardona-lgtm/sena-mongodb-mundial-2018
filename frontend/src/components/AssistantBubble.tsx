import { MessageCircle, ChevronUp, Minus, X } from 'lucide-react';
import { useAssistant } from '../context/AssistantContext';

export function AssistantBubble() {
  const { isOpen, isMinimized, openAssistant, minimizeAssistant } = useAssistant();

  if (isOpen && !isMinimized) {
    return null;
  }

  // Minimized state: show compact bar
  if (isOpen && isMinimized) {
    return (
      <button
        onClick={() => minimizeAssistant()}
        className="fixed bottom-3 right-3 w-[calc(100vw-24px)] h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg flex items-center justify-between px-4 transition-all duration-300 z-40 backdrop-blur-sm border border-blue-400 border-opacity-30 md:bottom-8 md:right-8 md:w-80"
        title="Expandir asistente"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Asistente Mundial</span>
        </div>
        <ChevronUp className="w-5 h-5" />
      </button>
    );
  }

  // Closed state: show floating bubble
  return (
    <button
      onClick={openAssistant}
      className="fixed bottom-3 right-3 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 hover:scale-110 md:bottom-8 md:right-8"
      title="Abrir asistente"
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
}

interface AssistantHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

export function AssistantHeader({
  onClose,
  onMinimize,
  isMinimized,
}: AssistantHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between shadow-md backdrop-blur-sm border-b border-blue-400 border-opacity-30">
      <div>
        <h3 className="font-bold text-lg">Asistente del Mundial</h3>
        <p className="text-xs text-blue-100">Copa Mundial 2018 Data Hub</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="p-1 rounded transition-colors backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0)')}
          title={isMinimized ? 'Maximizar' : 'Minimizar'}
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded transition-colors backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0)')}
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
