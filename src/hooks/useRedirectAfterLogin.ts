'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

/**
 * A hook that handles redirection after login
 * Used to redirect users to their intended destination after successfully logging in
 */
export function useRedirectAfterLogin() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)
  
  const handleProtectedAction = useCallback((href: string) => {
    if (isAuthenticated) {
      // If already authenticated, navigate directly
      router.push(href)
      return true
    } else {
      // If not authenticated, store the path and show login dialog
      setRedirectPath(href)
      setShowLoginDialog(true)
      return false
    }
  }, [isAuthenticated, router])
  
  const handleLoginSuccess = useCallback(() => {
    // Close the dialog
    setShowLoginDialog(false)
    
    // If we have a redirect path, navigate to it
    if (redirectPath) {
      router.push(redirectPath)
      // Clear the redirect path
      setRedirectPath(null)
    }
  }, [redirectPath, router])
  
  return {
    showLoginDialog,
    setShowLoginDialog,
    redirectPath,
    handleProtectedAction,
    handleLoginSuccess
  }
} 