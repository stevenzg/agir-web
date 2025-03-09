'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveDataView } from '@/components/ui/responsive-data-view'

// Mock task data
const MOCK_TASKS = [
  {
    id: '1',
    title: 'Market Research Report',
    status: 'In Progress',
    assignedAgents: 2,
    priority: 'High',
    createdAt: '2023-03-01',
  },
  {
    id: '2',
    title: 'Data Analysis',
    status: 'Pending',
    assignedAgents: 1,
    priority: 'Medium',
    createdAt: '2023-03-02',
  },
  {
    id: '3',
    title: 'Content Creation',
    status: 'Completed',
    assignedAgents: 3,
    priority: 'Low',
    createdAt: '2023-03-03',
  },
]

export default function TasksPage() {
  const router = useRouter()
  const [tasks] = useState(MOCK_TASKS)

  const handleCreateTask = () => {
    router.push('/agents/tasks/create')
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

  // 定义表格/卡片列配置
  const columns = [
    {
      accessorKey: 'title',
      header: 'Task Title',
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${statusColorMap[value]}`}>
          {value}
        </span>
      ),
    },
    {
      accessorKey: 'assignedAgents',
      header: 'Assigned Agents',
      cell: (value: number) => `${value} agents`,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${priorityColorMap[value]}`}>
          {value}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: (value: string) => (
        <Link
          href={`/agents/tasks/${value}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View Details
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Task Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Create and manage your tasks for AI assistants to help complete
          </p>
        </div>
        <Button onClick={handleCreateTask}>Create Task</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveDataView
            data={tasks}
            columns={columns}
            cardTitleKey="title"
            cardDescriptionKey="status"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Waiting to be assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In Progress Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Being processed by agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Successfully completed tasks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 