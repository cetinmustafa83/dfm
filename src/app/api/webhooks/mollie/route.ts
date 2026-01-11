import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings-db'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import {
  generateInvoiceNumber,
  calculateInvoiceTotals,
  saveInvoiceToDatabase,
  sendInvoiceEmail
} from '@/lib/invoice/pdf-generator'
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

      if (metadata.order_id) {
        // Update payment status in database
        const dbPayment = await prisma.payment.update({
          where: { id: metadata.order_id },
          data: { status: 'completed' }
        })

        // Generate and send invoice
        const invoiceNumber = await generateInvoiceNumber()
        const invoiceData = {
          invoiceNumber,
          invoiceDate: new Date().toISOString(),
          customerName: dbPayment.description?.split(' for ')[1] || 'Customer',
          customerEmail: (await prisma.customer.findUnique({ where: { id: dbPayment.customerId } }))?.email || '',
          items: [
            {
              description: dbPayment.description || 'Service Purchase',
              quantity: 1,
              unitPrice: dbPayment.amount,
              total: dbPayment.amount
            }
          ],
          ...calculateInvoiceTotals([{ description: '', quantity: 1, unitPrice: dbPayment.amount, total: dbPayment.amount }])
        }

        await saveInvoiceToDatabase(invoiceData as any, dbPayment.id)
        if (invoiceData.customerEmail) {
          await sendInvoiceEmail(invoiceData as any, invoiceData.customerEmail)
        }
      }
      break

    case 'failed':
      console.log('Payment failed:', id)
      if (metadata.order_id) {
        await prisma.payment.update({
          where: { id: metadata.order_id },
          data: { status: 'failed' }
        })
      }
      break

    case 'canceled':
      console.log('Payment canceled:', id)
      if (metadata.order_id) {
        await prisma.payment.update({
          where: { id: metadata.order_id },
          data: { status: 'canceled' }
        })
      }
      break

    case 'expired':
      console.log('Payment expired:', id)
      if (metadata.order_id) {
        await prisma.payment.update({
          where: { id: metadata.order_id },
          data: { status: 'failed' } // Expired is effectively failed
        })
      }
      break

    case 'pending':
    case 'open':
      console.log('Payment pending:', id)
      if (metadata.order_id) {
        await prisma.payment.update({
          where: { id: metadata.order_id },
          data: { status: 'pending' }
        })
      }
      break

    case 'authorized':
      console.log('Payment authorized:', id)
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