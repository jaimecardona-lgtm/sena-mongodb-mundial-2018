# Mapeo de Evidencia: R1-R10

Este documento establece la correspondencia entre cada requerimiento SENA (R1-R10) y su implementación, generando trazabilidad clara para evaluación.

---

## Matriz de Trazabilidad

| Requerimiento | Descripción | Tipo | Script | Evidencia | Estado |
|---|---|---|---|---|---|
| R1 | Crear colecciones | DDL | `R1-colecciones.js` | Estructura en mongosh | PENDIENTE |
| R2 | Seed: 2 equipos, 46 jugadores, 2 partidos | INSERT | `R2-seed.js` | Documentos insertados y conteos verificados | PENDIENTE |
| R3 | Update James Rodríguez | UPDATE | `R3-update-james.js` | Before/after comparado | PENDIENTE |
| R4 | Insert partido: Colombia-England | INSERT | `R4-insert-partido.js` | Documento insertado | PENDIENTE |
| R5 | Update hora: Poland-Colombia | UPDATE | `R5-update-partido.js` | Before/after de hora | PENDIENTE |
| R6 | Delete partido R4 | DELETE | `R6-delete-partido.js` | Documento no encontrado | PENDIENTE |
| R7 | Query: Jugadores de Japan | QUERY | `R7-query-japan.js` | 23 resultados con 4 campos | PENDIENTE |
| R8 | Query: Altura < 170 | QUERY | `R8-query-altura.js` | Filtro aplicado correctamente | PENDIENTE |
| R9 | Query: Todos partidos | QUERY | `R9-query-partidos.js` | Lista completa de partidos | PENDIENTE |
| R10 | Query: Altura máxima (con empates) | QUERY | `R10-query-max-height.js` | Múltiples jugadores si aplica | PENDIENTE |

---

## R1: Crear Colecciones

### Descripción
Establecer la estructura de almacenamiento creando tres colecciones principales.

### Script
**Archivo:** `mongodb/R1-colecciones.js`

**Responsabilidades:**
1. Crear colección `equipos` con estructura base
2. Crear colección `jugadores` con estructura base
3. Crear colección `partidos` con estructura base
4. Validar que las colecciones existan (opcional: índices)

**Validación esperada:**
```javascript
// Después de ejecutar R1-colecciones.js:
db.getCollectionNames()
// Output: ["equipos", "jugadores", "partidos", ...]

db.equipos.countDocuments()
// Output: 0 (vacío después de R1; se llena en R2)

db.jugadores.countDocuments()
// Output: 0 (vacío después de R1; se llena en R2)

db.partidos.countDocuments()
// Output: 0 (vacío después de R1; se llena en R2)
```

### Evidencia
**Captura:** Screenshot de mongosh mostrando `getCollectionNames()`
**Ubicación:** `evidence/screenshots/R1-colecciones.png`

**Contenido esperado:**
- Listado de colecciones incluyendo equipos, jugadores, partidos
- Confirmación de estructura (sin errores de creación)

---

## R2: Registrar Datos de Prueba

### Descripción
Insertar datos de dos equipos (Colombia y Japan) con todos sus jugadores. 23 jugadores cada uno, total 46.

### Script
**Archivo:** `mongodb/R2-seed.js`

**Responsabilidades:**
1. Insertar 2 documentos en `equipos` (Colombia, Japan)
2. Insertar 46 documentos en `jugadores` (23 Colombia + 23 Japan)
3. Validar inserciones exitosas (insertedCount)
4. Mostrar confirmación de cantidad de documentos

**Datos específicos:**

**Equipos:**
- Colombia (id: 5, abbreviation: "col", CONMEBOL)
- Japan (id: 15, abbreviation: "jpn", AFC)

**Jugadores Colombia:** 23 jugadores (números 1-23)
- Ejemplos: James Rodríguez (10, CM), Carlos Bacca (9, FW), David Ospina (1, GK)

**Jugadores Japan:** 23 jugadores (números 1-23)
- Ejemplos: Honda Keisuke (4, CM), Kagawa Shinji (10, CM), Higashiguchi Masaaki (12, GK), Nakamura Kosuke (23, GK)

**Partidos del Seed:**
- Poland vs. Colombia: "26/07/18", "6:00:00 p. m."
- Colombia vs. Japan: "11/07/18", "12:00:00 p. m."

