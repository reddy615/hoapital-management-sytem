import { config } from '../config/env.js'
import { errorStatusCodes, errorMessages } from '../utils/errors.js'
import { verifyToken } from '../utils/tokenUtils.js'
import { User } from '../models/User.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')
    
    if (scheme !== 'Bearer' || !token) {
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: errorMessages.TOKEN_REQUIRED
      })
    }

    try {
      const decoded = verifyToken(token)

      if (decoded.tokenType !== 'access') {
        return res.status(errorStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: errorMessages.TOKEN_INVALID
        })
      }

      const user = await User.findById(decoded.userId).select('role isActive lastPasswordChange')
      if (!user || !user.isActive) {
        return res.status(errorStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: errorMessages.TOKEN_INVALID
        })
      }

      const passwordChangedAt = user.lastPasswordChange
        ? Math.floor(user.lastPasswordChange.getTime() / 1000)
        : 0
      if (!decoded.iat || passwordChangedAt > decoded.iat) {
        return res.status(errorStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: errorMessages.TOKEN_INVALID
        })
      }

      req.user = {
        userId: user._id.toString(),
        role: user.role
      }
      next()
    } catch (error) {
      if (error.message === 'Token expired') {
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
  // Log error for debugging (exclude in production logs)
  if (config.NODE_ENV === 'development') {
    console.error(err)
  }

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
