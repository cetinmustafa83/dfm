import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const settingsFilePath = path.join(process.cwd(), 'db', 'json-data', 'payment-settings.json')

function readSettings() {
  try {
    const data = fs.readFileSync(settingsFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading payment settings:', error)
    return { paymentGateways: [], bankAccounts: [] }
  }
}

function writeSettings(data: any) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing payment settings:', error)
    return false
  }
}

// GET all payment settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'gateways', 'banks', or null for all
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const data = readSettings()

    let result: any = {}

    if (!type || type === 'gateways') {
      result.paymentGateways = activeOnly 
        ? data.paymentGateways.filter((g: any) => g.status === 'active')
        : data.paymentGateways
    }

    if (!type || type === 'banks') {
      result.bankAccounts = activeOnly
        ? data.bankAccounts.filter((b: any) => b.status === 'active')
        : data.bankAccounts
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error in GET /api/payment-settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment settings' },
      { status: 500 }
    )
  }
}

// POST - Add new payment gateway or bank account (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type } = body // 'gateway' or 'bank'
    const data = readSettings()

    if (type === 'gateway') {
      const newGateway = {
        id: Date.now().toString(),
        name: body.name, // 'PayPal', 'Mollie', etc.
        type: body.gatewayType, // 'paypal', 'mollie', 'stripe'
        status: body.status || 'active',
        credentials: {
          clientId: body.clientId || '',
          clientSecret: body.clientSecret || '',
          apiKey: body.apiKey || '',
          webhookSecret: body.webhookSecret || '',
        },
        settings: {
          currency: body.currency || 'EUR',
          testMode: body.testMode || false,
        },
        createdAt: new Date().toISOString(),
      }

      data.paymentGateways.push(newGateway)
    } else if (type === 'bank') {
      const newBankAccount = {
        id: Date.now().toString(),
        bankName: body.bankName,
        accountHolder: body.accountHolder,
        iban: body.iban,
        bic: body.bic || '',
        accountNumber: body.accountNumber || '',
        routingNumber: body.routingNumber || '',
        swiftCode: body.swiftCode || '',
        status: body.status || 'active',
        instructions: body.instructions || '',
        createdAt: new Date().toISOString(),
      }

      data.bankAccounts.push(newBankAccount)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be "gateway" or "bank"' },
        { status: 400 }
      )
    }

    if (writeSettings(data)) {
      return NextResponse.json({
        success: true,
        data: type === 'gateway' ? data.paymentGateways[data.paymentGateways.length - 1] : data.bankAccounts[data.bankAccounts.length - 1],
        message: `${type === 'gateway' ? 'Payment gateway' : 'Bank account'} added successfully`,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in POST /api/payment-settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add payment method' },
      { status: 500 }
    )
  }
}

// PUT - Update payment gateway or bank account (Admin only)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, type } = body
    const data = readSettings()

    if (type === 'gateway') {
      const index = data.paymentGateways.findIndex((g: any) => g.id === id)
      
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Payment gateway not found' },
          { status: 404 }
        )
      }

      data.paymentGateways[index] = {
        ...data.paymentGateways[index],
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      }
    } else if (type === 'bank') {
      const index = data.bankAccounts.findIndex((b: any) => b.id === id)
      
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Bank account not found' },
          { status: 404 }
        )
      }

      data.bankAccounts[index] = {
        ...data.bankAccounts[index],
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be "gateway" or "bank"' },
        { status: 400 }
      )
    }

    if (writeSettings(data)) {
      return NextResponse.json({
        success: true,
        data: type === 'gateway' 
          ? data.paymentGateways.find((g: any) => g.id === id)
          : data.bankAccounts.find((b: any) => b.id === id),
        message: 'Settings updated successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in PUT /api/payment-settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payment method' },
      { status: 500 }
    )
  }
}

// DELETE - Delete payment gateway or bank account (Admin only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type') // 'gateway' or 'bank'

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'ID and type are required' },
        { status: 400 }
      )
    }

    const data = readSettings()

    if (type === 'gateway') {
      const initialLength = data.paymentGateways.length
      data.paymentGateways = data.paymentGateways.filter((g: any) => g.id !== id)

      if (data.paymentGateways.length === initialLength) {
        return NextResponse.json(
          { success: false, error: 'Payment gateway not found' },
          { status: 404 }
        )
      }
    } else if (type === 'bank') {
      const initialLength = data.bankAccounts.length
      data.bankAccounts = data.bankAccounts.filter((b: any) => b.id !== id)

      if (data.bankAccounts.length === initialLength) {
        return NextResponse.json(
          { success: false, error: 'Bank account not found' },
          { status: 404 }
        )
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be "gateway" or "bank"' },
        { status: 400 }
      )
    }

    if (writeSettings(data)) {
      return NextResponse.json({
        success: true,
        message: `${type === 'gateway' ? 'Payment gateway' : 'Bank account'} deleted successfully`,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete payment method' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/payment-settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment method' },
      { status: 500 }
    )
  }
}