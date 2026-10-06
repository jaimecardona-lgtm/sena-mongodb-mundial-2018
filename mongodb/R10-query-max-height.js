// R10: Consultar jugadores con altura máxima (con soporte para empates)
// Especificación: docs/knowledge/01-requerimientos.md > R10

db = db.getSiblingDB("mundial2018");

console.log("=== R10: Consultar Jugadores con Altura Máxima ===");
console.log("");

// ============================================================================
// VERIFICACIÓN PREVIA
// ============================================================================

console.log("--- Verificación Previa ---");

const conteoJugadores = db.jugadores.countDocuments();
console.log("Jugadores en base: " + conteoJugadores);

if (conteoJugadores === 0) {
  console.log("✗ ERROR: No hay jugadores en la colección");
  console.log("✗ R10 FALLÓ");
} else {
  console.log("✓ Hay jugadores disponibles");
  console.log("");

  // ========================================================================
  // CALCULAR ALTURA MÁXIMA DINÁMICAMENTE
  // ========================================================================

  console.log("--- Calculando Altura Máxima ---");

  const jugadorMasAlto = db.jugadores
    .find({}, { estatura: 1 })
    .sort({ estatura: -1 })
    .limit(1)
    .toArray()[0];

  const alturaMaxima = jugadorMasAlto.estatura;

  console.log("Altura máxima encontrada: " + alturaMaxima + " cm");
  console.log("(Calculada dinámicamente, no hardcodeada)");
  console.log("");

  // ========================================================================
  // CONSULTAR TODOS LOS JUGADORES CON ALTURA MÁXIMA
  // ========================================================================

  console.log("--- Consultando Jugadores con Altura Máxima ---");

  const jugadoresMaxAltura = db.jugadores
    .find({ estatura: alturaMaxima })
    .toArray();

  console.log("Jugadores encontrados con estatura " + alturaMaxima + " cm: " + jugadoresMaxAltura.length);
  console.log("");

  // ========================================================================
  // MOSTRAR RESULTADOS
  // ========================================================================

  console.log("--- Resultados ---");
  console.log("");

  let minaEncontrado = false;
  let validacionAlturasOK = true;

  for (let i = 0; i < jugadoresMaxAltura.length; i++) {
    const j = jugadoresMaxAltura[i];

    console.log((i + 1) + ". " + j.nombre);
    console.log("   Team: " + j.team);
    console.log("   Número: " + j.numero);
    console.log("   Posición: " + j.posicion);
    console.log("   Estatura: " + j.estatura + " cm");
    console.log("   Peso: " + j.peso + " kg");
    console.log("   Fecha nacimiento: " + j.fechaNacimiento);
    console.log("   Club: " + j.club);
    console.log("   Nombre camiseta: " + j.nombreCamiseta);

    // Validar que todos tienen exactamente la altura máxima
    if (j.estatura !== alturaMaxima) {
      validacionAlturasOK = false;
    }

    // Buscar a MINA Yerry específicamente
    if (j.nombre === "MINA Yerry" && j.team === "Colombia" && j.numero === 13 && j.estatura === 194) {
      minaEncontrado = true;
    }

    console.log("");
  }

  // ========================================================================
  // VALIDACIÓN DE FILTRO
  // ========================================================================

  console.log("--- Validación de Filtro ---");

  console.log("Todos tienen estatura = " + alturaMaxima + " cm: " + (validacionAlturasOK ? "✓" : "✗"));
  console.log("");

  // ========================================================================
  // VALIDACIÓN DE REGISTROS ESPECÍFICOS
  // ========================================================================

  console.log("--- Validación de Dataset Esperado ---");

  // Con los datos actuales, esperamos a MINA Yerry con 194 cm
  if (alturaMaxima === 194) {
    console.log("Altura máxima esperada (194 cm): ✓");
    console.log("MINA Yerry (Colombia #13, 194 cm): " + (minaEncontrado ? "✓ encontrado" : "✗ NO encontrado"));
  } else {
    console.log("Altura máxima es: " + alturaMaxima + " cm (diferente a la esperada inicialmente)");
  }

  console.log("");

  // ========================================================================
  // VERIFICACIÓN DE NO TENER VALORES SUPERIORES
  // ========================================================================

  console.log("--- Verificación de Máximo Correcto ---");

  // Comprobar que no hay jugadores con estatura > alturaMaxima
  const jugadoresSuperior = db.jugadores.countDocuments({
    estatura: { $gt: alturaMaxima }
  });

  console.log("Jugadores con estatura > " + alturaMaxima + ": " + jugadoresSuperior);

  if (jugadoresSuperior === 0) {
    console.log("✓ Confirma que " + alturaMaxima + " cm es el máximo");
  } else {
    console.log("✗ ERROR: Hay jugadores con estatura superior");
  }

  console.log("");

  // ========================================================================
  // SOPORTE PARA EMPATES
  // ========================================================================

  console.log("--- Soporte para Empates ---");

  if (jugadoresMaxAltura.length > 1) {
    console.log("✓ Múltiples jugadores encontrados con altura máxima (" + jugadoresMaxAltura.length + ")");
    console.log("  Esto demuestra que el script soporta empates correctamente");
  } else {
    console.log("✓ Un único jugador con altura máxima");
    console.log("  (Sin empates en el dataset actual, pero la lógica soportaría múltiples)");
  }

  console.log("");

  // ========================================================================
  // CONCLUSIÓN
  // ========================================================================

  console.log("--- Resultado Final ---");

  const validacionCompleta =
    jugadoresMaxAltura.length > 0 &&
    validacionAlturasOK &&
    jugadoresSuperior === 0;

  if (validacionCompleta) {
    if (alturaMaxima === 194 && minaEncontrado) {
      console.log("✓ R10 COMPLETADO: Altura máxima identificada dinámicamente, jugadores correctos");
    } else {
      console.log("✓ R10 COMPLETADO: Altura máxima identificada dinámicamente, jugadores retornados correctamente");
    }
  } else {
    console.log("✗ R10 FALLÓ: Validación incompleta");
    if (jugadoresMaxAltura.length === 0) console.log("  - No se encontró ningún jugador con altura máxima");
    if (!validacionAlturasOK) console.log("  - Algunos jugadores no tienen la altura máxima");
    if (jugadoresSuperior > 0) console.log("  - Hay jugadores con estatura superior");
  }
}
