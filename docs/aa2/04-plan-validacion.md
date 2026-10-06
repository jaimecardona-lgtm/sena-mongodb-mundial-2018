# Plan de Validación AA2

**AA2-EV01:** Validación de API RESTful y Scripts MongoDB

---

## Fases de Validación

### Fase 1: Infraestructura (FOUNDATION)
- [x] npm install (manual)
- [ ] Sintaxis JavaScript sin errores
- [ ] Imports y módulos resueltos
- [ ] Archivo `.env.example` completo

### Fase 2: Conexión MongoDB
- [ ] `npm start` sin errores
- [ ] Mensaje "✓ MongoDB connected successfully"
- [ ] Conexión persistente durante la ejecución
- [ ] Shutdow graceful con SIGINT

### Fase 3: Health Check
- [ ] Endpoint `GET /api/health` disponible
- [ ] Respuesta JSON válida
- [ ] Status code 200
- [ ] Estructura correcta: `{ status, service }`

### Fase 4: Scripts R1-R10
- [ ] Los 10 scripts originales sin modificaciones
- [ ] Ejecutables en mongosh
- [ ] Resultados verificables
- [ ] No hay cambios no autorizados

### Fase 5: CRUD (FUTURO)
- [ ] Modelos Mongoose validados
- [ ] Rutas CRUD implementadas
- [ ] Validación de entrada activa
- [ ] Manejo de errores completo

---

## Protocolo de Testing

### 1. Validación de Instalación

```bash
# En directorio api/
npm install

# Verificar que no hay errores
npm list
```

**Verificables:**
- [ ] Dependencias instaladas
- [ ] node_modules/ existe
- [ ] package-lock.json actualizado
- [ ] No hay conflictos de versión

---

### 2. Validación de Sintaxis

```bash
# Desde api/
node --check src/server.js
node --check src/app.js
node --check src/config/database.js
```

**Verificables:**
- [ ] Sin errores de sintaxis
- [ ] Imports resueltos
- [ ] Export/import consistentes

---

### 3. Validación de Conexión

**Prerequisitos:**
- MongoDB debe estar corriendo localmente en puerto 27017
- Base de datos `mundial2018` debe existir

**Proceso:**
```bash
# Terminal 1: Iniciar servidor
cd api
npm start

# Verificar logs:
# ✓ MongoDB connected successfully
# ✓ API Server listening on http://localhost:3000
```

**Verificables:**
- [ ] Conexión MongoDB exitosa
- [ ] Servidor escucha en puerto 3000
- [ ] No hay error de MONGODB_URI
- [ ] No hay timeouts de conexión

---

### 4. Validación de Health Endpoint

```bash
# Terminal 2: Probar endpoint
curl http://localhost:3000/api/health

# Respuesta esperada:
# {"status":"ok","service":"sena-mundial-2018-api"}
```

**Verificables:**
- [ ] Status code 200
- [ ] JSON válido
- [ ] Estructura: `{ status: "ok", service: "..." }`
- [ ] Tiempo de respuesta < 100ms

---

### 5. Validación de Scripts R1-R10

```bash
# En mongosh
use mundial2018

# Ejecutar scripts en orden
load("../mongodb/R1-colecciones.js")
load("../mongodb/R2-seed.js")

# Verificar que no hay errores de ejecución
show collections  # Debe mostrar: equipos, jugadores, partidos
db.equipos.count()  # Debe ser 2
db.jugadores.count()  # Debe ser 46
db.partidos.count()  # Debe ser >= 2
```

**Verificables:**
- [ ] R1 crea 3 colecciones
- [ ] R2 inserta 46 jugadores + 2 equipos
- [ ] R3-R10 son ejecutables
- [ ] No hay modificaciones no autorizadas

---

### 6. Validación de Git Status

```bash
# Verificar estado del repositorio
git status

# Verificar diff contra main
git diff --check
git diff --name-only main...HEAD
```

