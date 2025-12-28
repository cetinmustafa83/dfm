import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder, getPayPalCheckoutUrl } from '@/lib/payment/paypal'

/**
 * PayPal Payment Creation API
 * Creates a PayPal order and returns checkout URL
 */

interface CreatePaymentRequest {
  amount: string
  description: string
  customerName: string
  customerEmail: string
  returnUrl: string
  cancelUrl: string
  orderId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentRequest = await request.json()

    // Validate required fields
    if (!body.amount || !body.description || !body.returnUrl || !body.cancelUrl) {
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

    // Create PayPal order
    const order = await createPayPalOrder({
      amount: body.amount,
      currency: 'EUR',
      description: body.description,
      orderId: body.orderId,
      returnUrl: body.returnUrl,
      cancelUrl: body.cancelUrl
    })

    // Get checkout URL
    const checkoutUrl = getPayPalCheckoutUrl(order)

    if (!checkoutUrl) {
      throw new Error('Failed to get PayPal checkout URL')
    }

    console.log('PayPal order created:', {
      orderId: order.id,
      amount: body.amount,
      customer: body.customerEmail
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      checkoutUrl,
      status: order.status
    })
  } catch (error) {
    console.error('PayPal order creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create PayPal order'
      },
      { status: 500 }
    )
  }
}