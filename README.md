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

```
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
```
2. Copy `.env.example` to `.env` and set your DB and JWT values.
3. Start the server:
```powershell
node server.js
# or in dev:
npm run dev
```

Important: DB sync
- Sequelize auto-sync/alter is disabled by default. To allow it (development only), set `DB_SYNC=true` in your `.env`. Do not enable this against production databases unless you know what changes will be applied.

API (auth)
- POST `/api/auth/register` — register user (body: `uname`, `password`, optional `ProPicture`, `UserTypeID`)
- POST `/api/auth/login` — login (body: `uname`, `password`)
- GET `/api/auth/profile` — get profile (requires `Authorization: Bearer <token>`)
- PUT `/api/auth/profile` — update profile (protected)

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

---
Maintainer: Project workspace
