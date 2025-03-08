'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Define error type
interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export default function CreateAgentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  // Agent form state
  const [formData, setFormData] = useState({
    name: '',
    appearance: '',
    occupation: '',
    location: '',
    interests: '',
    communication: '',
    values: '',
    background: ''
  })

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

  // Submit form to create agent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      setError(null)

      // TODO: Call API to create agent
      // This is where you'd make the API call to create the agent
      // const response = await createAgent(formData)

      // For now, just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to the agent details page or dashboard
      router.push('/')

    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const renderAgentForm = () => (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Create Your Agent</h1>
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">
            Back to Home
          </Link>
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
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="How would they introduce themselves?"
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">The name people would call your agent. <span className="text-amber-600">This will be publicly visible.</span></p>
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
            <p className="mt-1 text-xs text-gray-500">This helps define your agent's knowledge areas. <span className="text-amber-600">This will be partially visible to others.</span></p>
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Agent...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <ProtectedRoute href="/create">
      {renderAgentForm()}
    </ProtectedRoute>
  )
} 