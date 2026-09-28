# R1-R10: Especificación de Requerimientos

**Taller AA1-EV02:** Taller de consultas en base de datos NoSQL

**Fuente:** Programa SENA — Resultado de aprendizaje 220501123-01

**Tecnología:** MongoDB (documental)

---

## Tabla de Requerimientos

| ID | Descripción | Tipo | Peso | Estado | Script |
|---|---|---|---|---|---|
| R1 | Crear colecciones para representar la información del sistema | DDL | 20% | VALIDADO | `R1-colecciones.js` |
| R2 | Registrar datos de prueba (Colombia, Japan) | INSERT | 20% | VALIDADO | `R2-seed.js` |
| R3 | Actualizar registro de James Rodríguez | UPDATE | 10% | VALIDADO | `R3-update-james.js` |
| R4 | Registrar partido: Colombia vs. England (20/08/18) | INSERT | 5% | PENDIENTE | `R4-insert-partido.js` |
| R5 | Actualizar hora de partido: Poland vs. Colombia | UPDATE | 10% | PENDIENTE | `R5-update-partido.js` |
| R6 | Eliminar registro insertado en R4 | DELETE | 10% | PENDIENTE | `R6-delete-partido.js` |
| R7 | Consultar jugadores de Japan (nombre, fecha nacimiento, posición, club) | QUERY | 5% | PENDIENTE | `R7-query-japan.js` |
| R8 | Consultar jugadores con estatura < 170 cm | QUERY | 5% | PENDIENTE | `R8-query-altura.js` |
| R9 | Consultar todos los partidos | QUERY | 5% | PENDIENTE | `R9-query-partidos.js` |
| R10 | Consultar jugadores con altura máxima (incluir empates) | QUERY | 10% | PENDIENTE | `R10-query-max-height.js` |

**Total:** 100%

---

## Especificaciones Detalladas

### R1: Crear Colecciones

**Objetivo:** Crear las colecciones que representan la información del sistema.

**Operación:** DDL (Data Definition Language)

**Colecciones requeridas:**

#### Colección: `equipos`
Representa los equipos participantes.

```javascript
{
  _id: ObjectId,
  id: Number,                // Identificador único del SENA
  abbreviation: String,      // Ej: "col", "jpn" (minúsculas)
  country: String,           // Nombre del país
  confederation: String      // Confederación continental
}
```

**Notas:**
- `id` es el identificador único del SENA (ej: 5 para Colombia, 15 para Japan)
- `abbreviation` es el código de 3 letras en minúsculas (ej: "col" para Colombia)
- `country` es el nombre exacto según SENA (ej: "Colombia", "Japan")
- `confederation` es la organización continental (ej: "CONMEBOL" para América del Sur)

#### Colección: `jugadores`
Representa los jugadores de cada equipo.

```javascript
{
  _id: ObjectId,
  team: String,              // Nombre del equipo (ej: "Colombia")
  numero: Number,            // Número de camiseta
  posicion: String,          // Código de posición (ej: "CM", "FW", "GK")
  nombre: String,            // Nombre completo FIFA
  fechaNacimiento: String,   // Formato DD.MM.YYYY del SENA (ej: "12.07.1991")
  nombreCamiseta: String,    // Nombre en la camiseta
  club: String,              // Club actual (con país entre paréntesis)
  estatura: Number,          // Altura en centímetros
  peso: Number               // Peso en kilogramos
}
```

**Notas:**
- `nombre` es el nombre oficial FIFA (ej: "RODRÍGUEZ James")
- `nombreCamiseta` es la forma abreviada para la camiseta
- `fechaNacimiento` es String con formato DD.MM.YYYY (preserva fidelidad SENA)
- `estatura` y `peso` son numéricos para facilitar queries de comparación

#### Colección: `partidos`
Representa los partidos jugados o por jugar.

```javascript
{
  _id: ObjectId,
  equipo1: String,           // Nombre del primer equipo
  equipo2: String,           // Nombre del segundo equipo
  fecha: String,             // Formato DD/MM/YY del SENA (ej: "26/07/18")
  hora: String               // Hora con formato SENA (ej: "6:00:00 p. m.")
}
```

