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

  // 从存储中获取 token
  const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_CONFIG.TOKEN_STORAGE_KEY)
  }

  // 存储 token
  const login = (accessToken: string, refreshTokenValue: string) => {
    if (typeof window === 'undefined') return

    // 存储到 localStorage
    localStorage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, accessToken)
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, refreshTokenValue)

    // 同时存储到 cookie，用于 middleware
    // 设置过期时间为7天
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)

    // 安全地设置 cookie
    document.cookie = `${AUTH_CONFIG.TOKEN_STORAGE_KEY}=${accessToken}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`
    document.cookie = `${AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY}=${refreshTokenValue}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`

    setIsAuthenticated(true)
    // 这里可以解析 JWT 获取用户信息，或者发起请求获取用户信息
    setUser({ email: 'user@example.com' }) // 示例，实际应获取真实用户信息
  }

  // 登出并清除 token
  const logout = () => {
    if (typeof window === 'undefined') return

    // 清除 localStorage
    localStorage.removeItem(AUTH_CONFIG.TOKEN_STORAGE_KEY)
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY)

    // 清除 cookie
    document.cookie = `${AUTH_CONFIG.TOKEN_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

    setIsAuthenticated(false)
    setUser(null)
    router.push('/login')
  }

  // 初始化检查认证状态
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

        // 如果有token，则视为已认证
        if (token) {
          setIsAuthenticated(true)
          // 这里应该加入获取用户信息的逻辑
          setUser({ email: 'user@example.com' }) // 示例，实际应获取真实用户信息
        }
        // 如果token过期但有刷新token，尝试刷新
        else if (storedRefreshToken) {
          try {
            const result = await refreshToken(storedRefreshToken)
            localStorage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, result.access_token)
            setIsAuthenticated(true)
            // 同样，这里应该获取用户信息
            setUser({ email: 'user@example.com' })
          } catch (error) {
            // 刷新失败，清除所有token
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