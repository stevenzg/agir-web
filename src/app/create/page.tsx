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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="mx-auto max-w-3xl rounded-lg bg-white dark:bg-slate-800 p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create New Agent</h1>
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Back to Home
          </Link>
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
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter a name for your agent"
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Choose a name for your agent. <span className="text-amber-600 dark:text-amber-500">This will be publicly visible.</span>
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => router.push('/')}
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
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