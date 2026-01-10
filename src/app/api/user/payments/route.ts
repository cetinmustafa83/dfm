import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')

interface Payment {
  id: string
  packageName: string
  amount: string
  status: 'paid' | 'pending' | 'failed'
  paymentDate: string
  invoiceNumber: string
}

interface UserData {
  projectRequests: any[]
  payments: Payment[]
  purchases: any[]
}

function readUserData(): UserData {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      projectRequests: [],
      payments: [],
      purchases: []
    }
  }
}

function writeUserData(data: UserData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// GET - Fetch all payments
export async function GET() {
  try {
    const userData = readUserData()
    return NextResponse.json({ payments: userData.payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST - Create new payment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userData = readUserData()

    const newPayment: Payment = {
      id: Date.now().toString(),
      packageName: body.packageName,
      amount: body.amount,
      status: body.status || 'pending',
      paymentDate: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${Date.now()}`
    }

    userData.payments.push(newPayment)
    writeUserData(userData)

    return NextResponse.json(newPayment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// PUT - Update payment
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const userData = readUserData()

    const index = userData.payments.findIndex((p) => p.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    userData.payments[index] = {
      ...userData.payments[index],
      ...body
    }

    writeUserData(userData)
    return NextResponse.json(userData.payments[index])
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete payment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    userData.payments = userData.payments.filter((p) => p.id !== id)
    writeUserData(userData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}