### Validación esperada
```javascript
// Después de ejecutar R2-seed.js:
db.equipos.countDocuments()
// Output: 2

db.jugadores.countDocuments()
// Output: 46 (23 + 23)

db.jugadores.find({ team: "Colombia" }).count()
// Output: 23

db.jugadores.find({ team: "Japan" }).count()
// Output: 23

db.jugadores.findOne({ nombre: "RODRÍGUEZ James" })
// Output: Document con club "FC Bayern München (GER)"

db.partidos.countDocuments()
// Output: 2 (Poland-Colombia, Colombia-Japan)
```

### Evidencia
**Capturas:**
1. `evidence/screenshots/R2-seed-equipos.png` — Listado de 2 equipos
2. `evidence/screenshots/R2-seed-jugadores-colombia.png` — 23 jugadores Colombia
3. `evidence/screenshots/R2-seed-jugadores-japan.png` — 23 jugadores Japan
4. `evidence/screenshots/R2-seed-partidos.png` — 2 partidos del seed

**Contenido esperado:**
- Confirmación de 2 equipos (Colombia, Japan) con ids y confederaciones
- Conteo de 23 jugadores Colombia
- Conteo de 23 jugadores Japan
- Confirmación de 2 partidos con fechas y horas exactas

---

## R3: Actualizar James Rodríguez

### Descripción
Modificar el registro de James Rodríguez (cambiar nombreCamiseta y club).

### Script
**Archivo:** `mongodb/R3-update-james.js`

**Responsabilidades:**
1. Buscar documento de James Rodríguez
2. Actualizar `nombreCamiseta` de "JAMES" a "RODRÍGUEZ"
3. Actualizar `club` de "FC Bayern München (GER)" a "Real Madrid CF (ESP)"
4. Verificar que modifiedCount = 1
5. Mostrar documento actualizado

**Validación esperada:**
```javascript
// Antes de R3:
db.jugadores.findOne({ nombre: "RODRÍGUEZ James" })
// nombreCamiseta: "JAMES"
// club: "FC Bayern München (GER)"

// Después de R3:
db.jugadores.findOne({ nombre: "RODRÍGUEZ James" })
// nombreCamiseta: "RODRÍGUEZ"
// club: "Real Madrid CF (ESP)"
// team: "Colombia" (sin cambios)
// numero: 10 (sin cambios)
// posicion: "CM" (sin cambios)
// estatura: 180 (sin cambios)
// peso: 75 (sin cambios)
```

### Evidencia
**Capturas:**
1. `evidence/screenshots/R3-before.png` — James antes de update
2. `evidence/screenshots/R3-after.png` — James después de update

**Contenido esperado:**
- Side-by-side: nombreCamiseta y club cambiados
- Confirmación: resto de campos iguales

---

## R4: Insertar Partido Colombia-England

### Descripción
Registrar un nuevo partido.

### Script
**Archivo:** `mongodb/R4-insert-partido.js`

**Responsabilidades:**
1. Insertar documento en `partidos`
2. Datos: Colombia vs. England, 20/08/18, 6:00:00 p. m. (formato SENA)
3. Validar insertedCount = 1
4. Mostrar documento insertado

**Validación esperada:**
```javascript
// Después de R4:
db.partidos.findOne({ equipo1: "Colombia", equipo2: "England" })
// {
//   _id: ObjectId(...),
//   equipo1: "Colombia",
//   equipo2: "England",
//   fecha: "20/08/18",
//   hora: "6:00:00 p. m."
// }
```

### Evidencia
**Captura:** `evidence/screenshots/R4-insert.png`

**Contenido esperado:**
- Documento insertado con todos los campos
- Confirmación de fecha y hora

---

## R5: Actualizar Hora Partido Poland-Colombia

### Descripción
Modificar la hora de un partido existente.

### Script
**Archivo:** `mongodb/R5-update-partido.js`

**Responsabilidades:**
1. Buscar partido Poland vs. Colombia, 26/07/18 (partido del seed R2)
2. Actualizar `hora` de "6:00:00 p. m." a "7:30:00 p. m." (formato SENA)
3. Verificar modifiedCount = 1
4. Mostrar documento actualizado

**Validación esperada:**
```javascript
// Antes de R5:
db.partidos.findOne({ 
  equipo1: "Poland", 
  equipo2: "Colombia", 
  fecha: "26/07/18" 
})
// hora: "6:00:00 p. m."

// Después de R5:
db.partidos.findOne({ 
  equipo1: "Poland", 
  equipo2: "Colombia", 
  fecha: "26/07/18" 
})
// hora: "7:30:00 p. m."
```

