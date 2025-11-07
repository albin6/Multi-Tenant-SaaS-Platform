import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { appConfig } from './core/config/env.config';
import { logger } from './core/utils/logger';
import { errorHandler, notFoundHandler } from './core/middleware/error.middleware';
import { globalRateLimiter } from './core/middleware/rate-limit.middleware';

// Import routes
import authRoutes from './modules/auth/routes/auth.routes';
import userRoutes from './modules/user/routes/user.routes';
import organizationRoutes from './modules/organization/routes/organization.routes';
import paymentRoutes from './modules/payment/routes/payment.routes';
import planRoutes from './modules/organization/routes/plan.routes';

// Import subdomain middleware
import { subdomainDetection } from './core/middleware/subdomain.middleware';

/**
 * Express application setup
 */
export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration - Allow subdomains
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          return callback(null, true);
        }

        // Allow configured origin
        if (origin === appConfig.cors.origin) {
          return callback(null, true);
        }

        // Allow any subdomain of localhost (e.g., acme.localhost:3000)
        if (origin.match(/^https?:\/\/[\w-]+\.localhost(:\d+)?$/)) {
          return callback(null, true);
        }

        // Allow Render frontend domain and its subdomains
        if (origin.match(/^https:\/\/[\w-]+\.onrender\.com$/)) {
          return callback(null, true);
        }

        // Allow main frontend domain (without subdomain)
        if (origin === 'https://multi-tenant-saas-platform-1.onrender.com') {
          return callback(null, true);
        }

        // Reject other origins
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware
  app.use(compression());

  // Rate limiting
  app.use(globalRateLimiter);

  // Request logging
  app.use((req, _res, next) => {
    logger.info({
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
    next();
  });

  // Subdomain detection middleware (before routes)
  app.use(subdomainDetection);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      environment: appConfig.env,
    });
  });

  // API routes
  app.use(`/api/${appConfig.apiVersion}/auth`, authRoutes);
  app.use(`/api/${appConfig.apiVersion}/users`, userRoutes);
  app.use(`/api/${appConfig.apiVersion}/organizations`, organizationRoutes);
  app.use(`/api/${appConfig.apiVersion}/payments`, paymentRoutes);
  app.use(`/api/${appConfig.apiVersion}/plans`, planRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};
