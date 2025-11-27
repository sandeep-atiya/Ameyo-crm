# Project Architecture & Structure

Comprehensive guide to the Ameyo CRM project architecture, patterns, and organization.

---

## 📊 Architecture Overview

Ameyo CRM follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Routes / API Layer              │
│  (Express routes, HTTP handlers)        │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│      Controllers Layer                   │
│  (Request handling, validation)          │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│      Services Layer                      │
│  (Business logic, orchestration)         │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│     Repositories Layer                   │
│  (Data access, database queries)         │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│       Models / Database                  │
│  (ORM, data structures)                  │
└─────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
ameyo-crm/
│
├── 📂 src/                              # Main source code
│   ├── config/                          # Configuration files
│   │   ├── db.js                       # Database connection
│   │   └── index.js                    # Config exports
│   │
│   ├── constants/                       # Application constants
│   │   └── index.js
│   │
│   ├── controllers/                     # HTTP request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── index.js
│   │
│   ├── exceptions/                      # Custom error classes
│   │   └── index.js
│   │
│   ├── helpers/                         # Utility helpers
│   │
│   ├── middleware/                      # Express middleware
│   │   ├── auth.js                     # JWT authentication
│   │   ├── error-handler.js            # Global error handling
│   │   ├── rate-limiter.js             # Rate limiting
│   │   ├── request-logger.js           # Request logging
│   │   ├── sanitizer.js                # Input sanitization
│   │   ├── validation-middleware.js    # Request validation
│   │   └── index.js
│   │
│   ├── models/                          # Sequelize ORM models
│   │   ├── user.model.js
│   │   ├── user-type.model.js
│   │   └── index.js
│   │
│   ├── repositories/                    # Data access layer
│   │   ├── user.repository.js
│   │   └── index.js
│   │
│   ├── routes/                          # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   │
│   ├── services/                        # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   └── index.js
│   │
│   ├── utils/                           # Utility functions
│   │   ├── logger.js                   # Winston logger
│   │   ├── response-formatter.js
│   │   ├── sanitizer.js
│   │   └── index.js
│   │
│   └── validations/                     # Joi validation schemas
│       ├── auth.validation.js
│       ├── user.validation.js
│       ├── validation-middleware.js
│       └── index.js
│
├── 📂 documentation/                     # Project documentation
│   ├── ARCHITECTURE.md                  # This file
│   ├── INSTALLATION.md
│   ├── CONTRIBUTING.md
│   ├── TECH_STACK.md
│   ├── CODE_OF_CONDUCT.md
│   ├── MONITORING.md
│   └── legacy/
│
├── 📂 docs/                              # API documentation
│   ├── swagger/
│   │   ├── swaggerConfig.js
│   │   ├── schemas.js
│   │   └── endpoints/
│   │       ├── auth.swagger.js
│   │       └── profile.swagger.js
│   └── api-reference/
│
├── 📂 docker/                            # Docker configuration
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
│
├── 📂 k8s/                               # Kubernetes manifests
│   ├── deployment.yaml
│   ├── monitoring.yaml
│   └── README.md
│
├── 📂 __tests__/                         # Test suites
│   ├── routes/
│   │   └── auth.test.js
│   └── services/
│       └── authService.test.js
│
├── 📂 migrations/                        # Database migrations
├── 📂 seeders/                           # Database seeders
├── 📂 public/                            # Static assets
│   └── uploads/
│
├── 📄 server.js                          # Express app entry point
├── 📄 package.json                       # Dependencies
├── 📄 .env.example                       # Environment template
├── 📄 .eslintrc.json                     # ESLint config
├── 📄 .prettierrc                        # Prettier config
├── 📄 jest.config.js                     # Jest config
├── 📄 .releaserc.json                    # Semantic Release config
├── 📄 docker-compose.yml                 # Dev composition
├── 📄 docker-compose.prod.yml            # Prod composition
├── 📄 prometheus.yml                     # Prometheus config
├── 📄 README.md                          # Project README
└── 📄 CHANGELOG.md                       # Release notes
```

---

## 🏗️ Architectural Layers

### 1. Routes Layer (`src/routes/`)

**Purpose:** Define API endpoints and HTTP methods

**Responsibilities:**

- Map HTTP routes to controller methods
- Define route parameters
- Apply route-specific middleware

**Example:** `src/routes/auth.routes.js`

```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validation-middleware.js';
import * as authValidation from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', validateBody(authValidation.registerSchema), authController.register);

