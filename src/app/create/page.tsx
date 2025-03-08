'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

  // Simplified Agent form state, only keeping name
  const [agentName, setAgentName] = useState('')

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

    if (!agentName.trim()) {
      setError({
        code: 'validation_error',
        message: 'Please enter an agent name'
      })
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // TODO: Call API to create agent
      // This is where you'd make the API call to create the agent
      // const response = await createAgent({ name: agentName })

      // For now, just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create a temporary ID, should be obtained from API response
      const tempAgentId = 'agent-' + Date.now()

      // Redirect to edit page, carrying new created Agent ID
      router.push(`/edit-agent?id=${tempAgentId}&name=${encodeURIComponent(agentName)}&isNew=true`)

    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Create New Agent</h1>
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
              Agent Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter a name for your agent"
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Choose a name for your agent. <span className="text-amber-600">This will be publicly visible.</span>
            </p>
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
              {isLoading ? 'Creating...' : 'Continue to Customize'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 