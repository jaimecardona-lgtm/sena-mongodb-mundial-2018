import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, RotateCcw } from 'lucide-react';
import { aiApi, type AIChatRequest } from '../services/ai';
import { AssistantHeader } from './AssistantBubble';
import type { StoredMessage } from '../hooks/useAssistantStorage';
import { normalizeAssistantText } from '../utils/normalizeText';

interface AssistantPanelProps {
  isMinimized: boolean;
  messages: StoredMessage[];
  onAddMessage: (role: 'user' | 'assistant', content: string) => void;
  onClose: () => void;
  onMinimize: () => void;
  onClearMessages: () => void;
}

const QUICK_SUGGESTIONS = [
  '¿Cuáles son los 5 jugadores más altos?',
  'Muéstrame los porteros de Colombia',
  '¿Qué partidos jugó Colombia?',
  'Compara Colombia y Japan',
];

export function AssistantPanel({
  isMinimized,
  messages,
  onAddMessage,
  onClose,
  onMinimize,
  onClearMessages,
}: AssistantPanelProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);

    // Add user message
    onAddMessage('user', text);

    // Send to AI
    setLoading(true);
    try {
      // Send last 8 messages as history
      const recentHistory = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const request: AIChatRequest = {
        message: text,
        history: recentHistory.length > 0 ? recentHistory : undefined,
      };

      const response = await aiApi.chat(request);
      onAddMessage('assistant', response.answer);
    } catch (err) {
      setError('No se pudo procesar la solicitud. Intenta de nuevo.');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      className="fixed bottom-3 right-3 w-[calc(100vw-24px)] h-[calc(100dvh-24px)] rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-sm border border-slate-400 border-opacity-20 md:bottom-8 md:right-8 md:w-96 md:h-[600px] md:rounded-xl"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(15, 23, 42, 0.82),
            rgba(15, 23, 42, 0.95)
          ),
          url('/assets/cr7.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <AssistantHeader
        onClose={onClose}
        onMinimize={() => onMinimize()}
        isMinimized={false}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(191, 219, 254, 0.8)' }}
            >
              <span className="text-2xl">🌍</span>
            </div>
            <p className="text-slate-200 mb-6 text-sm">
              Pregunta sobre equipos, jugadores y partidos
            </p>
            <div className="space-y-2 w-full px-2">
              {QUICK_SUGGESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-600 border hover:border-blue-400 rounded text-slate-200 hover:text-white text-xs transition-all backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(55, 65, 81, 0.6)',
                    borderColor: 'rgba(71, 85, 105, 0.4)',
                  }}
                >
                  <span className="text-blue-300 mr-2">→</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-none'
                      : 'text-slate-100 rounded-bl-none border border-slate-600'
                  }`}
                  style={
                    msg.role === 'user'
                      ? { backgroundColor: 'rgba(37, 99, 235, 0.8)' }
                      : { backgroundColor: 'rgba(55, 65, 81, 0.7)', borderColor: 'rgba(71, 85, 105, 0.3)' }
                  }
                >
                  {msg.role === 'assistant' ? (
                    <div className="text-sm markdown-small">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc list-inside ml-2 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside ml-2 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          code: ({ children }) => (
                            <code className="bg-slate-900 px-1 rounded text-xs font-mono">{children}</code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-slate-900 p-2 rounded text-xs overflow-x-auto mb-2">{children}</pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-slate-400 pl-2 ml-1 italic">{children}</blockquote>
                          ),
                        }}
                      >
                        {normalizeAssistantText(msg.content)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 bg-opacity-70 text-slate-200 px-4 py-3 rounded-lg rounded-bl-none border border-slate-600 border-opacity-30 backdrop-blur-sm">
                  <p className="text-sm">Analizando datos...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-900 bg-opacity-70 border-l-4 border-red-400 text-red-200 text-xs backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-slate-600 border-opacity-30 bg-slate-900 bg-opacity-60 p-4 space-y-3 backdrop-blur-sm">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            disabled={loading}
            className="flex-1 px-3 py-2 bg-slate-800 bg-opacity-80 border border-slate-600 border-opacity-40 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400 disabled:opacity-50 resize-none backdrop-blur-sm"
            rows={3}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
            title="Enviar (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearMessages}
            disabled={loading}
            className="w-full px-3 py-1 text-slate-300 hover:text-slate-100 border hover:border-slate-500 rounded text-xs disabled:opacity-50 transition-colors backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              borderColor: 'rgba(71, 85, 105, 0.4)',
            }}
          >
            <RotateCcw className="w-3 h-3 inline mr-1" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
