import express from 'express';
import {
  getEquipos,
  getEquipoById,
  createEquipo,
  updateEquipo,
  deleteEquipo
} from '../controllers/equipo.controller.js';

export const equipoRoutes = express.Router();

equipoRoutes.get('/', getEquipos);
equipoRoutes.get('/:id', getEquipoById);
equipoRoutes.post('/', createEquipo);
equipoRoutes.put('/:id', updateEquipo);
equipoRoutes.delete('/:id', deleteEquipo);
