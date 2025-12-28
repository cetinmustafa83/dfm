'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { Search, Eye, CheckCircle, XCircle, Euro, Mail, Loader2 } from 'lucide-react'

interface ProjectRequest {
  id: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  title: string
  description: string
  budget?: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: string
  createdAt: string
  updatedAt: string
}

export default function ProjectRequests() {
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all')
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'invoice' | null>(null)
  const [actionNote, setActionNote] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/project-requests')
      const data = await res.json()
      if (data.success) {
        setRequests(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching project requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  const handleViewDetails = (request: ProjectRequest) => {
    setSelectedRequest(request)
    setIsViewSheetOpen(true)
  }

  const handleOpenActionSheet = (request: ProjectRequest, action: 'approve' | 'reject' | 'invoice') => {
    setSelectedRequest(request)
    setActionType(action)
    setActionNote('')
    setIsActionSheetOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return

    try {
      let newStatus = selectedRequest.status
      if (actionType === 'approve') newStatus = 'in_progress'
      else if (actionType === 'reject') newStatus = 'cancelled'

      const res = await fetch('/api/admin/project-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: newStatus,
        }),
      })

      if (res.ok) {
        await fetchRequests()

        let message = ''
        if (actionType === 'approve') {
          message = `Request from ${selectedRequest.customer.name} has been successfully approved.`
          toast.success(message)
        } else if (actionType === 'reject') {
          message = `Request from ${selectedRequest.customer.name} has been rejected.`
          toast.error(message)
        } else if (actionType === 'invoice') {
          message = `Invoice created for ${selectedRequest.customer.name}.`
          toast.success(message)
        }
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Failed to update request')
    }

    setIsActionSheetOpen(false)
    setSelectedRequest(null)
    setActionType(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Requests</h1>
        <p className="text-muted-foreground mt-2">
          Project requests from customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Management</CardTitle>
          <CardDescription>
            {filteredRequests.length} project requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search requests..."
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{request.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {request.budget ? `€${request.budget.toLocaleString()}` : 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(request.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[request.status]
                          }`}
                        >
                          {statusLabels[request.status]}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Details"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Approve"
                                onClick={() => handleOpenActionSheet(request, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Reject"
                                onClick={() => handleOpenActionSheet(request, 'reject')}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {request.status === 'in_progress' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Create Invoice"
                              onClick={() => handleOpenActionSheet(request, 'invoice')}
                            >
                              <Euro className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* View Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Request Details</SheetTitle>
            <SheetDescription>
              {selectedRequest && `${selectedRequest.customer.name} - ${selectedRequest.title}`}
            </SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">{selectedRequest.customer.name}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="mt-1 flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedRequest.customer.email}
                  </div>
                </div>
                {selectedRequest.customer.phone && (
                  <div>
                    <Label>Phone</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{selectedRequest.customer.phone}</div>
                  </div>
                )}
                <div>
                  <Label>Project Title</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">{selectedRequest.title}</div>
                </div>
                <div>
                  <Label>Budget</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    {selectedRequest.budget ? `€${selectedRequest.budget.toLocaleString()}` : 'Not specified'}
                  </div>
                </div>
                <div>
                  <Label>Priority</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md capitalize">{selectedRequest.priority}</div>
                </div>
                <div>
                  <Label>Submission Date</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">{formatDate(selectedRequest.createdAt)}</div>
                </div>
                <div>
                  <Label>Current Status</Label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedRequest.status]}`}
                    >
                      {statusLabels[selectedRequest.status]}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md min-h-[100px]">
                    {selectedRequest.description}
                  </div>
                </div>
              </div>
            </div>
          )}
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsViewSheetOpen(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Action Confirmation Sheet */}
      <Sheet open={isActionSheetOpen} onOpenChange={setIsActionSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
              {actionType === 'invoice' && 'Create Invoice'}
            </SheetTitle>
            <SheetDescription>
              {selectedRequest && `Customer: ${selectedRequest.customer.name}`}
            </SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project Title:</span>
                  <span className="font-medium">{selectedRequest.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">
                    {selectedRequest.budget ? `€${selectedRequest.budget.toLocaleString()}` : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Status:</span>
                  <span className="font-medium">{statusLabels[selectedRequest.status]}</span>
                </div>
              </div>
              {actionType !== 'invoice' && (
                <div>
                  <Label htmlFor="actionNote">Note (Optional)</Label>
                  <textarea
                    id="actionNote"
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Add description or note..."
                    className="mt-1 w-full min-h-[100px] px-3 py-2 bg-background border border-input rounded-md text-sm"
                  />
                </div>
              )}
              {actionType === 'invoice' && (
                <div className="text-sm text-muted-foreground">
                  Invoice will be created and sent to the customer via email.
                </div>
              )}
            </div>
          )}
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsActionSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {actionType === 'approve' && 'Approve'}
              {actionType === 'reject' && 'Reject'}
              {actionType === 'invoice' && 'Create Invoice'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}