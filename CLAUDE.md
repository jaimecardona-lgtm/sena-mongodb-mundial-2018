# CLAUDE.md: Instrucciones Técnicas Para Claude Code

## Contexto

Este repositorio es un taller académico del SENA: **Desarrollo Backend con Node.js y MongoDB**.

Evidencia: **AA1-EV02 — Taller de consultas en base de datos NoSQL**

Propósito: Diseñar e implementar un modelo de almacenamiento documental en MongoDB que integre datos de la Copa Mundial FIFA Rusia 2018.

Enfoque: **Académico, reproducible, profesional.**

---

## Objetivo Técnico

1. Crear un modelo de datos MongoDB apropiado para datos heterogéneos (equipos, jugadores, partidos)
2. Implementar operaciones CRUD: CREATE (R1-R2), READ (R7-R10), UPDATE (R3, R5), DELETE (R6)
3. Validar que cada operación cumpla exactamente con su especificación R1-R10
4. Mantener trazabilidad clara: cada script debe corresponder a un requerimiento específico
5. Generar evidencia reproducible y verificable

---

## Alcance

### ✅ INCLUIR
- Colecciones MongoDB (equipos, jugadores, partidos)
- Scripts JavaScript para mongosh
- Datos de prueba (Colombia, Japón)
- Validación mediante protocolo QA
- Documentación de decisiones
- Casos límite (ej: empates en R10)

### ❌ NO INCLUIR (aún)
- APIs REST
- Express.js
- Frontend / React
- Autenticación / JWT
- Docker
- Servicios cloud
- CI/CD
- Índices complejos innecesarios
- Normalización relacional disfrazada

---

## Convenciones del Repositorio

### Estructura de Archivos

```
mongodb/
├── R1-colecciones.js     # DDL: crear colecciones y estructura
├── R2-seed.js            # INSERT: datos de prueba
├── R3-update-james.js    # UPDATE: James Rodríguez
├── R4-insert-partido.js  # INSERT: partido Colombia-England
├── R5-update-partido.js  # UPDATE: hora de partido Poland-Colombia
├── R6-delete-partido.js  # DELETE: eliminar partido R4
├── R7-query-japon.js     # FIND: jugadores Japón
├── R8-query-altura.js    # FIND: jugadores altura < 170 cm
├── R9-query-partidos.js  # FIND: todos los partidos
└── R10-query-max-height.js # AGGREGATE: altura máxima
```

**Regla:** Cada archivo = un requerimiento. No mezclar.

### Convenciones de Código

**Idioma:** Los comentarios y nombres en el código pueden estar en inglés (convención técnica) o español (contexto académico). Ser consistente dentro de cada archivo.

**Formato:**
```javascript
// R3: Actualizar James Rodríguez
// Especificación: docs/knowledge/01-requerimientos.md > R3

use("mundial2018");

const result = db.jugadores.updateOne(
  { nombre: "James Rodríguez" },
  {
    $set: {
      nombreCamiseta: "RODRÍGUEZ",
      club: "Real Madrid CF (ESP)"
    }
  }
);

console.log("Documentos modificados:", result.modifiedCount);
```

**Estructura de archivo:**
1. Comentario de requerimiento (qué número y qué hace)
2. Referencia a documentación
3. Seleccionar base de datos (`use()`)
4. Código MongoDB
5. Validación / salida

### Comentarios

- Explicar **por qué**, no qué
- Indicar número de requerimiento
- Referencia a `01-requerimientos.md` cuando sea complejo
- NO comentar código obvio

Ejemplo ✅:
```javascript
// R10 debe manejar empates: si múltiples jugadores tienen
// la misma altura máxima, retornar todos.
// Por eso usamos $max en aggregation.
```

Ejemplo ❌:
```javascript
// Encontrar el máximo
db.collection.aggregate([])
```

### Validación

Cada script debe incluir al final validación implícita o explícita:

