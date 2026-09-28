# Protocolo de Validación QA

**Objetivo:** Definir los criterios y procedimientos para validar que cada requerimiento (R1-R10) funciona correctamente.

**Audiencia:** Desarrolladores, evaluadores, agentes de QA.

---

## Filosofía

- **No asumir:** "Funciona" requiere evidencia
- **Comparar:** Before/After para updates
- **Reproducir:** Desde estado limpio
- **Documentar:** Cada validación con screenshot

---

## Protocolo General

### Paso 1: Preparación
```javascript
// Estado limpio
use("mundial2018");
db.dropDatabase();  // Solo si es necesario limpiar
```

### Paso 2: Ejecutar Script
```javascript
// Cargar el script de requerimiento
load("mongodb/Rx-nombre.js");
```

### Paso 3: Validar Ejecución
- ¿Script ejecutó sin errores?
- ¿Mensajes de confirmación esperados?

### Paso 4: Validar Datos
- ¿Campos presentes?
- ¿Tipos correctos?
- ¿Valores coinciden con especificación?

### Paso 5: Documentar
- Screenshot de resultado
- Guardar en `evidence/screenshots/`
- Anotar en tabla de estado

---

## Checklist de Validación por Requerimiento

### R1: Crear Colecciones ✓ Validable

**Validación:**
```javascript
// 1. Colecciones existen
db.getCollectionNames().includes("equipos")      // true
db.getCollectionNames().includes("jugadores")    // true
db.getCollectionNames().includes("partidos")     // true

// 2. Colecciones vacías (después de R1, antes de R2)
db.equipos.countDocuments()    // 0
db.jugadores.countDocuments()  // 0
db.partidos.countDocuments()   // 0

// 3. Estructura validable (intentar insert)
db.equipos.insertOne({
  abbreviation: "TEST",
  country: "Test Country",
  confederation: "TEST"
});
db.equipos.deleteOne({ abbreviation: "TEST" });  // Limpiar
```

**Criterios de aceptación:**
- ✅ 3 colecciones creadas
- ✅ Ningún error de creación
- ✅ Colecciones aceptan inserciones

**Estado:** COMPLETADO si todos los criterios pasan.

---

### R2: Registrar Datos de Prueba ✓ Validable

**Validación:**

#### 2A: Contar Equipos
```javascript
db.equipos.countDocuments()
// Output: 2
```

#### 2B: Contar Jugadores
```javascript
db.jugadores.countDocuments()
// Output: 7
```

#### 2C: Validar Equipos
```javascript
db.equipos.findOne({ country: "Colombia" })
// {
//   _id: ObjectId(...),
//   id: 5,
//   abbreviation: "col",
//   country: "Colombia",
//   confederation: "CONMEBOL"
// }

db.equipos.findOne({ country: "Japan" })
// {
//   _id: ObjectId(...),
//   id: 15,
//   abbreviation: "jpn",
//   country: "Japan",
//   confederation: "AFC"
// }
```

#### 2D: Validar Jugadores Colombia
```javascript
const colombiaPlayers = db.jugadores.find({ team: "Colombia" }).toArray();
colombiaPlayers.length === 23  // true
// Debe contener 23 jugadores (números 1-23) incluyendo:
// 1. RODRÍGUEZ James (numero: 10, posicion: "CM")
// 2. BACCA Carlos (numero: 9, posicion: "FW")
// 3. OSPINA David (numero: 1, posicion: "GK")
// ... más 20 jugadores

// Validación específica: James antes de R3
const james = db.jugadores.findOne({ nombre: "RODRÍGUEZ James" });
james.nombreCamiseta === "JAMES" &&
james.club === "FC Bayern München (GER)" &&
james.estatura === 180 &&
james.peso === 75 &&
james.fechaNacimiento === "12.07.1991"  // String, no Date
// true
```

#### 2E: Validar Jugadores Japan
```javascript
const japanPlayers = db.jugadores.find({ team: "Japan" }).toArray();
japanPlayers.length === 23  // true
// Debe contener 23 jugadores (números 1-23) incluyendo:
// 1. HONDA Keisuke (numero: 4, posicion: "CM")
// 2. KAGAWA Shinji (numero: 10, posicion: "CM")
// 3. HIGASHIGUCHI Masaaki (numero: 12, posicion: "GK")
// 4. NAKAMURA Kosuke (numero: 23, posicion: "GK")
// ... más 19 jugadores
```

