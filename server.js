import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import swaggerUi from 'swagger-ui-express';

import sequelize from './config/db.js';
import swaggerSpecs from './docs/swagger/swaggerConfig.js';
import logger from './utils/logger.js';
import { metricsMiddleware, register } from './utils/metrics.js';
import { sanitizeMiddleware } from './middleware/sanitizer.js';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';

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

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logging
app.use((req, res, _next) => {
  logger.http(`${req.method} ${req.path}`);
  _next();
});

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

// Routes
// Auth routes with stricter rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Prometheus metrics endpoint
app.get('/metrics', (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
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
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  logger.error(`Error: ${err.message}`);

  // Send error to Sentry if enabled
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

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
