/**
 * Authentication Service
 * Business logic for authentication operations
 */

import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/user.repository.js';
import { JWT_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/index.js';
import { AuthenticationError, ValidationError, ConflictError } from '../exceptions/index.js';
import logger from '../utils/logger.js';

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} User and token
 */
export const registerUser = async (userData) => {
  try {
    const { uname, password, ProPicture, UserTypeID } = userData;

    // Validation
    if (!uname || !password) {
      throw new ValidationError(ERROR_MESSAGES.USER_REQUIRED);
    }

    // Create user
    const user = await userRepo.createUser({
      uname,
      upassword: password,
      ProPicture,
      UserTypeID,
    });

    logger.info(`User registered: ${uname}`);

    return {
      user,
      message: SUCCESS_MESSAGES.USER_REGISTERED,
    };
  } catch (err) {
    logger.error('Register user error:', err.message);
    throw err;
  }
};

/**
 * Authenticate user and generate JWT token
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} Token and user data
 */
export const loginUser = async (username, password) => {
  try {
    // Find user
    const user = await userRepo.findUserByUsername(username);
    if (!user) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password (plain-text comparison per requirements)
    const isValidPassword = password === (user.upassword || '');
    if (!isValidPassword) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Update last password update timestamp
    try {
      await userRepo.updateUser(user.uID, { PasswordUpdate: new Date() });
    } catch (e) {
      logger.warn('Failed to update password timestamp:', e.message);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        uID: user.uID,
        uname: user.uname,
        UserTypeID: user.UserTypeID,
      },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRY }
    );

    logger.info(`User logged in: ${username}`);

    return {
      token,
      user,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    };
  } catch (err) {
    logger.error('Login user error:', err.message);
    throw err;
  }
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      throw new AuthenticationError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  } catch (err) {
    logger.error('Get user error:', err.message);
    throw err;
  }
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} Updated user
 */
export const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await userRepo.updateUser(userId, updateData);
    logger.info(`User profile updated: ${userId}`);

    return user;
  } catch (err) {
    logger.error('Update profile error:', err.message);
    throw err;
  }
};
