# Developer Quick Start Index

A quick reference guide to all documentation and how to navigate the project.

## 🚀 I'm New! Where Do I Start?

### 1️⃣ First Time Setup (15 minutes)
👉 **Read:** `setup/INSTALLATION.md`
- Environment setup
- Database configuration
- Running the project locally

### 2️⃣ Understand the Project
👉 **Read:** `setup/ARCHITECTURE.md`
- How the project is organized
- Architectural patterns used
- Data flow diagram
- File placement guide

### 3️⃣ Learn the Tech Stack
👉 **Read:** `tech-stack/TECH_STACK.md`
- All technologies explained
- How each component works
- Links to official docs
- Code examples

### 4️⃣ API Documentation
👉 **Visit:** http://localhost:5000/api-docs (when running)
- Interactive API explorer
- Try endpoints
- See request/response examples
- Test authentication

---

## 📚 Documentation Map

```
Project Documentation Structure
│
├─ 🏠 README.md (main overview)
│
├─ 📖 SETUP GUIDES (setup/)
│   ├─ INSTALLATION.md          ← Start here for setup
│   ├─ ARCHITECTURE.md          ← Understand structure
│   └─ ENVIRONMENT.md           ← Config details
│
├─ 🔧 TECH STACK (tech-stack/)
│   └─ TECH_STACK.md            ← All technologies explained
│
├─ 📝 API DOCS (docs/swagger/)
│   ├─ README.md                ← How to document APIs
│   ├─ swaggerConfig.js         ← Main config
│   ├─ schemas.js               ← Data models
│   └─ endpoints/
│       ├─ auth.swagger.js      ← Auth endpoints
│       └─ profile.swagger.js   ← Profile endpoints
│
├─ 🤝 CONTRIBUTION
│   ├─ CONTRIBUTING.md          ← How to contribute
│   └─ CODE_OF_CONDUCT.md       ← Community standards
│
└─ 🐛 TROUBLESHOOTING
    └─ setup/TROUBLESHOOTING.md ← Common issues
```

---

## 🎯 Common Tasks

### Setting Up Development Environment

```
1. Read: setup/INSTALLATION.md
2. Install Node.js 18+
3. Clone repository
4. npm install
5. Copy .env.example to .env
6. Configure database
7. npm run dev
```

**Time:** ~15 minutes

### Adding a New API Endpoint

```
1. Create route in: routes/[feature].js
2. Create controller in: controllers/[feature]Controller.js
3. Create service in: services/[feature]Service.js
4. Create model in: models/[Feature].js (if new entity)
5. Document in: docs/swagger/endpoints/[feature].swagger.js
6. Add tests in: __tests__/routes/[feature].test.js
7. Commit with message: feat(feature): add new endpoint
```

**Time:** ~1-2 hours (varies)

### Understanding Project Structure

```
1. Read: setup/ARCHITECTURE.md
2. Review layers:
   - Routes: routes/
   - Controllers: controllers/
   - Services: services/
   - Models: models/
   - Middleware: middleware/
3. Trace a request through the code
```

**Time:** ~30 minutes

### Working with API Documentation

```
1. Read: docs/swagger/README.md
2. Look at existing examples: auth.swagger.js
3. Add JSDoc comments to your route
4. Register in: docs/swagger/swaggerConfig.js
5. Test at: http://localhost:5000/api-docs
```

**Time:** ~20 minutes per endpoint

### Running Tests

```
1. Write test in: __tests__/[feature].test.js
2. Run: npm test
3. Watch mode: npm run test:watch
4. Coverage: npm run test:coverage
```

**Time:** Variable

### Database Operations

```
1. Create migration: sequelize-cli migration:generate
2. Edit migration file in: migrations/
3. Run: npm run db:migrate
4. Create seeder: sequelize-cli seed:generate
5. Edit seeder in: seeders/
6. Run: npm run db:seed
```

**Time:** ~15 minutes

---

## 🗂️ Folder Guide

### Source Code

| Folder | Purpose | Files to Create |
|--------|---------|-----------------|
| `routes/` | API endpoints | `[feature].js` |
| `controllers/` | Request handlers | `[feature]Controller.js` |
| `services/` | Business logic | `[feature]Service.js` |
| `models/` | Database models | `[Feature].js` |
| `middleware/` | Express middleware | `[feature].js` |
| `utils/` | Helper functions | `[feature].js` |

### Documentation

| Folder | Purpose | When to Update |
|--------|---------|----------------|
| `docs/swagger/` | API documentation | After adding endpoints |
| `tech-stack/` | Technology guides | When adding tech |
| `setup/` | Setup guides | When changing setup |
| `.github/workflows/` | CI/CD | When changing process |

### Configuration

| File | Purpose |
|------|---------|
| `.env` | Local environment variables (not in git) |
| `.env.example` | Template for .env (in git) |
| `.eslintrc.json` | Code style rules |
| `.prettierrc` | Code formatter rules |
| `jest.config.js` | Test configuration |
| `.releaserc.json` | Release automation |

---

## 🔗 Quick Links

### Documentation
- **Main README:** `README.md`
- **Setup Guide:** `setup/INSTALLATION.md`
- **Architecture:** `setup/ARCHITECTURE.md`
- **Tech Stack:** `tech-stack/TECH_STACK.md`
- **API Docs Guide:** `docs/swagger/README.md`
- **Contributing:** `CONTRIBUTING.md`

