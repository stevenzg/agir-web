'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AgentsLayoutProps {
  children: React.ReactNode
}

export default function AgentsLayout({ children }: AgentsLayoutProps) {
  const pathname = usePathname()

  // 导航链接列表
  const navLinks = [
    { name: 'Overview', href: '/agents' },
    { name: 'My Agents', href: '/agents/my' },
    { name: 'Community', href: '/agents/community' },
    { name: 'Notes', href: '/agents/notes' },
  ]

  // 判断链接是否激活
  const isActive = (href: string) => {
    if (href === '/agents') {
      return pathname === '/agents'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  Agir
                </Link>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${isActive(link.href)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              {/* 可以添加用户头像或其他操作按钮 */}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
} 