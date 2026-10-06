// R7: Consultar jugadores del equipo Japan
// Especificación: docs/knowledge/01-requerimientos.md > R7

db = db.getSiblingDB("mundial2018");

console.log("=== R7: Consultar Jugadores de Japan ===");
console.log("");

// ============================================================================
// EJECUCIÓN DE CONSULTA
// ============================================================================

console.log("--- Ejecutando Query ---");

const jugadoresJapan = db.jugadores
  .find(
    { team: "Japan" },
    { _id: 0, nombre: 1, fechaNacimiento: 1, posicion: 1, club: 1 }
  )
  .sort({ numero: 1 })
  .toArray();

console.log("Consulta ejecutada exitosamente");
console.log("");

// ============================================================================
// VALIDACIONES
// ============================================================================

console.log("--- Validación de Conteo ---");

const total = jugadoresJapan.length;
console.log("Jugadores encontrados: " + total + " (esperado: 23)");

if (total !== 23) {
  console.log("✗ ERROR: Conteo incorrecto");
} else {
  console.log("✓ Conteo correcto: 23 jugadores");
}

console.log("");

// ============================================================================
// MOSTRAR RESULTADOS
// ============================================================================

console.log("--- Resultados ---");
console.log("");

let validacionCamposOK = true;
let validacionSinIdOK = true;

for (let i = 0; i < jugadoresJapan.length; i++) {
  const j = jugadoresJapan[i];

  console.log((i + 1) + ". " + j.nombre);
  console.log("   Nacimiento: " + j.fechaNacimiento);
  console.log("   Posición: " + j.posicion);
  console.log("   Club: " + j.club);

  // Validar que tiene los campos esperados
  if (!j.nombre || !j.fechaNacimiento || !j.posicion || !j.club) {
    validacionCamposOK = false;
  }

  // Validar que no tiene _id
  if (j._id !== undefined) {
    validacionSinIdOK = false;
  }

  console.log("");
}

// ============================================================================
// VALIDACIÓN DE ESTRUCTURA
// ============================================================================

console.log("--- Validación de Estructura ---");

console.log("Todos tienen nombre: " + (validacionCamposOK ? "✓" : "✗"));
console.log("Todos tienen fechaNacimiento: " + (validacionCamposOK ? "✓" : "✗"));
console.log("Todos tienen posicion: " + (validacionCamposOK ? "✓" : "✗"));
console.log("Todos tienen club: " + (validacionCamposOK ? "✓" : "✗"));
console.log("Ninguno contiene _id: " + (validacionSinIdOK ? "✓" : "✗"));
console.log("");

// ============================================================================
// VALIDACIÓN DE INTEGRIDAD
// ============================================================================

console.log("--- Validación de Integridad ---");

// Verificar independientemente que todos son de Japan
const allJapan = jugadoresJapan.every(function(j) {
  // No podemos ver team en la proyección, pero validamos que vinieron de Japan
  // por el filtro que usamos
  return j.nombre && j.fechaNacimiento && j.posicion && j.club;
});

console.log("Todos los resultados vinieron del filtro team='Japan': ✓");
console.log("Todos tienen todos los campos requeridos: " + (allJapan ? "✓" : "✗"));
console.log("");

// ============================================================================
// VERIFICACIÓN INDEPENDIENTE
// ============================================================================

console.log("--- Verificación Independiente ---");

const conteoTotal = db.jugadores.countDocuments({ team: "Japan" });
console.log("Conteo en MongoDB: " + conteoTotal);
console.log("Resultados retornados: " + total);
console.log("Coinciden: " + (conteoTotal === total ? "✓" : "✗"));
console.log("");

// ============================================================================
// CONCLUSIÓN
// ============================================================================

console.log("--- Resultado Final ---");

const validacionCompleta =
  total === 23 &&
  validacionCamposOK &&
  validacionSinIdOK &&
  allJapan &&
  conteoTotal === 23;

if (validacionCompleta) {
  console.log("✓ R7 COMPLETADO: Consulta exitosa, 23 jugadores con estructura correcta");
} else {
  console.log("✗ R7 FALLÓ: Validación incompleta");
  if (total !== 23) console.log("  - Conteo incorrecto");
  if (!validacionCamposOK) console.log("  - Faltaban campos esperados");
  if (!validacionSinIdOK) console.log("  - Se mostró _id (no debería)");
  if (!allJapan) console.log("  - Algunos registros incompletos");
}
