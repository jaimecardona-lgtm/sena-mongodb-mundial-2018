# Taller de Consultas NoSQL: Copa Mundial FIFA Rusia 2018

## Contexto Académico

Este repositorio contiene la evidencia **AA1-EV02** del programa SENA:

**DESARROLLO BACKEND CON NODE.JS Y MONGODB**

| Dato | Valor |
|------|-------|
| Resultado de aprendizaje | 220501123-01. Elaborar el sistema de almacenamiento NoSQL de acuerdo con los requerimientos técnicos. |
| Actividad | AA1 - Desarrollar la base de datos documental NoSQL usando MongoDB, de acuerdo con los requerimientos técnicos. |
| Evidencia | Taller de consultas en base de datos NoSQL. AA1-EV02 |

## Objetivo

Construir un modelo de almacenamiento NoSQL en MongoDB que integre información de la Copa Mundial FIFA Rusia 2018, incluyendo:

- Equipos y confederaciones
- Jugadores y sus datos biométricos
- Clubes de procedencia
- Partidos

## Tecnologías

| Componente | Tecnología |
|------------|-----------|
| Base de datos | **MongoDB** (documental) |
| CLI | **mongosh** |
| Lenguaje | **JavaScript** |
| Ejecución opcional | **Node.js** (para validación) |

**Nota:** No incluye APIs REST, frontend, autenticación, Docker ni infraestructura externa. El enfoque es académico y reproducible.

## Problema Abordado

Modelar un sistema de datos documental que capture la complejidad de un torneo internacional de fútbol, validando:

1. Creación de colecciones apropiadas para datos documentales
2. Inserción y gestión de datos heterogéneos
3. Actualización selectiva de registros
4. Eliminación controlada
5. Consultas simples, complejas y agregaciones
6. Validación de valores extremos (máximos, empates, valores nulos)

## Estructura del Repositorio

```
sena-mongodb-mundial-2018/
│
├── README.md                          # Este archivo
├── AGENTS.md                          # Instrucciones para agentes de trabajo
├── CLAUDE.md                          # Directrices para Claude Code
├── .gitignore                         # Configuración de Git
│
├── docs/
│   └── knowledge/
│       ├── 01-requerimientos.md       # Especificación R1-R10
│       ├── 02-modelo-datos.md         # Decisiones de modelado
│       ├── 03-mapeo-evidencia.md      # Trazabilidad R1-R10
│       └── 04-validacion.md           # Protocolo QA
│
├── mongodb/                           # Scripts MongoDB (en desarrollo)
│   ├── R1-colecciones.js             # Creación de colecciones
│   ├── R2-seed.js                    # Datos de prueba
│   ├── R3-update-james.js            # Update James Rodríguez
│   ├── R4-insert-partido.js          # Insert partido
│   ├── R5-update-partido.js          # Update partido
│   ├── R6-delete-partido.js          # Delete partido
│   ├── R7-query-japan.js             # Consulta: jugadores Japan
│   ├── R8-query-altura.js            # Consulta: altura < 170
│   ├── R9-query-partidos.js          # Consulta: todos los partidos
│   └── R10-query-max-height.js       # Consulta: altura máxima
│
└── evidence/
    └── screenshots/                   # Capturas de resultados (en desarrollo)
```

## Modelo de Datos Preliminar

El diseño contempla tres colecciones principales:

### **equipos**
```javascript
{
  _id: ObjectId,
  id: Number,                // Ej: 5 (Colombia), 15 (Japan)
  abbreviation: String,      // Ej: "col", "jpn"
  country: String,           // Ej: "Colombia", "Japan"
  confederation: String      // Ej: "CONMEBOL", "AFC"
}
```

### **jugadores**
```javascript
{
  _id: ObjectId,
  team: String,              // Ej: "Colombia", "Japan"
  numero: Number,            // Ej: 10
  posicion: String,          // Ej: "CM" (mediocampista)
  nombre: String,            // Ej: "James Rodríguez"
  fechaNacimiento: String,   // Ej: "12.07.1991" (DD.MM.YYYY del SENA)
  nombreCamiseta: String,    // Ej: "JAMES"
  club: String,              // Ej: "FC Bayern München (GER)"
  estatura: Number,          // cm
  peso: Number               // kg
}
```

