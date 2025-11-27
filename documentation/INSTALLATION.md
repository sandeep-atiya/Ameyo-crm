# Installation & Setup Guide

Complete step-by-step guide to install and run Ameyo CRM locally.

---

## ⚡ Quick Start (5 minutes)

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **Git** ([Download](https://git-scm.com))
- **MSSQL Server** 2019+ (local or Docker container)

### Steps

```bash
# 1. Clone repository
git clone https://github.com/sandeep-atiya/Ameyo-crm.git
cd Ameyo-crm

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your MSSQL credentials

# 4. Database setup
npm run db:migrate
npm run db:seed

# 5. Start server
npm run dev

# Server running at http://localhost:5000
# API Docs at http://localhost:5000/api-docs
```

---

## 🔧 Detailed Setup

### Step 1: Install Node.js

#### Windows

1. Download installer from [nodejs.org](https://nodejs.org)
2. Run the `.msi` installer
3. Accept license agreement
4. Choose installation directory
5. Select "Add to PATH" (important!)
6. Click Install
7. Verify installation:

```powershell
node --version
npm --version
```

#### macOS

Using Homebrew (recommended):

```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org)

Verify:

```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

#### Linux (Fedora/RHEL)

```bash
sudo dnf install nodejs npm

# Verify
node --version
npm --version
```

---

### Step 2: Install Git

#### Windows

Download from [git-scm.com](https://git-scm.com) and run installer

Configure:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### macOS

```bash
brew install git
```

Configure:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Linux

```bash
sudo apt install git    # Ubuntu/Debian
# or
sudo dnf install git    # Fedora/RHEL
```

Configure:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### Step 3: Setup MSSQL Server

#### Option A: Docker (Recommended for Development)

```bash
# Pull MSSQL Server image
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Run container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2022-latest

# Verify connection
# Test with your client
```

#### Option B: Local Installation

**Windows:**

- Download: [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2022)
- Run installer and follow prompts
- Note the Server Name and credentials

**macOS/Linux:**

- Use Docker (recommended)
- Or compile SQL Server tools

---

### Step 4: Clone Repository

```bash
# Clone the repository
git clone https://github.com/sandeep-atiya/Ameyo-crm.git

# Navigate to project
cd Ameyo-crm

# Verify directory
ls -la
# Should show: package.json, server.js, src/, etc.
```

---

### Step 5: Install Dependencies

```bash
# Install all npm dependencies
npm install

# This creates node_modules/ folder
# Wait for installation to complete (1-2 minutes)

# Verify installation
npm list
```

---

### Step 6: Setup Environment Variables

#### Create .env file

```bash
# Copy example file
cp .env.example .env
```

#### Edit .env file

Open `.env` in your editor and update:

```env
# Database Configuration
DB_HOST=localhost          # or your MSSQL server IP
DB_PORT=1433               # MSSQL default port
DB_USERNAME=sa             # MSSQL username
DB_PASSWORD=YourPassword   # Your MSSQL password
DB_NAME=AmeoyoCRM          # Database name (will be created)
DB_DIALECT=mssql           # Database type

# Server Configuration
PORT=5000                  # API port
NODE_ENV=development       # Environment: development/production/test

# JWT Configuration
JWT_SECRET=your_secret_key_here  # Use strong secret!
JWT_EXPIRY=7d                    # Token expiry time

# Optional: Error Tracking
# SENTRY_DSN=your_sentry_dsn

# Optional: Database Auto-Sync (development only!)
# DB_SYNC=false
```

**⚠️ Security Note:** Never commit `.env` file with real credentials!

---

### Step 7: Database Migrations

```bash
# Run pending migrations
npm run db:migrate

# Expected output:
# Running migrations...
# ✓ Migration completed successfully
```

**If migration fails:**

```bash
# Check database connectivity
npm run db:migrate -- --verbose

# Reset database (careful!)
npm run db:reset
```

---

### Step 8: Database Seeders (Optional)

```bash
# Populate database with sample data
npm run db:seed

# Specific seeder
npm run db:seed -- --seed NameOfSeeder
```

---

### Step 9: Start Development Server

```bash
# Start with auto-reload
npm run dev

# Expected output:
# Server started on http://localhost:5000
# Database: connected
```

---

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

### Docker Compose Files

- **docker-compose.yml** - Development setup
- **docker-compose.prod.yml** - Production setup
- **docker/Dockerfile.dev** - Development image
- **docker/Dockerfile.prod** - Production image

---

## 🧪 Verify Installation

### Check Server Status

```bash
# Should return 200 OK
curl http://localhost:5000/health

# Response:
# {"success":true,"message":"Server is healthy"}
```

### Check API Documentation

```bash
# Open in browser
http://localhost:5000/api-docs

# Should show Swagger UI with all endpoints
```

### Test Authentication

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"uname":"testuser","password":"Test123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"uname":"testuser","password":"Test123!"}'

# Should return JWT token
```

---

## 🚨 Troubleshooting

### Node/npm Not Found

```powershell
# Verify PATH includes Node.js
$env:PATH -split ';' | Select-String node

# Reinstall Node.js and select "Add to PATH"
# Restart terminal after installation
```

### MSSQL Connection Failed

```bash
# Test connection with sqlcmd
sqlcmd -S localhost -U sa -P password

# Check firewall
# Enable port 1433 if using Windows Firewall

# Verify MSSQL service is running
# Docker: docker ps (check status)
# Windows: Services > SQL Server (MSSQLSERVER)
```

### Port 5000 Already in Use

```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 5000 | Select OwningProcess

# Kill process (replace PID)
Get-Process -Id PID | Stop-Process -Force

# Or use different port
$env:PORT=5001; npm run dev
```

### Dependencies Installation Failed

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -r node_modules

# Reinstall
npm install

# If still failing, try npm audit
npm audit fix
```

### Database Migration Errors

```bash
# Check migration status
npm run db:migrate -- --status

# Manually undo migrations
npm run db:migrate:undo:all

# Retry
npm run db:migrate
npm run db:seed
```

### Cannot Find Module

```bash
# Verify all dependencies installed
npm install

# Check for missing packages
npm list

# Fix vulnerabilities
npm audit fix
```

---

## 🔄 Common Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm run dev:debug      # Start with debugging enabled

# Production
npm start               # Start production server

# Database
npm run db:migrate     # Run migrations
npm run db:seed        # Run seeders
npm run db:reset       # Reset database

# Code Quality
npm run lint           # Check code style
npm run lint:fix       # Auto-fix style issues
npm run format         # Format code
npm test              # Run tests

# Maintenance
npm update            # Update dependencies
npm audit             # Check vulnerabilities
npm audit fix         # Fix vulnerabilities
```

---

## ✅ Next Steps

After successful installation:

1. **Explore API** - Visit http://localhost:5000/api-docs
2. **Read Documentation** - Check `documentation/` folder
3. **Run Tests** - Execute `npm test`
4. **Try Examples** - Use curl or Postman to test endpoints
5. **Start Development** - Create a feature branch

---

## 📞 Need Help?

- **Issues:** [GitHub Issues](https://github.com/sandeep-atiya/Ameyo-crm/issues)
- **Discussions:** [GitHub Discussions](https://github.com/sandeep-atiya/Ameyo-crm/discussions)
- **Email:** Contact maintainers

---

**Happy Coding! 🚀**
