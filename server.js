import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import sequelize from './config/db.js';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logging
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: NODE_ENV,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

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
    process.exit(1);
  }
};

startServer();

export default app;