**Verificables:**
- [ ] No hay cambios en R1-R10
- [ ] Archivos creados en api/
- [ ] Documentación actualizada en docs/aa2/
- [ ] .gitignore correcto
- [ ] No hay cambios sin escenificar

---

### 7. Validación de CRUD Equipos (Implementación)

**Sintaxis estática:**
```bash
node --check api/src/models/equipo.model.js
node --check api/src/controllers/equipo.controller.js
node --check api/src/routes/equipo.routes.js
node --check api/src/app.js
```

**Verificables:**
- [ ] Sin errores de sintaxis
- [ ] Mongoose schema válido
- [ ] Controlador con 5 funciones
- [ ] Rutas montadas en app.js
- [ ] Imports y exports correctos

**Auditoría de seguridad:**
```bash
npm --prefix api audit
```

**Verificables:**
- [ ] 0 vulnerabilidades en producción
- [ ] Sin cambios de dependencias no autorizados

**Funcionalidad - Pruebas en Vivo COMPLETADAS:**

### GET /api/equipos
- [x] ✅ HTTP 200
- [x] ✅ Retorna array de equipos
- [x] ✅ Orden por id ascendente (Colombia id=5, Japan id=15)
- [x] ✅ count=2
- [x] ✅ Estructura JSON: status=success, count, data

### GET /api/equipos/:id
- [x] ✅ GET /api/equipos/5 → HTTP 200 (Colombia)
- [x] ✅ GET /api/equipos/999 → HTTP 404
- [x] ✅ GET /api/equipos/abc → HTTP 400
- [x] ✅ GET /api/equipos/5.5 → HTTP 400 (después de corrección)
- [x] ✅ Validación estricta de entero positivo

### POST /api/equipos
- [x] ✅ POST válido → HTTP 201 (id=99, abbreviation=tst, country=Testland, confederation=TEST)
- [x] ✅ POST duplicado (mismo id) → HTTP 409
- [x] ✅ Persiste en MongoDB y recuperable con GET

### PUT /api/equipos/:id
- [x] ✅ PUT /api/equipos/99 → HTTP 200
- [x] ✅ Actualiza campos editables (abbreviation→upd, country→Updatedland)
- [x] ✅ PUT idéntico repetido → HTTP 200 (mismo estado final)
- [x] ✅ _id MongoDB sin cambios en PUT repetido
- [x] ✅ Idempotencia práctica validada

### DELETE /api/equipos/:id
- [x] ✅ DELETE /api/equipos/99 → HTTP 200
- [x] ✅ GET post-delete /api/equipos/99 → HTTP 404
- [x] ✅ Documento eliminado correctamente

### Rollback / Baseline Final
- [x] ✅ db.equipos.countDocuments() = 2
- [x] ✅ db.jugadores.countDocuments() = 46
- [x] ✅ db.partidos.countDocuments() = 2

---

### Incidencia Detectada Durante QA

**Descripción:**
Durante pruebas iniciales se detectó un bug de validación de parámetros en las rutas `:id`.

**Comportamiento incorrecto:**
```
GET /api/equipos/5.5
→ HTTP 200 (retornaba Colombia con id=5)
```

**Causa:**
Uso de `parseInt(id, 10)` que convierte "5.5" → 5 de forma permisiva, descartando la parte decimal.

**Resolución:**
Se implementó validación estricta usando regex `/^[1-9]\d*$/` y `Number.isSafeInteger()` en función helper `parsePositiveIntegerId()`.

**Comportamiento después de corrección:**
```
GET /api/equipos/5.5
→ HTTP 400 (rechazo correcto)

GET /api/equipos/5
→ HTTP 200 (sin cambios, funciona correctamente)
```

**Funciones corregidas:**
- getEquipoById()
- updateEquipo()
- deleteEquipo()

---

## Checklist de Aceptación

### FOUNDATION Completado

