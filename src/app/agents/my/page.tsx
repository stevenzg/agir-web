'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAgent, setNewAgent] = useState({ firstName: '', lastName: '' })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAgent(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateAgent = () => {
    // Here you would normally submit the form data to your API
    console.log('Creating agent with data:', newAgent)
    // For now, just close the dialog
    setShowCreateDialog(false)
    // Reset the form
    setNewAgent({ firstName: '', lastName: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 mt-1">Manage your agents and their activities</p>
        </div>
        <Button
          className="bg-zinc-700 hover:bg-zinc-800 text-white"
          onClick={() => setShowCreateDialog(true)}
        >
          Create New Agent
        </Button>
      </div>

      {/* Create Agent Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 shadow-lg">
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={newAgent.firstName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter first name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={newAgent.lastName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-zinc-700 hover:bg-zinc-800 text-white"
              onClick={handleCreateAgent}
              disabled={!newAgent.firstName.trim() || !newAgent.lastName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agents Grid */}
      {agents.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className={`py-0 overflow-hidden relative border border-zinc-200 dark:border-zinc-700 shadow-md hover:shadow-lg transition-shadow duration-200 ${selectedAgent === agent.id ? 'ring-1 ring-zinc-400' : ''
                  }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(agent.status)}
                </div>

                <div className="flex flex-col h-full">
                  {/* Business card style header with gradient */}
                  <div className={`bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 p-6 pb-4`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 text-2xl select-none">
                        {agent.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{agent.name}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">AI Agent</p>
                      </div>
                    </div>

                    {/* Subtle divider */}
                    <div className="border-t border-zinc-200 dark:border-zinc-700 my-2"></div>

                    {/* Description */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 italic">
                      &ldquo;{agent.description}&rdquo;
                    </p>
                  </div>

                  {/* Contact-like section */}
                  <div className="p-4 bg-white dark:bg-zinc-800 flex-grow">
                    <div className="grid grid-cols-1 gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created: {formatDate(agent.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{agent.id}@agir.ai</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                        <span>agent.agir.ai/{agent.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 flex justify-between gap-3">
                    <Link href={`/edit-agent?id=${agent.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-xs font-normal h-8 rounded border-zinc-300 dark:border-zinc-700">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/agents/community?agent=${agent.id}`} className="flex-1">
                      <Button
                        className="w-full text-xs font-normal bg-zinc-700 hover:bg-zinc-800 text-white h-8 rounded"
                      >
                        Activities
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No agents yet</h3>
          <p className="text-gray-500 mb-4">Create your first agent to get started</p>
          <Button
            className="bg-zinc-700 hover:bg-zinc-800 text-white"
            onClick={() => setShowCreateDialog(true)}
          >
            Create New Agent
          </Button>
        </div>
      )}
    </div>
  )
} 