import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')

interface PaymentMethod {
  id: string
  userId: string
  type: 'paypal' | 'mollie_card'
  email?: string
  cardLastFour?: string
  cardBrand?: string
  isDefault: boolean
  saveForFuture: boolean
  createdAt: string
}

interface UserData {
  users: any[]
  projectRequests: any[]
  payments: any[]
  purchases: any[]
  paymentMethods?: PaymentMethod[]
  walletTransactions?: any[]
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

// GET - Fetch payment methods for a user
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
    if (!userData.paymentMethods) {
      userData.paymentMethods = []
    }

    const userMethods = userData.paymentMethods.filter(m => m.userId === userId)

    return NextResponse.json({
      success: true,
      data: userMethods
    })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

// POST - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, email, cardLastFour, cardBrand, isDefault, saveForFuture } = body

    if (!userId || !type) {
      return NextResponse.json(
        { success: false, error: 'User ID and type required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.paymentMethods) {
      userData.paymentMethods = []
    }

    // If this is set as default, remove default from other methods
    if (isDefault) {
      userData.paymentMethods = userData.paymentMethods.map(m => 
        m.userId === userId ? { ...m, isDefault: false } : m
      )
    }

    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      email: type === 'paypal' ? email : undefined,
      cardLastFour: type === 'mollie_card' ? cardLastFour : undefined,
      cardBrand: type === 'mollie_card' ? cardBrand : undefined,
      isDefault: isDefault || userData.paymentMethods.filter(m => m.userId === userId).length === 0,
      saveForFuture: saveForFuture !== undefined ? saveForFuture : true,
      createdAt: new Date().toISOString()
    }

    userData.paymentMethods.push(newMethod)
    writeUserData(userData)

    return NextResponse.json({
      success: true,
      data: newMethod
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment method' },
      { status: 500 }
    )
  }
}

// PUT - Update payment method (e.g., set as default)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, id, isDefault } = body

    if (!userId || !id) {
      return NextResponse.json(
        { success: false, error: 'User ID and payment method ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.paymentMethods) {
      return NextResponse.json(
        { success: false, error: 'No payment methods found' },
        { status: 404 }
      )
    }

    const methodIndex = userData.paymentMethods.findIndex(
      m => m.id === id && m.userId === userId
    )

    if (methodIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment method not found' },
        { status: 404 }
      )
    }

    // If setting as default, remove default from other methods
    if (isDefault) {
      userData.paymentMethods = userData.paymentMethods.map(m =>
        m.userId === userId ? { ...m, isDefault: false } : m
      )
    }

    userData.paymentMethods[methodIndex] = {
      ...userData.paymentMethods[methodIndex],
      isDefault
    }

    writeUserData(userData)

    return NextResponse.json({
      success: true,
      data: userData.paymentMethods[methodIndex]
    })
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payment method' },
      { status: 500 }
    )
  }
}

// DELETE - Remove payment method
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const id = searchParams.get('id')

    if (!userId || !id) {
      return NextResponse.json(
        { success: false, error: 'User ID and payment method ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.paymentMethods) {
      return NextResponse.json(
        { success: false, error: 'No payment methods found' },
        { status: 404 }
      )
    }

    const methodToDelete = userData.paymentMethods.find(
      m => m.id === id && m.userId === userId
    )

    if (!methodToDelete) {
      return NextResponse.json(
        { success: false, error: 'Payment method not found' },
        { status: 404 }
      )
    }

    // Remove the method
    userData.paymentMethods = userData.paymentMethods.filter(
      m => !(m.id === id && m.userId === userId)
    )

    // If deleted method was default, set first remaining method as default
    if (methodToDelete.isDefault) {
      const userMethods = userData.paymentMethods.filter(m => m.userId === userId)
      if (userMethods.length > 0) {
        const firstMethodIndex = userData.paymentMethods.findIndex(
          m => m.id === userMethods[0].id
        )
        if (firstMethodIndex !== -1) {
          userData.paymentMethods[firstMethodIndex].isDefault = true
        }
      }
    }

    writeUserData(userData)

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment method' },
      { status: 500 }
    )
  }
}