#### 2F: Validar Tipos de Datos
```javascript
const james = db.jugadores.findOne({ nombre: "RODRÍGUEZ James" });
typeof james.numero === "number"              // true
typeof james.nombre === "string"              // true
james.fechaNacimiento instanceof Date         // true
typeof james.estatura === "number"            // true
```

**Criterios de aceptación:**
- ✅ 2 equipos (Colombia, Japan)
- ✅ 46 jugadores (23 Colombia, 23 Japan)
- ✅ Todos los campos presentes
- ✅ Tipos correctos
- ✅ Datos coinciden con especificación SENA

**Estado:** COMPLETADO si todos los criterios pasan.

---

### R3: Actualizar James Rodríguez ✓ Validable

**Validación:**

#### 3A: Before (Hacer ANTES de ejecutar R3)
```javascript
const jamesBefore = db.jugadores.findOne({ nombre: "RODRÍGUEZ James" });
console.log("Before:");
console.log("nombreCamiseta:", jamesBefore.nombreCamiseta);  // "JAMES"
console.log("club:", jamesBefore.club);                      // "FC Bayern München (GER)"
```

#### 3B: Ejecutar R3
```javascript
load("mongodb/R3-update-james.js");
```

#### 3C: After (Hacer DESPUÉS de ejecutar R3)
```javascript
const jamesAfter = db.jugadores.findOne({ nombre: "RODRÍGUEZ James" });
console.log("After:");
console.log("nombreCamiseta:", jamesAfter.nombreCamiseta);  // "RODRÍGUEZ" ✓
console.log("club:", jamesAfter.club);                      // "Real Madrid CF (ESP)" ✓
```

#### 3D: Validar que Otros Campos No Cambiaron
```javascript
jamesAfter.nombre === "RODRÍGUEZ James" &&
jamesAfter.team === "Colombia" &&
jamesAfter.numero === 10 &&
jamesAfter.posicion === "CM" &&
jamesAfter.estatura === 180 &&
jamesAfter.peso === 75
// true
```

**Criterios de aceptación:**
- ✅ `nombreCamiseta` cambiado a "RODRÍGUEZ"
- ✅ `club` cambiado a "Real Madrid CF (ESP)"
- ✅ Otros campos intactos
- ✅ Exactamente 1 documento modificado

**Estado:** COMPLETADO si todos los criterios pasan.

---

### R4: Insertar Partido ✓ Validable

**Validación:**

#### 4A: Ejecutar R4
```javascript
load("mongodb/R4-insert-partido.js");
```

#### 4B: Verificar Existencia
```javascript
const partido = db.partidos.findOne({
  equipo1: "Colombia",
  equipo2: "England"
});
// Debe existir, no ser null
```

#### 4C: Validar Estructura
```javascript
partido.equipo1 === "Colombia" &&
partido.equipo2 === "England" &&
partido.fecha.toISOString().includes("2018-08-20") &&
partido.hora === "18:00:00"
// true
```

**Criterios de aceptación:**
- ✅ Partido insertado
- ✅ Campos correctos
- ✅ Fecha correcta (20/08/18)
- ✅ Hora correcta (18:00:00)

**Estado:** COMPLETADO si todos los criterios pasan.

---

### R5: Actualizar Partido ✓ Validable

**Validación:**

#### 5A: Encontrar Partido
```javascript
const partidoOriginal = db.partidos.findOne({
  equipo1: "Poland",
  equipo2: "Colombia",
  fecha: "26/07/18"
});
// Debe existir (insertado en R2 seed)
```

#### 5B: Before
```javascript
console.log("Hora antes:", partidoOriginal.hora);  // "18:00:00"
```

#### 5C: Ejecutar R5
```javascript
load("mongodb/R5-update-partido.js");
```

#### 5D: After
```javascript
const partidoActualizado = db.partidos.findOne({
  equipo1: "Poland",
  equipo2: "Colombia",
  fecha: "26/07/18"
});
console.log("Hora después:", partidoActualizado.hora);  // "7:30:00 p. m." ✓
```

