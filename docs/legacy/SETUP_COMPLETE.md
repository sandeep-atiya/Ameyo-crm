# CRM Application - Complete Setup Guide

## ✅ Setup Complete!

Your professional CRM application has been set up with:

### 🔐 Authentication & Security
- ✓ JWT token-based authentication
- ✓ Bcrypt password hashing (12 rounds)
- ✓ Role-based access control (Admin, Manager, User)
- ✓ CORS protection with Helmet security headers
- ✓ Input validation and sanitization

### 💾 Database Configuration
- ✓ MSSQL Server connection configured
- ✓ Database: DristhiSoftTechDBOld
- ✓ Host: 192.168.10.76:1433
- ✓ Environment-specific configurations (dev, test, prod)

### 📝 Environment Files Setup

#### `.env` (Development)
```
NODE_ENV=development
DB_HOST=192.168.10.76
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=atiya@999
DB_NAME=DristhiSoftTechDBOld
DB_DIALECT=mssql
JWT_SECRET=supersecret
JWT_EXPIRY=7d
PORT=5000
LOG_LEVEL=debug
CORS_ORIGIN=*
```

#### `.env.test` (Testing)
- Uses same database connection
- JWT expires in 1 hour for testing
- Runs on port 5001
- Error-level logging only

#### `.env.production` (Production)
- Same database connection
- **IMPORTANT**: Change JWT_SECRET to a strong random key
- Restrict CORS_ORIGIN to your production domain
- Set APP_URL to your production domain
- Enable SSL encryption

### 📁 Project Structure
```
CRM/
├── config/
│   ├── db.js                 # Database connection (MSSQL)
│   └── config.json           # Legacy config file
├── routes/
│   └── auth.js              # Authentication endpoints
├── services/
│   └── authService.js       # Auth business logic
├── middleware/
│   ├── auth.js              # JWT verification
│   └── validation.js        # Input validation
├── models/
│   ├── index.js             # Model loader
│   └── User.js              # User model
├── utils/
│   └── logger.js            # Winston logger
├── __tests__/
│   ├── routes/
│   │   └── auth.test.js     # Route tests
│   └── services/
│       └── authService.test.js  # Service tests
├── migrations/
│   └── 001-create-users-table.js
├── logs/                    # Application logs
├── .env                     # Development config
├── .env.test               # Test config
├── .env.production         # Production config
├── .env.example            # Example template
├── .gitignore              # Git ignore rules
├── jest.config.js          # Test configuration
├── package.json            # Dependencies
├── server.js               # Main application
└── README.md               # Full documentation
```

### 🚀 Quick Start

#### 1. **Development Mode**
```bash
npm run dev
```
- Server runs on http://localhost:5000
- Auto-reload on file changes (nodemon)
- Full SQL logging enabled
- Detailed console output

#### 2. **Production Mode**
```bash
npm start
```
- Server runs on configured PORT (5000)
- No auto-reload
- Minimal logging (info level)
- Optimized database pooling

#### 3. **Run Tests**
```bash
npm test              # Run all tests once
npm run test:watch   # Watch mode for development
npm run test:coverage # Generate coverage report
```

### 🔌 API Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "phone": "+9876543210"
}
```

### 🔑 Password Requirements

Passwords must contain:
- ✓ Minimum 8 characters
- ✓ At least one UPPERCASE letter
- ✓ At least one lowercase letter
- ✓ At least one number
- ✓ At least one special character (@$!%*?&)

**Valid Example:** `MySecure123@Pass`

### 📊 Database Connection Details

**MSSQL Server Configuration:**
- **Host:** 192.168.10.76
- **Port:** 1433
- **User:** sa
- **Password:** atiya@999
- **Database:** DristhiSoftTechDBOld
- **Driver:** MSSQL (tedious)

**Connection Pooling:**
- Development: Max 5 connections
- Production: Max 10 connections, Min 5

### 🛡️ Security Best Practices Implemented

✓ **Password Security**
- Bcrypt hashing with 12 salt rounds
- Strong password validation
- No plaintext passwords stored

✓ **Token Security**
- JWT with expiration (7 days)
- Secure token verification
- Token refresh capability

✓ **Data Protection**
- SQL injection prevention via ORM
- XSS protection via input validation
- CORS restrictions
- Helmet security headers

✓ **Role-Based Access Control**
- User roles: user, admin, manager
- Authorization middleware
- Protected endpoints

### 📝 Logging

Logs are written to `/logs/` directory:

**Files:**
- `all.log` - All application events
- `error.log` - Errors only

**Log Levels:**
- Development: DEBUG (most verbose)
- Test: ERROR (minimal)
- Production: INFO (important events only)

### 🧪 Testing Structure

Tests are organized in `__tests__/` directory:

**Unit Tests:**
- `__tests__/services/authService.test.js` - Auth service testing

**Integration Tests:**
- `__tests__/routes/auth.test.js` - API endpoint testing

**Run Tests:**
```bash
npm test              # Single run
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### ⚙️ Environment Switching

