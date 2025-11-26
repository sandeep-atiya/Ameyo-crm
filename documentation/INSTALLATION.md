# Developer Setup Guide

## Quick Start (5 minutes)

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org)
- **Git** - [Download](https://git-scm.com)
- **Docker** (optional) - [Download](https://docker.com)
- **MSSQL Server** (or Docker container)

### Step 1: Clone Repository

```powershell
git clone https://github.com/sandeep-atiya/Ameyo-crm.git
cd Ameyo-crm
```

### Step 2: Install Dependencies

```powershell
npm install
```

### Step 3: Setup Environment

```powershell
# Copy example env file
Copy-Item .env.example .env

# Edit .env with your settings
# Replace DB_HOST, DB_USER, DB_PASSWORD, etc.
```

### Step 4: Database Setup

```powershell
# Run migrations
npm run db:migrate

# Run seeders (optional)
npm run db:seed
```

### Step 5: Start Development Server

```powershell
npm run dev

# Server running at http://localhost:5000
# API Docs at http://localhost:5000/api-docs
```

---

## Detailed Setup

### 1. Node.js Installation

#### Windows

1. Download from [nodejs.org](https://nodejs.org)
2. Run installer
3. Select "Add to PATH" during installation
4. Verify:
   ```powershell
   node --version
   npm --version
   ```

#### macOS

```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

### 2. Git Setup

```powershell
# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Clone repository
git clone https://github.com/sandeep-atiya/Ameyo-crm.git
cd Ameyo-crm
```

### 3. Node Dependencies Installation

```powershell
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Check installed packages
npm list
npm list --depth=0
```

### 4. Environment Configuration

#### .env File Setup

Create `.env` file in project root:

```env
# Environment
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_NAME=ameyo_crm
DB_DIALECT=mssql

# JWT
JWT_SECRET=your-super-secret-key-change-in-prod
JWT_EXPIRY=7d

# Server
PORT=5000
APP_URL=http://localhost:5000

# Logging
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=*

# (Optional) Sentry
# SENTRY_DSN=https://...
```

**⚠️ Important:**

- Never commit `.env` file
- Keep secrets secure
- Use different secrets for production
- See `.env.example` for all options

### 5. Database Setup

#### Option A: Docker MSSQL

```powershell
# Start MSSQL container
docker run -e "ACCEPT_EULA=Y" `
           -e "SA_PASSWORD=YourPassword123" `
           -p 1433:1433 `
           --name mssql-server `
           mcr.microsoft.com/mssql/server:latest

# Or use docker-compose
docker-compose up -d
```

#### Option B: Local MSSQL Installation

1. Download [SQL Server Developer Edition](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2. Install with default settings
3. Update `.env` with connection details

#### Run Migrations

```powershell
# Run all migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Reset database (⚠️ Deletes all data)
npm run db:reset
```

#### Verify Connection

```powershell
# Start server and check logs
npm run dev

# Look for: "✅ Database connected successfully"
```

### 6. Start Development Server

```powershell
npm run dev

# Output:
# ✅ Database connected successfully
# ✅ Database models synced
# ✅ Server started on port 5000 [development]
```

### 7. Verify Installation

```bash
# Test API endpoints
curl http://localhost:5000/health
# {"success":true,"message":"Server is running","environment":"development"}

# View API documentation
# Open http://localhost:5000/api-docs in browser

# Check metrics
curl http://localhost:5000/metrics
```

---

## Common Development Commands

### Running the Application

```powershell
npm run dev          # Start with auto-reload (nodemon)
npm start            # Start production server
npm test             # Run tests
npm run test:watch  # Tests with file watching
```

### Code Quality

```powershell
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
npm run format       # Format code with Prettier
```

### Database

```powershell
npm run db:migrate       # Run migrations
npm run db:seed          # Run seeders
npm run db:reset         # Reset database (⚠️ Deletes data)
```

### Releases & Versioning

```powershell
npm run release      # Create new release (requires GitHub)
```

---

## IDE Setup

### Visual Studio Code (Recommended)

#### Extensions

Install these extensions for better development experience:

1. **ESLint** - dbaeumer.vscode-eslint
2. **Prettier** - esbenp.prettier-vscode
3. **REST Client** - humao.rest-client
4. **Swagger Viewer** - arjun.swagger-viewer
5. **SQL Tools** - mtxr.sqltools (for DB queries)
6. **Thunder Client** - rangav.vscode-thunder-client (API testing)

#### Settings (`.vscode/settings.json`)

Create this file in project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "eslint.validate": ["javascript", "javascriptreact"]
}
```

#### Launch Debug

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server.js",
      "runtimeArgs": ["--experimental-modules"],
      "console": "integratedTerminal"
    }
  ]
}
```

### WebStorm / IntelliJ IDEA

1. Open project folder
2. Mark `node_modules` as excluded
3. Configure Node interpreter: Settings → Languages & Frameworks → Node.js
4. Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint

---

## Troubleshooting

### Database Connection Error

```
Error: "Cannot connect to MSSQL server"
```

**Solution:**

1. Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in `.env`
2. Check if MSSQL is running: `docker ps` or Services panel
3. Test connection with SQL Server Management Studio

### Port Already in Use

```
Error: "EADDRINUSE: address already in use :::5000"
```

**Solution:**

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Module Not Found

```
Error: "Cannot find module 'express'"
```

**Solution:**

```powershell
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install

