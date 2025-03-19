import React from 'react'
import { Badge } from '@/components/ui/badge'
import { TaskPriority } from '@/services/tasks'

// Define priority label mapping
const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
  [TaskPriority.URGENT]: 'Urgent'
}

// Define priority color mapping
const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  [TaskPriority.URGENT]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

const TaskPriorityBadge = ({ priority, className = '' }: TaskPriorityBadgeProps) => {
  return (
    <Badge
      className={`${priorityColors[priority]} hover:${priorityColors[priority]} ${className}`}
      variant="outline"
    >
      {priorityLabels[priority]}
    </Badge>
  )
}

export default TaskPriorityBadge 