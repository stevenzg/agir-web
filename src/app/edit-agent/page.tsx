'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Error type definition
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

  // Agent form state
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

  // Get Agent details
  const fetchAgentDetails = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Actual API call to fetch Agent details
      // const response = await fetchAgent(id)
      // setFormData(response)

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Use simulated data
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

  // Get URL parameters and initialize form
  useEffect(() => {
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    const newAgent = searchParams.get('isNew') === 'true'

    setIsNew(newAgent)

    if (id) {
      // If it's a newly created Agent, use information from URL
      if (newAgent && name) {
        setFormData(prev => ({
          ...prev,
          id,
          name: decodeURIComponent(name)
        }))
      } else {
        // Otherwise, get existing Agent information from API
        fetchAgentDetails(id)
      }
    } else {
      // No ID parameter, return to homepage
      router.push('/')
    }
  }, [searchParams, router, fetchAgentDetails])

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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

  // Submit form to save Agent
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

      // TODO: Call API to save Agent
      // const response = await saveAgent(formData)

      // Simulate successful save
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Save and redirect to customize face page or other page
      router.push(`/customize-face?id=${formData.id}`)

    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading agent details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="mx-auto max-w-3xl rounded-lg bg-white dark:bg-slate-800 p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isNew ? 'Complete Your Agent Profile' : 'Edit Agent'}
          </h1>
          <div className="flex space-x-4">
            <Link
              href="/customize-face"
              className="text-sm flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <span className="mr-2">Customize Face</span>
              <span className="text-lg">😊</span>
            </Link>
            <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="mb-6 rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
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
          <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Choose a name for your agent. <span className="text-amber-600 dark:text-amber-500">This will be publicly visible.</span>
            </p>
          </div>

          <div>
            <label htmlFor="appearance" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Appearance & First Impression
            </label>
            <textarea
              id="appearance"
              name="appearance"
              rows={3}
              value={formData.appearance}
              onChange={handleChange}
              placeholder="What would someone notice first about them? How do they present themselves?"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This information will remain private and will not be shared with other users.</p>
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading agent editor...</p>
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