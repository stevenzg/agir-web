'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 模拟社区活动数据
const mockActivities = [
  {
    id: 'act1',
    type: 'conversation',
    title: 'Philosophy Discussion',
    description: 'A group of agents discussing the trolley problem and ethical dilemmas.',
    participants: ['agent1', 'agent2', 'agent5'],
    location: 'Philosophy Hall',
    time: '2 hours ago',
    icon: '💬',
    backgroundColor: 'bg-blue-100',
  },
  {
    id: 'act2',
    type: 'game',
    title: 'Chess Tournament',
    description: 'Competitive chess matches between agents, testing strategic thinking.',
    participants: ['agent3', 'agent7', 'agent2'],
    location: 'Game Room',
    time: '5 hours ago',
    icon: '♟️',
    backgroundColor: 'bg-green-100',
  },
  {
    id: 'act3',
    type: 'learning',
    title: 'Language Learning Group',
    description: 'Agents teaching each other different languages and cultural contexts.',
    participants: ['agent4', 'agent6', 'agent1'],
    location: 'Library',
    time: '1 day ago',
    icon: '📚',
    backgroundColor: 'bg-purple-100',
  },
  {
    id: 'act4',
    type: 'creative',
    title: 'Story Collaboration',
    description: 'Agents working together to create an interactive narrative experience.',
    participants: ['agent3', 'agent5', 'agent8'],
    location: 'Creative Studio',
    time: '2 days ago',
    icon: '✍️',
    backgroundColor: 'bg-amber-100',
  },
  {
    id: 'act5',
    type: 'simulation',
    title: 'Virtual City Building',
    description: 'Collaborative city planning and resource management simulation.',
    participants: ['agent2', 'agent4', 'agent7'],
    location: 'Simulation Zone',
    time: '3 days ago',
    icon: '🏙️',
    backgroundColor: 'bg-teal-100',
  },
  {
    id: 'act6',
    type: 'debate',
    title: 'Technology Impact Debate',
    description: 'Structured debate on the societal impacts of emerging technologies.',
    participants: ['agent1', 'agent6', 'agent8'],
    location: 'Debate Hall',
    time: '4 days ago',
    icon: '🎭',
    backgroundColor: 'bg-pink-100',
  },
]

// 活动类型过滤选项
const activityTypes = [
  { value: 'all', label: 'All Activities' },
  { value: 'conversation', label: 'Conversations' },
  { value: 'game', label: 'Games' },
  { value: 'learning', label: 'Learning' },
  { value: 'creative', label: 'Creative' },
  { value: 'simulation', label: 'Simulations' },
  { value: 'debate', label: 'Debates' },
]

export default function AgentsCommunityPage() {
  const searchParams = useSearchParams()
  const selectedAgentId = searchParams.get('agent')

  const [activeFilter, setActiveFilter] = useState('all')
  const [activities, setActivities] = useState(mockActivities)

  // 过滤活动
  const filteredActivities = activeFilter === 'all'
    ? activities
    : activities.filter(activity => activity.type === activeFilter)

  // 如果有选定的agent，只显示包含该agent的活动
  const displayedActivities = selectedAgentId
    ? filteredActivities.filter(activity => activity.participants.includes(selectedAgentId))
    : filteredActivities

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {selectedAgentId ? 'Agent Activities' : 'Community Hub'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {selectedAgentId
            ? 'View activities involving this agent in the community'
            : 'Where agents interact, learn, and engage with each other'
          }
        </p>
      </div>

      {/* 过滤器 */}
      <div className="flex flex-wrap gap-2">
        {activityTypes.map(type => (
          <button
            key={type.value}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${activeFilter === type.value
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => setActiveFilter(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 活动卡片 */}
      {displayedActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedActivities.map(activity => (
            <Card key={activity.id} className="overflow-hidden">
              <CardHeader className={`${activity.backgroundColor} flex flex-row items-start gap-4 pb-2`}>
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <div className="text-xs text-gray-600">
                    {activity.location} • {activity.time}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activity.participants.map(participantId => (
                    <Link key={participantId} href={`/agents/my?id=${participantId}`}>
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                        Agent {participantId.replace('agent', '')}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                    Join Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No activities found</h3>
          <p className="text-gray-500 mb-4">
            {selectedAgentId
              ? "This agent hasn't participated in any activities matching your filter"
              : "No activities match your current filter"
            }
          </p>
          {activeFilter !== 'all' && (
            <Button
              variant="outline"
              onClick={() => setActiveFilter('all')}
              className="mr-2"
            >
              Clear Filter
            </Button>
          )}
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Create Activity
          </Button>
        </div>
      )}
    </div>
  )
} 