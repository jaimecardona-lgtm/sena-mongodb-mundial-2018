import express from 'express';
import {
  getJugadores,
  getJugadorById,
  createJugador,
  updateJugador,
  deleteJugador
} from '../controllers/jugador.controller.js';

export const jugadorRoutes = express.Router();

jugadorRoutes.get('/', getJugadores);
jugadorRoutes.get('/:id', getJugadorById);
jugadorRoutes.post('/', createJugador);
jugadorRoutes.put('/:id', updateJugador);
jugadorRoutes.delete('/:id', deleteJugador);
