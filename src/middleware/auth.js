/**
 * Authentication Middleware
 * Verifies JWT tokens and sets user context
 */

import jwt from 'jsonwebtoken';
import { JWT_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';
import { formatErrorResponse } from '../utils/response-formatter.js';

/**
 * Authenticate and verify JWT token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(formatErrorResponse(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN));
    }

    const token = authHeader.substring(7);

    jwt.verify(token, JWT_CONFIG.SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json(formatErrorResponse(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN));
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(formatErrorResponse(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN));
  }
};

/**
 * Optional authentication middleware
 * Attempts to verify token but doesn't fail if missing
 */
export const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      jwt.verify(token, JWT_CONFIG.SECRET, (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
      });
    }

    next();
  } catch (err) {
    next();
  }
};
