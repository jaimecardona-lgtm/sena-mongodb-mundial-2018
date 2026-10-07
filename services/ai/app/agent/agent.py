import json
import time
from typing import Optional, List, Dict, Any
from app.clients.openrouter import openrouter_client
from app.clients.node_api import node_api_client
from app.agent.prompts import SYSTEM_PROMPT
from app.agent.tools import get_tool_definitions
from app.utils.logging import logger, log_request


class Agent:
    def __init__(self):
        self.max_iterations = 4
        self.tools = get_tool_definitions()

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
                    team=team, limit=200, sort_by="nombre"
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
        """Main agent loop"""
        log_request(request_id, f"request_start message={user_message[:50]}...")

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
                    user_message=user_message if iteration == 1 else None,
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
