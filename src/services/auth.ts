import { API_BASE_URL, REQUEST_TIMEOUT } from '@/config';

// API response error
export class ApiError extends Error {
  code: string;
  details?: Record<string, string[]>;

  constructor(message: string, code: string, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Authentication related API response types
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
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
 * Send verification code to the specified email
 * @param email Email address
 */
export async function sendVerificationCode(email: string): Promise<void> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    await handleResponse<void>(response);
  } catch (error) {
    // Handle specific email verification errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Convert unknown errors to ApiError
    if (error instanceof Error) {
      throw new ApiError(error.message || 'Failed to send verification code', 'send_code_failed');
    }
    
    throw new ApiError('Failed to send verification code', 'send_code_failed');
  }
}

/**
 * Verify email and verification code
 * @param email Email address
 * @param code Verification code
 * @returns Response containing access token and refresh token
 */
export async function verifyEmail(email: string, code: string): Promise<TokenResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    return await handleResponse<TokenResponse>(response);
  } catch (error) {
    // Handle verification code related errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new ApiError(error.message || 'Verification code validation failed', 'verification_failed');
    }
    
    throw new ApiError('Verification code validation failed', 'verification_failed');
  }
}

/**
 * Refresh access token
 * @param refreshToken Refresh token
 * @returns Response containing new access token
 */
export async function refreshToken(refreshToken: string): Promise<{ access_token: string; token_type: string }> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    return await handleResponse<{ access_token: string; token_type: string }>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new ApiError(error.message || 'Failed to refresh token', 'token_refresh_failed');
    }
    
    throw new ApiError('Failed to refresh token', 'token_refresh_failed');
  }
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    return;
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    await handleResponse<void>(response);
    
    // Clear tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Logout failed:', error);
    // Clear local tokens even if API call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Don't throw error here to ensure user can always logout
  }
}

/**
 * Get the current access token, refreshing it if necessary
 */
export function getToken(): string | null {
  return localStorage.getItem('accessToken')
} 