from typing import List, Dict, Any


def get_tool_definitions() -> List[Dict[str, Any]]:
    return [
        {
            "type": "function",
            "function": {
                "name": "get_teams",
                "description": "Obtiene la lista de los 32 equipos de la Copa Mundial 2018, opcionalmente filtrados por confederación",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "confederation": {
                            "type": "string",
                            "description": "Confederación (AFC, CAF, CONCACAF, CONMEBOL, OFC, UEFA)",
                            "enum": ["AFC", "CAF", "CONCACAF", "CONMEBOL", "OFC", "UEFA"],
                        }
                    },
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "search_players",
                "description": "Busca y filtra los 736 jugadores con opciones avanzadas de búsqueda, filtrado y ordenamiento",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "team": {
                            "type": "string",
                            "description": "Nombre del equipo (ej: Colombia, Japan)",
                        },
                        "position": {
                            "type": "string",
                            "description": "Posición del jugador (CB, CF, CM, GK)",
                            "enum": ["CB", "CF", "CM", "GK"],
                        },
                        "min_height": {
                            "type": "integer",
                            "description": "Altura mínima en cm",
                        },
                        "max_height": {
                            "type": "integer",
                            "description": "Altura máxima en cm",
                        },
                        "name": {
                            "type": "string",
                            "description": "Nombre del jugador (búsqueda parcial)",
                        },
                        "sort_by": {
                            "type": "string",
                            "description": "Campo por el que ordenar",
                            "enum": ["nombre", "estatura", "peso", "numero"],
                            "default": "nombre",
                        },
                        "order": {
                            "type": "string",
                            "description": "Orden ascendente o descendente",
                            "enum": ["asc", "desc"],
                            "default": "asc",
                        },
                        "limit": {
                            "type": "integer",
                            "description": "Cantidad máxima de resultados (max 200)",
                            "default": 50,
                        },
                    },
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_matches",
                "description": "Obtiene los 60 partidos del torneo, opcionalmente filtrados por equipo o fecha",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "team": {
                            "type": "string",
                            "description": "Nombre del equipo",
                        },
                        "date": {
                            "type": "string",
                            "description": "Fecha en formato DD/MM/YY",
                        },
                    },
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_team_summary",
                "description": "Obtiene un resumen completo de un equipo incluyendo cantidad de jugadores, estaturas promedio, posiciones y partidos",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "team": {
                            "type": "string",
                            "description": "Nombre del equipo (requerido)",
                        }
                    },
                    "required": ["team"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "compare_teams",
                "description": "Compara dos equipos mostrando cantidad de jugadores, estaturas promedio, distribución de posiciones y cantidad de partidos",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "team_a": {
                            "type": "string",
                            "description": "Primer equipo (requerido)",
                        },
                        "team_b": {
                            "type": "string",
                            "description": "Segundo equipo (requerido)",
                        },
                    },
                    "required": ["team_a", "team_b"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_player_rankings",
                "description": "Obtiene un ranking de jugadores ordenados por una métrica (altura o peso)",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "metric": {
                            "type": "string",
                            "description": "Métrica de ordenamiento",
                            "enum": ["height", "weight"],
                        },
                        "order": {
                            "type": "string",
                            "description": "Orden (ascendente o descendente)",
                            "enum": ["asc", "desc"],
                            "default": "desc",
                        },
                        "team": {
                            "type": "string",
                            "description": "Filtrar por equipo (opcional)",
                        },
                        "limit": {
                            "type": "integer",
                            "description": "Cantidad de resultados (max 100)",
                            "default": 10,
                        },
                    },
                    "required": ["metric"],
                },
            },
        },
    ]
