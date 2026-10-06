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

## Checklist de Aceptación

### FOUNDATION Completado

- [ ] Archivo `api/package.json` con dependencias correctas
- [ ] Archivo `api/.env.example` con variables
- [ ] Archivo `api/src/config/database.js` funcional
- [ ] Archivo `api/src/app.js` con health endpoint
- [ ] Archivo `api/src/server.js` punto de entrada
- [ ] Documentación AA2 completa en `docs/aa2/`
- [ ] `.gitignore` ignora node_modules, .env, CLAUDE.md, AGENTS.md
- [ ] README.md sin referencias públicas a .claude/
- [ ] Los 10 scripts R1-R10 sin modificaciones
- [ ] `data/source/Datafile.xlsx` intacto

### Validación Técnica

- [ ] `npm install` sin errores (manual)
- [ ] `npm start` conecta MongoDB correctamente
- [ ] `GET /api/health` retorna JSON 200
- [ ] Scripts R1-R10 ejecutables sin cambios
- [ ] `git diff --check` sin warnings
- [ ] `git status` muestra solo archivos esperados

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

## Criterios SENA Cubiertos

| # | Criterio | Status | Validación |
|---|---|---|---|
| 1 | Documentación | ✅ | `docs/aa2/*.md` |
| 2 | Usuarios objetivo | ✅ | `01-requerimientos-aa2.md` |
| 3 | Esquema BD | ✅ | `02-arquitectura-api.md` + R1 |
| 4 | Descripción endpoints | ✅ | `03-endpoints.md` |
| 5 | HTTP + parámetros | ✅ | `03-endpoints.md` |
| 6 | Respuestas JSON | ✅ | `/api/health` + ejemplos |
| 7 | Scripts MongoDB | ✅ | `mongodb/R1-R10` |
| 8 | Código Node.js | ✅ | `api/src/` |
| 9 | Ejecución verificable | ⏳ | npm start + curl |

---

**Versión:** 1.0  
**Fecha:** 2026-10-06  
**Estado:** Plan definido, validación en progress
