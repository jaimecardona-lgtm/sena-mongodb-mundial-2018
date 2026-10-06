import express from 'express';

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
