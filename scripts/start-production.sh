#!/bin/bash
set -e

# World Cup 2018 Data Hub - Production Startup Script

echo "Starting World Cup 2018 Data Hub..."

# Set defaults
PORT=${PORT:-8080}
NODE_ENV=${NODE_ENV:-production}

# Calculate internal Node URL (used by FastAPI)
NODE_API_BASE_URL="http://127.0.0.1:${PORT}"

echo "Configuration:"
echo "  PORT: $PORT"
echo "  NODE_ENV: $NODE_ENV"
echo "  NODE_API_BASE_URL: $NODE_API_BASE_URL"

# Function to handle signals
cleanup() {
  echo "Received SIGTERM, cleaning up..."
  if [ ! -z "$FASTAPI_PID" ]; then
    kill $FASTAPI_PID 2>/dev/null || true
  fi
  if [ ! -z "$NODE_PID" ]; then
    kill $NODE_PID 2>/dev/null || true
  fi
  exit 0
}

trap cleanup SIGTERM SIGINT

# Start FastAPI (internal, port 8000)
echo "Starting FastAPI AI Agent..."
cd /app/services/ai

export NODE_API_BASE_URL="${NODE_API_BASE_URL}"
export PYTHONUNBUFFERED=1

uvicorn app.main:app \
  --host 127.0.0.1 \
  --port 8000 \
  --no-access-log &

FASTAPI_PID=$!
echo "FastAPI started with PID $FASTAPI_PID"

# Give FastAPI time to start
sleep 3

# Start Node/Express (public gateway)
echo "Starting Node/Express API Gateway..."
cd /app/api

export PORT="${PORT}"
export NODE_ENV="${NODE_ENV}"
export NODE_API_BASE_URL="${NODE_API_BASE_URL}"

node src/server.js &

NODE_PID=$!
echo "Node started with PID $NODE_PID"

echo "World Cup 2018 Data Hub is running!"
echo "  Public endpoint: http://0.0.0.0:${PORT}"
echo "  Health check: /api/health"
echo "  Swagger docs: /api-docs"

# Wait for both processes
wait $FASTAPI_PID $NODE_PID
