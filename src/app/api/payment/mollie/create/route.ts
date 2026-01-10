import { NextRequest, NextResponse } from 'next/server'
import { createMolliePayment, getMollieCheckoutUrl } from '@/lib/payment/mollie'

/**
 * Mollie Payment Creation API
 * Creates a Mollie payment and returns checkout URL
 */

interface CreatePaymentRequest {
  amount: string
  description: string
  customerName: string
  customerEmail: string
  redirectUrl: string
  webhookUrl: string
  orderId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentRequest = await request.json()

    // Validate required fields
    if (!body.amount || !body.description || !body.redirectUrl || !body.webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount
    const amount = parseFloat(body.amount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create Mollie payment
    const payment = await createMolliePayment({
      amount: body.amount,
      currency: 'EUR',
      description: body.description,
      orderId: body.orderId,
      redirectUrl: body.redirectUrl,
      webhookUrl: body.webhookUrl
    })

    // Get checkout URL
    const checkoutUrl = getMollieCheckoutUrl(payment)

    if (!checkoutUrl) {
      throw new Error('Failed to get Mollie checkout URL')
    }

    console.log('Mollie payment created:', {
      paymentId: payment.id,
      amount: body.amount,
      customer: body.customerEmail
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      checkoutUrl,
      status: payment.status
    })
  } catch (error) {
    console.error('Mollie payment creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create Mollie payment'
      },
      { status: 500 }
    )
  }
}