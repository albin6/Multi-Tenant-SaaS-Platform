import { createApp } from './app';
import { appConfig } from './core/config/env.config';
import { database } from './core/config/database.config';
import { logger } from './core/utils/logger';

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(appConfig.port, () => {
      logger.info(`
        ╔════════════════════════════════════════════════════════╗
        ║                                                        ║
        ║  🚀 Server started successfully                        ║
        ║                                                        ║
        ║  Environment: ${appConfig.env.padEnd(37)}║
        ║  Port: ${String(appConfig.port).padEnd(43)}║
        ║  API Version: ${appConfig.apiVersion.padEnd(38)}║
        ║                                                        ║
        ║  🔗 http://localhost:${appConfig.port}${' '.padEnd(27)}║
        ║  📝 API: http://localhost:${appConfig.port}/api/${appConfig.apiVersion}${' '.padEnd(13)}║
        ║  ❤️  Health: http://localhost:${appConfig.port}/health${' '.padEnd(15)}║
        ║                                                        ║
        ╚════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await database.disconnect();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error({ error }, 'Error during graceful shutdown');
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason: Error) => {
      logger.error({ reason }, 'Unhandled Rejection');
      throw reason;
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error({ error }, 'Uncaught Exception');
      process.exit(1);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Start the server
startServer();