#### 5E: Validar que Otros Campos No Cambiaron
```javascript
partidoActualizado.equipo1 === "Poland" &&
partidoActualizado.equipo2 === "Colombia"
// true
```

**Criterios de aceptación:**
- ✅ Hora actualizada a "19:30:00"
- ✅ Otros campos (equipos, fecha) intactos
- ✅ Exactamente 1 documento modificado

**Estado:** COMPLETADO si todos los criterios pasan.

---

### R6: Eliminar Partido ✓ Validable

**Validación:**

#### 6A: Verificar que Existe (Antes)
```javascript
const partidoBefore = db.partidos.findOne({
  equipo1: "Colombia",
  equipo2: "England"
});
// Must exist
```

#### 6B: Ejecutar R6
```javascript
load("mongodb/R6-delete-partido.js");
```

#### 6C: Verificar que NO Existe (Después)
```javascript
const partidoAfter = db.partidos.findOne({
  equipo1: "Colombia",
  equipo2: "England"
});
// Debe ser null
partidoAfter === null  // true

db.partidos.countDocuments({
  equipo1: "Colombia",
  equipo2: "England"
})
// 0
```

**Criterios de aceptación:**
- ✅ Partido no encontrado después del delete
- ✅ Conteo = 0
- ✅ Exactamente 1 documento eliminado
- ✅ Otros partidos sin cambios

**Estado:** COMPLETADO si todos los criterios pasan.

---

### R7: Consultar Jugadores de Japan ✓ Validable

**Validación:**

#### 7A: Ejecutar R7
```javascript
load("mongodb/R7-query-japan.js");
```

#### 7B: Contar Resultados
```javascript
const jugadoresJapan = db.jugadores.find({ team: "Japan" }, {
  nombre: 1,
  fechaNacimiento: 1,
  posicion: 1,
  club: 1
}).toArray();

jugadoresJapan.length === 23  // true (23 jugadores)
```

#### 7C: Validar Campos
```javascript
// Cada documento debe tener SOLO estos campos:
jugadoresJapan.forEach(j => {
  const keys = Object.keys(j).sort();
  // keys debe contener: _id, club, fechaNacimiento, nombre, posicion
  // (no debe incluir: team, numero, nombreCamiseta, estatura, peso)
});
```

#### 7D: Validar Contenido
```javascript
const nombres = jugadoresJapan.map(j => j.nombre);
nombres.includes("HONDA Keisuke") &&
nombres.includes("KAGAWA Shinji") &&
nombres.includes("HIGASHIGUCHI Masaaki") &&
nombres.includes("NAKAMURA Kosuke")
// true
```

#### 7E: Validar Formato de fechaNacimiento
```javascript
// fechaNacimiento debe ser String con formato DD.MM.YYYY
const primer = jugadoresJapan[0];
typeof primer.fechaNacimiento === "string"  // true
primer.fechaNacimiento.match(/^\d{2}\.\d{2}\.\d{4}$/)  // true
```

**Criterios de aceptación:**
- ✅ 23 jugadores retornados
- ✅ Campos: nombre, fechaNacimiento, posicion, club
- ✅ SIN campos: team, numero, nombreCamiseta, estatura, peso
- ✅ fechaNacimiento es String con formato DD.MM.YYYY
- ✅ Nombres correctos (incluir los 4 ejemplos mencionados)

**Estado:** COMPLETADO si todos los criterios pasan.

---

### R8: Consultar Altura < 170 ✓ Validable

**Validación:**

#### 8A: Ejecutar R8
```javascript
load("mongodb/R8-query-altura.js");
```

#### 8B: Obtener Resultados
```javascript
const jugadoresBajos = db.jugadores.find({ 
  estatura: { $lt: 170 } 
}).toArray();
```

#### 8C: Validar Filtro
```javascript
// Cada jugador debe tener estatura < 170
jugadoresBajos.every(j => j.estatura < 170)  // true

// No debe incluir jugadores con estatura >= 170
const altos = db.jugadores.find({ estatura: { $gte: 170 } }).toArray();
const altosEnBajos = altos.filter(a => 
  jugadoresBajos.some(b => b._id.equals(a._id))
);
altosEnBajos.length === 0  // true
```

