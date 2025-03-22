import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { InfoIcon, SearchIcon, XIcon, PaperclipIcon, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'

import { TaskDetail, TaskStatus, Task } from '@/services/tasks'
import taskService from '@/services/tasks'
import { searchUsers, User } from '@/services/users'
import { uploadFile, FileUploadResponse } from '@/services/files'

// 定义两种不同状态的表单值类型
type EditFormValues = {
  title: string
  description?: string
  status: TaskStatus
  parent_id?: string
}

type CreateFormValues = {
  title: string
  description?: string
  parent_id?: string
  user_email?: string
  assigned_to?: string
}

interface TaskFormProps {
  initialData?: TaskDetail | null
  isEditing?: boolean
  parentTaskId?: string
  parentTask?: TaskDetail | null
  onSuccess: (task: Task) => void
  isLoading?: boolean
}

// 简单的防抖函数
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const TaskForm = ({
  initialData,
  isEditing = false,
  parentTaskId,
  parentTask,
  onSuccess,
  isLoading = false
}: TaskFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploadingAttachments, setUploadingAttachments] = useState(false)

  // 应用防抖到搜索查询
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Handle searching for users by email
  const handleUserSearch = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      // 清空上次的搜索结果，避免错误
      setSearchResults([])
      setSubmitError(null) // 清除之前的错误信息

      let users = await searchUsers(query)

      // 确保返回结果是数组
      if (!users) {
        users = []
      }

      // 确保只处理有效数据
      if (Array.isArray(users)) {
        setSearchResults(users)
      } else {
        // 如果结果不是数组但有数据（可能是单个对象），尝试转换
        if (users && typeof users === 'object') {
          try {
            setSearchResults([users as User])
          } catch (e) {
            console.error('Failed to convert single user object to array:', e)
            setSearchResults([])
          }
        } else {
          setSearchResults([])
        }

        // 如果API返回了结果但格式不符合预期
        console.warn('User search returned unexpected data format:', users)
      }
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResults([])
      setSubmitError('Failed to search users. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }, [])

  // 当防抖查询变化时执行搜索
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 3) {
      handleUserSearch(debouncedSearchQuery)
    } else if (debouncedSearchQuery === '') {
      setSearchResults([])
    }
  }, [debouncedSearchQuery, handleUserSearch])

  // 定义不同状态的表单验证模式
  const editSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus),
    parent_id: z.string().optional(),
  })

  const createSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    parent_id: z.string().optional(),
    user_email: z.string().optional().refine(val => {
      // Allow empty/undefined values or valid emails
      return !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    }, { message: 'Please enter a valid email or leave empty' }),
    assigned_to: z.string().optional(),
  })

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || TaskStatus.TODO,
    parent_id: initialData?.parent_id || parentTaskId || '',
    user_email: '',
    assigned_to: initialData?.assigned_to || '',
  }), [initialData, parentTaskId])

  // 使用两个单独的表单实例，避免条件类型带来的复杂性
  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: defaultValues.title,
      description: defaultValues.description,
      status: defaultValues.status,
      parent_id: defaultValues.parent_id,
    },
  })

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: defaultValues.title,
      description: defaultValues.description,
      parent_id: defaultValues.parent_id,
      user_email: defaultValues.user_email,
      assigned_to: defaultValues.assigned_to,
    },
  })

  // Handle selecting a user from search results
  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user)
    createForm.setValue('user_email', user.email)
    createForm.setValue('assigned_to', user.id)
    setSearchOpen(false)
  }, [createForm])

  // Handle clearing selected user
  const handleClearUser = useCallback(() => {
    setSelectedUser(null)
    createForm.setValue('user_email', '')
    createForm.setValue('assigned_to', '')
  }, [createForm])

  // Handle file selection for attachments
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setAttachments(prev => [...prev, ...newFiles])
    }
  }, [])

  // Handle removing a file from attachments
  const handleRemoveFile = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Upload all attachments to Azure
  const uploadAttachments = async (): Promise<FileUploadResponse[]> => {
    if (!attachments.length) return []

    setUploadingAttachments(true)
    const uploadResponses: FileUploadResponse[] = []

    try {
      for (const file of attachments) {
        const response = await uploadFile(file, 'task-attachments')
        uploadResponses.push(response)
      }
      return uploadResponses
    } catch (error) {
      console.error('Error uploading attachments:', error)
      throw error
    } finally {
      setUploadingAttachments(false)
    }
  }

  // Handle form submission for Edit mode
  const onEditSubmit = async (values: EditFormValues) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      // Upload attachments first if there are any
      let fileUploadResponses: FileUploadResponse[] = []
      if (attachments.length > 0) {
        try {
          fileUploadResponses = await uploadAttachments()
        } catch {
          // Error is already logged in uploadAttachments
          setSubmitError('Failed to upload attachments. Please try again.')
          return
        }
      }

      // Build task submission data
      const submissionData: Partial<Task> = {
        title: values.title,
        description: values.description,
        parent_id: values.parent_id || undefined,
        status: values.status
      }

      // We'll let the backend handle converting the file paths
      if (initialData) {
        // Get the task data without the attachments first
        const dataToUpdate = { ...submissionData }
        // Then add attachments if needed
        if (fileUploadResponses.length > 0) {
          // @ts-expect-error - we know this is safe because backend handles conversion
          dataToUpdate.attachments = fileUploadResponses
        }

        // Update existing task
        const task = await taskService.updateTask(initialData.id, dataToUpdate)
        onSuccess(task)
      }
    } catch (error) {
      console.error('Error submitting task:', error)
      setSubmitError('Failed to save task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission for Create mode
  const onCreateSubmit = async (values: CreateFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const uploadResponses = await uploadAttachments()

      // 更新字段名称
      const taskData = {
        title: values.title,
        description: values.description || '',
        parent_id: values.parent_id || undefined,
        assigned_to: values.assigned_to || undefined,
        attachments: uploadResponses.length > 0 ? uploadResponses : undefined
      }

      const task = await taskService.createTask(taskData)
      onSuccess(task)
    } catch (err) {
      console.error('Failed to create task:', err)
      setSubmitError('Failed to create task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 根据模式渲染不同的表单
  const renderForm = () => {
    if (isEditing) {
      return (
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
            <FormField
              control={editForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
                      {...field}
                      className="transition-all duration-200 focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="min-h-[120px] transition-all duration-200 focus:ring-2"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={TaskStatus.REVIEW}>In Review</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                        <SelectItem value={TaskStatus.ARCHIVED}>Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Attachments section */}
            {renderAttachments()}

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || uploadingAttachments}
                className="transition-all duration-200 hover:scale-105"
              >
                {(isSubmitting || uploadingAttachments) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploadingAttachments ? 'Uploading...' : 'Saving...'}
                  </>
                ) : 'Update Task'}
              </Button>
            </div>
          </form>
        </Form>
      )
    } else {
      return (
        <Form {...createForm}>
          <form
            onSubmit={(e) => {
              // Prevent default form submission
              e.preventDefault()

              // Ensure empty email doesn't trigger validation
              if (!selectedUser) {
                createForm.setValue('user_email', undefined)
                createForm.setValue('assigned_to', undefined)
              }

              // Then submit the form
              createForm.handleSubmit(onCreateSubmit)(e)
            }}
            className="space-y-6"
          >
            <FormField
              control={createForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
                      {...field}
                      className="transition-all duration-200 focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="min-h-[120px] transition-all duration-200 focus:ring-2"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={createForm.control}
                name="user_email"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Assign To (Optional)</FormLabel>
                    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <div>
                            {selectedUser ? (
                              <div className="flex items-center justify-between border rounded-md p-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                      {selectedUser.first_name && selectedUser.first_name[0] || ''}
                                      {selectedUser.last_name && selectedUser.last_name[0] || ''}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span>{selectedUser.email}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {selectedUser.first_name} {selectedUser.last_name}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleClearUser()
                                  }}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="flex items-center justify-between border rounded-md p-2 text-muted-foreground cursor-pointer"
                                onClick={() => setSearchOpen(true)}
                              >
                                <span>Search by email...</span>
                                <SearchIcon className="h-4 w-4 opacity-50" />
                              </div>
                            )}
                            <input
                              type="hidden"
                              {...field}
                              value={field.value || ''}
                            />
                          </div>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <div className="flex items-center gap-2 border-b px-3 h-10">
                            <SearchIcon className="h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                              placeholder="Search users..."
                              value={searchQuery || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                setSearchQuery(value)
                              }}
                            />
                          </div>
                          {isSearching && (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          )}
                          <CommandEmpty>No users found</CommandEmpty>
                          <CommandGroup>
                            {Array.isArray(searchResults) && searchResults.length > 0 ? (
                              searchResults
                                .filter(user => user && typeof user === 'object')
                                .map((user) => {
                                  return (
                                    <CommandItem
                                      key={user?.id || Math.random().toString()}
                                      onSelect={() => user && handleSelectUser(user)}
                                      className="flex items-center gap-2"
                                    >
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback>
                                          {user?.first_name && user?.first_name[0] || ''}
                                          {user?.last_name && user?.last_name[0] || ''}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col">
                                        <span>{user?.email || ''}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {user?.first_name || ''} {user?.last_name || ''}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  )
                                })
                            ) : (
                              searchQuery && searchQuery.length >= 3 && !isSearching && (
                                <div className="p-2 text-center text-sm text-muted-foreground">
                                  No users found
                                </div>
                              )
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Attachments section */}
            {renderAttachments()}

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || uploadingAttachments}
                className="transition-all duration-200 hover:scale-105"
              >
                {(isSubmitting || uploadingAttachments) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploadingAttachments ? 'Uploading...' : 'Saving...'}
                  </>
                ) : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
      )
    }
  }

  // 渲染附件部分
  const renderAttachments = () => {
    return (
      <div className="space-y-2">
        <FormLabel>Attachments</FormLabel>
        <div className="flex flex-col gap-2">
          {/* File list */}
          {attachments.length > 0 && (
            <div className="space-y-2 mb-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <PaperclipIcon className="h-4 w-4 opacity-50" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(file.size / 1024)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            multiple
          />

          {/* Upload button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon className="h-4 w-4 mr-2" />
            Attach Files
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="pt-6">
        {submitError && (
          <Alert variant="destructive" className="mb-4 animate-fadeIn">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {parentTask && (
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Creating a Subtask</AlertTitle>
            <AlertDescription>
              You are creating a subtask for <span className="font-medium">{parentTask.title}</span>
            </AlertDescription>
          </Alert>
        )}

        {renderForm()}
      </CardContent>
    </Card>
  )
}

export default React.memo(TaskForm) 