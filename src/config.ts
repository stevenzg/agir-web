/**
 * API Base URL Configuration
 * Uses environment variable to get API address, or falls back to default value
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Authentication related configuration
 */
export const AUTH_CONFIG = {
  // Token storage key names
  TOKEN_STORAGE_KEY: 'accessToken',
  REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
  
  // Token expiry time (milliseconds)
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Request timeout setting (milliseconds)
 */
export const REQUEST_TIMEOUT = 10000; // 10 seconds 