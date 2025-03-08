'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function AddTransactionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const agentId = searchParams.get('agentId')

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income',
    category: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 表单输入处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // 下拉菜单变更处理
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模拟API调用
    setTimeout(() => {
      console.log('Transaction created:', formData)
      setIsSubmitting(false)

      // 重定向到交易列表页面
      router.push(`/agents/my/transactions${agentId ? `?agentId=${agentId}` : ''}`)
    }, 1000)
  }

  // 类别选项
  const categories = [
    { value: 'work', label: 'Work' },
    { value: 'services', label: 'Services' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' }
  ]

  // 支付方式选项
  const paymentMethods = [
    { value: 'direct_deposit', label: 'Direct Deposit' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit', label: 'Credit' },
    { value: 'automatic_debit', label: 'Automatic Debit' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Record Transaction</h1>
          <p className="text-gray-500 mt-1">
            Add a new financial transaction
          </p>
        </div>
        <Link href={`/agents/my/transactions${agentId ? `?agentId=${agentId}` : ''}`}>
          <Button variant="outline">
            Cancel
          </Button>
        </Link>
      </div>

      <Card className="border border-gray-100">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 交易类型 */}
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="income"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="income" className="ml-2 text-gray-700">
                    Income
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="expense"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="expense" className="ml-2 text-gray-700">
                    Expense
                  </label>
                </div>
              </div>
            </div>

            {/* 交易描述 */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a description"
                required
              />
            </div>

            {/* 金额 */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>

            {/* 日期 */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* 类别 */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 支付方式 */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 备注 */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional details here"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end gap-3">
            <Link href={`/agents/my/transactions${agentId ? `?agentId=${agentId}` : ''}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 