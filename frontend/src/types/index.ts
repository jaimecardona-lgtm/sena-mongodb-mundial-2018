export interface Equipo {
  _id?: string;
  id: number;
  abbreviation: string;
  country: string;
  confederation: string;
}

export interface Jugador {
  _id: string;
  team: string;
  numero: number;
  posicion: string;
  nombre: string;
  fechaNacimiento: string;
  nombreCamiseta: string;
  club: string;
  estatura: number;
  peso: number;
}

export interface Partido {
  _id?: string;
  equipo1: string;
  equipo2: string;
  fecha: string;
  hora: string;
}

export interface ApiCollectionResponse<T> {
  count: number;
  data: T[];
}

export interface ApiSingleResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  path?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}
