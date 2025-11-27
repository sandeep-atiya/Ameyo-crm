/**
 * User Validation Schemas
 * Using Joi for request body validation
 */

import Joi from 'joi';
import { USER_FIELD_LENGTHS } from '../constants/index.js';

/**
 * User creation validation schema
 */
export const createUserSchema = Joi.object({
  uname: Joi.string()
    .min(USER_FIELD_LENGTHS.USERNAME_MIN)
    .max(USER_FIELD_LENGTHS.USERNAME_MAX)
    .required(),

  ProPicture: Joi.string().uri().optional(),

  UserTypeID: Joi.number().integer().optional(),
}).unknown(false);

/**
 * User update validation schema
 */
export const updateUserSchema = Joi.object({
  uname: Joi.string()
    .min(USER_FIELD_LENGTHS.USERNAME_MIN)
    .max(USER_FIELD_LENGTHS.USERNAME_MAX)
    .optional(),

  ProPicture: Joi.string().uri().optional(),

  UserTypeID: Joi.number().integer().optional(),
}).unknown(false);
