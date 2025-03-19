import React from 'react'
import { Badge } from '@/components/ui/badge'
import { TaskStatus } from '@/services/tasks'

// Define status label mapping
const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.REVIEW]: 'In Review',
  [TaskStatus.DONE]: 'Done',
  [TaskStatus.ARCHIVED]: 'Archived'
}

// Define status color mapping
const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  [TaskStatus.REVIEW]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  [TaskStatus.ARCHIVED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
}

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

const TaskStatusBadge = ({ status, className = '' }: TaskStatusBadgeProps) => {
  return (
    <Badge
      className={`${statusColors[status]} hover:${statusColors[status]} ${className}`}
      variant="outline"
    >
      {statusLabels[status]}
    </Badge>
  )
}

export default TaskStatusBadge 