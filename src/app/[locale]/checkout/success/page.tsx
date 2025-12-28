'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle,
  Copy,
  Download,
  Code,
  Building2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface BankAccount {
  id: string
  bankName: string
  accountHolder: string
  iban: string
  bic: string
  accountNumber: string
  routingNumber: string
  swiftCode: string
  instructions: string
}

interface Template {
  id: string
  name: string
  price: number
  currency: string
  billingCycle: string
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const method = searchParams.get('method')
  const templateId = searchParams.get('templateId')
  const bankId = searchParams.get('bankId')

  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (method === 'bank' && bankId && templateId) {
      fetchBankDetails()
    } else if (method !== 'bank') {
      setLoading(false)
    } else {
      router.push('/marketplace')
    }
  }, [method, bankId, templateId])

  async function fetchBankDetails() {
    try {
      setLoading(true)

      // Fetch bank account details
      const bankRes = await fetch('/api/payment-settings?type=banks')
      const bankData = await bankRes.json()
      
      if (bankData.success) {
        const bank = bankData.data.bankAccounts.find((b: BankAccount) => b.id === bankId)
        setBankAccount(bank || null)
      }

      // Fetch template details
      const templateRes = await fetch('/api/templates')
      const templateData = await templateRes.json()
      
      if (templateData.success) {
        const tmpl = templateData.data.find((t: Template) => t.id === templateId)
        setTemplate(tmpl || null)
      }
    } catch (error) {
      console.error('Error fetching details:', error)
      toast({
        title: 'Error',
        description: 'Failed to load payment details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">ModernAgency</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {method === 'bank' && bankAccount ? (
            // Bank Transfer Success
            <div className="space-y-6">
              {/* Success Header */}
              <Card className="border-2 border-primary">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
                  <CardDescription className="text-base">
                    Please complete the bank transfer to activate your purchase
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Order Details */}
              {template && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium text-lg">{template.price} {template.currency}</span>
                    </div>
                    {template.billingCycle !== 'one-time' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing:</span>
                        <Badge variant="secondary" className="capitalize">{template.billingCycle}</Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-mono text-sm">{Date.now()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bank Transfer Instructions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Bank Transfer Details</CardTitle>
                      <CardDescription>
                        Transfer the exact amount to complete your purchase
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bank Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{bankAccount.bankName}</span>
                    </div>
                  </div>

                  {/* Account Holder */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Account Holder</label>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{bankAccount.accountHolder}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankAccount.accountHolder, 'Account holder')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* IBAN */}
                  {bankAccount.iban && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">IBAN</label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-mono text-sm">{bankAccount.iban}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bankAccount.iban, 'IBAN')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* BIC/SWIFT */}
                  {(bankAccount.bic || bankAccount.swiftCode) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        BIC/SWIFT Code
                      </label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-mono text-sm">
                          {bankAccount.bic || bankAccount.swiftCode}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            bankAccount.bic || bankAccount.swiftCode,
                            'BIC/SWIFT'
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Account Number (for non-IBAN banks) */}
                  {bankAccount.accountNumber && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Account Number
                      </label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-mono text-sm">{bankAccount.accountNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bankAccount.accountNumber, 'Account number')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Routing Number */}
                  {bankAccount.routingNumber && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Routing Number
                      </label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-mono text-sm">{bankAccount.routingNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bankAccount.routingNumber, 'Routing number')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Transfer Amount */}
                  {template && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Transfer Amount
                      </label>
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary">
                        <span className="font-bold text-lg text-primary">
                          {template.price} {template.currency}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${template.price}`, 'Amount')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Additional Instructions */}
                  {bankAccount.instructions && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Additional Instructions
                      </label>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{bankAccount.instructions}</p>
                      </div>
                    </div>
                  )}

                  {/* Important Note */}
                  <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Important</p>
                      <p className="text-sm text-muted-foreground">
                        Please include your Order ID ({Date.now()}) in the transfer reference. 
                        Your purchase will be activated once the payment is confirmed (usually within 1-3 business days).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href="/marketplace">
                    Back to Marketplace
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Print Details
                </Button>
              </div>
            </div>
          ) : (
            // Payment Gateway Success (PayPal, Mollie, etc.)
            <div className="space-y-6">
              <Card className="border-2 border-primary">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                  <CardDescription className="text-base">
                    Your purchase has been completed successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      You will receive a confirmation email with your download link shortly.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button asChild>
                        <Link href="/marketplace">
                          Back to Marketplace
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/user/purchases">
                          <Download className="h-4 w-4 mr-2" />
                          My Purchases
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}