**Notas:**
- `equipo1` y `equipo2` contienen nombres completos exactos (ej: "Colombia", "Poland", "England", "Japan")
- `fecha` es String con formato DD/MM/YY (preserva formato SENA)
- `hora` es String con formato HH:MM:SS a. m./p. m. (preserva formato SENA exactamente)

**Criterio de aceptación:**
- Tres colecciones creadas: `equipos`, `jugadores`, `partidos`
- Estructura validada en mongosh
- Documentos insertados posteriormente siguen este esquema

---

### R2: Registrar Datos de Prueba

**Objetivo:** Insertar datos de prueba para dos equipos: Colombia y Japan (23 jugadores cada uno, total 46).

**Operación:** INSERT

**Datos requeridos:**

#### Equipo: Colombia

**Información del equipo:**
- id: 5
- País: Colombia
- Confederación: CONMEBOL
- Abreviación: col

**Jugadores de Colombia:** 23 jugadores (números 1-23) suministrados por SENA.

Ejemplos (datos suministrados):

1. **David Ospina**
   - Team: Colombia
   - Número: 1
   - Posición: GK
   - Nombre: OSPINA David
   - Fecha de nacimiento: 31.08.1988
   - Nombre en camiseta: OSPINA
   - Club: Arsenal FC (ENG)
   - Estatura: 183
   - Peso: 80

2. **Carlos Bacca**
   - Team: Colombia
   - Número: 7
   - Posición: CF
   - Nombre: BACCA Carlos
   - Fecha de nacimiento: 08.09.1986
   - Nombre en camiseta: BACCA
   - Club: Villarreal CF (ESP)
   - Estatura: 181
   - Peso: 77

3. **James Rodriguez**
   - Team: Colombia
   - Número: 10
   - Posición: CM
   - Nombre: RODRIGUEZ James
   - Fecha de nacimiento: 12.07.1991
   - Nombre en camiseta: JAMES
   - Club: FC Bayern München (GER)
   - Estatura: 180
   - Peso: 75

#### Equipo: Japan

**Información del equipo:**
- id: 15
- País: Japan
- Confederación: AFC
- Abreviación: jpn

**Jugadores de Japan:** 23 jugadores (números 1-23) suministrados por SENA.

Ejemplos (datos suministrados):

1. **Honda Keisuke**
   - Team: Japan
   - Número: 4
   - Posición: CM
   - Nombre: HONDA Keisuke
   - Fecha de nacimiento: 13.06.1986
   - Nombre en camiseta: HONDA
   - Club: CF Pachuca (MEX)
   - Estatura: 182
   - Peso: 74

2. **Kagawa Shinji**
   - Team: Japan
   - Número: 10
   - Posición: CM
   - Nombre: KAGAWA Shinji
   - Fecha de nacimiento: 17.03.1989
   - Nombre en camiseta: KAGAWA
   - Club: Borussia Dortmund (GER)
   - Estatura: 175
   - Peso: 68

3. **Higashiguchi Masaaki**
   - Team: Japan
   - Número: 12
   - Posición: GK
   - Nombre: HIGASHIGUCHI Masaaki
   - Fecha de nacimiento: 12.05.1986
   - Nombre en camiseta: HIGASHIGUCHI
   - Club: Gamba Osaka (JPN)
   - Estatura: 184
   - Peso: 78

4. **Yamaguchi Hotaru**
   - Team: Japan
   - Número: 16
   - Posición: CM
   - Nombre: YAMAGUCHI Hotaru
   - Fecha de nacimiento: 06.10.1990
   - Nombre en camiseta: YAMAGUCHI
   - Club: Cerezo Osaka (JPN)
   - Estatura: 173
   - Peso: 72

5. **Nakamura Kosuke**
   - Team: Japan
   - Número: 23
   - Posición: GK
   - Nombre: NAKAMURA Kosuke
   - Fecha de nacimiento: 27.02.1995
   - Nombre en camiseta: NAKAMURA
   - Club: Kashiwa Reysol (JPN)
   - Estatura: 184
   - Peso: 72

