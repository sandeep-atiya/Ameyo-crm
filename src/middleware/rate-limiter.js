/**
 * Rate Limiter Middleware
 * Protects API endpoints from brute force attacks
 */

import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_CONFIG, APP_CONFIG, HTTP_STATUS } from '../constants/index.js';
import { formatErrorResponse } from '../utils/response-formatter.js';
import logger from '../utils/logger.js';

// Select rate limit config based on environment
const config =
  APP_CONFIG.NODE_ENV === 'production' ? RATE_LIMIT_CONFIG.PROD : RATE_LIMIT_CONFIG.DEV;

/**
 * Generic rate limiter factory
 */
const createLimiter = (windowMs, max, message = 'Too many requests') =>
  rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: false,
    skip: (req) => {
      if (req.user && req.user.uID === 1) return true; // Skip for admin
      return false;
    },
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for ${req.ip}`);
      res
        .status(HTTP_STATUS.TOO_MANY_REQUESTS)
        .json(formatErrorResponse(429, 'Too many requests. Please try again later.', []));
    },
  });

/**
 * Rate limiter for authentication endpoints (register/login)
 */
export const authLimiter = createLimiter(
  config.REGISTER_AUTH.windowMs,
  config.REGISTER_AUTH.max,
  'Too many authentication attempts. Please try again later.'
);

/**
 * General rate limiter for all API endpoints
 */
export const generalLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests. Please try again later.'
);

/**
 * Strict rate limiter for sensitive operations
 */
export const strictLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 requests
  'Too many sensitive operations. Please try again later.'
);
