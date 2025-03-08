'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/components/UserMenu'

interface AgentsLayoutProps {
  children: React.ReactNode
}

export default function AgentsLayout({ children }: AgentsLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 监听窗口大小变化，更新是否为移动设备
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px是常用的移动设备断点
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // 在移动设备上打开菜单时禁止背景滚动
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobile, isMobileMenuOpen])

  // 基于当前路径获取页面标题
  const getPageTitle = () => {
    if (pathname === '/agents') return 'Dashboard'
    if (pathname === '/agents/my') return 'My Agents'
    if (pathname === '/agents/community') return 'Community'
    if (pathname === '/agents/notes') return 'Notes'
    return 'Agents'
  }

  // 侧边栏导航链接
  const sidebarNavLinks = [
    { name: 'Dashboard', href: '/agents', icon: '📊' },
    { name: 'My Agents', href: '/agents/my', icon: '🤖' },
    { name: 'Community', href: '/agents/community', icon: '🌐' },
    { name: 'Notes', href: '/agents/notes', icon: '📝' }
  ]

  // 判断链接是否激活
  const isActive = (href: string) => {
    if (href === '/agents') {
      return pathname === '/agents'
    }
    return pathname.startsWith(href)
  }

  // 处理移动端菜单项点击
  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  // 侧边栏内容（桌面版和移动版共用）
  const SidebarContent = () => (
    <nav className="py-4 flex flex-col h-full justify-between">
      <div>
        <ul className="space-y-1.5">
          {sidebarNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={handleNavLinkClick}
                className={cn(
                  "flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md relative",
                  isActive(link.href)
                    ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                )}
              >
                {isActive(link.href) && (
                  <span className="absolute left-0 inset-y-0 w-1 bg-zinc-700 dark:bg-zinc-400 rounded-r-md" />
                )}
                <span className="text-xl mr-4 inline-flex items-center justify-center">{link.icon}</span>
                {link.name}
                {isActive(link.href) && (
                  <span className="w-5 h-5 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center text-white text-xs absolute right-3">
                    ✓
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 底部菜单 */}
      <div className="mt-auto pt-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/feedback"
              onClick={handleNavLinkClick}
              className="flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
            >
              <span className="text-xl mr-4 inline-flex items-center justify-center">💬</span>
              Feedback
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              onClick={handleNavLinkClick}
              className="flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
            >
              <span className="text-xl mr-4 inline-flex items-center justify-center">⚙️</span>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-slate-800 sticky top-0 z-50 shadow-sm md:shadow-none">
        <div className="flex h-16 items-center justify-between px-3 md:px-6">
          {/* 左侧 - Logo 和汉堡菜单 */}
          <div className="flex items-center md:w-64">
            {/* 移动端汉堡菜单按钮 */}
            <button
              className="mr-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 dark:text-zinc-300">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 dark:text-zinc-300">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              )}
            </button>

            <Link href="/" className="hidden md:flex items-center space-x-2">
              <span className="text-xl font-bold dark:text-white">Agir</span>
            </Link>
          </div>

          {/* 中间 - 页面标题 */}
          <div className="flex-1 mx-4 md:ml-8 md:mr-4 text-left">
            <h1 className="text-lg md:text-xl font-bold truncate dark:text-white">{getPageTitle()}</h1>
          </div>

          {/* 右侧 */}
          <div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* 移动端背景遮罩 */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-zinc-800 bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* 桌面侧边栏 - 只在非移动设备显示 */}
        <aside className="hidden md:block w-64 bg-white dark:bg-slate-800 flex-shrink-0 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* 移动端侧边抽屉菜单 */}
        <aside
          className={cn(
            "fixed md:hidden top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-800 z-50 transition-transform duration-300 ease-in-out overflow-y-auto",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent />
        </aside>

        {/* 主内容区域 - 独立滚动，响应式宽度 */}
        <main className="flex-1 bg-zinc-50 dark:bg-slate-900 rounded-none md:rounded-tl-2xl md:rounded-br-2xl overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mt-0 md:mt-4 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-6 lg:py-8 bg-white dark:bg-slate-800 rounded-none md:rounded-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 