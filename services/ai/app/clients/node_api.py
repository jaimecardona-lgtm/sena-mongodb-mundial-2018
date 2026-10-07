import httpx
from typing import Optional, List, Dict, Any
from app.config import settings
from app.utils.logging import logger


class NodeAPIClient:
    def __init__(self):
        self.base_url = settings.node_api_base_url
        self.timeout = 10.0

    async def get_teams(self, confederation: Optional[str] = None) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/equipos",
                    timeout=self.timeout,
                )
                response.raise_for_status()
                data = response.json()
                teams = data.get("data", [])

                if confederation:
                    teams = [t for t in teams if t.get("confederation") == confederation]

                return teams
            except Exception as e:
                logger.error(f"Error fetching teams: {e}")
                raise

    async def search_players(
        self,
        team: Optional[str] = None,
        position: Optional[str] = None,
        min_height: Optional[int] = None,
        max_height: Optional[int] = None,
        name: Optional[str] = None,
        sort_by: str = "nombre",
        order: str = "asc",
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        limit = min(limit, 1000)  # Max 1000 to include all 736 players for global rankings

        params = {}
        if team:
            params["team"] = team
        if position:
            params["posicion"] = position
        if min_height:
            params["estaturaMin"] = min_height
        if max_height:
            params["estaturaMax"] = max_height

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/jugadores",
                    params=params,
                    timeout=self.timeout,
                )
                response.raise_for_status()
                data = response.json()
                players = data.get("data", [])

                # Filter by name if provided
                if name:
                    players = [
                        p for p in players
                        if name.lower() in p.get("nombre", "").lower()
                    ]

                # Sort
                sort_key_map = {
                    "nombre": "nombre",
                    "estatura": "estatura",
                    "peso": "peso",
                    "numero": "numero",
                }
                sort_key = sort_key_map.get(sort_by, "nombre")
                reverse = order == "desc"
                players = sorted(players, key=lambda p: p.get(sort_key, 0), reverse=reverse)

                return players[:limit]
            except Exception as e:
                logger.error(f"Error searching players: {e}")
                raise

    async def get_matches(
        self,
        team: Optional[str] = None,
        date: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        params = {}
        if team:
            params["equipo"] = team
        if date:
            params["fecha"] = date

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/partidos",
                    params=params,
                    timeout=self.timeout,
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", [])
            except Exception as e:
                logger.error(f"Error fetching matches: {e}")
                raise

    async def check_connectivity(self) -> bool:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/health",
                    timeout=self.timeout,
                )
                return response.status_code == 200
            except:
                return False


node_api_client = NodeAPIClient()
