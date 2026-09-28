// R4: Registrar partido Colombia vs. England
// Especificación: docs/knowledge/01-requerimientos.md > R4

db = db.getSiblingDB("mundial2018");

console.log("=== R4: Registrar Partido (Colombia vs. England) ===");
console.log("");

// ============================================================================
// DATOS DEL PARTIDO
// ============================================================================

const nuevoPartido = {
  equipo1: "Colombia",
  equipo2: "England",
  fecha: "20/08/18",
  hora: "6:00:00 p. m."
};

// ============================================================================
// VERIFICACIÓN DE DUPLICADO (POR CLAVE NATURAL)
// ============================================================================

console.log("--- Verificación Previa ---");

const claveNatural = {
  equipo1: nuevoPartido.equipo1,
  equipo2: nuevoPartido.equipo2,
  fecha: nuevoPartido.fecha
};

const partidoExistente = db.partidos.findOne(claveNatural);

if (partidoExistente) {
  console.log("⊘ Partido " + nuevoPartido.equipo1 + " vs " + nuevoPartido.equipo2 + " (" + nuevoPartido.fecha + ") ya existe");
  console.log("  Hora registrada: " + partidoExistente.hora);
  console.log("");
  console.log("--- Estado Final ---");
  console.log("Documento existente sin cambios:");
  console.log("  equipo1: " + partidoExistente.equipo1);
  console.log("  equipo2: " + partidoExistente.equipo2);
  console.log("  fecha: " + partidoExistente.fecha);
  console.log("  hora: " + partidoExistente.hora);
  console.log("");
  console.log("✓ R4 COMPLETADO: Partido ya existe (idempotencia)");
} else {
  console.log("✓ Partido no existe, procediendo a insertar");
  console.log("");

  // ========================================================================
  // INSERCIÓN
  // ========================================================================

  console.log("--- Insertando Partido ---");

  const insertResult = db.partidos.insertOne(nuevoPartido);

  console.log("insertedId: " + insertResult.insertedId);
  console.log("");

  // ========================================================================
  // VALIDACIÓN POSTERIOR
  // ========================================================================

  console.log("--- Estado Final ---");

  const partidoInsertado = db.partidos.findOne(claveNatural);

  if (partidoInsertado) {
    console.log("✓ Partido insertado exitosamente:");
    console.log("  equipo1: " + partidoInsertado.equipo1);
    console.log("  equipo2: " + partidoInsertado.equipo2);
    console.log("  fecha: " + partidoInsertado.fecha);
    console.log("  hora: " + partidoInsertado.hora);
    console.log("");

    // ====================================================================
    // VALIDACIONES EXACTAS
    // ====================================================================

    console.log("--- Validación de Valores ---");

    const valoresCorrectos =
      partidoInsertado.equipo1 === "Colombia" &&
      partidoInsertado.equipo2 === "England" &&
      partidoInsertado.fecha === "20/08/18" &&
      partidoInsertado.hora === "6:00:00 p. m.";

    console.log("equipo1 = 'Colombia': " + (partidoInsertado.equipo1 === "Colombia" ? "✓" : "✗"));
    console.log("equipo2 = 'England': " + (partidoInsertado.equipo2 === "England" ? "✓" : "✗"));
    console.log("fecha = '20/08/18': " + (partidoInsertado.fecha === "20/08/18" ? "✓" : "✗"));
    console.log("hora = '6:00:00 p. m.': " + (partidoInsertado.hora === "6:00:00 p. m." ? "✓" : "✗"));
    console.log("");

    // ====================================================================
    // CONCLUSIÓN
    // ====================================================================

    console.log("--- Resultado Final ---");

    if (valoresCorrectos) {
      console.log("✓ R4 COMPLETADO: Partido insertado correctamente");
    } else {
      console.log("✗ R4 FALLÓ: Validación de valores incompleta");
    }
  } else {
    console.log("✗ ERROR: No se encontró el partido después de insertar");
    console.log("✗ R4 FALLÓ");
  }
}

console.log("");
console.log("--- Conteo Total de Partidos ---");
const totalPartidos = db.partidos.countDocuments();
console.log("Partidos en base: " + totalPartidos);
