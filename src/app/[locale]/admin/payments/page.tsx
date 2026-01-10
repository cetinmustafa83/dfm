'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Search, Plus, Euro, Download, Eye, X, Mail, Check, Clock, AlertCircle, Send, Settings, Loader2 } from 'lucide-react'

interface Payment {
  id: string
  customer: {
    name: string
    email: string
  }
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  description: string
  invoiceUrl?: string
  createdAt: string
  updatedAt: string
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all')
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showInvoiceSheet, setShowInvoiceSheet] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)
  const [autoInvoiceEnabled, setAutoInvoiceEnabled] = useState(true)

  const [newPayment, setNewPayment] = useState({
    customerName: '',
    customerEmail: '',
    amount: '',
    currency: 'EUR',
    paymentMethod: 'manual',
    description: '',
  })

  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerEmail: '',
    address: '',
    taxNumber: '',
    notes: '',
  })

  useEffect(() => {
    fetchPayments()
  }, [])

  async function fetchPayments() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/payments')
      const data = await res.json()
      if (data.success) {
        setPayments(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }

  const statusLabels = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
  }

  const currencyLabels = {
    EUR: '€',
    USD: '$',
    GBP: '£',
  }

  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      })

      const data = await res.json()
      if (data.success) {
        await fetchPayments()
        setShowAddSheet(false)
        setNewPayment({
          customerName: '',
          customerEmail: '',
          amount: '',
          currency: 'EUR',
          paymentMethod: 'manual',
          description: '',
        })
      }
    } catch (error) {
      console.error('Error adding payment:', error)
    }
  }

  function handleSendInvoice(payment: Payment) {
    setSelectedPayment(payment)
    setInvoiceData({
      customerName: payment.customer.name,
      customerEmail: payment.customer.email,
      address: '',
      taxNumber: '',
      notes: '',
    })
    setShowInvoiceSheet(true)
  }

  async function handleConfirmSendInvoice(e: React.FormEvent) {
    e.preventDefault()
    if (selectedPayment) {
      try {
        const res = await fetch('/api/admin/payments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedPayment.id,
            invoiceUrl: `INV-${Date.now()}`,
          }),
        })

        if (res.ok) {
          await fetchPayments()
        }
      } catch (error) {
        console.error('Error sending invoice:', error)
      }

      setShowInvoiceSheet(false)
      setSelectedPayment(null)
      setInvoiceData({ customerName: '', customerEmail: '', address: '', taxNumber: '', notes: '' })
    }
  }

  function handleViewPaymentDetails(payment: Payment) {
    alert(`Payment Details:\n\nCustomer: ${payment.customer.name}\nAmount: ${currencyLabels[payment.currency as keyof typeof currencyLabels]}${payment.amount}\nStatus: ${statusLabels[payment.status]}\nDescription: ${payment.description}`)
  }

  function handleDownloadInvoice(payment: Payment) {
    alert(`Downloading invoice for payment ID: ${payment.id}`)
  }

  async function handleDeletePayment(id: string) {
    if (!confirm('Are you sure you want to delete this payment?')) return

    try {
      const res = await fetch(`/api/admin/payments?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchPayments()
      }
    } catch (error) {
      console.error('Error deleting payment:', error)
    }
  }

  async function handleMarkAsPaid(id: string) {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'completed',
        }),
      })

      if (res.ok) {
        await fetchPayments()
      }
    } catch (error) {
      console.error('Error marking as paid:', error)
    }
  }

  // Statistics
  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const paidCount = payments.filter((p) => p.status === 'completed').length
  const pendingCount = payments.filter((p) => p.status === 'pending').length

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Invoices</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer payments and invoices
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowSettingsSheet(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue.toLocaleString()} €</div>
            <p className="text-sm text-muted-foreground">Total paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingAmount.toLocaleString()} €</div>
            <p className="text-sm text-muted-foreground">Expected payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-blue-600" />
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{paidCount}</div>
            <p className="text-sm text-muted-foreground">Payment count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Waiting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                {filteredPayments.length} transactions
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddSheet(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status Filter</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{payment.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{payment.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.amount} €</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm capitalize">{payment.paymentMethod}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(payment.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[payment.status]
                          }`}
                        >
                          {statusLabels[payment.status]}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.invoiceUrl ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Sent</span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendInvoice(payment)}
                            className="h-7 text-xs"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewPaymentDetails(payment)} title="Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(payment)} title="Download Invoice">
                            <Download className="h-4 w-4" />
                          </Button>
                          {payment.status === 'pending' && (
                            <Button variant="ghost" size="icon" onClick={() => handleMarkAsPaid(payment.id)} title="Mark as Paid">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePayment(payment.id)} title="Delete">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="right" className="sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Payment</SheetTitle>
            <SheetDescription>Create manual payment record</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleAddPayment} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newPayment.customerName}
                    onChange={(e) => setNewPayment({ ...newPayment, customerName: e.target.value })}
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newPayment.customerEmail}
                    onChange={(e) => setNewPayment({ ...newPayment, customerEmail: e.target.value })}
                    placeholder="customer@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={newPayment.currency}
                      onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value })}
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      required
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      placeholder="299"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                    placeholder="Payment description"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    value={newPayment.paymentMethod}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                    required
                  >
                    <option value="manual">Manual</option>
                    <option value="paypal">PayPal</option>
                    <option value="mollie">Mollie</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>

                <SheetFooter className="gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Payment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddSheet(false)
                      setNewPayment({
                        customerName: '',
                        customerEmail: '',
                        amount: '',
                        currency: 'EUR',
                        paymentMethod: 'manual',
                        description: '',
                      })
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </SheetFooter>
              </form>
        </SheetContent>
      </Sheet>

      {/* Send Invoice Sheet */}
      <Sheet open={showInvoiceSheet && selectedPayment !== null} onOpenChange={setShowInvoiceSheet}>
        <SheetContent side="right" className="sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Invoice
            </SheetTitle>
            <SheetDescription>
              {selectedPayment?.customer.name}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleConfirmSendInvoice} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={invoiceData.customerEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={invoiceData.address}
                    onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                    placeholder="Customer address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={invoiceData.taxNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, taxNumber: e.target.value })}
                    placeholder="Tax number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                    className="w-full h-20 px-3 py-2 bg-background border border-input rounded-md text-sm resize-none"
                    placeholder="Additional notes..."
                  />
                </div>

                <SheetFooter className="gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowInvoiceSheet(false)
                      setSelectedPayment(null)
                      setInvoiceData({ customerName: '', customerEmail: '', address: '', taxNumber: '', notes: '' })
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </SheetFooter>
              </form>
        </SheetContent>
      </Sheet>

      {/* Auto Invoice Settings Sheet */}
      <Sheet open={showSettingsSheet} onOpenChange={setShowSettingsSheet}>
        <SheetContent side="right" className="sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Invoice Automation Settings
            </SheetTitle>
            <SheetDescription>
              Configure automatic invoice sending features
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Invoice Sending</Label>
                    <p className="text-sm text-muted-foreground">
                      Invoice is sent automatically as soon as customer makes payment
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoInvoiceEnabled(!autoInvoiceEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoInvoiceEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoInvoiceEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Information</h4>
              <p className="text-sm text-muted-foreground">
                When automatic invoice sending is enabled, as soon as customer payment is completed
                invoice is created as PDF and sent to customer email address.
              </p>
            </div>

            <SheetFooter className="gap-2 pt-4">
              <Button
                onClick={() => setShowSettingsSheet(false)}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettingsSheet(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}