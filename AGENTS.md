# Instrucciones para Agentes

Este documento establece pautas no negociables para cualquier agente que trabaje en este repositorio.

## Lectura Obligatoria Previa

**Antes de modificar cualquier aspecto del proyecto, leer en orden:**

1. [README.md](./README.md) — Contexto general
2. [CLAUDE.md](./CLAUDE.md) — Convenciones técnicas
3. [docs/knowledge/01-requerimientos.md](./docs/knowledge/01-requerimientos.md) — Especificación oficial SENA
4. [docs/knowledge/02-modelo-datos.md](./docs/knowledge/02-modelo-datos.md) — Decisiones de modelado
5. [docs/knowledge/03-mapeo-evidencia.md](./docs/knowledge/03-mapeo-evidencia.md) — Trazabilidad R1-R10
6. [docs/knowledge/04-validacion.md](./docs/knowledge/04-validacion.md) — Protocolo QA

No es opcional. Los cambios que ignoren este contexto serán rechazados.

## Principios Fundamentales

### 1. No Inventar Registros
Los datos provienen **únicamente** del SENA. Ningún jugador, equipo, partido o confederación puede ser fabricado.

**Aplicar:** Antes de insertar cualquier dato, verificar que existe en los documentos oficiales SENA.

### 2. Los Datos Suministrados Son la Fuente de Verdad
Los datos del SENA tienen autoridad absoluta. Si detectas una inconsistencia entre el requerimiento y los datos, **reportar, no corregir arbitrariamente**.

**Aplicar:** Reportar en el commit message y en los comentarios de código cualquier discrepancia encontrada.

### 3. No Alterar Requerimientos Para Simplificar
Cada requerimiento R1-R10 debe cumplirse **exactamente como fue especificado**, aunque resulte más complejo de lo ideal.

**Aplicar:** Si la especificación parece ambigua o problemática, clarificar antes de implementar. Buscar soluciones que respeten la letra.

### 4. Mantener Trazabilidad Clara R1-R10
Cada archivo de código **debe ser unívocamente rastreable** a un requerimiento específico.

**Aplicar:** 
- Archivo `R3-update-james.js` → R3
- Archivo `R7-query-japon.js` → R7
- No mezclar requerimientos en un mismo archivo
- Comentarios explícitos indicando qué requerimiento se implementa

### 5. Validar Código Antes de Afirmar Que Funciona
"El código no tiene errores visuales" ≠ "El código funciona correctamente".

**Aplicar:**
- Ejecutar scripts en mongosh
- Verificar resultados contra `04-validacion.md`
- Comparar antes/después para updates
- Validar conteos de registros
- Probar casos límite (R10 con empates, etc.)

### 6. No Agregar Dependencias Sin Necesidad
MongoDB y mongosh son suficientes. Node.js solo si aporta valor real para ejecución o validación.

**Aplicar:**
- No instalar npm packages innecesariamente
- Justificar explícitamente cualquier nueva dependencia
- Mantener el proyecto compacto y académico

### 7. Evitar Sobreingeniería
Este es un taller académico, no una aplicación de producción.

**No hacer:**
- Normalización relacional disfrazada de MongoDB
- Índices complejos innecesarios
- Agregaciones complicadas cuando una consulta simple funciona
- Patrones de microservicios
- Abstracción prematura

**Hacer:**
- Soluciones directas que funcionen
- Código legible y mantenible
- Documentación clara sobre *por qué* se hizo así

### 8. Mantener MongoDB Como Tecnología Central
Este proyecto es **sobre MongoDB**, no sobre generar artifacts con otras tecnologías.

**Aplicar:**
- Todos los scripts son JavaScript para mongosh
- Validación puede ser Node.js si agrega claridad
- No crear APIs, frontends, ni capas innecesarias

### 9. No Modificar Datos Académicos Silenciosamente
Si detectas que una fecha, número, nombre o posición del SENA es diferente a lo documentado, **reportar inmediatamente**.

**Aplicar:**
- Antes de usar datos, validar contra fuente original SENA
- Documentar cualquier corrección en el commit
- No asumir que "se parece lo suficiente"

### 10. Reportar Inconsistencias en Lugar de Corregirlas Arbitrariamente
Conflictos entre requerimientos, datos, o especificaciones → escaladas, no parches.

**Aplicar:**
- Si R3 pide actualizar un campo que no existe, reportar
- Si los datos de Japón parecen incompletos, reportar
- Si hay ambigüedad en R10 (¿qué hacer con empates?), reportar

### 11. No Hacer Commit o Push Sin Autorización Explícita
Los commits y pushes son responsabilidad del usuario. El agente puede preparar cambios pero no debe ejecutarlos.

**Aplicar:**
- Siempre decir: "Cambios listos. ¿Confirmas commit?"
- Mostrar `git status` y diff antes de cualquier commit
- Mencionar explícitamente si hay cambios no staged
- Esperar confirmación antes de hacer push

### 12. Mantener el Repositorio Limpio
No commitear archivos temporales, salida de tests, logs, o configuraciones locales.

**Aplicar:**
- Usar `.gitignore` correctamente
- No agregar secretos, credenciales, o datos personales
- Limpiar artifacts temporales después de validación

## Flujo de Trabajo

### Para Implementar un Requerimiento

1. **Leer especificación** en `01-requerimientos.md`
2. **Entender contexto** en README y CLAUDE.md
3. **Diseñar solución** alineada con modelo de datos
4. **Implementar script** en `mongodb/Rx-*.js`
5. **Validar ejecución** en mongosh
6. **Validar resultados** contra `04-validacion.md`
7. **Documentar** en comentarios inline
8. **Reportar estado** en tabla de requerimientos

### Para Modificar Documentación

1. **Leer documento actual** completamente
2. **Entender contexto** y referencias internas
3. **Hacer cambios** manteniendo estructura
4. **Validar links internos** (markdown)
5. **Revisar para coherencia** con otros documentos
6. **No alterar encabezados** sin actualizar índices

## Contra-Patrones

❌ **NO HACER:**
- Implementar R1-R10 si aún no has leído esta sección
- Crear datos ficticios "para probar"
- Cambiar especificaciones porque "son raras"
- Commitear sin validación funcional
- Agregar "solo una pequeña API" o "solo un pequeño frontend"
- Modificar el modelo de datos sin documentar por qué
- Eliminar código o datos sin justificación explícita
- Pushear a main sin aprobación

✅ **HACER:**
- Validar todo antes de reportar "funciona"
- Documentar decisiones explícitamente
- Mantener trazabilidad R1-R10 visible
- Comunicar ambigüedades antes de decidir
- Respetar la autoridad de los datos SENA
- Mantener el código legible y simple

## Escaladas

Si encuentras:

- Ambigüedad en un requerimiento
- Datos inconsistentes en fuentes SENA
- Impossibilidad técnica de cumplir una especificación
- Conflicto entre requerimientos
- Falta de información para implementar

**Reportar inmediatamente** en lugar de asumir.

## Control de Cambios

Todos los cambios deben ser:

1. **Trazables:** Asociados a un requerimiento o sección específica
2. **Justificados:** Comentario explicando por qué
3. **Validados:** Probados y comparados contra especificación
4. **Documentados:** Reflejados en documentación relevante

---

**Versión:** 1.0  
**Fecha:** 2026-09-27  
**Aplica a:** Todos los agentes que modifiquen este repositorio