### Evidencia
**Capturas:**
1. `evidence/screenshots/R5-before.png` — Hora antes (6:00:00 p. m.)
2. `evidence/screenshots/R5-after.png` — Hora después (7:30:00 p. m.)

**Contenido esperado:**
- Before: hora = "6:00:00 p. m."
- After: hora = "7:30:00 p. m."
- Otros campos sin cambios (equipo1, equipo2, fecha)

---

## R6: Eliminar Partido Colombia-England

### Descripción
Eliminar el partido insertado en R4.

### Script
**Archivo:** `mongodb/R6-delete-partido.js`

**Responsabilidades:**
1. Buscar partido Colombia vs. England, 20/08/18
2. Eliminar documento
3. Verificar deletedCount = 1
4. Validar que no existe más

**Validación esperada:**
```javascript
// Después de R6:
db.partidos.findOne({ equipo1: "Colombia", equipo2: "England" })
// null (no existe)

db.partidos.countDocuments({
  equipo1: "Colombia",
  equipo2: "England"
})
// 0
```

### Evidencia
**Captura:** `evidence/screenshots/R6-delete.png`

**Contenido esperado:**
- Confirmación: documento no encontrado
- Conteo = 0

---

## R7: Consultar Jugadores de Japan

### Descripción
Obtener lista de jugadores de Japan con campos específicos.

### Script
**Archivo:** `mongodb/R7-query-japan.js`

**Responsabilidades:**
1. Filtrar por `team: "Japan"`
2. Proyectar campos: nombre, fechaNacimiento, posicion, club
3. Mostrar resultados (23 jugadores)

**Validación esperada:**
```javascript
// Después de R7:
db.jugadores.find({ team: "Japan" }, {
  nombre: 1,
  fechaNacimiento: 1,
  posicion: 1,
  club: 1,
  _id: 0
}).toArray()
// [
//   { nombre: "HONDA Keisuke", fechaNacimiento: "13.06.1986", 
//     posicion: "CM", club: "CF Pachuca (MEX)" },
//   { nombre: "KAGAWA Shinji", fechaNacimiento: "17.03.1989", 
//     posicion: "CM", club: "Borussia Dortmund (GER)" },
//   { nombre: "HIGASHIGUCHI Masaaki", fechaNacimiento: "12.05.1986", 
//     posicion: "GK", club: "Gamba Osaka (JPN)" },
//   { nombre: "NAKAMURA Kosuke", fechaNacimiento: "27.02.1995", 
//     posicion: "GK", club: "Kashiwa Reysol (JPN)" },
//   ... (19 more players, 23 total)
// ]
// Total: 23 documentos
```

### Evidencia
**Captura:** `evidence/screenshots/R7-query.png`

**Contenido esperado:**
- 23 jugadores Japan
- Campos mostrados: nombre, fechaNacimiento (formato DD.MM.YYYY), posicion, club
- Ningún campo adicional (team, numero, nombreCamiseta, estatura, peso no deben aparecer)

---

## R8: Consultar Jugadores Altura < 170 cm

### Descripción
Obtener jugadores cuya estatura sea menor a 170 centímetros.

### Script
**Archivo:** `mongodb/R8-query-altura.js`

**Responsabilidades:**
1. Filtrar por `estatura < 170`
2. Mostrar todos los campos
3. Contar resultados

**Validación esperada:**
```javascript
// Después de R8:
db.jugadores.find({ estatura: { $lt: 170 } }).toArray()
// Basado en R2, solo:
// - KAGAWA Shinji (173 cm) → NO incluir (no < 170)
// - Otros pueden estar si datos SENA los incluyen
```

**Nota:** Conteo exacto depende de datos SENA completos (R2 proporciona 23 jugadores cada uno de Colombia y Japan).

### Evidencia
**Captura:** `evidence/screenshots/R8-query.png`

**Contenido esperado:**
- Lista de jugadores con estatura < 170
- Todos los campos del documento
- Conteo en el título o al final

---

## R9: Consultar Todos los Partidos

### Descripción
Obtener información completa de todos los partidos registrados.

### Script
**Archivo:** `mongodb/R9-query-partidos.js`

