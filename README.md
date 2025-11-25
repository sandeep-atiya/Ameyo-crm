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
│   └── User.js            # User model
├── routes/
│   └── auth.js            # Authentication routes
├── services/
│   └── authService.js     # Authentication business logic
├── utils/
│   └── logger.js          # Winston logger setup
├── __tests__/             # Test files
├── logs/                  # Application logs
├── .env                   # Environment variables
├── .env.example           # Example env file
├── jest.config.js         # Jest configuration
├── package.json           # Dependencies
└── server.js              # Main application file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Setup Steps

1. **Clone/Extract project**
```bash
cd CRM
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_change_this
```

4. **Create databases**
```bash
mysql -u root -p
CREATE DATABASE crm_development;
CREATE DATABASE crm_test;
CREATE DATABASE crm_production;
```

5. **Run migrations** (if using sequelize-cli)
```bash
npm run db:migrate
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Server runs at `http://localhost:5000` with nodemon auto-reload.

### Production Mode
```bash
npm start
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## API Endpoints

### Authentication

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
    "id": "uuid-123",
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
      "id": "uuid-123",
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

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Email
- Valid email format (RFC 5322)

### Phone
- Optional, digits and common separators (+, -, spaces, parentheses)

### Names
- Minimum 2 characters

## Environment Configuration

### Development
- Full SQL logging enabled
- Hot reload with nodemon
- Relaxed CORS settings

### Test
- In-memory or test database
- Minimal logging
- Test runner configuration

### Production
- No SQL logging
- Connection pooling optimized
- Strict CORS settings
- Error monitoring

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin', 'manager') DEFAULT 'user',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security Best Practices Implemented

✅ Password hashing with bcrypt (12 salt rounds)
✅ JWT token expiration (7 days default)
✅ CORS restriction to specific origins
✅ Helmet for security headers
✅ Input validation and sanitization
✅ SQL injection prevention via Sequelize ORM
✅ Role-based access control
✅ Environment variable protection

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Logging

Logs are stored in `/logs/` directory:
- `all.log` - All application logs
- `error.log` - Error logs only
- Console output in development mode

## Dependencies

### Production
- **express** - Web framework
- **sequelize** - ORM for database
- **mysql2** - MySQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **helmet** - Security headers
- **morgan** - HTTP logging
- **winston** - Application logging

### Development
- **nodemon** - Auto-reload on file changes
- **jest** - Testing framework
- **supertest** - HTTP testing
- **sequelize-cli** - Database CLI tools

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env`
- Ensure databases exist

### Password Validation Error
- Password must meet all requirements
- Check `.env` JWT_SECRET is set

### Authentication Failed
- Ensure Authorization header is present
- Format: `Authorization: Bearer {token}`
- Check token hasn't expired

## Contributing

1. Create feature branch
2. Make changes with tests
3. Submit pull request

## License

ISC

## Support

For issues or questions, please check the logs in `/logs/` directory for detailed error information.
