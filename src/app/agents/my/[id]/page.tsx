'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { User } from '@/services/users'
import {
  getAgent,
  getAgentCapabilities,
  getAgentMemories,
  addAgentCapability,
  addAgentMemory,
  Capability,
  Memory
} from '@/services/agents'

export default function AgentDetailPage() {
  const params = useParams()
  const [agent, setAgent] = useState<User | null>(null)
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [showCapabilityDialog, setShowCapabilityDialog] = useState(false)
  const [showMemoryDialog, setShowMemoryDialog] = useState(false)
  const [newCapability, setNewCapability] = useState({ name: '', description: '' })
  const [newMemory, setNewMemory] = useState('')

  useEffect(() => {
    async function loadAgentData() {
      try {
        setLoading(true)
        const agentId = params.id as string

        // Fetch agent details
        const agentData = await getAgent(agentId)
        setAgent(agentData)

        // Fetch capabilities
        const capabilitiesData = await getAgentCapabilities(agentId)
        setCapabilities(capabilitiesData)

        // Fetch memories
        const memoriesData = await getAgentMemories(agentId)
        setMemories(memoriesData)
      } catch (error) {
        console.error('Failed to load agent data:', error)
        toast.error('Failed to load agent data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadAgentData()
  }, [params.id])

  const handleAddCapability = async () => {
    try {
      const agentId = params.id as string
      const newCap = await addAgentCapability(agentId, newCapability)
      setCapabilities(prev => [...prev, newCap])
      setShowCapabilityDialog(false)
      setNewCapability({ name: '', description: '' })
      toast.success('Capability added successfully!')
    } catch (error) {
      console.error('Failed to add capability:', error)
      toast.error('Failed to add capability. Please try again.')
    }
  }

  const handleAddMemory = async () => {
    try {
      const agentId = params.id as string
      const newMem = await addAgentMemory(agentId, newMemory)
      setMemories(prev => [...prev, newMem])
      setShowMemoryDialog(false)
      setNewMemory('')
      toast.success('Memory added successfully!')
    } catch (error) {
      console.error('Failed to add memory:', error)
      toast.error('Failed to add memory. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-700"></div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Agent not found</h2>
        <p className="text-zinc-500 dark:text-zinc-400">The requested agent could not be found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Agent Profile Card */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-2xl">
            {agent.avatar || '👤'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              {agent.first_name} {agent.last_name}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">{agent.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Status</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">
              {agent.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Created</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">
              {new Date(agent.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Capabilities Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Capabilities</h3>
          <Button
            className="bg-zinc-700 hover:bg-zinc-800 text-white"
            onClick={() => setShowCapabilityDialog(true)}
          >
            Add Capability
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((capability) => (
            <Card key={capability.id} className="p-4">
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
                {capability.name}
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {capability.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Memories Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Memories</h3>
          <Button
            className="bg-zinc-700 hover:bg-zinc-800 text-white"
            onClick={() => setShowMemoryDialog(true)}
          >
            Add Memory
          </Button>
        </div>
        <div className="space-y-4">
          {memories.map((memory) => (
            <Card key={memory.id} className="p-4">
              <p className="text-zinc-800 dark:text-zinc-100 mb-2">{memory.content}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(memory.created_at).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Capability Dialog */}
      <Dialog open={showCapabilityDialog} onOpenChange={setShowCapabilityDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Capability</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCapability.name}
                onChange={(e) => setNewCapability(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Enter capability name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newCapability.description}
                onChange={(e) => setNewCapability(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Enter capability description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCapabilityDialog(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-zinc-700 hover:bg-zinc-800 text-white"
              onClick={handleAddCapability}
              disabled={!newCapability.name.trim() || !newCapability.description.trim()}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Memory Dialog */}
      <Dialog open={showMemoryDialog} onOpenChange={setShowMemoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Memory</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memory" className="text-right">
                Memory
              </Label>
              <Textarea
                id="memory"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                className="col-span-3"
                placeholder="Enter memory content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowMemoryDialog(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-zinc-700 hover:bg-zinc-800 text-white"
              onClick={handleAddMemory}
              disabled={!newMemory.trim()}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 