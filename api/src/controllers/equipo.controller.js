import { Equipo } from '../models/equipo.model.js';

function parsePositiveIntegerId(rawId) {
  if (!/^[1-9]\d*$/.test(rawId)) {
    return null;
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id)) {
    return null;
  }

  return id;
}

export async function getEquipos(req, res) {
  try {
    const equipos = await Equipo.find().sort({ id: 1 });
    res.status(200).json({
      status: 'success',
      count: equipos.length,
      data: equipos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function getEquipoById(req, res) {
  try {
    const { id } = req.params;
    const idNumber = parsePositiveIntegerId(id);

    if (idNumber === null) {
      return res.status(400).json({
        status: 'error',
        message: 'El id debe ser un entero positivo'
      });
    }

    const equipo = await Equipo.findOne({ id: idNumber });

    if (!equipo) {
      return res.status(404).json({
        status: 'error',
        message: `Equipo con id ${idNumber} no encontrado`
      });
    }

    res.status(200).json({
      status: 'success',
      data: equipo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function createEquipo(req, res) {
  try {
    const { id, abbreviation, country, confederation } = req.body;

    if (!id || !abbreviation || !country || !confederation) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos: id, abbreviation, country, confederation'
      });
    }

    if (typeof id !== 'number' || id <= 0 || !Number.isInteger(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'El id debe ser un entero positivo'
      });
    }

    if (typeof abbreviation !== 'string' || abbreviation.trim().length !== 3) {
      return res.status(400).json({
        status: 'error',
        message: 'La abreviatura debe tener exactamente 3 caracteres'
      });
    }

    if (typeof country !== 'string' || country.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El país no puede estar vacío'
      });
    }

    if (typeof confederation !== 'string' || confederation.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'La confederación no puede estar vacía'
      });
    }

    const existeId = await Equipo.findOne({ id });
    if (existeId) {
      return res.status(409).json({
        status: 'error',
        message: `Ya existe un equipo con id ${id}`
      });
    }

    const existeAbreviatura = await Equipo.findOne({ abbreviation: abbreviation.toLowerCase() });
    if (existeAbreviatura) {
      return res.status(409).json({
        status: 'error',
        message: `Ya existe un equipo con abreviatura '${abbreviation.toLowerCase()}'`
      });
    }

    const existePais = await Equipo.findOne({ country });
    if (existePais) {
      return res.status(409).json({
        status: 'error',
        message: `Ya existe un equipo con país '${country}'`
      });
    }

    const nuevoEquipo = new Equipo({
      id,
      abbreviation: abbreviation.toLowerCase(),
      country,
      confederation: confederation.toUpperCase()
    });

    const equipoGuardado = await nuevoEquipo.save();

    res.status(201).json({
      status: 'success',
      message: 'Equipo creado correctamente',
      data: equipoGuardado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function updateEquipo(req, res) {
  try {
    const { id } = req.params;
    const { abbreviation, country, confederation } = req.body;
    const idNumber = parsePositiveIntegerId(id);

    if (idNumber === null) {
      return res.status(400).json({
        status: 'error',
        message: 'El id debe ser un entero positivo'
      });
    }

    if (!abbreviation || !country || !confederation) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos: abbreviation, country, confederation'
      });
    }

    if (typeof abbreviation !== 'string' || abbreviation.trim().length !== 3) {
      return res.status(400).json({
        status: 'error',
        message: 'La abreviatura debe tener exactamente 3 caracteres'
      });
    }

    if (typeof country !== 'string' || country.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El país no puede estar vacío'
      });
    }

    if (typeof confederation !== 'string' || confederation.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'La confederación no puede estar vacía'
      });
    }

    const equipoActual = await Equipo.findOne({ id: idNumber });

    if (!equipoActual) {
      return res.status(404).json({
        status: 'error',
        message: `Equipo con id ${idNumber} no encontrado`
      });
    }

    const abbrevNormalizada = abbreviation.toLowerCase();
    const confNormalizada = confederation.toUpperCase();

    // Validar conflicto de abreviatura (si cambió)
    if (abbrevNormalizada !== equipoActual.abbreviation) {
      const existeAbreviatura = await Equipo.findOne({ abbreviation: abbrevNormalizada });
      if (existeAbreviatura) {
        return res.status(409).json({
          status: 'error',
          message: `Ya existe un equipo con abreviatura '${abbrevNormalizada}'`
        });
      }
    }

    // Validar conflicto de país (si cambió)
    if (country !== equipoActual.country) {
      const existePais = await Equipo.findOne({ country });
      if (existePais) {
        return res.status(409).json({
          status: 'error',
          message: `Ya existe un equipo con país '${country}'`
        });
      }
    }

    const equipoActualizado = await Equipo.findOneAndUpdate(
      { id: idNumber },
      {
        abbreviation: abbrevNormalizada,
        country,
        confederation: confNormalizada
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Equipo actualizado correctamente',
      data: equipoActualizado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

export async function deleteEquipo(req, res) {
  try {
    const { id } = req.params;
    const idNumber = parsePositiveIntegerId(id);

    if (idNumber === null) {
      return res.status(400).json({
        status: 'error',
        message: 'El id debe ser un entero positivo'
      });
    }

    const equipoEliminado = await Equipo.findOneAndDelete({ id: idNumber });

    if (!equipoEliminado) {
      return res.status(404).json({
        status: 'error',
        message: `Equipo con id ${idNumber} no encontrado`
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Equipo eliminado correctamente',
      data: equipoEliminado
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
