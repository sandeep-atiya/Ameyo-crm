# Ameyo CRM - Professional Backend API

A scalable, well-organized, and production-ready Node.js/Express CRM application with comprehensive authentication, validation, middleware, and monitoring systems.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **MSSQL Server** (configured)
- **.env** file configured (copy from `.env.example`)

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Start development server
npm run dev

# 4. Visit API documentation
# Open http://localhost:5000/api-docs in your browser
```

## 📁 Project Structure

```
src/
├── routes/              # API route definitions (auth.routes.js, user.routes.js)
├── controllers/         # HTTP request handlers (auth.controller.js, user.controller.js)
├── services/           # Business logic layer (auth.service.js, user.service.js)
├── repositories/       # Data access layer (user.repository.js)
├── models/            # Sequelize ORM models (user.model.js, user-type.model.js)
├── middleware/        # Express middleware (auth.js, error-handler.js, rate-limiter.js, sanitizer.js)
├── validations/       # Joi validation schemas (auth.validation.js, user.validation.js)
├── constants/         # Application constants and configurations
├── utils/            # Utility functions (response-formatter.js, sanitizer.js, logger.js)
├── exceptions/       # Custom error classes (AppError, ValidationError, etc.)
└── config/           # Database and app configuration (db.js)

documentation/        # Comprehensive guides and documentation
tests/               # Test suites
logs/                # Application logs
public/              # Static files and assets
```

## 📚 Documentation

All documentation is organized in the `documentation/` folder. Start with:

- **DEVELOPER_INDEX.md** - Navigation guide for developers
- **PROJECT_STRUCTURE_DIAGRAM.md** - Visual project organization
- **CODE_OF_CONDUCT.md** - Community guidelines
- **CONTRIBUTING.md** - Contribution guidelines

## 🔑 Key Features

✅ **Authentication & Authorization**

- JWT-based authentication with configurable expiry
- Protected routes with `authenticate` middleware
- Secure token generation and validation

✅ **Validation System**

- Joi schema validation for all inputs
- Separate validation files per feature (auth.validation.js, user.validation.js)
- Validation middleware for body, params, and query strings

✅ **Middleware Stack**

- Auth Middleware - JWT token verification
- Error Handler - Centralized error handling with proper HTTP status codes
- Request Logger - Comprehensive request logging via Morgan
- Rate Limiter - Brute force protection (configurable per environment)
- Sanitizer - XSS protection via input sanitization

✅ **Error Handling**

- Custom exception classes for different error types
- Global error handler middleware
- Proper HTTP status codes for all responses

✅ **Data Layer Separation**

- Repositories - Pure database query functions
- Services - Business logic and orchestration
- Controllers - HTTP request handling
- Models - Sequelize ORM definitions

✅ **Code Quality**

- ESLint & Prettier for consistent code style
- Comprehensive JSDoc comments
- Semantic naming conventions
- Modular and scalable architecture

✅ **Monitoring & Observability**

- Prometheus metrics endpoint (`/metrics`)
- Sentry error tracking (optional)
- Health check endpoints (`/health`, `/live`, `/ready`)
- Structured logging with Winston

## 🔗 API Endpoints

### Authentication

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Authenticate user and get token
GET    /api/auth/profile      - Get authenticated user's profile (requires token)
PUT    /api/auth/profile      - Update authenticated user's profile (requires token)
```

### Users

```
GET    /api/users             - Get all users with pagination (requires token)
GET    /api/users/:userId     - Get user by ID (requires token)
PUT    /api/users/:userId     - Update user (requires token)
DELETE /api/users/:userId     - Delete user (requires token)
```

### System

```
GET    /api-docs             - Swagger/OpenAPI documentation
GET    /health               - Health check
GET    /live                 - Liveness probe
GET    /ready                - Readiness probe (includes DB check)
GET    /metrics              - Prometheus metrics
```

## 📋 NPM Scripts

```bash
npm run dev              # Start development server with nodemon
npm start               # Start production server
npm test               # Run tests
npm run lint          # Check code with ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
npm run db:migrate    # Run database migrations
npm run db:seed       # Run database seeders
npm run db:reset      # Reset database
```

## 🛡️ Security Features

- **Password Hashing** - bcryptjs for password encryption
- **JWT Tokens** - Secure token-based authentication
- **Rate Limiting** - Protect endpoints from brute force attacks
- **XSS Protection** - Input sanitization middleware
- **CORS** - Cross-origin resource sharing control
- **Helmet** - HTTP security headers
- **Request Validation** - Joi schemas for all inputs

## 🗄️ Database

