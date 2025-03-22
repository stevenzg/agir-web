import { fetchWithAuth } from '@/lib/fetch';
import { API_BASE_URL } from '@/config';
import { FileUploadResponse } from './files';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  created_by: string;
  parent_id?: string;
  parent?: Task;
  subtasks?: Task[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  assigned_to?: string;
  assigned_by?: string;
  assigned_at?: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  user: User;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  user_id: string;
  file_name: string;
  /**
   * The URL to the file attachment
   * IMPORTANT: This URL should never be accessed directly in the frontend.
   * Always use the /tasks/{taskId}/attachments/{attachmentId}/download endpoint
   * to get a secure, authenticated URL with proper access control.
   */
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  user: User;
}

export interface TaskParent {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface TaskSubtask {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface TaskDetail extends Task {
  owner: User;
  parent?: TaskDetail;
  subtasks?: TaskDetail[];
  assigned_to_user?: User;
  assigned_by_user?: User;
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  parent_id?: string;
  assigned_to?: string;
  attachments?: FileUploadResponse[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  parent_id?: string;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  parent_id?: string;
  created_by?: string;
  assigned_to?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export interface TasksResponse {
  items: Task[];
  total: number;
}

const API_URL = `${API_BASE_URL}/tasks`;

const taskService = {
  getTasks: async (params: { 
    skip?: number;
    limit?: number;
    search?: string;
    status?: TaskStatus;
    user_id?: string;
    parent_id?: string;
  }): Promise<TasksResponse> => {
    const queryParams = new URLSearchParams();
    
    // Add params to query string if they exist
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.parent_id) queryParams.append('parent_id', params.parent_id);
    
    const url = `${API_URL}?${queryParams.toString()}`;
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return await response.json();
  },
  
  getTask: async (id: string): Promise<TaskDetail> => {
    const response = await fetchWithAuth(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    
    return await response.json();
  },
  
  createTask: async (data: TaskCreate): Promise<Task> => {
    const response = await fetchWithAuth(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    
    return await response.json();
  },
  
  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    return await response.json();
  },
  
  deleteTask: async (id: string): Promise<void> => {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  },
  
  // Comments
  addComment: async (taskId: string, content: string): Promise<TaskComment> => {
    const response = await fetchWithAuth(`${API_URL}/${taskId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    
    return await response.json();
  },
  
  deleteComment: async (taskId: string, commentId: string): Promise<void> => {
    const response = await fetchWithAuth(`${API_URL}/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  },
  
  // Attachments
  uploadAttachment: async (taskId: string, file: File): Promise<TaskAttachment> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetchWithAuth(`${API_URL}/${taskId}/attachments`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload attachment');
    }
    
    return await response.json();
  },
  
  deleteAttachment: async (taskId: string, attachmentId: string): Promise<void> => {
    const response = await fetchWithAuth(`${API_URL}/${taskId}/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete attachment');
    }
  },
  
  downloadAttachment: (taskId: string, attachmentId: string): void => {
    window.open(`${API_URL}/${taskId}/attachments/${attachmentId}/download`, '_blank');
  },
  
  // Task assignment
  assignTask: async (taskId: string, userId: string): Promise<Task> => {
    const response = await fetchWithAuth(`${API_URL}/${taskId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to assign task');
    }
    
    return await response.json();
  },
  
  unassignTask: async (taskId: string): Promise<Task> => {
    const response = await fetchWithAuth(`${API_URL}/${taskId}/unassign`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to unassign task');
    }
    
    return await response.json();
  },
  
  // Task Counts
  getTaskCounts: async (): Promise<{
    todo: number;
    in_progress: number;
    review: number;
    done: number;
    archived: number;
  }> => {
    const response = await fetchWithAuth(`${API_URL}/counts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch task counts');
    }
    
    return await response.json();
  },
};

export default taskService; 