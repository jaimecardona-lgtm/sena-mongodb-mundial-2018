import type { Equipo, Jugador, Partido, ApiCollectionResponse, ApiSingleResponse, HealthResponse } from '../types';

const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Health
  health() {
    return this.request<HealthResponse>('/health');
  }

  // Equipos
  getEquipos() {
    return this.request<ApiCollectionResponse<Equipo>>('/equipos');
  }

  getEquipo(id: string | number) {
    return this.request<ApiSingleResponse<Equipo>>(`/equipos/${id}`);
  }

  // Jugadores
  getJugadores(params?: {
    team?: string;
    numero?: number;
    posicion?: string;
    estaturaMin?: number;
    estaturaMax?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.team) query.append('team', params.team);
    if (params?.numero) query.append('numero', String(params.numero));
    if (params?.posicion) query.append('posicion', params.posicion);
    if (params?.estaturaMin) query.append('estaturaMin', String(params.estaturaMin));
    if (params?.estaturaMax) query.append('estaturaMax', String(params.estaturaMax));

    const queryString = query.toString();
    const endpoint = queryString ? `/jugadores?${queryString}` : '/jugadores';
    return this.request<ApiCollectionResponse<Jugador>>(endpoint);
  }

  getJugador(id: string) {
    return this.request<ApiSingleResponse<Jugador>>(`/jugadores/${id}`);
  }

  // Partidos
  getPartidos(params?: {
    equipo?: string;
    fecha?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.equipo) query.append('equipo', params.equipo);
    if (params?.fecha) query.append('fecha', params.fecha);

    const queryString = query.toString();
    const endpoint = queryString ? `/partidos?${queryString}` : '/partidos';
    return this.request<ApiCollectionResponse<Partido>>(endpoint);
  }

  getPartido(id: string) {
    return this.request<ApiSingleResponse<Partido>>(`/partidos/${id}`);
  }
}

export const api = new ApiClient();
