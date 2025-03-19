'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import TaskPriorityBadge from '../components/TaskPriorityBadge'
import { formatDistanceToNow, format } from 'date-fns'

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

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

  // Handle edit task
  const handleEditTask = () => {
    router.push(`/agents/tasks/${taskId}/edit`)
  }

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!task) return

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task.id)
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
      const comment = await taskService.addComment(task.id, newComment)

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
        await taskService.deleteComment(task.id, commentId)

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
      const attachment = await taskService.uploadAttachment(task.id, file)

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
        await taskService.deleteAttachment(task.id, attachmentId)

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
    taskService.downloadAttachment(task.id, attachmentId)
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
  const dueDate = task.due_date ? new Date(task.due_date) : null

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
            <TaskPriorityBadge priority={task.priority} />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div>
                <h3 className="font-medium mb-2">Progress</h3>
                <div className="mb-1 text-sm flex justify-between">
                  <span>Completion</span>
                  <span>{task.completion_percentage}%</span>
                </div>
                <Progress value={task.completion_percentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Estimated Hours</h3>
                  <p className="text-sm flex items-center gap-1">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    {task.estimated_hours !== null ? task.estimated_hours : 'Not set'}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Hours Spent</h3>
                  <p className="text-sm flex items-center gap-1">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    {task.spent_hours !== null ? task.spent_hours : 'Not set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Comments, Attachments, Subtasks */}
          <Tabs defaultValue="comments">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comments" className="flex gap-1">
                <MessageSquareIcon className="h-4 w-4" />
                Comments ({task.comments.length})
              </TabsTrigger>
              <TabsTrigger value="attachments" className="flex gap-1">
                <FileIcon className="h-4 w-4" />
                Attachments ({task.attachments.length})
              </TabsTrigger>
              <TabsTrigger value="subtasks" className="flex gap-1">
                <UsersIcon className="h-4 w-4" />
                Subtasks ({task.subtasks.length})
              </TabsTrigger>
            </TabsList>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
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
                      <ScrollArea className="h-[300px] pr-4">
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
                      </ScrollArea>
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
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>
                    Files and documents for this task
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {task.attachments.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
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
                </CardContent>
                <CardFooter>
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
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Subtasks Tab */}
            <TabsContent value="subtasks" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Subtasks</CardTitle>
                  <CardDescription>
                    Child tasks under this parent task
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {task.subtasks.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                      <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No subtasks yet</p>
                      <p className="text-xs mt-1">Break down complex tasks into smaller subtasks for better management</p>
                    </div>
                  ) : (
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
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <TaskPriorityBadge priority={subtask.priority} />
                              <span>Progress: {subtask.completion_percentage}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => router.push(`/agents/tasks/create?parent=${task.id}`)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Subtask
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Task Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignees</h3>
                {task.assignees.length === 0 ? (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No assignees yet
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.assignees.map((assignee) => (
                      <Avatar key={assignee.id}>
                        <AvatarFallback>
                          {assignee.user_id.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                        <AvatarImage src={`/api/avatars/${assignee.user_id}`} />
                      </Avatar>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Assign User
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Due Date</span>
                  <span className="text-sm flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Not set'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm">
                    {format(createdAt, 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm">
                    {formatDistanceToNow(updatedAt, { addSuffix: true })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Created By</span>
                  <span className="text-sm">
                    {task.created_by.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Tasks Card */}
          {task.subtasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Subtasks Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Subtasks: {task.subtasks.length}</p>
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 