# Project Structure & Architecture Guide

## 📁 Complete Directory Structure

```
ameyo-crm/
│
├── src/                                    # Main source code directory
│   ├── config/
│   │   ├── db.js                          # Database connection (Sequelize)
│   │   └── index.js                       # Config exports
│   │
│   ├── constants/
│   │   └── index.js                       # HTTP status, error messages, JWT config
│   │
│   ├── controllers/
│   │   ├── auth.controller.js             # Authentication handlers (register, login, profile)
│   │   ├── user.controller.js             # User management handlers (CRUD)
│   │   └── index.js                       # Controller exports
│   │
│   ├── exceptions/
│   │   └── index.js                       # Custom error classes
│   │
│   ├── middleware/
│   │   ├── auth.js                        # JWT authentication middleware
│   │   ├── error-handler.js               # Global error handling middleware
│   │   ├── rate-limiter.js                # Rate limiting middleware
│   │   ├── request-logger.js              # Morgan request logging
│   │   ├── sanitizer.js                   # XSS input sanitization
│   │   └── index.js                       # Middleware exports
│   │
│   ├── models/
│   │   ├── user.model.js                  # User Sequelize model
│   │   ├── user-type.model.js             # UserType Sequelize model
│   │   └── index.js                       # Model initialization & associations
│   │
│   ├── repositories/
│   │   ├── user.repository.js             # User database queries (DAO pattern)
│   │   └── index.js                       # Repository exports
│   │
│   ├── routes/
│   │   ├── auth.routes.js                 # Authentication routes
│   │   ├── user.routes.js                 # User management routes
│   │   └── index.js                       # Route setup (setupRoutes function)
│   │
│   ├── services/
│   │   ├── auth.service.js                # Authentication business logic
│   │   ├── user.service.js                # User business logic
│   │   └── index.js                       # Service exports
│   │
│   ├── utils/
│   │   ├── logger.js                      # Winston logger setup
│   │   ├── response-formatter.js          # API response formatting
│   │   ├── sanitizer.js                   # Data sanitization utilities
│   │   └── index.js                       # Utils exports
│   │
│   └── validations/
│       ├── auth.validation.js             # Auth endpoint validation schemas
│       ├── user.validation.js             # User endpoint validation schemas
│       ├── validation-middleware.js       # Generic validation middleware
│       └── index.js                       # Validation exports
│
├── documentation/                         # All project documentation
│   ├── CODE_OF_CONDUCT.md
│   ├── CONTRIBUTING.md
│   ├── DEVELOPER_INDEX.md
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── MONITORING.md
│   ├── PROJECT_ORGANIZATION.md
│   ├── PROJECT_REORGANIZATION.md          # New: Reorganization summary
│   ├── PROJECT_REVIEW.md
│   ├── PROJECT_STRUCTURE_DIAGRAM.md
│   └── legacy/                            # Legacy documentation
│
├── docs/
│   ├── swagger/
│   │   ├── endpoints/
│   │   │   ├── auth.swagger.js
│   │   │   └── profile.swagger.js
│   │   ├── schemas.js
│   │   ├── swaggerConfig.js
│   │   └── README.md
│   ├── api-reference/
│   └── legacy/
│
├── __tests__/
│   ├── routes/
│   │   └── auth.test.js
│   └── services/
│       └── authService.test.js
│
├── logs/                                   # Application logs
│   ├── error.log
│   └── combined.log
│
├── public/                                # Static files
│   └── uploads/
│
├── tech-stack/                            # Technology documentation
│   └── TECH_STACK.md
│
├── setup/                                 # Setup guides
│   ├── ARCHITECTURE.md
│   └── INSTALLATION.md
│
├── infrastructure/                        # DevOps & deployment
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── config/                                # Old config (deprecated, use src/config)
│   └── db.js
│
├── .env                                   # Environment variables (gitignored)
├── .env.example                          # Example environment file
├── .env.production                       # Production environment vars
├── .env.test                             # Test environment vars
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── docker-publish.yml
│   └── dependabot.yml
│
├── .husky/                               # Git hooks
│   └── pre-commit
│
├── .editorconfig                         # Editor configuration
├── .eslintignore                         # ESLint ignore rules
├── .eslintrc.js                          # ESLint configuration
├── .eslintrc.json                        # ESLint config (JSON)
├── .gitignore                            # Git ignore rules
├── .prettierignore                       # Prettier ignore rules
├── .prettierrc                           # Prettier configuration
├── .releaserc.json                       # Semantic release config
│
├── controllers/                          # OLD - Use src/controllers instead
├── routes/                               # OLD - Use src/routes instead
├── services/                             # OLD - Use src/services instead
├── middleware/                           # OLD - Use src/middleware instead
├── validations/                          # OLD - Use src/validations instead
├── models/                               # OLD - Use src/models instead
├── utils/                                # OLD - Use src/utils instead (partial)
├── helpers/                              # OLD - Empty, use src/utils instead
│
├── jest.config.js                        # Jest testing configuration
├── package.json                          # NPM dependencies & scripts
├── package-lock.json                     # Dependency lock file
├── prometheus.yml                        # Prometheus configuration
├── Dockerfile                            # Docker development image
├── Dockerfile.prod                       # Docker production image
├── docker-compose.yml                    # Docker development compose
├── docker-compose.prod.yml               # Docker production compose
├── docker-compose.monitoring.yml         # Monitoring stack compose
│
├── server.js                             # Main application entry point
├── verify-setup.sh                       # Setup verification script
│
├── README.md                             # Main project documentation (ROOT LEVEL)
├── MONITORING.md                         # Monitoring setup guide
├── PROJECT_REVIEW.md                     # Project review document
├── CODE_OF_CONDUCT.md                    # Community guidelines
├── CONTRIBUTING.md                       # Contribution guidelines
│
└── node_modules/                         # NPM packages (gitignored)
```

