import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { errorStatusCodes, errorMessages } from '../utils/errors.js'

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: errorMessages.TOKEN_REQUIRED
      })
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(errorStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Token expired'
        })
      }
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: errorMessages.TOKEN_INVALID
      })
    }
  } catch (error) {
    res.status(errorStatusCodes.UNAUTHORIZED).json({
      success: false,
      message: errorMessages.TOKEN_INVALID
    })
  }
}

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: errorMessages.TOKEN_REQUIRED
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(errorStatusCodes.FORBIDDEN).json({
        success: false,
        message: errorMessages.UNAUTHORIZED
      })
    }

    next()
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err.name === 'ValidationError') {
    return res.status(errorStatusCodes.BAD_REQUEST).json({
      success: false,
      message: errorMessages.VALIDATION_ERROR,
      errors: Object.values(err.errors).map(e => e.message)
    })
  }

  if (err.name === 'CastError') {
    return res.status(errorStatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format'
    })
  }

  if (err.code === 11000) {
    return res.status(errorStatusCodes.CONFLICT).json({
      success: false,
      message: `${Object.keys(err.keyValue)[0]} already exists`
    })
  }

  res.status(err.statusCode || errorStatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || errorMessages.INTERNAL_SERVER_ERROR,
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const notFound = (req, res) => {
  res.status(errorStatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Route not found'
  })
}
