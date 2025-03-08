'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// 错误类型定义
interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// Main component content that uses useSearchParams
function EditAgentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [isNew, setIsNew] = useState(false)

  // Agent表单状态
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    appearance: '',
    occupation: '',
    location: '',
    interests: '',
    communication: '',
    values: '',
    background: ''
  })

  // 获取Agent详情
  const fetchAgentDetails = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: 实际的API调用获取Agent详情
      // const response = await fetchAgent(id)
      // setFormData(response)

      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 使用模拟数据
      setFormData({
        id,
        name: 'Sample Agent',
        appearance: 'Professional appearance with neat attire',
        occupation: 'AI Assistant',
        location: 'Virtual World',
        interests: 'Helping users, solving problems, continuous learning',
        communication: 'Clear, concise, and friendly communication style',
        values: 'Accuracy, helpfulness, respect for privacy',
        background: 'Created to assist users with various tasks'
      })
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 获取URL参数并初始化表单
  useEffect(() => {
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    const newAgent = searchParams.get('isNew') === 'true'

    setIsNew(newAgent)

    if (id) {
      // 如果是新创建的Agent，使用URL中的信息
      if (newAgent && name) {
        setFormData(prev => ({
          ...prev,
          id,
          name: decodeURIComponent(name)
        }))
      } else {
        // 否则，从API获取已有Agent的信息
        fetchAgentDetails(id)
      }
    } else {
      // 没有ID参数，返回到首页
      router.push('/')
    }
  }, [searchParams, router, fetchAgentDetails])

  // 处理表单字段变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 错误处理工具函数
  const handleApiError = (err: unknown): ApiError => {
    console.error('API Error:', err)

    // 标准API错误
    if (typeof err === 'object' && err !== null && 'code' in err && 'message' in err) {
      return err as ApiError
    }

    // 未知错误或网络错误
    if (err instanceof Error) {
      return {
        code: 'unknown_error',
        message: err.message || 'An error occurred, please try again later'
      }
    }

    // 默认错误
    return {
      code: 'system_error',
      message: 'System error, please try again later'
    }
  }

  // 提交表单保存Agent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError({
        code: 'validation_error',
        message: 'Please enter an agent name'
      })
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      // TODO: 调用API保存Agent
      // const response = await saveAgent(formData)

      // 模拟成功保存
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 保存后跳转到定制面部页面或其他页面
      router.push(`/customize-face?id=${formData.id}`)

    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? 'Complete Your Agent Profile' : 'Edit Agent'}
          </h1>
          <div className="flex space-x-4">
            <Link
              href="/customize-face"
              className="text-sm flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <span className="mr-2">Customize Face</span>
              <span className="text-lg">😊</span>
            </Link>
            <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="mb-6 rounded-md bg-amber-50 p-4 text-sm text-amber-700 border border-amber-200">
          <p className="font-medium mb-1">Important: Privacy Information</p>
          <p className="mb-2">
            Fill this form as if introducing someone at a social gathering. You can use real information if you wish, but it is not required.
          </p>
          <p>
            <strong>Note:</strong> Only the agent name and interests/expertise will be visible to other users.
            All other personal details will remain private.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Agent Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter a name for your agent"
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Choose a name for your agent. <span className="text-amber-600">This will be publicly visible.</span>
            </p>
          </div>

          <div>
            <label htmlFor="appearance" className="mb-2 block text-sm font-medium text-gray-700">
              Appearance & First Impression
            </label>
            <textarea
              id="appearance"
              name="appearance"
              rows={3}
              value={formData.appearance}
              onChange={handleChange}
              placeholder="What would someone notice first about them? How do they present themselves?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">This information will remain private and will not be shared with other users.</p>
          </div>

          <div>
            <label htmlFor="occupation" className="mb-2 block text-sm font-medium text-gray-700">
              Occupation & Expertise
            </label>
            <textarea
              id="occupation"
              name="occupation"
              rows={2}
              value={formData.occupation}
              onChange={handleChange}
              placeholder="What do they do? What are they known for professionally?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">This helps define your agent&apos;s knowledge areas. <span className="text-amber-600">This will be partially visible to others.</span></p>
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium text-gray-700">
              Location & Origin
            </label>
            <textarea
              id="location"
              name="location"
              rows={2}
              value={formData.location}
              onChange={handleChange}
              placeholder="Where are they from? Where do they live now?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">This information will remain private and will not be shared with other users.</p>
          </div>

          <div>
            <label htmlFor="interests" className="mb-2 block text-sm font-medium text-gray-700">
              Interests & Hobbies
            </label>
            <textarea
              id="interests"
              name="interests"
              rows={3}
              value={formData.interests}
              onChange={handleChange}
              placeholder="What do they enjoy talking about? What activities do they like? What topics get them excited?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">These interests will help others find and connect with your agent. <span className="text-amber-600">This will be publicly visible.</span></p>
          </div>

          <div>
            <label htmlFor="communication" className="mb-2 block text-sm font-medium text-gray-700">
              Communication Style
            </label>
            <textarea
              id="communication"
              name="communication"
              rows={2}
              value={formData.communication}
              onChange={handleChange}
              placeholder="How do they talk? Are they outgoing or reserved? Formal or casual? Quick to joke or serious?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">This information will remain private and will not be shared with other users.</p>
          </div>

          <div>
            <label htmlFor="values" className="mb-2 block text-sm font-medium text-gray-700">
              Values & Beliefs
            </label>
            <textarea
              id="values"
              name="values"
              rows={2}
              value={formData.values}
              onChange={handleChange}
              placeholder="What matters to them? What principles guide their decisions?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">This information will remain private and will not be shared with other users.</p>
          </div>

          <div>
            <label htmlFor="background" className="mb-2 block text-sm font-medium text-gray-700">
              Brief Background
            </label>
            <textarea
              id="background"
              name="background"
              rows={3}
              value={formData.background}
              onChange={handleChange}
              placeholder="What's their story in a nutshell? Any key life experiences that shaped them?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">This information will remain private and will not be shared with other users.</p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => router.push('/')}
              variant="outline"
              className="border-gray-300 text-gray-700"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isNew ? 'Continue to Customize Face' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Loading fallback for Suspense
function EditAgentLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading agent editor...</p>
      </div>
    </div>
  )
}

// Wrapper component with Suspense
export default function EditAgentPage() {
  return (
    <Suspense fallback={<EditAgentLoading />}>
      <EditAgentContent />
    </Suspense>
  )
} 