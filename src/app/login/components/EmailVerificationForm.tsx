'use client'

import { useState, FormEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface EmailVerificationFormProps {
  step: 'email' | 'verification'
  onSendCode: (email: string) => Promise<void>
  onVerifyCode: (code: string) => Promise<void>
  onBackToEmail: () => void
  isLoading: boolean
  email: string
}

export default function EmailVerificationForm({
  step,
  onSendCode,
  onVerifyCode,
  onBackToEmail,
  isLoading,
  email,
}: EmailVerificationFormProps) {
  const [inputEmail, setInputEmail] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (inputEmail.trim()) {
      await onSendCode(inputEmail.trim())
      // 开始倒计时
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      await onVerifyCode(code.trim())
    }
  }

  const handleResendCode = async () => {
    if (countdown === 0) {
      await onSendCode(email)
      // 重新开始倒计时
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  return (
    <>
      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <Input
              id="email"
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="请输入您的邮箱"
              required
              className="mt-1 block w-full"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || !inputEmail.trim()}
          >
            获取验证码
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <button
                type="button"
                onClick={onBackToEmail}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                修改
              </button>
            </div>
            <p className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600">
              {email}
            </p>
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              验证码
            </label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="请输入验证码"
              required
              className="mt-1 block w-full"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || isLoading}
              className={`text-sm ${countdown > 0 ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'
                }`}
            >
              {countdown > 0 ? `重新发送 (${countdown}s)` : '重新发送'}
            </button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !code.trim()}
            >
              登录
            </Button>
          </div>
        </form>
      )}
    </>
  )
} 