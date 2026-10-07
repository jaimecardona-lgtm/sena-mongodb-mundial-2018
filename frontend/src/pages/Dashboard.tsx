import { useState, useEffect } from 'react';
import type { Equipo, Jugador, Partido } from '../types';
import { PageHeader, StatCard, LoadingState, ErrorState } from '../components';
import { api } from '../services/api';
import { Users, Trophy, Zap, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [equiposRes, jugadoresRes, partidosRes] = await Promise.all([
          api.getEquipos(),
          api.getJugadores(),
          api.getPartidos(),
        ]);

        setEquipos(equiposRes.data);
        setJugadores(jugadoresRes.data);
        setPartidos(partidosRes.data);
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

  const estaturaPromedio = (jugadores.reduce((sum, j) => sum + j.estatura, 0) / jugadores.length).toFixed(2);
  const pesoPromedio = (jugadores.reduce((sum, j) => sum + j.peso, 0) / jugadores.length).toFixed(2);
  const confederaciones = new Set(equipos.map((e) => e.confederation)).size;
  const posiciones = new Set(jugadores.map((j) => j.posicion)).size;

  // Datos para gráficas
  const confederacionCounts = Array.from(
    new Set(equipos.map((e) => e.confederation))
  ).map((conf) => ({
    name: conf,
    count: equipos.filter((e) => e.confederation === conf).length,
  }));

  const posicionCounts = Array.from(
    new Set(jugadores.map((j) => j.posicion))
  ).map((pos) => ({
    name: pos,
    count: jugadores.filter((j) => j.posicion === pos).length,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen de datos de la Copa Mundial FIFA 2018"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Equipos" value={equipos.length} icon={<Trophy className="w-6 h-6" />} />
        <StatCard label="Jugadores" value={jugadores.length} icon={<Users className="w-6 h-6" />} />
        <StatCard label="Partidos" value={partidos.length} icon={<Zap className="w-6 h-6" />} />
        <StatCard label="Confederaciones" value={confederaciones} icon={<TrendingUp className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2">Estatura Promedio</p>
          <p className="text-3xl font-bold text-white">{estaturaPromedio} cm</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2">Peso Promedio</p>
          <p className="text-3xl font-bold text-white">{pesoPromedio} kg</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2">Posiciones</p>
          <p className="text-3xl font-bold text-white">{posiciones}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-400 text-sm font-medium mb-2">Jugadores por Equipo</p>
          <p className="text-3xl font-bold text-white">{(jugadores.length / equipos.length).toFixed(0)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-white mb-4">Equipos por Confederación</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confederacionCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
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
          <h3 className="text-lg font-semibold text-white mb-4">Distribución de Posiciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={posicionCounts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {posicionCounts.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
