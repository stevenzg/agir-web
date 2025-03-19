import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PencilIcon, TrashIcon, UserIcon } from 'lucide-react'
import { Task, TaskStatus } from '@/services/tasks'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onAssign?: (task: Task) => void
  onView: (task: Task) => void
}

const TaskCard = ({ task, onEdit, onDelete, onAssign, onView }: TaskCardProps) => {
  const statusColors = {
    [TaskStatus.TODO]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    [TaskStatus.REVIEW]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    [TaskStatus.DONE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    [TaskStatus.ARCHIVED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer" onClick={() => onView(task)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(task)
            }}
            className="h-8 w-8"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task)
            }}
            className="h-8 w-8"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
          {onAssign && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onAssign(task)
              }}
              className="h-8 w-8"
            >
              <UserIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="flex items-center gap-2">
            <Badge className={statusColors[task.status]}>
              {task.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard 