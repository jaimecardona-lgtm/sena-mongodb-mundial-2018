// R3: Actualizar registro de James Rodríguez
// Especificación: docs/knowledge/01-requerimientos.md > R3

db = db.getSiblingDB("mundial2018");

console.log("=== R3: Actualizar James Rodríguez ===");
console.log("");

// ============================================================================
// BÚSQUEDA Y VALIDACIÓN PREVIA
// ============================================================================

console.log("--- Estado Actual (ANTES) ---");

const jamesBefore = db.jugadores.findOne({
  team: "Colombia",
  numero: 10
});

if (!jamesBefore) {
  console.log("✗ ERROR: No se encontró a James Rodríguez (Colombia #10)");
  console.log("✗ R3 FALLÓ");
} else {
  console.log("✓ Encontrado: " + jamesBefore.nombre);
  console.log("  Posición: " + jamesBefore.posicion);
  console.log("  Fecha nacimiento: " + jamesBefore.fechaNacimiento);
  console.log("  Nombre camiseta (ANTES): " + jamesBefore.nombreCamiseta);
  console.log("  Club (ANTES): " + jamesBefore.club);
  console.log("  Estatura: " + jamesBefore.estatura + " cm");
  console.log("  Peso: " + jamesBefore.peso + " kg");
  console.log("");

  // ========================================================================
  // ACTUALIZACIÓN
  // ========================================================================

  console.log("--- Ejecutando UPDATE ---");

  const updateResult = db.jugadores.updateOne(
    {
      team: "Colombia",
      numero: 10
    },
    {
      $set: {
        nombreCamiseta: "RODRÍGUEZ",
        club: "Real Madrid CF (ESP)"
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

  const jamesAfter = db.jugadores.findOne({
    team: "Colombia",
    numero: 10
  });

  if (jamesAfter) {
    console.log("✓ Encontrado: " + jamesAfter.nombre);
    console.log("  Posición: " + jamesAfter.posicion);
    console.log("  Fecha nacimiento: " + jamesAfter.fechaNacimiento);
    console.log("  Nombre camiseta (DESPUÉS): " + jamesAfter.nombreCamiseta);
    console.log("  Club (DESPUÉS): " + jamesAfter.club);
    console.log("  Estatura: " + jamesAfter.estatura + " cm");
    console.log("  Peso: " + jamesAfter.peso + " kg");
    console.log("");

    // ====================================================================
    // VALIDACIONES EXACTAS
    // ====================================================================

    console.log("--- Validación de Cambios ---");

    const cambiosCorrectos =
      jamesAfter.nombreCamiseta === "RODRÍGUEZ" &&
      jamesAfter.club === "Real Madrid CF (ESP)";

    const camposIntactos =
      jamesAfter.team === "Colombia" &&
      jamesAfter.numero === 10 &&
      jamesAfter.posicion === "CM" &&
      jamesAfter.nombre === "RODRIGUEZ James" &&
      jamesAfter.fechaNacimiento === "12.07.1991" &&
      jamesAfter.estatura === 180 &&
      jamesAfter.peso === 75;

    console.log("nombreCamiseta = 'RODRÍGUEZ': " + (jamesAfter.nombreCamiseta === "RODRÍGUEZ" ? "✓" : "✗"));
    console.log("club = 'Real Madrid CF (ESP)': " + (jamesAfter.club === "Real Madrid CF (ESP)" ? "✓" : "✗"));
    console.log("");

    console.log("--- Validación de Campos Intactos ---");
    console.log("team = 'Colombia': " + (jamesAfter.team === "Colombia" ? "✓" : "✗"));
    console.log("numero = 10: " + (jamesAfter.numero === 10 ? "✓" : "✗"));
    console.log("posicion = 'CM': " + (jamesAfter.posicion === "CM" ? "✓" : "✗"));
    console.log("nombre = 'RODRIGUEZ James': " + (jamesAfter.nombre === "RODRIGUEZ James" ? "✓" : "✗"));
    console.log("fechaNacimiento = '12.07.1991': " + (jamesAfter.fechaNacimiento === "12.07.1991" ? "✓" : "✗"));
    console.log("estatura = 180: " + (jamesAfter.estatura === 180 ? "✓" : "✗"));
    console.log("peso = 75: " + (jamesAfter.peso === 75 ? "✓" : "✗"));
    console.log("");

    // ====================================================================
    // CONCLUSIÓN
    // ====================================================================

    console.log("--- Resultado Final ---");

    if (cambiosCorrectos && camposIntactos && (updateResult.modifiedCount === 1 || updateResult.modifiedCount === 0)) {
      if (updateResult.modifiedCount === 1) {
        console.log("✓ R3 COMPLETADO: 1 documento modificado correctamente");
      } else {
        console.log("✓ R3 COMPLETADO: Datos ya están correctos (ejecución idempotente)");
      }
    } else {
      console.log("✗ R3 FALLÓ: Validación incompleta");
      if (!cambiosCorrectos) {
        console.log("  - Cambios de nombreCamiseta o club incorrectos");
      }
      if (!camposIntactos) {
        console.log("  - Algunos campos fueron modificados incorrectamente");
      }
    }
  } else {
    console.log("✗ ERROR: No se encontró a James después del update");
    console.log("✗ R3 FALLÓ");
  }
}
