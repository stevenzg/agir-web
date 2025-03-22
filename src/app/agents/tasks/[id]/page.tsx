'use client'

import React from 'react'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  FileIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  UsersIcon,
  PlusIcon,
  AlertCircleIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { TaskDetail, TaskStatus } from '@/services/tasks'
import taskService from '@/services/tasks'
import TaskStatusBadge from '../components/TaskStatusBadge'
import { formatDistanceToNow, format } from 'date-fns'

interface TaskPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TaskPage({ params }: TaskPageProps) {
  const id = use(params).id
  const router = useRouter()
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Comments state
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  // File upload state
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await taskService.getTask(id)
        setTask(data)
      } catch (err) {
        console.error('Failed to fetch task:', err)
        setError('Failed to load task. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id])

  // Handle edit task
  const handleEditTask = () => {
    router.push(`/agents/tasks/${id}/edit`)
  }

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!task) return

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id)
        router.push('/agents/tasks')
      } catch (err) {
        console.error('Failed to delete task:', err)
        setError('Failed to delete task. Please try again later.')
      }
    }
  }

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return

    try {
      setSubmittingComment(true)
      const comment = await taskService.addComment(id, newComment)

      // Update local state with new comment
      setTask(prevTask => {
        if (!prevTask) return null

        return {
          ...prevTask,
          comments: [...prevTask.comments, comment]
        }
      })

      setNewComment('')
    } catch (err) {
      console.error('Failed to add comment:', err)
      setError('Failed to add comment. Please try again later.')
    } finally {
      setSubmittingComment(false)
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!task) return

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await taskService.deleteComment(id, commentId)

        // Update local state by removing deleted comment
        setTask(prevTask => {
          if (!prevTask) return null

          return {
            ...prevTask,
            comments: prevTask.comments.filter(c => c.id !== commentId)
          }
        })
      } catch (err) {
        console.error('Failed to delete comment:', err)
        setError('Failed to delete comment. Please try again later.')
      }
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  // Upload attachment
  const handleUploadAttachment = async () => {
    if (!file || !task) return

    try {
      setUploading(true)
      const attachment = await taskService.uploadAttachment(id, file)

      // Update local state with new attachment
      setTask(prevTask => {
        if (!prevTask) return null

        return {
          ...prevTask,
          attachments: [...prevTask.attachments, attachment]
        }
      })

      // Reset file input
      setFile(null)
    } catch (err) {
      console.error('Failed to upload attachment:', err)
      setError('Failed to upload attachment. Please try again later.')
    } finally {
      setUploading(false)
    }
  }

  // Delete attachment
  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!task) return

    if (window.confirm('Are you sure you want to delete this attachment?')) {
      try {
        await taskService.deleteAttachment(id, attachmentId)

        // Update local state by removing deleted attachment
        setTask(prevTask => {
          if (!prevTask) return null

          return {
            ...prevTask,
            attachments: prevTask.attachments.filter(a => a.id !== attachmentId)
          }
        })
      } catch (err) {
        console.error('Failed to delete attachment:', err)
        setError('Failed to delete attachment. Please try again later.')
      }
    }
  }

  // Download attachment
  const handleDownloadAttachment = (attachmentId: string) => {
    if (!task) return
    taskService.downloadAttachment(id, attachmentId)
  }

  // 添加任务分配处理函数
  const handleAssignTask = async () => {
    // 这里应该打开一个对话框让用户选择分配给谁
    // 为简化示例，我们只实现功能框架
    try {
      if (window.confirm('Would you like to assign this task to yourself or another user?')) {
        // 这里应该显示用户选择对话框
        // 为简化示例，我们直接使用当前用户ID
        const currentUserId = "current-user-id" // 这应该从用户认证状态中获取

        // 调用分配任务的API
        await taskService.assignTask(id, currentUserId)

        // 重新获取任务详情以获取更新后的完整信息
        const refreshedTask = await taskService.getTask(id)

        // 更新本地状态
        setTask(refreshedTask)
      }
    } catch (err) {
      console.error('Failed to assign task:', err)
      setError('Failed to assign task. Please try again later.')
    }
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

  const createdAt = new Date(task.created_at)
  const updatedAt = new Date(task.updated_at)

  const statusColors = {
    [TaskStatus.TODO]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    [TaskStatus.REVIEW]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    [TaskStatus.DONE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    [TaskStatus.ARCHIVED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/agents/tasks')}
            className="mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>

          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>

          <div className="flex flex-wrap gap-2 mt-2">
            <TaskStatusBadge status={task.status} />
            {task.parent && (
              <Badge variant="outline" className="gap-1">
                <ChevronUpIcon className="h-3 w-3" />
                <Link href={`/agents/tasks/${task.parent.id}`} className="hover:underline">
                  Parent: {task.parent.title}
                </Link>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditTask}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDeleteTask}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Task Details with Information and Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              {task.description ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No description provided
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <h3 className="font-medium mb-2">Status</h3>
              <div className="mt-1">
                <Badge className={statusColors[task.status]}>
                  {task.status}
                </Badge>
              </div>
            </div>

            {/* Display task attachments */}
            <div>
              <h3 className="font-medium mb-2">Attachments</h3>
              {task.attachments.length === 0 ? (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  <FileIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No attachments yet</p>
                  <p className="text-xs mt-1">Upload files to share with the team working on this task</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {task.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-2 rounded border dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{attachment.file_name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(attachment.file_size / 1024).toFixed(1)} KB • Uploaded by {attachment.user_id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadAttachment(attachment.id)}
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Attachment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Attachment</DialogTitle>
                      <DialogDescription>
                        Upload a file to attach to this task
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <input
                        type="file"
                        className="w-full"
                        onChange={handleFileChange}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleUploadAttachment}
                        disabled={!file || uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Separator />

            {/* Task Information (moved from sidebar) */}
            <div>
              <h3 className="font-medium mb-4">Task Information</h3>

              <div className="space-y-4">
                {/* Assignee Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignee</h4>
                  {!task.assigned_to ? (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Not assigned
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {task.assigned_to_user?.first_name?.substring(0, 2).toUpperCase() ||
                              task.assigned_to_user?.last_name?.substring(0, 2).toUpperCase() ||
                              task.assigned_to.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                          <AvatarImage src={`/api/avatars/${task.assigned_to}`} />
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {task.assigned_to_user ?
                              `${task.assigned_to_user.first_name || ''} ${task.assigned_to_user.last_name || ''}`.trim() ||
                              task.assigned_to_user.email :
                              "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {task.assigned_to_user?.email || "ID: " + task.assigned_to}
                          </p>
                          {task.assigned_at && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Assigned {formatDistanceToNow(new Date(task.assigned_at), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    {!task.assigned_to ? (
                      <Button variant="outline" size="sm" onClick={handleAssignTask}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Assign User
                      </Button>
                    ) : (
                      null
                    )}
                  </div>
                </div>

                <Separator />

                {/* Other Task Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Created</span>
                    <p className="text-sm">
                      {format(createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Last Updated</span>
                    <p className="text-sm">
                      {formatDistanceToNow(updatedAt, { addSuffix: true })}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Created By</span>
                    <p className="text-sm">
                      {task.owner ?
                        `${task.owner.first_name || ''} ${task.owner.last_name || ''}`.trim() ||
                        task.owner.email :
                        `ID: ${task.created_by.substring(0, 8)}...`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subtasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Subtasks</CardTitle>
            <Button onClick={() => router.push(`/agents/tasks/create?parent=${task.id}`)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Subtask
            </Button>
          </CardHeader>
          <CardContent>
            {(!task.subtasks || task.subtasks.length === 0) ? (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No subtasks yet</p>
                <p className="text-xs mt-1">Break down complex tasks into smaller subtasks for better management</p>
              </div>
            ) : (
              <div>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="p-3 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/agents/tasks/${subtask.id}`}
                          className="font-medium hover:underline"
                        >
                          {subtask.title}
                        </Link>
                        <TaskStatusBadge status={subtask.status} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtasks Progress Summary */}
                <div className="mt-4 space-y-1">
                  <Progress
                    value={
                      task.subtasks.length > 0
                        ? task.subtasks.filter(t => t.status === TaskStatus.DONE).length / task.subtasks.length * 100
                        : 0
                    }
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>Completed: {task.subtasks.filter(t => t.status === TaskStatus.DONE).length}</span>
                    <span>Total: {task.subtasks.length}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>
              Discuss this task with your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {task.comments.length === 0 ? (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                  <MessageSquareIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No comments yet. Be the first to comment!</p>
                  <p className="text-xs mt-1">Comments help track progress and discussions about this task.</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto pr-4">
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {comment.user_id.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{comment.user_id}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-line">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-0">
            <div className="w-full space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submittingComment}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 