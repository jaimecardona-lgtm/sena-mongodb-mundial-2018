from pydantic import BaseModel, Field
from typing import Optional, List


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    conversation_id: Optional[str] = None
    history: Optional[List[dict]] = Field(default=None, max_length=10)


class HealthRequest(BaseModel):
    pass
