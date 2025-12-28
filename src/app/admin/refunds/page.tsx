'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react'

interface RefundRequest {
  id: string
  userId: string
  orderId: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestDate: string
  processedDate?: string
  processedBy?: string
  adminNotes?: string
  itemType?: string
  itemName?: string
}

interface UserInfo {
  id: string
  name: string
  email: string
}

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([])
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')

  // Sheet states
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null)
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [createTicket, setCreateTicket] = useState(false)
  const [ticketMessage, setTicketMessage] = useState('')

  useEffect(() => {
    fetchRefunds()
    fetchUsers()
  }, [])

  async function fetchRefunds() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/refunds')
      const result = await response.json()
      if (result.success) {
        setRefunds(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching refunds:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/users')
      const result = await response.json()
      if (result.success) {
        setUsers(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  function getUserInfo(userId: string): UserInfo | undefined {
    return users.find(u => u.id === userId)
  }

  function openActionSheet(refund: RefundRequest, actionType: 'approve' | 'reject') {
    setSelectedRefund(refund)
    setAction(actionType)
    setAdminNotes('')
    setCreateTicket(false)
    setTicketMessage('')
    setActionSheetOpen(true)
  }

  async function handleRefundAction() {
    if (!selectedRefund || !action) return

    try {
      const adminId = localStorage.getItem('admin_id') || 'admin'
      
      // If creating a ticket, create it first
      if (createTicket && ticketMessage.trim()) {
        await fetch('/api/admin/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedRefund.userId,
            subject: `Refund Request - ${selectedRefund.itemName || selectedRefund.orderId}`,
            message: ticketMessage,
            priority: 'high',
            category: 'refund',
            relatedRefundId: selectedRefund.id
          })
        })
      }

      // Update refund status
      const response = await fetch('/api/user/refunds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRefund.id,
          status: action === 'approve' ? 'approved' : 'rejected',
          adminNotes,
          processedBy: adminId
        })
      })

      const result = await response.json()
      if (result.success) {
        setActionSheetOpen(false)
        fetchRefunds()
        alert(`Refund ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
      } else {
        alert(result.error || 'Failed to process refund')
      }
    } catch (error) {
      console.error('Error processing refund:', error)
      alert('An error occurred while processing the refund')
    }
  }

  const filteredRefunds = refunds.filter(refund => {
    const matchesTab = activeTab === 'all' || refund.status === activeTab
    const userInfo = getUserInfo(refund.userId)
    const matchesSearch = searchTerm === '' || 
      refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo?.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const stats = {
    pending: refunds.filter(r => r.status === 'pending').length,
    approved: refunds.filter(r => r.status === 'approved').length,
    rejected: refunds.filter(r => r.status === 'rejected').length,
    totalAmount: refunds
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Refund Management</h1>
        <p className="text-muted-foreground mt-2">
          Review and process customer refund requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Refunds issued
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requests denied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunded</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAmount.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">
              Approved refunds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, item name, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Refunds List */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
          <CardDescription>
            Manage and process refund requests from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">
                <Clock className="mr-2 h-4 w-4" />
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected">
                <XCircle className="mr-2 h-4 w-4" />
                Rejected
              </TabsTrigger>
              <TabsTrigger value="all">
                All Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredRefunds.length === 0 ? (
                <div className="text-center py-12">
                  <RefreshCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No refund requests</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'pending' 
                      ? 'No pending refund requests at this time'
                      : `No ${activeTab} refund requests found`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRefunds.map((refund) => {
                    const userInfo = getUserInfo(refund.userId)
                    return (
                      <div
                        key={refund.id}
                        className="p-6 border rounded-lg space-y-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">
                                {refund.itemName || `Order ${refund.orderId}`}
                              </h3>
                              <Badge variant={
                                refund.status === 'approved' ? 'default' :
                                refund.status === 'pending' ? 'secondary' :
                                'destructive'
                              }>
                                {refund.status === 'approved' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                {refund.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
                                {refund.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                              </Badge>
                              {refund.itemType && (
                                <Badge variant="outline">
                                  {refund.itemType === 'project' ? 'Project' : 'Package'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Order ID: {refund.orderId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{refund.amount.toFixed(2)} €</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Requested {new Date(refund.requestDate).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Customer:</span>
                          <span className="text-muted-foreground">
                            {userInfo?.name || 'Unknown'} ({userInfo?.email || refund.userId})
                          </span>
                        </div>

                        {/* Reason */}
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Reason for Refund:</p>
                          <p className="text-sm text-muted-foreground">{refund.reason}</p>
                        </div>

                        {/* Admin Notes */}
                        {refund.adminNotes && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <p className="text-sm font-medium mb-1">Admin Notes:</p>
                            <p className="text-sm text-muted-foreground">{refund.adminNotes}</p>
                          </div>
                        )}

                        {/* Processed Info */}
                        {refund.processedDate && (
                          <p className="text-xs text-muted-foreground">
                            Processed on {new Date(refund.processedDate).toLocaleDateString('en-GB')} 
                            {refund.processedBy && ` by ${refund.processedBy}`}
                          </p>
                        )}

                        {/* Actions */}
                        {refund.status === 'pending' && (
                          <div className="flex gap-3 pt-2">
                            <Button
                              onClick={() => openActionSheet(refund, 'approve')}
                              className="flex-1"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve Refund
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => openActionSheet(refund, 'reject')}
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Refund
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedRefund(refund)
                                setCreateTicket(true)
                                setTicketMessage(`Regarding your refund request for ${refund.itemName || refund.orderId}:\n\n`)
                                setActionSheetOpen(true)
                              }}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Ask Questions
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Sheet */}
      <Sheet open={actionSheetOpen} onOpenChange={setActionSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {createTicket && !action 
                ? 'Request More Information'
                : action === 'approve' 
                  ? 'Approve Refund Request' 
                  : 'Reject Refund Request'
              }
            </SheetTitle>
            <SheetDescription>
              {createTicket && !action
                ? 'Create a support ticket to ask the customer for more details'
                : action === 'approve'
                  ? 'The refund amount will be credited to the customer\'s wallet'
                  : 'Please provide a reason for rejecting this refund request'
              }
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            {selectedRefund && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Item:</span> {selectedRefund.itemName || selectedRefund.orderId}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Amount:</span> {selectedRefund.amount.toFixed(2)} €
                </p>
                <p className="text-sm">
                  <span className="font-medium">Customer:</span> {getUserInfo(selectedRefund.userId)?.name || selectedRefund.userId}
                </p>
              </div>
            )}

            {!createTicket && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="admin-notes">
                    {action === 'approve' ? 'Notes (Optional)' : 'Rejection Reason'}
                  </Label>
                  <textarea
                    id="admin-notes"
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                    placeholder={action === 'approve' 
                      ? "Add any notes about this approval..."
                      : "Please explain why this refund is being rejected..."
                    }
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="create-ticket-checkbox"
                    checked={createTicket}
                    onChange={(e) => setCreateTicket(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="create-ticket-checkbox" className="cursor-pointer">
                    Also create a support ticket to communicate with customer
                  </Label>
                </div>
              </>
            )}

            {createTicket && (
              <div className="space-y-2">
                <Label htmlFor="ticket-message">Ticket Message</Label>
                <textarea
                  id="ticket-message"
                  className="w-full min-h-[150px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                  placeholder="Type your message to the customer..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will create a high-priority support ticket for this refund request
                </p>
              </div>
            )}
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setActionSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRefundAction}
              variant={action === 'reject' ? 'destructive' : 'default'}
              disabled={action === 'reject' && !adminNotes.trim()}
            >
              {createTicket && !action
                ? 'Create Ticket'
                : action === 'approve'
                  ? 'Approve & Credit Wallet'
                  : 'Confirm Rejection'
              }
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}