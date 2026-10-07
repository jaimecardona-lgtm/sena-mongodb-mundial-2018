# World Cup 2018 AI Agent

Agente inteligente profesional para consultar y analizar datos de la Copa Mundial FIFA 2018 usando FastAPI, OpenRouter y herramientas especializadas.

## Arquitectura

```
React Frontend (5173)
    ↓
FastAPI AI Service (8000)
    ├→ OpenRouter API (Claude)
    │   ↓
    │ Tool Calling Loop
    │   ↓
    └→ Node REST API (3000)
           ├→ /api/equipos
           ├→ /api/jugadores
           └→ /api/partidos
               ↓
           MongoDB (mundial2018_full)
```

## Instalación

```bash
cd services/ai
pip install -r requirements.txt
```

## Configuración

Crear `.env`:

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-opus
NODE_API_BASE_URL=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:5173
```

## Ejecutar

```bash
uvicorn app.main:app --reload --port 8000
```

O desde el directorio raíz:

```bash
uvicorn app.main:app --app-dir services/ai --port 8000
```

## API Endpoints

### Health Check
```
GET /api/ai/health
```

Verifica que el servicio esté activo y que la API Node sea alcanzable.

### Capabilities
```
GET /api/ai/capabilities
```

Retorna lista de herramientas disponibles.

### Chat
```
POST /api/ai/chat

{
  "message": "¿Cuáles son los 5 jugadores más altos?"
}
```

## Herramientas Disponibles

1. **get_teams** - Obtiene equipos (filtro opcional por confederación)
2. **search_players** - Busca jugadores con filtros avanzados
3. **get_matches** - Obtiene partidos del torneo
4. **get_team_summary** - Resumen completo de un equipo
5. **compare_teams** - Comparación entre dos equipos
6. **get_player_rankings** - Rankings de jugadores por métrica

## Swagger

Acceder a:
```
http://localhost:8000/docs
```

## Características

- ✓ Agent loop explícito (máx 4 iteraciones)
- ✓ Tool calling controlado
- ✓ Only READ operations (no escritura)
- ✓ Logging estructurado con request_id
- ✓ Validación de seguridad
- ✓ CORS configurado
- ✓ Manejo de errores robusto
- ✓ OpenRouter API client
- ✓ Node API client con AsyncClient
- ✓ Configuración vía .env

## Seguridad

- No se ejecuta código generado por LLM
- No eval, no shell tools, no filesystem
- Solo 6 herramientas específicas permitidas
- Read-only (sin escritura en MongoDB)
- API key nunca se expone al frontend
- Validación de límites en all parameters

## Observabilidad

Logs estructura do con formato:
```
[TIMESTAMP] [LEVEL] [AI][request_id] message
```

Tracking:
- request_start/complete
- tool name + duration
- llm duration
- errors

## Integración Frontend

El frontend en `frontend/src/pages/Asistente.tsx` puede llamar:

```javascript
const response = await fetch('http://localhost:8000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userMessage })
})
```

## Estructura

```
services/ai/
├── app/
│   ├── main.py                   # FastAPI app
│   ├── config.py                 # Settings
│   ├── models/
│   │   ├── requests.py           # Request schemas
│   │   └── responses.py          # Response schemas
│   ├── agent/
│   │   ├── agent.py              # Agent loop
│   │   ├── prompts.py            # System prompt
│   │   └── tools.py              # Tool definitions
│   ├── clients/
│   │   ├── node_api.py           # Node REST client
│   │   └── openrouter.py         # OpenRouter client
│   └── utils/
│       └── logging.py            # Logging utilities
├── requirements.txt
├── .env.example
└── README.md
```

## Notas Importantes

- El agente es READ ONLY - no puede modificar MongoDB
- Datos vienen exclusivamente del Node API
- Máximo 4 iteraciones de tool calling por request
- System prompt enfatiza no inventar datos
- No se loggean API keys ni headers de autorización
