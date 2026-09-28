// R5: Actualizar hora de partido Poland vs. Colombia
// Especificación: docs/knowledge/01-requerimientos.md > R5

db = db.getSiblingDB("mundial2018");

console.log("=== R5: Actualizar Hora de Partido (Poland vs. Colombia) ===");
console.log("");

// ============================================================================
// BÚSQUEDA Y VALIDACIÓN PREVIA
// ============================================================================

console.log("--- Estado Actual (ANTES) ---");

const partidoBefore = db.partidos.findOne({
  equipo1: "Poland",
  equipo2: "Colombia",
  fecha: "26/07/18"
});

if (!partidoBefore) {
  console.log("✗ ERROR: No se encontró el partido Poland vs. Colombia (26/07/18)");
  console.log("✗ R5 FALLÓ");
} else {
  console.log("✓ Encontrado: " + partidoBefore.equipo1 + " vs " + partidoBefore.equipo2);
  console.log("  Fecha: " + partidoBefore.fecha);
  console.log("  Hora (ANTES): " + partidoBefore.hora);
  console.log("");

  // ========================================================================
  // ACTUALIZACIÓN
  // ========================================================================

  console.log("--- Ejecutando UPDATE ---");

  const updateResult = db.partidos.updateOne(
    {
      equipo1: "Poland",
      equipo2: "Colombia",
      fecha: "26/07/18"
    },
    {
      $set: {
        hora: "7:30:00 p. m."
      }
    }
  );

  console.log("matchedCount: " + updateResult.matchedCount);
  console.log("modifiedCount: " + updateResult.modifiedCount);
  console.log("");

  // ========================================================================
  // VALIDACIÓN POSTERIOR
  // ========================================================================

  console.log("--- Estado Final (DESPUÉS) ---");

  const partidoAfter = db.partidos.findOne({
    equipo1: "Poland",
    equipo2: "Colombia",
    fecha: "26/07/18"
  });

  if (partidoAfter) {
    console.log("✓ Encontrado: " + partidoAfter.equipo1 + " vs " + partidoAfter.equipo2);
    console.log("  Fecha: " + partidoAfter.fecha);
    console.log("  Hora (DESPUÉS): " + partidoAfter.hora);
    console.log("");

    // ====================================================================
    // VALIDACIONES EXACTAS
    // ====================================================================

    console.log("--- Validación de Cambios ---");

    const cambiosCorrecto =
      partidoAfter.hora === "7:30:00 p. m.";

    const camposIntactos =
      partidoAfter.equipo1 === "Poland" &&
      partidoAfter.equipo2 === "Colombia" &&
      partidoAfter.fecha === "26/07/18";

    console.log("hora = '7:30:00 p. m.': " + (partidoAfter.hora === "7:30:00 p. m." ? "✓" : "✗"));
    console.log("");

    console.log("--- Validación de Campos Intactos ---");
    console.log("equipo1 = 'Poland': " + (partidoAfter.equipo1 === "Poland" ? "✓" : "✗"));
    console.log("equipo2 = 'Colombia': " + (partidoAfter.equipo2 === "Colombia" ? "✓" : "✗"));
    console.log("fecha = '26/07/18': " + (partidoAfter.fecha === "26/07/18" ? "✓" : "✗"));
    console.log("");

    // ====================================================================
    // CONCLUSIÓN
    // ====================================================================

    console.log("--- Resultado Final ---");

    if (cambiosCorrecto && camposIntactos && (updateResult.modifiedCount === 1 || updateResult.modifiedCount === 0)) {
      if (updateResult.modifiedCount === 1) {
        console.log("✓ R5 COMPLETADO: 1 documento modificado correctamente");
      } else {
        console.log("✓ R5 COMPLETADO: Datos ya están correctos (ejecución idempotente)");
      }
    } else {
      console.log("✗ R5 FALLÓ: Validación incompleta");
      if (!cambiosCorrecto) {
        console.log("  - Hora no se actualizó correctamente");
      }
      if (!camposIntactos) {
        console.log("  - Algunos campos (equipo1, equipo2, fecha) fueron modificados incorrectamente");
      }
    }
  } else {
    console.log("✗ ERROR: No se encontró el partido después del update");
    console.log("✗ R5 FALLÓ");
  }
}
