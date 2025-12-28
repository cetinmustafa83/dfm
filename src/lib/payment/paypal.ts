import { getSettings } from '@/lib/settings-db'

/**
 * PayPal Payment Integration
 * Handles PayPal checkout flow and payment processing
 * 
 * Required environment variables:
 * - PAYPAL_CLIENT_ID
 * - PAYPAL_CLIENT_SECRET
 */

interface PayPalAccessToken {
  access_token: string
  token_type: string
  expires_in: number
}

interface PayPalOrder {
  id: string
  status: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

interface CreateOrderParams {
  amount: string
  currency?: string
  description?: string
  orderId?: string
  customerId?: string
  returnUrl: string
  cancelUrl: string
}

interface CaptureOrderParams {
  orderId: string
}

/**
 * Get PayPal API base URL
 */
async function getPayPalBaseUrl(): Promise<string> {
  const settings = await getSettings()
  const isTestMode = settings.payment?.paypal?.testMode ?? true
  return isTestMode
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'
}

/**
 * Get PayPal credentials
 */
async function getPayPalCredentials() {
  const settings = await getSettings()
  
  const clientId = process.env.PAYPAL_CLIENT_ID || settings.payment?.paypal?.clientId
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || settings.payment?.paypal?.clientSecret

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  return { clientId, clientSecret }
}

/**
 * Get PayPal access token
 */
async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret } = await getPayPalCredentials()
  const baseUrl = await getPayPalBaseUrl()

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`)
  }

  const data: PayPalAccessToken = await response.json()
  return data.access_token
}

/**
 * Create PayPal order
 */
export async function createPayPalOrder(params: CreateOrderParams): Promise<PayPalOrder> {
  const {
    amount,
    currency = 'EUR',
    description = 'Order payment',
    orderId,
    customerId,
    returnUrl,
    cancelUrl
  } = params

  const accessToken = await getAccessToken()
  const baseUrl = await getPayPalBaseUrl()

  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount
        },
        description,
        custom_id: orderId,
        invoice_id: orderId
      }
    ],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      brand_name: 'Your Company',
      user_action: 'PAY_NOW'
    }
  }

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create PayPal order: ${error}`)
  }

  const order: PayPalOrder = await response.json()
  
  console.log('PayPal order created:', {
    id: order.id,
    status: order.status,
    amount,
    currency
  })

  return order
}

/**
 * Capture PayPal order
 */
export async function capturePayPalOrder(params: CaptureOrderParams): Promise<PayPalOrder> {
  const { orderId } = params

  const accessToken = await getAccessToken()
  const baseUrl = await getPayPalBaseUrl()

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to capture PayPal order: ${error}`)
  }

  const order: PayPalOrder = await response.json()
  
  console.log('PayPal order captured:', {
    id: order.id,
    status: order.status
  })

  return order
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrder(orderId: string): Promise<PayPalOrder> {
  const accessToken = await getAccessToken()
  const baseUrl = await getPayPalBaseUrl()

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal order: ${error}`)
  }

  return await response.json()
}

/**
 * Refund PayPal payment
 */
export async function refundPayPalPayment(captureId: string, amount?: string): Promise<any> {
  const accessToken = await getAccessToken()
  const baseUrl = await getPayPalBaseUrl()

  const refundData = amount
    ? {
        amount: {
          value: amount,
          currency_code: 'EUR'
        }
      }
    : {}

  const response = await fetch(`${baseUrl}/v2/payments/captures/${captureId}/refund`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(refundData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refund PayPal payment: ${error}`)
  }

  const refund = await response.json()
  
  console.log('PayPal payment refunded:', {
    id: refund.id,
    status: refund.status,
    amount: refund.amount
  })

  return refund
}

/**
 * Get PayPal checkout URL from order
 */
export function getPayPalCheckoutUrl(order: PayPalOrder): string | null {
  const approveLink = order.links.find(link => link.rel === 'approve')
  return approveLink?.href || null
}

/**
 * Verify PayPal webhook signature
 * This should be implemented when processing webhooks
 */
export async function verifyPayPalWebhookSignature(
  webhookId: string,
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  try {
    const accessToken = await getAccessToken()
    const baseUrl = await getPayPalBaseUrl()

    const verificationData = {
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      cert_url: headers['paypal-cert-url'],
      auth_algo: headers['paypal-auth-algo'],
      transmission_sig: headers['paypal-transmission-sig'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body)
    }

    const response = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(verificationData)
    })

    if (!response.ok) {
      return false
    }

    const result = await response.json()
    return result.verification_status === 'SUCCESS'
  } catch (error) {
    console.error('Error verifying PayPal webhook signature:', error)
    return false
  }
}