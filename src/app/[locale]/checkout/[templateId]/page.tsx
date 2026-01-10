'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2,
  Code,
  Wallet,
  Calendar,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  category: string
  productType: string
  price: number
  currency: string
  paymentType: 'one-time' | 'monthly'
  image: string
  technologies: string[]
  features: string[]
  includedItems: string[]
}

interface PaymentGateway {
  id: string
  name: string
  type: string
  status: string
}

interface BankAccount {
  id: string
  bankName: string
  accountHolder: string
  iban: string
  bic: string
  instructions: string
  status: string
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const itemId = params.templateId as string

  const [item, setItem] = useState<MarketplaceItem | null>(null)
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [paymentMode, setPaymentMode] = useState<'saved' | 'manual'>('saved')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    company: '',
  })

  useEffect(() => {
    fetchData()
  }, [itemId])

  async function fetchData() {
    try {
      setLoading(true)

      // Fetch marketplace item details
      const itemRes = await fetch(`/api/marketplace`)
      const itemData = await itemRes.json()
      const foundItem = itemData.data.find((i: MarketplaceItem) => i.id === itemId)

      if (!foundItem) {
        toast({
          title: 'Product not found',
          description: 'The requested product could not be found',
          variant: 'destructive',
        })
        router.push('/marketplace')
        return
      }

      setItem(foundItem)

      // Fetch wallet balance
      const userId = 'user_123' // Mock - would come from auth
      const walletRes = await fetch(`/api/user/wallet?userId=${userId}`)
      const walletData = await walletRes.json()
      if (walletData.success) {
        setWalletBalance(walletData.data.balance || 0)
      }

      // Fetch payment settings
      const paymentRes = await fetch('/api/payment-settings?activeOnly=true')
      const paymentData = await paymentRes.json()

      if (paymentData.success) {
        setPaymentGateways(paymentData.data.paymentGateways || [])
        setBankAccounts(paymentData.data.bankAccounts || [])

        // Auto-select payment method based on priority: wallet > gateway > bank
        if (walletData.success && walletData.data.balance >= foundItem.price) {
          setSelectedPaymentMethod('wallet')
        } else if (paymentData.data.paymentGateways?.length > 0) {
          setSelectedPaymentMethod(`gateway-${paymentData.data.paymentGateways[0].id}`)
        } else if (paymentData.data.bankAccounts?.length > 0) {
          setSelectedPaymentMethod(`bank-${paymentData.data.bankAccounts[0].id}`)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load checkout information',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedPaymentMethod) {
      toast({
        title: 'Payment method required',
        description: 'Please select a payment method',
        variant: 'destructive',
      })
      return
    }

    if (!item) return

    setProcessing(true)

    try {
      // Handle wallet payment
      if (selectedPaymentMethod === 'wallet') {
        if (walletBalance < item.price) {
          toast({
            title: 'Insufficient balance',
            description: 'Please select another payment method',
            variant: 'destructive',
          })
          setProcessing(false)
          return
        }

        // Process wallet payment
        const userId = 'user_123' // Mock - would come from auth
        const response = await fetch('/api/user/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            type: 'debit',
            amount: item.price,
            description: `Purchase: ${item.name}`,
            status: 'completed'
          })
        })

        const result = await response.json()
        if (result.success) {
          toast({
            title: 'Payment successful',
            description: 'Your purchase has been completed using your wallet',
          })
          router.push(`/checkout/success?method=wallet&itemId=${itemId}`)
          return
        } else {
          throw new Error('Wallet payment failed')
        }
      }

      const [type, id] = selectedPaymentMethod.split('-')

      if (type === 'gateway') {
        // Find the selected gateway
        const gateway = paymentGateways.find(g => g.id === id)
        
        if (gateway) {
          if (gateway.type === 'paypal') {
            toast({
              title: 'Redirecting to PayPal',
              description: 'You will be redirected to PayPal to complete your payment',
            })
            setTimeout(() => {
              window.location.href = '/api/checkout/paypal?itemId=' + itemId
            }, 1500)
          } else if (gateway.type === 'mollie') {
            toast({
              title: 'Redirecting to Mollie',
              description: 'You will be redirected to Mollie to complete your payment',
            })
            setTimeout(() => {
              window.location.href = '/api/checkout/mollie?itemId=' + itemId
            }, 1500)
          }
        }
      } else if (type === 'bank') {
        const bank = bankAccounts.find(b => b.id === id)
        if (bank) {
          toast({
            title: 'Bank Transfer Instructions',
            description: 'Your order has been created. Please complete the bank transfer to activate your purchase.',
          })
          router.push(`/checkout/success?method=bank&itemId=${itemId}&bankId=${id}`)
        }
      }
    } catch (error) {
      console.error('Error processing checkout:', error)
      toast({
        title: 'Checkout failed',
        description: 'An error occurred while processing your payment',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const hasPaymentMethods = paymentGateways.length > 0 || bankAccounts.length > 0

  const getProductTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'website-basic': 'Basic Website',
      'website-premium': 'Premium Website',
      'website-onepage': 'One Page Website',
      'website-multipage': 'Multi Page Website',
      'website-landing': 'Landing Page',
      'language-pack': 'Language Pack',
      'seo-package': 'SEO Package',
      'extra-license': 'Extra License',
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/marketplace" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">ModernAgency</span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketplace">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Customer Info & Payment Method */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Checkout</CardTitle>
                      <CardDescription>Complete your purchase</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={paymentMode === 'saved' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMode('saved')}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Use saved payment methods
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMode === 'manual' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMode('manual')}
                        className="text-xs"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Enter manually each time
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={customerInfo.company}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                        placeholder="Company Name"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                  {item.paymentType === 'monthly' && (
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      This is a monthly subscription
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Wallet Payment (Priority) */}
                  <div
                    onClick={() => walletBalance >= item.price && setSelectedPaymentMethod('wallet')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'wallet'
                        ? 'border-primary bg-primary/5'
                        : walletBalance < item.price
                        ? 'border-border opacity-50 cursor-not-allowed'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedPaymentMethod === 'wallet' ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <Wallet className={`h-5 w-5 ${
                          selectedPaymentMethod === 'wallet' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Wallet Balance</h4>
                        <p className="text-sm text-muted-foreground">
                          Available: {walletBalance.toFixed(2)} {item.currency}
                        </p>
                        {walletBalance < item.price && (
                          <p className="text-xs text-red-600 mt-1">
                            Insufficient balance
                          </p>
                        )}
                      </div>
                      {selectedPaymentMethod === 'wallet' && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>

                  {walletBalance < item.price && (
                    <p className="text-xs text-muted-foreground text-center">
                      Other payment methods available below
                    </p>
                  )}

                  {!hasPaymentMethods ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Additional Payment Methods</h3>
                      <p className="text-muted-foreground">
                        Please add funds to your wallet or contact support.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Payment Gateways */}
                      {paymentGateways.map((gateway) => (
                        <div
                          key={gateway.id}
                          onClick={() => setSelectedPaymentMethod(`gateway-${gateway.id}`)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedPaymentMethod === `gateway-${gateway.id}`
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedPaymentMethod === `gateway-${gateway.id}` ? 'bg-primary/20' : 'bg-muted'
                            }`}>
                              <CreditCard className={`h-5 w-5 ${
                                selectedPaymentMethod === `gateway-${gateway.id}` ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{gateway.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                Pay with {gateway.type}
                              </p>
                            </div>
                            {selectedPaymentMethod === `gateway-${gateway.id}` && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Bank Transfer */}
                      {bankAccounts.map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedPaymentMethod(`bank-${bank.id}`)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedPaymentMethod === `bank-${bank.id}`
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedPaymentMethod === `bank-${bank.id}` ? 'bg-primary/20' : 'bg-muted'
                            }`}>
                              <Building2 className={`h-5 w-5 ${
                                selectedPaymentMethod === `bank-${bank.id}` ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Bank Transfer</h4>
                              <p className="text-sm text-muted-foreground">
                                {bank.bankName}
                              </p>
                            </div>
                            {selectedPaymentMethod === `bank-${bank.id}` && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product Info */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{item.name}</h4>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {getProductTypeLabel(item.productType)}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Included Items */}
                  {item.includedItems && item.includedItems.length > 0 && (
                    <>
                      <div>
                        <p className="text-sm font-medium mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.includedItems.map((included, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {included}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Technologies */}
                  {item.technologies && item.technologies.length > 0 && (
                    <>
                      <div>
                        <p className="text-sm font-medium mb-2">Technologies:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.technologies.slice(0, 4).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {item.technologies.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.technologies.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{item.price.toFixed(2)} {item.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Type</span>
                      <Badge variant={item.paymentType === 'one-time' ? 'default' : 'secondary'}>
                        {item.paymentType === 'one-time' ? 'One-Time' : 'Monthly'}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>
                        {item.price.toFixed(2)} {item.currency}
                        {item.paymentType === 'monthly' && <span className="text-sm font-normal">/mo</span>}
                      </span>
                    </div>
                    {item.paymentType === 'monthly' && (
                      <p className="text-xs text-muted-foreground">
                        Recurring monthly payment
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={processing || !selectedPaymentMethod || (selectedPaymentMethod === 'wallet' && walletBalance < item.price)}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : selectedPaymentMethod === 'wallet' ? (
                      <>Pay from Wallet</>
                    ) : (
                      <>Complete Purchase</>
                    )}
                  </Button>

                  {selectedPaymentMethod === 'wallet' && walletBalance < item.price && (
                    <p className="text-xs text-center text-amber-600">
                      Insufficient wallet balance - please select another method
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}