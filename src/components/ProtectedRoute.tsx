'use client'

import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'

interface ProtectedRouteProps {
  children: ReactNode
  href: string
  asButton?: boolean
  className?: string
  onClick?: () => void
}

/**
 * A component that wraps children in a protected route
 * When clicked, it either navigates directly if the user is authenticated
 * or shows a login dialog if not
 */
export function ProtectedRoute({
  children,
  href,
  asButton = false,
  className = '',
  onClick
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    // If there's a custom onClick handler, call it
    if (onClick) {
      onClick()
    }

    // Prevent default link behavior
    e.preventDefault()

    if (isAuthenticated) {
      // If authenticated, navigate directly to the target route
      router.push(href)
    } else {
      // If not authenticated, store redirect path and show login dialog
      setRedirectPath(href)
      setShowLoginDialog(true)
    }
  }

  const handleLoginSuccess = () => {
    // Close the dialog
    setShowLoginDialog(false)

    // Navigate to the stored redirect path
    if (redirectPath) {
      router.push(redirectPath)
    }
  }

  // Render as button or anchor based on asButton prop
  const Element = asButton ? 'button' : 'a'

  return (
    <>
      <Element
        onClick={handleClick}
        className={className}
        href={asButton ? undefined : '#'}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </Element>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Login to continue</DialogTitle>
          </DialogHeader>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
} 