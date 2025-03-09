'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FinancialSummary from '@/components/agent/FinancialSummary'
import TransactionList from '@/components/agent/TransactionList'
import { formatDate } from '@/lib/utils'

// 模拟数据 - 实际应用中应从API获取
const mockAgents = [
  {
    id: 'agent1',
    name: 'Assistant Alice',
    description: 'Helpful virtual assistant with expertise in organization and planning.',
    createdAt: '2023-12-15',
    avatar: '👩‍💼',
    backgroundColor: 'bg-blue-100',
    status: 'active',
  },
  {
    id: 'agent2',
    name: 'Researcher Bob',
    description: 'Academic-minded agent focused on research and data analysis.',
    createdAt: '2023-11-20',
    avatar: '🧑‍🔬',
    backgroundColor: 'bg-green-100',
    status: 'idle',
  },
  {
    id: 'agent3',
    name: 'Creative Charlie',
    description: 'Creative agent specializing in storytelling and content creation.',
    createdAt: '2024-01-05',
    avatar: '🧑‍🎨',
    backgroundColor: 'bg-purple-100',
    status: 'active',
  },
  {
    id: 'agent4',
    name: 'Developer Dana',
    description: 'Technical agent with knowledge of programming and software development.',
    createdAt: '2023-12-28',
    avatar: '👩‍💻',
    backgroundColor: 'bg-amber-100',
    status: 'idle',
  },
]

export default function MyAgentsPage() {
  const [agents] = useState(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  // 获取状态标签的样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Active
          </span>
        )
      case 'idle':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Idle
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 mt-1">Manage your agents and their activities</p>
        </div>
        <Link href="/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Create New Agent
          </Button>
        </Link>
      </div>

      {/* Financial Summary */}
      <FinancialSummary agentId={selectedAgent || undefined} />

      {/* Agents Grid */}
      {agents.length > 0 ? (
        <div>
          <h2 className="text-xl font-medium mb-4">Your Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className={`overflow-hidden ${selectedAgent === agent.id ? 'ring-2 ring-indigo-600' : ''}`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <CardHeader className={`${agent.backgroundColor} pb-2`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{agent.avatar}</span>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>
                  <CardDescription className="line-clamp-2 text-gray-700">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 pb-2">
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(agent.createdAt)}
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-between gap-2 p-3">
                  <Link href={`/edit-agent?id=${agent.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/agents/community?agent=${agent.id}`} className="flex-1">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                    >
                      Activities
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No agents yet</h3>
          <p className="text-gray-500 mb-4">Create your first agent to get started</p>
          <Link href="/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Create New Agent
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Transactions */}
      {agents.length > 0 && (
        <div className="mt-6">
          <TransactionList limit={5} agentId={selectedAgent || undefined} />
        </div>
      )}
    </div>
  )
} 