import axios from 'axios'
import { API_BASE_URL } from '@/config'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor, add token
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle authentication errors here
          break
        case 403:
          // Permission error
          break
        case 500:
          // Server error
          break
      }
    }
    return Promise.reject(error)
  }
) 