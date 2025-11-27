/**
 * Response Formatter Utility
 * Provides consistent response formatting for API endpoints
 */

/**
 * Format success response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @returns {object} Formatted response object
 */
export const formatSuccessResponse = (statusCode = 200, message = 'Success', data = null) => ({
  success: true,
  statusCode,
  message,
  data,
  timestamp: new Date().toISOString(),
});

/**
 * Format error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {array} errors - Array of error details
 * @returns {object} Formatted error response object
 */
export const formatErrorResponse = (statusCode = 500, message = 'Error', errors = []) => ({
  success: false,
  statusCode,
  message,
  errors: errors.length > 0 ? errors : undefined,
  timestamp: new Date().toISOString(),
});

/**
 * Format validation error response
 * @param {array} validationErrors - Joi validation error details
 * @returns {array} Formatted validation errors
 */
export const formatValidationErrors = (validationErrors = []) =>
  validationErrors.map((error) => ({
    field: error.path?.join('.') || 'unknown',
    message: error.message,
    type: error.type,
  }));
