'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveDataView, Column } from '@/components/ui/responsive-data-view'

// Mock solution data
const MOCK_SOLUTIONS = [
  {
    id: '1',
    title: 'Automated Customer Support',
    category: 'Customer Service',
    complexity: 'Medium',
    agentsCount: 3,
    rating: 4.8,
    createdAt: '2023-03-01',
  },
  {
    id: '2',
    title: 'Content Generation System',
    category: 'Content Creation',
    complexity: 'High',
    agentsCount: 5,
    rating: 4.5,
    createdAt: '2023-03-15',
  },
  {
    id: '3',
    title: 'Sales Lead Qualification',
    category: 'Sales',
    complexity: 'Low',
    agentsCount: 2,
    rating: 4.2,
    createdAt: '2023-04-01',
  },
]

// Define Solution type
type Solution = typeof MOCK_SOLUTIONS[0]

export default function SolutionsPage() {
  const [solutions] = useState(MOCK_SOLUTIONS)

  const handleCreateSolution = () => {
    // Placeholder for future implementation
    alert('Create solution feature coming soon!')
  }

  // Category color mapping
  const categoryColorMap: Record<string, string> = {
    'Customer Service': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Content Creation': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Sales': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  }

  // Complexity color mapping
  const complexityColorMap: Record<string, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  }

  // Define table/card columns configuration
  const columns: Column<Solution>[] = [
    {
      accessorKey: 'title',
      header: 'Solution Title',
      cell: (value: unknown) => <span className="font-medium">{value as string}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs ${categoryColorMap[value as string]}`}>
          {value as string}
        </span>
      ),
    },
    {
      accessorKey: 'complexity',
      header: 'Complexity',
      cell: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs ${complexityColorMap[value as string]}`}>
          {value as string}
        </span>
      ),
    },
    {
      accessorKey: 'agentsCount',
      header: 'Agents',
      cell: (value: unknown) => `${value as number} agents`,
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: (value: unknown) => (
        <div className="flex items-center">
          <span className="mr-1">{value as number}</span>
          <span className="text-yellow-500">★</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: (value: unknown) => (
        <Link
          href={`/agents/solutions/${value as string}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View Details
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Browse and deploy ready-made AI solutions for your business needs
          </p>
        </div>
        <Button onClick={handleCreateSolution}>Create Solution</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solutions Library</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveDataView
            data={solutions}
            columns={columns}
            cardTitleKey="title"
            cardDescriptionKey="category"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Customer Service</span>
              <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                12 solutions
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Content Creation</span>
              <span className="text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded-full">
                8 solutions
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Sales</span>
              <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                5 solutions
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <span className="font-medium">Automated Customer Support</span>
                  <span className="ml-2 text-yellow-500">★ 4.8</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">2,145 deployments</div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">Content Generation System</span>
                  <span className="ml-2 text-yellow-500">★ 4.5</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1,879 deployments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              New to AI solutions? Follow these steps to quickly deploy a solution for your business:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Browse solutions by category</li>
              <li>Select a solution that fits your needs</li>
              <li>Review the required resources</li>
              <li>Deploy with a single click</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 