'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TransactionList from '@/components/agent/TransactionList'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function TransactionsPage() {
  const searchParams = useSearchParams()
  const agentId = searchParams.get('agentId')
  const [filter, setFilter] = useState<string>('all')

  // 筛选选项
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expenses', value: 'expense' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-500 mt-1">
            {agentId ? 'View all financial activities for this agent' : 'View all financial activities across your agents'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {agentId && (
            <Link href={`/agents/my`}>
              <Button variant="outline">
                Back to Agents
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 筛选器 */}
      <Card className="border border-gray-100">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                className={
                  filter === option.value
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : ""
                }
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 交易列表 */}
      <TransactionList agentId={agentId || undefined} showViewAll={false} />
    </div>
  )
} 