### Configuration

Database credentials are configured via `.env` file:

```env
DB_HOST=192.168.10.76
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=your_password
DB_NAME=DristhiSoftTechDBOld
DB_DIALECT=mssql
```

3. Start the server:

```powershell
node server.js
# or in dev:
npm run dev
```

## Production deployment

These are basic steps to build and run the app in production using the
multi-stage Dockerfile and `docker-compose.prod.yml` included in this repo.

1. Build the production image locally (or use your CI to build and push):

```bash
docker build -f Dockerfile.prod -t ameyo-crm:latest .
```

2. Push to your registry (example):

```bash
docker tag ameyo-crm:latest your-registry/ameyo-crm:latest
docker push your-registry/ameyo-crm:latest
```

3. Start production services with the production compose file (ensure
   environment variables are provided securely - do not commit secrets):

```bash
# Use an env file or set environment variables from your secret manager
docker compose -f docker-compose.prod.yml up -d
```

Notes:

- Do not store `JWT_SECRET`, DB passwords, or other secrets in the repository.
- For production consider using a managed database (Azure SQL, AWS RDS) instead
  of running SQL Server in a container, and use network-restricted access.
- Monitoring, automated backups, and secure secret injection (K8s secrets,
  Docker secrets, or cloud secret managers) are strongly recommended.

## CI: Build and publish Docker image

You can automate building and pushing the production Docker image using
the included GitHub Actions workflow `.github/workflows/docker-publish.yml`.

Required repository secrets (set in the GitHub repository Settings → Secrets):

- `DOCKER_REGISTRY` — e.g. `docker.io` or `ghcr.io` (the registry hostname)
- `DOCKER_USERNAME` — username for the registry
- `DOCKER_PASSWORD` — password or token for the registry
- `DOCKER_IMAGE_NAME` — image name including namespace, e.g. `myorg/ameyo-crm`

After setting secrets, push to `main` or trigger the workflow manually from
the Actions tab to build and push the image.

Important: DB sync

- Sequelize auto-sync/alter is disabled by default. To allow it (development only), set `DB_SYNC=true` in your `.env`. Do not enable this against production databases unless you know what changes will be applied.

API (auth)

- POST `/api/auth/register` — register user (body: `uname`, `password`, optional `ProPicture`, `UserTypeID`)
- POST `/api/auth/login` — login (body: `uname`, `password`)
- GET `/api/auth/profile` — get profile (requires `Authorization: Bearer <token>`)
- PUT `/api/auth/profile` — update profile (protected)

Health & Readiness Checks

The server exposes three health-check endpoints for monitoring and orchestration:

- `GET /health` — basic health status (no dependencies checked)
- `GET /live` — liveness probe (is the server alive?)
- `GET /ready` — readiness probe (is the server ready to serve requests? includes DB connectivity check)

Example:

```bash
curl http://localhost:5000/health
# Response (200 if ready):
# {"success":true,"message":"Server is ready","database":"connected","timestamp":"2025-11-26T..."}
```

