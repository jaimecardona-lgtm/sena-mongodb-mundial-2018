import { useState, useEffect } from 'react';
import type { Equipo } from '../types';
import { PageHeader, SearchInput, LoadingState, ErrorState } from '../components';
import { api } from '../services/api';
import { Filter } from 'lucide-react';

export function Equipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConf, setSelectedConf] = useState('');

  useEffect(() => {
    const loadEquipos = async () => {
      try {
        setLoading(true);
        const res = await api.getEquipos();
        setEquipos(res.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los equipos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEquipos();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const confederaciones = Array.from(new Set(equipos.map((e) => e.confederation)));

  const filtered = equipos.filter((equipo) => {
    const matchSearch = equipo.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchConf = !selectedConf || equipo.confederation === selectedConf;
    return matchSearch && matchConf;
  });

  return (
    <div>
      <PageHeader title="Equipos" subtitle={`${filtered.length} de ${equipos.length} equipos`} />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SearchInput
          placeholder="Buscar país..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={selectedConf}
            onChange={(e) => setSelectedConf(e.target.value)}
            className="input-base flex-1"
          >
            <option value="">Todas las confederaciones</option>
            {confederaciones.map((conf) => (
              <option key={conf} value={conf}>
                {conf}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((equipo) => (
          <div key={equipo._id || equipo.id} className="card-base">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-blue-500">{equipo.abbreviation.toUpperCase()}</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{equipo.confederation}</span>
            </div>
            <h3 className="font-semibold text-white mb-2">{equipo.country}</h3>
            <p className="text-sm text-slate-400">ID: {equipo.id}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No se encontraron equipos</p>
        </div>
      )}
    </div>
  );
}
