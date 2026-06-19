import apiClient from './api'

export const authService = {
  register: async (data) => {
    return apiClient.post('/auth/register', data)
  },

  login: async (data) => {
    return apiClient.post('/auth/login', data)
  },

  logout: async () => {
    return apiClient.post('/auth/logout')
  },

  getProfile: async () => {
    return apiClient.get('/auth/profile')
  },

  updateProfile: async (data) => {
    return apiClient.put('/auth/profile', data)
  },

  changePassword: async (data) => {
    return apiClient.put('/auth/change-password', data)
  },

  forgotPassword: async (data) => {
    return apiClient.post('/auth/forgot-password', data)
  },

  resetPassword: async (data) => {
    return apiClient.post('/auth/reset-password', data)
  },

  refreshToken: async (data) => {
    return apiClient.post('/auth/refresh-token', data)
  },

  getAllUsers: async (params) => {
    return apiClient.get('/auth/users', { params })
  },

  deleteUser: async (userId) => {
    return apiClient.delete(`/auth/users/${userId}`)
  }
}
