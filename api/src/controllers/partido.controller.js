import mongoose from 'mongoose';
import { Partido } from '../models/partido.model.js';

function isValidObjectId(id) {
  return (
    typeof id === 'string' &&
    /^[a-fA-F0-9]{24}$/.test(id) &&
    mongoose.Types.ObjectId.isValid(id)
  );
}

function isValidHora(hora) {
  if (typeof hora !== 'string') {
    return false;
  }
  return /^(0?[1-9]|1[0-2]):[0-5]\d:[0-5]\d\s(a|p)\.\s?m\.$/i.test(hora);
}

async function findDuplicatePartido(equipo1, equipo2, fecha, hora, excludeId = null) {
  const filter = {
    fecha,
    hora,
    $or: [
      { equipo1, equipo2 },
      { equipo1: equipo2, equipo2: equipo1 }
    ]
  };

  if (excludeId) {
    filter._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
  }

  return await Partido.findOne(filter);
}

export async function getPartidos(req, res) {
  try {
    const { equipo, fecha } = req.query;
    const filter = {};

    if (equipo) {
      const normalizedEquipo = equipo.trim();
      filter.$or = [
        { equipo1: normalizedEquipo },
        { equipo2: normalizedEquipo }
      ];
    }

    if (fecha) {
      const normalizedFecha = fecha.trim();
      if (!/^\d{2}\/\d{2}\/\d{2}$/.test(normalizedFecha)) {
        return res.status(400).json({
          status: 'error',
          message: 'La fecha debe estar en formato DD/MM/YY'
        });
      }
      filter.fecha = normalizedFecha;
    }

    const partidos = await Partido.find(filter).sort({ _id: 1 });

    res.status(200).json({
      status: 'success',
      count: partidos.length,
      data: partidos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function getPartidoById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'El id del partido no es válido'
      });
    }

    const partido = await Partido.findById(id);

    if (!partido) {
      return res.status(404).json({
        status: 'error',
        message: 'Partido no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: partido
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function createPartido(req, res) {
  try {
    const { equipo1: rawEquipo1, equipo2: rawEquipo2, fecha: rawFecha, hora } = req.body;

    if (!rawEquipo1 || !rawEquipo2 || !rawFecha || !hora) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    const equipo1 = typeof rawEquipo1 === 'string' ? rawEquipo1.trim() : rawEquipo1;
    const equipo2 = typeof rawEquipo2 === 'string' ? rawEquipo2.trim() : rawEquipo2;
    const fecha = typeof rawFecha === 'string' ? rawFecha.trim() : rawFecha;

    if (!equipo1 || !equipo2 || !fecha) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    if (equipo1 === equipo2) {
      return res.status(400).json({
        status: 'error',
        message: 'Un equipo no puede jugar contra sí mismo'
      });
    }

    if (!/^\d{2}\/\d{2}\/\d{2}$/.test(fecha)) {
      return res.status(400).json({
        status: 'error',
        message: 'La fecha debe estar en formato DD/MM/YY'
      });
    }

    if (!isValidHora(hora)) {
      return res.status(400).json({
        status: 'error',
        message: 'La hora debe estar en formato HH:MM:SS a. m. o HH:MM:SS p. m.'
      });
    }

    const duplicado = await findDuplicatePartido(equipo1, equipo2, fecha, hora);
    if (duplicado) {
      return res.status(409).json({
        status: 'error',
        message: 'El partido ya existe'
      });
    }

    const nuevoPartido = new Partido({
      equipo1,
      equipo2,
      fecha,
      hora
    });

    const partidoGuardado = await nuevoPartido.save();

    res.status(201).json({
      status: 'success',
      message: 'Partido creado correctamente',
      data: partidoGuardado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function updatePartido(req, res) {
  try {
    const { id } = req.params;
    const { equipo1: rawEquipo1, equipo2: rawEquipo2, fecha: rawFecha, hora } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'El id del partido no es válido'
      });
    }

    if (!rawEquipo1 || !rawEquipo2 || !rawFecha || !hora) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    const equipo1 = typeof rawEquipo1 === 'string' ? rawEquipo1.trim() : rawEquipo1;
    const equipo2 = typeof rawEquipo2 === 'string' ? rawEquipo2.trim() : rawEquipo2;
    const fecha = typeof rawFecha === 'string' ? rawFecha.trim() : rawFecha;

    if (!equipo1 || !equipo2 || !fecha) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos'
      });
    }

    if (equipo1 === equipo2) {
      return res.status(400).json({
        status: 'error',
        message: 'Un equipo no puede jugar contra sí mismo'
      });
    }

    if (!/^\d{2}\/\d{2}\/\d{2}$/.test(fecha)) {
      return res.status(400).json({
        status: 'error',
        message: 'La fecha debe estar en formato DD/MM/YY'
      });
    }

    if (!isValidHora(hora)) {
      return res.status(400).json({
        status: 'error',
        message: 'La hora debe estar en formato HH:MM:SS a. m. o HH:MM:SS p. m.'
      });
    }

    const partidoActual = await Partido.findById(id);

    if (!partidoActual) {
      return res.status(404).json({
        status: 'error',
        message: 'Partido no encontrado'
      });
    }

    const duplicado = await findDuplicatePartido(equipo1, equipo2, fecha, hora, id);
    if (duplicado) {
      return res.status(409).json({
        status: 'error',
        message: 'El partido ya existe'
      });
    }

    const partidoActualizado = await Partido.findByIdAndUpdate(
      id,
      {
        equipo1,
        equipo2,
        fecha,
        hora
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Partido actualizado correctamente',
      data: partidoActualizado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function deletePartido(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'El id del partido no es válido'
      });
    }

    const partidoEliminado = await Partido.findByIdAndDelete(id);

    if (!partidoEliminado) {
      return res.status(404).json({
        status: 'error',
        message: 'Partido no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Partido eliminado correctamente',
      data: partidoEliminado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
