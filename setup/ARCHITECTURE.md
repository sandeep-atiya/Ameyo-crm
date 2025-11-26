# Project Architecture & Structure

## Overview

This document describes the project structure, folder organization, and architectural patterns used in the Ameyo CRM application.

---

## Folder Structure

```
ameyo-crm/
│
├── 📂 .github/                          # GitHub Configuration
│   ├── workflows/                       # GitHub Actions CI/CD
│   │   ├── ci.yml                      # Continuous Integration
│   │   ├── codeql.yml                  # Security scanning
│   │   ├── docker-publish.yml          # Docker image building
│   │   └── release.yml                 # Semantic versioning
│   ├── PULL_REQUEST_TEMPLATE.md        # PR template
│   └── dependabot.yml                  # Dependency updates
│
├── 📂 config/                           # Configuration Files
│   └── db.js                           # Database connection & initialization
│
├── 📂 controllers/                      # Request Handlers
│   ├── authController.js               # Authentication logic
│   └── README.md                       # Controller pattern docs
│
├── 📂 docs/                             # Documentation
│   ├── swagger/                        # API Documentation (OpenAPI/Swagger)
│   │   ├── swaggerConfig.js           # Swagger configuration
│   │   ├── schemas.js                 # Reusable schemas
│   │   └── endpoints/                 # Endpoint documentation
│   │       ├── auth.swagger.js        # Auth endpoints
│   │       └── profile.swagger.js     # Profile endpoints
│   ├── api-reference/                 # API Reference docs
│   │   └── (Markdown guides)
│   └── legacy/                         # Legacy documentation
│
├── 📂 middleware/                       # Express Middleware
│   ├── auth.js                        # JWT authentication
│   ├── validation.js                  # Input validation
│   ├── rateLimiter.js                 # Rate limiting
│   ├── sanitizer.js                   # XSS prevention
│   └── README.md                      # Middleware documentation
│
├── 📂 models/                           # Sequelize ORM Models
│   ├── index.js                       # Model initialization & associations
│   ├── User.js                        # User model definition
│   ├── UserType.js                    # User role model
│   └── README.md                      # Model documentation
│
├── 📂 routes/                           # API Routes
│   ├── auth.js                        # Authentication routes
│   └── README.md                      # Routes documentation
│
├── 📂 services/                         # Business Logic Layer
│   ├── authService.js                 # Authentication service
│   └── README.md                      # Service pattern docs
│
├── 📂 tech-stack/                       # Technology Documentation
│   ├── TECH_STACK.md                  # Complete tech stack overview
│   ├── nodejs/                        # Node.js specific guides
│   ├── express/                       # Express guides
│   ├── sequelize/                     # Sequelize guides
│   └── security/                      # Security best practices
│
├── 📂 setup/                            # Developer Setup Guides
│   ├── INSTALLATION.md                # Quick start & detailed setup
│   ├── ENVIRONMENT.md                 # Environment configuration
│   ├── DATABASE.md                    # Database setup
│   └── TROUBLESHOOTING.md             # Common issues & solutions
│
├── 📂 infrastructure/                   # Deployment & DevOps
│   ├── docker-compose.yml             # Development composition
│   ├── docker-compose.prod.yml        # Production composition
│   ├── Dockerfile                     # Development image
│   ├── Dockerfile.prod                # Production image
│   ├── prometheus.yml                 # Prometheus config
│   ├── grafana/                       # Grafana dashboards
│   └── kubernetes/                    # K8s manifests (future)
│
├── 📂 utils/                            # Utility Functions
│   ├── logger.js                      # Winston logger
│   ├── metrics.js                     # Prometheus metrics
│   └── helpers.js                     # General utilities
│
├── 📂 __tests__/                        # Test Suite
│   ├── routes/                        # Route tests
│   │   └── auth.test.js
│   └── services/                      # Service tests
│       └── authService.test.js
│
├── 📂 public/                           # Static Assets
│   └── uploads/                       # User uploaded files
│
├── 📂 logs/                             # Application Logs
│   └── (Generated at runtime)
│
├── 📂 migrations/                       # Database Migrations
│   └── (Sequelize migrations)
│
├── 📂 seeders/                          # Database Seeders
│   └── (Sequelize seeders)
│
├── 📄 server.js                        # Express App Entry Point
├── 📄 package.json                     # Dependencies & scripts
├── 📄 package-lock.json                # Locked versions
├── 📄 .env.example                     # Example environment variables
├── 📄 .eslintrc.json                   # ESLint configuration
├── 📄 .prettierrc                      # Prettier configuration
├── 📄 .editorconfig                    # Editor configuration
├── 📄 .gitignore                       # Git ignore rules
├── 📄 jest.config.js                   # Jest configuration
├── 📄 .releaserc.json                  # Semantic Release config
├── 📄 README.md                        # Project README
├── 📄 CONTRIBUTING.md                  # Contribution guidelines
├── 📄 CODE_OF_CONDUCT.md               # Code of conduct
├── 📄 CHANGELOG.md                     # Release notes
└── 📄 PROJECT_REVIEW.md                # Project status

```

