import { NextRequest, NextResponse } from 'next/server'
import { settingsDb } from '@/lib/settings-db'

export async function GET() {
  try {
    const settings = await settingsDb.getAll()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, data } = body

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Missing section or data' },
        { status: 400 }
      )
    }

    console.log('Updating settings:', { section, data })

    switch (section) {
      case 'general':
        await settingsDb.updateGeneral(data)
        break
      case 'payment':
        await settingsDb.updatePayment(data)
        break
      case 'invoice':
        await settingsDb.updateInvoice(data)
        break
      case 'ai':
        await settingsDb.updateAI(data)
        break
      case 'google':
        await settingsDb.updateGoogle(data)
        break
      case 'legal':
        await settingsDb.updateLegal(data)
        break
      default:
        return NextResponse.json(
          { error: `Invalid section: ${section}` },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update settings'
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    )
  }
}