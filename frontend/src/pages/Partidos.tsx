import { useState, useEffect } from 'react';
import type { Partido } from '../types';
import { PageHeader, SearchInput, LoadingState, ErrorState } from '../components';
import { api } from '../services/api';
import { Calendar, Clock } from 'lucide-react';

export function Partidos() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        setLoading(true);
        const res = await api.getPartidos();
        setPartidos(res.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los partidos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPartidos();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const filtered = partidos.filter((partido) => {
    const search = searchTerm.toLowerCase();
    return (
      partido.equipo1.toLowerCase().includes(search) ||
      partido.equipo2.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <PageHeader
        title="Partidos"
        subtitle={`${filtered.length} de ${partidos.length} partidos`}
      />

      {/* Search */}
      <div className="mb-8 max-w-md">
        <SearchInput
          placeholder="Buscar por equipo..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((partido, index) => (
          <div key={index} className="card-base">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {partido.fecha}
                </span>
                <span className="text-slate-400 text-sm">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {partido.hora}
                </span>
              </div>

              <div className="text-center py-6">
                <p className="text-xl font-bold text-white mb-3">{partido.equipo1}</p>
                <p className="text-2xl text-slate-500 font-light">vs</p>
                <p className="text-xl font-bold text-white mt-3">{partido.equipo2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No se encontraron partidos</p>
        </div>
      )}
    </div>
  );
}
