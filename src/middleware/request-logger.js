/**
 * Request Logger Middleware
 * Logs all incoming requests
 */

import morgan from 'morgan';
import logger from '../utils/logger.js';
import { APP_CONFIG } from '../constants/index.js';

/**
 * Custom Morgan token for user identification
 */
morgan.token('user', (req) => {
  return req.user?.uname || 'anonymous';
});

/**
 * Create request logger middleware
 */
const requestLogger = morgan(
  ':remote-addr - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
  {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
    skip: (req) => {
      // Skip health check and metrics endpoints in production
      if (APP_CONFIG.NODE_ENV === 'production') {
        return req.url === '/health' || req.url === '/metrics';
      }
      return false;
    },
  }
);

export default requestLogger;
