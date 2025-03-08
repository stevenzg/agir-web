'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'

interface Agent {
  id: string
  name: string
  avatar: string
}

interface Update {
  date: string
  content: string
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  assignedAgents: Agent[]
  priority: string
  createdAt: string
  deadline: string
  progress: number
  updates: Update[]
}

// Mock task data
const MOCK_TASKS: Record<string, Task> = {
  '1': {
    id: '1',
    title: 'Market Research Report',
    description: 'Comprehensive analysis of the target market, including market size, competitors, consumer behavior, etc. Generate a detailed market research report.',
    status: 'In Progress',
    assignedAgents: [
      { id: 'a1', name: 'Data Analyst', avatar: '/avatars/analyst.png' },
      { id: 'a2', name: 'Market Expert', avatar: '/avatars/market.png' },
    ],
    priority: 'High',
    createdAt: '2023-03-01',
    deadline: '2023-03-15',
    progress: 65,
    updates: [
      { date: '2023-03-03', content: 'Completed market size analysis' },
      { date: '2023-03-05', content: 'Competitor analysis draft completed' },
      { date: '2023-03-08', content: 'Consumer behavior analysis in progress' },
    ]
  },
  '2': {
    id: '2',
    title: 'Data Analysis',
    description: 'Analyze sales data, identify trends and provide insights. Prepare visualizations and recommendations.',
    status: 'Pending',
    assignedAgents: [
      { id: 'a1', name: 'Data Analyst', avatar: '/avatars/analyst.png' },
    ],
    priority: 'Medium',
    createdAt: '2023-03-02',
    deadline: '2023-03-20',
    progress: 0,
    updates: []
  },
  '3': {
    id: '3',
    title: 'Content Creation',
    description: 'Create high-quality content for the company blog, including product introductions, industry news, and usage tips.',
    status: 'Completed',
    assignedAgents: [
      { id: 'a3', name: 'Content Creator', avatar: '/avatars/writer.png' },
      { id: 'a4', name: 'Editor', avatar: '/avatars/editor.png' },
      { id: 'a5', name: 'Designer', avatar: '/avatars/designer.png' },
    ],
    priority: 'Low',
    createdAt: '2023-03-03',
    deadline: '2023-03-10',
    progress: 100,
    updates: [
      { date: '2023-03-04', content: 'Content outline created' },
      { date: '2023-03-07', content: 'First draft completed and under review' },
      { date: '2023-03-09', content: 'Editorial revisions completed' },
      { date: '2023-03-10', content: 'Final content uploaded' },
    ]
  }
}

// Status color mapping
const statusColorMap: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
}

// Priority color mapping
const priorityColorMap: Record<string, string> = {
  'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

interface TaskDetailProps {
  params: {
    id: string
  }
}

export default function TaskDetailPage({ params }: TaskDetailProps) {
  const router = useRouter()
  const { id } = params
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchTask = async () => {
      setLoading(true)
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const taskData = MOCK_TASKS[id as keyof typeof MOCK_TASKS]
        if (taskData) {
          setTask(taskData)
        } else {
          // Task not found, redirect to list page
          router.push('/agents/tasks')
        }
      } catch (error) {
        console.error('Failed to fetch task:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id, router])

  const handleEditTask = () => {
    // In a real application, this would navigate to the edit page
    console.log('Edit task:', id)
  }

  const handleDeleteTask = () => {
    // In a real application, this would show a confirmation dialog and delete the task
    console.log('Delete task:', id)
    router.push('/agents/tasks')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Task not found</p>
        <Button onClick={() => router.push('/agents/tasks')}>Return to Task List</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{task.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs ${statusColorMap[task.status]}`}>
              {task.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${priorityColorMap[task.priority]}`}>
              Priority: {task.priority}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Created on {task.createdAt}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleEditTask}>
            Edit Task
          </Button>
          <Button variant="outline" onClick={handleDeleteTask} className="text-red-600 hover:text-red-700">
            Delete Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Updates</CardTitle>
            </CardHeader>
            <CardContent>
              {task.updates.length > 0 ? (
                <div className="space-y-4">
                  {task.updates.map((update, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{update.date}</p>
                      <p className="text-gray-700 dark:text-gray-300">{update.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No updates yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Completion</span>
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
              {task.deadline && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
                  <p className="font-medium">{task.deadline}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Agents</CardTitle>
            </CardHeader>
            <CardContent>
              {task.assignedAgents.length > 0 ? (
                <div className="space-y-4">
                  {task.assignedAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center space-x-3">
                      <Avatar>
                        <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                          {agent.name.charAt(0)}
                        </div>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No agents assigned yet</p>
              )}
              <div className="mt-4">
                <Button className="w-full" variant="outline">
                  Add Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 