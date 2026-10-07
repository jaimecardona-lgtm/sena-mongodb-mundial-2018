import json
import time
import re
import unicodedata
from typing import Optional, List, Dict, Any
from app.clients.openrouter import openrouter_client
from app.clients.node_api import node_api_client
from app.agent.prompts import SYSTEM_PROMPT
from app.agent.tools import get_tool_definitions
from app.utils.logging import logger, log_request


class Agent:
    def __init__(self):
        self.max_iterations = 3
        self.tools = get_tool_definitions()
        self._teams_cache = None

    def _normalize_text(self, text: str) -> str:
        """Normalize text: lowercase, remove accents, trim spaces"""
        text = text.lower().strip()
        text = unicodedata.normalize('NFD', text)
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        return text

    async def _get_teams_cache(self) -> List[Dict[str, Any]]:
        """Get teams with caching to avoid repeated API calls"""
        if self._teams_cache is None:
            self._teams_cache = await node_api_client.get_teams()
        return self._teams_cache

    def _find_team(self, team_name: str) -> Optional[str]:
        """Find team by name with fuzzy matching"""
        if self._teams_cache is None:
            return None
        normalized = self._normalize_text(team_name)
        for team in self._teams_cache:
            if self._normalize_text(team['country']) == normalized:
                return team['country']
        return None

    async def try_fast_path(
        self, user_message: str, request_id: str
    ) -> Optional[Dict[str, Any]]:
        """Try to handle request via fast path without LLM call"""
        msg_lower = user_message.lower()

        # Pattern 1: Player rankings (altos/bajos/pesados/ligeros) - NO necesita teams cache
        ranking_patterns = [
            (r'(?:cuáles son |muéstrame |top |)\b(\d+)?\s*(?:jugadores|players)?\s*(?:más )?(altos|altas|mayor estatura|tall|highest)', 'height', 'desc'),
            (r'(?:cuáles son |muéstrame |top |)\b(\d+)?\s*(?:jugadores|players)?\s*(?:más )?(bajos|baja|menor estatura|short|lowest)', 'height', 'asc'),
            (r'(?:cuáles son |muéstrame |top |)\b(\d+)?\s*(?:jugadores|players)?\s*(?:más )?(pesados|heavy|weight)', 'weight', 'desc'),
            (r'(?:cuáles son |muéstrame |top |)\b(\d+)?\s*(?:jugadores|players)?\s*(?:más )?(livianos|ligeros|light|lightest)', 'weight', 'asc'),
        ]

        for pattern, metric, order in ranking_patterns:
            match = re.search(pattern, msg_lower)
            if match:
                limit = int(match.group(1)) if match.group(1) else 5
                limit = min(limit, 50)
                start_time = time.time()
                result = await self.execute_tool(
                    'get_player_rankings',
                    {'metric': metric, 'order': order, 'limit': limit}
                )
                duration_ms = int((time.time() - start_time) * 1000)
                log_request(request_id, f"fast_path tool=get_player_rankings duration_ms={duration_ms}")

                if result.get('status') == 'success':
                    data = result.get('data', [])
                    if metric == 'height':
                        if order == 'desc':
                            title = f"**Top {len(data)} jugadores más altos del Mundial 2018**"
                        else:
                            title = f"**Top {len(data)} jugadores de menor estatura del Mundial 2018**"
                    else:  # weight
                        if order == 'desc':
                            title = f"**Top {len(data)} jugadores con mayor peso del Mundial 2018**"
                        else:
                            title = f"**Top {len(data)} jugadores con menor peso del Mundial 2018**"
                    answer = title + "\n\n"
                    for item in data:
                        if metric == 'height':
                            value = item.get('height', 'N/A')
                            unit = 'cm'
                        else:
                            value = item.get('weight', 'N/A')
                            unit = 'kg'
                        answer += f"{item['rank']}. **{item['name']}** ({item['team']}) — **{value} {unit}**\n"
                    answer += f"\n_Datos consultados directamente en el dataset del Mundial 2018._"
                    return {
                        'status': 'success',
                        'request_id': request_id,
                        'answer': answer,
                        'model': 'hybrid-fast-path',
                        'tools_used': ['get_player_rankings'],
                        'evidence': None
                    }

        # Load teams cache only if Pattern 2, 3, or 4 might match
        # Pattern 2: Players by position and team
        position_pattern = r'(?:porteros|goalkeepers|gk|arqueros|defensores|defenders|cb|mediocampistas|midfielders|cm|delanteros|forwards|cf|strikers)\s+(?:de|from|de|en)\s+(\w+(?:\s+\w+)?)'
        match = re.search(position_pattern, msg_lower)
        if not match:
            position_pattern = r'(?:porteros|goalkeepers|gk|arqueros|defensores|defenders|cb|mediocampistas|midfielders|cm|delanteros|forwards|cf|strikers)\s+(?:de|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)'
            match = re.search(position_pattern, user_message)

        # Only load teams if we might need them (Pattern 2, 3, 4)
        teams = None
        if match or re.search(r'(?:partidos|matches)\s+(?:jugó|de|from)', msg_lower) or re.search(r'(?:compara|compare)\s+', msg_lower):
            teams = await self._get_teams_cache()

        if match and teams:
            team_name = match.group(1)
            team = self._find_team(team_name)
            if team:
                pos_map = {
                    'portero': 'GK', 'goalkeeper': 'GK', 'gk': 'GK', 'arquero': 'GK',
                    'defensor': 'CB', 'defender': 'CB', 'cb': 'CB',
                    'mediocampista': 'CM', 'midfielder': 'CM', 'cm': 'CM',
                    'delantero': 'CF', 'forward': 'CF', 'cf': 'CF', 'striker': 'CF'
                }
                position = None
                for key, val in pos_map.items():
                    if key in msg_lower:
                        position = val
                        break

                if position:
                    start_time = time.time()
                    result = await self.execute_tool(
                        'search_players',
                        {'team': team, 'position': position, 'limit': 50}
                    )
                    duration_ms = int((time.time() - start_time) * 1000)
                    log_request(request_id, f"fast_path tool=search_players duration_ms={duration_ms}")

                    if result.get('status') == 'success':
                        data = result.get('data', [])
                        pos_label = 'Porteros' if position == 'GK' else ('Defensores' if position == 'CB' else ('Mediocampistas' if position == 'CM' else 'Delanteros'))
                        answer = f"**{pos_label} de {team}**\n\n"
                        for i, player in enumerate(data, 1):
                            answer += f"{i}. **{player['nombre']}** (#{player['numero']})\n   {player['club']}\n\n"
                        answer += f"_Datos consultados directamente en el dataset del Mundial 2018._"
                        return {
                            'status': 'success',
                            'request_id': request_id,
                            'answer': answer,
                            'model': 'hybrid-fast-path',
                            'tools_used': ['search_players'],
                            'evidence': None
                        }

        # Pattern 3: Matches by team
        matches_pattern = r'(?:partidos|matches|encuentros|games)?\s*(?:que\s+)?jugó\s+(\w+(?:\s+\w+)?)|(?:partidos|matches)\s+(?:de|from)\s+(\w+(?:\s+\w+)?)'
        match = re.search(matches_pattern, msg_lower)
        if not match:
            matches_pattern = r'(?:partidos|matches)\s+(?:de|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)'
            match = re.search(matches_pattern, user_message)

        if match and teams:
            team_name = match.group(1) or match.group(2)
            team = self._find_team(team_name)
            if team:
                start_time = time.time()
                result = await self.execute_tool('get_matches', {'team': team})
                duration_ms = int((time.time() - start_time) * 1000)
                log_request(request_id, f"fast_path tool=get_matches duration_ms={duration_ms}")

                if result.get('status') == 'success':
                    data = result.get('data', [])
                    answer = f"**Partidos de {team}**\n\n"
                    for match_item in data:
                        team1 = match_item.get('equipo1', 'N/A')
                        team2 = match_item.get('equipo2', 'N/A')
                        fecha = match_item.get('fecha', 'N/A')
                        answer += f"- **{team1} vs {team2}** — {fecha}\n"
                    answer += f"\n_Datos consultados directamente en el dataset del Mundial 2018._"
                    return {
                        'status': 'success',
                        'request_id': request_id,
                        'answer': answer,
                        'model': 'hybrid-fast-path',
                        'tools_used': ['get_matches'],
                        'evidence': None
                    }

        # Pattern 4: Team comparison
        compare_pattern = r'(?:compara|compare)\s+(\w+(?:\s+\w+)?)\s+(?:y|and|vs)\s+(\w+(?:\s+\w+)?)|(?:diferencia|difference)\s+(?:entre|between)\s+(\w+(?:\s+\w+)?)\s+(?:y|and)\s+(\w+(?:\s+\w+)?)'
        match = re.search(compare_pattern, msg_lower)
        if not match:
            compare_pattern = r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:vs|versus|vs\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)'
            match = re.search(compare_pattern, user_message)

        if match and teams:
            team_a_name = match.group(1) or match.group(3)
            team_b_name = match.group(2) or match.group(4)
            team_a = self._find_team(team_a_name)
            team_b = self._find_team(team_b_name)

            if team_a and team_b:
                start_time = time.time()
                result = await self.execute_tool(
                    'compare_teams',
                    {'team_a': team_a, 'team_b': team_b}
                )
                duration_ms = int((time.time() - start_time) * 1000)
                log_request(request_id, f"fast_path tool=compare_teams duration_ms={duration_ms}")

                if result.get('status') == 'success':
                    data = result.get('data', {})
                    a = data.get('team_a', {})
                    b = data.get('team_b', {})
                    answer = f"**Comparación: {team_a} vs {team_b}**\n\n"
                    answer += f"**{team_a}**\n"
                    answer += f"- Jugadores: **{a.get('player_count', 'N/A')}**\n"
                    answer += f"- Estatura promedio: **{a.get('average_height', 'N/A')} cm**\n"
                    answer += f"- Peso promedio: **{a.get('average_weight', 'N/A')} kg**\n"
                    answer += f"- Partidos: **{a.get('match_count', 'N/A')}**\n\n"
                    answer += f"**{team_b}**\n"
                    answer += f"- Jugadores: **{b.get('player_count', 'N/A')}**\n"
                    answer += f"- Estatura promedio: **{b.get('average_height', 'N/A')} cm**\n"
                    answer += f"- Peso promedio: **{b.get('average_weight', 'N/A')} kg**\n"
                    answer += f"- Partidos: **{b.get('match_count', 'N/A')}**\n\n"
                    answer += f"_Datos consultados directamente en el dataset del Mundial 2018._"
                    return {
                        'status': 'success',
                        'request_id': request_id,
                        'answer': answer,
                        'model': 'hybrid-fast-path',
                        'tools_used': ['compare_teams'],
                        'evidence': None
                    }

        return None

    async def execute_tool(
        self, tool_name: str, tool_input: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute a tool call with safety guardrails"""
        try:
            if tool_name == "get_teams":
                confederation = tool_input.get("confederation")
                teams = await node_api_client.get_teams(confederation=confederation)
                return {"status": "success", "data": teams}

            elif tool_name == "search_players":
                players = await node_api_client.search_players(
                    team=tool_input.get("team"),
                    position=tool_input.get("position"),
                    min_height=tool_input.get("min_height"),
                    max_height=tool_input.get("max_height"),
                    name=tool_input.get("name"),
                    sort_by=tool_input.get("sort_by", "nombre"),
                    order=tool_input.get("order", "asc"),
                    limit=tool_input.get("limit", 50),
                )
                return {"status": "success", "data": players}

            elif tool_name == "get_matches":
                matches = await node_api_client.get_matches(
                    team=tool_input.get("team"),
                    date=tool_input.get("date"),
                )
                return {"status": "success", "data": matches}

            elif tool_name == "get_team_summary":
                team = tool_input.get("team")
                if not team:
                    return {"status": "error", "message": "Team name required"}

                players = await node_api_client.search_players(team=team, limit=100)
                matches = await node_api_client.get_matches(team=team)
                teams = await node_api_client.get_teams()
                team_info = next((t for t in teams if t["country"] == team), None)

                if not players:
                    return {
                        "status": "error",
                        "message": f"Team '{team}' not found",
                    }

                positions = {}
                for p in players:
                    pos = p.get("posicion", "UNKNOWN")
                    positions[pos] = positions.get(pos, 0) + 1

                avg_height = sum(p["estatura"] for p in players) / len(players)
                avg_weight = sum(p["peso"] for p in players) / len(players)

                return {
                    "status": "success",
                    "data": {
                        "team": team,
                        "confederation": team_info.get("confederation") if team_info else "N/A",
                        "player_count": len(players),
                        "average_height": round(avg_height, 2),
                        "average_weight": round(avg_weight, 2),
                        "positions": positions,
                        "match_count": len(matches),
                    },
                }

            elif tool_name == "compare_teams":
                team_a = tool_input.get("team_a")
                team_b = tool_input.get("team_b")

                if not team_a or not team_b:
                    return {"status": "error", "message": "Both teams required"}

                players_a = await node_api_client.search_players(team=team_a, limit=100)
                players_b = await node_api_client.search_players(team=team_b, limit=100)
                matches_a = await node_api_client.get_matches(team=team_a)
                matches_b = await node_api_client.get_matches(team=team_b)

                if not players_a or not players_b:
                    return {
                        "status": "error",
                        "message": "One or both teams not found",
                    }

                def compute_positions(players):
                    pos = {}
                    for p in players:
                        po = p.get("posicion", "UNKNOWN")
                        pos[po] = pos.get(po, 0) + 1
                    return pos

                return {
                    "status": "success",
                    "data": {
                        "team_a": {
                            "name": team_a,
                            "player_count": len(players_a),
                            "average_height": round(
                                sum(p["estatura"] for p in players_a) / len(players_a), 2
                            ),
                            "average_weight": round(
                                sum(p["peso"] for p in players_a) / len(players_a), 2
                            ),
                            "positions": compute_positions(players_a),
                            "match_count": len(matches_a),
                        },
                        "team_b": {
                            "name": team_b,
                            "player_count": len(players_b),
                            "average_height": round(
                                sum(p["estatura"] for p in players_b) / len(players_b), 2
                            ),
                            "average_weight": round(
                                sum(p["peso"] for p in players_b) / len(players_b), 2
                            ),
                            "positions": compute_positions(players_b),
                            "match_count": len(matches_b),
                        },
                    },
                }

            elif tool_name == "get_player_rankings":
                metric = tool_input.get("metric")
                if metric not in ["height", "weight"]:
                    return {"status": "error", "message": "Invalid metric"}

                order = tool_input.get("order", "desc")
                team = tool_input.get("team")
                limit = min(tool_input.get("limit", 10), 100)

                players = await node_api_client.search_players(
                    team=team, limit=1000, sort_by="nombre"
                )

                if metric == "height":
                    players = sorted(
                        players,
                        key=lambda p: p["estatura"],
                        reverse=(order == "desc"),
                    )
                else:  # weight
                    players = sorted(
                        players, key=lambda p: p["peso"], reverse=(order == "desc")
                    )

                result = []
                for i, p in enumerate(players[:limit], 1):
                    result.append(
                        {
                            "rank": i,
                            "name": p["nombre"],
                            "team": p["team"],
                            "height": p["estatura"] if metric == "height" else None,
                            "weight": p["peso"] if metric == "weight" else None,
                        }
                    )

                return {"status": "success", "data": result}

            else:
                return {"status": "error", "message": f"Unknown tool: {tool_name}"}

        except Exception as e:
            logger.error(f"Tool execution error: {e}")
            return {"status": "error", "message": str(e)}

    async def run(
        self,
        request_id: str,
        user_message: str,
        history: Optional[List[dict]] = None,
    ) -> Dict[str, Any]:
        """Main agent loop with fast path optimization"""
        log_request(request_id, f"request_start message={user_message[:50]}...")

        fast_result = await self.try_fast_path(user_message, request_id)
        if fast_result:
            return fast_result

        if not openrouter_client.is_configured():
            return {
                "status": "error",
                "error": "AI service is not configured",
                "request_id": request_id,
            }

        tools_used = []
        iteration = 0
        messages = []

        if history:
            messages.extend(history[-10:])

        messages.append({"role": "user", "content": user_message})

        while iteration < self.max_iterations:
            iteration += 1
            log_request(request_id, f"iteration={iteration}")

            # Debug logging: validate message structure before sending (OpenAI-compatible format)
            message_roles = [m.get("role") for m in messages if isinstance(m, dict)]
            tool_calls_count = sum(1 for m in messages if isinstance(m, dict) and "tool_calls" in m)

            # Verify all messages have string content
            content_valid = all(
                isinstance(m.get("content"), str) or "tool_calls" in m
                for m in messages if isinstance(m, dict)
            )

            log_request(
                request_id,
                f"msg_roles={message_roles} tool_calls={tool_calls_count} content_valid={content_valid}"
            )

            start_time = time.time()
            try:
                response = await openrouter_client.chat_with_tools(
                    system_prompt=SYSTEM_PROMPT,
                    tools=self.tools,
                    history=messages,
                )
                duration_ms = int((time.time() - start_time) * 1000)
                log_request(request_id, f"llm duration_ms={duration_ms}")
            except Exception as e:
                log_request(request_id, f"llm_error {str(e)}")
                return {
                    "status": "error",
                    "error": str(e),
                    "request_id": request_id,
                }

            choice = response.get("choices", [{}])[0]
            message = choice.get("message", {})
            content = message.get("content")
            tool_calls = message.get("tool_calls", [])

            # Normalize content: must always be string, never None
            if content is None:
                content = ""

            if not tool_calls or choice.get("finish_reason") == "stop":
                log_request(request_id, "request_complete")
                return {
                    "status": "success",
                    "request_id": request_id,
                    "answer": content,
                    "model": openrouter_client.model,
                    "tools_used": tools_used,
                    "evidence": None,
                }

            # Add assistant message with normalized content and tool_calls
            messages.append({"role": "assistant", "content": content, "tool_calls": tool_calls})

            # Process each tool call and add result as separate tool message
            for tool_call in tool_calls:
                tool_name = tool_call.get("function", {}).get("name")
                tool_input = json.loads(tool_call.get("function", {}).get("arguments", "{}"))
                tools_used.append(tool_name)

                start_time = time.time()
                tool_result = await self.execute_tool(tool_name, tool_input)
                duration_ms = int((time.time() - start_time) * 1000)
                log_request(request_id, f"tool={tool_name} duration_ms={duration_ms}")

                # Serialize tool result to string (handles dicts, lists, None, etc)
                tool_content = json.dumps(
                    tool_result,
                    ensure_ascii=False,
                    default=str
                )

                # Add tool result as separate role=tool message (OpenAI-compatible format)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.get("id"),
                    "content": tool_content
                })

        log_request(request_id, "max_iterations_reached")
        return {
            "status": "success",
            "request_id": request_id,
            "answer": "Se alcanzó el límite máximo de consultas. Por favor, intenta con una pregunta más específica.",
            "model": openrouter_client.model,
            "tools_used": tools_used,
            "evidence": None,
        }
