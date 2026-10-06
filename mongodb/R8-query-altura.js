// R8: Consultar jugadores con estatura < 170 cm
// Especificación: docs/knowledge/01-requerimientos.md > R8

db = db.getSiblingDB("mundial2018");

console.log("=== R8: Consultar Jugadores con Estatura < 170 cm ===");
console.log("");

// ============================================================================
// EJECUCIÓN DE CONSULTA
// ============================================================================

console.log("--- Ejecutando Query ---");

const jugadoresBajos = db.jugadores
  .find({ estatura: { $lt: 170 } })
  .sort({ estatura: 1, team: 1, numero: 1 })
  .toArray();

console.log("Consulta ejecutada exitosamente");
console.log("");

// ============================================================================
// VALIDACIONES PREVIAS
// ============================================================================

console.log("--- Validación de Conteo ---");

const total = jugadoresBajos.length;
console.log("Jugadores encontrados: " + total + " (esperado: 3)");

if (total !== 3) {
  console.log("✗ ERROR: Conteo incorrecto");
} else {
  console.log("✓ Conteo correcto: 3 jugadores");
}

console.log("");

// ============================================================================
// MOSTRAR RESULTADOS
// ============================================================================

console.log("--- Resultados ---");
console.log("");

let validacionAlturasOK = true;
let oshinaEncontrado = false;
let quinteroEncontrado = false;
let inuiEncontrado = false;

for (let i = 0; i < jugadoresBajos.length; i++) {
  const j = jugadoresBajos[i];

  console.log((i + 1) + ". " + j.nombre);
  console.log("   Team: " + j.team);
  console.log("   Número: " + j.numero);
  console.log("   Posición: " + j.posicion);
  console.log("   Estatura: " + j.estatura + " cm");
  console.log("   Peso: " + j.peso + " kg");
  console.log("   Fecha nacimiento: " + j.fechaNacimiento);
  console.log("   Club: " + j.club);
  console.log("   Nombre camiseta: " + j.nombreCamiseta);

  // Validar que tiene estatura < 170
  if (j.estatura >= 170) {
    validacionAlturasOK = false;
  }

  // Buscar jugadores específicos esperados
  if (j.nombre === "OSHIMA Ryota" && j.team === "Japan" && j.numero === 18 && j.estatura === 168) {
    oshinaEncontrado = true;
  }

  if (j.nombre === "QUINTERO Juan" && j.team === "Colombia" && j.numero === 20 && j.estatura === 169) {
    quinteroEncontrado = true;
  }

  if (j.nombre === "INUI Takashi" && j.team === "Japan" && j.numero === 14 && j.estatura === 169) {
    inuiEncontrado = true;
  }

  console.log("");
}

// ============================================================================
// VALIDACIÓN DE FILTRO
// ============================================================================

console.log("--- Validación de Filtro ---");

console.log("Todos tienen estatura < 170: " + (validacionAlturasOK ? "✓" : "✗"));
console.log("");

// ============================================================================
// VALIDACIÓN DE REGISTROS ESPERADOS
// ============================================================================

console.log("--- Validación de Registros Específicos ---");

console.log("OSHIMA Ryota (Japan #18, 168 cm): " + (oshinaEncontrado ? "✓ encontrado" : "✗ NO encontrado"));
console.log("QUINTERO Juan (Colombia #20, 169 cm): " + (quinteroEncontrado ? "✓ encontrado" : "✗ NO encontrado"));
console.log("INUI Takashi (Japan #14, 169 cm): " + (inuiEncontrado ? "✓ encontrado" : "✗ NO encontrado"));
console.log("");

// ============================================================================
// VERIFICACIÓN INDEPENDIENTE
// ============================================================================

console.log("--- Verificación Independiente ---");

const conteoTotal = db.jugadores.countDocuments({ estatura: { $lt: 170 } });
console.log("Conteo en MongoDB: " + conteoTotal);
console.log("Resultados retornados: " + total);
console.log("Coinciden: " + (conteoTotal === total ? "✓" : "✗"));
console.log("");

// Verificar que no hay jugadores con estatura >= 170 en los resultados
const tieneAlguienAlto = jugadoresBajos.some(function(j) {
  return j.estatura >= 170;
});

console.log("Ningún jugador tiene estatura >= 170: " + (!tieneAlguienAlto ? "✓" : "✗"));
console.log("");

// ============================================================================
// CONCLUSIÓN
// ============================================================================

console.log("--- Resultado Final ---");

const validacionCompleta =
  total === 3 &&
  validacionAlturasOK &&
  oshinaEncontrado &&
  quinteroEncontrado &&
  inuiEncontrado &&
  conteoTotal === 3 &&
  !tieneAlguienAlto;

if (validacionCompleta) {
  console.log("✓ R8 COMPLETADO: Consulta exitosa, 3 jugadores con estatura < 170");
} else {
  console.log("✗ R8 FALLÓ: Validación incompleta");
  if (total !== 3) console.log("  - Conteo incorrecto");
  if (!validacionAlturasOK) console.log("  - Algunos jugadores tienen estatura >= 170");
  if (!oshinaEncontrado) console.log("  - No se encontró OSHIMA Ryota");
  if (!quinteroEncontrado) console.log("  - No se encontró QUINTERO Juan");
  if (!inuiEncontrado) console.log("  - No se encontró INUI Takashi");
  if (tieneAlguienAlto) console.log("  - Hay jugadores con estatura >= 170 en los resultados");
}
