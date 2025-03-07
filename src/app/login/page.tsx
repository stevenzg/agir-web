'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EmailVerificationForm from './components/EmailVerificationForm'
import { sendVerificationCode, verifyEmail } from '@/services/auth'
import { useAuth } from '@/context/AuthContext'

// Define detailed error type
interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<'email' | 'verification'>('email')
  const [email, setEmail] = useState('')
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

  const handleSendCode = async (inputEmail: string) => {
    try {
      setIsLoading(true)
      setError(null)
      // Call API to send verification code
      await sendVerificationCode(inputEmail)
      // Save email and proceed to verification code input step
      setEmail(inputEmail)
      setStep('verification')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (code: string) => {
    try {
      setIsLoading(true)
      setError(null)
      // Call API to verify email and code
      const result = await verifyEmail(email, code)

      // Use AuthContext to login
      login(result.access_token, result.refresh_token)

      // Login successful, redirect to homepage
      router.push('/')
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

  // Get friendly error message
  const getErrorMessage = () => {
    if (!error) return null

    // Handle friendly messages for specific error types
    switch (error.code) {
      case 'invalid_email':
        return 'Invalid email format, please check and try again'
      case 'invalid_code':
        return 'Incorrect verification code, please try again'
      case 'code_expired':
        return 'Verification code has expired, please request a new one'
      case 'too_many_attempts':
        return 'Too many attempts, please try again later'
      case 'network_error':
        return 'Network connection failed, please check your network'
      default:
        return error.message || 'An error occurred, please try again later'
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Login</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {getErrorMessage()}
          </div>
        )}

        <EmailVerificationForm
          step={step}
          onSendCode={handleSendCode}
          onVerifyCode={handleVerifyCode}
          onBackToEmail={handleBackToEmail}
          isLoading={isLoading}
          email={email}
        />
      </div>
    </div>
  )
} 