# AI Agent - Copa Mundial 2018

**Version:** 2.0.0 (Hybrid Optimized)
**Date:** 2026-10-07
**Status:** Hybrid Fast Path + LLM Fallback

---

## Overview

Intelligent hybrid agent for querying and analyzing real World Cup 2018 data through specialized tools with explicit control flow.

Architecture:
- **Fast Path**: Deterministic queries (~100-200ms, no LLM)
- **LLM Fallback**: Complex questions with controlled agent loop
- Tool calling with limits
- Complete traceability
- Security by design

---

## Architecture (Production on Render)

```
Browser
  ↓ (HTTPS)
Node/Express Gateway (0.0.0.0:$PORT)
├─ React SPA (frontend/dist)
├─ API REST CRUD (/api/equipos, etc)
├─ Swagger (/api-docs)
└─ Proxy /api/ai/* → http://127.0.0.1:8000
  ↓ (internal)
FastAPI AI Service (127.0.0.1:8000)
├─ /api/ai/health
├─ /api/ai/chat
├─ /api/ai/capabilities
└─ Agent (Hybrid Fast Path + LLM)
  ↓ (HTTP)
OpenRouter API
└─ nvidia/nemotron-3.5-lightning:free
  ↓ (HTTPS)
MongoDB Atlas (External)
└─ mundial2018_full
```

---

## Dataset

- **Teams**: 32 (CONMEBOL, UEFA, AFC, CAF, CONCACAF, OFC)
- **Players**: 736 (biometric data: name, height, weight, position, club)
- **Matches**: 60 (date, teams, times)
- **Source**: MongoDB Atlas (mundial2018_full)
- **Access**: READ ONLY

---

## Hybrid Architecture

### Fast Path (Deterministic)

Automatically recognizes common query patterns:

**Pattern 1: Player Rankings**
- Input: "¿Cuáles son los 5 jugadores mas altos?"
- Recognizes: variable numbers, "altos/bajos/pesados/ligeros"
- Tool: `get_player_rankings`
- No LLM call
- Dataset: All 736 players scanned

**Pattern 2: Players by Position**
- Input: "Muéstrame los porteros de Colombia"
- Recognizes: positions (GK, CB, CM, CF) and teams
- Tool: `search_players`
- No LLM call

**Pattern 3: Matches by Team**
- Input: "¿Que partidos jugo Colombia?"
- Recognizes: team names (with accent normalization)
- Tool: `get_matches`
- No LLM call

**Pattern 4: Team Comparison**
- Input: "Compara Colombia vs Japan"
- Recognizes: "vs", "versus" patterns
- Tool: `compare_teams`
- No LLM call

### LLM Fallback

If Fast Path returns None:
- Falls back to classic agent loop with OpenRouter
- Maximum 3 iterations
- Model: nvidia/nemotron-3.5-lightning:free
- For open, complex, or non-deterministic questions

---

## Tools (6 READ-ONLY)

### 1. `get_teams`
Get all 32 tournament teams.

Parameters:
- `confederation` (optional): AFC, CAF, CONCACAF, CONMEBOL, OFC, UEFA

### 2. `search_players`
Search 736 players with advanced filters.

Parameters:
- `team` (str, optional)
- `position` (str, optional): CB, CF, CM, GK
- `min_height` (int, optional): cm
- `max_height` (int, optional): cm
- `name` (str, optional): partial search
- `sort_by` (str): nombre | estatura | peso | numero
- `order` (str): asc | desc
- `limit` (int): Max 1000 (default 50)

### 3. `get_matches`
Get all 60 tournament matches.

Parameters:
- `team` (str, optional): Filter by team
- `date` (str, optional): Format DD/MM/YY

### 4. `get_team_summary`
Complete team summary.

Parameters:
- `team` (str, required): Team name

### 5. `compare_teams`
Comparison between two teams.

Parameters:
- `team_a` (str, required)
- `team_b` (str, required)

### 6. `get_player_rankings`
Player rankings by metric.

Parameters:
- `metric` (str, required): height | weight
- `order` (str): asc | desc
- `team` (str, optional): Filter by team
- `limit` (int): Max 100 (default 10)

---

## Agent Loop (LLM Fallback, max 3 iterations)

1. User message
2. Call OpenRouter (Tool Calling mode)
3. Parse response
4. If finish_reason == "stop": return answer
5. If tool calls: execute each tool
6. Add results back to message history
7. Loop (max 3 times)
8. If max iterations reached: abort with message

---

## OpenRouter Client (Optimized)

Features:
- Persistent AsyncClient (reused between calls)
- Total timeout: 20 seconds
- Connect timeout: 5 seconds
- max_tokens: 700 (was 2000)
- Model: nvidia/nemotron-3.5-lightning:free
- Tool calling support
- Robust error handling
- API keys never logged

---

## Configuration

**File:** `.env`

```bash
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free
NODE_API_BASE_URL=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:5173
```

---

## Security

**Hard Restrictions:**
- ✗ NO eval() of code
- ✗ NO shell commands
- ✗ NO filesystem access
- ✗ NO LLM-generated Mongo queries
- ✗ NO arbitrary HTTP from model

**Only Allowed:**
- ✓ 6 defined tools in JSON schema
- ✓ READ ONLY (no DELETE, UPDATE, INSERT)
- ✓ Validated parameters
- ✓ Node API as intermediary
- ✓ Maximum 3 iterations per request
- ✓ Fast Path avoids LLM for common queries

---

## Logging

**Format:**

```
[2026-10-07 12:30:45] [INFO] [AI][uuid-123] request_start message=...
[2026-10-07 12:30:45] [INFO] [AI][uuid-123] fast_path tool=get_player_rankings duration_ms=125
[2026-10-07 12:30:45] [INFO] [AI][uuid-123] request_complete

OR (if LLM fallback):

[2026-10-07 12:30:47] [INFO] [AI][uuid-456] request_start message=...
[2026-10-07 12:30:48] [INFO] [AI][uuid-456] llm duration_ms=1200
[2026-10-07 12:30:48] [INFO] [AI][uuid-456] tool=get_teams duration_ms=80
[2026-10-07 12:30:48] [INFO] [AI][uuid-456] request_complete
```

**NOT logged:**
- API keys
- Internal prompts
- Chain-of-thought

---

## Implementation Notes

- Agent loop is explicit (FastAPI + asyncio, no LangChain)
- Maximum 3 iterations in LLM fallback
- Fast Path teams cached in memory
- Tool input always validated before execution
- Node API response is authoritative source
- Persistent AsyncClient for better performance
- Proper shutdown of resources via lifespan
- All 736 players scanned for global rankings (not limited to 200)

---

**Last Updated:** 2026-10-07
**License:** Academic (SENA)
**Owner:** ja23cardona1406
