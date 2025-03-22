'use client'

import React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusIcon, SearchIcon, AlertTriangleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResponsiveDataView, Column } from '@/components/ui/responsive-data-view'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Task, TaskStatus } from '@/services/tasks'
import taskService from '@/services/tasks'
import TaskCard from './components/TaskCard'
import TaskStatusBadge from './components/TaskStatusBadge'

// Interface for task count summary
interface TaskCountSummary {
  todo: number
  in_progress: number
  review: number
  done: number
  archived: number
}

// Interface for API request parameters
interface TasksRequestParams {
  skip?: number
  limit?: number
  search?: string
  status?: TaskStatus
  user_id?: string
  parent_id?: string
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Task counts
  const [taskCounts, setTaskCounts] = useState<TaskCountSummary>({
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
    archived: 0
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all')

  // Load tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        setError(null)

        const skip = (currentPage - 1) * pageSize

        const params: TasksRequestParams = {
          skip,
          limit: pageSize,
        }

        if (search) params.search = search
        if (statusFilter && statusFilter !== 'all') params.status = statusFilter
        if (viewMode === 'mine') params.user_id = 'current' // API should handle 'current' as current user

        const response = await taskService.getTasks(params)
        setTasks(response.items)
        setTotal(response.total)

        // In a real implementation, we would have a dedicated API endpoint for task counts
        // This is a placeholder that should be replaced with a proper API call
        try {
          const countsResponse = await taskService.getTaskCounts()
          setTaskCounts(countsResponse)
        } catch (err) {
          console.error('Failed to fetch task counts:', err)
          // If we don't have a dedicated endpoint, at least optimize by using the total count
          // from the tasks response rather than fetching all tasks
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
        setError('Failed to load tasks. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [currentPage, pageSize, search, statusFilter, viewMode])

  const handleCreateTask = useCallback(() => {
    router.push('/agents/tasks/create')
  }, [router])

  const handleEditTask = useCallback((id: string) => {
    router.push(`/agents/tasks/${id}/edit`)
  }, [router])

  const handleDeleteTask = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id)
        // Refresh tasks after deletion
        setTasks(tasks => tasks.filter(task => task.id !== id))
        setTotal(prev => prev - 1)
      } catch (err) {
        console.error('Failed to delete task:', err)
        setError('Failed to delete task. Please try again later.')
      }
    }
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1) // Reset to first page when search changes
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value as TaskStatus | 'all')
    setCurrentPage(1) // Reset to first page when filter changes
  }, [])

  const handleViewModeChange = useCallback((value: string) => {
    setViewMode(value as 'all' | 'mine')
    setCurrentPage(1) // Reset to first page when view mode changes
  }, [])

  // Define columns for table view - memoized to prevent unnecessary re-renders
  const columns = useMemo<Column<Task>[]>(() => [
    {
      accessorKey: 'title',
      header: 'Task Title',
      cell: (value, task) => (
        <Link href={`/agents/tasks/${task.id}`} className="font-medium hover:underline">
          {value as string}
        </Link>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (value) => <TaskStatusBadge status={value as TaskStatus} />,
    },
    {
      accessorKey: 'assigned_to',
      header: 'Assignee',
      cell: (value) => value ? 'Assigned' : 'Unassigned',
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: (_, task) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => router.push(`/agents/tasks/${task.id}`)}>
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleEditTask(task.id)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteTask(task.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ], [router, handleEditTask, handleDeleteTask])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Create and manage your tasks for AI assistants to help complete
          </p>
        </div>
        <Button onClick={handleCreateTask} className="gap-1">
          <PlusIcon className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.todo}</div>
            <p className="text-xs text-muted-foreground">Tasks waiting to be started</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.in_progress}</div>
            <p className="text-xs text-muted-foreground">Tasks currently being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.done}</div>
            <p className="text-xs text-muted-foreground">Tasks successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <SearchIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.REVIEW}>In Review</SelectItem>
            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
            <SelectItem value={TaskStatus.ARCHIVED}>Archived</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={viewMode} onValueChange={handleViewModeChange} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All Tasks</TabsTrigger>
            <TabsTrigger value="mine" className="flex-1">My Tasks</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Task List with Responsive Data View */}
      <ResponsiveDataView<Task>
        data={tasks}
        columns={columns}
        caption={`${total} tasks found`}
        cardTitleKey="title"
        cardDescriptionKey="description"
        currentPage={currentPage}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
        cardComponent={(task) => (
          <TaskCard
            key={task.id}
            task={task}
            onView={() => router.push(`/agents/tasks/${task.id}`)}
            onEdit={() => handleEditTask(task.id)}
            onDelete={() => handleDeleteTask(task.id)}
          />
        )}
      />
    </div>
  )
} 