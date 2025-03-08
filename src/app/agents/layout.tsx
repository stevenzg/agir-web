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
    { name: 'Notes', href: '/agents/notes', icon: '📝' },
    { name: 'Profile', href: '/profile', icon: '👤' },
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
      {/* 顶部导航栏 - 移除border */}
      <header className="bg-white sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* 左侧 - 与侧边栏保持对齐 */}
            <div className="flex items-center pl-4 w-64">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-green-400 text-white rounded-full p-1.5 flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <span className="text-xl font-bold">Agir</span>
              </Link>
            </div>

            {/* 中间 - 页面标题，与main内容左对齐 */}
            <div className="flex-1 pr-4">
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
            </div>

            {/* 右侧 */}
            <div className="flex items-center space-x-4 pr-4">
              <button className="bg-green-400 text-white px-4 py-2 rounded-full text-sm font-medium">
                + Add Agent
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 侧边栏 - 移除border */}
        <aside className="w-64 bg-white flex-shrink-0">
          <nav className="py-4 px-4">
            <ul className="space-y-1">
              {sidebarNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm font-medium rounded-md relative",
                      isActive(link.href)
                        ? "text-green-600 bg-green-50"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {isActive(link.href) && (
                      <span className="absolute left-0 inset-y-0 w-1 bg-green-600 rounded-r-md" />
                    )}
                    <span className="mr-3 text-xl">{link.icon}</span>
                    {link.name}
                    {isActive(link.href) && (
                      <span className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-white text-xs absolute right-3">
                        ✓
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* 推荐区域 */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="flex items-center font-medium text-sm">
                <span className="mr-2">🎁</span> Refer & Earn
              </h3>
              <p className="mt-2 text-xs text-gray-600">
                Invite friends to Agir and earn extra agent credits!
              </p>
            </div>
          </nav>
        </aside>

        {/* 主内容区域 - 添加左上和右下圆角 */}
        <main className="flex-1 bg-gray-50 rounded-tl-2xl rounded-br-2xl">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* 移除页面标题，因为已经移到了顶部 */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 