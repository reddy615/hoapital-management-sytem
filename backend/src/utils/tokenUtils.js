import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import crypto from 'crypto'

export const generateToken = (userId, role, expiresIn = config.JWT_EXPIRE) => {
  return jwt.sign(
    { userId, role },
    config.JWT_SECRET,
    { expiresIn }
  )
}

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    config.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    }
    throw error
  }
}

export const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  
  return {
    token,
    hashedToken,
    expiresAt
  }
}

export const verifyPasswordResetToken = (hashedToken) => {
  return new Date() < new Date(hashedToken.expiresAt)
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex')
}
