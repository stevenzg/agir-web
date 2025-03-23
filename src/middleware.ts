import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_CONFIG } from './config'

export function middleware(request: NextRequest) {
  // Get authentication token from cookie
  const token = request.cookies.get(AUTH_CONFIG.TOKEN_STORAGE_KEY)?.value
  
  // If no token in cookie, try to get from request header
  const authHeader = request.headers.get('Authorization')
  const tokenFromHeader = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null
  
  // Use token from cookie or header
  const hasValidToken = Boolean(token || tokenFromHeader)
  
  const path = request.nextUrl.pathname
  
  // Define protected paths
  const protectedPaths = [
    '/agents',
    '/edit-agent',
    '/customize-face',
    '/agent-profile',
    '/settings',
    '/feedback',
    '/dashboard'
  ]
  
  // Check if current path needs protection
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  )
  
  // If it's a protected path but no authentication token, redirect to homepage
  if (isProtectedPath && !hasValidToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// Configure paths where middleware applies
export const config = {
  matcher: [
    // Paths that need protection
    '/agents/:path*',
    '/edit-agent/:path*',
    '/customize-face/:path*',
    '/agent-profile/:path*',
    '/settings/:path*',
    '/feedback/:path*',
    '/dashboard/:path*',
  ],
} 