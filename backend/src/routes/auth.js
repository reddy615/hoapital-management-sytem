import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  getAllUsers,
  deleteUser
} from '../controllers/authController.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/refresh-token', refreshToken)

// Protected routes
router.post('/logout', authenticate, logout)
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)
router.put('/change-password', authenticate, changePassword)

// Admin routes
router.get('/users', authenticate, authorize('admin'), getAllUsers)
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser)

export default router
