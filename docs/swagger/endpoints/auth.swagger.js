/**
 * Authentication Endpoints Swagger Documentation
 * Location: docs/swagger/endpoints/auth.swagger.js
 *
 * Documents:
 * - POST /api/auth/register - User registration
 * - POST /api/auth/login - User login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: |
 *       Creates a new user account with username and password.
 *       
 *       **Rate Limited:** 30 requests per 15 minutes (dev), 5 (prod)
 *       
 *       **Security:** Input sanitized against XSS attacks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uname
 *               - password
 *             properties:
 *               uname:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: john_doe
 *                 description: Unique username
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: SecurePass123!
 *                 description: User password (min 6 characters)
 *               ProPicture:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/profile.jpg
 *                 description: Optional profile picture URL
 *                 nullable: true
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     uname:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or user already exists
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
 *                   example: User already exists
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       429:
 *         description: Too many registration attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Too many authentication attempts, please try again later.
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
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: |
 *       Authenticates a user and returns a JWT token for subsequent requests.
 *       
 *       **Rate Limited:** 30 requests per 15 minutes (dev), 5 (prod)
 *       
 *       **Rate limit key:** Combined IP + username
 *       
 *       **Security:** Rate limited to prevent brute force attacks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uname
 *               - password
 *             properties:
 *               uname:
 *                 type: string
 *                 example: john_doe
 *                 description: Username
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT token (valid for 7 days)
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     uname:
 *                       type: string
 *                     UserType:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       401:
 *         description: Invalid credentials
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
 *                   example: Invalid username or password
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Too many authentication attempts, please try again later.
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
