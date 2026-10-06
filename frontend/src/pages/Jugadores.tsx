import { useState, useEffect } from 'react';
import type { Jugador } from '../types';
import { PageHeader, SearchInput, LoadingState, ErrorState } from '../components';
import { api } from '../services/api';

export function Jugadores() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPosicion, setSelectedPosicion] = useState('');
  const [estaturaMin, setEstaturaMin] = useState('');
  const [estaturaMax, setEstaturaMax] = useState('');
  const [sortBy, setSortBy] = useState<'nombre' | 'estatura' | 'peso' | 'numero'>('nombre');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    const loadJugadores = async () => {
      try {
        setLoading(true);
        const res = await api.getJugadores({
          team: selectedTeam || undefined,
          posicion: selectedPosicion || undefined,
          estaturaMin: estaturaMin ? parseInt(estaturaMin) : undefined,
          estaturaMax: estaturaMax ? parseInt(estaturaMax) : undefined,
        });
        setJugadores(res.data);
        setCurrentPage(1);
        setError(null);
      } catch (err) {
        setError('Error al cargar los jugadores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJugadores();
  }, [selectedTeam, selectedPosicion, estaturaMin, estaturaMax]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const teams = Array.from(new Set(jugadores.map((j) => j.team))).sort();
  const posiciones = Array.from(new Set(jugadores.map((j) => j.posicion))).sort();

  let filtered = jugadores.filter((j) =>
    j.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
    switch (sortBy) {
      case 'estatura':
        return b.estatura - a.estatura;
      case 'peso':
        return b.peso - a.peso;
      case 'numero':
        return a.numero - b.numero;
      default:
        return a.nombre.localeCompare(b.nombre);
    }
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJugadores = sorted.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div>
      <PageHeader
        title="Jugadores"
        subtitle={`${filtered.length} de ${jugadores.length} jugadores`}
      />

      {/* Filters */}
      <div className="space-y-4 mb-8 bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-base"
          >
            <option value="nombre">Ordenar por nombre</option>
            <option value="estatura">Ordenar por estatura</option>
            <option value="peso">Ordenar por peso</option>
            <option value="numero">Ordenar por número</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="input-base"
          >
            <option value="">Todos los equipos</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <select
            value={selectedPosicion}
            onChange={(e) => setSelectedPosicion(e.target.value)}
            className="input-base"
          >
            <option value="">Todas las posiciones</option>
            {posiciones.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Estatura mín (cm)"
            value={estaturaMin}
            onChange={(e) => setEstaturaMin(e.target.value)}
            className="input-base"
          />

          <input
            type="number"
            placeholder="Estatura máx (cm)"
            value={estaturaMax}
            onChange={(e) => setEstaturaMax(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Número</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Equipo</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Posición</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Club</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Estatura</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">Peso</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJugadores.map((jugador) => (
              <tr
                key={jugador._id}
                className="border-b border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-blue-400">{jugador.numero}</td>
                <td className="px-4 py-3 text-white font-medium">{jugador.nombre}</td>
                <td className="px-4 py-3 text-slate-300">{jugador.team}</td>
                <td className="px-4 py-3 text-slate-300">{jugador.posicion}</td>
                <td className="px-4 py-3 text-slate-300">{jugador.club}</td>
                <td className="px-4 py-3 text-slate-300">{jugador.estatura} cm</td>
                <td className="px-4 py-3 text-slate-300">{jugador.peso} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-slate-400">
          Página {currentPage} de {totalPages} ({filtered.length} jugadores)
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
