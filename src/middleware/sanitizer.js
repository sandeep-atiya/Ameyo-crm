/**
 * Sanitizer Middleware
 * Sanitizes incoming requests to prevent XSS and injection attacks
 */

import { sanitizeObject } from '../utils/sanitizer.js';

/**
 * Middleware to sanitize request body, params, and query
 */
export const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  // req.query is read-only, so sanitize its values in place
  if (req.query && typeof req.query === 'object') {
    for (const [key, value] of Object.entries(req.query)) {
      req.query[key] = sanitizeObject({ val: value }).val;
    }
  }

  next();
};