```javascript
// R3: Update James
const result = db.jugadores.updateOne(...);
console.log("Status:", result.modifiedCount === 1 ? "OK" : "FAILED");

// Si se requiere verificación:
const james = db.jugadores.findOne({ nombre: "James Rodríguez" });
console.log("Club actualizado:", james.club === "Real Madrid CF (ESP)");
```

---

## Política de Cambios

### Cuando Modificar Documentación

✅ **OK si:**
- Clarificar especificaciones sin cambiar requerimientos
- Agregar aclaraciones sobre datos SENA
- Actualizar estado de progreso
- Documentar decisiones técnicas
- Corregir enlaces rotos

❌ **NO si:**
- Cambias el alcance de un requerimiento
- Ignoras datos suministrados por el SENA
- Modifica especificaciones para "simplificar"
- Eliminas requerimientos sin justificación

### Cuando Modificar Código

✅ **OK si:**
- Implementas una nueva R (R1-R10)
- Fixes un bug verificado
- Cambio alineado con validación QA

❌ **NO si:**
- Cambias estructura sin actualizar documentación
- Añades código que no tiene requerimiento asociado
- Modifica datos sin documentar por qué

### Datos SENA

**Los datos suministrados por el SENA tienen autoridad absoluta.**

Si encuentras:
- Discrepancia entre requerimiento y datos
- Falta de información para una R
- Ambigüedad en cómo interpretar datos

**Acción:** Reportar en lugar de "corregir" arbitrariamente.

---

## Flujo Esperado

Este es el flujo que debes seguir al trabajar en el proyecto:

```
Requerimiento (R1-R10)
          ↓
    ANÁLISIS
  - Leer especificación completa
  - Revisar datos SENA relevantes
  - Identificar complejidades
  - Documentar supuestos
          ↓
 IMPLEMENTACIÓN
  - Escribir script MongoDB
  - Agregar comentarios explicativos
  - Seguir convenciones de código
          ↓
    VALIDACIÓN
  - Ejecutar en mongosh
  - Verificar contra 04-validacion.md
  - Comparar before/after para updates
  - Probar casos límite
          ↓
      EVIDENCIA
  - Captura de pantalla de ejecución
  - Guardar en evidence/screenshots/
  - Documentar resultado
          ↓
    TRAZABILIDAD
  - Marcar requerimiento como COMPLETADO
  - Actualizar tabla en 01-requerimientos.md
```

---

## Validación

### Antes de Afirmar "Funciona"

No es suficiente que el código no tenga errores. Debes:

1. **Ejecutar en mongosh:** `load("mongodb/Rx-*.js")`
2. **Verificar salida:** ¿Es lo que esperaba?
3. **Comparar especificación:** ¿Cumple exactamente?
4. **Casos límite:** ¿Qué pasaría con...?
5. **Reproducir:** ¿Funciona desde estado limpio?

### Protocolo QA

Ver `docs/knowledge/04-validacion.md`.

Mínimamente debe validarse:
- Colecciones existen después de R1
- Conteo de documentos después de R2
- James tiene los campos correctos después de R3
- Partido Colombia-England existe después de R4
- Hora de Poland-Colombia es correcta después de R5
- Partido está eliminado después de R6
- Jugadores Japón devuelven campos correctos en R7
- Jugadores con altura < 170 en R8
- Partidos en R9
- Altura máxima y empates en R10

---

## Restricciones

### NO HAGAS
- ❌ Implementar R1-R10 sin leer esta documentación
- ❌ Crear datos ficticios fuera de los suministrados SENA
- ❌ Hacer commit sin autorización explícita
- ❌ Hacer push sin autorización explícita
- ❌ Cambiar de rama sin documentar
- ❌ Eliminar código/datos sin justificación

### SIEMPRE HACER
- ✅ Leer requerimiento completo antes de implementar
- ✅ Validar que datos existen en fuentes SENA
- ✅ Ejecutar y verificar en mongosh
- ✅ Documentar cambios no obvios
- ✅ Mantener trazabilidad R1-R10 visible
- ✅ Reportar problemas en lugar de silenciar