#### 8D: Validar Conteo
```javascript
// Basado en R2:
// - Shinji Kagawa: 173 cm (NO incluir)
// - Otros de R2: >170 (NO incluir)
// Conteo exacto depende de datos SENA completos
jugadoresBajos.length > 0  // true (al menos 1)
```

**Criterios de aceptación:**
- ✅ Todos los resultados tienen estatura < 170
- ✅ Ningún resultado con estatura >= 170
- ✅ Conteo consistente (depende de datos SENA)

**Estado:** COMPLETADO si filtro es correcto.

---

### R9: Consultar Partidos ✓ Validable

**Validación:**

#### 9A: Ejecutar R9
```javascript
load("mongodb/R9-query-partidos.js");
```

#### 9B: Obtener Resultados
```javascript
const partidos = db.partidos.find().toArray();
```

#### 9C: Validar Estructura
```javascript
partidos.every(p => 
  p.equipo1 && 
  p.equipo2 && 
  p.fecha && 
  p.hora
)  // true
```

#### 9D: Validar Conteo
```javascript
// Después de R4 (insert) y R6 (delete):
// El partido Colombia-England fue eliminado
// Solo quedan otros partidos
partidos.find(p => 
  p.equipo1 === "Colombia" && p.equipo2 === "England"
)  // undefined (no existe)
```

**Criterios de aceptación:**
- ✅ Todos los partidos tienen estructura completa
- ✅ Campos: equipo1, equipo2, fecha, hora
- ✅ Conteo = total en colección
- ✅ No incluye partido eliminado en R6

**Estado:** COMPLETADO si estructura es válida.

---

### R10: Consultar Altura Máxima ✓ Validable

**Validación:**

#### 10A: Ejecutar R10
```javascript
load("mongodb/R10-query-max-height.js");
```

#### 10B: Determinar Máximo Esperado
```javascript
// Método 1: Aggregation
const maxResult = db.jugadores.aggregate([
  { $group: { _id: null, maxAltura: { $max: "$estatura" } } }
]).toArray();
const alturaMaxima = maxResult[0].maxAltura;

// Basado en R2: David Ospina (Colombia) = 188 cm (máximo esperado)
alturaMaxima === 188  // true (si solo R2 data)
```

#### 10C: Obtener Jugadores con Altura Máxima
```javascript
const jugadoresMaxAltura = db.jugadores.find({ 
  estatura: alturaMaxima 
}).toArray();
```

#### 10D: Validar Conteo
```javascript
// Con datos de R2: David Ospina (188) es el único
jugadoresMaxAltura.length >= 1  // true

// Caso de empates: Si hay 2 con 188, retorna 2
// El script debe retornar TODOS, no solo 1
```

#### 10E: Validar Que No Incluye Menores
```javascript
// Ninguno debe tener altura < máxima
jugadoresMaxAltura.every(j => j.estatura === alturaMaxima)  // true
```

#### 10F: Prueba de Empates
```javascript
// Insertar jugador de prueba con altura máxima
db.jugadores.insertOne({
  team: "TestTeam",
  numero: 99,
  posicion: "TEST",
  nombre: "TEST PLAYER",
  fechaNacimiento: new Date("1990-01-01"),
  nombreCamiseta: "TEST",
  club: "Test Club",
  estatura: 188,  // Mismo que máximo
  peso: 80
});

// Ejecutar R10 nuevamente
load("mongodb/R10-query-max-height.js");

// Debe retornar 2 jugadores (David Ospina + TEST PLAYER)
// Limpiar después
db.jugadores.deleteOne({ nombre: "TEST PLAYER" });
```

**Criterios de aceptación:**
- ✅ Identifica altura máxima correctamente
- ✅ Retorna TODOS los jugadores con esa altura
- ✅ No retorna jugadores con altura menor
- ✅ Maneja empates correctamente (múltiples resultados)

**Estado:** COMPLETADO si todos los criterios pasan.

---

## Tabla de Validación General

