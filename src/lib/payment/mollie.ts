import { getSettings } from '@/lib/settings-db'

/**
 * Mollie Payment Integration
 * Handles Mollie checkout flow and payment processing
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
  redirectUrl: string
  webhookUrl: string
  metadata?: {
    order_id?: string
    customer_id?: string
  }
  _links: {
    checkout?: {
      href: string
      type: string
    }
  }
}

interface CreatePaymentParams {
  amount: string
  currency?: string
  description: string
  orderId?: string
  customerId?: string
  redirectUrl: string
  webhookUrl: string
  method?: string
}

interface MollieRefund {
  id: string
  paymentId: string
  amount: {
    value: string
    currency: string
  }
  status: string
}

/**
 * Get Mollie API key
 */
async function getMollieApiKey(): Promise<string> {
  const settings = await getSettings()
  const apiKey = process.env.MOLLIE_API_KEY || settings.payment?.mollie?.apiKey

  if (!apiKey) {
    throw new Error('Mollie API key not configured')
  }

  return apiKey
}

/**
 * Get Mollie API base URL
 */
function getMollieBaseUrl(): string {
  return 'https://api.mollie.com/v2'
}

/**
 * Make Mollie API request
 */
async function mollieRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = await getMollieApiKey()
  const baseUrl = getMollieBaseUrl()

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Mollie API error: ${error}`)
  }

  return await response.json()
}

/**
 * Create Mollie payment
 */
export async function createMolliePayment(params: CreatePaymentParams): Promise<MolliePayment> {
  const {
    amount,
    currency = 'EUR',
    description,
    orderId,
    customerId,
    redirectUrl,
    webhookUrl,
    method
  } = params

  const paymentData: any = {
    amount: {
      value: parseFloat(amount).toFixed(2),
      currency
    },
    description,
    redirectUrl,
    webhookUrl,
    metadata: {
      order_id: orderId,
      customer_id: customerId
    }
  }

  // Add payment method if specified
  if (method) {
    paymentData.method = method
  }

  const payment = await mollieRequest<MolliePayment>('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  })

  console.log('Mollie payment created:', {
    id: payment.id,
    status: payment.status,
    amount: payment.amount
  })

  return payment
}

/**
 * Get Mollie payment details
 */
export async function getMolliePayment(paymentId: string): Promise<MolliePayment> {
  return await mollieRequest<MolliePayment>(`/payments/${paymentId}`)
}

/**
 * Cancel Mollie payment
 */
export async function cancelMolliePayment(paymentId: string): Promise<MolliePayment> {
  return await mollieRequest<MolliePayment>(`/payments/${paymentId}`, {
    method: 'DELETE'
  })
}

/**
 * Create Mollie refund
 */
export async function createMollieRefund(
  paymentId: string,
  amount?: string,
  description?: string
): Promise<MollieRefund> {
  const refundData: any = {}

  if (amount) {
    refundData.amount = {
      value: parseFloat(amount).toFixed(2),
      currency: 'EUR'
    }
  }

  if (description) {
    refundData.description = description
  }

  const refund = await mollieRequest<MollieRefund>(`/payments/${paymentId}/refunds`, {
    method: 'POST',
    body: JSON.stringify(refundData)
  })

  console.log('Mollie refund created:', {
    id: refund.id,
    paymentId: refund.paymentId,
    amount: refund.amount,
    status: refund.status
  })

  return refund
}

/**
 * Get Mollie refund details
 */
export async function getMollieRefund(
  paymentId: string,
  refundId: string
): Promise<MollieRefund> {
  return await mollieRequest<MollieRefund>(`/payments/${paymentId}/refunds/${refundId}`)
}

/**
 * List all refunds for a payment
 */
export async function listMollieRefunds(paymentId: string): Promise<MollieRefund[]> {
  const response = await mollieRequest<{ _embedded: { refunds: MollieRefund[] } }>(
    `/payments/${paymentId}/refunds`
  )
  return response._embedded.refunds
}

/**
 * Get Mollie checkout URL from payment
 */
export function getMollieCheckoutUrl(payment: MolliePayment): string | null {
  return payment._links.checkout?.href || null
}

/**
 * Get available payment methods
 */
export async function getMolliePaymentMethods(): Promise<any[]> {
  const response = await mollieRequest<{ _embedded: { methods: any[] } }>('/methods')
  return response._embedded.methods
}

/**
 * Create Mollie order (for multi-line orders)
 */
export async function createMollieOrder(orderData: any): Promise<any> {
  return await mollieRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

/**
 * Get Mollie order details
 */
export async function getMollieOrder(orderId: string): Promise<any> {
  return await mollieRequest(`/orders/${orderId}`)
}

/**
 * Cancel Mollie order
 */
export async function cancelMollieOrder(orderId: string): Promise<any> {
  return await mollieRequest(`/orders/${orderId}`, {
    method: 'DELETE'
  })
}

/**
 * Ship Mollie order line
 */
export async function shipMollieOrderLine(orderId: string, lines: any[]): Promise<any> {
  return await mollieRequest(`/orders/${orderId}/shipments`, {
    method: 'POST',
    body: JSON.stringify({ lines })
  })
}

/**
 * Refund Mollie order line
 */
export async function refundMollieOrderLine(orderId: string, lines: any[]): Promise<any> {
  return await mollieRequest(`/orders/${orderId}/refunds`, {
    method: 'POST',
    body: JSON.stringify({ lines })
  })
}

/**
 * Check if payment is paid
 */
export function isMolliePaymentPaid(payment: MolliePayment): boolean {
  return payment.status === 'paid' || payment.status === 'authorized'
}

/**
 * Check if payment is failed
 */
export function isMolliePaymentFailed(payment: MolliePayment): boolean {
  return payment.status === 'failed' || payment.status === 'expired' || payment.status === 'canceled'
}

/**
 * Check if payment is pending
 */
export function isMolliePaymentPending(payment: MolliePayment): boolean {
  return payment.status === 'open' || payment.status === 'pending'
}

/**
 * Format Mollie amount for display
 */
export function formatMollieAmount(payment: MolliePayment): string {
  const symbol = payment.amount.currency === 'EUR' ? '€' : payment.amount.currency
  return `${symbol} ${payment.amount.value}`
}