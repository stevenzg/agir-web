import { API_BASE_URL, REQUEST_TIMEOUT } from '@/config';
import { ApiError } from './auth';

export interface UserCreateRequest {
  first_name: string;
  last_name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
  last_login_at?: string;
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
 * Handle API response and parse errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json();
  }

  // Handle error response
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    // If unable to parse as JSON, use status text
    throw new ApiError(
      response.statusText || 'Request failed',
      'request_failed',
    );
  }

  // Build standardized error object
  const message = errorData.detail || errorData.message || 'Request failed';
  const code = errorData.code || `http_${response.status}`;
  const details = errorData.errors || errorData.details;

  throw new ApiError(message, code, details);
}

/**
 * Create a new user (human agent)
 * @param userData User data including first_name and last_name
 * @returns The created user
 */
export async function createUser(userData: UserCreateRequest): Promise<User> {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    throw new ApiError('Not authenticated', 'not_authenticated');
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return await handleResponse<User>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new ApiError(error.message || 'Failed to create user', 'create_user_failed');
    }
    
    throw new ApiError('Failed to create user', 'create_user_failed');
  }
}

/**
 * Get all users (human agents)
 * @returns List of users
 */
export async function getUsers(): Promise<User[]> {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    throw new ApiError('Not authenticated', 'not_authenticated');
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<User[]>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new ApiError(error.message || 'Failed to fetch users', 'fetch_users_failed');
    }
    
    throw new ApiError('Failed to fetch users', 'fetch_users_failed');
  }
} 