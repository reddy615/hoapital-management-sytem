export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorMessages = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  TOKEN_INVALID: 'Invalid or expired token',
  TOKEN_REQUIRED: 'Authentication token required',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation failed',
  INVALID_EMAIL: 'Please provide a valid email',
  WEAK_PASSWORD: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  
  // Server errors
  DATABASE_ERROR: 'Database operation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error'
}

export const errorStatusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}
