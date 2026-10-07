# AI Agent - Copa Mundial 2018
**VersiÃ³n:** 1.0.0
**Fecha:** 2026-10-06
**Estado:** Implementado, no ejecutado todavÃ­a
---
## Objetivo
Crear un agente inteligente profesional que permita consultar y analizar datos reales de la Copa Mundial FIFA 2018 mediante herramientas especializadas y control explÃ­cito de flujo.
NO es un chatbot simple. Es un sistema de razonamiento con:
- Agent loop controlado
- Tool calling con lÃ­mites
- Trazabilidad completa
- Seguridad by design
---
## Arquitectura General
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   React Frontend (port 5173)         â”‚
â”‚   â””â”€ src/pages/Asistente.tsx        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
               â”‚
               â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   FastAPI AI Service (port 8000)    â”‚
â”‚   â””â”€ app/main.py                    â”‚
â”‚      POST /api/ai/chat              â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
               â”‚
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”
       â†“                â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ OpenRouter API   â”‚   â”‚ Node REST API        â”‚
â”‚ (Claude)         â”‚   â”‚ (port 3000)          â”‚
â”‚ Tool Calling     â”‚   â”œâ”€ /api/equipos       â”‚
â”‚ Loop             â”‚   â”œâ”€ /api/jugadores     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”œâ”€ /api/partidos      â”‚
                       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                 â†“
                           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                           â”‚  MongoDB   â”‚
                           â”‚ mundial... â”‚
                           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```
---
## Stack TecnolÃ³gico
- **Framework:** FastAPI
- **Server:** Uvicorn
- **Async:** httpx AsyncClient
- **Config:** Pydantic + pydantic-settings
- **LLM:** OpenRouter API (Claude Opus default)
- **Logging:** Python stdlib logging
- **CORS:** FastAPI middleware
---
## Estructura de Archivos
```
services/ai/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ __init__.py
â”‚   â”œâ”€â”€ main.py                       # FastAPI application
â”‚   â”œâ”€â”€ config.py                     # Configuration & settings
â”‚   â”‚
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ requests.py               # ChatRequest, HealthRequest
â”‚   â”‚   â””â”€â”€ responses.py              # ChatResponse, HealthResponse, CapabilitiesResponse
â”‚   â”‚
â”‚   â”œâ”€â”€ agent/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ agent.py                  # Agent loop (main logic)
â”‚   â”‚   â”œâ”€â”€ prompts.py                # System prompt
â”‚   â”‚   â””â”€â”€ tools.py                  # Tool definitions (JSON schema)
â”‚   â”‚
â”‚   â”œâ”€â”€ clients/
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ node_api.py               # Node REST API client
â”‚   â”‚   â””â”€â”€ openrouter.py             # OpenRouter API client
â”‚   â”‚
â”‚   â””â”€â”€ utils/
â”‚       â”œâ”€â”€ __init__.py
â”‚       â””â”€â”€ logging.py                # Logging utilities
â”‚
â”œâ”€â”€ requirements.txt                  # Dependencies
â”œâ”€â”€ .env.example                      # Environment template
â””â”€â”€ README.md                         # Documentation
```
---
## Endpoints FastAPI
### 1. Health Check
```
GET /api/ai/health
```
**Respuesta:**
```json
{
  "status": "ok",
  "service": "world-cup-ai-agent",
  "node_api": "reachable"
}
```
**Comportamiento:**
- Verifica que FastAPI estÃ© activo
- Intenta conectarse a http://localhost:3000/api/health
- Reporta si Node API es alcanzable
- NO llama OpenRouter (no gasta credits)
---
### 2. Capabilities
```
GET /api/ai/capabilities
```
**Respuesta:**
```json
{
  "tools": [
    "get_teams",
    "search_players",
    "get_matches",
    "get_team_summary",
    "compare_teams",
    "get_player_rankings"
  ],
  "read_only": true
}
```
---
### 3. Chat
```
POST /api/ai/chat
{
  "message": "Â¿CuÃ¡les son los 5 jugadores mÃ¡s altos de Colombia?",
  "conversation_id": "optional-string",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```
**Respuesta:**
```json
{
  "status": "success",
  "request_id": "uuid-string",
  "answer": "Los 5 jugadores mÃ¡s altos de Colombia son...",
  "model": "anthropic/claude-opus",
  "tools_used": [
    "get_player_rankings"
  ],
  "evidence": null
}
```
---
## Herramientas (Tools)
El agente tiene acceso a exactamente 6 herramientas controladas:
### Tool 1: `get_teams`
Obtiene los 32 equipos del torneo.
**ParÃ¡metros:**
- `confederation` (optional): AFC, CAF, CONCACAF, CONMEBOL, OFC, UEFA
**Ejemplo:**
```python
await agent.execute_tool("get_teams", {"confederation": "CONMEBOL"})
```
---
### Tool 2: `search_players`
Busca los 736 jugadores con filtros avanzados.
**ParÃ¡metros:**
- `team` (str, optional): Nombre del equipo (ej: "Colombia")
- `position` (str, optional): CB, CF, CM, GK
- `min_height` (int, optional): En cm
- `max_height` (int, optional): En cm
- `name` (str, optional): BÃºsqueda parcial
- `sort_by` (str): nombre | estatura | peso | numero (default: nombre)
- `order` (str): asc | desc (default: asc)
- `limit` (int): Max 200 (default: 50)
**Ejemplo:**
```python
await agent.execute_tool("search_players", {
    "team": "Colombia",
    "position": "GK",
    "sort_by": "estatura",
    "order": "desc",
    "limit": 5
})
```
---
### Tool 3: `get_matches`
Obtiene los 60 partidos del torneo.
**ParÃ¡metros:**
- `team` (str, optional): Filtro por equipo
- `date` (str, optional): Formato DD/MM/YY
**Ejemplo:**
```python
await agent.execute_tool("get_matches", {"team": "Colombia"})
```
---
### Tool 4: `get_team_summary`
Resumen completo de un equipo.
**ParÃ¡metros:**
- `team` (str, required): Nombre del equipo
**Retorna:**
```json
{
  "status": "success",
  "data": {
    "team": "Colombia",
    "confederation": "CONMEBOL",
    "player_count": 23,
    "average_height": 181.52,
    "average_weight": 78.43,
    "positions": {
      "GK": 3,
      "CB": 6,
      "CF": 2,
      "CM": 12
    },
    "match_count": 3
  }
}
```
---
### Tool 5: `compare_teams`
ComparaciÃ³n entre dos equipos.
**ParÃ¡metros:**
- `team_a` (str, required)
- `team_b` (str, required)
**Retorna:**
```json
{
  "status": "success",
  "data": {
    "team_a": {
      "name": "Colombia",
      "player_count": 23,
      "average_height": 181.52,
      ...
    },
    "team_b": {
      "name": "Japan",
      "player_count": 23,
      "average_height": 175.34,
      ...
    }
  }
}
```
---
### Tool 6: `get_player_rankings`
Rankings de jugadores ordenados por mÃ©trica.
**ParÃ¡metros:**
- `metric` (str, required): height | weight
- `order` (str): asc | desc (default: desc)
- `team` (str, optional): Filtro por equipo
- `limit` (int): Max 100 (default: 10)
**Ejemplo:**
```python
await agent.execute_tool("get_player_rankings", {
    "metric": "height",
    "order": "desc",
    "limit": 5
})
```
---
## Agent Loop (ExplÃ­cito)
El agente implementa un control de flujo explÃ­cito SIN LangChain para demostrar entendimiento:
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 1. User Message                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 2. Call OpenRouter (Tool Calling Mode)  â”‚
â”‚    max_tokens: 2000                     â”‚
â”‚    tools: [6 definidas]                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 3. Parse Response                       â”‚
â”‚    finish_reason == "stop" ?            â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â”‚
      NO â”€â”€â”€â”€â”´â”€â”€â†’ Tool Calls?
             â”‚
          YES
             â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 4. Execute Each Tool                    â”‚
â”‚    - Validate name                      â”‚
â”‚    - Validate input                     â”‚
â”‚    - Call Node API as needed            â”‚
â”‚    - Track duration                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 5. Return Results to LLM                â”‚
â”‚    Add to message history               â”‚
â”‚    Continue loop                        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 6. Check Iteration Limit                â”‚
â”‚    (max 4 iteraciones)                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
             â”‚
    â†“â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â†’ limit reached?
    â”‚                    â”‚
    â”‚                  YES â†’ Abort
    â”‚
    NO â†’ Go to step 2
```
**PseudocÃ³digo:**
```python
async def run(user_message):
    iteration = 0
    messages = [{"role": "user", "content": user_message}]
    tools_used = []
    while iteration < 4:
        iteration += 1
        # Call LLM
        response = await openrouter.chat_with_tools(
            system_prompt=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages
        )
        message = response.choices[0].message
        messages.append(message)
        # Check finish reason
        if response.choices[0].finish_reason == "stop":
            return message.content  # Final answer
        # Process tool calls
        if message.tool_calls:
            for tool_call in message.tool_calls:
                tool_name = tool_call.function.name
                tool_input = parse(tool_call.function.arguments)
                # Execute with safety
                tool_result = await execute_tool(tool_name, tool_input)
                tools_used.append(tool_name)
                # Add result back
                messages.append({
                    "role": "user",
                    "content": [{"type": "tool", "tool_use_id": tool_call.id, "content": result}]
                })
    return "LÃ­mite de iteraciones alcanzado"
```
---
## OpenRouter Client
**Archivo:** `app/clients/openrouter.py`
CaracterÃ­sticas:
- Async con httpx
- API key desde config (nunca hardcoded)
- Modelo configurable (default: claude-opus)
- Timeout: 30 segundos
- Error handling robusto
- No expone credentials en logs
```python
async def chat_with_tools(
    system_prompt: str,
    user_message: str,
    tools: List[Dict],
    history: Optional[List[dict]]
) -> Dict
```
---
## Node API Client
**Archivo:** `app/clients/node_api.py`
CaracterÃ­sticas:
- Async con httpx.AsyncClient
- Timeout: 10 segundos
- Endpoints:
  - `GET /api/equipos`
  - `GET /api/jugadores`
  - `GET /api/partidos`
- No escribe (READ ONLY)
- Error handling con logging
MÃ©todos pÃºblicos:
```python
async def get_teams(confederation: Optional[str])
async def search_players(...params...)
async def get_matches(team: Optional[str], date: Optional[str])
async def check_connectivity() -> bool
```
---
## System Prompt
El agente sabe que:
1. Es el **Asistente del Mundial 2018** del proyecto SENA
2. Debe responder **SOLO** con datos de sus herramientas
3. NO debe inventar jugadores, equipos o partidos
4. Para hechos debe usar tools (no memoria)
5. Debe decir claramente cuÃ¡ndo NO encuentra datos
6. Puede calcular e interpretar resultados
7. Responde en **espaÃ±ol** por defecto
8. Puede cambiar idioma si se solicita
9. NO afirma datos externos como si vinieran de MongoDB
El prompt completo estÃ¡ en `app/agent/prompts.py`.
---
## Seguridad
### Restricciones Duras
- âœ— NO eval() de cÃ³digo
- âœ— NO shell commands
- âœ— NO filesystem access
- âœ— NO Mongo queries generadas por LLM
- âœ— NO HTTP arbitrario decidido por el modelo
### Solo Permitido
- âœ“ 6 tools definidas
- âœ“ READ ONLY (sin DELETE, UPDATE, INSERT)
- âœ“ ParÃ¡metros validados (type, range, enum)
- âœ“ Node API como intermediario
- âœ“ LÃ­mite de 4 iteraciones por request
### Credenciales
- âœ“ OPENROUTER_API_KEY nunca se expone al frontend
- âœ“ No se loggea en archivo
- âœ“ ValidaciÃ³n en startup
- âœ“ Error controlado si no estÃ¡ configurada
---
## Observabilidad
### Request ID
Cada request genera un UUID Ãºnico:
```
request_id: "550e8400-e29b-41d4-a716-446655440000"
```
### Logging Estructura do
```
[2026-10-06 14:30:45] [INFO] [AI][550e8400...] request_start message=Â¿CuÃ¡les son...
[2026-10-06 14:30:46] [INFO] [AI][550e8400...] llm duration_ms=1245
[2026-10-06 14:30:46] [INFO] [AI][550e8400...] tool=get_player_rankings duration_ms=342
[2026-10-06 14:30:47] [INFO] [AI][550e8400...] request_complete
```
### Tracking
- `request_start`: Inicio de procesamiento
- `llm duration_ms`: Tiempo de respuesta OpenRouter
- `tool=<name> duration_ms=<n>`: Tiempo de cada herramienta
- `request_complete`: Fin exitoso
NO se loggean:
- API keys
- Prompts internos
- Chain-of-thought del modelo
---
## Variables de Entorno
**Archivo:** `.env`
```bash
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-opus
NODE_API_BASE_URL=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:5173
```
**ValidaciÃ³n en startup:**
- Si `OPENROUTER_API_KEY` no estÃ¡ â†’ health OK, chat retorna 503
- Si `NODE_API_BASE_URL` invÃ¡lido â†’ error conexiÃ³n
- Todas validadas en `app/config.py`
---
## CORS
Configurado para:
- **Allow Origin:** `http://localhost:5173` (frontend)
- **Methods:** GET, POST
- **Headers:** Content-Type
NO usa wildcard.
---
## IntegraciÃ³n Frontend
**Archivo a modificar:** `frontend/src/pages/Asistente.tsx`
**Cliente API a crear:** `frontend/src/services/ai.ts`
```typescript
// frontend/src/services/ai.ts
export const aiApi = {
  async chat(message: string) {
    const response = await fetch(
      import.meta.env.VITE_AI_API_URL || 'http://localhost:8000',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      }
    )
    return response.json()
  }
}
```
Frontend debe mostrar:
- âœ“ Mensaje del usuario
- âœ“ Loading state
- âœ“ Respuesta del agente
- âœ“ Badge con tools utilizadas (discreto)
- âœ“ Error state si aplica
Ejemplo discreto:
```
Respuesta: "Los 5 jugadores mÃ¡s altos son..."
Datos consultados: search_players, get_team_summary
```
---
## ValidaciÃ³n de Preguntas
El agente debe responder correctamente:
1. **"Â¿CuÃ¡les son los 5 jugadores mÃ¡s altos?"**
   - Tool: `get_player_rankings` (metric="height", limit=5)
2. **"MuÃ©strame los porteros de Colombia"**
   - Tool: `search_players` (team="Colombia", position="GK")
3. **"Â¿QuÃ© partidos jugÃ³ Colombia?"**
   - Tool: `get_matches` (team="Colombia")
4. **"Compara Colombia y Japan"**
   - Tool: `compare_teams` (team_a="Colombia", team_b="Japan")
5. **"Â¿CuÃ¡l es la estatura promedio de Colombia?"**
   - Tool: `get_team_summary` (team="Colombia")
   - Extract: average_height
6. **"Â¿CuÃ¡l es el jugador mÃ¡s pesado?"**
   - Tool: `get_player_rankings` (metric="weight", order="desc", limit=1)
7. **"Â¿QuÃ© equipos pertenecen a CONMEBOL?"**
   - Tool: `get_teams` (confederation="CONMEBOL")
Todas basadas en **data real**, no alucinaciones.
---
## Notas de ImplementaciÃ³n
- Agent loop es **explÃ­cito** (sin LangChain inicialmente)
- MÃ¡ximo 4 iteraciones controladas
- Tool input **siempre validado** antes de ejecutar
- Node API respuesta es **confiable** (origen de verdad)
- Logging **estructurado** para debugging
- Errores **nunca exponen** configuraciÃ³n interna
---
**Fecha de CreaciÃ³n:** 2026-10-06
**Ãšltima ActualizaciÃ³n:** 2026-10-06
**Estado:** EspecificaciÃ³n completada
