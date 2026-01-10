'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Ticket, MessageCircle, AlertCircle, Send, Clock, CheckCircle2, FileText, Shield, Zap, Users, Loader2, AlertTriangle, ArrowUp, X, Check } from 'lucide-react'

interface SupportPackage {
  id: string
  name: string
  price: string
  currency: string
  billingCycle: string
  tier: 'free' | 'standard' | 'professional' | 'corporate'
  features: {
    monthlyTickets: number | 'unlimited'
    responseTime: string
    supportChannels: string[]
    prioritySupport: boolean
    dedicatedManager: boolean
  }
  featuresList?: string[]
  status: 'active' | 'inactive'
}

interface SupportTicket {
  id: string
  userId: string
  subject: string
  category: 'support' | 'billing' | 'technical' | 'feature'
  priority: 'low' | 'medium' | 'high'
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  responses: {
    id: string
    message: string
    author: 'user' | 'support'
    createdAt: string
  }[]
  attachments: string[]
}

// Free tier definition (hardcoded as baseline)
const FREE_TIER: SupportPackage = {
  id: 'free',
  name: 'Free Support',
  price: '0',
  currency: 'EUR',
  billingCycle: 'month',
  tier: 'free',
  features: {
    monthlyTickets: 4,
    responseTime: '48 hours',
    supportChannels: ['Ticket'],
    prioritySupport: false,
    dedicatedManager: false
  },
  status: 'active'
}

