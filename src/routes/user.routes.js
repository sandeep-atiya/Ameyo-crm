/**
 * User Routes
 * API endpoints for user management operations
 */

import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rate-limiter.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all users with pagination
 * @auth required - Bearer token
 * @query {number} [page=1] - Page number
 * @query {number} [limit=10] - Records per page
 */
router.get('/', authenticate, generalLimiter, userController.getAllUsers);

/**
 * GET /api/users/:userId
 * Get user by ID
 * @auth required - Bearer token
 * @param {number} userId - User ID
 */
router.get('/:userId', authenticate, generalLimiter, userController.getUserById);

/**
 * PUT /api/users/:userId
 * Update user information
 * @auth required - Bearer token
 * @param {number} userId - User ID
 * @body {string} [uname] - Updated username
 * @body {string} [ProPicture] - Updated profile picture URL
 */
router.put('/:userId', authenticate, generalLimiter, userController.updateUser);

/**
 * DELETE /api/users/:userId
 * Delete user
 * @auth required - Bearer token
 * @param {number} userId - User ID
 */
router.delete('/:userId', authenticate, generalLimiter, userController.deleteUser);

export default router;
