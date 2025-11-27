/**
 * User Service
 * Business logic for user management operations
 */

import * as userRepo from '../repositories/user.repository.js';
import { NotFoundError } from '../exceptions/index.js';
import logger from '../utils/logger.js';

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (err) {
    logger.error('Get user service error:', err.message);
    throw err;
  }
};

/**
 * Get all users with pagination
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Promise<object>} Users and pagination info
 */
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const { users, total } = await userRepo.getAllUsers(offset, limit);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    logger.error('Get all users service error:', err.message);
    throw err;
  }
};

/**
 * Update user data
 * @param {number} userId - User ID
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} Updated user
 */
export const updateUser = async (userId, updateData) => {
  try {
    const user = await userRepo.updateUser(userId, updateData);
    logger.info(`User updated: ${userId}`);

    return user;
  } catch (err) {
    logger.error('Update user service error:', err.message);
    throw err;
  }
};

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteUserById = async (userId) => {
  try {
    const result = await userRepo.deleteUser(userId);
    logger.info(`User deleted: ${userId}`);

    return result;
  } catch (err) {
    logger.error('Delete user service error:', err.message);
    throw err;
  }
};
