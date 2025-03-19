'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import TaskForm from '../../components/TaskForm'
import taskService from '@/services/tasks'
import { TaskDetail, Task } from '@/services/tasks'

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [task, setTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await taskService.getTask(taskId)
        setTask(data)
      } catch (err) {
        console.error('Failed to fetch task:', err)
        setError('Failed to load task. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  const handleTaskUpdated = (task: Task) => {
    // Navigate to the task detail page
    router.push(`/agents/tasks/${task.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading task...</p>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || 'Task not found.'}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/agents/tasks')}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Return to Tasks
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/agents/tasks/${taskId}`)}
            className="gap-1 mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Task
          </Button>

          <h1 className="text-2xl font-bold tracking-tight">Edit Task</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Editing: <span className="font-medium">{task.title}</span>
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <TaskForm
          initialData={task}
          isEditing={true}
          onSuccess={handleTaskUpdated}
        />
      </div>
    </div>
  )
} 