// R1: Crear colecciones para representar la información del sistema
// Especificación: docs/knowledge/01-requerimientos.md > R1

db = db.getSiblingDB("mundial2018");

// Función auxiliar para crear colección si no existe
function crearColeccionSiNoExiste(nombreColeccion) {
  const colecciones = db.getCollectionNames();

  if (colecciones.includes(nombreColeccion)) {
    console.log("✓ Colección '" + nombreColeccion + "' ya existe, continuando...");
    return false;
  }

  db.createCollection(nombreColeccion);
  console.log("✓ Colección '" + nombreColeccion + "' creada exitosamente");
  return true;
}

console.log("=== R1: Creando Colecciones ===");
console.log("Base de datos: mundial2018");
console.log("");

// Crear colección: equipos
// Estructura: id (Number), abbreviation (String), country (String), confederation (String)
crearColeccionSiNoExiste("equipos");

// Crear colección: jugadores
// Estructura: team (String), numero (Number), posicion (String), nombre (String),
//             fechaNacimiento (String), nombreCamiseta (String), club (String),
//             estatura (Number), peso (Number)
crearColeccionSiNoExiste("jugadores");

// Crear colección: partidos
// Estructura: equipo1 (String), equipo2 (String), fecha (String), hora (String)
crearColeccionSiNoExiste("partidos");

console.log("");
console.log("=== Validación ===");
const coleccionesFinales = db.getCollectionNames();
console.log("Colecciones en la base de datos:");
coleccionesFinales.forEach(function(col) {
  console.log("  - " + col);
});

console.log("");
const tieneEquipos = coleccionesFinales.includes("equipos");
const tieneJugadores = coleccionesFinales.includes("jugadores");
const tienePartidos = coleccionesFinales.includes("partidos");

if (tieneEquipos && tieneJugadores && tienePartidos) {
  console.log("✓ R1 COMPLETADO: Las 3 colecciones requeridas están presentes");
} else {
  console.log("✗ ERROR: Faltan colecciones");
  if (!tieneEquipos) console.log("  - Falta: equipos");
  if (!tieneJugadores) console.log("  - Falta: jugadores");
  if (!tienePartidos) console.log("  - Falta: partidos");
}