**Criterio de aceptación:**
- 2 equipos insertados en colección `equipos` (Colombia con id=5, Japan con id=15)
- 46 jugadores totales insertados (23 de Colombia + 23 de Japan)
- Todos los campos presentes y con tipos correctos
- Datos verificables contra especificación SENA
- Partidos fixtures (necesarios para R5 y R7): 
  - Poland vs. Colombia: fecha "26/07/18", hora "6:00:00 p. m."
  - Colombia vs. Japan: fecha "11/07/18", hora "12:00:00 p. m."

**Partidos del Seed:**

El seed debe incluir dos partidos que son requeridos para ejecución posterior:

1. **Poland vs. Colombia**
   - equipo1: "Poland"
   - equipo2: "Colombia"
   - fecha: "26/07/18"
   - hora: "6:00:00 p. m."
   - **Nota:** Este partido será actualizado en R5 (cambiar hora a "7:30:00 p. m.")

2. **Colombia vs. Japan**
   - equipo1: "Colombia"
   - equipo2: "Japan"
   - fecha: "11/07/18"
   - hora: "12:00:00 p. m."
   - **Nota:** Partido de prueba, no modificado posteriormente

**Notas importantes:**
- Los datos del SENA son la fuente de verdad
- Las fechas y horas se almacenan como String (DD.MM.YYYY para fechaNacimiento, DD/MM/YY y HH:MM:SS a. m./p. m. para partidos)
- Los nombres deben coincidir exactamente con la fuente SENA
- Team debe ser exactamente "Colombia", "Japan", "Poland", "England", etc. (no sustituir con español)

---

### R3: Actualizar Registro de James Rodríguez

**Objetivo:** Modificar el registro de James Rodríguez manteniendo integridad del resto de campos.

**Operación:** UPDATE

**Estado actual (antes de R3):**
```
Team: Colombia
Número: 10
Posición: CM
FIFA Popular Name: RODRÍGUEZ James
Birth Date: 12.07.1991
Shirt Name: JAMES
Club: FC Bayern München (GER)
Height: 180
Weight: 75
```

**Cambios requeridos:**
- `nombreCamiseta` (Shirt Name): "JAMES" → "RODRÍGUEZ"
- `club` (Club): "FC Bayern München (GER)" → "Real Madrid CF (ESP)"

**Campos que NO deben modificarse:**
- Todos los demás (nombre, equipo, número, posición, fecha nacimiento, estatura, peso)

**Criterio de aceptación:**
- Exactamente 1 documento modificado
- `nombreCamiseta` = "RODRÍGUEZ"
- `club` = "Real Madrid CF (ESP)"
- Otros campos sin cambios verificables

---

### R4: Registrar Partido

**Objetivo:** Insertar un nuevo partido.

**Operación:** INSERT

**Datos del partido:**
- Equipo 1: Colombia
- Equipo 2: England
- Fecha: 20/08/18 (20 de agosto de 2018)
- Hora: 6:00:00 p.m. (18:00:00)

**Criterio de aceptación:**
- Documento insertado en colección `partidos`
- `equipo1` = "Colombia"
- `equipo2` = "England"
- `fecha` = 2018-08-20 (tipo Date)
- `hora` = "18:00:00"
- Documento verificable mediante búsqueda

---

### R5: Actualizar Partido

**Objetivo:** Modificar la hora de un partido existente.

**Operación:** UPDATE

**Partido a actualizar:**

Antes:
- Equipo 1: Poland
- Equipo 2: Colombia
- Fecha: 26/07/18
- Hora: 6:00:00 p.m.

Después:
- Equipo 1: Poland
- Equipo 2: Colombia
- Fecha: 26/07/18
- Hora: 7:30:00 p.m.

**Cambios:** Solo la `hora` de "18:00:00" a "19:30:00"

**Criterio de aceptación:**
- Exactamente 1 documento modificado
- `hora` = "7:30:00 p. m."
- Otros campos sin cambios (equipo1, equipo2, fecha)

**Nota importante:**
R5 actualiza el partido Poland-Colombia que forma parte del seed de R2. Este partido es un fixture suministrado por la especificación R5, no es inventado.

---

### R6: Eliminar Partido

**Objetivo:** Eliminar el partido insertado en R4.

**Operación:** DELETE

**Partido a eliminar:** Colombia vs. England (20/08/18, 6:00:00 p. m.)

