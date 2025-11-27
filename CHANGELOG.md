# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- (coming soon)

### Changed

- (coming soon)

### Deprecated

- (coming soon)

### Removed

- (coming soon)

### Fixed

- (coming soon)

### Security

- (coming soon)

---

## [1.0.0](https://github.com/sandeep-atiya/Ameyo-crm/releases/tag/1.0.0) - 2025-11-27

### Added

- Initial release of Ameyo CRM
- **Authentication System**
  - JWT-based authentication with configurable expiry
  - Secure password hashing with bcryptjs
  - User registration and login endpoints
  - Profile management endpoints
- **Validation & Security**

  - Joi schema validation for all inputs
  - Input sanitization middleware (XSS prevention)
  - Rate limiting protection
  - CORS and Helmet security headers
  - Request logging with Morgan

- **Middleware Stack**

  - Auth middleware for JWT verification
  - Error handler middleware for centralized error handling
  - Request logger middleware
  - Rate limiter middleware
  - Sanitizer middleware for XSS protection
  - Validation middleware for request validation

- **Architecture**

  - Layered architecture (Routes → Controllers → Services → Repositories → Models)
  - Sequelize ORM for MSSQL database
  - Repository pattern for data access
  - Service layer for business logic
  - Custom exception handling

- **API Documentation**

  - Swagger/OpenAPI integration
  - Interactive API documentation at /api-docs
  - Reusable schemas and endpoint definitions

- **Monitoring & Observability**

  - Prometheus metrics endpoint (/metrics)
  - Health check endpoints (/health, /live, /ready)
  - Winston structured logging
  - (Optional) Sentry error tracking integration

- **Development Tools**

  - ESLint for code quality
  - Prettier for code formatting
  - Jest for unit/integration testing
  - Husky & lint-staged for pre-commit hooks
  - Git conventional commits support

- **Deployment**

  - Docker support with development and production Dockerfiles
  - Docker Compose configurations for both dev and prod
  - Kubernetes manifests (base structure)
  - Environment-based configuration

- **Testing**

  - Jest configuration
  - Route tests for authentication
  - Service tests for business logic
  - Test coverage setup

- **Documentation**
  - Comprehensive README with quick start guide
  - Installation and setup guide
  - Contributing guidelines with workflow
  - Architecture documentation
  - Technology stack documentation
  - Code of Conduct

### Changed

- (none for initial release)

### Fixed

- ESLint configuration format (JSON format)
- ESLint errors and warnings (26 warnings in test files only)

### Security

- Password hashing with bcryptjs (salt rounds: 10)
- JWT token-based authentication
- Input sanitization for XSS prevention
- Rate limiting for brute force protection
- CORS configuration for safe cross-origin requests
- Helmet middleware for HTTP security headers

---

## Project Milestones

### Pre-Release Development

- **Commit:** b1739d5 - Initial project commit
- **Commit:** 39b9198 - Setup correct configuration
- **Commit:** 7059b65 - Environment file updates
- **Commit:** b9867f2 - ESLint config format fix (JSON)
- **Commit:** a097ad9 - ESLint fixes - 0 errors, 26 warnings
- **Commit:** 3e7fefb - ESLint errors and formatting fixes
- **Commit:** a1ec73d - New feature branch work
- **Commit:** 308f8d8 - Restructured project setup

---

## Release Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and changelog generation.

### Versioning Scheme

- **MAJOR** - Breaking changes (`BREAKING CHANGE:` in commit body)
- **MINOR** - New features (`feat:`)
- **PATCH** - Bug fixes (`fix:`, `perf:`, `revert:`)
- **No bump** - Other changes (`docs:`, `style:`, `refactor:`, `test:`, `chore:`)

### Commit Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `perf` - Performance improvement
- `refactor` - Code refactoring
- `test` - Test additions
- `docs` - Documentation
- `chore` - Maintenance
- `ci` - CI/CD changes
- `style` - Code style

---

## How to Release

```bash
# Automatic release (triggered by CI)
# Push commits to main branch → GitHub Actions → semantic-release

# Manual release (if needed)
npm run release
```

---

## Notes

- **Database:** MSSQL Server 2019+
- **Node.js:** 18+
- **Package Manager:** npm 9+

---

## Contributing

See [CONTRIBUTING.md](documentation/CONTRIBUTING.md) for contribution guidelines.

---

## License

ISC License - See LICENSE file for details
