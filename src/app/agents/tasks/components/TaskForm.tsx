import React, { useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { InfoIcon } from 'lucide-react'

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

import { TaskDetail, TaskStatus, Task } from '@/services/tasks'
import taskService from '@/services/tasks'

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  parent_id: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TaskFormProps {
  initialData?: TaskDetail | null
  isEditing?: boolean
  parentTaskId?: string
  parentTask?: TaskDetail | null
  onSuccess: (task: Task) => void
  isLoading?: boolean
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

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || TaskStatus.TODO,
    parent_id: initialData?.parent_id || parentTaskId || '',
  }), [initialData, parentTaskId])

  // Setup form with defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Handle form submission
  const onSubmit = useCallback(async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      // Convert null values to undefined to match Task interface
      const submissionData = {
        ...values,
        parent_id: values.parent_id || undefined,
      }

      let task

      if (isEditing && initialData) {
        // Update existing task
        task = await taskService.updateTask(initialData.id, submissionData)
      } else {
        // Create new task
        task = await taskService.createTask(submissionData)
      }

      onSuccess(task)
    } catch (error) {
      console.error('Error submitting task:', error)
      setSubmitError('Failed to save task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [isEditing, initialData, onSuccess])

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
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
                control={form.control}
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

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="transition-all duration-200 hover:scale-105"
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default React.memo(TaskForm) 