router.post('/login', validateBody(authValidation.loginSchema), authController.login);

router.get('/profile', authenticate, authController.getProfile);

export default router;
```

---

### 2. Controllers Layer (`src/controllers/`)

**Purpose:** Handle HTTP requests and responses

**Responsibilities:**

- Extract request data (body, params, query)
- Call service layer
- Format and send responses
- Handle basic error responses

**Example:** `src/controllers/auth.controller.js`

```javascript
import * as authService from '../services/auth.service.js';
import { formatResponse } from '../utils/response-formatter.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(formatResponse(user, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(formatResponse(result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};
```

---

### 3. Services Layer (`src/services/`)

**Purpose:** Implement business logic

**Responsibilities:**

- Validate inputs
- Perform business operations
- Call repository layer
- Handle complex workflows
- Throw meaningful errors

**Example:** `src/services/auth.service.js`

```javascript
import * as userRepository from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export const register = async ({ uname, password }) => {
  // Check if user exists
  const existingUser = await userRepository.findByUsername(uname);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await userRepository.create({
    uname,
    password: hashedPassword,
  });

  return user;
};

export const login = async ({ uname, password }) => {
  // Find user
  const user = await userRepository.findByUsername(uname);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user.id);

  return { user, token };
};
```

---

### 4. Repositories Layer (`src/repositories/`)

**Purpose:** Manage data access

**Responsibilities:**

- Database queries
- Model operations
- Data transformations
- Query optimization

**Example:** `src/repositories/user.repository.js`

```javascript
import { User } from '../models/user.model.js';

export const findById = async (userId) => {
  return User.findByPk(userId);
};

export const findByUsername = async (uname) => {
  return User.findOne({ where: { uname } });
};

export const create = async (userData) => {
  return User.create(userData);
};

export const update = async (userId, userData) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  return user.update(userData);
};

export const delete = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  return user.destroy();
};
```

---

### 5. Models Layer (`src/models/`)

**Purpose:** Define data structures

**Responsibilities:**

- ORM model definitions
- Model associations
- Data validation rules
- Database table structure

**Example:** `src/models/user.model.js`

```javascript
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

export const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    uname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);
```

---

## 🔧 Middleware Stack

### Request Flow

```
HTTP Request
    ↓
┌─────────────────────────────────────┐
│  CORS Middleware                    │
│  (Allow cross-origin requests)      │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Request Logger Middleware          │
│  (Log incoming requests)            │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Sanitizer Middleware               │
│  (Clean input, prevent XSS)         │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Rate Limiter Middleware            │
│  (Prevent abuse)                    │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Validation Middleware (if needed)  │
│  (Validate request body/params)     │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Auth Middleware (if protected)     │
│  (Verify JWT token)                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Route Handler / Controller         │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Error Handler Middleware           │
│  (Catch and format errors)          │
└─────────────────────────────────────┘
                  ↓
              HTTP Response
```

### Middleware Files

- **auth.js** - JWT token verification
- **error-handler.js** - Global error handling
- **rate-limiter.js** - API rate limiting
- **request-logger.js** - Request/response logging
- **sanitizer.js** - Input sanitization
- **validation-middleware.js** - Request validation

---

## 🔐 Security Architecture

### Password Security

```
User Input
    ↓
Validation
    ↓
Sanitization (XSS prevention)
    ↓
Hash with bcryptjs (salt rounds: 10)
    ↓
Store in database
    ↓
Compare on login with bcryptjs
```

### Authentication Flow

```
1. User sends credentials
            ↓
2. Validate & hash password
            ↓
