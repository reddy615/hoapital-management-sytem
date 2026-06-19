import { create } from 'zustand'

const getStorage = () => (typeof window !== 'undefined' ? window.localStorage : null)

const readStoredUser = () => {
  const storage = getStorage()
  const storedUser = storage?.getItem('user')

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch (error) {
    storage?.removeItem('user')
    storage?.removeItem('token')
    storage?.removeItem('refreshToken')
    return null
  }
}

const storedUser = readStoredUser()
const storedToken = getStorage()?.getItem('token') || null
const storedRefreshToken = getStorage()?.getItem('refreshToken') || null

export const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: Boolean(storedUser && storedToken),
  loading: false,
  
  login: (user, token, refreshToken) => {
    const storage = getStorage()
    if (token) {
      storage?.setItem('token', token)
    } else {
      storage?.removeItem('token')
    }
    storage?.setItem('user', JSON.stringify(user))
    if (refreshToken) {
      storage?.setItem('refreshToken', refreshToken)
    } else {
      storage?.removeItem('refreshToken')
    }
    set({ user, token: token || null, refreshToken: refreshToken || null, isAuthenticated: Boolean(user && token) })
  },
  
  logout: () => {
    const storage = getStorage()
    storage?.removeItem('token')
    storage?.removeItem('refreshToken')
    storage?.removeItem('user')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
  },
  
  setTokens: (token, refreshToken) => {
    const storage = getStorage()
    storage?.setItem('token', token)
    if (refreshToken) {
      storage?.setItem('refreshToken', refreshToken)
    }
    set((state) => ({
      token,
      refreshToken: refreshToken || state.refreshToken,
      isAuthenticated: Boolean(state.user && token)
    }))
  },

  setUser: (user) => {
    const storage = getStorage()
    if (user) {
      storage?.setItem('user', JSON.stringify(user))
    } else {
      storage?.removeItem('user')
    }
    set((state) => ({
      user,
      isAuthenticated: Boolean(user && state.token)
    }))
  },
}))
