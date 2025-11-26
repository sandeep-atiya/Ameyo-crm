/**
 * Error Handler Middleware
 * Centralized error handling for all application errors
 */

import { formatErrorResponse } from '../utils/response-formatter.js';
import { AppError } from '../exceptions/index.js';
import logger from '../utils/logger.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Global error handler middleware
 * Must be the last middleware registered
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    code: err.code || 'UNKNOWN',
    statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    url: req.originalUrl,
    method: req.method,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(formatErrorResponse(err.statusCode, err.message, err.errors));
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    const errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(formatErrorResponse(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(formatErrorResponse(HTTP_STATUS.UNAUTHORIZED, 'Invalid token'));
  }

  if (err.name === 'TokenExpiredError') {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(formatErrorResponse(HTTP_STATUS.UNAUTHORIZED, 'Token expired'));
  }

  // Default error response
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json(formatErrorResponse(statusCode, message, []));
};

/**
 * 404 Not Found middleware
 * Should be placed after all other routes
 */
export const notFoundHandler = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res
    .status(HTTP_STATUS.NOT_FOUND)
    .json(formatErrorResponse(HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`));
};
