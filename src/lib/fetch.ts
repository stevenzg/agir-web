import { AUTH_CONFIG } from '@/config';

/**
 * Fetch with authentication
 * 
 * This utility wraps the native fetch API and automatically adds
 * the authentication token from localStorage to the request headers.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem(AUTH_CONFIG.TOKEN_STORAGE_KEY) 
    : null;
  
  const headers = new Headers(options.headers || {});
  
  // Add auth header if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Always set content type if not provided and not a GET request
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET' && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Handle unauthorized responses (token expired or invalid)
  if (response.status === 401 && token) {
    // Remove the invalid token
    localStorage.removeItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
    
    // Redirect to login page if configured
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  
  return response;
}

/**
 * Fetch without authentication
 * 
 * This utility is for public endpoints that don't require authentication
 */
export async function fetchWithoutAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  
  // Always set content type if not provided and not a GET request
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET' && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  return response;
} 