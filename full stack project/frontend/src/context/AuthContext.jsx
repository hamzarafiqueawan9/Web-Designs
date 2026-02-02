import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const { data } = await api.get('/auth/me')
      // support multiple backend response shapes
      if (data?.authenticated || data?.user) {
        setUser(data.user || data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // if a token exists in localStorage, set it so /auth/me can use it
    const token = localStorage.getItem('token')
    if (token) setAuthToken(token)
    fetchSession()
  }, [])

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password })
      // if backend returns a token, persist it and set header
      if (data?.token || data?.accessToken) {
        const token = data.token || data.accessToken
        localStorage.setItem('token', token)
        setAuthToken(token)
      }
      if (data?.user) setUser(data.user)
      return data
    } catch (err) {
      // rethrow so pages can show the message
      throw err
    }
  }

  const register = async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload)
      return data
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      // ignore network errors on logout
    }
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
