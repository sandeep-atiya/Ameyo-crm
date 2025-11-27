/**
 * Authentication Validation Schemas
 * Using Joi for request body validation
 */

import Joi from 'joi';
import { PASSWORD_CONFIG, USER_FIELD_LENGTHS } from '../constants/index.js';

/**
 * User registration validation schema
 */
export const registerSchema = Joi.object({
  uname: Joi.string()
    .min(USER_FIELD_LENGTHS.USERNAME_MIN)
    .max(USER_FIELD_LENGTHS.USERNAME_MAX)
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': `Username must be at least ${USER_FIELD_LENGTHS.USERNAME_MIN} characters`,
      'string.max': `Username must not exceed ${USER_FIELD_LENGTHS.USERNAME_MAX} characters`,
    }),

  password: Joi.string()
    .min(PASSWORD_CONFIG.MIN_LENGTH)
    .pattern(PASSWORD_CONFIG.PATTERN)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`,
      'string.pattern.base': PASSWORD_CONFIG.PATTERN_DESCRIPTION,
    }),

  ProPicture: Joi.string()
    .uri()
    .optional()
    .messages({ 'string.uri': 'ProPicture must be a valid URI' }),

  UserTypeID: Joi.number()
    .integer()
    .optional()
    .messages({ 'number.base': 'UserTypeID must be a number' }),

  TeamLeader: Joi.number()
    .integer()
    .optional()
    .messages({ 'number.base': 'TeamLeader must be a number' }),
}).unknown(false);

/**
 * User login validation schema
 */
export const loginSchema = Joi.object({
  uname: Joi.string().required().messages({ 'string.empty': 'Username is required' }),

  password: Joi.string().required().messages({ 'string.empty': 'Password is required' }),
}).unknown(false);

/**
 * Profile update validation schema
 */
export const updateProfileSchema = Joi.object({
  uname: Joi.string()
    .min(USER_FIELD_LENGTHS.USERNAME_MIN)
    .max(USER_FIELD_LENGTHS.USERNAME_MAX)
    .optional(),

  ProPicture: Joi.string()
    .uri()
    .optional()
    .messages({ 'string.uri': 'ProPicture must be a valid URI' }),
}).unknown(false);
