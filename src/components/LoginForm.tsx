'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { sendVerificationCode, verifyEmail } from '@/services/auth'

interface LoginFormProps {
  onLoginSuccess: () => void
}

// Define detailed error type
interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [step, setStep] = useState<'email' | 'verification'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  // Error handling utility function
  const handleApiError = (err: unknown): ApiError => {
    console.error('API Error:', err)

    // Standard API error
    if (typeof err === 'object' && err !== null && 'code' in err && 'message' in err) {
      return err as ApiError
    }

    // Unknown error or network error
    if (err instanceof Error) {
      return {
        code: 'unknown_error',
        message: err.message || 'An error occurred, please try again later'
      }
    }

    // Default error
    return {
      code: 'system_error',
      message: 'System error, please try again later'
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)
      // Call API to send verification code
      await sendVerificationCode(email)
      // Proceed to verification code input step
      setStep('verification')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)
      // Call API to verify code
      const result = await verifyEmail(email, code)
      // Save tokens and update auth state
      login(result.access_token, result.refresh_token)
      // Call the onLoginSuccess callback
      onLoginSuccess()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setError(null)
  }

  const getErrorMessage = () => {
    if (!error) return null
    return error.message
  }

  return (
    <div className="flex flex-col gap-4">
      {step === 'email' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">{getErrorMessage()}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">{getErrorMessage()}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBackToEmail}
            disabled={isLoading}
          >
            Back
          </Button>
        </form>
      )}
    </div>
  )
} 