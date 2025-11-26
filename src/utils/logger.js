/**
 * Logger Utility
 * Provides logging functionality using Winston
 */

import winston from 'winston';
import { APP_CONFIG } from '../constants/index.js';

const logger = winston.createLogger({
  level: APP_CONFIG.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'crm-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (APP_CONFIG.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
        )
      ),
    })
  );
}

export default logger;