### Live Resources (when running)
- **API Docs:** http://localhost:5000/api-docs
- **Health Check:** http://localhost:5000/health
- **Metrics:** http://localhost:5000/metrics (Prometheus)

### External Resources
- **GitHub:** https://github.com/sandeep-atiya/Ameyo-crm
- **Node.js:** https://nodejs.org
- **Express:** https://expressjs.com
- **Sequelize:** https://sequelize.org
- **OpenAPI:** https://spec.openapis.org

---

## 📋 Key Files Explained

### Project Root

| File | What It Does |
|------|-------------|
| `server.js` | Express app entry point, middleware setup |
| `package.json` | Dependencies, scripts, project metadata |
| `.env.example` | Template for environment variables |
| `.eslintrc.json` | Code linting rules |
| `.prettierrc` | Code formatting rules |
| `jest.config.js` | Test framework configuration |

### Configuration

| File | Purpose |
|------|---------|
| `config/db.js` | Database connection setup |
| `config/swagger.js` | (Deprecated) - now at `docs/swagger/swaggerConfig.js` |

### Models

| File | Defines |
|------|---------|
| `models/index.js` | Model initialization & associations |
| `models/User.js` | User database schema |
| `models/UserType.js` | User role database schema |

### Middleware

| File | Responsibility |
|------|-----------------|
| `middleware/auth.js` | JWT token verification |
| `middleware/validation.js` | Input validation |
| `middleware/rateLimiter.js` | Request rate limiting |
| `middleware/sanitizer.js` | XSS attack prevention |

---

## 💡 Development Tips

### 1. Code Navigation

```
# Follow the request flow
routes → controllers → services → models
# Example: POST /api/auth/login
routes/auth.js 
  → authController.login() 
    → authService.loginUser()
      → models/index.js (User model)
```

### 2. Understanding Errors

```
1. Check server console for error message
2. Look at error stack trace
3. Navigate to the file and line number
4. Review middleware chain that precedes
5. Check .env configuration
```

### 3. Adding Features

```
1. Start with API route: routes/
2. Add controller logic: controllers/
3. Add business logic: services/
4. Add database model: models/
5. Document API: docs/swagger/
6. Add tests: __tests__/
7. Update README if needed
```

### 4. Testing Changes

```
npm run lint         # Check for errors
npm run lint:fix     # Auto-fix issues
npm run format       # Format code
npm test             # Run tests
npm run dev          # Manual testing
```

---

## 🚨 Important Notes

### Environment Variables

⚠️ **NEVER** commit `.env` file
✅ Use `.env.example` as template
✅ Keep secrets in `.env` only
✅ Use different values for dev/prod

### Database

⚠️ Always backup before db:reset
✅ Use migrations for schema changes
✅ Use seeders for test data
✅ Test migrations locally first

### API Documentation

✅ Update docs when adding endpoints
✅ Keep examples current
✅ Test in `/api-docs` UI
✅ Follow OpenAPI 3.0 standard

### Commits

✅ Use conventional commit format
✅ Examples: `feat(auth):`, `fix(user):`, `docs(readme):`
✅ Husky will check your commits
✅ Pre-commit linting enabled

---

## 🆘 Need Help?

### Can't Find Something?

1. Check this file (DEVELOPER_INDEX.md)
2. Read `setup/ARCHITECTURE.md` 
3. Check `CONTRIBUTING.md`
4. Search in `tech-stack/TECH_STACK.md`
5. Review existing code examples
6. Check GitHub issues

### Common Issues?

👉 See: `setup/TROUBLESHOOTING.md`

### Want to Contribute?

👉 Read: `CONTRIBUTING.md`

### Questions About Tech Stack?

👉 Read: `tech-stack/TECH_STACK.md`

---

## 📊 Quick Stats

```
Total Files: 50+
Total Dependencies: 28+
Documented Endpoints: 4 (expandable)
Test Coverage: Configurable
Code Quality: ESLint + Prettier
API Documentation: OpenAPI 3.0
```

---

## 🎓 Learning Path

**Week 1:**
- [ ] Setup local environment
- [ ] Understand architecture
- [ ] Read tech stack overview
- [ ] Explore existing code

**Week 2:**
- [ ] Add small API endpoint
- [ ] Write tests
- [ ] Document endpoint
- [ ] Submit first PR

**Week 3+:**
- [ ] More complex features
- [ ] Performance optimization
- [ ] Database optimization
- [ ] Security hardening

---

## 🎯 Next Steps

1. **Start:** `setup/INSTALLATION.md`
2. **Learn:** `setup/ARCHITECTURE.md`
3. **Understand:** `tech-stack/TECH_STACK.md`
4. **Code:** Follow architectural patterns
5. **Document:** `docs/swagger/`
6. **Test:** `__tests__/`
7. **Commit:** Conventional format
8. **Deploy:** See CI/CD workflows

---

## 📞 Support Resources

| Need | Where |
|------|-------|
| Setup Help | `setup/INSTALLATION.md` |
| Architecture Questions | `setup/ARCHITECTURE.md` |
| Tech Stack Info | `tech-stack/TECH_STACK.md` |
| API Documentation | `/api-docs` or `docs/swagger/` |
| Contribution Rules | `CONTRIBUTING.md` |
| Code of Conduct | `CODE_OF_CONDUCT.md` |
| General Issues | GitHub Issues |

---

**Last Updated:** November 26, 2025

**Happy Coding!** 🚀

For detailed information on any topic, refer to the specific documentation files mentioned above.
