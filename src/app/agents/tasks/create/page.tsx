'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import TaskForm from '../components/TaskForm'
import taskService from '@/services/tasks'
import { Task, TaskDetail } from '@/services/tasks'

export default function CreateTaskPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if creating a subtask
  const parentTaskId = searchParams.get('parent')

  const [parentTask, setParentTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(!!parentTaskId)
  const [error, setError] = useState<string | null>(null)

  // If parent task ID provided, fetch parent task details
  useEffect(() => {
    const fetchParentTask = async () => {
      if (!parentTaskId) return

      try {
        setLoading(true)
        setError(null)
        const data = await taskService.getTask(parentTaskId)
        setParentTask(data)
      } catch (err) {
        console.error('Failed to fetch parent task:', err)
        setError('Failed to load parent task. You can still create a task without a parent.')
      } finally {
        setLoading(false)
      }
    }

    fetchParentTask()
  }, [parentTaskId])

  const handleTaskCreated = (task: Task) => {
    // Navigate to the newly created task
    router.push(`/agents/tasks/${task.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/agents/tasks')}
            className="gap-1 mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Tasks
          </Button>

          <h1 className="text-2xl font-bold tracking-tight">Create New Task</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {parentTaskId ? 'Create a subtask under parent task' : 'Create a new top-level task'}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="max-w-3xl">
        <TaskForm
          parentTaskId={parentTaskId || undefined}
          parentTask={parentTask}
          onSuccess={handleTaskCreated}
          isLoading={loading}
        />
      </div>
    </div>
  )
} 