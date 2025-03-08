'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AgentsLayoutProps {
  children: React.ReactNode
}

export default function AgentsLayout({ children }: AgentsLayoutProps) {
  const pathname = usePathname()

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between">
          {/* 左侧 - 与侧边栏内容精确对齐 */}
          <div className="flex items-center w-64">
            <div className="pl-6"> {/* 调整左padding精确对齐 */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-green-400 text-white rounded-full p-1.5 flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <span className="text-xl font-bold">Agir</span>
              </Link>
            </div>
          </div>

          {/* 中间 - 页面标题，与main内容左对齐 */}
          <div className="flex-1 pl-8 pr-4"> {/* 调整左padding确保与内容对齐 */}
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </div>

          {/* 右侧 */}
          <div className="flex items-center space-x-4 pr-4">
            <button className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium">
              Ask for help
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 - 固定高度和独立滚动 */}
        <aside className="w-64 bg-white flex-shrink-0 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="py-4 flex flex-col h-full justify-between">
            <div>
              <ul className="space-y-1.5"> {/* 调整菜单项间距 */}
                {sidebarNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md relative", // 调整内边距和外边距
                        isActive(link.href)
                          ? "bg-green-100 text-green-600" // 更淡的激活背景色
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {isActive(link.href) && (
                        <span className="absolute left-0 inset-y-0 w-1 bg-green-500 rounded-r-md" />
                      )}
                      <span className="text-xl mr-4 inline-flex items-center justify-center">{link.icon}</span>
                      {link.name}
                      {isActive(link.href) && (
                        <span className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-white text-xs absolute right-3">
                          ✓
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

            </div>

            {/* 底部菜单 */}
            <div className="mt-auto pt-4 border-gray-100">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/feedback"
                    className="flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <span className="text-xl mr-4 inline-flex items-center justify-center">💬</span>
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <span className="text-xl mr-4 inline-flex items-center justify-center">⚙️</span>
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* 主内容区域 - 独立滚动 */}
        <main className="flex-1 bg-gray-50 rounded-tl-2xl rounded-br-2xl overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-8 py-8"> {/* 调整主内容区域的内边距 */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 