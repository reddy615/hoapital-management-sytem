import { useState, useCallback, useEffect } from 'react'
import { authService } from '../services'
import { toast } from 'react-toastify'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authService.login({ email, password })
      
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      
      setUser(data.user)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    }
  }, [])

  const register = useCallback(async (formData) => {
    try {
      const { data } = await authService.register(formData)
      
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      
      setUser(data.user)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }, [])

  const updateProfile = useCallback(async (profileData) => {
    try {
      const { data } = await authService.updateProfile(profileData)
      
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      
      toast.success('Profile updated successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return false
    }
  }, [])

  const changePassword = useCallback(async (passwordData) => {
    try {
      await authService.changePassword(passwordData)
      toast.success('Password changed successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Change password failed'
      toast.error(message)
      return false
    }
  }, [])

  const forgotPassword = useCallback(async (email) => {
    try {
      await authService.forgotPassword({ email })
      toast.success('Password reset link sent to your email')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link'
      toast.error(message)
      return false
    }
  }, [])

  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      await authService.resetPassword({ token, newPassword, confirmPassword: newPassword })
      toast.success('Password reset successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed'
      toast.error(message)
      return false
    }
  }, [])

  const refreshAuthToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return false

      const { data } = await authService.refreshToken({ refreshToken })
      localStorage.setItem('token', data.accessToken)
      
      return true
    } catch (error) {
      logout()
      return false
    }
  }, [logout])

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshAuthToken
  }
}
