import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    console.log(`\n[${new Date().toISOString()}] Iniciando servidor API...`);
    console.log(`NODE_ENV: ${NODE_ENV}`);

    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(PORT, '0.0.0.0', () => {
      const host = NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
      console.log(`\n✓ API Server listening on http://${host}:${PORT}`);
      console.log(`✓ GET /api/health - Health check endpoint\n`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\nShutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('\n✗ Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
