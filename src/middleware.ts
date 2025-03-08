import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_CONFIG } from './config'

export function middleware(request: NextRequest) {
  // 从cookie中获取认证令牌
  const token = request.cookies.get(AUTH_CONFIG.TOKEN_STORAGE_KEY)?.value
  
  // 如果没有从cookie获取到token，尝试从请求头获取
  const authHeader = request.headers.get('Authorization')
  const tokenFromHeader = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null
  
  // 使用cookie或头部中的token
  const hasValidToken = Boolean(token || tokenFromHeader)
  
  // 定义需要保护的路径
  const protectedPaths = ['/create', '/edit-agent', '/customize-face', '/agent-profile', '/settings']
  const path = request.nextUrl.pathname
  
  // 检查当前路径是否需要保护
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  )
  
  // 如果是受保护的路径但没有认证令牌，重定向到登录页
  if (isProtectedPath && !hasValidToken) {
    // 创建登录URL，使用完整URL确保协议和主机名正确
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', path)
    
    // 使用NextResponse.redirect并传入完整URL
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// 配置中间件应用的路径
export const config = {
  matcher: [
    // 需要保护的路径
    '/create',
    '/edit-agent',
    '/customize-face',
    '/agent-profile',
    '/settings',
    '/dashboard/:path*',
  ],
} 