## 🏗️ Architecture Layers

### Layer 1: Routes (`src/routes/`)

**Responsibility:** Define API endpoints and attach middleware

**Files:**

- `auth.routes.js` - Register, login, profile endpoints
- `user.routes.js` - User CRUD endpoints
- `index.js` - Setup function `setupRoutes(app)`

**Example:**

```javascript
router.post(
  '/register',
  authLimiter, // Rate limiting middleware
  validateBody(registerSchema), // Validation middleware
  authController.register // Handler
);
```

### Layer 2: Controllers (`src/controllers/`)

**Responsibility:** Handle HTTP requests/responses, invoke services

**Files:**

- `auth.controller.js` - register(), login(), getProfile(), updateProfile()
- `user.controller.js` - getUserById(), getAllUsers(), updateUser(), deleteUser()
- `index.js` - Controller exports

**Pattern:**

```javascript
export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(formatSuccessResponse(201, 'User registered', result));
  } catch (err) {
    next(err); // Pass to error handler
  }
};
```

### Layer 3: Services (`src/services/`)

**Responsibility:** Business logic, data validation, service orchestration

**Files:**

- `auth.service.js` - registerUser(), loginUser(), getUserById(), updateUserProfile()
- `user.service.js` - getUserById(), getAllUsers(), updateUser(), deleteUserById()
- `index.js` - Service exports

**Pattern:**

```javascript
export const loginUser = async (username, password) => {
  try {
    const user = await userRepo.findUserByUsername(username);
    if (!user) throw new AuthenticationError('Invalid credentials');

    const token = jwt.sign({ uID: user.uID }, JWT_CONFIG.SECRET);
    return { token, user };
  } catch (err) {
    throw err;
  }
};
```

### Layer 4: Repositories (`src/repositories/`)

**Responsibility:** Database queries only (DAO pattern)

**Files:**

- `user.repository.js` - createUser(), findUserById(), findUserByUsername(), updateUser(), deleteUser(), getAllUsers()
- `index.js` - Repository exports

**Pattern:**

```javascript
export const findUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: UserType, as: 'userType' }],
    });
    return user;
  } catch (err) {
    throw new DatabaseError('Failed to retrieve user');
  }
};
```

### Layer 5: Models (`src/models/`)

**Responsibility:** Sequelize ORM model definitions

**Files:**

- `user.model.js` - User model definition
- `user-type.model.js` - UserType model definition
- `index.js` - Model initialization and associations

**Pattern:**

```javascript
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'tblUser',
    {
      uID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      uname: { type: DataTypes.STRING(50) },
      // ... other fields
    },
    { tableName: 'tblUser', timestamps: false }
  );

  User.associate = (models) => {
    User.belongsTo(models.UserType, { foreignKey: 'UserTypeID', as: 'userType' });
  };

  return User;
};
```

## 🔌 Middleware Stack (`src/middleware/`)

**Order of execution in `server.js`:**

1. **Helmet** → Security headers
2. **CORS** → Cross-origin resource sharing
3. **Express JSON Parser** → Parse JSON bodies
4. **Sanitizer Middleware** → Sanitize inputs (XSS protection)
5. **Metrics Middleware** → Collect Prometheus metrics
6. **Request Logger** → Log all requests via Morgan
7. **General Rate Limiter** → Rate limit all routes (except health/metrics)
8. **Swagger UI** → API documentation at `/api-docs`
9. **Route-Specific Middleware** → Auth rate limiter, authentication, etc.
10. **Routes** → API endpoints
11. **Health Check Routes** → `/health`, `/live`, `/ready`, `/metrics`
12. **404 Handler** → Not found middleware
13. **Error Handler** → Global error handling

