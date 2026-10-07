import httpx
import json
from typing import Optional, List, Dict, Any
from app.config import settings
from app.utils.logging import logger


class OpenRouterClient:
    def __init__(self):
        self.api_key = settings.openrouter_api_key
        self.model = settings.openrouter_model
        self.base_url = "https://openrouter.ai/api/v1"
        self.client: Optional[httpx.AsyncClient] = None
        self.timeout = httpx.Timeout(20.0, connect=5.0)

    def is_configured(self) -> bool:
        return self.api_key is not None and self.api_key.strip() != ""

    def _extract_upstream_error(self, exc: httpx.HTTPStatusError) -> str:
        """Extract error message from OpenRouter response body safely"""
        try:
            payload = exc.response.json()

            # Handle different error response structures
            if isinstance(payload, dict):
                # Try to get error.message (common structure)
                if "error" in payload:
                    error_obj = payload["error"]
                    if isinstance(error_obj, dict):
                        return error_obj.get("message", str(error_obj))
                    else:
                        return str(error_obj)

                # Try to get message directly
                if "message" in payload:
                    return str(payload["message"])

            return None
        except Exception:
            return None

    def _get_error_message(self, status_code: int, upstream_msg: Optional[str] = None) -> str:
        """Map HTTP status codes to user-friendly messages with optional upstream detail"""
        status_messages = {
            400: "OpenRouter request validation failed",
            401: "OpenRouter authentication failed - check API key",
            402: "OpenRouter payment required - insufficient credits",
            404: "OpenRouter model or endpoint not found",
            429: "OpenRouter rate limit exceeded - try again later",
            500: "OpenRouter service error",
            502: "OpenRouter service unavailable",
            503: "OpenRouter service unavailable",
        }

        base_message = status_messages.get(
            status_code, f"OpenRouter request failed with status {status_code}"
        )

        if upstream_msg:
            return f"{base_message}: {upstream_msg}"
        return base_message

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create persistent AsyncClient"""
        if self.client is None:
            self.client = httpx.AsyncClient(timeout=self.timeout)
        return self.client

    async def close(self):
        """Close the persistent client connection"""
        if self.client is not None:
            await self.client.aclose()
            self.client = None

    async def chat_with_tools(
        self,
        system_prompt: str,
        tools: List[Dict[str, Any]],
        history: Optional[List[dict]] = None,
    ) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("OpenRouter API key not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        # Build messages with system prompt as first message (OpenAI-compatible format)
        messages = [
            {"role": "system", "content": system_prompt}
        ]

        if history:
            messages.extend(history[-10:])

        payload = {
            "model": self.model,
            "messages": messages,
            "tools": tools,
            "tool_choice": "auto",
            "max_tokens": 700,
        }

        # Log request structure for diagnostics (without sensitive data)
        message_roles = [m.get("role") for m in messages]
        logger.debug(
            f"OpenRouter request: "
            f"model={self.model}, "
            f"message_roles={message_roles}, "
            f"tools={len(tools)}, "
            f"tool_choice=auto"
        )

        client = await self._get_client()
        try:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                json=payload,
                headers=headers,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code
            upstream_msg = self._extract_upstream_error(exc)
            error_msg = self._get_error_message(status_code, upstream_msg)

            log_detail = upstream_msg if upstream_msg else "no details"
            logger.error(f"OpenRouter HTTP {status_code}: {log_detail}")

            raise ValueError(error_msg)
        except httpx.RequestError as exc:
            logger.error(f"OpenRouter connection error: {type(exc).__name__}")
            raise ValueError("Unable to reach OpenRouter - connection failed")
        except Exception as e:
            logger.error(f"OpenRouter error: {type(e).__name__}")
            raise


openrouter_client = OpenRouterClient()
