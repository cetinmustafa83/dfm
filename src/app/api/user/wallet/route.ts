import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')

interface WalletTransaction {
  id: string
  userId: string
  type: 'credit' | 'debit' | 'refund'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  paymentMethod?: 'bank_transfer' | 'card' | 'paypal' | 'mollie'
  deletable?: boolean
}

interface UserData {
  users: any[]
  projectRequests: any[]
  payments: any[]
  purchases: any[]
  paymentMethods?: any[]
  walletTransactions?: WalletTransaction[]
  walletBalances?: { userId: string; balance: number }[]
  refundRequests?: any[]
}

function readUserData(): UserData {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      users: [],
      projectRequests: [],
      payments: [],
      purchases: [],
      paymentMethods: [],
      walletTransactions: [],
      walletBalances: [],
      refundRequests: []
    }
  }
}

function writeUserData(data: UserData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

function calculateBalance(transactions: WalletTransaction[]): number {
  return transactions
    .filter(t => t.status === 'completed')
    .reduce((balance, transaction) => {
      if (transaction.type === 'credit' || transaction.type === 'refund') {
        return balance + transaction.amount
      } else if (transaction.type === 'debit') {
        return balance - transaction.amount
      }
      return balance
    }, 0)
}

// GET - Fetch wallet data (balance and transactions)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.walletTransactions) {
      userData.walletTransactions = []
    }

    const userTransactions = userData.walletTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const balance = calculateBalance(userTransactions)

    return NextResponse.json({
      success: true,
      data: {
        balance,
        transactions: userTransactions
      }
    })
  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet data' },
      { status: 500 }
    )
  }
}

// POST - Create wallet transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, amount, description, status, paymentMethod } = body

    if (!userId || !type || !amount || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['credit', 'debit', 'refund'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction type' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.walletTransactions) {
      userData.walletTransactions = []
    }

    // Determine if transaction is deletable
    // Bank transfers are pending and deletable until approved
    // Card/PayPal payments are instant and not deletable
    const transactionStatus = status || (paymentMethod === 'bank_transfer' ? 'pending' : 'completed')
    const isDeletable = paymentMethod === 'bank_transfer' && transactionStatus === 'pending'

    const newTransaction: WalletTransaction = {
      id: `wt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      status: transactionStatus,
      paymentMethod,
      deletable: isDeletable
    }

    userData.walletTransactions.push(newTransaction)
    writeUserData(userData)

    // Calculate new balance (only completed transactions)
    const userTransactions = userData.walletTransactions.filter(t => t.userId === userId)
    const balance = calculateBalance(userTransactions)

    return NextResponse.json({
      success: true,
      data: {
        transaction: newTransaction,
        balance
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating wallet transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create wallet transaction' },
      { status: 500 }
    )
  }
}

// PUT - Update transaction status (admin approval)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, id, status } = body

    if (!userId || !id || !status) {
      return NextResponse.json(
        { success: false, error: 'User ID, transaction ID, and status required' },
        { status: 400 }
      )
    }

    if (!['completed', 'pending', 'failed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.walletTransactions) {
      return NextResponse.json(
        { success: false, error: 'No transactions found' },
        { status: 404 }
      )
    }

    const transactionIndex = userData.walletTransactions.findIndex(
      t => t.id === id && t.userId === userId
    )

    if (transactionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    userData.walletTransactions[transactionIndex].status = status
    // Once approved, no longer deletable
    if (status === 'completed') {
      userData.walletTransactions[transactionIndex].deletable = false
    }
    writeUserData(userData)

    // Calculate new balance
    const userTransactions = userData.walletTransactions.filter(t => t.userId === userId)
    const balance = calculateBalance(userTransactions)

    return NextResponse.json({
      success: true,
      data: {
        transaction: userData.walletTransactions[transactionIndex],
        balance
      }
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a pending transaction (user can cancel)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const transactionId = searchParams.get('transactionId')

    if (!userId || !transactionId) {
      return NextResponse.json(
        { success: false, error: 'User ID and transaction ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.walletTransactions) {
      return NextResponse.json(
        { success: false, error: 'No transactions found' },
        { status: 404 }
      )
    }

    const transactionIndex = userData.walletTransactions.findIndex(
      t => t.id === transactionId && t.userId === userId
    )

    if (transactionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    const transaction = userData.walletTransactions[transactionIndex]

    // Only allow deletion of deletable transactions (pending bank transfers)
    if (!transaction.deletable) {
      return NextResponse.json(
        { success: false, error: 'This transaction cannot be deleted' },
        { status: 403 }
      )
    }

    // Remove the transaction
    userData.walletTransactions.splice(transactionIndex, 1)
    writeUserData(userData)

    // Calculate new balance
    const userTransactions = userData.walletTransactions.filter(t => t.userId === userId)
    const balance = calculateBalance(userTransactions)

    return NextResponse.json({
      success: true,
      data: { balance },
      message: 'Transaction deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}