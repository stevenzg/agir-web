import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取认证令牌 (从cookie中)
  const authToken = request.cookies.get('auth-token')?.value
  
  // 定义需要受保护的路径
  const protectedPaths = ['/create', '/customize-face', '/agent-profile', '/settings']
  const path = request.nextUrl.pathname
  
  // 检查当前路径是否需要保护
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  )
  
  // 如果是受保护的路径且没有认证令牌，重定向到登录页
  if (isProtectedPath && !authToken) {
    const loginUrl = new URL('/login', request.url)
    // 添加原来的URL作为参数，登录后可以重定向回来
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

// 配置哪些路径需要经过middleware处理
export const config = {
  matcher: [
    '/create',
    '/customize-face',
    '/agent-profile',
    '/settings',
    '/profile/:path*',
  ],
} 