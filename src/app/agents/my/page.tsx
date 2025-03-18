'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUser, getUsers, User } from '@/services/users'
import { toast } from 'sonner'

export default function MyAgentsPage() {
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAgent, setNewAgent] = useState({ firstName: '', lastName: '' })
  const [creating, setCreating] = useState(false)
  const searchParams = useSearchParams()

  // Load agents when the component mounts
  useEffect(() => {
    async function loadAgents() {
      try {
        setLoading(true)
        const users = await getUsers()
        setAgents(users)
      } catch (error) {
        console.error('Failed to load agents:', error)
        toast.error('Failed to load agents. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  // Check for the "createAgent" query parameter to open the dialog
  useEffect(() => {
    const shouldOpenDialog = searchParams.get('createAgent') === 'true'
    if (shouldOpenDialog) {
      setShowCreateDialog(true)
    }
  }, [searchParams])

  // 获取状态标签的样式
  const getStatusBadge = (status: boolean) => {
    if (status) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Active
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          Inactive
        </span>
      )
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAgent(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateAgent = async () => {
    try {
      setCreating(true)

      const userData = {
        first_name: newAgent.firstName,
        last_name: newAgent.lastName
      }

      const createdUser = await createUser(userData)

      // Add the new user to the list
      setAgents(prev => [...prev, createdUser])

      // Close the dialog and reset the form
      setShowCreateDialog(false)
      setNewAgent({ firstName: '', lastName: '' })

      toast.success('Human agent created successfully!')
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error('Failed to create human agent. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 mt-1">Manage your human agents and their activities</p>
        </div>
        <Button
          className="bg-zinc-700 hover:bg-zinc-800 text-white"
          onClick={() => setShowCreateDialog(true)}
        >
          New Human Agent
        </Button>
      </div>

      {/* Create Agent Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 shadow-lg">
          <DialogHeader>
            <DialogTitle>Create New Human Agent</DialogTitle>
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
              disabled={!newAgent.firstName.trim() || !newAgent.lastName.trim() || creating}
            >
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-700"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && agents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex justify-center items-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">No Human Agents Yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
            Create your first human agent to start managing activities and interactions.
          </p>
          <Button
            className="bg-zinc-700 hover:bg-zinc-800 text-white"
            onClick={() => setShowCreateDialog(true)}
          >
            Create Human Agent
          </Button>
        </div>
      )}

      {/* Agents Grid */}
      {!loading && agents.length > 0 && (
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
                  {getStatusBadge(agent.is_active)}
                </div>

                <div className="flex flex-col h-full">
                  {/* Business card style header with gradient */}
                  <div className={`bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 p-6 pb-4`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 text-2xl select-none">
                        {agent.avatar || '👤'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{agent.first_name} {agent.last_name}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Human Agent</p>
                      </div>
                    </div>

                    {/* Subtle divider */}
                    <div className="border-t border-zinc-200 dark:border-zinc-700 my-2"></div>

                    {/* Description */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 italic">
                      &ldquo;{agent.description || 'No description provided.'}&rdquo;
                    </p>
                  </div>

                  {/* Contact-like section */}
                  <div className="p-4 bg-white dark:bg-zinc-800 flex-grow">
                    <div className="grid grid-cols-1 gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created: {formatDate(agent.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{agent.email}</span>
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
      )}
    </div>
  )
} 