| R | Descriptor | Validable | Dependencias | Conteo Esperado | Criterios Clave |
|---|---|---|---|---|---|
| R1 | Colecciones | ✓ | - | 3 colecciones | Existen, vacías |
| R2 | Seed | ✓ | R1 | 2 eq, 7 jug | Datos correctos |
| R3 | Update James | ✓ | R2 | 1 modificado | nombreCamiseta, club |
| R4 | Insert partido | ✓ | R1 | 1 insertado | Campos correctos |
| R5 | Update partido | ✓ | R2/R4 | 1 modificado | Hora actualizada |
| R6 | Delete partido | ✓ | R4 | 1 eliminado | No existe después |
| R7 | Query Japan | ✓ | R2 | 23 resultados | 4 campos específicos |
| R8 | Query altura < 170 | ✓ | R2 | ≥1 | Filtro aplicado |
| R9 | Query partidos | ✓ | R4, R5 | Todos | Estructura completa |
| R10 | Query altura máx | ✓ | R2 | Empates OK | MAX + all matches |

---

## Protocolos de Reproducibilidad

### Desde Estado Limpio

```javascript
// 1. Conectar
use("mundial2018");

// 2. Limpiar (opcional, si hay datos previos)
db.dropDatabase();

// 3. Ejecutar en orden
load("mongodb/R1-colecciones.js");
load("mongodb/R2-seed.js");
load("mongodb/R3-update-james.js");
load("mongodb/R4-insert-partido.js");
load("mongodb/R5-update-partido.js");
load("mongodb/R6-delete-partido.js");

// 4. Validar
load("mongodb/R7-query-japan.js");
load("mongodb/R8-query-altura.js");
load("mongodb/R9-query-partidos.js");
load("mongodb/R10-query-max-height.js");
```

**Resultado esperado:** Todos los requerimientos cumplen criterios.

---

## Documentación de Evidencia

Cada validación completada debe generar:

1. **Screenshot:** `evidence/screenshots/R{N}-{descripcion}.png`
2. **Anotación:** Guardar en tabla de estado
3. **Timestamp:** Fecha/hora de validación

---

## Estado de Validación

Actualizar esta tabla a medida que se completen validaciones:

| R | Estado | Fecha | Nota |
|---|---|---|---|
| R1 | VALIDADO | 2026-09-27 | Validado en MongoDB 8.3.11 local vía mongosh (MongoDB Compass). Colecciones creadas correctamente: equipos, jugadores, partidos (vacías como esperado). |
| R2 | VALIDADO | 2026-09-28 | Validado en MongoDB 8.3.11 local vía mongosh. Inserción de 2 equipos, 46 jugadores (23 Colombia + 23 Japan), 2 partidos. Idempotencia comprobada: segunda ejecución omitió duplicados sin alterar datos. |
| R3 | VALIDADO | 2026-09-28 | Validado en MongoDB 8.3.11 local vía mongosh. Update de 1 documento (Colombia #10): nombreCamiseta "JAMES" → "RODRÍGUEZ", club "FC Bayern München (GER)" → "Real Madrid CF (ESP)". Idempotencia comprobada: segunda ejecución modifiedCount=0, todos los valores correctos. |
| R4 | VALIDADO | 2026-09-28 | Validado en MongoDB 8.3.11 local vía mongosh. Insert de 1 documento: Colombia vs England (20/08/18, 6:00:00 p. m.). Partidos: 2 → 3. Idempotencia comprobada: segunda ejecución detectó duplicado, no insertó, partidos permanecieron en 3. |
| R5 | VALIDADO | 2026-09-28 | Validado en MongoDB 8.3.11 local vía mongosh. Update de 1 documento (Poland vs Colombia 26/07/18): hora "6:00:00 p. m." → "7:30:00 p. m.". Equipos y fecha intactos. Idempotencia comprobada: segunda ejecución modifiedCount=0, todos los valores correctos. |
| R6 | VALIDADO | 2026-09-28 | Validado en MongoDB 8.3.11 local vía mongosh. Delete de 1 documento: Colombia vs England (20/08/18). Partidos: 3 → 2. Otros partidos intactos. Idempotencia comprobada: segunda ejecución no eliminó nada, partidos permanecieron en 2. |
| R7 | PENDIENTE | - | - |
| R8 | PENDIENTE | - | - |
| R9 | PENDIENTE | - | - |
| R10 | PENDIENTE | - | - |

---

**Versión:** 1.0  
**Fecha:** 2026-09-27  
**Estatus:** Protocolo completado, validación en progreso
