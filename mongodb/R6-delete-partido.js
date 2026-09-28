// R6: Eliminar partido insertado en R4 (Colombia vs. England)
// Especificación: docs/knowledge/01-requerimientos.md > R6

db = db.getSiblingDB("mundial2018");

console.log("=== R6: Eliminar Partido (Colombia vs. England) ===");
console.log("");

// ============================================================================
// BÚSQUEDA Y VALIDACIÓN PREVIA
// ============================================================================

console.log("--- Estado Actual (ANTES) ---");

const claveNatural = {
  equipo1: "Colombia",
  equipo2: "England",
  fecha: "20/08/18"
};

const partidoAntes = db.partidos.findOne(claveNatural);

if (!partidoAntes) {
  console.log("⊘ Partido Colombia vs. England (20/08/18) ya no existe");
  console.log("");
  console.log("--- Validación Final ---");
  console.log("El objetivo de R6 ya se encuentra cumplido (partido no existe)");

  const totalPartidos = db.partidos.countDocuments();
  console.log("Partidos en base: " + totalPartidos + " (esperado: 2)");
  console.log("");

  if (totalPartidos === 2) {
    console.log("✓ R6 COMPLETADO: Partido ya eliminado, conteo de partidos correcto");
  } else {
    console.log("⚠ Advertencia: Conteo de partidos no es el esperado");
  }
} else {
  console.log("✓ Encontrado: " + partidoAntes.equipo1 + " vs " + partidoAntes.equipo2);
  console.log("  Fecha: " + partidoAntes.fecha);
  console.log("  Hora: " + partidoAntes.hora);
  console.log("");

  console.log("--- Conteo Antes de Eliminar ---");
  const totalAntesDelete = db.partidos.countDocuments();
  console.log("Partidos en base: " + totalAntesDelete);
  console.log("");

  // ========================================================================
  // ELIMINACIÓN
  // ========================================================================

  console.log("--- Ejecutando DELETE ---");

  const deleteResult = db.partidos.deleteOne(claveNatural);

  console.log("deletedCount: " + deleteResult.deletedCount);
  console.log("");

  // ========================================================================
  // VALIDACIÓN POSTERIOR
  // ========================================================================

  console.log("--- Validación Posterior ---");

  const partidoDespues = db.partidos.findOne(claveNatural);

  if (partidoDespues === null) {
    console.log("✓ Partido Colombia vs. England (20/08/18) no existe");
  } else {
    console.log("✗ ERROR: El partido aún existe después del delete");
  }

  console.log("");

  console.log("--- Conteo Después de Eliminar ---");
  const totalDespuesDelete = db.partidos.countDocuments();
  console.log("Partidos en base: " + totalDespuesDelete + " (esperado: 2)");
  console.log("");

  // ========================================================================
  // VALIDACIÓN DE PARTIDOS RESTANTES
  // ========================================================================

  console.log("--- Validación de Partidos Restantes ---");

  const partidoCJ = db.partidos.findOne({
    equipo1: "Colombia",
    equipo2: "Japan",
    fecha: "11/07/18"
  });

  const partidoPC = db.partidos.findOne({
    equipo1: "Poland",
    equipo2: "Colombia",
    fecha: "26/07/18"
  });

  console.log("Colombia vs Japan (11/07/18): " + (partidoCJ ? "✓ existe" : "✗ no existe"));
  console.log("Poland vs Colombia (26/07/18): " + (partidoPC ? "✓ existe" : "✗ no existe"));
  console.log("");

  // ========================================================================
  // CONCLUSIÓN
  // ========================================================================

  console.log("--- Resultado Final ---");

  if (partidoDespues === null && totalDespuesDelete === 2 && partidoCJ && partidoPC && deleteResult.deletedCount === 1) {
    console.log("✓ R6 COMPLETADO: Partido eliminado correctamente, partidos restantes intactos");
  } else {
    console.log("✗ R6 FALLÓ: Validación incompleta");
    if (partidoDespues !== null) {
      console.log("  - Partido aún existe después del delete");
    }
    if (totalDespuesDelete !== 2) {
      console.log("  - Conteo final no es 2 (obtenido: " + totalDespuesDelete + ")");
    }
    if (!partidoCJ) {
      console.log("  - Colombia vs Japan fue eliminado (no debería)");
    }
    if (!partidoPC) {
      console.log("  - Poland vs Colombia fue eliminado (no debería)");
    }
  }
}
