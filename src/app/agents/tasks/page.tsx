'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Agents</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColorMap[task.status]}`}>
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>{task.assignedAgents} agents</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${priorityColorMap[task.priority]}`}>
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell>{task.createdAt}</TableCell>
                  <TableCell>
                    <Link
                      href={`/agents/tasks/${task.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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