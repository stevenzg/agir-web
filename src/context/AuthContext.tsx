'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { refreshToken, logout } from '@/services/auth'

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  logout: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 检查认证状态并处理令牌刷新
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const refreshTokenValue = localStorage.getItem('refreshToken')

        if (!token || !refreshTokenValue) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        // 简单检查令牌是否存在，实际应用中可能需要验证令牌
        setIsAuthenticated(true)

        // 这里可以添加令牌刷新逻辑
        // 例如: 检查令牌过期时间，如果快过期则刷新

      } catch (error) {
        console.error('Authentication error:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsAuthenticated(false)
    router.push('/login')
  }

  const getAccessToken = () => {
    return localStorage.getItem('accessToken')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        logout: handleLogout,
        getAccessToken,
      }}
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