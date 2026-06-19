import Joi from 'joi'

export const schemas = {
  register: Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must not exceed 50 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match'
    }),
    role: Joi.string().valid('patient').default('patient').messages({
      'any.only': 'Only patient self-registration is allowed'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().messages({
      'string.pattern.base': 'Phone number must be 10-15 digits'
    }),
    avatar: Joi.string().uri().optional()
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  })
}

export const validate = (schema, obj) => {
  const { error, value } = schema.validate(obj, { abortEarly: false })
  if (error) {
    const messages = error.details.map(detail => detail.message)
    return { valid: false, messages }
  }
  return { valid: true, value }
}
