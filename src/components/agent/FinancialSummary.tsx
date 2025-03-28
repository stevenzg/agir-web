'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Mock financial data type
interface FinancialData {
  balance: number
  monthlyIncome: number
  monthlyExpense: number
  currency: string
}

// Mock data
const mockFinancialData: FinancialData = {
  balance: 2580.75,
  monthlyIncome: 1250.00,
  monthlyExpense: 420.50,
  currency: '$'
}

export default function FinancialSummary({ agentId }: { agentId?: string }) {
  const [financialData] = useState<FinancialData>(mockFinancialData)

  // Format currency display
  const formatCurrency = (amount: number): string => {
    return `${financialData.currency}${amount.toFixed(2)}`
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Financial Summary
          <Link href={`/agents/my/transactions${agentId ? `?agentId=${agentId}` : ''}`}>
            <Button variant="ghost" className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 h-8">
              View Transactions
            </Button>
          </Link>
        </CardTitle>
        <CardDescription>
          Current financial status and monthly activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(financialData.balance)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(financialData.monthlyIncome)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expense</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(financialData.monthlyExpense)}</p>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Net this month: <span className="font-medium text-green-600 dark:text-green-400">
            {formatCurrency(financialData.monthlyIncome - financialData.monthlyExpense)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 