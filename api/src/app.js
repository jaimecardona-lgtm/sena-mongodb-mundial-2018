import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { openapi } from './docs/openapi.js';
import { equipoRoutes } from './routes/equipo.routes.js';
import { jugadorRoutes } from './routes/jugador.routes.js';
import { partidoRoutes } from './routes/partido.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NODE_ENV = process.env.NODE_ENV || 'development';

export function createApp() {
  const app = express();

  app.use(express.json());

  // FastAPI AI proxy (BEFORE other /api routes)
  // Routes /api/ai/* to http://127.0.0.1:8000/api/ai/*
  app.use('/api/ai', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',
    changeOrigin: true
  }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'sena-mundial-2018-api'
    });
  });

  // CRUD endpoints
  app.use('/api/equipos', equipoRoutes);
  app.use('/api/jugadores', jugadorRoutes);
  app.use('/api/partidos', partidoRoutes);

  // OpenAPI specification endpoint
  app.get('/api-docs.json', (req, res) => {
    res.json(openapi);
  });

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi, {
    explorer: true
  }));

  // Serve React in production
  if (NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../../frontend/dist');

    // Serve static assets
    app.use(express.static(distPath));

    // SPA fallback for React Router
    app.get('*', (req, res) => {
      // Don't fallback for API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({
          status: 'error',
          message: 'Endpoint not found',
          path: req.originalUrl
        });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development 404 handler
    app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        path: req.originalUrl
      });
    });
  }

  return app;
}
