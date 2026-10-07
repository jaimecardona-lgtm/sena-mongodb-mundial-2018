import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../components';
import { aiApi, type AIChatRequest } from '../services/ai';
import { Send, RotateCcw, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  tools_used?: string[];
  timestamp: Date;
}

const EXAMPLE_QUESTIONS = [
  '¿Cuáles son los 5 jugadores más altos de Colombia?',
  'Muéstrame los porteros de Colombia',
  '¿Qué partidos jugó Colombia?',
  'Compara Colombia y Japan',
  '¿Qué equipos pertenecen a CONMEBOL?',
];

export function Asistente() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiAvailable, setAiAvailable] = useState(true);

  // Check AI availability on mount
  useEffect(() => {
    aiApi.health().then(setAiAvailable);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || loading || !aiAvailable) return;

    setInput('');
    setError(null);

    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to AI
    setLoading(true);
    try {
      // Only send recent history (last 8 messages before this one)
      const recentHistory = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const request: AIChatRequest = {
        message: text,
        history: recentHistory.length > 0 ? recentHistory : undefined,
      };

      const response = await aiApi.chat(request);

      const assistantMessage: ChatMessage = {
        id: response.request_id,
        role: 'assistant',
        content: response.answer,
        model: response.model,
        tools_used: response.tools_used,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
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

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setInput('');
  };

  if (!aiAvailable) {
    return (
      <div>
        <PageHeader
          title="Asistente del Mundial"
          subtitle="Consulta sobre equipos, jugadores y partidos"
        />
        <div className="max-w-3xl mx-auto py-12 text-center">
          <p className="text-slate-400 mb-4">
            El asistente de IA no está disponible en este momento.
          </p>
          <p className="text-sm text-slate-500">
            Asegúrate de que FastAPI (puerto 8000) esté ejecutándose.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Asistente del Mundial"
        subtitle="Pregunta sobre equipos, jugadores y partidos de la Copa Mundial 2018"
      />

      <div className="max-w-3xl mx-auto h-[600px] flex flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-lg p-4 mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <MessageCircle className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 mb-6">
                Haz una pregunta sobre el Mundial 2018
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                {EXAMPLE_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white text-sm transition-colors"
                  >
                    <span className="text-blue-400 mr-2">→</span>
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
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-100'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.role === 'assistant' && msg.tools_used && msg.tools_used.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-400">
                        <p>
                          <span className="font-semibold">Datos consultados:</span>{' '}
                          {msg.tools_used.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 px-4 py-3 rounded-lg">
                    <p className="text-sm text-slate-400">Analizando datos...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Input area */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta... (Shift+Enter para nueva línea)"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
              rows={3}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
              title="Enviar (Enter)"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              disabled={loading}
              className="w-full px-4 py-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Limpiar conversación
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
