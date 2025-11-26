/**
 * User Repository
 * Data access layer for User model - separates database queries from business logic
 */

import db from '../models/index.js';
import { ConflictError, NotFoundError, DatabaseError } from '../exceptions/index.js';
import logger from '../utils/logger.js';

const User = db.tblUser;
const UserType = db.UserType;

/**
 * Create a new user
 * @param {object} userData - User data
 * @returns {Promise<object>} Created user
 */
export const createUser = async (userData) => {
  try {
    const existing = await User.findOne({ where: { uname: userData.uname } });
    if (existing) {
      throw new ConflictError('Username already exists');
    }

    const user = await User.create(userData);
    logger.info(`User created: ${userData.uname}`);
    return user;
  } catch (err) {
    logger.error('Create user error:', err.message);
    if (err instanceof ConflictError) throw err;
    throw new DatabaseError('Failed to create user');
  }
};

/**
 * Find user by ID
 * @param {number} userId - User ID
 * @returns {Promise<object|null>} User object or null
 */
export const findUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: UserType, as: 'userType' }],
    });
    return user;
  } catch (err) {
    logger.error('Find user by ID error:', err.message);
    throw new DatabaseError('Failed to retrieve user');
  }
};

/**
 * Find user by username
 * @param {string} username - Username
 * @returns {Promise<object|null>} User object or null
 */
export const findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({
      where: { uname: username },
      include: [{ model: UserType, as: 'userType' }],
    });
    return user;
  } catch (err) {
    logger.error('Find user by username error:', err.message);
    throw new DatabaseError('Failed to retrieve user');
  }
};

/**
 * Update user
 * @param {number} userId - User ID
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} Updated user
 */
export const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.update(updateData);
    logger.info(`User updated: ${userId}`);
    return user;
  } catch (err) {
    logger.error('Update user error:', err.message);
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to update user');
  }
};

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.destroy();
    logger.info(`User deleted: ${userId}`);
    return true;
  } catch (err) {
    logger.error('Delete user error:', err.message);
    if (err instanceof NotFoundError) throw err;
    throw new DatabaseError('Failed to delete user');
  }
};

/**
 * Get all users with pagination
 * @param {number} offset - Pagination offset
 * @param {number} limit - Records per page
 * @returns {Promise<object>} Users and total count
 */
export const getAllUsers = async (offset = 0, limit = 10) => {
  try {
    const { count, rows } = await User.findAndCountAll({
      include: [{ model: UserType, as: 'userType' }],
      offset,
      limit,
      order: [['uID', 'DESC']],
    });

    return { users: rows, total: count };
  } catch (err) {
    logger.error('Get all users error:', err.message);
    throw new DatabaseError('Failed to retrieve users');
  }
};
