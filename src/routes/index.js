/**
 * Routes Index
 * Central export point for all route modules
 */

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

/**
 * Mount all routes
 * @param {object} app - Express application instance
 */
export const setupRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
};

export { authRoutes, userRoutes };
