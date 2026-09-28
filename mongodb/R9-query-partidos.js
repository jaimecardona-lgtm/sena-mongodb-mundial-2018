// R9: Consultar todos los partidos
// Especificación: docs/knowledge/01-requerimientos.md > R9

db = db.getSiblingDB("mundial2018");

console.log("=== R9: Consultar Todos los Partidos ===");
console.log("");

// ============================================================================
// EJECUCIÓN DE CONSULTA
// ============================================================================

console.log("--- Ejecutando Query ---");

const partidos = db.partidos.find({}).toArray();

console.log("Consulta ejecutada exitosamente");
console.log("");

// ============================================================================
// VALIDACIONES PREVIAS
// ============================================================================

console.log("--- Validación de Conteo ---");

const total = partidos.length;
console.log("Partidos encontrados: " + total + " (esperado: 2)");

if (total !== 2) {
  console.log("✗ ERROR: Conteo incorrecto");
} else {
  console.log("✓ Conteo correcto: 2 partidos");
}

console.log("");

// ============================================================================
// MOSTRAR RESULTADOS
// ============================================================================

console.log("--- Resultados ---");
console.log("");

let colombiaJapanEncontrado = false;
let polandColombiaEncontrado = false;
let colombiaEnglandEncontrado = false;

for (let i = 0; i < partidos.length; i++) {
  const p = partidos[i];

  console.log((i + 1) + ". " + p.equipo1 + " vs " + p.equipo2);
  console.log("   Fecha: " + p.fecha);
  console.log("   Hora: " + p.hora);
  console.log("");

  // Buscar partidos específicos
  if (p.equipo1 === "Colombia" && p.equipo2 === "Japan" && p.fecha === "11/07/18") {
    colombiaJapanEncontrado = true;
    if (p.hora !== "12:00:00 p. m.") {
      console.log("  ⚠ ADVERTENCIA: Hora de Colombia vs Japan no es la esperada");
    }
  }

  if (p.equipo1 === "Poland" && p.equipo2 === "Colombia" && p.fecha === "26/07/18") {
    polandColombiaEncontrado = true;
    if (p.hora !== "7:30:00 p. m.") {
      console.log("  ⚠ ADVERTENCIA: Hora de Poland vs Colombia no es la esperada (debería ser 7:30:00 p. m. de R5)");
    }
  }

  if (p.equipo1 === "Colombia" && p.equipo2 === "England" && p.fecha === "20/08/18") {
    colombiaEnglandEncontrado = true;
  }
}

// ============================================================================
// VALIDACIÓN DE PARTIDOS ESPECÍFICOS
// ============================================================================

console.log("--- Validación de Partidos Específicos ---");

console.log("Colombia vs Japan (11/07/18, 12:00:00 p. m.): " + (colombiaJapanEncontrado ? "✓ existe" : "✗ NO existe"));
console.log("Poland vs Colombia (26/07/18, 7:30:00 p. m.): " + (polandColombiaEncontrado ? "✓ existe" : "✗ NO existe"));
console.log("Colombia vs England (20/08/18) eliminado en R6: " + (!colombiaEnglandEncontrado ? "✓ no existe" : "✗ EXISTE (debería haber sido eliminado)"));
console.log("");

// ============================================================================
// VALIDACIÓN DE INTEGRIDAD
// ============================================================================

console.log("--- Validación de Integridad ---");

// Verificar que todos los partidos tienen estructura completa
let estructuraOK = true;
partidos.forEach(function(p) {
  if (!p.equipo1 || !p.equipo2 || !p.fecha || !p.hora) {
    estructuraOK = false;
  }
});

console.log("Todos los partidos tienen estructura completa: " + (estructuraOK ? "✓" : "✗"));
console.log("");

// ============================================================================
// VERIFICACIÓN INDEPENDIENTE
// ============================================================================

console.log("--- Verificación Independiente ---");

const conteoTotal = db.partidos.countDocuments();
console.log("Conteo en MongoDB: " + conteoTotal);
console.log("Resultados retornados: " + total);
console.log("Coinciden: " + (conteoTotal === total ? "✓" : "✗"));
console.log("");

// ============================================================================
// CONCLUSIÓN
// ============================================================================

console.log("--- Resultado Final ---");

const validacionCompleta =
  total === 2 &&
  colombiaJapanEncontrado &&
  polandColombiaEncontrado &&
  !colombiaEnglandEncontrado &&
  estructuraOK &&
  conteoTotal === 2;

if (validacionCompleta) {
  console.log("✓ R9 COMPLETADO: Consulta exitosa, 2 partidos con estructura correcta");
} else {
  console.log("✗ R9 FALLÓ: Validación incompleta");
  if (total !== 2) console.log("  - Conteo incorrecto");
  if (!colombiaJapanEncontrado) console.log("  - No se encontró Colombia vs Japan");
  if (!polandColombiaEncontrado) console.log("  - No se encontró Poland vs Colombia");
  if (colombiaEnglandEncontrado) console.log("  - Colombia vs England aún existe (debería estar eliminado)");
  if (!estructuraOK) console.log("  - Algunos partidos tienen campos faltantes");
}
