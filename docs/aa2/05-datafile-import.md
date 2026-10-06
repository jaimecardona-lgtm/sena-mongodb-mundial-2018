# Importador de Datafile.xlsx

**AA2-EV01:** Importación de datos completos desde Excel a MongoDB

---

## Objetivo

Transformar datos de la Copa Mundial FIFA 2018 desde el archivo Excel:

```
data/source/Datafile.xlsx
```

Hacia una base de datos MongoDB **completamente nueva**:

```
mongodb://127.0.0.1:27017/mundial2018_full
```

---

## Arquitectura de Bases de Datos

### Baseline Protegido: `mundial2018`

**Propósito académico:**
- Equipos: 2 (Colombia, Japan)
- Jugadores: 46 (solo de los 2 equipos)
- Partidos: 2 (iniciales del taller)

**Estatus:** INMUTABLE. No será modificado bajo ninguna circunstancia.

### Base Completa: `mundial2018_full`

**Propósito:** Datos completos para dashboard, frontend, o análisis posterior.

- Equipos: 32 (completo)
- Jugadores: 736 (todos los torneos)
- Partidos: 60 (todos los del torneo)

---

## Fuente de Datos

### Archivo Excel

```
data/source/Datafile.xlsx
```

### Hojas

| Hoja | Registros | Propósito |
|---|---|---|
| Teams | 32 | Equipos del torneo |
| Players | 736 | Jugadores de cada equipo |
| Matchs | 60 | Partidos del torneo |

### Conteos

```
Teams:    32
Players:  736 (23 por equipo)
Matchs:   60 (válidos)
```

---

## Mapeod de Columnas

### Teams → equipos

| Excel | API | Transformación |
|---|---|---|
| `id` | `id` | Number |
| `abbreviation` | `abbreviation` | String, trim, lowercase |
| `country` | `country` | String, trim |
| `Confederation` | `confederation` | String, trim, uppercase |

### Players → jugadores

| Excel | API | Transformación |
|---|---|---|
| `Team` | `team` | String, trim |
| `#` | `numero` | Number |
| `Pos.` | `posicion` | String, trim, uppercase |
| `FIFA Popular Name` | `nombre` | String, trim |
| `Birth Date` | `fechaNacimiento` | String, mantener DD.MM.YYYY |
| `Shirt Name` | `nombreCamiseta` | String, trim |
| `Club` | `club` | String, trim |
| `Height` | `estatura` | Number |
| `Weight` | `peso` | Number |

### Matchs → partidos

| Excel | API | Transformación |
|---|---|---|
| `Team 1` | `equipo1` | String, trim |
| `Team 2` | `equipo2` | String, trim |
| `Date` | `fecha` | datetime → DD/MM/YY |
| `Time` | `hora` | time (24h) → H:MM:SS a./p. m. |

---

## Transformaciones Especiales

### Fecha (Date)

Conversión de datetime Excel a formato de cadena:

```javascript
2018-07-11 00:00:00  →  "11/07/18"
```

Función: `formatMatchDate(excelDate)`

### Hora (Time)

Conversión de formato 24h a formato SENA (12h con sufijo):

```javascript
06:30:00  →  "6:30:00 a. m."
18:00:00  →  "6:00:00 p. m."
12:00:00  →  "12:00:00 p. m."
00:00:00  →  "12:00:00 a. m."
```

Función: `formatMatchTime(excelTime)`

---

## Validaciones

### Estructurales

- ✅ Teams: 32 registros
- ✅ Players: 736 registros
- ✅ Matchs: 60 registros (válidos)

### Integridad

- ✅ Cada Player pertenece a un Team existente
- ✅ Cada Matchs equipo pertenece a un Team existente
- ✅ Team + numero único en Players
- ✅ Team1 ≠ Team2 en Matchs
- ✅ Sin campos requeridos nulos

### Formatos

- ✅ fechaNacimiento: DD.MM.YYYY
- ✅ fecha (partido): DD/MM/YY
- ✅ hora (partido): H:MM:SS a./p. m.

### Duplicados Semánticos

- ✅ Teams: id, abbreviation, country únicos
- ✅ Players: team+numero único
- ✅ Matchs: Team1+Team2+Date+Time único (considerando orden inverso de equipos)

---

## Modos de Ejecución

### Dry-Run

**Comando:**
```bash
npm --prefix api run import:datafile:dry
```

**Comportamiento:**
- Lee Excel
- Transforma datos
- Valida TODO
- Muestra resumen
- NO conecta a MongoDB
- NO modifica ninguna base

**Salida:**
```
========================================
DATAFILE IMPORT - DRY RUN
========================================

Teams: 32 OK
Players: 736 OK
Matchs: 60 OK

... (validaciones)
... (muestras transformadas)

========================================
DRY RUN SUCCESS
NO DATABASE CHANGES
========================================
```

### Write Mode

**Comando:**
```bash
npm --prefix api run import:datafile
```

**Requiere:**
```bash
$env:MONGODB_FULL_URI="mongodb://127.0.0.1:27017/mundial2018_full"
```

**Comportamiento:**
1. Lee Excel
2. Transforma y valida
3. Verifica `MONGODB_FULL_URI` existe
4. Verifica que apunte EXACTAMENTE a `mundial2018_full`
5. Conecta
6. deleteMany({}) en las 3 colecciones
7. insertMany teams, players, matchs
8. Valida conteos finales
9. Desconecta

**Seguridad:**
- NO usa `MONGODB_URI` (la conexión default)
- NO tiene fallback
- Aborta si no está `MONGODB_FULL_URI`
- Aborta si la URI no es exactamente `mundial2018_full`

---

## Idempotencia

Write mode es idempotente:

- Cada ejecución: deleteMany + insertMany
- Estado final siempre: 32/736/60
- Sin acumulación
- Sin duplicados entre ejecuciones

---

## Separación de Bases

```
┌─────────────────────────────────────────┐
│  mongodb://127.0.0.1:27017             │
├─────────────────────────────────────────┤
│                                         │
│  mundial2018 (BASELINE ACADÉMICO)       │
│  ├─ equipos: 2                          │
│  ├─ jugadores: 46                       │
│  └─ partidos: 2                         │
│  → INMUTABLE                            │
│                                         │
│  mundial2018_full (BASE COMPLETA)       │
│  ├─ equipos: 32                         │
│  ├─ jugadores: 736                      │
│  └─ partidos: 60                        │
│  → Generada por importador              │
│                                         │
└─────────────────────────────────────────┘
```

---

## Script Locations

```
api/src/scripts/import-datafile.js
```

Usa módulos ES con resolución relativa de rutas:

```javascript
import.meta.url
fileURLToPath()
path.dirname()
path.resolve()
```

---

## Instalación

La dependencia ya está instalada:

```bash
npm --prefix api install exceljs
```

---

## Próximas Fases

### No implementado aún

- [ ] Ejecución real de `--write`
- [ ] Creación de `mundial2018_full`
- [ ] Importación de datos
- [ ] Verificación en MongoDB
- [ ] Dashboard/Frontend

---

## Notas de Seguridad

1. **Baseline intacto:** `mundial2018` NO será tocado
2. **Nueva base:** `mundial2018_full` se crea desde cero
3. **Validación exhaustiva:** Todas las reglas antes de escribir
4. **Variable requere:** `MONGODB_FULL_URI` exigida en write mode
5. **Verificación de DB:** URI debe apuntar exactamente a `mundial2018_full`

---

**Versión:** 1.0
**Fecha:** 2026-10-06
**Estado:** Implementado, no ejecutado
