from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    openrouter_api_key: Optional[str] = None
    openrouter_model: str = "nvidia/nemotron-3.5-lightning:free"
    node_api_base_url: str = "http://localhost:3000"
    frontend_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
