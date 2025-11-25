# Quick Start Guide

## ⚡ Get Running in 2 Minutes

### 1. Start Development Server
```bash
npm run dev
```

**Output should show:**
```
✅ Database connected successfully
✅ Database models synced
✅ Server started on port 5000 [development]
```

### 2. Test Register Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123@Pass",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-xxx",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### 3. Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123@Pass"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid-xxx",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  }
```

### 4. Test Protected Route (Profile)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer {token_from_login}"
```

### 5. Run Tests
```bash
npm test
```

## 🔑 Key Points

| Item | Value |
|------|-------|
| **Database** | MSSQL (192.168.10.76:1433) |
| **Database Name** | DristhiSoftTechDBOld |
| **Dev Port** | 5000 |
| **Test Port** | 5001 |
| **JWT Expiry** | 7 days |
| **Password Min Length** | 8 characters |
| **Password Requirements** | Uppercase + Lowercase + Number + Special Char |

## 📁 Important Files

```
server.js                 → Main application
config/db.js             → Database configuration
routes/auth.js           → API endpoints
services/authService.js  → Business logic
models/User.js           → Database schema
middleware/              → Auth & validation
```

## 🚨 Troubleshooting

**Port 5000 already in use?**
```bash
# Change PORT in .env to 5001 or different number
```

**Database connection error?**
```bash
# Check .env has correct credentials:
# DB_HOST=192.168.10.76
# DB_PORT=1433
# DB_USER=sa
# DB_PASSWORD=atiya@999
```

**Password validation fails?**
```bash
# Use format: Password123@
# Must have: UPPERCASE + lowercase + number + special char (@$!%*?&)
```

## 📚 Documentation

- **README.md** - Complete API documentation
- **SETUP_COMPLETE.md** - Detailed setup guide
- **CONFIG_SUMMARY.md** - Configuration reference
- **PROJECT_STRUCTURE.md** - File organization

## ✅ What's Working

✓ User Registration with validation
✓ User Login with JWT token
✓ Profile retrieval
✓ Profile updates
✓ Password hashing
✓ Role-based access
✓ Database logging
✓ Error handling

## 🎯 Next: Add More Endpoints

1. Create new route file in `/routes/`
2. Create service file in `/services/`
3. Add model in `/models/` if needed
4. Import in `server.js`
5. Use auth middleware for protection

---

**Everything is ready to use!** Start with `npm run dev`
