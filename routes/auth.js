import express from 'express';
import {
  validateBody,
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register user (expects: uname, password, optional ProPicture)
router.post('/register', validateBody(registerSchema), authController.register);

// Login (expects: uname, password)
router.post('/login', validateBody(loginSchema), authController.login);

// Protected profile routes
router.get('/profile', authenticate, authController.getProfile);
router.put(
  '/profile',
  authenticate,
  validateBody(updateProfileSchema),
  authController.updateProfile
);

export default router;
