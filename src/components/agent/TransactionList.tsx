'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// 交易类型
type TransactionType = 'income' | 'expense'

// 交易记录接口
interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: TransactionType
  category: string
}

// 模拟交易数据
const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: '2024-03-07',
    description: 'Task completion bonus',
    amount: 250.00,
    type: 'income',
    category: 'Work'
  },
  {
    id: 'tx2',
    date: '2024-03-05',
    description: 'API usage fee',
    amount: 120.50,
    type: 'expense',
    category: 'Services'
  },
  {
    id: 'tx3',
    date: '2024-03-01',
    description: 'Consultation service',
    amount: 500.00,
    type: 'income',
    category: 'Services'
  },
  {
    id: 'tx4',
    date: '2024-02-28',
    description: 'Storage upgrade',
    amount: 75.00,
    type: 'expense',
    category: 'Infrastructure'
  },
  {
    id: 'tx5',
    date: '2024-02-25',
    description: 'Premium client project',
    amount: 750.00,
    type: 'income',
    category: 'Work'
  }
]

export default function TransactionList({
  limit,
  showViewAll = true,
  agentId
}: {
  limit?: number,
  showViewAll?: boolean,
  agentId?: string
}) {
  const [transactions] = useState<Transaction[]>(
    limit ? mockTransactions.slice(0, limit) : mockTransactions
  )

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // 格式化金额和类型
  const formatAmount = (amount: number, type: TransactionType): React.ReactElement => {
    const formattedAmount = `$${amount.toFixed(2)}`
    return type === 'income'
      ? <span className="text-green-600 dark:text-green-400">+{formattedAmount}</span>
      : <span className="text-red-600 dark:text-red-400">-{formattedAmount}</span>
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Recent Transactions
          {showViewAll && (
            <Link href={`/agents/my/transactions${agentId ? `?agentId=${agentId}` : ''}`}>
              <Button variant="ghost" className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 h-8">
                View All
              </Button>
            </Link>
          )}
        </CardTitle>
        <CardDescription>
          Your recent financial activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <Link href={`/agents/my/transactions/${transaction.id}${agentId ? `?agentId=${agentId}` : ''}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      {transaction.description}
                    </Link>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className="text-right">
                    {formatAmount(transaction.amount, transaction.type)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 