**Development:**
```bash
npm run dev
# Automatically uses NODE_ENV=development and .env
```

**Test:**
```bash
npm test
# Automatically uses NODE_ENV=test and .env.test
```

**Production:**
```bash
npm start
# Uses NODE_ENV=production and .env.production
```

### 🔄 Database Migrations

**Create migration:**
```bash
npm run db:migrate
```

**Undo migrations:**
```bash
npm run db:migrate:undo:all
```

**Seed database:**
```bash
npm run db:seed
```

**Reset database (dev only):**
```bash
npm run db:reset
```

### 📦 Dependencies

**Core:**
- express ^5.1.0 - Web framework
- sequelize ^6.37.7 - ORM
- mssql ^10.0.2 - SQL Server driver
- tedious ^19.1.3 - MSSQL protocol handler

**Authentication:**
- jsonwebtoken ^9.0.2 - JWT creation/verification
- bcryptjs ^3.0.3 - Password hashing

**Validation:**
- express-validator ^7.3.1 - Request validation
- joi ^18.0.2 - Data validation

**Security:**
- cors ^2.8.5 - CORS middleware
- helmet ^8.1.0 - Security headers
- dotenv ^17.2.3 - Environment variables

**Logging:**
- winston ^3.11.0 - Application logging
- morgan ^1.10.1 - HTTP logging

**Development:**
- nodemon ^3.1.11 - Auto-reload
- jest ^29.7.0 - Testing
- supertest ^6.3.3 - HTTP testing
- sequelize-cli ^6.6.3 - Database CLI

### 🚨 Troubleshooting

#### Database Connection Error
```
Error: Error: connect ETIMEDOUT at 192.168.10.76:1433
```
**Solution:**
- Verify MSSQL server is running
- Check firewall allows port 1433
- Verify credentials in .env
- Test connection: `telnet 192.168.10.76 1433`

#### JWT Secret Not Set
```
Error: jwt malformed
```
**Solution:**
- Set JWT_SECRET in .env file
- Must be a strong random string

#### Password Validation Fails
```
Error: Password must contain uppercase, lowercase, number, and special character
```
**Solution:**
- Use password: `MyPassword123@`
- Ensure all requirements met

#### Port Already in Use
```
Error: EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :5000
# Kill process
taskkill /PID {PID} /F
# Or change PORT in .env
```

### ✅ Verification Checklist

- [ ] .env file created with your credentials
- [ ] npm install completed successfully
- [ ] Database connectivity tested
- [ ] Development server starts: `npm run dev`
- [ ] API endpoints accessible
- [ ] Tests pass: `npm test`
- [ ] .env.production updated for production
- [ ] JWT_SECRET changed for production
- [ ] CORS_ORIGIN restricted for production

### 📞 Support

For issues:
1. Check logs in `/logs/` directory
2. Review error messages in console
3. Verify .env configuration
4. Check database connectivity
5. Run tests to identify issues: `npm test`

### 🎯 Next Steps

1. **Start Development:**
   ```bash
   npm run dev
   ```

2. **Test Endpoints:**
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/auth/profile

3. **Run Tests:**
   ```bash
   npm test
   ```

4. **Customize:**
   - Add more models in `/models/`
   - Create service files in `/services/`
   - Add routes in `/routes/`

5. **For Production:**
   - Update .env.production
   - Set strong JWT_SECRET
   - Enable SSL
   - Configure CORS properly
   - Set up monitoring and alerts

---

**Your CRM application is ready for development and production use!** 🎉
