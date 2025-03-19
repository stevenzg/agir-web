import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { CalendarIcon, PencilIcon, TrashIcon, UserIcon } from 'lucide-react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { Task } from '@/services/tasks'
import TaskStatusBadge from './TaskStatusBadge'
import TaskPriorityBadge from './TaskPriorityBadge'

interface TaskCardProps {
  task: Task
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView?: () => void
}

const TaskCard = ({ task, onEdit, onDelete, onView }: TaskCardProps) => {
  const dueDate = task.due_date ? new Date(task.due_date) : null
  const createdAt = new Date(task.created_at)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {onView ? (
              <CardTitle
                className="text-lg cursor-pointer hover:underline"
                onClick={onView}
              >
                {task.title}
              </CardTitle>
            ) : (
              <Link
                href={`/agents/tasks/${task.id}`}
                className="hover:underline"
              >
                <CardTitle className="text-lg">{task.title}</CardTitle>
              </Link>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2 flex-1">
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-4 mt-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{task.completion_percentage}%</span>
            </div>
            <Progress value={task.completion_percentage} className="h-2" />
          </div>

          {dueDate && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <CalendarIcon className="h-4 w-4" />
              <span>Due {formatDistanceToNow(dueDate, { addSuffix: true })}</span>
            </div>
          )}

          {task.assignees.length > 0 && (
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {assignee.user_id.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-1">
        <div className="flex justify-between items-center w-full text-xs text-gray-500">
          <span>Created {formatDistanceToNow(createdAt, { addSuffix: true })}</span>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(task.id)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={() => onDelete(task.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TaskCard 