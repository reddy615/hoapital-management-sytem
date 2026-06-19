import { useCallback } from 'react'
import { authService } from '../services'
import { useAuthStore } from '../context/authStore'
import { toast } from 'react-toastify'

export const useAuth = () => {
  const {
    user,
    token,
    refreshToken,
    isAuthenticated,
    loading,
    login: setAuth,
    logout: clearAuth,
    setTokens,
    setUser
  } = useAuthStore()

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login({ email, password })
      const { user, accessToken, refreshToken } = response.data.data
      
      setAuth(user, accessToken, refreshToken)
      
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    }
  }, [setAuth])

  const register = useCallback(async (formData) => {
    try {
      const response = await authService.register(formData)
      const { user, accessToken, refreshToken } = response.data.data
      
      setAuth(user, accessToken, refreshToken)
      
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    }
  }, [setUser])

  const logout = useCallback(() => {
    clearAuth()
    toast.success('Logged out successfully')
  }, [clearAuth])

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData)
      const { user } = response.data.data
      
      setUser(user)
      
      toast.success('Profile updated successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return false
    }
  }, [setAuth])

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
      if (!refreshToken) return false

      const response = await authService.refreshToken({ refreshToken })
      const { accessToken, refreshToken: newRefreshToken } = response.data.data

      setTokens(accessToken, newRefreshToken)
      
      return true
    } catch (error) {
      logout()
      return false
    }
  }, [logout, refreshToken, setTokens])

  return {
    user,
    token,
    refreshToken,
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