**Criterio de aceptación:**
- Exactamente 1 documento eliminado
- Búsqueda posterior por Colombia-England devuelve 0 resultados
- Otros partidos sin cambios

---

### R7: Consultar Jugadores de Japan

**Objetivo:** Obtener lista de jugadores del equipo Japan mostrando campos específicos.

**Operación:** FIND (Query de lectura)

**Filtro:** `team` = "Japan"

**Campos a mostrar:**
- nombre
- fechaNacimiento
- posicion
- club

**Criterio de aceptación:**
- Devuelve todos los 23 jugadores de Japan (según seed de R2)
- Cada documento contiene solo los 4 campos especificados (nombre, fechaNacimiento, posicion, club)
- Nombres y clubes correctos según especificación SENA

---

### R8: Consultar Jugadores con Altura < 170 cm

**Objetivo:** Obtener jugadores cuya estatura sea menor a 170 centímetros.

**Operación:** FIND (Query de lectura)

**Filtro:** `estatura` < 170

**Campos:** Todos los campos del documento

**Criterio de aceptación:**
- Devuelve solo jugadores con estatura < 170
- Base de datos de prueba (R2): Shinji Kagawa (173 cm) está fuera; otros pueden incluirse según datos completos

---

### R9: Consultar Todos los Partidos

**Objetivo:** Obtener información completa de todos los partidos registrados.

**Operación:** FIND (Query de lectura)

**Filtro:** Ninguno (todos los documentos)

**Campos:** Todos

**Criterio de aceptación:**
- Devuelve todos los documentos de `partidos`
- Estructura: equipo1, equipo2, fecha, hora
- Orden consistente

---

### R10: Consultar Jugadores con Altura Máxima

**Objetivo:** Obtener los jugadores con la altura máxima registrada.

**Operación:** AGGREGATE (consulta compleja)

**Requisito especial:**
Debe contemplar correctamente la posibilidad de que **múltiples jugadores tengan exactamente la misma altura máxima**. Retornar a todos los que coincidan con el máximo.

**Criterio de aceptación:**
- Identifica correctamente la altura máxima en la base de datos
- Retorna TODOS los jugadores que tienen esa altura (no solo uno)
- Ejemplo: Si el máximo es 188 cm y 2 jugadores miden 188, retorna 2 documentos
- Estructura: todos los campos del jugador

**Notas técnicas:**
- No usar `sort() + limit(1)` (devolvería solo 1 incluso con empates)
- Usar `$max` en agregación o buscar después de determinar máximo
- Considerar casos edge: 0 jugadores, 1 jugador, N jugadores con misma altura

---

## Relación Entre Requerimientos

```
R1 (Crear colecciones)
  ↓
R2 (Seed: Colombia, Japan)
  ├─→ R3 (Update James)
  ├─→ R4 (Insert partido)
  │   └─→ R5 (Update otro partido)
  │   └─→ R6 (Delete partido R4)
  ├─→ R7 (Query Japan)
  ├─→ R8 (Query altura < 170)
  ├─→ R9 (Query partidos)
  └─→ R10 (Query altura máxima)
```

**Flujo:**
1. R1 prepara estructura
2. R2 inserta datos base
3. R3-R6: Operaciones CRUD (modifican datos)
4. R7-R10: Consultas (leen y validan)

---

## Validación de Requerimientos

Cada requerimiento será validado mediante:

1. **Ejecución en mongosh** — El script se carga y ejecuta sin errores
2. **Verificación de resultados** — Los datos cumplen la especificación
3. **Reproducibilidad** — Desde estado limpio, funciona consistentemente
4. **Trazabilidad** — Script vinculado a requerimiento específico

Ver `docs/knowledge/04-validacion.md` para protocolo completo.

---

## Fuentes de Datos

- **SENA:** Programa "DESARROLLO BACKEND CON NODE.JS Y MONGODB"
- **Resultado de aprendizaje:** 220501123-01
- **Evidencia:** AA1-EV02

**Autoridad:** Los datos suministrados por el SENA prevalecen sobre interpretaciones.

---

**Versión:** 1.0  
**Fecha:** 2026-09-27  
**Estado:** Especificación completada, implementación pendiente