---

## Architectural Layers

### 1️⃣ Routes Layer (`routes/`)

**Responsibility:** Define API endpoints and HTTP methods

**Pattern:** REST API

**File:** `routes/auth.js`

```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);

export default router;
```

**Key Points:**
- Routes map HTTP methods to controllers
- Middleware applied at route level (auth, validation, rate limiting)
- No business logic in routes
- Clean and readable endpoint definitions

---

### 2️⃣ Controllers Layer (`controllers/`)

**Responsibility:** Handle HTTP requests and responses

**Pattern:** MVC Controller pattern

**File:** `controllers/authController.js`

```javascript
export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: result.token,
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};
```

**Key Points:**
- Handles request/response cycle
- Calls services for business logic
- Delegates errors to error handler middleware
- No direct database queries (uses services)
- Lightweight and focused

---

### 3️⃣ Services Layer (`services/`)

**Responsibility:** Business logic and data operations

**Pattern:** Service/Business Logic layer

**File:** `services/authService.js`

```javascript
export const registerUser = async (userData) => {
  // Validate input
  // Check if user exists
  // Create user in database
  // Generate JWT token
  // Return user data and token
};

export const loginUser = async (credentials) => {
  // Find user
  // Compare passwords
  // Generate JWT token
  // Return user data and token
};
```

**Key Points:**
- Contains all business logic
- Calls models for database operations
- Independent of HTTP layer
- Reusable across controllers
- Handles validation and error logic

---

### 4️⃣ Models Layer (`models/`)

**Responsibility:** Database schema and ORM operations

**Pattern:** Sequelize ORM

**File:** `models/User.js`

```javascript
const defineUser = (sequelize, DataTypes) => {
  const User = sequelize.define('tblUser', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uname: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    ProPicture: { type: DataTypes.STRING, allowNull: true },
  });
  return User;
};

export default defineUser;
```

**File:** `models/index.js`

```javascript
// Initialize models and set associations
const tblUser = defineUser(sequelize, DataTypes);
const UserType = defineUserType(sequelize, DataTypes);

// Define relationships
tblUser.belongsTo(UserType);
UserType.hasMany(tblUser);

export const db = { sequelize, tblUser, UserType };
```

**Key Points:**
- Define database tables as models
- Set up model associations
- Sequelize handles SQL operations
- Centralized in `models/index.js`
- Database agnostic (can switch to MySQL, PostgreSQL, etc.)

---

### 5️⃣ Middleware Layer (`middleware/`)

**Responsibility:** Cross-cutting concerns

**Files:**

1. **auth.js** - JWT verification
   ```javascript
   export const authenticate = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({ success: false });
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.userId = decoded.userId;
       next();
     } catch (error) {
       res.status(401).json({ success: false, message: 'Invalid token' });
     }
   };
   ```

