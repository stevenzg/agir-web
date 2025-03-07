import { API_BASE_URL } from '@/config';

// 认证相关的API响应类型
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * 发送验证码到指定邮箱
 * @param email 邮箱地址
 */
export async function sendVerificationCode(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '发送验证码失败');
  }
}

/**
 * 验证邮箱和验证码
 * @param email 邮箱地址
 * @param code 验证码
 * @returns 包含访问令牌和刷新令牌的响应
 */
export async function verifyEmail(email: string, code: string): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '验证码验证失败');
  }

  return response.json();
}

/**
 * 刷新访问令牌
 * @param refreshToken 刷新令牌
 * @returns 包含新访问令牌的响应
 */
export async function refreshToken(refreshToken: string): Promise<{ access_token: string; token_type: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '刷新令牌失败');
  }

  return response.json();
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
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // 清除本地存储的令牌
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  } catch (error) {
    console.error('Logout failed:', error);
    // 即使API调用失败，也清除本地令牌
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
} 