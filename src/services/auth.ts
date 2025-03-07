import { API_BASE_URL, REQUEST_TIMEOUT } from '@/config';

// API响应错误
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

// 认证相关的API响应类型
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * 处理API响应并解析错误
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json();
  }

  // 处理错误响应
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    // 如果无法解析为JSON，使用状态文本
    throw new ApiError(
      response.statusText || '请求失败',
      'request_failed',
    );
  }

  // 构建标准化错误对象
  const message = errorData.detail || errorData.message || '请求失败';
  const code = errorData.code || `http_${response.status}`;
  const details = errorData.errors || errorData.details;

  throw new ApiError(message, code, details);
}

/**
 * 带超时的fetch函数
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
      throw new ApiError('请求超时', 'request_timeout');
    }
    
    if (error instanceof Error) {
      // 处理网络错误
      throw new ApiError(error.message || '网络请求失败', 'network_error');
    }
    
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 发送验证码到指定邮箱
 * @param email 邮箱地址
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
    // 处理特定的邮箱验证错误
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 未知错误转换为ApiError
    if (error instanceof Error) {
      throw new ApiError(error.message || '发送验证码失败', 'send_code_failed');
    }
    
    throw new ApiError('发送验证码失败', 'send_code_failed');
  }
}

/**
 * 验证邮箱和验证码
 * @param email 邮箱地址
 * @param code 验证码
 * @returns 包含访问令牌和刷新令牌的响应
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
    // 处理验证码相关错误
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new ApiError(error.message || '验证码验证失败', 'verification_failed');
    }
    
    throw new ApiError('验证码验证失败', 'verification_failed');
  }
}

/**
 * 刷新访问令牌
 * @param refreshToken 刷新令牌
 * @returns 包含新访问令牌的响应
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
      throw new ApiError(error.message || '刷新令牌失败', 'token_refresh_failed');
    }
    
    throw new ApiError('刷新令牌失败', 'token_refresh_failed');
  }
}

/**
 * 登出
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
    
    // 清除本地存储的令牌
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Logout failed:', error);
    // 即使API调用失败，也清除本地令牌
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // 此处不抛出错误，确保用户始终能登出
  }
} 