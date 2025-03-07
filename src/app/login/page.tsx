'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EmailVerificationForm from './components/EmailVerificationForm'
import { sendVerificationCode, verifyEmail } from '@/services/auth'
import { useAuth } from '@/context/AuthContext'

// 定义详细错误类型
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

  // 错误处理工具函数
  const handleApiError = (err: unknown): ApiError => {
    console.error('API错误:', err)

    // 标准API错误
    if (typeof err === 'object' && err !== null && 'code' in err && 'message' in err) {
      return err as ApiError
    }

    // 未知错误或网络错误
    if (err instanceof Error) {
      return {
        code: 'unknown_error',
        message: err.message || '发生错误，请稍后重试'
      }
    }

    // 默认错误
    return {
      code: 'system_error',
      message: '系统错误，请稍后重试'
    }
  }

  const handleSendCode = async (inputEmail: string) => {
    try {
      setIsLoading(true)
      setError(null)
      // 调用 API 发送验证码
      await sendVerificationCode(inputEmail)
      // 保存邮箱并进入验证码输入步骤
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
      // 调用 API 验证邮箱和验证码
      const result = await verifyEmail(email, code)

      // 使用AuthContext登录
      login(result.access_token, result.refresh_token)

      // 登录成功，重定向到首页
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

  // 获取友好的错误消息
  const getErrorMessage = () => {
    if (!error) return null

    // 处理特定错误类型的友好消息
    switch (error.code) {
      case 'invalid_email':
        return '邮箱格式不正确，请检查后重试'
      case 'invalid_code':
        return '验证码不正确，请重新输入'
      case 'code_expired':
        return '验证码已过期，请重新获取'
      case 'too_many_attempts':
        return '尝试次数过多，请稍后再试'
      case 'network_error':
        return '网络连接失败，请检查您的网络'
      default:
        return error.message || '发生错误，请稍后重试'
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">登录</h1>

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