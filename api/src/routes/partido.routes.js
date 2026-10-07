import express from 'express';
import {
  getPartidos,
  getPartidoById,
  createPartido,
  updatePartido,
  deletePartido
} from '../controllers/partido.controller.js';

export const partidoRoutes = express.Router();

partidoRoutes.get('/', getPartidos);
partidoRoutes.get('/:id', getPartidoById);
partidoRoutes.post('/', createPartido);
partidoRoutes.put('/:id', updatePartido);
partidoRoutes.delete('/:id', deletePartido);