**Middleware Files:**

- `auth.js` - authenticate, optionalAuthenticate
- `error-handler.js` - errorHandler, notFoundHandler
- `rate-limiter.js` - authLimiter, generalLimiter, strictLimiter
- `request-logger.js` - Morgan logger setup
- `sanitizer.js` - sanitizeMiddleware

## ✅ Validation System (`src/validations/`)

**Files:**

- `auth.validation.js` - registerSchema, loginSchema, updateProfileSchema
- `user.validation.js` - createUserSchema, updateUserSchema
- `validation-middleware.js` - validateBody(), validateParams(), validateQuery()

**Usage Pattern:**

```javascript
// In routes
router.post(
  '/register',
  validateBody(registerSchema), // This validates req.body against schema
  authController.register
);

// In validation middleware
export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res
      .status(400)
      .json(formatErrorResponse(400, 'Validation failed', formatValidationErrors(error.details)));
  }

  req.body = value;
  next();
};
```

## 🛡️ Error Handling (`src/exceptions/`)

**Custom Error Classes:**

- `AppError` - Base error (statusCode, code, message)
- `ValidationError` - 400 Bad Request
- `AuthenticationError` - 401 Unauthorized
- `AuthorizationError` - 403 Forbidden
- `NotFoundError` - 404 Not Found
- `ConflictError` - 409 Conflict
- `DatabaseError` - 500 Server Error

**Usage Pattern:**

```javascript
// In service/repository
if (!user) throw new NotFoundError('User not found');
if (existing) throw new ConflictError('Username already exists');

// In controller
try {
  const result = await service.operation();
  res.json(formatSuccessResponse(200, 'Success', result));
} catch (err) {
  next(err); // Pass to error handler middleware
}

// In error handler middleware
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(formatErrorResponse(err.statusCode, err.message));
  }
  // Default error handling
};
```

## 🎯 Data Flow Example: User Registration

```
1. POST /api/auth/register with body { uname, password, ProPicture }
   ↓
2. Route Handler (auth.routes.js)
   - Rate limiter checks (authLimiter middleware)
   - Validation (validateBody(registerSchema))
   - Invokes controller
   ↓
3. Controller (auth.controller.js - register function)
   - Calls authService.registerUser(req.body)
   - Formats and returns response
   ↓
4. Service (auth.service.js - registerUser function)
   - Validates input
   - Calls userRepository.createUser(userData)
   - Returns result
   ↓
5. Repository (user.repository.js - createUser function)
   - Checks for existing user
   - Creates user in database via Sequelize
   - Returns created user
   ↓
6. Response
   - User data is sanitized (password removed)
   - Formatted via formatSuccessResponse()
   - Returns 201 with user data
```

## 📊 Request/Response Format

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { "user": {...} },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "uname", "message": "Username is required", "type": "any.required" }],
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

## 🔄 Adding a New Feature

### Step 1: Create Validation Schema

File: `src/validations/product.validation.js`

```javascript
export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
});
```

### Step 2: Create Repository

File: `src/repositories/product.repository.js`

```javascript
export const createProduct = async (productData) => {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (err) {
    throw new DatabaseError('Failed to create product');
  }
};
```

### Step 3: Create Service

File: `src/services/product.service.js`

```javascript
export const createProduct = async (productData) => {
  const product = await productRepo.createProduct(productData);
  return product;
};
```

### Step 4: Create Controller

File: `src/controllers/product.controller.js`

```javascript
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(formatSuccessResponse(201, 'Product created', product));
  } catch (err) {
    next(err);
  }
};
```

### Step 5: Create Routes

File: `src/routes/product.routes.js`

```javascript
import { validateBody } from '../validations/validation-middleware.js';
import { createProductSchema } from '../validations/product.validation.js';
import * as productController from '../controllers/product.controller.js';

router.post('/', validateBody(createProductSchema), productController.createProduct);
```

### Step 6: Register Routes

Update: `src/routes/index.js`

```javascript
import productRoutes from './product.routes.js';

export const setupRoutes = (app) => {
  app.use('/api/products', productRoutes);
};
```

## ✨ Best Practices

✅ **Always use try-catch in services and repositories**
✅ **Pass errors to next() middleware in controllers**
✅ **Use custom exception classes for specific errors**
✅ **Format all responses using formatSuccessResponse/formatErrorResponse**
✅ **Sanitize user data before returning (remove passwords)**
✅ **Use logger instead of console.log**
✅ **Validate all inputs with Joi schemas**
✅ **Keep repositories focused on database queries only**
✅ **Keep services focused on business logic only**
✅ **Keep controllers focused on HTTP handling only**
✅ **Add JSDoc comments to all functions**
✅ **Use meaningful variable and function names**

---

**Follow this structure to maintain consistency and scalability!**