2. **validation.js** - Input validation
   ```javascript
   export const validateBody = (schema) => {
     return (req, res, next) => {
       const { error, value } = schema.validate(req.body);
       if (error) return res.status(400).json({ errors: error.details });
       req.body = value;
       next();
     };
   };
   ```

3. **rateLimiter.js** - Rate limiting
   ```javascript
   export const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: NODE_ENV === 'production' ? 5 : 30,
   });
   ```

4. **sanitizer.js** - XSS prevention
   ```javascript
   export const sanitizeMiddleware = (req, res, next) => {
     if (req.body) req.body = sanitizeObject(req.body);
     next();
   };
   ```

**Key Points:**
- Applied globally or at route level
- Handle cross-cutting concerns
- Middleware chain execution order matters
- Error handler is last middleware

---

## Data Flow

### Request Flow Diagram

```
┌─────────────────┐
│  Client Request │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Middleware Chain   │
├─────────────────────┤
│ 1. Authentication   │
│ 2. Validation       │
│ 3. Sanitization     │
│ 4. Rate Limiting    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Route Handler      │ (routes/auth.js)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Controller         │ (controllers/authController.js)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Service Layer      │ (services/authService.js)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Model/Database     │ (models/*, Sequelize)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Database Response  │ (MSSQL)
└────────┬────────────┘
         │
         ▼ (Response flows back through layers)
┌─────────────────────┐
│  JSON Response      │
└─────────────────────┘
```

### Example: User Login Flow

```
1. POST /api/auth/login { "uname": "john", "password": "pass123" }
   ▼
2. Middleware Chain
   - rateLimiter: Check rate limit ✓
   - sanitizeMiddleware: Sanitize input ✓
   - validateBody: Validate schema ✓
   ▼
3. routes/auth.js → authController.login(req, res)
   ▼
4. controllers/authController.js
   - Extract credentials from req.body
   - Call authService.loginUser(credentials)
   ▼
5. services/authService.js
   - Find user in database
   - Compare passwords
   - Generate JWT token
   - Return { user, token }
   ▼
6. Database Query
   - Sequelize converts to SQL
   - Execute on MSSQL
   - Return user record
   ▼
7. Response sent back to client
   { "success": true, "token": "jwt...", "data": { ... } }
```

---

## Dependency Injection Pattern

Models are initialized and exported centrally:

**File:** `models/index.js`

```javascript
import defineUser from './User.js';
import defineUserType from './UserType.js';

// Initialize
const tblUser = defineUser(sequelize, DataTypes);
const UserType = defineUserType(sequelize, DataTypes);

// Associations
tblUser.belongsTo(UserType);

// Export
export { sequelize, tblUser, UserType };
export const db = { sequelize, tblUser, UserType };
```

**Usage in Services:**

```javascript
import { db } from '../models/index.js';

export const loginUser = async (credentials) => {
  const user = await db.tblUser.findOne({
    where: { uname: credentials.uname },
    include: [{ model: db.UserType }],
  });
  // ...
};
```

**Benefits:**
- Single source of truth for models
- Easy to mock for testing
- Centralized relationship management
- No circular dependencies

---

## Error Handling

### Error Flow

```
throw Error
   ▼
Controller catch block
   ▼
next(error)
   ▼
Global Error Handler Middleware
   ▼
res.status(statusCode).json({ success: false, message: ... })
```

### Error Handler Middleware

**File:** `server.js`

```javascript
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  
  // Send to Sentry if enabled
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});
```

**Custom Error Class:**

```javascript
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

// Usage
throw new AppError('User not found', 404);
```

---

## Configuration & Environment

### Environment-Based Configuration

**File:** `.env`

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=1433
JWT_SECRET=secret
PORT=5000
LOG_LEVEL=debug
```

**Usage:**

```javascript
// In config/db.js
const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  // ...
});

