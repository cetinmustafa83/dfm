import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')

interface RefundRequest {
  id: string
  userId: string
  orderId: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestDate: string
  processedDate?: string
  processedBy?: string
  adminNotes?: string
}

interface UserData {
  users: any[]
  projectRequests: any[]
  payments: any[]
  purchases: any[]
  paymentMethods?: any[]
  walletTransactions?: any[]
  refundRequests?: RefundRequest[]
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

// GET - Fetch refund requests for a user
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
    if (!userData.refundRequests) {
      userData.refundRequests = []
    }

    const userRefunds = userData.refundRequests
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())

    return NextResponse.json({
      success: true,
      data: userRefunds
    })
  } catch (error) {
    console.error('Error fetching refund requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refund requests' },
      { status: 500 }
    )
  }
}

// POST - Create new refund request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, orderId, amount, reason } = body

    if (!userId || !orderId || !amount || !reason) {
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
    if (!userData.refundRequests) {
      userData.refundRequests = []
    }

    // Check if there's already a pending refund for this order
    const existingRefund = userData.refundRequests.find(
      r => r.orderId === orderId && r.userId === userId && r.status === 'pending'
    )

    if (existingRefund) {
      return NextResponse.json(
        { success: false, error: 'A pending refund request already exists for this order' },
        { status: 409 }
      )
    }

    const newRefund: RefundRequest = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      orderId,
      amount: parsedAmount,
      reason,
      status: 'pending',
      requestDate: new Date().toISOString()
    }

    userData.refundRequests.push(newRefund)
    writeUserData(userData)

    return NextResponse.json({
      success: true,
      message: 'Refund request submitted successfully',
      data: newRefund
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating refund request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create refund request' },
      { status: 500 }
    )
  }
}

// PUT - Update refund request status (typically by admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, adminNotes, processedBy } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Refund ID and status required' },
        { status: 400 }
      )
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.refundRequests) {
      return NextResponse.json(
        { success: false, error: 'No refund requests found' },
        { status: 404 }
      )
    }

    const refundIndex = userData.refundRequests.findIndex(r => r.id === id)

    if (refundIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Refund request not found' },
        { status: 404 }
      )
    }

    // Update refund status
    userData.refundRequests[refundIndex] = {
      ...userData.refundRequests[refundIndex],
      status,
      processedDate: new Date().toISOString(),
      processedBy,
      adminNotes
    }

    // If approved, create a wallet transaction for the refund
    if (status === 'approved') {
      if (!userData.walletTransactions) {
        userData.walletTransactions = []
      }

      const refund = userData.refundRequests[refundIndex]
      
      userData.walletTransactions.push({
        id: `wt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: refund.userId,
        type: 'refund',
        amount: refund.amount,
        description: `Refund for order ${refund.orderId}`,
        date: new Date().toISOString(),
        status: 'completed'
      })
    }

    writeUserData(userData)

    return NextResponse.json({
      success: true,
      message: `Refund request ${status}`,
      data: userData.refundRequests[refundIndex]
    })
  } catch (error) {
    console.error('Error updating refund request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update refund request' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel refund request (user can only cancel pending requests)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const id = searchParams.get('id')

    if (!userId || !id) {
      return NextResponse.json(
        { success: false, error: 'User ID and refund ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    if (!userData.refundRequests) {
      return NextResponse.json(
        { success: false, error: 'No refund requests found' },
        { status: 404 }
      )
    }

    const refund = userData.refundRequests.find(
      r => r.id === id && r.userId === userId
    )

    if (!refund) {
      return NextResponse.json(
        { success: false, error: 'Refund request not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of pending requests
    if (refund.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel a processed refund request' },
        { status: 403 }
      )
    }

    userData.refundRequests = userData.refundRequests.filter(
      r => !(r.id === id && r.userId === userId)
    )

    writeUserData(userData)

    return NextResponse.json({
      success: true,
      message: 'Refund request cancelled successfully'
    })
  } catch (error) {
    console.error('Error deleting refund request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete refund request' },
      { status: 500 }
    )
  }
}