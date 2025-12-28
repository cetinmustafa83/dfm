'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, CreditCard, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Payment Checkout Page
 * Integrates with PayPal and Mollie payment gateways
 */

interface CheckoutFormData {
  name: string
  email: string
  amount: string
  description: string
  paymentMethod: 'paypal' | 'mollie'
}

export default function CheckoutPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    amount: '99.99',
    description: 'Service Payment',
    paymentMethod: 'paypal'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field: keyof CheckoutFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  async function handlePayPalCheckout() {
    try {
      setIsProcessing(true)
      setError('')

      // Create PayPal order
      const response = await fetch('/api/payment/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.amount,
          description: formData.description,
          customerName: formData.name,
          customerEmail: formData.email,
          returnUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create PayPal order')
      }

      const data = await response.json()
      
      // Redirect to PayPal
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      console.error('PayPal checkout error:', err)
      setError(err instanceof Error ? err.message : 'Payment failed')
      setIsProcessing(false)
    }
  }

  async function handleMollieCheckout() {
    try {
      setIsProcessing(true)
      setError('')

      // Create Mollie payment
      const response = await fetch('/api/payment/mollie/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.amount,
          description: formData.description,
          customerName: formData.name,
          customerEmail: formData.email,
          redirectUrl: `${window.location.origin}/checkout/success`,
          webhookUrl: `${window.location.origin}/api/webhooks/mollie`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create Mollie payment')
      }

      const data = await response.json()
      
      // Redirect to Mollie
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      console.error('Mollie checkout error:', err)
      setError(err instanceof Error ? err.message : 'Payment failed')
      setIsProcessing(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.amount) {
      setError('Please fill in all required fields')
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate amount
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    // Process payment
    if (formData.paymentMethod === 'paypal') {
      await handlePayPalCheckout()
    } else {
      await handleMollieCheckout()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-gray-600">Complete your payment securely</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                required
                disabled={isProcessing}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (EUR) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="99.99"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="What is this payment for?"
                disabled={isProcessing}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => handleChange('paymentMethod', value as 'paypal' | 'mollie')}
            disabled={isProcessing}
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-gray-500">Pay with PayPal or credit card</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="mollie" id="mollie" />
              <Label htmlFor="mollie" className="flex items-center gap-2 cursor-pointer flex-1">
                <Building className="h-5 w-5" />
                <div>
                  <p className="font-medium">Mollie</p>
                  <p className="text-sm text-gray-500">iDEAL, credit card, and more</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay €${formData.amount}`
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment is secured with SSL encryption. We never store your payment details.
        </p>
      </form>
    </div>
  )
}