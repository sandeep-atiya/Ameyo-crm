# Tech Stack Documentation

## Overview

This document provides a comprehensive guide to all technologies used in the Ameyo CRM project.

## Technology Stack

### 📋 Table of Contents

1. [Backend Runtime](#backend-runtime)
2. [Web Framework](#web-framework)
3. [Database](#database)
4. [ORM & Query Builder](#orm--query-builder)
5. [Authentication](#authentication)
6. [Validation](#validation)
7. [Security](#security)
8. [Logging](#logging)
9. [Testing](#testing)
10. [Monitoring & Observability](#monitoring--observability)
11. [API Documentation](#api-documentation)
12. [Development Tools](#development-tools)
13. [CI/CD & Deployment](#cicd--deployment)

---

## Backend Runtime

### Node.js 18+

**Purpose:** JavaScript runtime for server-side code execution

**Version:** 18-alpine (Docker)

**Key Features:**

- Asynchronous event-driven architecture
- Non-blocking I/O
- Built-in package manager (npm)
- ES modules support

**Resources:**

- Official: https://nodejs.org
- Docs: https://nodejs.org/docs
- Installation: See `setup/INSTALLATION.md`

**Common Commands:**

```bash
node server.js                    # Run server
node --version                    # Check version
npm list                          # List dependencies
```

---

## Web Framework

### Express.js 5.1.0

**Purpose:** Minimal and flexible Node.js web application framework

**Key Features:**

- Middleware system for request/response handling
- Routing with dynamic routes
- Template engine support
- Error handling middleware
- Production-grade HTTP server

**Installation:**

```bash
npm install express@5.1.0
```

**Basic Setup in server.js:**

```javascript
import express from 'express';
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(5000);
```

**Resources:**

- Official: https://expressjs.com
- Docs: https://expressjs.com/api
- Migration Guide (v4→v5): https://expressjs.com/en/guide/migrating-5.html

**Related Middleware (see server.js):**

- `helmet()` - Security headers
- `cors()` - Cross-Origin Resource Sharing
- `morgan()` - HTTP request logging

---

## Database

### MSSQL (Microsoft SQL Server)

**Purpose:** Relational database for persistent data storage

**Version:** Latest (via Docker Tedious driver)

**Connection Details:**

- Host: Configured in `.env`
- Port: 1433 (default)
- Dialect: `mssql`
- Driver: Tedious (npm package)

**Configuration File:** `config/db.js`

**Connection String Format:**

```
Server=DB_HOST,DB_PORT;Database=DB_NAME;User Id=DB_USER;Password=DB_PASSWORD;
```

**Environment Variables:**

```env
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=ameyo_crm
DB_DIALECT=mssql
```

**Common Operations:**

```sql
-- Check database connection
SELECT 1 AS status;

-- View tables
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';

-- Check user accounts
SELECT name FROM sys.sql_logins;
```

**Docker Setup:**

```bash
docker run -e "ACCEPT_EULA=Y" \
           -e "SA_PASSWORD=YourPassword123" \
           -p 1433:1433 \
           mcr.microsoft.com/mssql/server:latest
```

**Resources:**

- Official: https://www.microsoft.com/en-us/sql-server
- Docs: https://learn.microsoft.com/en-us/sql
- Tedious Driver: https://tediousjs.github.io/tedious/

---

## ORM & Query Builder

### Sequelize 6.37.7

**Purpose:** Promise-based ORM for Node.js supporting multiple databases

**Key Features:**

- Model definition with attributes & types
- Associations (belongsTo, hasMany, etc.)
- Migrations & seeders
- Query builder interface
- Hooks & validation
- Transactions support

**Configuration File:** `config/db.js`

**Models Location:** `models/`

**Current Models:**

- `User.js` - User model with authentication
- `UserType.js` - User role/type classification

**Example Model:**

```javascript
// models/User.js
const defineUser = (sequelize, DataTypes) => {
  const User = sequelize.define('tblUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  });
  return User;
};

export default defineUser;
```

**Migrations:**

```bash
npm run db:migrate           # Run migrations
npm run db:migrate:undo     # Rollback last migration
npm run db:reset            # Reset & reseed database
```

**Seeders:**

```bash
npm run db:seed             # Run all seeders
npm run db:seed:all         # Run specific seeder
```

**Resources:**

- Official: https://sequelize.org
- Docs: https://sequelize.org/docs
- API Reference: https://sequelize.org/api/v6/class/src/sequelize.js~sequelize
- Migrations: https://sequelize.org/docs/v6/other-topics/migrations/

---

## Authentication

### JWT (JSON Web Tokens)

**Package:** `jsonwebtoken` (9.0.2)

**Purpose:** Stateless authentication mechanism

**Token Structure:**

```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

**Implementation:**

```javascript
import jwt from 'jsonwebtoken';

// Sign token
const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, {
  expiresIn: '7d',
});

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Configuration:**

- Secret: `JWT_SECRET` in `.env`
- Expiry: `JWT_EXPIRY` in `.env` (default: 7d)

**Middleware:** `middleware/auth.js`

**Resources:**

- Official: https://jwt.io
- Docs: https://github.com/auth0/node-jsonwebtoken
- Debugger: https://jwt.io/#debugger

---

## Validation

### Express-validator 7.3.1

**Purpose:** Server-side input validation for Express

**Key Features:**

- Sanitization (remove XSS, trim, etc.)
- Validation rules (min length, email format, etc.)
- Custom validators
- Middleware-based integration

**Implementation:**

```javascript
import { body, validationResult } from 'express-validator';

const loginSchema = [
  body('uname').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 6 }),
];

app.post('/login', loginSchema, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process valid request
});
```

**File Location:** `middleware/validation.js`

**Validation Rules:**

- `registerSchema` - User registration validation
- `loginSchema` - User login validation
- `updateProfileSchema` - Profile update validation

**Resources:**

- Official: https://express-validator.github.io
- Docs: https://express-validator.github.io/docs
- Validators List: https://github.com/validatorjs/validator.js#validators

### Joi 18.0.2

**Purpose:** Data validation schema builder

**Key Features:**

- Schema validation
- Custom validation rules
- Object shape validation
- Error messages

**Resources:**

- Official: https://joi.dev
- Docs: https://joi.dev/api

---

## Security

### Helmet.js 8.1.0

**Purpose:** HTTP security headers middleware

**Protects Against:**

- XSS (Cross-Site Scripting)
- Clickjacking
- MIME type sniffing
- Insecure SSL/TLS connections

**Setup:**

```javascript
import helmet from 'helmet';
app.use(helmet());
```

**Resources:**

- Official: https://helmetjs.github.io
- Docs: https://helmetjs.github.io

### CORS (Cross-Origin Resource Sharing)

**Package:** `cors` (2.8.5)

**Purpose:** Control cross-origin requests

**Setup:**

```javascript
import cors from 'cors';
app.use(cors());
```

**Configuration in server.js:**

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  })
);
```

**Resources:**

- Official: https://github.com/expressjs/cors
- MDN: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

### XSS Prevention

**Package:** `xss` (1.0.14)

**Purpose:** Sanitize user input to prevent XSS attacks

**File:** `middleware/sanitizer.js`

**Resources:**

- NPM: https://www.npmjs.com/package/xss
- OWASP: https://owasp.org/www-community/attacks/xss/

### Rate Limiting

**Package:** `express-rate-limit` (7.1.5)

**Purpose:** Prevent brute force attacks and DoS

**File:** `middleware/rateLimiter.js`

**Limiters Defined:**

- `generalLimiter` - General API endpoints
- `authLimiter` - Authentication endpoints
- `strictLimiter` - Sensitive operations

**Resources:**

- NPM: https://www.npmjs.com/package/express-rate-limit
- Docs: https://github.com/nfriedly/express-rate-limit

---

## Logging

### Winston 3.11.0

**Purpose:** Structured logging for development and production

**Log Levels:**

- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `http` - HTTP request logs
- `debug` - Debug information

**Configuration File:** `utils/logger.js`

**Usage:**

```javascript
import logger from './utils/logger.js';

logger.info('Server started');
logger.error('Database connection failed');
logger.http('GET /api/auth/profile');
```

**Log Output:**

- Console (all environments)
- File (production)
- Color-coded (development)

**Resources:**

- Official: https://github.com/winstonjs/winston
- Docs: https://github.com/winstonjs/winston#usage

---

## Testing

### Jest 29.7.0

**Purpose:** JavaScript testing framework

**Configuration File:** `jest.config.js`

**Test Files Location:** `__tests__/`

**Setup:**

```bash
npm test                  # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

**Test Examples:**

```javascript
describe('Auth', () => {
  test('should login successfully', () => {
    expect(true).toBe(true);
  });
});
```

**Resources:**

- Official: https://jestjs.io
- Docs: https://jestjs.io/docs/getting-started

### Supertest 6.3.3

**Purpose:** HTTP assertion library for testing APIs

**Usage:**

```javascript
import request from 'supertest';
import app from '../server.js';

describe('POST /api/auth/login', () => {
  test('should return 200 with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ uname: 'testuser', password: 'password123' });
    expect(res.statusCode).toBe(200);
  });
});
```

**Resources:**

- NPM: https://www.npmjs.com/package/supertest
- Docs: https://github.com/visionmedia/supertest

---

## Monitoring & Observability

### Prometheus 15.0.0

**Purpose:** Metrics collection and monitoring

**Metrics Endpoint:** `/metrics`

**Metrics Collected:**

- HTTP request duration
- Request count by method/route/status
- Error count
- Database query duration
- Node.js process metrics

**File:** `utils/metrics.js`

**Integration with Grafana:** See `infrastructure/` folder

**Resources:**

- Official: https://prometheus.io
- Docs: https://prometheus.io/docs

### Sentry (Optional)

**Package:** `@sentry/node` (7.84.0)

**Purpose:** Error tracking and performance monitoring

**Setup:**

```env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
```

**Resources:**

- Official: https://sentry.io
- Docs: https://docs.sentry.io/platforms/node/

---

## API Documentation

### Swagger/OpenAPI 3.0

**Packages:**

- `swagger-jsdoc` (6.2.8) - Convert JSDoc to OpenAPI
- `swagger-ui-express` (5.0.0) - Interactive API explorer

**Documentation Location:** `docs/swagger/`

**Folder Structure:**

```
docs/swagger/
├── swaggerConfig.js           # Main configuration
├── schemas.js                 # Reusable schemas
└── endpoints/
    ├── auth.swagger.js        # Auth endpoints docs
    └── profile.swagger.js     # Profile endpoints docs
```

**Access:** http://localhost:5000/api-docs

**Resources:**

- Swagger: https://swagger.io
- OpenAPI: https://spec.openapis.org/oas/v3.0.0
- swagger-jsdoc: https://github.com/Surnet/swagger-jsdoc
- swagger-ui-express: https://github.com/scottie1984/swagger-ui-express

---

## Development Tools

### ESLint 8.57.1

**Purpose:** JavaScript linter for code quality

**Configuration:** `.eslintrc.json`

**Usage:**

```bash
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix issues
```

**Resources:**

- Official: https://eslint.org
- Docs: https://eslint.org/docs/latest

### Prettier 2.8.8

**Purpose:** Code formatter for consistency

**Configuration:** `.prettierrc`

**Usage:**

```bash
npm run format        # Format all files
```

**Resources:**

- Official: https://prettier.io
- Docs: https://prettier.io/docs/en/index.html

### Husky 8.0.3

**Purpose:** Git hooks automation

**Setup:**

```bash
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
```

**Resources:**

- Official: https://typicode.github.io/husky
- Docs: https://typicode.github.io/husky

### Nodemon 3.1.11

**Purpose:** Auto-restart Node.js during development

**Usage:**

```bash
npm run dev    # Start with nodemon
```

**Configuration:** `nodemon.json` (if exists) or package.json

**Resources:**

- Official: https://nodemon.io
- Docs: https://github.com/remy/nodemon#nodemon

### Cross-env 7.0.3

**Purpose:** Cross-platform environment variables

**Usage:**

```bash
cross-env NODE_ENV=production node server.js
```

**Resources:**

- NPM: https://www.npmjs.com/package/cross-env

---

## CI/CD & Deployment

### GitHub Actions

**Workflows Location:** `.github/workflows/`

**Workflows:**

1. `ci.yml` - Continuous Integration (lint, test, build)
2. `codeql.yml` - Security scanning
3. `docker-publish.yml` - Docker image building
4. `release.yml` - Automated versioning

**Resources:**

- Official: https://github.com/features/actions
- Docs: https://docs.github.com/en/actions

### Semantic Release 19.0.0

**Purpose:** Automated versioning and releases

**Configuration:** `.releaserc.json`

**Plugins:**

- @semantic-release/commit-analyzer
- @semantic-release/release-notes-generator
- @semantic-release/changelog
- @semantic-release/github
- @semantic-release/git

**Usage:**

```bash
npm run release    # Trigger release
```

**Resources:**

- Official: https://semantic-release.gitbook.io
- Docs: https://github.com/semantic-release/semantic-release

### Docker

**Files:**

- `Dockerfile` - Development image
- `Dockerfile.prod` - Production image (multi-stage)
- `docker-compose.yml` - Development composition
- `docker-compose.prod.yml` - Production composition

**Resources:**

- Official: https://www.docker.com
- Docs: https://docs.docker.com
- Best Practices: https://docs.docker.com/develop/dev-best-practices

---

## Environment Configuration

### dotenv 17.2.3

**Purpose:** Load environment variables from `.env` file

**File:** `.env` (local, not committed)

**Template:** `.env.example`

**Usage:**

```javascript
import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.DB_HOST;
```

**Resources:**

- Official: https://www.npmjs.com/package/dotenv
- Docs: https://github.com/motdotla/dotenv

---

## Directory Reference

```
ameyo-crm/
├── config/                    # Configuration files
│   ├── db.js                 # Database connection
│   └── swagger.js            # (deprecated - see docs/swagger)
├── controllers/              # Business logic handlers
│   └── authController.js     # Auth operations
├── docs/                     # Documentation
│   ├── api-reference/        # API documentation
│   └── swagger/              # Swagger/OpenAPI configs
│       ├── swaggerConfig.js
│       ├── schemas.js
│       └── endpoints/
├── middleware/               # Express middleware
│   ├── auth.js              # JWT verification
│   ├── validation.js        # Input validation
│   ├── rateLimiter.js       # Rate limiting
│   └── sanitizer.js         # XSS prevention
├── models/                  # Sequelize models
│   ├── index.js            # Model initialization
│   ├── User.js             # User model
│   └── UserType.js         # User role model
├── routes/                 # API routes
│   └── auth.js            # Auth endpoints
├── services/              # Business logic
│   └── authService.js    # Auth service
├── utils/                # Utilities
│   ├── logger.js        # Winston logger
│   └── metrics.js       # Prometheus metrics
├── tech-stack/          # Tech documentation
├── setup/               # Setup guides
├── infrastructure/      # Docker & deployment
└── server.js           # Express app entry
```

---

## Quick Links

- **Documentation:** `/docs`
- **API Reference:** `/docs/api-reference`
- **Tech Stack:** `/tech-stack` (this file)
- **Setup Guide:** `/setup/INSTALLATION.md`
- **API Docs (Live):** http://localhost:5000/api-docs
- **Metrics:** http://localhost:5000/metrics
- **GitHub:** https://github.com/sandeep-atiya/Ameyo-crm

---

## Getting Help

Refer to the respective resources and documentation for each technology. Most projects provide excellent official documentation and community support.

For project-specific issues, check `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.
