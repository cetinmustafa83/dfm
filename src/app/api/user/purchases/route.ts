import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')

interface Purchase {
  id: string
  itemName: string
  category: string
  price: string
  purchaseDate: string
  status: 'active' | 'expired'
  downloadLink?: string
}

interface UserData {
  projectRequests: any[]
  payments: any[]
  purchases: Purchase[]
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

// GET - Fetch all purchases
export async function GET() {
  try {
    const userData = readUserData()
    return NextResponse.json({ purchases: userData.purchases })
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    )
  }
}

// POST - Create new purchase
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userData = readUserData()

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      itemName: body.itemName,
      category: body.category,
      price: body.price,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'active',
      downloadLink: body.downloadLink
    }

    userData.purchases.push(newPurchase)
    writeUserData(userData)

    return NextResponse.json(newPurchase, { status: 201 })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    )
  }
}

// PUT - Update purchase
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const userData = readUserData()

    const index = userData.purchases.findIndex((p) => p.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    userData.purchases[index] = {
      ...userData.purchases[index],
      ...body
    }

    writeUserData(userData)
    return NextResponse.json(userData.purchases[index])
  } catch (error) {
    console.error('Error updating purchase:', error)
    return NextResponse.json(
      { error: 'Failed to update purchase' },
      { status: 500 }
    )
  }
}

// DELETE - Delete purchase
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Purchase ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    userData.purchases = userData.purchases.filter((p) => p.id !== id)
    writeUserData(userData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting purchase:', error)
    return NextResponse.json(
      { error: 'Failed to delete purchase' },
      { status: 500 }
    )
  }
}