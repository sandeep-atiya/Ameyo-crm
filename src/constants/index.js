/**
 * Application Constants
 * Centralized place for all constant values used throughout the application
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  USERNAME_EXISTS: 'Username already exists',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  USER_REQUIRED: 'Username and password are required',
  INVALID_TOKEN: 'Invalid or expired token',
  SERVER_ERROR: 'Something went wrong',
};

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  PROFILE_FETCHED: 'Profile retrieved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'supersecret',
  EXPIRY: process.env.JWT_EXPIRY || '7d',
};

export const DB_CONFIG = {
  DIALECT: 'mssql',
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT || '1433'),
  USERNAME: process.env.DB_USERNAME || 'sa',
  PASSWORD: process.env.DB_PASSWORD || '',
  DATABASE: process.env.DB_NAME || 'crm_db',
};

export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
  PATTERN_DESCRIPTION: 'Password must contain uppercase, lowercase, number, and special character',
};

export const USER_FIELD_LENGTHS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  PICTURE_URL_MAX: 200,
};

export const RATE_LIMIT_CONFIG = {
  DEV: {
    REGISTER_AUTH: { windowMs: 15 * 60 * 1000, max: 30 },
    LOGIN: { windowMs: 15 * 60 * 1000, max: 30 },
  },
  PROD: {
    REGISTER_AUTH: { windowMs: 15 * 60 * 1000, max: 5 },
    LOGIN: { windowMs: 15 * 60 * 1000, max: 5 },
  },
};
