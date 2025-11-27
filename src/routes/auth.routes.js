/**
 * Authentication Routes
 * API endpoints for user authentication operations
 */

import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rate-limiter.js';
import { validateBody } from '../validations/validation-middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validations/auth.validation.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * @body {string} uname - Username (3-50 chars)
 * @body {string} password - Password (8+ chars, must include uppercase, lowercase, number, special char)
 * @body {string} [ProPicture] - Optional profile picture URL
 * @body {number} [UserTypeID] - Optional user type ID
 */
router.post('/register', authLimiter, validateBody(registerSchema), authController.register);

/**
 * POST /api/auth/login
 * Authenticate user and get JWT token
 * @body {string} uname - Username
 * @body {string} password - Password
 * @returns {object} token - JWT token
 * @returns {object} user - User information
 */
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);

/**
 * GET /api/auth/profile
 * Get authenticated user's profile
 * @auth required - Bearer token
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * PUT /api/auth/profile
 * Update authenticated user's profile
 * @auth required - Bearer token
 * @body {string} [uname] - Updated username
 * @body {string} [ProPicture] - Updated profile picture URL
 */
router.put(
  '/profile',
  authenticate,
  validateBody(updateProfileSchema),
  authController.updateProfile
);

export default router;
