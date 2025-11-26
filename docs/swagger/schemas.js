/**
 * Swagger Components & Schema Definitions
 * Location: docs/swagger/schemas.js
 *
 * Central location for all reusable Swagger schemas
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         JWT token obtained from login endpoint.
 *         Include in Authorization header as: Bearer <token>
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User unique identifier
 *           example: 1
 *         uname:
 *           type: string
 *           description: Username
 *           example: john_doe
 *           minLength: 3
 *           maxLength: 50
 *         password:
 *           type: string
 *           description: User password (hashed in database)
 *           format: password
 *         ProPicture:
 *           type: string
 *           format: uri
 *           description: Profile picture URL
 *           nullable: true
 *           example: https://example.com/profile.jpg
 *         UserTypeId:
 *           type: integer
 *           description: Foreign key to UserType
 *           example: 2
 *         UserType:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *               enum: [Admin, Manager, User]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-11-26T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-11-26T10:30:00Z
 *       required:
 *         - id
 *         - uname
 *         - UserTypeId
 *
 *     UserType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           enum: [Admin, Manager, User]
 *           example: Admin
 *         description:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           type: object
 *           description: Response payload (varies by endpoint)
 *         token:
 *           type: string
 *           description: JWT token (for auth endpoints only)
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: An error occurred
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *           nullable: true
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Validation failed
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: uname
 *               message:
 *                 type: string
 *                 example: Username is required
 *
 *     RateLimitError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Too many requests from this IP, please try again later.
 *         retryAfter:
 *           type: integer
 *           description: Seconds to wait before retrying
 *           example: 900
 *       headers:
 *         RateLimit-Limit:
 *           schema:
 *             type: integer
 *             example: 100
 *           description: Maximum requests allowed
 *         RateLimit-Remaining:
 *           schema:
 *             type: integer
 *             example: 0
 *           description: Remaining requests
 *         RateLimit-Reset:
 *           schema:
 *             type: integer
 *             example: 1700000000
 *           description: Unix timestamp when limit resets
 */

// Placeholder export for JSDoc parsing
export {};
