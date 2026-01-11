import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/invoice/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceNumber, customerEmail, invoiceData } = body

    if (!invoiceNumber || !customerEmail || !invoiceData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate PDF and send email
    const success = await sendInvoiceEmail(invoiceData, customerEmail)

    if (!success) {
      throw new Error('Failed to send email via transport')
    }

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoiceNumber} sent to ${customerEmail}`
    })
  } catch (error) {
    console.error('Error sending invoice email:', error)
    return NextResponse.json(
      { error: 'Failed to send invoice email' },
      { status: 500 }
    )
  }
}