/**
 * Validation Middleware
 * Centralized middleware for request body, params, and query validation
 */

import { formatValidationErrors, formatErrorResponse } from '../utils/response-formatter.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Generic validation middleware for request body
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = formatValidationErrors(error.details);
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(formatErrorResponse(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors));
  }

  req.body = value;
  return next();
};

/**
 * Generic validation middleware for URL parameters
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = formatValidationErrors(error.details);
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(formatErrorResponse(HTTP_STATUS.BAD_REQUEST, 'Invalid parameters', errors));
  }

  req.params = value;
  return next();
};

/**
 * Generic validation middleware for query strings
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = formatValidationErrors(error.details);
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(formatErrorResponse(HTTP_STATUS.BAD_REQUEST, 'Invalid query parameters', errors));
  }

  req.query = value;
  return next();
};
