'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EmailVerificationForm from './components/EmailVerificationForm'
import { sendVerificationCode, verifyEmail } from '@/services/auth'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'verification'>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError(err instanceof Error ? err.message : '发送验证码失败，请稍后重试')
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

      // 保存登录凭证到 localStorage
      localStorage.setItem('accessToken', result.access_token)
      localStorage.setItem('refreshToken', result.refresh_token)

      // 登录成功，重定向到首页
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证码验证失败，请检查后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">登录</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
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