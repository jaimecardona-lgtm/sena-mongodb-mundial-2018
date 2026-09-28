# Modelo de Datos MongoDB

## Análisis: ¿Por Qué MongoDB?

MongoDB es apropiado para este proyecto por:

### 1. **Datos Heterogéneos**
- Jugadores tienen número, posición, club; equipos no
- Pueden existir campos opcionales en distintos equipos
- Estructura flexible sin migración de esquema

### 2. **Información Anidada Potencial**
- Un equipo podría contener lista de jugadores como array
- Un partido podría incluir goles, tarjetas, etc. en el futuro
- MongoDB permite documentos complejos sin normalización

### 3. **Consultas Documentales**
- Búsquedas por atributos simples (equipo, altura, posición)
- Agregaciones sin joins costosos (R10)
- No requiere asociaciones de claves foráneas

### 4. **Escalabilidad Horizontal**
- Sharding por equipo es posible (no aplicable aquí, pero viable)
- Replicación sin esquema rígido

## Estrategia Documental

### Desnormalización Intencional

Este modelo **NO normaliza como SQL** porque:

1. **Cada documento es autocontenido**
   - Jugador contiene nombre del equipo (no ObjectId)
   - Partido contiene nombres de equipos (no referencias)

2. **Evita joins costosos**
   - R7: "Jugadores de Japan" es un simple `find()`
   - No requiere `lookup` con `equipos`

3. **Respeta la fuente de datos SENA**
   - Datos suministrados ya contienen relaciones denormalizadas
   - Mantener coherencia con especificación original

### Trade-offs de Esta Decisión

| Ventaja | Desventaja |
|---------|-----------|
| Consultas simples y rápidas | Actualizar nombre equipo requiere múltiples docs |
| Documentos autocontenidos | Posibilidad de inconsistencia (ej: "Colombia" vs "colombia") |
| No requiere joins | Mayor almacenamiento (nombre repetido) |
| Fácil agregación | Mantenimiento manual de integridad |

**Para este taller académico:** Los beneficios superan los riesgos.

---

## Colecciones Propuestas

### 1. Colección: `equipos`

**Propósito:** Registro maestro de equipos.

**Estructura:**
```javascript
{
  _id: ObjectId,
  id: Number,                // Ej: 5 (Colombia), 15 (Japan)
  abbreviation: String,      // "col", "jpn", "eng", "pol"
  country: String,           // "Colombia", "Japan", "England", "Poland"
  confederation: String      // "CONMEBOL", "AFC", "UEFA"
}
```

**Campos:**
- `_id`: Identificador único MongoDB (automático)
- `id` (Number): Identificador del SENA
  - **Tipo:** Number
  - **Rango:** ID único por equipo (ej: 5, 15)
  - **Ejemplo:** 5 (Colombia), 15 (Japan)

- `abbreviation` (String): Código de país (minúsculas)
  - **Tipo:** String
  - **Rango:** Exactamente 3 caracteres lowercase
  - **Ejemplo:** "col", "jpn", "eng", "pol"

- `country` (String): Nombre del país
  - **Tipo:** String
  - **Rango:** Nombre completo según SENA
  - **Ejemplo:** "Colombia", "Japan"

- `confederation` (String): Organización continental
  - **Tipo:** String
  - **Rango:** CONMEBOL, AFC, UEFA, CAF, OFC, CONCACAF
  - **Ejemplo:** "CONMEBOL"

**Índices candidatos:**
- Unique en `abbreviation` (para integridad)
- Unique en `country` (para integridad)

**Cantidad estimada:** ~32 (todos los equipos del mundial)
**Crecimiento:** Ninguno (fijo para el torneo)

---

### 2. Colección: `jugadores`

**Propósito:** Registro de todos los jugadores.

**Estructura:**
```javascript
{
  _id: ObjectId,
  team: String,              // "Colombia", "Japan"
  numero: Number,            // 1-99
  posicion: String,          // "GK", "CB", "CM", "CF"
  nombre: String,            // "OSPINA David", "RODRIGUEZ James"
  fechaNacimiento: String,   // "31.08.1988" (DD.MM.YYYY)
  nombreCamiseta: String,    // "OSPINA", "JAMES"
  club: String,              // "Arsenal FC (ENG)"
  estatura: Number,          // 160-210 (cm)
  peso: Number               // 60-100 (kg)
}
```

