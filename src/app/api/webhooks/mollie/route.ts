import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings-db'
import crypto from 'crypto'

/**
 * Mollie Webhook Handler
 * Handles Mollie payment status updates
 * 
 * Required environment variables:
 * - MOLLIE_API_KEY
 */

interface MolliePayment {
  id: string
  mode: string
  status: 'open' | 'canceled' | 'pending' | 'authorized' | 'expired' | 'failed' | 'paid'
  amount: {
    value: string
    currency: string
  }
  description: string
  method: string
  metadata: {
    order_id?: string
    customer_id?: string
  }
  createdAt: string
  paidAt?: string
  canceledAt?: string
  expiredAt?: string
  failedAt?: string
}

/**
 * Fetch payment details from Mollie API
 */
async function fetchPaymentFromMollie(paymentId: string): Promise<MolliePayment | null> {
  try {
    const settings = await getSettings()
    const apiKey = process.env.MOLLIE_API_KEY || settings.payment?.mollie?.apiKey

    if (!apiKey) {
      console.error('Mollie API key not configured')
      return null
    }

    const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch payment from Mollie:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching payment from Mollie:', error)
    return null
  }
}

/**
 * Process payment status
 */
async function processPaymentStatus(payment: MolliePayment) {
  const { id, status, amount, metadata } = payment

  switch (status) {
    case 'paid':
      console.log('Payment completed:', id)
      // TODO: Update order status to paid in database
      // TODO: Send confirmation email to customer
      // TODO: Trigger order fulfillment
      // TODO: Create invoice
      break

    case 'failed':
      console.log('Payment failed:', id)
      // TODO: Update order status to failed
      // TODO: Send payment failure notification
      // TODO: Log failure reason
      break

    case 'canceled':
      console.log('Payment canceled:', id)
      // TODO: Update order status to canceled
      // TODO: Send cancelation notification
      break

    case 'expired':
      console.log('Payment expired:', id)
      // TODO: Update order status to expired
      // TODO: Send expiration notification
      break

    case 'pending':
      console.log('Payment pending:', id)
      // TODO: Update order status to pending
      // TODO: Wait for bank transfer confirmation
      break

    case 'authorized':
      console.log('Payment authorized:', id)
      // TODO: Update order status to authorized
      // TODO: Capture payment when ready to ship
      break

    default:
      console.log('Unhandled payment status:', status)
  }

  // Log payment event
  console.log('Payment event processed:', {
    id,
    status,
    amount: `${amount.currency} ${amount.value}`,
    orderId: metadata.order_id,
    timestamp: new Date().toISOString()
  })
}

/**
 * Verify webhook authenticity
 * Mollie doesn't use signatures, so we verify by fetching the payment
 */
async function verifyWebhook(paymentId: string): Promise<MolliePayment | null> {
  // Fetch payment details directly from Mollie API
  // This ensures the webhook is authentic
  return await fetchPaymentFromMollie(paymentId)
}

/**
 * POST /api/webhooks/mollie
 * Handle Mollie webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook body
    const body = await request.json()
    const paymentId = body.id

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    console.log('Mollie webhook received for payment:', paymentId)

    // Verify webhook by fetching payment from Mollie
    const payment = await verifyWebhook(paymentId)
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 401 }
      )
    }

    // Process payment status
    await processPaymentStatus(payment)

    // Return success (200 OK required by Mollie)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Mollie webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/mollie
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'mollie-webhook',
    timestamp: new Date().toISOString()
  })
}