**Responsabilidades:**
1. Buscar todos los documentos en `partidos`
2. Mostrar con estructura: equipo1, equipo2, fecha, hora
3. Contar total

**Validación esperada:**
```javascript
// Después de R9:
db.partidos.find().toArray()
// Contiene:
// - Partidos insertados en R2 (si hubiera)
// - Partido Colombia-England de R4 (antes de R6)
// - Partido Poland-Colombia con hora actualizada en R5
// Total: depende del flujo exacto de ejecución
```

### Evidencia
**Captura:** `evidence/screenshots/R9-query.png`

**Contenido esperado:**
- Listado completo de partidos
- Estructura: equipo1, equipo2, fecha, hora
- Conteo total

---

## R10: Consultar Jugadores Altura Máxima

### Descripción
Obtener todos los jugadores que tienen la altura máxima (incluyendo empates).

### Script
**Archivo:** `mongodb/R10-query-max-height.js`

**Responsabilidades:**
1. Determinar la altura máxima en la colección
2. Retornar TODOS los jugadores con esa altura
3. Manejar correctamente caso de múltiples jugadores con mismo máximo
4. Mostrar documentos completos

**Validación esperada:**
```javascript
// Después de R10:
// Paso 1: Encontrar altura máxima
db.jugadores.aggregate([
  { $group: { _id: null, maxAltura: { $max: "$estatura" } } }
])
// Output: { maxAltura: 188 }

// Paso 2: Retornar jugadores con esa altura
db.jugadores.find({ estatura: 188 }).toArray()
// Output: 
// - David Ospina (Colombia, 188)
// - Si hay otros con 188, TODOS incluidos
// Mínimo: 1 documento; máximo: todos los jugadores
```

**Caso especial:** Si 2+ jugadores tienen 188 cm, retornar 2+ documentos.

### Evidencia
**Capturas:**
1. `evidence/screenshots/R10-max-height.png` — Valor máximo encontrado
2. `evidence/screenshots/R10-jugadores.png` — Jugadores con esa altura

**Contenido esperado:**
- Confirmación de altura máxima
- Listado de TODOS los jugadores con esa altura
- Nota si hay empates

---

## Flujo de Ejecución Esperado

```
1. Ejecutar R1-colecciones.js
   → Colecciones creadas, vacías

2. Ejecutar R2-seed.js
   → 2 equipos + 7 jugadores insertados

3. Ejecutar R3-update-james.js
   → James actualizado (nombreCamiseta, club)

4. Ejecutar R4-insert-partido.js
   → Partido Colombia-England insertado

5. Ejecutar R5-update-partido.js
   → Hora de Poland-Colombia actualizada (si existe)
   → O actualizar otro partido existente

6. Ejecutar R6-delete-partido.js
   → Partido Colombia-England eliminado

7. Ejecutar R7-query-japan.js
   → Consulta: 23 jugadores Japan

8. Ejecutar R8-query-altura.js
   → Consulta: jugadores con estatura < 170

9. Ejecutar R9-query-partidos.js
   → Consulta: todos los partidos (después de R4-R6)

10. Ejecutar R10-query-max-height.js
    → Consulta: jugadores con altura máxima (con empates)
```

---

## Validación Cruzada

### R1 ↔ R2
- R1 crea estructura
- R2 valida que estructura acepta datos

### R2 ↔ R3
- R2 inserta James
- R3 valida que update funciona

### R4 ↔ R5 ↔ R6
- R4 inserta partido
- R5 actualiza otro (o puede reutilizar si hay)
- R6 elimina el de R4

### R7-R10 dependen de R2
- Queries sobre datos de R2

---

## Notas Importantes

1. **Orden de ejecución:** R1 → R2 → R3-R6 (orden flexible) → R7-R10
2. **Independencia:** R3-R6 pueden ejecutarse en cualquier orden después de R2
3. **Reproducibilidad:** Desde estado limpio, mismo resultado
4. **Idempotencia:** Ejecutar 2 veces R2 puede fallar por duplicados (salvo si usa upsert)

---

## Estado Actual

- R1-R10: **PENDIENTE** (documentación lista, implementación pendiente)
- Mapeo: **COMPLETADO**
- Evidencia: **EN PREPARACIÓN** (se generará durante implementación)

---

**Versión:** 1.0  
**Fecha:** 2026-09-27  
**Mapeo validado para coherencia interna**
