/**
 * Data Sanitization Utility
 * Provides functions for cleaning and sanitizing user data
 */

import xss from 'xss';

/**
 * Sanitize user object by removing sensitive fields
 * @param {object} userInstance - User model instance or object
 * @returns {object} Sanitized user object
 */
export const sanitizeUser = (userInstance) => {
  if (!userInstance) return null;

  const user = userInstance.toJSON ? userInstance.toJSON() : userInstance;

  // Remove sensitive fields
  delete user.upassword;
  delete user.PasswordUpdate;

  return user;
};

/**
 * Sanitize string input against XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  return xss(input, {
    whiteList: {},
    stripIgnoreTag: true,
  });
};

/**
 * Sanitize object recursively
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};
