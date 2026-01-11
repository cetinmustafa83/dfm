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
 * PayPal Webhook Handler
 * Handles PayPal IPN (Instant Payment Notification) events
 * 
 * Required environment variables:
 * - PAYPAL_CLIENT_ID
 * - PAYPAL_CLIENT_SECRET
 * - PAYPAL_WEBHOOK_ID
 */

interface PayPalWebhookEvent {
  id: string
  event_type: string
  create_time: string
  resource_type: string
  resource: {
    id: string
    status: string
    amount?: {
      currency_code: string
      value: string
    }
    custom_id?: string
    invoice_id?: string
  }
  summary: string
}

/**
 * Verify PayPal webhook signature
 */
async function verifyWebhookSignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  try {
    const settings = await getSettings()
    const webhookId = process.env.PAYPAL_WEBHOOK_ID || settings.payment?.paypal?.webhookId

    if (!webhookId) {
      console.error('PayPal webhook ID not configured')
      return false
    }

    // Get headers
    const transmissionId = request.headers.get('paypal-transmission-id')
    const transmissionTime = request.headers.get('paypal-transmission-time')
    const certUrl = request.headers.get('paypal-cert-url')
    const authAlgo = request.headers.get('paypal-auth-algo')
    const transmissionSig = request.headers.get('paypal-transmission-sig')

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      console.error('Missing PayPal webhook headers')
      return false
    }

    // In production, verify with PayPal API
    // For now, return true if test mode
    if (settings.payment?.paypal?.testMode) {
      return true
    }

    // TODO: Implement actual signature verification
    // const isValid = await verifyWithPayPalAPI(...)

    return true
  } catch (error) {
    console.error('Error verifying PayPal webhook signature:', error)
    return false
  }
}

/**
 * Process payment event
 */
async function processPaymentEvent(event: PayPalWebhookEvent) {
  const { event_type, resource } = event

  switch (event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      console.log('Payment captured:', resource.id)
      if (resource.custom_id) {
        const dbPayment = await prisma.payment.update({
          where: { id: resource.custom_id },
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

    case 'PAYMENT.CAPTURE.DENIED':
      console.log('Payment denied:', resource.id)
      if (resource.custom_id) {
        await prisma.payment.update({
          where: { id: resource.custom_id },
          data: { status: 'failed' }
        })
      }
      break

    case 'PAYMENT.CAPTURE.REFUNDED':
      console.log('Payment refunded:', resource.id)
      if (resource.custom_id) {
        await prisma.payment.update({
          where: { id: resource.custom_id },
          data: { status: 'refunded' }
        })
      }
      break

    case 'CHECKOUT.ORDER.APPROVED':
      console.log('Order approved:', resource.id)
      break

    case 'CHECKOUT.ORDER.COMPLETED':
      console.log('Order completed:', resource.id)
      break

    default:
      console.log('Unhandled event type:', event_type)
  }
}

/**
 * POST /api/webhooks/paypal
 * Handle PayPal webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(request, body)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse event
    const event: PayPalWebhookEvent = JSON.parse(body)

    console.log('PayPal webhook received:', {
      id: event.id,
      type: event.event_type,
      resource_id: event.resource.id
    })

    // Process event
    await processPaymentEvent(event)

    // Return success
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/paypal
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'paypal-webhook',
    timestamp: new Date().toISOString()
  })
}