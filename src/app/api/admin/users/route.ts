import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')

interface UserData {
  users: any[]
  projectRequests: any[]
  payments: any[]
  purchases: any[]
  paymentMethods?: any[]
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

// GET - Fetch all users (admin view)
export async function GET(request: NextRequest) {
  try {
    const userData = readUserData()
    
    // Return users with basic info (no sensitive data like passwords)
    const users = userData.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}