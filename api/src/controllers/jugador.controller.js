import mongoose from 'mongoose';
import { Jugador } from '../models/jugador.model.js';
import { Equipo } from '../models/equipo.model.js';

function isValidObjectId(id) {
  return (
    typeof id === 'string' &&
    /^[a-fA-F0-9]{24}$/.test(id) &&
    mongoose.Types.ObjectId.isValid(id)
  );
}

function parsePositiveIntegerQuery(value) {
  if (typeof value !== 'string') {
    return null;
  }
  if (!/^\d+$/.test(value)) {
    return null;
  }
  const num = parseInt(value, 10);
  if (!Number.isSafeInteger(num) || num <= 0) {
    return null;
  }
  return num;
}

function parsePositiveNumberQuery(value) {
  if (typeof value !== 'string') {
    return null;
  }
  if (!/^(\d+|\d+\.\d+)$/.test(value)) {
    return null;
  }
  const num = Number(value);
  if (!isFinite(num) || num <= 0) {
    return null;
  }
  return num;
}

export async function getJugadores(req, res) {
  try {
    const { team, numero, posicion, estaturaMin, estaturaMax } = req.query;
    const filter = {};

    if (team) {
      filter.team = team.trim();
    }

    if (numero !== undefined) {
      const numValue = parsePositiveIntegerQuery(numero);
      if (numValue === null) {
        return res.status(400).json({
          status: 'error',
          message: 'El número debe ser un entero positivo'
        });
      }
      filter.numero = numValue;
    }

    if (posicion) {
      filter.posicion = posicion.trim().toUpperCase();
    }

    if (estaturaMin !== undefined || estaturaMax !== undefined) {
      filter.estatura = {};

      if (estaturaMin !== undefined) {
        const minValue = parsePositiveNumberQuery(estaturaMin);
        if (minValue === null) {
          return res.status(400).json({
            status: 'error',
            message: 'estaturaMin debe ser un número positivo'
          });
        }
        filter.estatura.$gte = minValue;
      }

      if (estaturaMax !== undefined) {
        const maxValue = parsePositiveNumberQuery(estaturaMax);
        if (maxValue === null) {
          return res.status(400).json({
            status: 'error',
            message: 'estaturaMax debe ser un número positivo'
          });
        }
        filter.estatura.$lte = maxValue;
      }

      if (filter.estatura.$gte && filter.estatura.$lte && filter.estatura.$gte > filter.estatura.$lte) {
        return res.status(400).json({
          status: 'error',
          message: 'estaturaMin no puede ser mayor que estaturaMax'
        });
      }
    }

    const jugadores = await Jugador.find(filter).sort({ team: 1, numero: 1 });

    res.status(200).json({
      status: 'success',
      count: jugadores.length,
      data: jugadores
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function getJugadorById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'El id del jugador no es válido'
      });
    }

    const jugador = await Jugador.findById(id);

    if (!jugador) {
      return res.status(404).json({
        status: 'error',
        message: 'Jugador no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: jugador
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function createJugador(req, res) {
  try {
    const { team: rawTeam, numero, posicion, nombre, fechaNacimiento, nombreCamiseta, club, estatura, peso } = req.body;

    if (!rawTeam || !numero || !posicion || !nombre || !fechaNacimiento || !nombreCamiseta || !club || estatura === undefined || peso === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    const team = typeof rawTeam === 'string' ? rawTeam.trim() : rawTeam;
    if (!team) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    if (typeof numero !== 'number' || numero <= 0 || !Number.isInteger(numero)) {
      return res.status(400).json({
        status: 'error',
        message: 'El número debe ser un entero positivo'
      });
    }

    if (typeof estatura !== 'number' || estatura <= 0 || !Number.isInteger(estatura)) {
      return res.status(400).json({
        status: 'error',
        message: 'La estatura debe ser un entero positivo'
      });
    }

    if (typeof peso !== 'number' || peso <= 0 || !Number.isInteger(peso)) {
      return res.status(400).json({
        status: 'error',
        message: 'El peso debe ser un entero positivo'
      });
    }

    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(fechaNacimiento)) {
      return res.status(400).json({
        status: 'error',
        message: 'La fecha de nacimiento debe estar en formato DD.MM.YYYY'
      });
    }

    const equipoExistente = await Equipo.findOne({ country: team });
    if (!equipoExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'El equipo indicado no existe'
      });
    }

    const jugadorDuplicado = await Jugador.findOne({ team, numero });
    if (jugadorDuplicado) {
      return res.status(409).json({
        status: 'error',
        message: 'Ya existe un jugador con ese número en el equipo indicado'
      });
    }

    const nuevoJugador = new Jugador({
      team,
      numero,
      posicion: posicion.toUpperCase(),
      nombre,
      fechaNacimiento,
      nombreCamiseta,
      club,
      estatura,
      peso
    });

    const jugadorGuardado = await nuevoJugador.save();

    res.status(201).json({
      status: 'success',
      message: 'Jugador creado correctamente',
      data: jugadorGuardado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function updateJugador(req, res) {
  try {
    const { id } = req.params;
    const { team: rawTeam, numero, posicion, nombre, fechaNacimiento, nombreCamiseta, club, estatura, peso } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'El id del jugador no es válido'
      });
    }

    if (!rawTeam || !numero || !posicion || !nombre || !fechaNacimiento || !nombreCamiseta || !club || estatura === undefined || peso === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    const team = typeof rawTeam === 'string' ? rawTeam.trim() : rawTeam;
    if (!team) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    if (typeof numero !== 'number' || numero <= 0 || !Number.isInteger(numero)) {
      return res.status(400).json({
        status: 'error',
        message: 'El número debe ser un entero positivo'
      });
    }

    if (typeof estatura !== 'number' || estatura <= 0 || !Number.isInteger(estatura)) {
      return res.status(400).json({
        status: 'error',
        message: 'La estatura debe ser un entero positivo'
      });
    }

    if (typeof peso !== 'number' || peso <= 0 || !Number.isInteger(peso)) {
      return res.status(400).json({
        status: 'error',
        message: 'El peso debe ser un entero positivo'
      });
    }

    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(fechaNacimiento)) {
      return res.status(400).json({
        status: 'error',
        message: 'La fecha de nacimiento debe estar en formato DD.MM.YYYY'
      });
    }

    const jugadorActual = await Jugador.findById(id);

    if (!jugadorActual) {
      return res.status(404).json({
        status: 'error',
        message: 'Jugador no encontrado'
      });
    }

    const equipoExistente = await Equipo.findOne({ country: team });
    if (!equipoExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'El equipo indicado no existe'
      });
    }

    if (team !== jugadorActual.team || numero !== jugadorActual.numero) {
      const jugadorDuplicado = await Jugador.findOne({ team, numero });
      if (jugadorDuplicado) {
        return res.status(409).json({
          status: 'error',
          message: 'Ya existe un jugador con ese número en el equipo indicado'
        });
      }
    }

    const jugadorActualizado = await Jugador.findByIdAndUpdate(
      id,
      {
        team,
        numero,
        posicion: posicion.toUpperCase(),
        nombre,
        fechaNacimiento,
        nombreCamiseta,
        club,
        estatura,
        peso
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Jugador actualizado correctamente',
      data: jugadorActualizado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function deleteJugador(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'El id del jugador no es válido'
      });
    }

    const jugadorEliminado = await Jugador.findByIdAndDelete(id);

    if (!jugadorEliminado) {
      return res.status(404).json({
        status: 'error',
        message: 'Jugador no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Jugador eliminado correctamente',
      data: jugadorEliminado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
