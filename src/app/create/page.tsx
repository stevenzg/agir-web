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
    description: '',
    personality: '',
    skills: '',
    initialPrompt: '',
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
          <h1 className="text-2xl font-bold text-gray-800">Create New Agent</h1>
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">
            Back to Home
          </Link>
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
              placeholder="Enter agent name"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what your agent does"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="personality" className="mb-2 block text-sm font-medium text-gray-700">
              Personality
            </label>
            <textarea
              id="personality"
              name="personality"
              rows={3}
              value={formData.personality}
              onChange={handleChange}
              placeholder="Describe your agent's personality traits"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="skills" className="mb-2 block text-sm font-medium text-gray-700">
              Skills
            </label>
            <Input
              id="skills"
              name="skills"
              type="text"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Comma-separated list of skills"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="initialPrompt" className="mb-2 block text-sm font-medium text-gray-700">
              Initial Prompt
            </label>
            <textarea
              id="initialPrompt"
              name="initialPrompt"
              rows={5}
              value={formData.initialPrompt}
              onChange={handleChange}
              placeholder="Instructions to guide your agent"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
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
              {isLoading ? 'Creating...' : 'Create Agent'}
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