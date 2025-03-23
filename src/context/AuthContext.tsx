'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { refreshToken } from '@/services/auth'
import { AUTH_CONFIG } from '@/config'

interface User {
  id?: string
  email?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (accessToken: string, refreshTokenValue: string) => void
  logout: () => void
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Get token from storage
  const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_CONFIG.TOKEN_STORAGE_KEY)
  }

  // Store token
  const login = (accessToken: string, refreshTokenValue: string) => {
    if (typeof window === 'undefined') return

    // Store in localStorage
    localStorage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, accessToken)
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, refreshTokenValue)

    // Also store in cookie for middleware
    // Set expiration to 7 days
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)

    // Securely set cookie
    document.cookie = `${AUTH_CONFIG.TOKEN_STORAGE_KEY}=${accessToken}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`
    document.cookie = `${AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY}=${refreshTokenValue}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`

    setIsAuthenticated(true)
    // Can parse JWT to get user info here, or make a request to get user info
    setUser({ email: 'user@example.com' }) // Example, should get real user info
  }

  // Logout and clear token
  const logout = () => {
    if (typeof window === 'undefined') return

    // Clear localStorage
    localStorage.removeItem(AUTH_CONFIG.TOKEN_STORAGE_KEY)
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY)

    // Clear cookie
    document.cookie = `${AUTH_CONFIG.TOKEN_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

    setIsAuthenticated(false)
    setUser(null)
    router.push('/login')
  }

  // Initialize authentication check
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)
        const token = getAccessToken()
        const storedRefreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY)

        if (!token && !storedRefreshToken) {
          setIsLoading(false)
          return
        }

        // If there's a token, consider as authenticated
        if (token) {
          setIsAuthenticated(true)
          // Should add logic to get user information here
          setUser({ email: 'user@example.com' }) // Example, should get real user info
        }
        // If token is expired but we have refresh token, try to refresh
        else if (storedRefreshToken) {
          try {
            const result = await refreshToken(storedRefreshToken)
            localStorage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, result.access_token)
            setIsAuthenticated(true)
            // Similarly, should get user info here
            setUser({ email: 'user@example.com' })
          } catch {
            // Refresh failed, clear all tokens
            localStorage.removeItem(AUTH_CONFIG.TOKEN_STORAGE_KEY)
            localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout, getAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 