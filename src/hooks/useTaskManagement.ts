import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Task, TaskDetail, TaskStatus } from '@/services/tasks';
import taskService from '@/services/tasks';

// Interface for task count summary
export interface TaskCountSummary {
  todo: number;
  in_progress: number;
  review: number;
  done: number;
  archived: number;
}

// Interface for API request parameters
export interface TasksRequestParams {
  skip?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  user_id?: string;
  parent_id?: string;
}

export interface UseTaskListOptions {
  initialPageSize?: number;
  autoFetch?: boolean;
}

export function useTaskList(options: UseTaskListOptions = {}) {
  const { initialPageSize = 10, autoFetch = true } = options;
  const router = useRouter();
  
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  
  // Task counts
  const [taskCounts, setTaskCounts] = useState<TaskCountSummary>({
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
    archived: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');

  const fetchTasks = useCallback(async (params?: Partial<TasksRequestParams>) => {
    try {
      setLoading(true);
      setError(null);

      const skip = (currentPage - 1) * pageSize;

      const requestParams: TasksRequestParams = {
        skip,
        limit: pageSize,
        ...params
      };
      
      if (search) requestParams.search = search;
      if (statusFilter) requestParams.status = statusFilter;
      if (viewMode === 'mine') requestParams.user_id = 'current';

      const response = await taskService.getTasks(requestParams);
      setTasks(response.items);
      setTotal(response.total);

      try {
        const countsResponse = await taskService.getTaskCounts();
        setTaskCounts(countsResponse);
      } catch (err) {
        console.error('Failed to fetch task counts:', err);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, viewMode]);

  // Auto fetch tasks on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [fetchTasks, autoFetch]);

  // Navigation handlers
  const navigateToTaskDetail = useCallback((taskId: string) => {
    router.push(`/agents/tasks/${taskId}`);
  }, [router]);

  const navigateToTaskEdit = useCallback((taskId: string) => {
    router.push(`/agents/tasks/${taskId}/edit`);
  }, [router]);

  const navigateToTaskCreate = useCallback((parentTaskId?: string) => {
    const url = parentTaskId 
      ? `/agents/tasks/create?parent=${parentTaskId}` 
      : '/agents/tasks/create';
    router.push(url);
  }, [router]);

  // Task operations
  const deleteTask = useCallback(async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        // Update local state
        setTasks(tasks => tasks.filter(task => task.id !== taskId));
        setTotal(prev => prev - 1);
        return true;
      } catch (err) {
        console.error('Failed to delete task:', err);
        setError('Failed to delete task. Please try again later.');
        return false;
      }
    }
    return false;
  }, []);

  // Filter operations
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearch(query);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value as TaskStatus | '');
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const handleViewModeChange = useCallback((value: 'all' | 'mine') => {
    setViewMode(value);
    setCurrentPage(1); // Reset to first page when view mode changes
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setViewMode('all');
    setCurrentPage(1);
  }, []);

  return {
    // State
    tasks,
    total,
    loading,
    error,
    taskCounts,
    currentPage,
    pageSize,
    search,
    statusFilter,
    viewMode,
    
    // Actions
    fetchTasks,
    deleteTask,
    navigateToTaskDetail,
    navigateToTaskEdit,
    navigateToTaskCreate,
    
    // Filter handlers
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
    handleViewModeChange,
    clearFilters,
    
    // Setters
    setTasks,
    setError
  };
}

export interface UseTaskDetailOptions {
  autoFetch?: boolean;
}

export function useTaskDetail(taskId: string, options: UseTaskDetailOptions = {}) {
  const { autoFetch = true } = options;
  const router = useRouter();
  
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTask(taskId);
      setTask(data);
    } catch (err) {
      console.error('Failed to fetch task:', err);
      setError('Failed to load task. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (autoFetch) {
      fetchTask();
    }
  }, [fetchTask, autoFetch]);

  // Navigation
  const navigateToTasksList = useCallback(() => {
    router.push('/agents/tasks');
  }, [router]);

  const navigateToTaskEdit = useCallback(() => {
    router.push(`/agents/tasks/${taskId}/edit`);
  }, [router, taskId]);

  // Task operations
  const deleteTask = useCallback(async () => {
    if (!task) return false;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        router.push('/agents/tasks');
        return true;
      } catch (err) {
        console.error('Failed to delete task:', err);
        setError('Failed to delete task. Please try again later.');
        return false;
      }
    }
    return false;
  }, [task, taskId, router]);

  // Comment operations
  const addComment = useCallback(async (content: string) => {
    if (!content.trim() || !task) return false;

    try {
      setCommentLoading(true);
      const comment = await taskService.addComment(taskId, content);

      // Update local state with new comment
      setTask(prevTask => {
        if (!prevTask) return null;

        return {
          ...prevTask,
          comments: [...prevTask.comments, comment]
        };
      });

      return true;
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to add comment. Please try again later.');
      return false;
    } finally {
      setCommentLoading(false);
    }
  }, [task, taskId]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!task) return false;

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await taskService.deleteComment(taskId, commentId);

        // Update local state by removing deleted comment
        setTask(prevTask => {
          if (!prevTask) return null;

          return {
            ...prevTask,
            comments: prevTask.comments.filter(c => c.id !== commentId)
          };
        });

        return true;
      } catch (err) {
        console.error('Failed to delete comment:', err);
        setError('Failed to delete comment. Please try again later.');
        return false;
      }
    }
    return false;
  }, [task, taskId]);

  // Attachment operations
  const uploadAttachment = useCallback(async (file: File) => {
    if (!file || !task) return false;
    
    try {
      setAttachmentLoading(true);
      const attachment = await taskService.uploadAttachment(taskId, file);
      
      // Update local state with new attachment
      setTask(prevTask => {
        if (!prevTask) return null;
        
        return {
          ...prevTask,
          attachments: [...prevTask.attachments, attachment]
        };
      });
      
      return true;
    } catch (err) {
      console.error('Failed to upload attachment:', err);
      setError('Failed to upload attachment. Please try again later.');
      return false;
    } finally {
      setAttachmentLoading(false);
    }
  }, [task, taskId]);

  const deleteAttachment = useCallback(async (attachmentId: string) => {
    if (!task) return false;

    if (window.confirm('Are you sure you want to delete this attachment?')) {
      try {
        await taskService.deleteAttachment(taskId, attachmentId);

        // Update local state by removing deleted attachment
        setTask(prevTask => {
          if (!prevTask) return null;

          return {
            ...prevTask,
            attachments: prevTask.attachments.filter(a => a.id !== attachmentId)
          };
        });

        return true;
      } catch (err) {
        console.error('Failed to delete attachment:', err);
        setError('Failed to delete attachment. Please try again later.');
        return false;
      }
    }
    return false;
  }, [task, taskId]);

  const downloadAttachment = useCallback((attachmentId: string) => {
    if (!task) return;
    taskService.downloadAttachment(taskId, attachmentId);
  }, [task, taskId]);

  return {
    // State
    task,
    loading,
    error,
    commentLoading,
    attachmentLoading,
    
    // Task operations
    fetchTask,
    deleteTask,
    
    // Navigation
    navigateToTasksList,
    navigateToTaskEdit,
    
    // Comment operations
    addComment,
    deleteComment,
    
    // Attachment operations
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
    
    // Setters
    setTask,
    setError
  };
} 