import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import swaggerUi from 'swagger-ui-express';

import sequelize from './src/config/db.js';
import swaggerSpecs from './docs/swagger/swaggerConfig.js';
import { logger } from './src/utils/index.js';
import { metricsMiddleware, register } from './utils/metrics.js';
import {
  sanitizeMiddleware,
  requestLogger,
  generalLimiter,
  authLimiter,
  errorHandler,
  notFoundHandler,
} from './src/middleware/index.js';
import { setupRoutes } from './src/routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Sentry for error tracking (if SENTRY_DSN is provided)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || NODE_ENV,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({
        app: true,
        request: true,
      }),
    ],
  });

  // Sentry request handler (must be first)
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Security middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS

// Parsing middleware
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: true }));

// Input sanitization (prevent XSS)
app.use(sanitizeMiddleware);

// Request metrics collection
app.use(metricsMiddleware);

// Request logging
app.use(requestLogger);

// Apply general rate limiter to all routes except health checks and metrics
app.use((req, _res, next) => {
  if (
    req.path === '/health' ||
    req.path === '/live' ||
    req.path === '/ready' ||
    req.path === '/metrics' ||
    req.path.startsWith('/api-docs')
  ) {
    return next();
  }
  return generalLimiter(req, _res, next);
});

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));

// Setup all routes
setupRoutes(app);

// Apply auth rate limiter to auth endpoints
app.use('/api/auth', authLimiter);

// Prometheus metrics endpoint

app.get('/metrics', async (_req, res) => {
  try {
    const metrics = await register.metrics(); // <-- IMPORTANT: await the Promise

    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating Prometheus metrics',
      error: error.message,
    });
  }
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: NODE_ENV,
  });
});

// Liveness probe (is the server alive?)
app.get('/live', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is alive',
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe (is the server ready to serve requests?)
app.get('/ready', async (req, res) => {
  try {
    // Check database connectivity
    await sequelize.authenticate();
    res.status(200).json({
      success: true,
      message: 'Server is ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Readiness check failed: ${error.message}`);
    res.status(503).json({
      success: false,
      message: 'Server not ready',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Sentry error handler (if enabled)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Database and server initialization
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('✅ Database connected successfully');

    // Sync models (use alter for development only, remove in production)
    // Sync models only when explicitly requested via DB_SYNC env var.
    // This prevents Sequelize from auto-altering your existing tables.
    const shouldSync = process.env.DB_SYNC === 'true';
    if (shouldSync) {
      if (NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
      } else {
        await sequelize.sync();
      }
      logger.info('✅ Database models synced');
    } else {
      logger.info('➡️ Skipping sequelize.sync (set DB_SYNC=true to enable)');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`✅ Server started on port ${PORT} [${NODE_ENV}]`);
    });
  } catch (error) {
    logger.error(`❌ Server startup failed: ${error.message}`);
    throw error;
  }
};

startServer();

export default app;
