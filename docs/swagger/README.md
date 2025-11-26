# API Documentation Guide

## Overview

This folder contains the Swagger/OpenAPI documentation for the Ameyo CRM API. The documentation is organized modularly for easy maintenance and understanding.

## Folder Structure

```
docs/swagger/
├── swaggerConfig.js              # Main Swagger configuration
├── schemas.js                    # Reusable schemas (User, UserType, etc.)
├── endpoints/                    # Individual endpoint documentation
│   ├── auth.swagger.js          # Authentication endpoints
│   └── profile.swagger.js       # Profile management endpoints
└── README.md                    # This file
```

## Files

### 1. swaggerConfig.js

**Purpose:** Central configuration for Swagger/OpenAPI

**Defines:**
- API title, version, and description
- Server URLs (development, production)
- API contact information
- Documentation links
- References to all endpoint and schema files

**When to modify:**
- Update API version
- Add new servers/environments
- Change contact information

**Example:**
```javascript
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ameyo CRM API',
      version: '1.0.0',
      // ...
    },
  },
  apis: [
    './docs/swagger/schemas.js',
    './docs/swagger/endpoints/auth.swagger.js',
    './docs/swagger/endpoints/profile.swagger.js',
    // Add new endpoint files here
  ],
};
```

### 2. schemas.js

**Purpose:** Define reusable data schemas

**Contains:**
- User schema
- UserType schema
- Success response schema
- Error response schema
- Validation error schema
- Rate limit error schema

**When to modify:**
- Add new entity (e.g., Product, Customer)
- Update existing schema properties
- Add new common schemas

**Example:**
```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         uname:
 *           type: string
 *         // ... more properties
 */
```

### 3. endpoints/auth.swagger.js

**Purpose:** Document authentication endpoints

**Includes:**
- POST /api/auth/register
- POST /api/auth/login

**Details documented:**
- Request body schema
- Response schemas
- Error responses
- Rate limiting info
- Security requirements

**Example:**
```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             // ... request schema
 *     responses:
 *       200:
 *         description: Login successful
 *         // ... response schema
 */
```

### 4. endpoints/profile.swagger.js

**Purpose:** Document profile management endpoints

**Includes:**
- GET /api/auth/profile
- PUT /api/auth/profile

---

## How to Add Documentation for a New Endpoint

### Step 1: Create Endpoint Documentation File

Create a new file in `endpoints/` folder:

```bash
# Example: docs/swagger/endpoints/products.swagger.js
```

### Step 2: Write JSDoc Comments

Use this template for each endpoint:

```javascript
/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: |
 *       Retrieves a paginated list of all products.
 *       
 *       **Authentication:** Required (Bearer Token)
 *       
 *       **Rate Limited:** 1000 requests per 15 minutes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many requests
 */

export {};
```

### Step 3: Add New Schemas (if needed)

Update `schemas.js` to add new schemas:

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 */
```

### Step 4: Register New Endpoint File

Update `swaggerConfig.js` to include the new file:

```javascript
const swaggerConfig = {
  // ...
  apis: [
    './docs/swagger/schemas.js',
    './docs/swagger/endpoints/auth.swagger.js',
    './docs/swagger/endpoints/profile.swagger.js',
    './docs/swagger/endpoints/products.swagger.js',  // ← Add this line
  ],
};
```

### Step 5: Test Documentation

1. Start the server: `npm run dev`
2. Visit: http://localhost:5000/api-docs
3. Verify your endpoint appears and works correctly

---

## Documentation Best Practices

### 1. Be Descriptive

✅ **Good:**
```javascript
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: |
 *       Retrieves a specific user's profile information.
 *       
 *       **Authentication:** Required
 *       **Permission:** Own profile or Admin
 *       **Rate Limited:** 1000/15min
 */
```

❌ **Bad:**
```javascript
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user
 */
```

### 2. Include Examples

✅ **Good:**
```javascript
example:
  id: 1
  uname: john_doe
  email: john@example.com
  createdAt: 2025-11-26T10:30:00Z
```

### 3. Document Error Responses

✅ **Good:**
```javascript
responses:
  200:
    description: Success
  400:
    description: Validation error
  401:
    description: Unauthorized
  429:
    description: Rate limit exceeded
  500:
    description: Server error
```

### 4. Use Tags

```javascript
tags:
  - Authentication
  # or
  - Products
  # Groups related endpoints
```

### 5. Include Security Info

```javascript
security:
  - bearerAuth: []
  # Indicates JWT required
```

### 6. Document Rate Limiting

```javascript
description: |
  **Rate Limited:** 100 requests per 15 minutes (production)
```

---

## Common Patterns

### GET with Parameters

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by username
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 */
```

### POST with Request Body

```javascript
/**
 * @swagger
 * /api/products:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 */
```

### PUT with Path Parameter

```javascript
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
```

### DELETE

```javascript
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
```

---

## Schema References

Use `$ref` to reference existing schemas:

```javascript
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
```

For arrays:

```javascript
schema:
  type: array
  items:
    $ref: '#/components/schemas/User'
```

---

## Accessing Documentation

### Local Development

1. Start server: `npm run dev`
2. Visit: http://localhost:5000/api-docs
3. Browse endpoints and try them out

### Features Available

- 📖 Browse all endpoints by tag
- 🔍 Search endpoints
- 💬 See request/response examples
- ▶️ Try endpoints directly
- 📋 View all schemas
- 🔐 Manage authentication
- 📥 Import in tools like Postman

---

## Maintenance

### Regular Updates

Keep documentation synchronized with code:

1. ✅ After adding new endpoint → Update swagger docs
2. ✅ After changing request/response → Update schema
3. ✅ Before release → Review all docs
4. ✅ When changing auth → Update security schemes

### Validation

Check documentation validity:

```bash
# Test Swagger config (should not have errors)
npm run dev

# Visit http://localhost:5000/api-docs
# Check for any red error indicators
```

---

## Tools & Resources

### Swagger/OpenAPI Resources

- **OpenAPI Spec:** https://spec.openapis.org/oas/v3.0.0
- **Swagger UI:** https://swagger.io/tools/swagger-ui/
- **Swagger Editor:** https://editor.swagger.io

### Testing

- **Postman:** Import from `/api-docs`
- **Insomnia:** Import swagger spec
- **Thunder Client:** VS Code extension

---

## File Organization Summary

```
docs/swagger/
│
├── 📄 swaggerConfig.js
│   └── Main configuration
│   └── Lists all endpoints files to include
│
├── 📄 schemas.js
│   └── Reusable data models
│   └── User, UserType, Error responses, etc.
│
├── 📁 endpoints/
│   ├── 📄 auth.swagger.js
│   │   └── /register, /login documentation
│   │
│   ├── 📄 profile.swagger.js
│   │   └── /profile GET/PUT documentation
│   │
│   └── 📄 [newfeature].swagger.js
│       └── New endpoints documentation (add here)
│
└── 📄 README.md
    └── This file - documentation guide
```

---

## Next Steps

1. 📚 Review existing endpoint documentation
2. 🔗 Visit `/api-docs` to see rendered documentation
3. 📝 Follow patterns when adding new endpoints
4. ✅ Keep documentation updated as code changes
5. 💡 Use as source of truth for API consumers

---

## Questions?

- Check existing endpoint documentation files for examples
- Review OpenAPI 3.0 specification
- See `CONTRIBUTING.md` for documentation standards
- Test in Swagger UI at http://localhost:5000/api-docs

Happy documenting! 📖
