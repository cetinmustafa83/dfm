'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, CheckCircle, Euro, Calendar, Download, AlertCircle, Building2 } from 'lucide-react'
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
}

interface PaymentGateway {
  id: string
  name: string
  type: string
  status: string
}

export default function PaymentPreferencesPage() {
  const [paymentMode, setPaymentMode] = useState<'saved' | 'manual'>('saved')
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'methods' | 'wallet'>('methods')

  useEffect(() => {
    fetchPaymentSettings()
  }, [])

  async function fetchPaymentSettings() {
    try {
      setLoading(true)
      const response = await fetch('/api/payment-settings?activeOnly=true')
      const result = await response.json()
      
      if (result.success) {
        setBankAccounts(result.data.bankAccounts || [])
        setPaymentGateways(result.data.paymentGateways || [])
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreference = () => {
    toast({
      title: 'Preferences saved',
      description: 'Your payment preferences have been updated successfully',
    })
  }

  const hasPaymentMethods = paymentGateways.length > 0 || bankAccounts.length > 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">
            Manage your PayPal account and saved credit cards for faster checkout
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={paymentMode === 'saved' ? 'default' : 'outline'}
            onClick={() => setPaymentMode('saved')}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Use saved payment methods
          </Button>
          <Button
            variant={paymentMode === 'manual' ? 'default' : 'outline'}
            onClick={() => setPaymentMode('manual')}
            className="gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Enter manually each time
          </Button>
        </div>
      </div>

      {/* Payment Channel Warning */}
      {!loading && !hasPaymentMethods && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-2">No payment channels available</h4>
                <p className="text-sm text-amber-700">
                  Payment methods are currently being set up. Please check back later or contact support for assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side - Bank Account Information */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Bank Account Information</CardTitle>
            </div>
            <CardDescription>
              Our company's bank account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            ) : bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {bankAccounts.map((bank) => (
                  <div key={bank.id} className="space-y-3 pb-4 border-b last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                      <p className="font-semibold">{bank.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Holder</p>
                      <p className="font-semibold">{bank.accountHolder}</p>
                    </div>
                    {bank.iban && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">IBAN</p>
                        <p className="font-mono text-sm">{bank.iban}</p>
                      </div>
                    )}
                    {bank.bic && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">BIC/SWIFT</p>
                        <p className="font-mono text-sm">{bank.bic}</p>
                      </div>
                    )}
                    {bank.accountNumber && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                        <p className="font-mono text-sm">{bank.accountNumber}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Bank details will be added
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Side - Tabbed Content */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
            <CardDescription>
              Manage your payment methods and wallet
            </CardDescription>
            {/* Tabs */}
            <div className="flex gap-2 pt-4">
              <Button
                variant={activeTab === 'methods' ? 'default' : 'outline'}
                onClick={() => setActiveTab('methods')}
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </Button>
              <Button
                variant={activeTab === 'wallet' ? 'default' : 'outline'}
                onClick={() => setActiveTab('wallet')}
                className="flex-1"
              >
                <Euro className="h-4 w-4 mr-2" />
                Wallet
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tab Content */}
            {activeTab === 'methods' ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold mb-2">No payment methods added yet</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Add your credit card or PayPal account for faster checkout
                </p>
                <div className="flex gap-2 justify-center">
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Credit Card
                  </Button>
                  <Button variant="outline">
                    Add PayPal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                  <p className="text-4xl font-bold">€0.00</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Add Funds</Button>
                  <Button variant="outline" className="flex-1">
                    <a href="/user/dashboard/wallet" className="flex items-center gap-2">
                      View Details
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access your payment related features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/user/dashboard/purchases"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Euro className="h-5 w-5 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Payment History</h3>
              <p className="text-sm text-muted-foreground">
                View all your past transactions
              </p>
            </a>
            <a
              href="/user/dashboard/wallet"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <CreditCard className="h-5 w-5 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Manage your wallet balance
              </p>
            </a>
            <a
              href="#"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Download className="h-5 w-5 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Download Invoices</h3>
              <p className="text-sm text-muted-foreground">
                Get PDF copies of your invoices
              </p>
            </a>
            <a
              href="#"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Calendar className="h-5 w-5 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Recurring Payments</h3>
              <p className="text-sm text-muted-foreground">
                Manage your subscriptions
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}