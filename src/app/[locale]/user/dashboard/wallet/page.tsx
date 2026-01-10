'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Euro as EuroIcon,
  Trash2
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  description: string
  date: string
  reference?: string
  paymentMethod?: string
  deletable?: boolean
}

interface WalletStats {
  totalDeposits: number
  totalWithdrawals: number
  totalSpent: number
  pendingAmount: number
}

interface WalletSettings {
  serviceFee: number
  currency: string
  withdrawalSettings: {
    minWithdrawal: number
    maxWithdrawal: number
    processingTime: string
  }
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<WalletStats>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalSpent: 0,
    pendingAmount: 0
  })
  const [settings, setSettings] = useState<WalletSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [addFundsAmount, setAddFundsAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [deleteSheetOpen, setDeleteSheetOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const [withdrawSheetOpen, setWithdrawSheetOpen] = useState(false)

  useEffect(() => {
    fetchWalletData()
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const response = await fetch('/api/wallet-settings')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Error fetching wallet settings:', error)
    }
  }

  async function fetchWalletData() {
    try {
      setLoading(true)
      const userId = 'user_123'
      const response = await fetch(`/api/user/wallet?userId=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        setBalance(result.data.balance || 0)
        
        const apiTransactions = result.data.transactions || []
        const transformedTransactions = apiTransactions.map((t: any) => ({
          id: t.id,
          type: t.type === 'credit' ? 'deposit' : 
                t.type === 'debit' && t.description.toLowerCase().includes('withdraw') ? 'withdrawal' :
                t.type === 'debit' ? 'purchase' : t.type,
          amount: t.amount,
          currency: '€',
          status: t.status,
          description: t.description,
          date: t.date,
          reference: t.id,
          paymentMethod: t.paymentMethod,
          deletable: t.deletable
        }))
        
        setTransactions(transformedTransactions)
        
        const completedTransactions = apiTransactions.filter((t: any) => t.status === 'completed')
        const pendingTransactions = apiTransactions.filter((t: any) => t.status === 'pending')
        
        setStats({
          totalDeposits: completedTransactions
            .filter((t: any) => t.type === 'credit')
            .reduce((sum: number, t: any) => sum + t.amount, 0),
          totalWithdrawals: completedTransactions
            .filter((t: any) => t.type === 'debit' && t.description.toLowerCase().includes('withdraw'))
            .reduce((sum: number, t: any) => sum + t.amount, 0),
          totalSpent: completedTransactions
            .filter((t: any) => t.type === 'debit' && !t.description.toLowerCase().includes('withdraw'))
            .reduce((sum: number, t: any) => sum + t.amount, 0),
          pendingAmount: pendingTransactions
            .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0)
        })
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async () => {
    const amount = parseFloat(addFundsAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      })
      return
    }

    try {
      const userId = 'user_123'
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'credit',
          amount,
          description: `Deposit of ${amount.toFixed(2)} €`,
          status: 'completed',
          paymentMethod: 'card' // or 'paypal' for instant, 'bank_transfer' for pending
        })
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: 'Funds added',
          description: `${amount.toFixed(2)} € has been added to your wallet`
        })
        setAddFundsAmount('')
        fetchWalletData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add funds',
        variant: 'destructive'
      })
    }
  }

  const handleWithdrawConfirm = async () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      })
      return
    }

    if (!settings) {
      toast({
        title: 'Error',
        description: 'Wallet settings not loaded',
        variant: 'destructive'
      })
      return
    }

    const totalRequired = amount + settings.serviceFee

    if (totalRequired > balance) {
      toast({
        title: 'Insufficient balance',
        description: `You need ${totalRequired.toFixed(2)} € (${amount.toFixed(2)} € + ${settings.serviceFee.toFixed(2)} € service fee)`,
        variant: 'destructive'
      })
      return
    }

    try {
      const userId = 'user_123'
      const response = await fetch('/api/user/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: 'Withdrawal requested',
          description: result.message || `Your withdrawal request for ${amount.toFixed(2)} € has been submitted`
        })
        setWithdrawAmount('')
        setWithdrawSheetOpen(false)
        fetchWalletData()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to request withdrawal',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return

    try {
      const userId = 'user_123'
      const response = await fetch(`/api/user/wallet?userId=${userId}&transactionId=${transactionToDelete.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: 'Transaction deleted',
          description: 'The pending transaction has been cancelled'
        })
        setDeleteSheetOpen(false)
        setTransactionToDelete(null)
        fetchWalletData()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete transaction',
        variant: 'destructive'
      })
    }
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case 'purchase':
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending Approval</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your wallet balance and transactions
          </p>
        </div>
        <Button className="gap-2" onClick={() => setAddFundsAmount('50')}>
          <Plus className="h-4 w-4" />
          Quick Add 50 €
        </Button>
      </div>

      {/* Balance Card */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-4xl font-bold">
                    {loading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      `${balance.toFixed(2)} €`
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="gap-2" onClick={() => document.getElementById('add-amount')?.focus()}>
                <Plus className="h-4 w-4" />
                Add Funds
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  if (settings) {
                    setWithdrawSheetOpen(true)
                  }
                }}
              >
                <ArrowUpRight className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeposits.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWithdrawals.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <EuroIcon className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpent.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">On purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAmount.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Add Funds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Funds
            </CardTitle>
            <CardDescription>
              Deposit money into your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount (EUR)</Label>
              <Input
                id="add-amount"
                type="number"
                placeholder="0.00"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddFundsAmount('50')}
              >
                50 €
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddFundsAmount('100')}
              >
                100 €
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddFundsAmount('250')}
              >
                250 €
              </Button>
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={handleAddFunds}
              disabled={!addFundsAmount}
            >
              <Plus className="h-4 w-4" />
              Add Funds
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw Funds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5" />
              Withdraw Funds
            </CardTitle>
            <CardDescription>
              Request a withdrawal to your bank account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (EUR)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                step="0.01"
                max={balance}
              />
              <p className="text-xs text-muted-foreground">
                Available: {balance.toFixed(2)} €
              </p>
              {settings && parseFloat(withdrawAmount) > 0 && (
                <p className="text-xs text-amber-600">
                  Service fee: {settings.serviceFee.toFixed(2)} € will be deducted
                </p>
              )}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800 space-y-1">
                  <p>• Withdrawals processed within 3-5 business days</p>
                  <p>• {settings?.serviceFee.toFixed(2) || '5.00'} € service fee applies</p>
                  <p>• Withdrawal cannot be cancelled once requested</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => {
                if (parseFloat(withdrawAmount) > 0 && settings) {
                  setWithdrawSheetOpen(true)
                }
              }}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) > balance || !settings}
            >
              <ArrowUpRight className="h-4 w-4" />
              Request Withdrawal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent wallet transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold capitalize">{transaction.type}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {transaction.description}
                      </p>
                      {transaction.reference && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ref: {transaction.reference}
                        </p>
                      )}
                      {transaction.status === 'pending' && transaction.type === 'deposit' && (
                        <p className="text-xs text-amber-600 mt-1">
                          Waiting for admin approval
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'deposit' || transaction.type === 'refund'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    {transaction.deletable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setTransactionToDelete(transaction)
                          setDeleteSheetOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Transaction Sheet */}
      <Sheet open={deleteSheetOpen} onOpenChange={setDeleteSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Cancel Pending Transaction?</SheetTitle>
            <SheetDescription>
              Are you sure you want to cancel this pending deposit? This action cannot be undone.
            </SheetDescription>
          </SheetHeader>
          {transactionToDelete && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{transactionToDelete.description}</p>
              <p className="text-sm text-muted-foreground">Amount: {transactionToDelete.amount.toFixed(2)} €</p>
            </div>
          )}
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setDeleteSheetOpen(false)}>Keep Transaction</Button>
            <Button onClick={handleDeleteTransaction} variant="destructive">
              Cancel Transaction
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Withdrawal Confirmation Sheet */}
      <Sheet open={withdrawSheetOpen} onOpenChange={setWithdrawSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Confirm Withdrawal</SheetTitle>
            <SheetDescription>
              Review your withdrawal request
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            {settings && withdrawAmount && (
                <div className="mt-4 space-y-2 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Withdrawal amount:</span>
                    <span className="font-medium">{parseFloat(withdrawAmount).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service fee:</span>
                    <span className="font-medium text-red-600">-{settings.serviceFee.toFixed(2)} €</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total deduction:</span>
                    <span>{(parseFloat(withdrawAmount) + settings.serviceFee).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>You will receive:</span>
                    <span className="font-medium text-green-600">{parseFloat(withdrawAmount).toFixed(2)} €</span>
                  </div>
              </div>
            )}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                ⚠️ The {settings?.serviceFee.toFixed(2)} € service fee will be deducted immediately.
                Your withdrawal will be processed within 3-5 business days and cannot be cancelled.
              </p>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setWithdrawSheetOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdrawConfirm}>
              Confirm Withdrawal
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}