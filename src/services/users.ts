import { API_BASE_URL, REQUEST_TIMEOUT } from '@/config';
import { ApiError } from './auth';
import { api } from './api'

export interface UserCreateRequest {
  first_name: string;
  last_name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  created_by?: string;
  last_login_at: string | null;
  llm_model: string | null;
  embedding_model: string | null;
}

export interface UserCreateData {
  first_name: string;
  last_name: string;
  llm_model?: string;
  embedding_model?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  value: string;
  category: 'llm' | 'embedding';
  provider: string;
}

export interface ModelsResponse {
  llm_models: ModelInfo[];
  embedding_models: ModelInfo[];
}

/**
 * Fetch function with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);
  
  try {
    return await fetch(url, {
      ...options,
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 'request_timeout');
    }
    
    if (error instanceof Error) {
      // Handle network errors
      throw new ApiError(error.message || 'Network request failed', 'network_error');
    }
    
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Create a new user (human agent)
 * @param userData User data including first_name and last_name
 * @returns The created user
 */
export async function createUser(userData: UserCreateData): Promise<User> {
  const response = await api.post('/users', userData)
  return response.data
}

/**
 * Get all users (human agents)
 * @returns List of users
 */
export async function getUsers(): Promise<User[]> {
  const response = await api.get('/users')
  return response.data
}

/**
 * Search users by email or name
 * @param query The search query (email or name)
 * @returns List of matching users
 */
export async function searchUsers(query: string): Promise<User[]> {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    return [];
  }

  try {
    const url = new URL(`${API_BASE_URL}/users/`);
    url.searchParams.append('search', query);
    
    const response = await fetchWithTimeout(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error searching users:', response.statusText);
      return [];
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Error parsing user search response:', error);
      return [];
    }
    
    // Ensure the returned data is in array format
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data !== null) return [data]; 
    
    return [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function getModels(): Promise<ModelsResponse> {
  const response = await api.get('/models')
  return response.data
}

export async function getUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export async function updateUser(id: string, userData: Partial<UserCreateData>): Promise<User> {
  const response = await api.put(`/users/${id}`, userData)
  return response.data
} 