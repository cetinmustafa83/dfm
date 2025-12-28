'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Inbox, Send, MessageSquare, Trash2, Eye, Calendar as CalendarIcon, Plus, User, Mail as MailIcon, Loader2, LifeBuoy, CalendarCheck, Archive, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date?: string
  read: boolean
  type?: 'inbox' | 'outbox'
  category?: string
  deleted?: boolean
  deletedAt?: string
  createdAt?: string
}

interface Customer {
  id: string
  name: string
  email: string
}

export default function AdminMessages() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inbox' | 'outbox' | 'tickets' | 'appointments' | 'deleted'>('inbox')
  const [showComposeSheet, setShowComposeSheet] = useState(false)
  const [sending, setSending] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())
  
  const [composeForm, setComposeForm] = useState({
    customerId: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn !== 'true') {
      router.push('/admin/login')
      return
    }

    fetchMessages()
    fetchCustomers()
  }, [])

  async function fetchMessages() {
    try {
      const includeDeleted = activeTab === 'deleted' ? 'true' : 'false'
      const res = await fetch(`/api/messages?includeDeleted=${includeDeleted}`)
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.success) {
        setCustomers(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  async function toggleRead(id: string) {
    const message = messages.find(m => m.id === id)
    if (message) {
      try {
        await fetch(`/api/messages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...message, read: !message.read }),
        })
        await fetchMessages()
      } catch (error) {
        console.error('Error updating message status:', error)
      }
    }
  }

  async function handleDelete(id: string, permanent: boolean = false) {
    const confirmMsg = permanent
      ? 'Are you sure you want to permanently delete this message? This cannot be undone.'
      : 'Are you sure you want to delete this message?'
    
    if (!confirm(confirmMsg)) return

    try {
      const url = permanent
        ? `/api/messages/${id}?permanent=true`
        : `/api/messages/${id}`
      await fetch(url, { method: 'DELETE' })
      await fetchMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  async function handleRestore(id: string) {
    try {
      await fetch(`/api/messages/${id}/restore`, { method: 'POST' })
      await fetchMessages()
    } catch (error) {
      console.error('Error restoring message:', error)
    }
  }

  async function handleBulkDelete(permanent: boolean = false) {
    if (selectedMessages.size === 0) return
    
    const confirmMsg = permanent
      ? `Are you sure you want to permanently delete ${selectedMessages.size} message(s)? This cannot be undone.`
      : `Are you sure you want to delete ${selectedMessages.size} message(s)?`
    
    if (!confirm(confirmMsg)) return

    try {
      await Promise.all(
        Array.from(selectedMessages).map(id => {
          const url = permanent
            ? `/api/messages/${id}?permanent=true`
            : `/api/messages/${id}`
          return fetch(url, { method: 'DELETE' })
        })
      )
      setSelectedMessages(new Set())
      await fetchMessages()
    } catch (error) {
      console.error('Error bulk deleting messages:', error)
    }
  }

  async function handleBulkRestore() {
    if (selectedMessages.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedMessages).map(id =>
          fetch(`/api/messages/${id}/restore`, { method: 'POST' })
        )
      )
      setSelectedMessages(new Set())
      await fetchMessages()
    } catch (error) {
      console.error('Error bulk restoring messages:', error)
    }
  }

  function toggleMessageSelection(id: string) {
    const newSelection = new Set(selectedMessages)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedMessages(newSelection)
  }

  function toggleSelectAll() {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set())
    } else {
      setSelectedMessages(new Set(filteredMessages.map(m => m.id)))
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    try {
      const customer = customers.find(c => c.id === composeForm.customerId)
      if (!customer) return

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Admin',
          email: customer.email,
          subject: composeForm.subject,
          message: composeForm.message,
          type: 'outbox',
          read: true,
        }),
      })

      if (res.ok) {
        await fetchMessages()
        setShowComposeSheet(false)
        setComposeForm({ customerId: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const inboxMessages = messages.filter(m => (!m.type || m.type === 'inbox') && !m.category && !m.deleted)
  const outboxMessages = messages.filter(m => m.type === 'outbox' && !m.deleted)
  const ticketMessages = messages.filter(m => m.category === 'ticket' && !m.deleted)
  const appointmentMessages = messages.filter(m => m.category === 'appointment' && !m.deleted)
  const deletedMessages = messages.filter(m => m.deleted === true)
  
  const filteredMessages =
    activeTab === 'inbox' ? inboxMessages :
    activeTab === 'outbox' ? outboxMessages :
    activeTab === 'tickets' ? ticketMessages :
    activeTab === 'appointments' ? appointmentMessages :
    deletedMessages
  
  const unreadCount = inboxMessages.filter(m => !m.read).length
  const ticketUnreadCount = ticketMessages.filter(m => !m.read).length
  const appointmentUnreadCount = appointmentMessages.filter(m => !m.read).length

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 space-y-2">
        <Button
          onClick={() => setShowComposeSheet(true)}
          className="w-full justify-start gap-2 mb-4"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          New Message
        </Button>

        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'inbox'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <Inbox className="h-5 w-5" />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab('outbox')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'outbox'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <Send className="h-5 w-5" />
            <span>Outbox</span>
            <Badge variant="secondary" className="ml-auto">
              {outboxMessages.length}
            </Badge>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'tickets'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <LifeBuoy className="h-5 w-5" />
            <span>Tickets</span>
            {ticketUnreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {ticketUnreadCount}
              </Badge>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('appointments')
              setSelectedMessages(new Set())
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'appointments'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <CalendarCheck className="h-5 w-5" />
            <span>Appointments</span>
            {appointmentUnreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {appointmentUnreadCount}
              </Badge>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('deleted')
              setSelectedMessages(new Set())
              fetchMessages()
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'deleted'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <Archive className="h-5 w-5" />
            <span>Deleted</span>
            <Badge variant="secondary" className="ml-auto">
              {deletedMessages.length}
            </Badge>
          </button>
        </div>

        {/* Stats */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{messages.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unread</span>
              <span className="font-medium">{unreadCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sent</span>
              <span className="font-medium">{outboxMessages.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tickets</span>
              <span className="font-medium">{ticketMessages.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Appointments</span>
              <span className="font-medium">{appointmentMessages.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deleted</span>
              <span className="font-medium">{deletedMessages.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {activeTab === 'inbox' ? 'Inbox' : 
                 activeTab === 'outbox' ? 'Outbox' : 
                 activeTab === 'tickets' ? 'Support Tickets' :
                 activeTab === 'appointments' ? 'Appointments' :
                 'Deleted Messages'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'inbox'
                  ? 'Messages from customers and contact form submissions'
                  : activeTab === 'outbox'
                  ? 'Messages sent to customers'
                  : activeTab === 'tickets'
                  ? 'Support tickets submitted by customers'
                  : activeTab === 'appointments'
                  ? 'Appointment requests from customers'
                  : 'Deleted messages (auto-cleanup after 90 days)'}
              </p>
            </div>
            {activeTab === 'deleted' && selectedMessages.size > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkRestore()}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Restore ({selectedMessages.size})
                </Button>
                <Button
                  onClick={() => handleBulkDelete(true)}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Permanently ({selectedMessages.size})
                </Button>
              </div>
            )}
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No messages</p>
                <p className="text-muted-foreground">
                  {activeTab === 'inbox'
                    ? 'No messages received yet.'
                    : activeTab === 'outbox'
                    ? 'No messages sent yet. Click "New Message" to compose.'
                    : activeTab === 'tickets'
                    ? 'No support tickets submitted yet.'
                    : activeTab === 'appointments'
                    ? 'No appointment requests yet.'
                    : 'No deleted messages.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {activeTab === 'deleted' && filteredMessages.length > 0 && (
                <div className="flex items-center gap-2 mb-3 p-3 bg-muted/30 rounded-lg">
                  <Checkbox
                    checked={selectedMessages.size === filteredMessages.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedMessages.size > 0 
                      ? `${selectedMessages.size} selected` 
                      : 'Select all'}
                  </span>
                </div>
              )}
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <Card key={message.id} className={`transition-all hover:shadow-md ${!message.read && (activeTab === 'inbox' || activeTab === 'tickets' || activeTab === 'appointments') ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {activeTab === 'deleted' && (
                            <Checkbox
                              checked={selectedMessages.has(message.id)}
                              onCheckedChange={() => toggleMessageSelection(message.id)}
                              className="mt-1"
                            />
                          )}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            !message.read && (activeTab === 'inbox' || activeTab === 'tickets' || activeTab === 'appointments') ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                            <User className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base truncate">{message.name}</CardTitle>
                              {!message.read && (activeTab === 'inbox' || activeTab === 'tickets' || activeTab === 'appointments') && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                              {activeTab === 'deleted' && message.deletedAt && (
                                <Badge variant="secondary" className="text-xs">
                                  Deleted {new Date(message.deletedAt).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs flex items-center gap-2">
                              <MailIcon className="h-3 w-3" />
                              {message.email}
                              <span>•</span>
                              <CalendarIcon className="h-3 w-3" />
                              {message.date || new Date(message.createdAt || '').toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm font-medium mb-2">{message.subject}</p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-2">
                        {activeTab === 'deleted' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(message.id)}
                              className="gap-2"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Restore
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(message.id, true)}
                              className="gap-2"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete Permanently
                            </Button>
                          </>
                        ) : (
                          <>
                            {(activeTab === 'inbox' || activeTab === 'tickets' || activeTab === 'appointments') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleRead(message.id)}
                                className="gap-2"
                              >
                                <Eye className="h-3 w-3" />
                                {message.read ? 'Mark Unread' : 'Mark Read'}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(message.id)}
                              className="gap-2"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compose Message Sheet */}
      <Sheet open={showComposeSheet} onOpenChange={setShowComposeSheet}>
        <SheetContent side="right" className="sm:max-w-[600px]">
          <form onSubmit={handleSendMessage}>
            <SheetHeader>
              <SheetTitle>New Message</SheetTitle>
              <SheetDescription>
                Send a message to a customer
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 my-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Select Customer</Label>
                <select
                  id="customer"
                  value={composeForm.customerId}
                  onChange={(e) => setComposeForm({ ...composeForm, customerId: e.target.value })}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Choose a customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  placeholder="Enter message subject..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                  placeholder="Write your message..."
                  className="min-h-[200px]"
                  required
                />
              </div>
            </div>
            <SheetFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowComposeSheet(false)
                  setComposeForm({ customerId: '', subject: '', message: '' })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={sending} className="gap-2">
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}