// In logger
const logLevel = process.env.LOG_LEVEL || 'info';
```

### Configuration Best Practices

✅ Use `.env` for local development
✅ Use `.env.example` as template (committed to git)
✅ Never commit `.env` (add to `.gitignore`)
✅ Use different values for dev/prod
✅ Validate required variables at startup
✅ Log sanitized config on startup

---

## Testing Strategy

### Test Structure

```
__tests__/
├── routes/
│   └── auth.test.js           # API route tests
└── services/
    └── authService.test.js    # Business logic tests
```

### Test Example

**File:** `__tests__/routes/auth.test.js`

```javascript
import request from 'supertest';
import app from '../../server.js';

describe('POST /api/auth/login', () => {
  test('should return 200 with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ uname: 'testuser', password: 'password123' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should return 401 with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ uname: 'testuser', password: 'wrongpassword' });
    
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch        # Run in watch mode
npm run test:coverage     # Generate coverage report
```

---

## Documentation Files

### File Locations & Purposes

| File | Purpose |
|------|---------|
| `docs/swagger/` | API documentation (OpenAPI/Swagger) |
| `tech-stack/TECH_STACK.md` | Technology stack overview |
| `setup/INSTALLATION.md` | Installation & setup guide |
| `CONTRIBUTING.md` | Contribution guidelines |
| `CODE_OF_CONDUCT.md` | Community standards |
| `README.md` | Project overview |
| `ARCHITECTURE.md` | This file - project structure |

---

## Development Workflow

### 1. Create New Feature

```
1. Create feature branch: git checkout -b feature/my-feature
2. Create files in appropriate folders
3. Follow architectural patterns
4. Write tests
5. Update documentation
6. Submit PR
```

### 2. File Placement Guide

**New API endpoint (e.g., users)?**
- Route: `routes/users.js`
- Controller: `controllers/usersController.js`
- Service: `services/usersService.js`
- Model: `models/User.js` (if needed)
- Tests: `__tests__/routes/users.test.js`
- Docs: `docs/swagger/endpoints/users.swagger.js`

**New utility function?**
- File: `utils/newutil.js`
- Tests: `__tests__/utils/newutil.test.js`

**New middleware?**
- File: `middleware/newMiddleware.js`
- Applied in: `server.js`

---

## Performance Considerations

### Optimizations Implemented

✅ **Rate Limiting** - Prevent abuse with `express-rate-limit`
✅ **Input Sanitization** - XSS prevention with `xss` package
✅ **Database Optimization** - Proper indexing and associations
✅ **Caching** - (Implement as needed)
✅ **Logging** - Structured logging with Winston
✅ **Monitoring** - Prometheus metrics collection

### Areas for Future Enhancement

📈 Add Redis caching layer
📈 Database query optimization
📈 API response compression
📈 CDN for static assets
📈 Database replication/backup strategy

---

## Security Considerations

### Implemented Security

✅ JWT authentication
✅ XSS prevention (input sanitization)
✅ CORS protection
✅ Helmet security headers
✅ Rate limiting (brute force protection)
✅ Environment variable secrets
✅ SQL injection prevention (Sequelize ORM)

### Production Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS only
- [ ] Enable CORS restrictively
- [ ] Set NODE_ENV=production
- [ ] Enable database backups
- [ ] Monitor with Sentry
- [ ] Setup Prometheus alerts
- [ ] Regular security updates
- [ ] Audit logs enabled
- [ ] Rate limiting tuned for production

---

## Conclusion

This architecture follows SOLID principles and industry best practices:

- **S** - Single Responsibility (each layer has one job)
- **O** - Open/Closed (open for extension, closed for modification)
- **L** - Liskov Substitution (interfaces are properly defined)
- **I** - Interface Segregation (minimal middleware coupling)
- **D** - Dependency Inversion (depends on abstractions)

Result: Maintainable, scalable, and testable codebase.

---

## Quick Navigation

- **Setup:** `setup/INSTALLATION.md`
- **Tech Stack:** `tech-stack/TECH_STACK.md`
- **API Docs:** http://localhost:5000/api-docs
- **Contributing:** `CONTRIBUTING.md`
- **GitHub:** https://github.com/sandeep-atiya/Ameyo-crm
