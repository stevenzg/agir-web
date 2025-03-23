import axios from 'axios'
import { API_BASE_URL } from '@/config'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器，添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 处理错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 可以在这里处理身份验证错误
          break
        case 403:
          // 权限错误
          break
        case 500:
          // 服务器错误
          break
      }
    }
    return Promise.reject(error)
  }
) 