'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchProcess, createProcessNode, createProcessTransition } from '../../../services/process'
import { Process, ProcessNode, ProcessTransition } from '../../../types/process'

const ProcessDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const processId = params.id as string

  const [process, setProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modals state
  const [showNodeModal, setShowNodeModal] = useState(false)
  const [showTransitionModal, setShowTransitionModal] = useState(false)

  // Form states
  const [newNode, setNewNode] = useState<{
    name: string
    description: string
    node_type: string
  }>({
    name: '',
    description: '',
    node_type: '',
  })

  const [newTransition, setNewTransition] = useState<{
    from_node_id: string
    to_node_id: string
    condition: string
  }>({
    from_node_id: '',
    to_node_id: '',
    condition: '',
  })

  const fetchProcessData = async () => {
    setLoading(true)
    try {
      const data = await fetchProcess(processId)
      setProcess(data)
      setError(null)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProcessData()
  }, [processId])

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProcessNode({
        process_id: processId,
        name: newNode.name,
        description: newNode.description,
        node_type: newNode.node_type,
      })
      setShowNodeModal(false)
      setNewNode({ name: '', description: '', node_type: '' })
      fetchProcessData()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleCreateTransition = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProcessTransition({
        process_id: processId,
        from_node_id: newTransition.from_node_id,
        to_node_id: newTransition.to_node_id,
        condition: newTransition.condition,
      })
      setShowTransitionModal(false)
      setNewTransition({ from_node_id: '', to_node_id: '', condition: '' })
      fetchProcessData()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!process) return <div className="p-4">Process not found</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{process.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/process')}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Back to List
          </button>
        </div>
      </div>

      <p className="mb-6">{process.description}</p>

      {/* Nodes Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Process Nodes</h2>
          <button
            onClick={() => setShowNodeModal(true)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Add Node
          </button>
        </div>

        {(!process.nodes || process.nodes.length === 0) ? (
          <p className="text-gray-500">No nodes defined yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {process.nodes.map((node) => (
              <div key={node.id} className="border border-gray-300 p-4 rounded">
                <h3 className="font-bold">{node.name}</h3>
                <p className="text-sm text-gray-600">{node.description}</p>
                <p className="text-xs text-gray-500 mt-1">Type: {node.node_type || 'None'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transitions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Process Transitions</h2>
          <button
            onClick={() => setShowTransitionModal(true)}
            className="bg-purple-500 text-white px-3 py-1 rounded"
            disabled={!process.nodes || process.nodes.length < 2}
          >
            Add Transition
          </button>
        </div>

        {(!process.transitions || process.transitions.length === 0) ? (
          <p className="text-gray-500">No transitions defined yet</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">From Node</th>
                <th className="border border-gray-300 p-2 text-left">To Node</th>
                <th className="border border-gray-300 p-2 text-left">Condition</th>
              </tr>
            </thead>
            <tbody>
              {process.transitions.map((transition) => {
                const fromNode = process.nodes?.find(n => n.id === transition.from_node_id)
                const toNode = process.nodes?.find(n => n.id === transition.to_node_id)

                return (
                  <tr key={transition.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{fromNode?.name || 'Unknown'}</td>
                    <td className="border border-gray-300 p-2">{toNode?.name || 'Unknown'}</td>
                    <td className="border border-gray-300 p-2">{transition.condition || 'None'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Node Modal */}
      {showNodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2 max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Process Node</h2>
            <form onSubmit={handleCreateNode}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={newNode.name}
                  onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  value={newNode.description}
                  onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Node Type</label>
                <input
                  type="text"
                  value={newNode.node_type}
                  onChange={(e) => setNewNode({ ...newNode, node_type: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g. START, END, APPROVAL"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNodeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Transition Modal */}
      {showTransitionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2 max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Process Transition</h2>
            <form onSubmit={handleCreateTransition}>
              <div className="mb-4">
                <label className="block mb-1">From Node</label>
                <select
                  value={newTransition.from_node_id}
                  onChange={(e) => setNewTransition({ ...newTransition, from_node_id: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select a node</option>
                  {process.nodes?.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">To Node</label>
                <select
                  value={newTransition.to_node_id}
                  onChange={(e) => setNewTransition({ ...newTransition, to_node_id: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select a node</option>
                  {process.nodes?.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Condition (optional)</label>
                <textarea
                  value={newTransition.condition}
                  onChange={(e) => setNewTransition({ ...newTransition, condition: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Condition for this transition"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransitionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessDetailPage
