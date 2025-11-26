/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

import * as authService from '../services/auth.service.js';
import { sanitizeUser, formatSuccessResponse, logger } from '../utils/index.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../constants/index.js';

/**
 * Register endpoint handler
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const register = async (req, res, next) => {
  try {
    const { user } = await authService.registerUser(req.body);

    res.status(HTTP_STATUS.CREATED).json(
      formatSuccessResponse(HTTP_STATUS.CREATED, SUCCESS_MESSAGES.USER_REGISTERED, {
        user: sanitizeUser(user),
      })
    );
  } catch (err) {
    logger.error('Register controller error:', err.message);
    next(err);
  }
};

/**
 * Login endpoint handler
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const login = async (req, res, next) => {
  try {
    const { uname, password } = req.body;
    const { token, user } = await authService.loginUser(uname, password);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
        token,
        user: sanitizeUser(user),
      })
    );
  } catch (err) {
    logger.error('Login controller error:', err.message);
    next(err);
  }
};

/**
 * Get profile endpoint handler
 * @param {object} req - Express request object with authenticated user
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.uID;

    const user = await authService.getUserById(userId);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(HTTP_STATUS.OK, SUCCESS_MESSAGES.PROFILE_FETCHED, {
        user: sanitizeUser(user),
      })
    );
  } catch (err) {
    logger.error('Get profile controller error:', err.message);
    next(err);
  }
};

/**
 * Update profile endpoint handler
 * @param {object} req - Express request object with authenticated user
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.uID;
    const updated = await authService.updateUserProfile(userId, req.body);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(HTTP_STATUS.OK, SUCCESS_MESSAGES.PROFILE_UPDATED, {
        user: sanitizeUser(updated),
      })
    );
  } catch (err) {
    logger.error('Update profile controller error:', err.message);
    next(err);
  }
};
