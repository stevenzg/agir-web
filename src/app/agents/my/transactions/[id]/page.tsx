'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  notes?: string
  paymentMethod?: string
  status: 'completed' | 'pending' | 'failed'
}

// 模拟交易数据
const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: '2024-03-07',
    description: 'Task completion bonus',
    amount: 250.00,
    type: 'income',
    category: 'Work',
    notes: 'Bonus for completing the machine learning algorithm optimization task ahead of schedule.',
    paymentMethod: 'Direct deposit',
    status: 'completed'
  },
  {
    id: 'tx2',
    date: '2024-03-05',
    description: 'API usage fee',
    amount: 120.50,
    type: 'expense',
    category: 'Services',
    notes: 'Monthly subscription fee for premium API access',
    paymentMethod: 'Automatic debit',
    status: 'completed'
  },
  {
    id: 'tx3',
    date: '2024-03-01',
    description: 'Consultation service',
    amount: 500.00,
    type: 'income',
    category: 'Services',
    notes: 'Consultation provided to XYZ Corp for their AI implementation strategy',
    paymentMethod: 'Bank transfer',
    status: 'completed'
  },
  {
    id: 'tx4',
    date: '2024-02-28',
    description: 'Storage upgrade',
    amount: 75.00,
    type: 'expense',
    category: 'Infrastructure',
    notes: 'Upgraded storage capacity for improved performance',
    paymentMethod: 'Credit',
    status: 'completed'
  },
  {
    id: 'tx5',
    date: '2024-02-25',
    description: 'Premium client project',
    amount: 750.00,
    type: 'income',
    category: 'Work',
    notes: 'Major project completion milestone payment',
    paymentMethod: 'Direct deposit',
    status: 'completed'
  }
]

export default function TransactionDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const agentId = searchParams.get('agentId')
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      const foundTransaction = mockTransactions.find(tx => tx.id === id)
      setTransaction(foundTransaction || null)
      setLoading(false)
    }, 500)
  }, [id])

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  // 格式化金额
  const formatAmount = (amount: number, type: TransactionType): string => {
    return `${type === 'income' ? '+' : '-'}$${amount.toFixed(2)}`
  }

  // 获取状态标签类
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading transaction details...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Not Found</h2>
        <p className="text-gray-600 mb-6">The transaction you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href={`/agents/my/transactions${agentId ? `?agentId=${agentId}` : ''}`}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Return to Transactions
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
          <p className="text-gray-500 mt-1">
            Detailed information about this transaction
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/agents/my/transactions${agentId ? `?agentId=${agentId}` : ''}`}>
            <Button variant="outline">
              Back to Transactions
            </Button>
          </Link>
        </div>
      </div>

      {/* 交易详情卡片 */}
      <Card className="border border-gray-100">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{transaction.description}</CardTitle>
              <CardDescription>
                {formatDate(transaction.date)}
              </CardDescription>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(transaction.status)}`}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">Amount</div>
            <div className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {formatAmount(transaction.amount, transaction.type)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Category</div>
              <div className="font-medium">{transaction.category}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Payment Method</div>
              <div className="font-medium">{transaction.paymentMethod || 'Not specified'}</div>
            </div>
          </div>

          {transaction.notes && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Notes</div>
              <div className="p-3 bg-gray-50 rounded-md text-gray-700">{transaction.notes}</div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
            Print Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 