3. Compare with stored hash
            ↓
4. Generate JWT token
            ↓
5. Return token to client
            ↓
6. Client includes token in Authorization header
            ↓
7. Middleware verifies token
            ↓
8. Access granted
```

---

## 📊 Database Schema

### User Table

```sql
CREATE TABLE Users (
  id UUID PRIMARY KEY DEFAULT NEWID(),
  uname VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  UserTypeID UUID FOREIGN KEY,
  ProPicture NVARCHAR(MAX),
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE()
);
```

### User Type Table

```sql
CREATE TABLE UserTypes (
  id UUID PRIMARY KEY DEFAULT NEWID(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description NVARCHAR(MAX),
  createdAt DATETIME DEFAULT GETDATE()
);
```

---

## 🧪 Testing Architecture

### Test Structure

```
__tests__/
├── routes/
│   └── auth.test.js         # Route endpoint tests
├── services/
│   └── authService.test.js  # Business logic tests
└── integration/
    └── auth.integration.js  # End-to-end tests
```

### Test Patterns

```javascript
describe('authService', () => {
  test('register should create user', async () => {
    const user = await authService.register({
      uname: 'testuser',
      password: 'Test123!',
    });

    expect(user).toBeDefined();
    expect(user.uname).toBe('testuser');
  });

  test('login should return token', async () => {
    const result = await authService.login({
      uname: 'testuser',
      password: 'Test123!',
    });

    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });
});
```

---

## 🚀 Deployment Architecture

### Development

- Single container setup
- Auto-reload on file changes
- Full logging and debugging
- docker-compose.yml

### Production

- Multi-stage Docker build
- Optimized image size
- Environment-specific config
- docker-compose.prod.yml
- Prometheus monitoring
- Health checks

---

## 📈 Monitoring & Observability

### Metrics Collected

- HTTP request duration
- Request count by endpoint
- Error rates
- Database query duration
- Application uptime
- Memory usage
- CPU usage

### Health Check Endpoints

- `/health` - Basic health
- `/live` - Liveness probe
- `/ready` - Readiness probe (DB check)
- `/metrics` - Prometheus metrics

---

## 🔄 Data Flow Example: User Registration

```
1. POST /api/auth/register
   {
     "uname": "john_doe",
     "password": "secure123"
   }
         ↓
2. Routes Layer
   → routes/auth.routes.js
   → Validation middleware
         ↓
3. Controllers Layer
   → auth.controller.js
   → Extract request data
         ↓
4. Services Layer
   → auth.service.js
   → Hash password (bcryptjs)
   → Check if user exists
         ↓
5. Repositories Layer
   → user.repository.js
   → Create user record
         ↓
6. Database
   → INSERT INTO Users
         ↓
7. Response
   {
     "success": true,
     "data": { "id": "uuid", "uname": "john_doe" },
     "message": "User registered successfully"
   }
```

---

## 🎯 Design Principles

### 1. **Separation of Concerns**

- Each layer has single responsibility
- Clear boundaries between layers
- Easy to test in isolation

### 2. **DRY (Don't Repeat Yourself)**

- Reusable utility functions
- Shared middleware
- Common validation schemas

### 3. **SOLID Principles**

- Single Responsibility
- Open/Closed for extension
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### 4. **Error Handling**

- Custom exception classes
- Centralized error handler
- Meaningful error messages
- No sensitive data in responses

### 5. **Security First**

- Input validation
- Output sanitization
- Password hashing
- JWT token security
- Rate limiting

---

## 🔄 Request/Response Pattern

### Standard Response Format

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response payload
  },
  "timestamp": "2025-11-27T10:30:00Z"
}
```

### Error Response Format

```javascript
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2025-11-27T10:30:00Z"
}
```

---

## 📚 Additional Resources

- [README.md](../README.md) - Project overview
- [INSTALLATION.md](INSTALLATION.md) - Setup guide
- [TECH_STACK.md](TECH_STACK.md) - Technology details
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide

---

**Last Updated:** November 27, 2025 | **Version:** 1.0.0
