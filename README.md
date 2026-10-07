# Copa Mundial FIFA 2018 - Data Hub

Proyecto académico SENA para la evidencia **AA2-EV01 - Código fuente API RESTful y Scripts BD** del programa **Desarrollo Backend con Node.JS y MongoDB (3624367)**.

La solución implementa una API RESTful sobre MongoDB para gestionar información de la Copa Mundial FIFA 2018. Como valor agregado incluye frontend web, estadísticas, documentación Swagger, un agente de inteligencia artificial y despliegue en producción con Docker + Render.

## Enlaces de verificación

- Aplicación pública: https://sena-mongodb-mundial-2018.onrender.com
- Swagger UI: https://sena-mongodb-mundial-2018.onrender.com/api-docs/
- OpenAPI JSON: https://sena-mongodb-mundial-2018.onrender.com/api-docs.json
- Repositorio: https://github.com/jaimecardona-lgtm/sena-mongodb-mundial-2018
- Rama de entrega: `feature/ai-agent-aa2`

## Contexto académico

| Dato | Valor |
|---|---|
| Programa | Desarrollo Backend con Node.JS y MongoDB |
| Ficha / curso | 3624367 |
| Resultado de aprendizaje | 220501123-02. Construir la API de acuerdo con los requerimientos establecidos. |
| Actividad | AA2 - Codificar la API RESTful utilizando las características de Node.JS, de acuerdo con los requerimientos establecidos. |
| Evidencia | AA2-EV01 - Código fuente API RESTful y Scripts BD |
| Aprendiz | Jaime Andrés Cardona Montero |

> La evidencia AA1-EV02 se conserva en la carpeta `mongodb/` mediante los scripts R1-R10 y sirve como base documental para esta fase.

## Estado final

Proyecto finalizado y validado en producción:

- 32 equipos
- 736 jugadores
- 60 partidos
- API REST CRUD operativa
- MongoDB Atlas conectado
- Swagger disponible
- Frontend React desplegado
- Estadísticas calculadas desde datos reales
- Agente IA operativo en producción
- Docker + Render funcionales

## Arquitectura

