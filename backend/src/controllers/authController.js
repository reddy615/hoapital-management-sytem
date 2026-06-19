import { User } from '../models/User.js'
import { generateToken, generateRefreshToken, generatePasswordResetToken, verifyRefreshToken } from '../utils/tokenUtils.js'
import { validate, schemas } from '../utils/validation.js'
import { errorMessages, errorStatusCodes } from '../utils/errors.js'
import { sendEmail } from '../services/emailService.js'
import { config } from '../config/env.js'
import crypto from 'crypto'

const PASSWORD_RESET_RESPONSE = 'If an active account exists for this email, a password reset link has been sent'

// Register Controller
export const register = async (req, res, next) => {
  try {
    // Validate input
    const validation = validate(schemas.register, req.body)
    if (!validation.valid) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: errorMessages.VALIDATION_ERROR,
        errors: validation.messages
      })
    }

    const { name, email, password, role } = validation.value

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(errorStatusCodes.CONFLICT).json({
        success: false,
        message: errorMessages.EMAIL_EXISTS
      })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient'
    })

    // Generate tokens
    const accessToken = generateToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    // Send verification email
    await sendEmail(
      email,
      'Welcome to Hospital Management System',
      `<h2>Welcome ${name}!</h2><p>Your account has been created successfully.</p>`
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    next(error)
  }
}

// Login Controller
export const login = async (req, res, next) => {
  try {
    // Validate input
    const validation = validate(schemas.login, req.body)
    if (!validation.valid) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: errorMessages.VALIDATION_ERROR,
        errors: validation.messages
      })
    }

    const { email, password } = validation.value

    // Find user and select password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: errorMessages.INVALID_CREDENTIALS
      })
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Your account is temporarily locked. Please try again later.'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Your account has been deactivated'
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      await user.incLoginAttempts()
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: errorMessages.INVALID_CREDENTIALS
      })
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts()

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const accessToken = generateToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    next(error)
  }
}

// Get Profile Controller
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(errorStatusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.USER_NOT_FOUND
      })
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    })
  } catch (error) {
    next(error)
  }
}

// Update Profile Controller
export const updateProfile = async (req, res, next) => {
  try {
    // Validate input
    const validation = validate(schemas.updateProfile, req.body)
    if (!validation.valid) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: errorMessages.VALIDATION_ERROR,
        errors: validation.messages
      })
    }

    const { name, phone, avatar } = validation.value
    const updateData = {}

    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (avatar) updateData.avatar = avatar

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(errorStatusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.USER_NOT_FOUND
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    })
  } catch (error) {
    next(error)
  }
}

// Change Password Controller
export const changePassword = async (req, res, next) => {
  try {
    // Validate input
    const validation = validate(schemas.changePassword, req.body)
    if (!validation.valid) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: errorMessages.VALIDATION_ERROR,
        errors: validation.messages
      })
    }

    const { oldPassword, newPassword } = validation.value
    const user = await User.findById(req.user.userId).select('+password')

    if (!user) {
      return res.status(errorStatusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.USER_NOT_FOUND
      })
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword)
    if (!isPasswordValid) {
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    next(error)
  }
}

// Forgot Password Controller
export const forgotPassword = async (req, res, next) => {
  try {
    // Validate input
    const validation = validate(schemas.forgotPassword, req.body)
    if (!validation.valid) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: errorMessages.VALIDATION_ERROR,
        errors: validation.messages
      })
    }

    const { email } = validation.value
    const user = await User.findOne({ email })

    if (!user || !user.isActive) {
      return res.json({
        success: true,
        message: PASSWORD_RESET_RESPONSE
      })
    }

    // Generate reset token
    const { token, hashedToken, expiresAt } = generatePasswordResetToken()

    user.passwordResetToken = hashedToken
    user.passwordResetTokenExpires = expiresAt
    await user.save()

    // Send reset email
    const resetUrl = `${config.FRONTEND_URL}/reset-password/${token}`
    
    await sendEmail(
      email,
      'Password Reset Request',
      `<h2>Password Reset</h2>
       <p>You requested a password reset. Click the link below to reset your password:</p>
       <a href="${resetUrl}">Reset Password</a>
       <p>This link will expire in 30 minutes.</p>
       <p>If you didn't request this, please ignore this email.</p>`
    )

    res.json({
      success: true,
      message: PASSWORD_RESET_RESPONSE
    })
  } catch (error) {
    next(error)
  }
}

// Reset Password Controller
export const resetPassword = async (req, res, next) => {
  try {
    // Validate input
    const validation = validate(schemas.resetPassword, req.body)
    if (!validation.valid) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: errorMessages.VALIDATION_ERROR,
        errors: validation.messages
      })
    }

    const { token, newPassword } = validation.value

    // Hash token to match stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find user by token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Update password
    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    next(error)
  }
}

// Logout Controller
export const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    next(error)
  }
}

// Refresh Token Controller
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body

    if (!token) {
      return res.status(errorStatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Refresh token required'
      })
    }

    let decoded
    try {
      decoded = verifyRefreshToken(token)
    } catch (error) {
      if (error.message === 'Refresh token expired') {
        return res.status(errorStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Refresh token expired'
        })
      }
      return res.status(errorStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: errorMessages.TOKEN_INVALID
      })
    }

    const user = await User.findById(decoded.userId)

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

    const accessToken = generateToken(user._id, user.role)
    const newRefreshToken = generateRefreshToken(user._id)

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    })
  } catch (error) {
    next(error)
  }
}

// Get All Users (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    let page = Number.parseInt(req.query.page, 10) || 1
    let limit = Number.parseInt(req.query.limit, 10) || 10

    // Validate pagination parameters
    if (page < 1) page = 1
    if (limit < 1 || limit > 100) limit = 10

    const skip = (page - 1) * limit

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments()

    res.json({
      success: true,
      data: {
        users: users.map(user => user.toJSON()),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// Delete User (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(errorStatusCodes.NOT_FOUND).json({
        success: false,
        message: errorMessages.USER_NOT_FOUND
      })
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