export default function UserTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [availablePackages, setAvailablePackages] = useState<SupportPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isUpgradeSheetOpen, setIsUpgradeSheetOpen] = useState(false)
  const [isCancelSheetOpen, setIsCancelSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [activePackage, setActivePackage] = useState<SupportPackage | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [formData, setFormData] = useState({
    subject: '',
    category: 'support',
    priority: 'low',
    message: '',
  })

  useEffect(() => {
    fetchData()
    
    // Update current time every minute for countdown
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    
    return () => clearInterval(timer)
  }, [])

  async function fetchData() {
    try {
      const userId = localStorage.getItem('user_id') || 'demo_user'
      
      // Fetch all available packages
      const packagesResponse = await fetch('/api/packages')
      if (packagesResponse.ok) {
        const packagesResult = await packagesResponse.json()
        setAvailablePackages(packagesResult.supportPackages || [])
      }

      // Fetch user's active support package
      const userPackageResponse = await fetch(`/api/packages?userId=${userId}`)
      const userPackageResult = await userPackageResponse.json()
      
      if (userPackageResult.success && userPackageResult.data) {
        setActivePackage(userPackageResult.data)
      } else {
        setActivePackage(null)
      }

      // Fetch tickets
      const ticketsResponse = await fetch(`/api/user/tickets?userId=${userId}`)
      const ticketsResult = await ticketsResponse.json()
      
      if (ticketsResult.success && ticketsResult.data) {
        setTickets(ticketsResult.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setActivePackage(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const userId = localStorage.getItem('user_id') || 'demo_user'
      const response = await fetch('/api/user/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subject: formData.subject,
          category: formData.category,
          priority: formData.priority,
          message: formData.message,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchData()
        handleCloseSheet()
        alert(`Ticket #${result.data.id} created successfully! Our team will respond soon.`)
      } else {
        alert('Failed to create ticket: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Failed to create ticket')
    }
  }

  async function handleCancelPackage() {
    if (!activePackage) return
    
    const confirmText = 'According to German B2B law, your cancellation will take effect after 3 months. You will continue to have access to your current package benefits during this period and will be charged for the next 3 months.\n\nAre you sure you want to cancel your package?'
    
    if (!confirm(confirmText)) return

    try {
      const userId = localStorage.getItem('user_id') || 'demo_user'
      // In production, this would call an API to schedule cancellation
      // For now, we'll just show a confirmation
      const cancellationDate = new Date()
      cancellationDate.setMonth(cancellationDate.getMonth() + 3)
      
      alert(`Your package cancellation has been scheduled.\n\nCancellation effective date: ${cancellationDate.toLocaleDateString('en-GB')}\n\nYou will continue to receive support until this date and will be charged for the next 3 months as per German B2B regulations.`)
      setIsCancelSheetOpen(false)
    } catch (error) {
      console.error('Error canceling package:', error)
      alert('Failed to cancel package')
    }
  }

  function handleCloseSheet() {
    setIsSheetOpen(false)
    setFormData({
      subject: '',
      category: 'support',
      priority: 'low',
      message: '',
    })
  }

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-500 text-white">Open</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-500 text-white">In Progress</Badge>
      case 'resolved':
        return <Badge className="bg-green-500 text-white">Resolved</Badge>
      case 'closed':
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-white">High</Badge>
      case 'medium':
        return <Badge className="bg-orange-500 text-white">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'support':
        return <Badge variant="outline">Support</Badge>
      case 'billing':
        return <Badge variant="outline">Billing</Badge>
      case 'technical':
        return <Badge variant="outline">Technical</Badge>
      case 'feature':
        return <Badge variant="outline">Feature</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const getPackageTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'text-gray-600 bg-gray-100'
      case 'standard':
        return 'text-blue-600 bg-blue-100'
      case 'professional':
        return 'text-purple-600 bg-purple-100'
      case 'corporate':
        return 'text-amber-600 bg-amber-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const currentPackage = (activePackage && activePackage.features) ? activePackage : FREE_TIER

  const getRemainingTickets = () => {
    if (!currentPackage?.features) return '0'
    if (currentPackage.features.monthlyTickets === 'unlimited') return 'Unlimited'
    const usedThisMonth = tickets.filter(t => {
      const ticketDate = new Date(t.createdAt)
      const now = new Date()
      return ticketDate.getMonth() === now.getMonth() && ticketDate.getFullYear() === now.getFullYear()
    }).length
    return Math.max(0, (currentPackage.features.monthlyTickets as number) - usedThisMonth)
  }

  const getNextResponseTime = () => {
    // Find the oldest open or in_progress ticket
    const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress')
    if (activeTickets.length === 0) return null
    
    // Sort by creation date
    const oldestTicket = activeTickets.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0]
    
    // Parse response time (e.g., "48 hours" -> 48)
    if (!currentPackage?.features?.responseTime) return null
    const responseHours = parseInt(currentPackage.features.responseTime.split(' ')[0])
    
    // Calculate deadline
    const ticketDate = new Date(oldestTicket.createdAt)
    const deadline = new Date(ticketDate.getTime() + responseHours * 60 * 60 * 1000)
    
    // Calculate remaining time
    const remaining = deadline.getTime() - currentTime.getTime()
    
    if (remaining <= 0) {
      return { overdue: true, text: 'Overdue', hours: 0, minutes: 0 }
    }
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    return { overdue: false, text: `${hours}h ${minutes}m`, hours, minutes }
  }

  const responseTimeInfo = getNextResponseTime()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Active Package Card with Upgrade/Cancel */}
      {activePackage && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Your Support Package</CardTitle>
                </div>
                <CardDescription>
                  Active Package: <span className="font-semibold">{currentPackage?.name || 'Free Support'}</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPackageTierColor(currentPackage?.tier || 'free')}>
                  {currentPackage?.tier ? currentPackage.tier.charAt(0).toUpperCase() + currentPackage.tier.slice(1) : 'Free'}
                </Badge>
                {availablePackages.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => setIsUpgradeSheetOpen(true)}
                    variant="outline"
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Change Package
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setIsCancelSheetOpen(true)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Ticket className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Monthly Tickets</p>
                  <p className="text-2xl font-bold">{getRemainingTickets()}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentPackage?.features?.monthlyTickets === 'unlimited'
                      ? 'Unlimited access'
                      : `of ${currentPackage?.features?.monthlyTickets || 0} remaining`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                <div className={`p-2 rounded-lg ${responseTimeInfo?.overdue ? 'bg-red-100' : 'bg-green-100'}`}>
                  <Clock className={`h-5 w-5 ${responseTimeInfo?.overdue ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Response Time</p>
                  {responseTimeInfo ? (
                    <>
                      <p className={`text-2xl font-bold ${responseTimeInfo.overdue ? 'text-red-600' : ''}`}>
                        {responseTimeInfo.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {responseTimeInfo.overdue ? 'Response overdue' : 'Until next response'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{currentPackage?.features?.responseTime || '48 hours'}</p>
                      <p className="text-xs text-muted-foreground">Maximum wait time</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                <div className="p-2 rounded-lg bg-purple-100">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Support Channels</p>
                  <p className="text-sm font-semibold mt-1">{currentPackage?.features?.supportChannels?.join(', ') || 'Ticket'}</p>
                  <p className="text-xs text-muted-foreground">{currentPackage?.features?.supportChannels?.length || 1} channel{(currentPackage?.features?.supportChannels?.length || 1) > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                <div className="p-2 rounded-lg bg-amber-100">
                  {currentPackage?.features?.dedicatedManager ? (
                    <Users className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Zap className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Special Features</p>
                  <div className="mt-1 space-y-1">
                    {currentPackage?.features?.prioritySupport && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-xs">Priority Support</span>
                      </div>
                    )}
                    {currentPackage?.features?.dedicatedManager && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-xs">Account Manager</span>
                      </div>
                    )}
                    {!currentPackage?.features?.prioritySupport && !currentPackage?.features?.dedicatedManager && (
                      <span className="text-xs text-muted-foreground">Standard support</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free Tier Warning */}
      {!activePackage && availablePackages.length === 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Stats Boxes */}
          <div className="grid gap-4 grid-cols-2">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <div className="p-2 rounded-lg bg-blue-100">
                <Ticket className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Monthly Tickets</p>
                <p className="text-2xl font-bold">{getRemainingTickets()}</p>
                <p className="text-xs text-muted-foreground">
                  {currentPackage?.features?.monthlyTickets === 'unlimited'
                    ? 'Unlimited access'
                    : `of ${currentPackage?.features?.monthlyTickets || 0} remaining`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <div className={`p-2 rounded-lg ${responseTimeInfo?.overdue ? 'bg-red-100' : 'bg-green-100'}`}>
                <Clock className={`h-5 w-5 ${responseTimeInfo?.overdue ? 'text-red-600' : 'text-green-600'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Response Time</p>
                {responseTimeInfo ? (
                  <>
                    <p className={`text-2xl font-bold ${responseTimeInfo.overdue ? 'text-red-600' : ''}`}>
                      {responseTimeInfo.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {responseTimeInfo.overdue ? 'Response overdue' : 'Until next response'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold">{currentPackage?.features?.responseTime || '48 hours'}</p>
                    <p className="text-xs text-muted-foreground">Maximum wait time</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <div className="p-2 rounded-lg bg-purple-100">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Support Channels</p>
                <p className="text-sm font-semibold mt-1">{currentPackage?.features?.supportChannels?.join(', ') || 'Ticket'}</p>
                <p className="text-xs text-muted-foreground">{currentPackage?.features?.supportChannels?.length || 1} channel{(currentPackage?.features?.supportChannels?.length || 1) > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Special Features</p>
                <div className="mt-1">
                  <span className="text-xs text-muted-foreground">No priority support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Warning and Upgrade */}
          <Card className="border-2 border-yellow-300 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-1">No Support Packages Available</h4>
                  <p className="text-sm text-yellow-800">
                    Support packages have not been added yet. You can only use Free Support with limited features.
                  </p>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-900 mb-2">
                  <strong>Upgrade benefits when available:</strong>
                </p>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• More monthly tickets</li>
                  <li>• Phone + Email support</li>
                  <li>• Faster response times</li>
                  <li>• Priority handling</li>
                  <li>• Dedicated account manager</li>
                </ul>
              </div>
              <Button
                onClick={() => setIsUpgradeSheetOpen(true)}
                className="w-full"
                variant="default"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Support Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground mt-2">
            Create and track your support requests
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <SheetHeader>
                <SheetTitle>Create Support Ticket</SheetTitle>
                <SheetDescription>
                  Describe your issue and our team will help you resolve it
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your issue..."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="support">Support</option>
                    <option value="billing">Billing</option>
                    <option value="technical">Technical</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={!currentPackage?.features.prioritySupport}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    {currentPackage?.features.prioritySupport && <option value="high">High</option>}
                  </select>
                  {!currentPackage?.features.prioritySupport && (
                    <p className="text-xs text-muted-foreground">
                      High priority requires a paid support package
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1 text-sm text-blue-900">
                    <p className="font-medium">Support Information</p>
                    <p className="text-blue-700">
                      Response time: {currentPackage?.features?.responseTime || '48 hours'}
                    </p>
                  </div>
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleCloseSheet}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Ticket
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              {filteredTickets.length} of {tickets.length} tickets
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      {tickets.length > 0 ? (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(ticket.category)}
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ticket className="h-3 w-3" />
                      <span>#{ticket.id}</span>
                      <Clock className="h-3 w-3" />
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ticket.message}
                </p>
                {ticket.responses && ticket.responses.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4" />
                    <span>{ticket.responses.length} Response{ticket.responses.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tickets</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'No tickets match your search' : 'Create your first support ticket'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsSheetOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upgrade Sheet */}
      <Sheet open={isUpgradeSheetOpen} onOpenChange={setIsUpgradeSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Upgrade Support Package</SheetTitle>
            <SheetDescription>
              Choose a package that fits your needs
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {availablePackages.filter(pkg => pkg.status === 'active').map((pkg) => (
              <Card key={pkg.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${
                activePackage?.id === pkg.id ? 'border-2 border-primary' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{pkg.name}</CardTitle>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold">€{pkg.price}</span>
                        <span className="text-muted-foreground">/{pkg.billingCycle}</span>
                      </div>
                    </div>
                    <Badge className={getPackageTierColor(pkg.tier || 'free')}>
                      {pkg.tier ? pkg.tier.charAt(0).toUpperCase() + pkg.tier.slice(1) : 'Free'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{pkg.features.monthlyTickets === 'unlimited' ? 'Unlimited' : pkg.features.monthlyTickets} tickets/month</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{pkg.features.responseTime} response time</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{pkg.features.supportChannels.join(', ')} support</span>
                    </li>
                    {pkg.features.prioritySupport && (
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Priority support</span>
                      </li>
                    )}
                    {pkg.features.dedicatedManager && (
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Dedicated account manager</span>
                      </li>
                    )}
                    {pkg.featuresList?.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    disabled={activePackage?.id === pkg.id}
                    onClick={() => {
                      alert('Payment integration will be added here')
                      setIsUpgradeSheetOpen(false)
                    }}
                  >
                    {activePackage?.id === pkg.id ? 'Current Package' : 'Select Package'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Package Sheet */}
      <Sheet open={isCancelSheetOpen} onOpenChange={setIsCancelSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Cancel Support Package</SheetTitle>
            <SheetDescription>
              Important information about cancellation
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-2">German B2B Law Compliance</h4>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li>• Your cancellation will take effect after <strong>3 months</strong></li>
                    <li>• You will continue to receive full support during this period</li>
                    <li>• You will be charged for the next <strong>3 months</strong></li>
                    <li>• After 3 months, you will be moved to Free Support</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {activePackage && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Current Package</p>
                <p className="text-lg font-semibold">{activePackage.name}</p>
                <p className="text-sm text-muted-foreground">€{activePackage.price}/{activePackage.billingCycle}</p>
              </div>
            )}
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsCancelSheetOpen(false)}>
              Keep Package
            </Button>
            <Button variant="destructive" onClick={handleCancelPackage}>
              Confirm Cancellation
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Ticket Details Sheet */}
      <Sheet open={selectedTicket !== null} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[700px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Ticket Details</SheetTitle>
          </SheetHeader>
          {selectedTicket && (
            <div className="max-h-[70vh] overflow-y-auto space-y-4">
              <div className="flex gap-2">
                {getCategoryBadge(selectedTicket.category)}
                {getPriorityBadge(selectedTicket.priority)}
                {getStatusBadge(selectedTicket.status)}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedTicket.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  Created: {selectedTicket.createdAt}
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{selectedTicket.message}</p>
              </div>

              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Responses ({selectedTicket.responses.length})</h4>
                  {selectedTicket.responses.map((response) => (
                    <div key={response.id} className={`p-4 rounded-lg ${response.author === 'support' ? 'bg-blue-50' : 'bg-muted/50'}`}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">
                          {response.author === 'support' ? 'Support Team' : 'You'}
                        </span>
                        <span className="text-sm text-muted-foreground">{response.createdAt}</span>
                      </div>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}