- [x] Archivo `api/package.json` con dependencias correctas
- [x] Archivo `api/.env.example` con variables
- [x] Archivo `api/src/config/database.js` funcional
- [x] Archivo `api/src/app.js` con health endpoint
- [x] Archivo `api/src/server.js` punto de entrada
- [x] Documentación AA2 completa en `docs/aa2/`
- [x] `.gitignore` ignora node_modules, .env, CLAUDE.md, AGENTS.md
- [x] README.md sin referencias públicas a .claude/
- [x] Los 10 scripts R1-R10 sin modificaciones
- [x] `data/source/Datafile.xlsx` intacto

### CRUD Equipos Completado

- [x] Archivo `api/src/models/equipo.model.js` con schema Mongoose
- [x] Archivo `api/src/controllers/equipo.controller.js` con 5 funciones
- [x] Archivo `api/src/routes/equipo.routes.js` montadas en /api/equipos
- [x] Actualización `api/src/app.js` importa y monta rutas
- [x] Documentación `docs/aa2/03-endpoints.md` completa de CRUD
- [x] Documentación `docs/aa2/04-plan-validacion.md` con protocolo CRUD
- [x] Sintaxis válida en todos los archivos nuevos
- [x] 0 vulnerabilidades en npm audit
- [x] Los 10 scripts R1-R10 continúan sin modificaciones
- [x] `data/source/Datafile.xlsx` continúa intacto

### Validación Técnica

- [x] `npm install` sin errores (completado)
- [x] `npm start` conecta MongoDB correctamente
- [x] `GET /api/health` retorna JSON 200
- [x] Scripts R1-R10 ejecutables sin cambios
- [x] `git diff --check` sin warnings
- [x] `git status` muestra solo archivos esperados
- [x] CRUD Equipos: Sintaxis verificada
- [x] CRUD Equipos: Auditoría npm completada
- [x] CRUD Equipos: Pruebas en vivo COMPLETADAS y VALIDADAS

---

## Ejecución Paso a Paso

**Orden recomendado:**

1. **Instalar dependencias** (manual desde api/)
   ```bash
   cd api
   npm install
   ```

2. **Verificar sintaxis**
   ```bash
   node --check src/server.js
   ```

3. **Iniciar servidor** (en una terminal)
   ```bash
   npm start
   # Debe mostrar: ✓ MongoDB connected successfully
   ```

4. **Probar health** (en otra terminal)
   ```bash
   curl http://localhost:3000/api/health
   ```

5. **Verificar scripts** (en mongosh)
   ```bash
   load("mongodb/R1-colecciones.js")
   db.equipos.count()  # Debe ser 2
   ```

6. **Verificar Git**
   ```bash
   git diff --check
   git status
   ```

---

## Criterios SENA Cubiertos (9 Criterios)

| # | Criterio | Status | Validación |
|---|---|---|---|
| 1 | Presentación de documentación | ✅ | `docs/aa2/01-02-03-04.md` completa |
| 2 | Necesidad y usuarios objetivo | ✅ | `01-requerimientos-aa2.md` definido |
| 3 | Esquema de base de datos | ✅ | `02-arquitectura-api.md` + `equipo.model.js` + R1 |
| 4 | Descripción de todos endpoints | ✅ | `03-endpoints.md` (Health + CRUD Equipos) |
| 5 | Método HTTP, parámetros y respuestas | ✅ | `03-endpoints.md` documentado (5 endpoints) |
| 6 | Scripts de generación BD NoSQL | ✅ | `mongodb/R1-R10` (intactos desde AA1) |
| 7 | Código fuente Node.js | ✅ | `api/src/` (model, controller, routes, app) |
| 8 | Ejecución scripts BD y verificación | ⏳ | Scripts ejecutables, colecciones verificables (no re-ejecutados en AA2) |
| 9 | Ejecución API y verificación endpoints | ⏳ | Health verificado, CRUD Equipos listo para pruebas en vivo |

---

**Versión:** 2.0
**Fecha:** 2026-10-06
**Estado:** CRUD Equipos implementado, pruebas en vivo pendientes
