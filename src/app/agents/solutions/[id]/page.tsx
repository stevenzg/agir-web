'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Agent {
  id: string
  name: string
  avatar: string
  role: string
}

interface Feature {
  name: string
  description: string
}

interface Review {
  user: string
  rating: number
  comment: string
  date: string
}

interface Solution {
  id: string
  title: string
  description: string
  category: string
  complexity: string
  agentsCount: number
  rating: number
  createdAt: string
  lastUpdated: string
  agents: Agent[]
  features: Feature[]
  reviews: Review[]
  deployments: number
}

// Mock solution data
const MOCK_SOLUTIONS: Record<string, Solution> = {
  '1': {
    id: '1',
    title: 'Automated Customer Support',
    description: 'An end-to-end customer support solution that handles inquiries, resolves common issues, and escalates complex problems to human agents when necessary. The system learns from interactions to continuously improve responses.',
    category: 'Customer Service',
    complexity: 'Medium',
    agentsCount: 3,
    rating: 4.8,
    createdAt: '2023-03-01',
    lastUpdated: '2023-06-15',
    agents: [
      { id: 'a1', name: 'Query Classifier', avatar: '/avatars/classifier.png', role: 'Categorizes customer inquiries' },
      { id: 'a2', name: 'Response Generator', avatar: '/avatars/generator.png', role: 'Creates personalized responses' },
      { id: 'a3', name: 'Escalation Manager', avatar: '/avatars/manager.png', role: 'Determines when to involve humans' },
    ],
    features: [
      { name: 'Multi-channel Support', description: 'Works across email, chat, and social media' },
      { name: 'Knowledge Base Integration', description: 'Connects to your existing documentation' },
      { name: 'Sentiment Analysis', description: 'Detects customer emotions and adapts responses' },
      { name: 'Multilingual Support', description: 'Available in 20+ languages' },
    ],
    reviews: [
      { user: 'TechCorp Inc.', rating: 5, comment: 'Reduced our support costs by 40% while improving customer satisfaction.', date: '2023-04-12' },
      { user: 'Global Retail', rating: 4.5, comment: 'Easy to deploy and customize for our specific needs.', date: '2023-05-08' },
    ],
    deployments: 2145
  },
  '2': {
    id: '2',
    title: 'Content Generation System',
    description: 'A comprehensive content creation system that generates blog posts, social media updates, product descriptions, and more. The solution adapts to your brand voice and can work with specific guidelines and templates.',
    category: 'Content Creation',
    complexity: 'High',
    agentsCount: 5,
    rating: 4.5,
    createdAt: '2023-03-15',
    lastUpdated: '2023-07-10',
    agents: [
      { id: 'b1', name: 'Topic Researcher', avatar: '/avatars/researcher.png', role: 'Identifies trending topics' },
      { id: 'b2', name: 'Outline Creator', avatar: '/avatars/outliner.png', role: 'Structures content effectively' },
      { id: 'b3', name: 'Content Writer', avatar: '/avatars/writer.png', role: 'Produces engaging text' },
      { id: 'b4', name: 'Media Selector', avatar: '/avatars/media.png', role: 'Chooses appropriate imagery' },
      { id: 'b5', name: 'Editor', avatar: '/avatars/editor.png', role: 'Polishes and refines content' },
    ],
    features: [
      { name: 'SEO Optimization', description: 'Creates content optimized for search engines' },
      { name: 'Content Calendar', description: 'Plans and schedules content publication' },
      { name: 'A/B Testing', description: 'Tests multiple versions to maximize engagement' },
      { name: 'Analytics Integration', description: 'Measures content performance' },
    ],
    reviews: [
      { user: 'Marketing Agency X', rating: 5, comment: 'Game-changer for our content production pipeline.', date: '2023-05-15' },
      { user: 'E-commerce Platform', rating: 4, comment: 'Great for product descriptions, still requires some human editing for blog posts.', date: '2023-06-22' },
    ],
    deployments: 1879
  },
  '3': {
    id: '3',
    title: 'Sales Lead Qualification',
    description: 'An AI-powered lead qualification system that analyzes prospect data, engages with potential customers, and prioritizes leads based on likelihood to convert. The solution integrates with your CRM and sales tools.',
    category: 'Sales',
    complexity: 'Low',
    agentsCount: 2,
    rating: 4.2,
    createdAt: '2023-04-01',
    lastUpdated: '2023-08-05',
    agents: [
      { id: 'c1', name: 'Lead Analyzer', avatar: '/avatars/analyzer.png', role: 'Evaluates lead quality' },
      { id: 'c2', name: 'Engagement Assistant', avatar: '/avatars/assistant.png', role: 'Interacts with prospects' },
    ],
    features: [
      { name: 'CRM Integration', description: 'Works with popular CRM systems' },
      { name: 'Automated Follow-up', description: 'Sends personalized follow-up messages' },
      { name: 'Scoring System', description: 'Ranks leads based on conversion potential' },
      { name: 'Performance Dashboard', description: 'Visualizes sales pipeline and conversion metrics' },
    ],
    reviews: [
      { user: 'SaaS Company', rating: 4, comment: 'Helped our sales team focus on the right prospects.', date: '2023-06-30' },
      { user: 'Insurance Agency', rating: 4.5, comment: 'Easy to set up and integrate with our existing workflow.', date: '2023-07-15' },
    ],
    deployments: 1256
  }
}

