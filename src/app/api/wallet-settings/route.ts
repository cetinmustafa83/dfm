import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SETTINGS_FILE = path.join(process.cwd(), 'db/json-data/wallet-settings.json')

interface WalletSettings {
  serviceFee: number
  currency: string
  withdrawalSettings: {
    minWithdrawal: number
    maxWithdrawal: number
    processingTime: string
  }
  depositSettings: {
    bankTransferRequiresApproval: boolean
    cardDepositInstant: boolean
    paypalDepositInstant: boolean
  }
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
      },
      depositSettings: {
        bankTransferRequiresApproval: true,
        cardDepositInstant: true,
        paypalDepositInstant: true
      }
    }
  }
}

function writeSettings(settings: WalletSettings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

// GET - Fetch wallet settings
export async function GET() {
  try {
    const settings = readSettings()
    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Error fetching wallet settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet settings' },
      { status: 500 }
    )
  }
}

// PUT - Update wallet settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceFee, withdrawalSettings, depositSettings } = body

    const currentSettings = readSettings()
    
    const updatedSettings: WalletSettings = {
      ...currentSettings,
      ...(serviceFee !== undefined && { serviceFee: parseFloat(serviceFee) }),
      ...(withdrawalSettings && { withdrawalSettings: { ...currentSettings.withdrawalSettings, ...withdrawalSettings } }),
      ...(depositSettings && { depositSettings: { ...currentSettings.depositSettings, ...depositSettings } })
    }

    writeSettings(updatedSettings)

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Wallet settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating wallet settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet settings' },
      { status: 500 }
    )
  }
}