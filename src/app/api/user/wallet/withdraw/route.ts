import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const USER_DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')
const SETTINGS_FILE = path.join(process.cwd(), 'db/json-data/wallet-settings.json')

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

interface WalletSettings {
  serviceFee: number
  currency: string
  withdrawalSettings: {
    minWithdrawal: number
    maxWithdrawal: number
    processingTime: string
  }
}

function readUserData(): UserData {
  try {
    const data = fs.readFileSync(USER_DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      users: [],
      projectRequests: [],
      payments: [],
      purchases: [],
      walletTransactions: []
    }
  }
}

function writeUserData(data: UserData) {
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(data, null, 2))
}

function readSettings(): WalletSettings {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      serviceFee: 5,
      currency: 'EUR',
      withdrawalSettings: {
        minWithdrawal: 10,
        maxWithdrawal: 10000,
        processingTime: '3-5 business days'
      }
    }
  }
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

// POST - Request withdrawal with service fee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, bankAccountId } = body

    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, error: 'User ID and amount required' },
        { status: 400 }
      )
    }

    const withdrawalAmount = parseFloat(amount)
    const settings = readSettings()
    const serviceFee = settings.serviceFee

    // Validate amount
    if (withdrawalAmount < settings.withdrawalSettings.minWithdrawal) {
      return NextResponse.json(
        { success: false, error: `Minimum withdrawal amount is ${settings.withdrawalSettings.minWithdrawal} €` },
        { status: 400 }
      )
    }

    if (withdrawalAmount > settings.withdrawalSettings.maxWithdrawal) {
      return NextResponse.json(
        { success: false, error: `Maximum withdrawal amount is ${settings.withdrawalSettings.maxWithdrawal} €` },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.walletTransactions) {
      userData.walletTransactions = []
    }

    // Calculate current balance
    const userTransactions = userData.walletTransactions.filter(t => t.userId === userId)
    const currentBalance = calculateBalance(userTransactions)

    // Check if user has enough balance (withdrawal amount + service fee)
    const totalDeduction = withdrawalAmount + serviceFee

    if (currentBalance < totalDeduction) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient balance',
          details: {
            required: totalDeduction,
            available: currentBalance,
            breakdown: {
              withdrawal: withdrawalAmount,
              serviceFee: serviceFee
            }
          }
        },
        { status: 400 }
      )
    }

    const transactionId = `wt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create withdrawal transaction (debit for withdrawal amount)
    const withdrawalTransaction: WalletTransaction = {
      id: transactionId,
      userId,
      type: 'debit',
      amount: withdrawalAmount,
      description: `Withdrawal request to bank account`,
      date: new Date().toISOString(),
      status: 'pending',
      paymentMethod: 'bank_transfer',
      deletable: false // Withdrawals cannot be cancelled once requested
    }

    // Create service fee transaction (debit for service fee)
    const serviceFeeTransaction: WalletTransaction = {
      id: `${transactionId}_fee`,
      userId,
      type: 'debit',
      amount: serviceFee,
      description: `Service fee for withdrawal`,
      date: new Date().toISOString(),
      status: 'completed', // Service fee is deducted immediately
      paymentMethod: 'bank_transfer',
      deletable: false
    }

    userData.walletTransactions.push(withdrawalTransaction, serviceFeeTransaction)
    writeUserData(userData)

    // Calculate new balance
    const updatedTransactions = userData.walletTransactions.filter(t => t.userId === userId)
    const newBalance = calculateBalance(updatedTransactions)

    return NextResponse.json({
      success: true,
      data: {
        withdrawal: withdrawalTransaction,
        serviceFee: serviceFeeTransaction,
        balance: newBalance,
        totalDeducted: totalDeduction
      },
      message: `Withdrawal request submitted. ${serviceFee} € service fee has been deducted.`
    }, { status: 201 })
  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process withdrawal' },
      { status: 500 }
    )
  }
}