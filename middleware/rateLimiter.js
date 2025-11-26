import rateLimit from 'express-rate-limit';

const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * General API rate limiter
 * - Development: 1000 requests per 15 minutes
 * - Production: 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (_req, _res) => NODE_ENV === 'test', // Skip rate limiting in test environment
});

/**
 * Authentication rate limiter (stricter)
 * - Development: 30 requests per 15 minutes
 * - Production: 5 requests per 15 minutes
 * Prevents brute force attacks on login/register endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 5 : 30,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req, _res) => NODE_ENV === 'test',
  keyGenerator: (req, _res) => {
    // Rate limit by IP and username combination for auth endpoints
    return `${req.ip}-${req.body?.uname || 'unknown'}`;
  },
});

/**
 * Strict rate limiter for sensitive operations
 * - Development: 10 requests per 15 minutes
 * - Production: 2 requests per 15 minutes
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 2 : 10,
  message: 'Too many requests to this endpoint, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (_req, _res) => NODE_ENV === 'test',
});

export default generalLimiter;
