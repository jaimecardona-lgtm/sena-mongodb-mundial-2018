import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapi } from './docs/openapi.js';
import { equipoRoutes } from './routes/equipo.routes.js';
import { jugadorRoutes } from './routes/jugador.routes.js';
import { partidoRoutes } from './routes/partido.routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());

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

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Endpoint not found',
      path: req.originalUrl
    });
  });

  return app;
}
