/**
 * Profile Endpoints Swagger Documentation
 * Location: docs/swagger/endpoints/profile.swagger.js
 *
 * Documents:
 * - GET /api/auth/profile - Get user profile
 * - PUT /api/auth/profile - Update user profile
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get user profile
 *     description: |
 *       Retrieves the current authenticated user's profile information.
 *
 *       **Authentication:** Required (Bearer Token)
 *
 *       **Rate Limited:** 1000 requests per 15 minutes (dev), 100 (prod)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     uname:
 *                       type: string
 *                       example: john_doe
 *                     ProPicture:
 *                       type: string
 *                       format: uri
 *                       nullable: true
 *                     UserTypeId:
 *                       type: integer
 *                       example: 2
 *                     UserType:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                           enum: [Admin, Manager, User]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update user profile
 *     description: |
 *       Updates the current authenticated user's profile information.
 *
 *       **Authentication:** Required (Bearer Token)
 *
 *       **Rate Limited:** 1000 requests per 15 minutes (dev), 100 (prod)
 *
 *       **Updateable fields:** password, ProPicture
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: NewPassword123!
 *                 description: New password (optional)
 *               ProPicture:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/new-profile.jpg
 *                 description: New profile picture URL (optional)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     uname:
 *                       type: string
 *                     ProPicture:
 *                       type: string
 *                       format: uri
 *                       nullable: true
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */

// Placeholder export for JSDoc parsing
export {};