### **partidos**
```javascript
{
  _id: ObjectId,
  equipo1: String,           // Ej: "Colombia"
  equipo2: String,           // Ej: "England"
  fecha: String,             // Ej: "26/07/18" (DD/MM/YY del SENA)
  hora: String               // Ej: "6:00:00 p. m." (formato SENA)
}
```

**Nota:** Fechas como String preservan fidelidad con datos SENA. Modelo preliminar revisado y listo para implementación (validación ejecutable mediante MongoDB en próxima fase). Ver `docs/knowledge/02-modelo-datos.md`.

## Requerimientos R1-R10

Cada requerimiento corresponde a una operación MongoDB específica:

| # | Descripción | Tipo | Peso | Estado |
|---|---|---|---|---|
| R1 | Crear colecciones | DDL | 20% | PENDIENTE |
| R2 | Registrar datos de prueba (Colombia, Japan) | INSERT | 20% | PENDIENTE |
| R3 | Actualizar James Rodríguez | UPDATE | 10% | PENDIENTE |
| R4 | Registrar partido (Colombia vs. England) | INSERT | 5% | PENDIENTE |
| R5 | Actualizar hora de partido (Poland vs. Colombia) | UPDATE | 10% | PENDIENTE |
| R6 | Eliminar partido de R4 | DELETE | 10% | PENDIENTE |
| R7 | Consultar jugadores de Japan | QUERY | 5% | PENDIENTE |
| R8 | Consultar jugadores con altura < 170 cm | QUERY | 5% | PENDIENTE |
| R9 | Consultar todos los partidos | QUERY | 5% | PENDIENTE |
| R10 | Consultar jugadores con altura máxima | QUERY | 10% | PENDIENTE |

**Total:** 100%

## Estado Actual

**Fase:** Foundation (estructural y documental)

- ✅ Inspección del repositorio
- ✅ Análisis del modelo de datos
- ✅ Creación de estructura base
- ✅ Documentación de requerimientos
- ✅ Definición de validación QA
- ⏳ Implementación R1-R10 (próxima fase)
- ⏳ Validación y evidencia (próxima fase)

## Ejecución Posterior

Los scripts será ejecutados de forma secuencial en mongosh:

```bash
# Conectar a MongoDB
mongosh "mongodb://localhost:27017/mundial2018"

# Ejecutar scripts en orden
load("mongodb/R1-colecciones.js")
load("mongodb/R2-seed.js")
# ... y así sucesivamente
```

Los resultados serán validados contra el protocolo QA definido en `docs/knowledge/04-validacion.md`.

## Enfoque Documental

Este proyecto **no normaliza relaciones como si fuera SQL**. Cada documento es independiente y autocontenido:

- Los equipos tienen sus propios identificadores
- Los jugadores incluyen el nombre del equipo directamente (desnormalización intencionada)
- Los partidos registran nombres de equipos, no referencias cruzadas

Esto es apropiado para MongoDB y mantiene consistencia con los datos académicos suministrados.

## Más Información

Para entender completamente el proyecto, revisar en orden:

1. **[CLAUDE.md](./CLAUDE.md)** — Instrucciones técnicas detalladas
2. **[docs/knowledge/01-requerimientos.md](./docs/knowledge/01-requerimientos.md)** — Especificación oficial
3. **[docs/knowledge/02-modelo-datos.md](./docs/knowledge/02-modelo-datos.md)** — Decisiones de modelado
4. **[docs/knowledge/03-mapeo-evidencia.md](./docs/knowledge/03-mapeo-evidencia.md)** — Trazabilidad R1-R10
5. **[docs/knowledge/04-validacion.md](./docs/knowledge/04-validacion.md)** — Protocolo QA

---

**Última actualización:** 2026-09-27
**Licencia:** Académica (SENA)
**Responsable:** ja23cardona1406
