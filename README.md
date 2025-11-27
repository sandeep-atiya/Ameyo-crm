# Ameyo CRM - Professional Node.js Backend API

A scalable, well-organized, and production-ready CRM backend application built with Node.js, Express, and MSSQL. Features JWT authentication, comprehensive validation, security middleware, monitoring, and logging.

**Version:** 1.0.0 | **License:** ISC | **Repository:** [GitHub](https://github.com/sandeep-atiya/Ameyo-crm)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+ or **yarn**
- **MSSQL Server** 2019+ (local or Docker)
- **Git** ([Download](https://git-scm.com))

### Installation (< 5 minutes)

```bash
# Clone repository
git clone https://github.com/sandeep-atiya/Ameyo-crm.git
cd Ameyo-crm

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MSSQL credentials

# Run migrations and seeds
npm run db:migrate
npm run db:seed

# Start development server
npm run dev

# Server running at http://localhost:5000
# API Docs at http://localhost:5000/api-docs
```

---

## 📁 Project Structure

```
src/
├── config/              # Database and app configuration
│   ├── db.js            # MSSQL connection setup
│   └── index.js         # Config exports
├── constants/           # Application constants
├── controllers/         # HTTP request handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── index.js
├── exceptions/          # Custom error classes
├── helpers/             # Utility helpers
├── middleware/          # Express middleware stack
│   ├── auth.js          # JWT authentication
│   ├── error-handler.js # Global error handling
│   ├── rate-limiter.js  # DDoS protection
│   ├── request-logger.js # Request logging
│   ├── sanitizer.js     # XSS protection
│   └── index.js
├── models/              # Sequelize ORM models
│   ├── user.model.js
│   ├── user-type.model.js
│   └── index.js
├── repositories/        # Data access layer
│   ├── user.repository.js
│   └── index.js
├── routes/              # API route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── index.js
├── services/            # Business logic layer
│   ├── auth.service.js
│   ├── user.service.js
│   └── index.js
├── utils/               # Utility functions
│   ├── logger.js        # Winston logger
│   ├── response-formatter.js
│   ├── sanitizer.js
│   └── index.js
└── validations/         # Joi validation schemas
    ├── auth.validation.js
    ├── user.validation.js
    ├── validation-middleware.js
    └── index.js

documentation/          # Comprehensive guides
__tests__/              # Test suites
logs/                   # Application logs
migrations/             # Database migrations
seeders/                # Database seeders
public/                 # Static assets
```

---

## 🔑 Key Features

### ✅ Authentication & Authorization

- **JWT-based** authentication with configurable expiry
- Secure token generation and validation
- Protected routes with `authenticate` middleware
- Password hashing with **bcryptjs**

### ✅ Input Validation & Sanitization

- **Joi schema** validation for all inputs
- Separate validation files per feature
- Middleware validation for body, params, query
- **XSS protection** via input sanitization
- **helmet.js** for HTTP headers security

### ✅ Middleware Stack

- **Auth Middleware** - JWT token verification
- **Error Handler** - Centralized error handling
- **Request Logger** - Comprehensive logging via Morgan
- **Rate Limiter** - Brute force protection
- **Sanitizer** - XSS prevention

### ✅ Error Handling

- Custom exception classes
- Global error handler middleware
- Proper HTTP status codes
- Detailed error responses

### ✅ Data Layer Architecture

- **Repositories** - Pure database queries
- **Services** - Business logic orchestration
- **Controllers** - HTTP request handling
- **Models** - Sequelize ORM definitions

### ✅ Monitoring & Observability

- **Prometheus metrics** endpoint (`/metrics`)
- **Sentry** error tracking (optional)
- **Health check** endpoints (`/health`, `/live`, `/ready`)
- **Structured logging** with Winston

### ✅ Code Quality

- **ESLint & Prettier** for consistent code style
- **Jest** for unit/integration testing
- **Husky & lint-staged** for pre-commit hooks
- Comprehensive JSDoc comments

---

## 🔗 API Endpoints

### Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Authenticate user and get token
GET    /api/auth/profile         - Get authenticated user's profile
PUT    /api/auth/profile         - Update authenticated user's profile
```

### Users

```
GET    /api/users                - Get all users with pagination
GET    /api/users/:userId        - Get user by ID
PUT    /api/users/:userId        - Update user
DELETE /api/users/:userId        - Delete user
```

### System

```
GET    /api-docs                 - Swagger/OpenAPI documentation
GET    /health                   - Health check
GET    /live                     - Liveness probe
GET    /ready                    - Readiness probe (includes DB check)
GET    /metrics                  - Prometheus metrics
```

---

## 📋 NPM Scripts

```bash
npm run dev              # Start development server with nodemon
npm start               # Start production server
npm test               # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint          # Check code with ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
npm run db:migrate    # Run database migrations
npm run db:seed       # Run database seeders
npm run db:reset      # Reset database (undo all + migrate + seed)
npm run ci            # Run CI checks (lint + tests)
npm run release       # Create semantic release
```

---

## 🛡️ Security Features

- **Password Hashing** - bcryptjs for secure password encryption
- **JWT Tokens** - Secure token-based authentication
- **Rate Limiting** - Protection against brute force attacks
- **XSS Protection** - Input sanitization middleware
- **CORS** - Cross-origin resource sharing control
- **Helmet** - HTTP security headers
- **Request Validation** - Joi schemas for all inputs
- **Error Handling** - Safe error responses without sensitive data leaks

---

## 🗄️ Database Setup

### Configuration

Database credentials are configured via `.env` file:

```env
DB_HOST=192.168.10.76
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=your_password
DB_NAME=DristhiSoftTechDBOld
DB_DIALECT=mssql
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d
```

### Migrations & Seeders

```bash
# Run pending migrations
npm run db:migrate

# Run all seeders
npm run db:seed

# Reset database (undo all + migrate + seed)
npm run db:reset
```

---

## 🐳 Docker Setup

### Development with Docker

```bash
# Build and start services
docker-compose up --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Deployment

```bash
# Build production image
docker build -f docker/Dockerfile.prod -t ameyo-crm:1.0.0 .

# Push to registry
docker tag ameyo-crm:1.0.0 your-registry/ameyo-crm:1.0.0
docker push your-registry/ameyo-crm:1.0.0

# Deploy with production compose file
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure

```
__tests__/
├── routes/
│   └── auth.test.js
└── services/
    └── authService.test.js
```

---

## 📚 Documentation

All documentation is organized in the `documentation/` folder:

| Document               | Purpose                                 |
| ---------------------- | --------------------------------------- |
| **ARCHITECTURE.md**    | System design and architecture patterns |
| **INSTALLATION.md**    | Detailed setup instructions             |
| **CONTRIBUTING.md**    | Contribution guidelines and workflows   |
| **TECH_STACK.md**      | Technology stack overview               |
| **CODE_OF_CONDUCT.md** | Community standards and behavior        |
| **MONITORING.md**      | Observability and monitoring setup      |

---

## 🔄 Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Before Committing

```bash
# Format code
npm run format

# Lint and fix
npm run lint:fix

# Run tests
npm test
```

### Conventional Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat(auth): add two-factor authentication
fix(user): correct profile update validation
docs(readme): update installation steps
```

### Submitting a Pull Request

1. Push your branch to GitHub
2. Create a Pull Request to `main`
3. Ensure CI passes (lint, tests)
4. Request review from team members
5. Merge once approved

---

## 🚨 Troubleshooting

### MSSQL Connection Issues

```bash
# Verify connection string in .env
# Check MSSQL server is running
# Test connection:
sqlcmd -S localhost -U sa -P password
```

### Port Already in Use

```bash
# Kill process on port 5000 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Or use different port
$env:PORT = 5001; npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Database Migrations Failed

```bash
# Check migration files
Get-ChildItem migrations/

# Manually revert and retry
npm run db:reset
```

---

## 📞 Support & Contact

For issues, feature requests, or security concerns:

- **Issues:** [GitHub Issues](https://github.com/sandeep-atiya/Ameyo-crm/issues)
- **Discussions:** [GitHub Discussions](https://github.com/sandeep-atiya/Ameyo-crm/discussions)
- **Security:** Report privately to maintainers

---

## 📄 License

This project is licensed under the **ISC License** - see LICENSE file for details.

---

## 👨‍💻 Contributors

- **Maintainer:** [@sandeep-atiya](https://github.com/sandeep-atiya)

See [CONTRIBUTING.md](documentation/CONTRIBUTING.md) for ways to contribute!
