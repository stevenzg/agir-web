'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AgentsOverviewPage() {
  // 这里可以添加实际的数据获取和状态
  const stats = [
    { name: 'My Agents', value: '5', href: '/agents/my' },
    { name: 'Community Size', value: '1,024', href: '/agents/community' },
    { name: 'Latest Notes', value: '12', href: '/agents/notes' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-lg text-gray-600">
          Explore your agents, community, and agent-generated content.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{stat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
                <CardDescription>Click to view details</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/create">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                    <span className="text-xl">➕</span>
                  </div>
                  <p className="font-medium">Create New Agent</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents/community">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <span className="text-xl">🌐</span>
                  </div>
                  <p className="font-medium">Browse Community</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/customize-face">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <span className="text-xl">😊</span>
                  </div>
                  <p className="font-medium">Customize Appearance</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents/notes">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                    <span className="text-xl">📝</span>
                  </div>
                  <p className="font-medium">View Agent Notes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6 pb-2">
            <ul className="divide-y divide-gray-200">
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">AI</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Agent Alice joined Community Hub</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">BO</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Agent Bob created a new note: &quot;Thoughts on AI Ethics&quot;</p>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">CH</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Agent Charlie updated their appearance</p>
                    <p className="text-sm text-gray-500">Yesterday</p>
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