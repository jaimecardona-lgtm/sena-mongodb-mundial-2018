import { PageHeader } from '../components';
import { MessageCircle, Sparkles } from 'lucide-react';

export function Asistente() {
  const ejemplos = [
    '¿Quiénes son los jugadores más altos?',
    'Muéstrame los porteros de Colombia',
    '¿Qué partidos jugó Colombia?',
    'Compara Colombia y Japan',
  ];

  return (
    <div>
      <PageHeader
        title="Asistente del Mundial"
        subtitle="Pregunta sobre equipos, jugadores y partidos de la Copa Mundial 2018"
      />

      <div className="max-w-2xl mx-auto">
        {/* Badge */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-slate-300">Próximamente IA</span>
          </div>
        </div>

        {/* Placeholder */}
        <div className="stat-card mb-8">
          <div className="flex items-center justify-center py-12">
            <MessageCircle className="w-16 h-16 text-slate-600" />
          </div>

          <textarea
            placeholder="Escribe tu pregunta aquí..."
            disabled
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 disabled:opacity-50 resize-none"
            rows={4}
          />

          <button disabled className="btn-primary w-full mt-4 disabled:opacity-50">
            Enviar pregunta
          </button>
        </div>

        {/* Ejemplos */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ejemplos de preguntas</h3>
          <div className="space-y-3">
            {ejemplos.map((ejemplo, idx) => (
              <button
                key={idx}
                disabled
                className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:opacity-50"
              >
                <span className="text-blue-400 mr-2">→</span>
                {ejemplo}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-6 bg-blue-900 bg-opacity-20 border border-blue-800 border-opacity-30 rounded-lg text-center">
          <p className="text-slate-300 mb-2">
            La funcionalidad de IA se implementará en la siguiente fase del proyecto.
          </p>
          <p className="text-sm text-slate-400">
            Por ahora, puedes explorar los equipos, jugadores y partidos usando los filtros y búsqueda.
          </p>
        </div>
      </div>
    </div>
  );
}
