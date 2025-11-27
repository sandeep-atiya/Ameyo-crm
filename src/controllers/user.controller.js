/**
 * User Controller
 * Handles user management HTTP requests
 */

import * as userService from '../services/user.service.js';
import { sanitizeUser, formatSuccessResponse, logger } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Get user by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(HTTP_STATUS.OK, 'User retrieved successfully', {
        user: sanitizeUser(user),
      })
    );
  } catch (err) {
    logger.error('Get user controller error:', err.message);
    next(err);
  }
};

/**
 * Get all users with pagination
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);

    const result = await userService.getAllUsers(page, limit);

    res
      .status(HTTP_STATUS.OK)
      .json(formatSuccessResponse(HTTP_STATUS.OK, 'Users retrieved successfully', result));
  } catch (err) {
    logger.error('Get all users controller error:', err.message);
    next(err);
  }
};

/**
 * Update user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updated = await userService.updateUser(userId, req.body);

    res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(HTTP_STATUS.OK, 'User updated successfully', {
        user: sanitizeUser(updated),
      })
    );
  } catch (err) {
    logger.error('Update user controller error:', err.message);
    next(err);
  }
};

/**
 * Delete user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await userService.deleteUserById(userId);

    res
      .status(HTTP_STATUS.OK)
      .json(formatSuccessResponse(HTTP_STATUS.OK, 'User deleted successfully', {}));
  } catch (err) {
    logger.error('Delete user controller error:', err.message);
    next(err);
  }
};
