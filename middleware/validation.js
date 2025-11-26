import Joi from 'joi';

// Generic Joi middleware to validate request bodies.
export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  req.body = value;
  return next();
};

// Password pattern: at least one lowercase, uppercase, number, and special char
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

export const registerSchema = Joi.object({
  uname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({ 'string.empty': 'Username is required' }),
  password: Joi.string()
    .min(8)
    .pattern(passwordPattern)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
    }),
  ProPicture: Joi.string().uri().optional(),
  TeamLeader: Joi.number().integer().optional(),
  // allow additional optional fields present in your tblUser table
}).unknown(false);

export const loginSchema = Joi.object({
  uname: Joi.string().required(),
  password: Joi.string().required(),
}).unknown(false);

export const updateProfileSchema = Joi.object({
  uname: Joi.string().min(3).max(50).optional(),
  ProPicture: Joi.string().uri().optional(),
}).unknown(false);