**Campos:**

- `team` (String): Nombre del equipo
  - **Tipo:** String
  - **Rango:** Nombre completo de equipo
  - **Ejemplo:** "Colombia"
  - **Relación:** Denormalizado (no ObjectId)

- `numero` (Number): Número de camiseta
  - **Tipo:** Integer
  - **Rango:** 1-99
  - **Ejemplo:** 10

- `posicion` (String): Código de posición
  - **Tipo:** String
  - **Rango:** GK (portero), CB (central), CM (mediocampista), AM (extremo), FW (delantero)
  - **Ejemplo:** "CM"

- `nombre` (String): Nombre oficial FIFA
  - **Tipo:** String
  - **Ejemplo:** "RODRÍGUEZ James"

- `fechaNacimiento` (String): Fecha de nacimiento
  - **Tipo:** String
  - **Formato:** DD.MM.YYYY (del SENA)
  - **Ejemplo:** "12.07.1991"

- `nombreCamiseta` (String): Nombre en camiseta
  - **Tipo:** String
  - **Longitud:** ≤ 20 caracteres
  - **Ejemplo:** "JAMES", "OSPINA"

- `club` (String): Club actual
  - **Tipo:** String
  - **Formato:** "Club Name (COUNTRY_CODE)"
  - **Ejemplo:** "FC Bayern München (GER)"

- `estatura` (Number): Altura en centímetros
  - **Tipo:** Integer
  - **Rango:** Típicamente 160-210
  - **Ejemplo:** 180

- `peso` (Number): Peso en kilogramos
  - **Tipo:** Integer
  - **Rango:** Típicamente 60-100
  - **Ejemplo:** 75

**Índices candidatos:**
- Compound en `team` + `numero` (única combinación por equipo)
- Simple en `estatura` (para R8, R10)

**Cantidad estimada:** ~500-600 (23-25 jugadores × ~23 equipos)
**Crecimiento:** Finito (torneo específico)

---

### 3. Colección: `partidos`

**Propósito:** Registro de partidos disputados.

**Estructura:**
```javascript
{
  _id: ObjectId,
  equipo1: String,           // "Colombia", "Poland"
  equipo2: String,           // "England", "Colombia"
  fecha: String,             // "26/07/18" (DD/MM/YY del SENA)
  hora: String               // "6:00:00 p. m." (formato SENA)
}
```

**Campos:**

- `equipo1` (String): Primer equipo
  - **Tipo:** String
  - **Ejemplo:** "Colombia"
  - **Relación:** Denormalizado

- `equipo2` (String): Segundo equipo
  - **Tipo:** String
  - **Ejemplo:** "England"
  - **Relación:** Denormalizado

- `fecha` (String): Fecha del partido
  - **Tipo:** String
  - **Formato:** DD/MM/YY (del SENA)
  - **Ejemplo:** "26/07/18"
  - **Nota:** String preserva fidelidad con datos SENA

- `hora` (String): Hora del partido
  - **Tipo:** String
  - **Formato:** HH:MM:SS a. m./p. m. (del SENA)
  - **Ejemplo:** "6:00:00 p. m."
  - **Nota:** String preserva formato exacto del SENA

**Índices candidatos:**
- Compound en `equipo1` + `equipo2` + `fecha` (unicidad semántica)
- Simple en `fecha` (para búsquedas por rango)

**Cantidad estimada:** ~64 (partidos de grupo + knockout)
**Crecimiento:** Finito (torneo específico)

---

## Decisiones de Modelado

### Decisión 1: Desnormalización de Nombres de Equipos

**Pregunta:** ¿Almacenar `team: "Colombia"` o `teamRef: ObjectId`?

**Decisión:** Desnormalizar → `team: "Colombia"`

**Razones:**
- Simplifica queries (sin `lookup`)
- Datos SENA ya están desnormalizados
- No hay actualizaciones masivas de nombres
- R7 es query simple, no join

**Riesgo:** Inconsistencia si "Colombia" se escribe distinto
**Mitigación:** Validación en seed (R2)

### Decisión 2: Fechas y Horas Como String

**Pregunta:** ¿Almacenar fechas y horas como Date, String, o Timestamp?

**Decisión:** Ambas como String (formato original SENA)

