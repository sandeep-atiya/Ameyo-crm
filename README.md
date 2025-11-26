# CRM Application - Professional Setup

A professional-grade Customer Relationship Management (CRM) system built with Node.js, Express, and Sequelize ORM.

## Features

✅ **Authentication & Authorization**

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (Admin, Manager, User)
- User session management

✅ **Validation**

- Request validation with Express-validator
- Password strength requirements
- Email format validation
- Phone number validation

✅ **Database**

- MySQL database support
- Sequelize ORM
- Environment-based configuration (Dev, Test, Prod)
- Database migrations and seeders

✅ **Logging**

- Winston logger with file and console transport
- Environment-specific logging levels
- Error tracking and debugging

✅ **Testing**

- Jest test framework
- Unit and integration tests
- Test coverage reporting

✅ **Security**

- Helmet for HTTP security headers
- CORS protection
- Input sanitization
- Rate limiting ready

## Project Structure

````
├── config/
│   ├── config.json          # Database configuration
│   └── db.js               # Database connection
├── controllers/            # Business logic
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── validation.js      # Input validation
├── models/
│   ├── index.js           # Model loader
# Ameyo CRM (concise)

Lightweight CRM API built with Node.js, Express, and Sequelize (MSSQL).

This repository is configured to use an existing MSSQL database (`DristhiSoftTechDBOld`) and exposes authentication endpoints (register, login, profile). The project is intended to work with a pre-existing schema — automatic schema changes are disabled by default.

Quick facts
- Frameworks: Node.js, Express
- ORM: Sequelize (dialect: mssql)
- Auth: JWT
- DB: Microsoft SQL Server (existing schema)

Quick start
1. Install dependencies:
```powershell
npm install
````

2. Copy `.env.example` to `.env` and set your DB and JWT values.
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
