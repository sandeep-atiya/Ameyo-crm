import xss from 'xss';

/**
 * Sanitize request body to prevent XSS attacks
 * Recursively cleans all string values in the request body
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // Remove XSS attempts and HTML tags
    return xss(obj, {
      whiteList: {},
      stripIgnoredTag: true,
    });
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Express middleware to sanitize request body, query, and params
 * Prevents XSS attacks by removing malicious scripts and HTML tags
 */
export const sanitizeMiddleware = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

export default sanitizeMiddleware;
