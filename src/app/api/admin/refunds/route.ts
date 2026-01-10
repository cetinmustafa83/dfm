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
  itemType?: string
  itemName?: string
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

// GET - Fetch all refund requests (admin view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // optional filter

    const userData = readUserData()
    if (!userData.refundRequests) {
      userData.refundRequests = []
    }

    let refunds = userData.refundRequests

    // Filter by status if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      refunds = refunds.filter(r => r.status === status)
    }

    // Sort by request date (newest first)
    refunds.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())

    return NextResponse.json({
      success: true,
      data: refunds
    })
  } catch (error) {
    console.error('Error fetching refund requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refund requests' },
      { status: 500 }
    )
  }
}