import { useState, useEffect } from 'react';
import type { Equipo, Jugador } from '../types';
import { PageHeader, LoadingState, ErrorState } from '../components';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingDown, TrendingUp } from 'lucide-react';

export function Estadisticas() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [equiposRes, jugadoresRes] = await Promise.all([
          api.getEquipos(),
          api.getJugadores(),
        ]);

        setEquipos(equiposRes.data);
        setJugadores(jugadoresRes.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  // Cálculos
  const jugadorMasAlto = jugadores.reduce((max, j) =>
    j.estatura > max.estatura ? j : max
  );
  const jugadorMasBajo = jugadores.reduce((min, j) =>
    j.estatura < min.estatura ? j : min
  );
  const jugadorMasPesado = jugadores.reduce((max, j) =>
    j.peso > max.peso ? j : max
  );
  const jugadorMasLiviano = jugadores.reduce((min, j) =>
    j.peso < min.peso ? j : min
  );

  const estaturaPromedio = (
    jugadores.reduce((sum, j) => sum + j.estatura, 0) / jugadores.length
  ).toFixed(2);
  const pesoPromedio = (
    jugadores.reduce((sum, j) => sum + j.peso, 0) / jugadores.length
  ).toFixed(2);

  // Datos para gráficas
  const jugadoresPorEquipo = Array.from(
    new Set(jugadores.map((j) => j.team))
  )
    .map((team) => ({
      name: team,
      count: jugadores.filter((j) => j.team === team).length,
    }))
    .sort((a, b) => b.count - a.count);

  const equiposPorConf = Array.from(
    new Set(equipos.map((e) => e.confederation))
  )
    .map((conf) => ({
      name: conf,
      count: equipos.filter((e) => e.confederation === conf).length,
    }))
    .sort((a, b) => b.count - a.count);

  const jugadoresPorPosicion = Array.from(
    new Set(jugadores.map((j) => j.posicion))
  )
    .map((pos) => ({
      name: pos,
      count: jugadores.filter((j) => j.posicion === pos).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      <PageHeader
        title="Estadísticas"
        subtitle="Análisis detallado de datos de la Copa Mundial"
      />

      {/* Extremos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Jugador más alto
          </p>
          <p className="text-lg font-bold text-white mb-1">{jugadorMasAlto.nombre}</p>
          <p className="text-2xl font-bold text-blue-400">{jugadorMasAlto.estatura} cm</p>
          <p className="text-xs text-slate-500 mt-1">{jugadorMasAlto.team}</p>
        </div>

        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Jugador más bajo
          </p>
          <p className="text-lg font-bold text-white mb-1">{jugadorMasBajo.nombre}</p>
          <p className="text-2xl font-bold text-blue-400">{jugadorMasBajo.estatura} cm</p>
          <p className="text-xs text-slate-500 mt-1">{jugadorMasBajo.team}</p>
        </div>

        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-1">
            <Award className="w-4 h-4" />
            Jugador más pesado
          </p>
          <p className="text-lg font-bold text-white mb-1">{jugadorMasPesado.nombre}</p>
          <p className="text-2xl font-bold text-blue-400">{jugadorMasPesado.peso} kg</p>
          <p className="text-xs text-slate-500 mt-1">{jugadorMasPesado.team}</p>
        </div>

        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Jugador más liviano
          </p>
          <p className="text-lg font-bold text-white mb-1">{jugadorMasLiviano.nombre}</p>
          <p className="text-2xl font-bold text-blue-400">{jugadorMasLiviano.peso} kg</p>
          <p className="text-xs text-slate-500 mt-1">{jugadorMasLiviano.team}</p>
        </div>
      </div>

      {/* Promedios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2">Estatura Promedio</p>
          <p className="text-4xl font-bold text-white">{estaturaPromedio}</p>
          <p className="text-sm text-slate-400 mt-2">cm</p>
        </div>

        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2">Peso Promedio</p>
          <p className="text-4xl font-bold text-white">{pesoPromedio}</p>
          <p className="text-sm text-slate-400 mt-2">kg</p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-white mb-4">Top 10 - Jugadores por Equipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jugadoresPorEquipo.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-lg font-semibold text-white mb-4">Equipos por Confederación</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={equiposPorConf}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-lg font-semibold text-white mb-4">Distribución de Posiciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jugadoresPorPosicion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
