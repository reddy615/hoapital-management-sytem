import axios from 'axios'
import { useAuthStore } from '../context/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh-token'
]

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshRequest = null

const clearAuthAndRedirect = () => {
  useAuthStore.getState().logout()
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

const refreshTokens = async () => {
  const storedRefreshToken = localStorage.getItem('refreshToken')

  if (!storedRefreshToken) {
    throw new Error('Refresh token missing')
  }

  const response = await axios.post(`${API_URL}/auth/refresh-token`, {
    refreshToken: storedRefreshToken
  })
  const { accessToken, refreshToken } = response.data.data

  useAuthStore.getState().setTokens(accessToken, refreshToken)

  return accessToken
}

// Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => originalRequest?.url?.includes(endpoint))

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      try {
        refreshRequest = refreshRequest || refreshTokens()
        const accessToken = await refreshRequest
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        clearAuthAndRedirect()
        return Promise.reject(refreshError)
      } finally {
        refreshRequest = null
      }
    }

    if (error.response?.status === 401 && !isAuthEndpoint) {
      clearAuthAndRedirect()
    }

    return Promise.reject(error)
  }
)

export default api
