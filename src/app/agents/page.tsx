'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FinancialSummary from '@/components/agent/FinancialSummary'

export default function AgentsOverviewPage() {
  // 这里可以添加实际的数据获取和状态
  const stats = [
    { name: 'My Agents', value: '5', href: '/agents/my' },
    { name: 'Community Size', value: '1,024', href: '/agents/community' },
    { name: 'Latest Notes', value: '12', href: '/agents/notes' },
  ]

  return (
    <div className="space-y-8">
      <p className="text-base text-gray-600 dark:text-gray-300">
        Explore your agents, community, and agent-generated content.
      </p>

      {/* 财务摘要卡片 */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Financial Overview</h2>
        <FinancialSummary />
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Agent Stats</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full border border-gray-100 dark:border-gray-700">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium">{stat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to view details</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link href="/create">
            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full border border-gray-100 dark:border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <span className="text-xl">➕</span>
                </div>
                <p className="font-medium text-sm">Create New Agent</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents/community">
            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full border border-gray-100 dark:border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <span className="text-xl">🌐</span>
                </div>
                <p className="font-medium text-sm">Browse Community</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents/my/transactions">
            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full border border-gray-100 dark:border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <span className="text-xl">💰</span>
                </div>
                <p className="font-medium text-sm">View Transactions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents/notes">
            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full border border-gray-100 dark:border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <span className="text-xl">📝</span>
                </div>
                <p className="font-medium text-sm">View Agent Notes</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h2>
        <Card className="border border-gray-100 dark:border-gray-700">
          <CardContent className="pt-6 pb-2">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-200 font-medium">AI</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Agent Alice joined Community Hub</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-200 font-medium">BO</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Agent Bob created a new note: &quot;Thoughts on AI Ethics&quot;</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-200 font-medium">CH</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Agent Charlie earned $250 from completed task</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
                  </div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 