# Or clear npm cache
npm cache clean --force
npm install
```

### ESLint Errors on Commit

```
Error: "husky install failed"
```

**Solution:**

```powershell
# Reinstall husky
npm run prepare

# Add pre-commit hook manually
npx husky add .husky/pre-commit "npx lint-staged"
```

### Tests Failing

```
npm run test:coverage
```

**Common issues:**

1. Database not connected - start DB first
2. Environment not set - check `.env`
3. Stale test data - run `npm run db:reset`

---

## Development Workflow

### 1. Create Feature Branch

```powershell
git checkout -b feature/my-feature
```

### 2. Make Changes

```powershell
# Edit files
# Code follows ESLint rules
# Use Prettier for formatting
```

### 3. Test Changes

```powershell
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix if needed
npm run format        # Format code
npm test              # Run tests
npm run dev           # Manual testing
```

### 4. Commit Changes

```powershell
git add .
git commit -m "feat(auth): add login endpoint"

# Husky will automatically:
# - Run lint-staged
# - Format files
# - Run ESLint
```

### 5. Push & Create Pull Request

```powershell
git push origin feature/my-feature
# Then create PR on GitHub
```

### Commit Message Format

```
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (not functionality)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `chore` - Build, deps, tooling

**Examples:**

```
feat(auth): add two-factor authentication
fix(login): resolve JWT expiration issue
docs(readme): update installation instructions
test(user): add profile update tests
```

---

## Docker Development

### Using Docker Compose

```powershell
# Start all services (app + database)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild images
docker-compose up -d --build
```

### Build Custom Image

```powershell
# Build image
docker build -t ameyo-crm:dev -f Dockerfile .

# Run container
docker run -p 5000:5000 --env-file .env ameyo-crm:dev

# Enter container
docker exec -it <container-id> sh
```

---

## Useful Resources

### Technology Docs

- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com
- Sequelize: https://sequelize.org/docs
- MSSQL: https://learn.microsoft.com/en-us/sql

### Project Docs

- Tech Stack: `tech-stack/TECH_STACK.md`
- API Reference: `docs/api-reference/`
- Swagger Docs: http://localhost:5000/api-docs (when running)

### External Tools

- Postman: https://www.postman.com (API testing)
- SQL Server Management Studio: https://aka.ms/ssms
- DBeaver: https://dbeaver.io (Database client)

---

## Next Steps

1. ✅ Environment setup complete
2. 📚 Read `TECH_STACK.md` to understand tech stack
3. 📖 Explore `docs/swagger/endpoints/` for API documentation
4. 🔨 Start modifying code following commit conventions
5. 🧪 Write tests in `__tests__/` folder
6. 📝 Update docs as you add features

---

## Getting Help

- Check `CONTRIBUTING.md` for contribution guidelines
- Review `CODE_OF_CONDUCT.md` for community standards
- Open issues on GitHub
- Read inline code comments
- Check `.eslintrc.json` for code style rules

Happy coding! 🚀