Environment variables (minimum)

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_DIALECT`
- `JWT_SECRET`, `JWT_EXPIRY`
- `DB_SYNC` (set to `true` only to allow sequelize.sync)

Security note

- The project was adjusted per request: password hashing may be disabled in `services/authService.js` (plain-text storage). This is insecure — to restore secure behavior, re-enable bcrypt hashing in that file.

Where to look

- Server entry: `server.js`
- DB config: `config/db.js`
- Models: `models/` (`User.js`, `UserType.js`)
- Routes: `routes/auth.js`
- Services: `services/authService.js`
- Middleware: `middleware/auth.js`, `middleware/validation.js`

Docs

- Legacy/archived docs moved to `docs/legacy/`.

If you want, I can also:

- Run the server now and verify startup (no DB ALTER will run).
- Re-enable secure bcrypt hashing and add an env toggle to switch between hashed/plain passwords.

## Development tooling: ESLint, Prettier, CI, Dependabot

This project includes recommended files to enable automated linting, formatting and dependency updates.

- ESLint config: `.eslintrc.js`
- Prettier config: `.prettierrc`
- Dependabot config: `.github/dependabot.yml`
- GitHub Actions CI workflow: `.github/workflows/ci.yml`
- Example environment variables: `.env.example`

Quick usage:

1. Install dev dependencies locally:

```powershell
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-node eslint-plugin-import husky lint-staged
```

2. Run the linter:

```powershell
npm run lint
```

3. Auto-fix issues where possible:

```powershell
npm run lint:fix
npm run format
```

4. Set up Husky hooks (one-time on contributor machine):

```powershell
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
```

`lint-staged` is already prepared in `package.json` to run ESLint and Prettier on staged files. After running `npm run prepare` and adding the `pre-commit` hook, commits will be automatically formatted/linted.

---

Maintainer: Project workspace

---

## API Documentation

Access interactive API documentation at http://localhost:5000/api-docs when the server is running.

### Swagger/OpenAPI Features

- ? Browse all endpoints with descriptions
- ? View request/response schemas
- ? Try endpoints directly from the UI
- ? Understand authentication requirements
- ? See example values

### Example Usage

\\\ash

# View documentation

curl http://localhost:5000/api-docs

# Register a new user

curl -X POST http://localhost:5000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"uname":"john_doe","password":"password123"}'

# Login

curl -X POST http://localhost:5000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"uname":"john_doe","password":"password123"}'

# Get profile (with token)

curl -X GET http://localhost:5000/api/auth/profile \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
\\\

---

## Rate Limiting & Security

### Rate Limiting Configuration

The API includes adaptive rate limiting to prevent abuse:

**Development Mode:**

- General API: 1000 requests per 15 minutes
- Authentication: 30 attempts per 15 minutes
- Sensitive operations: 10 requests per 15 minutes

**Production Mode:**

- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Sensitive operations: 2 requests per 15 minutes

### Input Sanitization

All user input is automatically sanitized to prevent XSS attacks:

\\\javascript
// Dangerous input
{ "username": "<script>alert('XSS')</script>" }

// After sanitization
{ "username": "alert('XSS')" }
\\\

### Rate Limit Response

When rate limit exceeded:

\\\json
{
"success": false,
"message": "Too many requests from this IP, please try again later."
}
\\\

Response includes \RateLimit-\*\ headers:

- \RateLimit-Limit\: Maximum requests allowed
- \RateLimit-Remaining\: Requests remaining
- \RateLimit-Reset\: Timestamp when limit resets

---

## Monitoring & Observability

### Prometheus Metrics

Prometheus metrics are available at \/metrics\ for monitoring and alerting.

#### Metrics Collected

1. **HTTP Metrics**

   - \http_request_duration_seconds\ - Request duration histogram (method, route, status)
   - \http_requests_total\ - Total requests counter
   - \
     equest_errors_total\ - Error counter

2. **Database Metrics**

   - \database_query_duration_seconds\ - Query duration histogram

3. **Node.js Metrics** (automatic)
   - Process memory usage
   - Process CPU usage
   - Event loop lag
   - Garbage collection statistics

#### Example Usage

\\\ash

# View metrics

curl http://localhost:5000/metrics

# Sample output

http_request_duration_seconds_bucket{method="GET",route="/api/auth/profile",status_code="200",le="0.1"} 5
http_requests_total{method="POST",route="/api/auth/login",status_code="200"} 23
request_errors_total{method="GET",route="/api/auth/profile",status_code="401"} 2
\\\

### Sentry Error Tracking (Optional)

Configure error tracking by setting \SENTRY_DSN\ in \.env\:

\\\env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
\\\

**Features:**

- ? Automatic error capture and reporting
- ? Error grouping by type and status
- ? Performance monitoring
- ? Breadcrumb tracking for debugging
- ? Environment-specific configuration

#### Example

\\\javascript
// Errors are automatically captured and sent to Sentry
try {
throw new Error('Something went wrong');
} catch (error) {
// Automatically sent to Sentry
}
\\\

---

## Semantic Versioning & Releases

This project uses \semantic-release\ for automated versioning and CHANGELOG generation.

### Commit Message Format

Follow Angular commit convention:

\\\
<type>(<scope>): <subject>

feat(auth): add two-factor authentication
fix(user): resolve profile update bug
docs(readme): update installation instructions
perf(db): optimize query performance
refactor(middleware): simplify error handling
test(login): add edge case tests
chore(deps): update dependencies
\\\

**Types:**

- \eat\ ? MINOR version bump (feature)
- \ix\ ? PATCH version bump (bug fix)
- \perf\ ? PATCH version bump (performance)
- \
  evert\ ? PATCH version bump
- \
  efactor\, \docs\, \ est\, \chore\ ? No version bump

### Automatic Release Process

1. Push commits to \main\ branch
2. GitHub Actions \
   elease.yml\ workflow runs
3. \semantic-release\ analyzes commits
4. CHANGELOG.md updated
5. package.json version bumped
6. New GitHub release created
7. Changes committed back to \main\

### Manual Release

\\\ash
npm run release
\\\