export default function SolutionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [solution, setSolution] = useState<Solution | null>(null)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchSolution = async () => {
      // Get the solution ID from the URL params
      const solutionId = params.id as string

      // For demo purposes, use our mock data
      if (MOCK_SOLUTIONS[solutionId]) {
        setSolution(MOCK_SOLUTIONS[solutionId])
      } else {
        // Handle case where solution doesn't exist
        alert('Solution not found')
        router.push('/agents/solutions')
      }
    }

    fetchSolution()
  }, [params.id, router])

  const handleDeploySolution = () => {
    alert('Deployment feature coming soon!')
  }

  const handleBackToList = () => {
    router.push('/agents/solutions')
  }

  // Render loading state if solution data isn't loaded yet
  if (!solution) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading solution details...</p>
        </div>
      </div>
    )
  }

  // Generate a color class based on category
  const getCategoryColor = (category: string) => {
    const categoryColorMap: Record<string, string> = {
      'Customer Service': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Content Creation': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Sales': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    }
    return categoryColorMap[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  // Generate star rating display
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="mr-2 font-medium">{rating.toFixed(1)}</span>
        <div className="flex text-yellow-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
              {rating >= star
                ? '★'
                : rating >= star - 0.5
                  ? '★'
                  : '☆'}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBackToList}
          className="flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Solutions
        </Button>

        <Button onClick={handleDeploySolution} className="bg-green-600 hover:bg-green-700">
          Deploy Solution
        </Button>
      </div>

      {/* Solution Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{solution.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(solution.category)}`}>
                  {solution.category}
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {solution.complexity} Complexity
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {solution.agentsCount} Agents
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                {solution.description}
              </p>
            </div>
            <div className="flex flex-col items-end justify-center">
              {renderStarRating(solution.rating)}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {solution.deployments.toLocaleString()} deployments
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Last updated: {solution.lastUpdated}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Content */}
      <Tabs defaultValue="agents">
        <TabsList className="mb-4">
          <TabsTrigger value="agents">Agents ({solution.agents.length})</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="requirements">System Requirements</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This solution uses the following specialized agents that work together:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solution.agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-4 bg-gray-200 dark:bg-gray-700">
                      <span className="text-lg font-medium">{agent.name.charAt(0)}</span>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{agent.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Agent</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{agent.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Key capabilities and features of this solution:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solution.features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">{feature.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <div className="flex items-center mb-4">
            <div className="mr-4">
              <p className="text-3xl font-bold">{solution.rating.toFixed(1)}</p>
              <div className="text-yellow-500 text-lg">{'★'.repeat(Math.round(solution.rating))}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{solution.reviews.length} reviews</p>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-1">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-1">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '20%' }}></div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {solution.reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{review.user}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                  </div>
                  <div className="text-yellow-500 mb-2">{'★'.repeat(Math.round(review.rating))}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* System Requirements Tab */}
        <TabsContent value="requirements">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">System Requirements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">API Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">This solution requires API access to function properly.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Storage</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Minimum 5GB storage space for solution data.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Processing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Requires moderate compute resources, depending on usage volume.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Integrations</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>CRM systems (optional)</li>
                    <li>Messaging platforms</li>
                    <li>Email services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 