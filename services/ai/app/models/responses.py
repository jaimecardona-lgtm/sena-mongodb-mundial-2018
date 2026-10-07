from pydantic import BaseModel
from typing import List, Optional, Any


class ChatResponse(BaseModel):
    status: str
    request_id: str
    answer: str
    model: str
    tools_used: List[str] = []
    evidence: Optional[List[dict]] = None


class HealthResponse(BaseModel):
    status: str
    service: str
    node_api: str


class CapabilitiesResponse(BaseModel):
    tools: List[str]
    read_only: bool


class ErrorResponse(BaseModel):
    status: str
    error: str
    request_id: Optional[str] = None
