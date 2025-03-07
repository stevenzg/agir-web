/**
 * API基础URL配置
 * 使用环境变量获取API地址，或者使用默认值
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * 认证相关配置
 */
export const AUTH_CONFIG = {
  // 令牌存储键名
  TOKEN_STORAGE_KEY: 'accessToken',
  REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
  
  // 令牌过期时间（毫秒）
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24小时
};

/**
 * 请求超时设置（毫秒）
 */
export const REQUEST_TIMEOUT = 10000; // 10秒 