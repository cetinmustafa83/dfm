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
}

interface UserData {
  users: any[]
  projectRequests: any[]
  payments: any[]
  purchases: any[]
  paymentMethods?: any[]
  walletTransactions?: WalletTransaction[]
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
      refundRequests: []
    }
  }
}

function writeUserData(data: UserData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// POST - Request funds to be added to wallet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, description } = body

    if (!userId || !amount || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.walletTransactions) {
      userData.walletTransactions = []
    }

    // Create a pending credit transaction for the fund request
    const newTransaction: WalletTransaction = {
      id: `wt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'credit',
      amount: parsedAmount,
      description: `Fund Request: ${description}`,
      date: new Date().toISOString(),
      status: 'pending' // Requires admin approval
    }

    userData.walletTransactions.push(newTransaction)
    writeUserData(userData)

    return NextResponse.json({
      success: true,
      message: 'Fund request submitted successfully',
      data: newTransaction
    }, { status: 201 })
  } catch (error) {
    console.error('Error requesting funds:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to request funds' },
      { status: 500 }
    )
  }
}