---

## Trazabilidad Contra la Rúbrica

La rúbrica SENA evalúa:

| R | Descripción | Peso | Validación |
|---|---|---|---|
| R1 | Colecciones | 20% | Archivo `R1-colecciones.js`, estructura en `02-modelo-datos.md` |
| R2 | Seed | 20% | Archivo `R2-seed.js`, validación en `04-validacion.md` |
| R3 | Update James | 10% | Archivo `R3-update-james.js`, before/after documentado |
| R4 | Insert partido | 5% | Archivo `R4-insert-partido.js`, validación de existencia |
| R5 | Update partido | 10% | Archivo `R5-update-partido.js`, comparación tiempo |
| R6 | Delete partido | 10% | Archivo `R6-delete-partido.js`, validación de no-existencia |
| R7 | Query Japón | 5% | Archivo `R7-query-japon.js`, campos correctos |
| R8 | Query altura < 170 | 5% | Archivo `R8-query-altura.js`, filtro verificado |
| R9 | Query partidos | 5% | Archivo `R9-query-partidos.js`, conteo completo |
| R10 | Query altura máxima | 10% | Archivo `R10-query-max-height.js`, empates incluidos |

**Cada archivo debe poder rastrearse directamente a su requerimiento.**

---

## Cómo Pedir Ayuda o Reportar Problemas

Si encuentras:

- **Ambigüedad en R:** Reportar con análisis de alternativas
- **Datos faltantes:** Documentar qué falta y de dónde debería venir
- **Imposibilidad técnica:** Explicar por qué no es viable
- **Conflicto entre Rs:** Señalar conflicto y sugerir resolución

**No:** Ignorar el problema y asumir.

---

## Herramientas

### Para Desarrollar

```bash
# Conectar a MongoDB (local o remoto)
mongosh "mongodb://localhost:27017/mundial2018"

# Dentro de mongosh:
load("mongodb/R1-colecciones.js")
load("mongodb/R2-seed.js")
# ... etc
```

### Para Validar

```bash
# Estado del repositorio
git status

# Cambios pendientes
git diff

# Commits recientes
git log --oneline -10
```

### Para Documentar

- Markdown para documentación
- Comentarios inline en scripts
- Tablas para trazabilidad

---

## Ejemplos de Buen Trabajo

✅ Un buen commit:
```
R3: Actualizar registro de James Rodríguez

- Actualiza nombreCamiseta: "JAMES" → "RODRÍGUEZ"
- Actualiza club: "FC Bayern München" → "Real Madrid CF (ESP)"
- Campos restantes sin modificación (nombre, equipo, número, etc.)
- Validado: 1 documento modificado, valores verificados
```

✅ Un buen script:
```javascript
// R7: Consultar jugadores del equipo Japón
// Especificación: docs/knowledge/01-requerimientos.md > R7

use("mundial2018");

const jugadoresJapon = db.jugadores
  .find({ team: "Japón" })
  .projection({
    nombre: 1,
    fechaNacimiento: 1,
    posicion: 1,
    club: 1
  })
  .toArray();

console.log("Jugadores de Japón:", jugadoresJapon.length);
jugadoresJapon.forEach(j => {
  console.log(`- ${j.nombre} (${j.posicion}), Club: ${j.club}`);
});
```

---

## Estado Actual

**Fase:** Foundation (completada)
- ✅ Documentación estructural
- ✅ Modelo de datos propuesto
- ✅ Protocolo QA definido
- ⏳ Implementación R1-R10

**Próximo paso:** Implementar scripts en `mongodb/` siguiendo este flujo.

---

## Actualizaciones a Este Documento

Este documento es de referencia viva. Si encuentras algo:
- Ambiguo
- Incompleto
- Conflictivo

Reporta para actualizar.

---

**Versión:** 1.0  
**Fecha:** 2026-09-27  
**Aplica a:** Claude Code cuando trabaja en este repositorio
