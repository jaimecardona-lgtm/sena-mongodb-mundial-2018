import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.requests import ChatRequest
from app.models.responses import ChatResponse, HealthResponse, CapabilitiesResponse
from app.agent.agent import Agent
from app.clients.node_api import node_api_client
from app.clients.openrouter import openrouter_client
from app.utils.logging import setup_logging, logger

setup_logging()

# Validate configuration
def validate_config():
    """Validate and log configuration status without exposing secrets"""
    has_api_key = settings.openrouter_api_key is not None and len(settings.openrouter_api_key.strip()) > 0
    model = settings.openrouter_model
    logger.info(f"OpenRouter API key configured: {has_api_key}")
    logger.info(f"OpenRouter model: {model}")
    logger.info(f"Node API base URL: {settings.node_api_base_url}")
    logger.info(f"Frontend origin: {settings.frontend_origin}")

validate_config()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await openrouter_client.close()


app = FastAPI(
    title="World Cup 2018 AI Agent",
    version="1.0.0",
    description="Servicio de inteligencia artificial con herramientas para consultar y analizar datos reales de la Copa Mundial 2018.",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

agent = Agent()


@app.get("/api/ai/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    node_api_reachable = await node_api_client.check_connectivity()
    return HealthResponse(
        status="ok",
        service="world-cup-ai-agent",
        node_api="reachable" if node_api_reachable else "unreachable",
    )


@app.get("/api/ai/capabilities", response_model=CapabilitiesResponse)
async def capabilities():
    """Get available tools and capabilities"""
    return CapabilitiesResponse(
        tools=[
            "get_teams",
            "search_players",
            "get_matches",
            "get_team_summary",
            "compare_teams",
            "get_player_rankings",
        ],
        read_only=True,
    )


@app.post("/api/ai/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with the AI agent"""
    request_id = str(uuid.uuid4())

    try:
        result = await agent.run(
            request_id=request_id,
            user_message=request.message,
            history=request.history,
        )

        if result.get("status") == "error":
            error_msg = result.get("error", "AI service error")
            logger.error(f"[AI][{request_id}] Agent error: {error_msg}")

            # Check if it's an API key config issue
            if "not configured" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="AI service is not configured",
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=error_msg,
                )

        return ChatResponse(
            status="success",
            request_id=request_id,
            answer=result.get("answer", ""),
            model=result.get("model", "unknown"),
            tools_used=result.get("tools_used", []),
            evidence=result.get("evidence"),
        )
    except HTTPException:
        raise
    except ValueError as e:
        # Handle errors from agent/clients (OpenRouter, Node API, etc.)
        error_msg = str(e)
        logger.error(f"[AI][{request_id}] Value error: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=error_msg,
        )
    except Exception as e:
        error_type = type(e).__name__
        error_msg = str(e)
        logger.error(f"[AI][{request_id}] {error_type}: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@app.get("/")
async def root():
    """Root endpoint"""
    return {"service": "world-cup-ai-agent", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
