# Multi-stage Dockerfile for World Cup 2018 Data Hub
# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy frontend source
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend

# Install dependencies and build
RUN npm ci && npm run build

# Stage 2: Runtime
FROM node:22-slim

# Install Python and necessary system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy API source
COPY api ./api
COPY api/package*.json ./api/

# Install Node dependencies for API
WORKDIR /app/api
RUN npm ci --omit=dev

# Copy Python services
WORKDIR /app
COPY services/ai ./services/ai
COPY services/ai/requirements.txt ./services/ai/

# Install Python dependencies
RUN pip install --no-cache-dir -r ./services/ai/requirements.txt

# Copy frontend build from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy additional assets
COPY frontend/public/assets ./frontend/public/assets 2>/dev/null || true

# Copy documentation
COPY docs ./docs

# Copy data directory (for reference, actual data comes from DB)
COPY data ./data 2>/dev/null || true

# Set working directory to API
WORKDIR /app/api

# Copy start script
COPY scripts/start-production.sh /app/start-production.sh
RUN chmod +x /app/start-production.sh

# Expose port (Render will set PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["/app/start-production.sh"]