**Razones:**
- Preserva fidelidad con datos suministrados por SENA
- Facilita trazabilidad directa (datos = especificación)
- Fácil lectura y debugging en mongosh
- Suficiente para operaciones académicas (sin cálculos de duración complejos)

**Formato:**
- `fechaNacimiento`: "DD.MM.YYYY" (ej: "12.07.1991")
- `fecha` (partidos): "DD/MM/YY" (ej: "26/07/18")
- `hora`: "HH:MM:SS a. m./p. m." (ej: "6:00:00 p. m.")

**Nota:** Una aplicación productiva podría normalizar a BSON Date, pero para este taller académico la fidelidad es prioritaria.

### Decisión 3: Posición Como String Corto

**Pregunta:** ¿Posición como enum o String?

**Decisión:** String ("CM", "GK", "FW")

**Razones:**
- Flexible para posiciones no estándar
- No requiere enumeración en schema
- R7 filtra por posición sin complicaciones

**Alternativa rechazada:** ObjectId → colección `posiciones`
**Razón:** Sobreingeniería para datos simples

### Decisión 4: Sin Subcampos Anidados

**Pregunta:** ¿Anidar biometría del jugador?
```javascript
// Opción A: Anidada
{
  nombre: "...",
  biometria: {
    estatura: 180,
    peso: 75,
    fechaNacimiento: ...
  }
}

// Opción B: Plana (ELEGIDA)
{
  nombre: "...",
  estatura: 180,
  peso: 75,
  fechaNacimiento: ...
}
```

**Decisión:** Plana (Opción B)

**Razones:**
- R8 filtra por `estatura` directamente
- No hay lógica que agrupe biometría
- Simplifica queries y validación

---

## Ventajas del Modelo

✅ **Simplicidad**
- Estructuras planas, sin nesting
- Queries directas sin agregación compleja

✅ **Rendimiento**
- R7, R8, R9 son búsquedas simples
- R10 es agregación sobre un campo

✅ **Flexibilidad**
- Agregar campos opcionales sin migración
- Equipos no necesitan estructura idéntica

✅ **Alineación con SENA**
- Datos suministrados son autocontenidos
- No inventa relaciones artificiales

---

## Riesgos Identificados

⚠️ **Inconsistencia de Nombres**
- Si "Colombia" se escribe como "COLOMBIA", queries fallan
- **Mitigación:** Validación strict en R2

⚠️ **Duplicación de Datos**
- Nombre de equipo repetido en múltiples documentos
- **Mitigación:** Aceptable para datos finitos y no actualizables

⚠️ **Sin Validación de Foreign Keys**
- MongoDB no aplica FK automáticas
- Ej: Insertar jugador de equipo inexistente es posible
- **Mitigación:** Validación en código de R2

⚠️ **Campos Opcionales Sin Esquema**
- Un jugador podría carecer de peso/estatura
- **Mitigación:** R2 asegura datos completos; valida antes de R8/R10

---

## Escalabilidad

### Horizontal (Sharding)
**Posible por:** `team` como shard key
**Viabilidad:** Distribución uniforme entre equipos
**Aplicación:** No requerida para este taller

### Vertical (Crecimiento)
- Máximo ~600 jugadores (no crece)
- Máximo ~64 partidos (no crece)
- Índices simples suficientes

---

## Validación del Modelo

Este modelo será validado antes de implementar R2 mediante:

1. **Estructura:** ¿Todos los campos presentes en especificación?
2. **Tipos:** ¿Date vs String vs Number correctos?
3. **Integridad:** ¿Datos sin duplicados (team+numero)?
4. **Completitud:** ¿Todos los datos SENA representados?
5. **Queries:** ¿R7-R10 ejecutables sin modificación?

Si la validación descubre inconsistencias, se ajusta el modelo antes de R2.

---

## Conclusión

El modelo propuesto:
- ✅ Es documental (no relacional disfrazado)
- ✅ Respeta datos SENA (incluye campo `id`, fechas en formato original, nombres exactos)
- ✅ Simplifica queries R7-R10
- ✅ Es apropiado para MongoDB
- ✅ Es académicamente reproducible

**Estado:** Modelo preliminar revisado y listo para implementación. Validación ejecutable mediante MongoDB en fase de implementación (R1-R10).

---

**Versión:** 1.0  
**Fecha:** 2026-09-27  
**Validado por:** Análisis previo a implementación