```text
Navegador
   |
   v
Node.js + Express (Gateway público)
   |-- React SPA
   |-- API REST CRUD
   |-- Swagger / OpenAPI
   `-- /api/ai/* proxy
             |
             v
      FastAPI AI Agent
        |          |
        |          `-- OpenRouter (LLM fallback)
        |
        `-- Node REST API (tools de solo lectura)
                    |
                    v
             MongoDB Atlas
             mundial2018_full
```

En producción Node/Express es el único servicio público. FastAPI escucha internamente en `127.0.0.1:8000` y el frontend consume el agente mediante la ruta relativa `/api/ai/chat`.

## Tecnologías

| Componente | Tecnología |
|---|---|
| Backend | Node.js, Express |
| ODM | Mongoose |
| Base de datos | MongoDB / MongoDB Atlas |
| Documentación | OpenAPI 3.0.3 + Swagger UI |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Recharts |
| IA | FastAPI, OpenRouter, tool calling, Fast Path híbrido |
| Infraestructura | Docker, Docker Compose, Render |
| Datos | Datafile.xlsx + importador idempotente |

## Modelo de datos

### `equipos`

```javascript
{
  _id: ObjectId,
  id: Number,
  abbreviation: String,
  country: String,
  confederation: String
}
```

### `jugadores`

```javascript
{
  _id: ObjectId,
  team: String,
  numero: Number,
  posicion: String,
  nombre: String,
  fechaNacimiento: String,
  nombreCamiseta: String,
  club: String,
  estatura: Number,
  peso: Number
}
```

### `partidos`

```javascript
{
  _id: ObjectId,
  equipo1: String,
  equipo2: String,
  fecha: String,
  hora: String
}
```

El modelo mantiene un enfoque documental. Los nombres de equipo se almacenan directamente en jugadores y partidos para conservar compatibilidad con la fuente académica suministrada.

## API REST

La API implementa CRUD para los tres recursos principales.

### Equipos

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/equipos` | Listar equipos |
| GET | `/api/equipos/:id` | Consultar equipo |
| POST | `/api/equipos` | Crear equipo |
| PUT | `/api/equipos/:id` | Actualizar equipo |
| DELETE | `/api/equipos/:id` | Eliminar equipo |

### Jugadores

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/jugadores` | Listar / filtrar jugadores |
| GET | `/api/jugadores/:id` | Consultar jugador |
| POST | `/api/jugadores` | Crear jugador |
| PUT | `/api/jugadores/:id` | Actualizar jugador |
| DELETE | `/api/jugadores/:id` | Eliminar jugador |

Filtros disponibles en la consulta de jugadores incluyen `team`, `numero`, `posicion`, `estaturaMin` y `estaturaMax`.

### Partidos

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/partidos` | Listar / filtrar partidos |
| GET | `/api/partidos/:id` | Consultar partido |
| POST | `/api/partidos` | Crear partido |
| PUT | `/api/partidos/:id` | Actualizar partido |
| DELETE | `/api/partidos/:id` | Eliminar partido |

### Health check

```http
GET /api/health
```

## Carga de datos

Fuente incluida:

```text
data/source/Datafile.xlsx
```

El importador valida el archivo antes de escribir en la base de datos.

### Dry run

```bash
npm --prefix api run import:datafile:dry
```

Resultado esperado:

```text
Teams: 32
Players: 736
Matchs: 60
DRY RUN SUCCESS
```

### Importación

La escritura requiere la variable `MONGODB_FULL_URI` apuntando a la base `mundial2018_full`.

```bash
npm --prefix api run import:datafile
```

Resultado validado:

```text
equipos: 32
jugadores: 736
partidos: 60
Import completed successfully!
```

## Agente de inteligencia artificial

El proyecto incluye un agente FastAPI de solo lectura integrado a la aplicación.

### Endpoint

```http
POST /api/ai/chat
Content-Type: application/json
```

Ejemplo:

```json
{
  "message": "¿Cuáles son los 5 jugadores más altos?"
}
```

### Herramientas disponibles

El agente cuenta con seis tools controladas:

1. `get_teams`
2. `search_players`
3. `get_matches`
4. `get_team_summary`
5. `compare_teams`
6. `get_player_rankings`

Todas son de solo lectura y consumen la API Node. FastAPI no ejecuta consultas MongoDB generadas por el modelo.

### Arquitectura híbrida

Para consultas determinísticas frecuentes se utiliza un **Fast Path** que ejecuta las tools directamente y construye la respuesta con los datos reales de la API.

Ejemplos:

- `¿Cuáles son los 5 jugadores más altos?`
- `Muéstrame los porteros de Colombia`
- `¿Qué partidos jugó Colombia?`
- `Compara Colombia y Japan`

Las preguntas que no coinciden con el Fast Path utilizan OpenRouter como **LLM fallback**, manteniendo un máximo controlado de iteraciones.

La validación en producción confirmó el ranking global sobre los 736 jugadores, con `KALINIC Lovre (Croatia) - 201 cm` como jugador de mayor estatura.

## Frontend

La SPA incluye:

- Dashboard
- Equipos
- Jugadores
- Partidos
- Estadísticas
- Asistente IA
- Acceso a Swagger

En producción el frontend usa rutas relativas (`/api`) para consumir el mismo dominio de Render.

## Estructura del repositorio

```text
sena-mongodb-mundial-2018/
|-- api/                  # API REST Node.js / Express / Mongoose
|-- mongodb/              # Scripts MongoDB R1-R10
|-- data/source/          # Datafile.xlsx
|-- docs/
|   |-- knowledge/        # Documentación AA1
|   `-- aa2/              # Requerimientos, arquitectura, endpoints, validación, IA
|-- frontend/             # React + TypeScript
|-- services/ai/          # FastAPI AI Agent
|-- scripts/              # Inicio de producción
|-- Dockerfile
|-- docker-compose.yml
|-- render.yaml
`-- README.md
```

## Ejecución local de la API

### Requisitos

- Node.js 22+
- npm
- MongoDB 8+

### Instalación

```bash
npm --prefix api install
```

### Variables de entorno

Crear `api/.env` a partir de `api/.env.example`.

```text
MONGODB_URI=<conexion MongoDB>
PORT=3000
NODE_ENV=development
```

No se deben versionar credenciales reales.

### Inicio

```bash
npm --prefix api start
```

API local:

```text
http://localhost:3000
```

Swagger local:

```text
http://localhost:3000/api-docs/
```

## Ejecución del frontend

```bash
cd frontend
npm install
npm run dev
```

```text
http://localhost:5173
```

## Ejecución del agente IA

Crear `services/ai/.env` a partir del ejemplo y configurar únicamente las variables necesarias.

```text
OPENROUTER_API_KEY=<clave>
OPENROUTER_MODEL=<modelo configurado>
NODE_API_BASE_URL=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:5173
```

Luego:

```bash
cd services/ai
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## Docker

### Desarrollo / validación local

```bash
docker-compose up --build
```

### Producción

El `Dockerfile` multi-stage:

1. Compila el frontend.
2. Instala dependencias Node y Python.
3. Copia API, servicio IA, documentación y datos necesarios.
4. Ejecuta `scripts/start-production.sh`.
5. Expone Node/Express en el puerto suministrado por Render.
6. Mantiene FastAPI como servicio interno en el puerto 8000.

## Variables de producción

Variables no sensibles:

```text
NODE_ENV=production
OPENROUTER_MODEL=<modelo configurado>
```

Secretos configurados únicamente en Render:

```text
MONGODB_URI
OPENROUTER_API_KEY
```

No incluir `.env`, contraseñas, tokens o claves dentro del repositorio ni del ZIP de entrega.

## Documentación técnica

La carpeta `docs/aa2/` contiene:

- `01-requerimientos-aa2.md`
- `02-arquitectura-api.md`
- `03-endpoints.md`
- `04-plan-validacion.md`
- `05-datafile-import.md`
- `06-ai-agent.md`

## Evidencia AA1 conservada

La carpeta `mongodb/` incluye los scripts R1-R10 implementados y validados en la fase anterior. No fueron eliminados ni reemplazados durante AA2.

## Entrega recomendada

Para AA2-EV01 entregar:

1. Informe PDF de evidencia.
2. ZIP limpio del código fuente y scripts BD.
3. Enlace a la aplicación pública.
4. Enlace al repositorio como soporte adicional.

El ZIP no debe contener:

- `.env`
- `node_modules/`
- `.venv/`
- claves API
- contraseñas
- tokens
- archivos temporales

---

**Última actualización:** 7 de octubre de 2026  
**Licencia:** Académica - SENA  
**Responsable:** Jaime Andrés Cardona Montero
