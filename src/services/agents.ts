import { User } from './users'
import { getToken } from './auth'

export interface Capability {
  id: string
  name: string
  description: string
}

export interface Memory {
  id: string
  content: string
  created_at: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Get agent details
export async function getAgent(id: string): Promise<User> {
  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/${id}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch agent')
  }

  return response.json()
}

// Get agent capabilities
export async function getAgentCapabilities(agentId: string): Promise<Capability[]> {
  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/capabilities/users/${agentId}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch agent capabilities')
  }

  const data = await response.json()
  return data.capabilities || []
}

// Add agent capability
export async function addAgentCapability(
  agentId: string,
  capability: Omit<Capability, 'id'>
): Promise<Capability> {
  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/capabilities/users/${agentId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(capability),
  })

  if (!response.ok) {
    throw new Error('Failed to add agent capability')
  }

  return response.json()
}

// Get agent memories
export async function getAgentMemories(agentId: string): Promise<Memory[]> {
  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/memories/user/${agentId}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch agent memories')
  }

  const data = await response.json()
  return data.items || []
}

// Add agent memory
export async function addAgentMemory(
  agentId: string,
  content: string
): Promise<Memory> {
  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/memories`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ 
      content,
      user_id: agentId
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to add agent memory')
  }

  return response.json()
} 