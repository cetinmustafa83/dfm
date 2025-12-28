'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { LifeBuoy, MessageSquare, Clock, CheckCircle2, Headphones, Shield } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function TicketPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    priority: 'medium',
    category: '',
    subject: '',
    message: '',
    privacyAccepted: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.privacyAccepted) {
      toast.error('Please accept the privacy policy')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `[TICKET] [${formData.priority.toUpperCase()}] ${formData.category} - ${formData.subject}`,
          message: `Priority: ${formData.priority}\nCategory: ${formData.category}\nPhone: ${formData.phone}\n\n${formData.message}`,
          status: 'unread',
          category: 'ticket',
        }),
      })

      if (response.ok) {
        toast.success('Support ticket submitted successfully!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          priority: 'medium',
          category: '',
          subject: '',
          message: '',
          privacyAccepted: false,
        })
        setIsOpen(false)
      } else {
        toast.error('Failed to submit ticket')
      }
    } catch (error) {
      console.error('Error submitting ticket:', error)
      toast.error('An error occurred while submitting your ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <LifeBuoy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Support Ticket System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Need technical support or have a question? Submit a support ticket and our team will get back to you as soon as possible.
          </p>
          <Button size="lg" onClick={() => setIsOpen(true)} className="gap-2">
            <MessageSquare className="w-5 h-5" />
            Submit a Ticket
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="w-10 h-10 text-primary mb-4" />
                <CardTitle>24/7 Availability</CardTitle>
                <CardDescription>
                  Submit tickets anytime, anywhere. Our system is always available to receive your support requests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Fast Response Time</CardTitle>
                <CardDescription>
                  Our support team prioritizes tickets based on urgency and responds quickly to resolve your issues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Headphones className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Expert Support</CardTitle>
                <CardDescription>
                  Get help from experienced professionals who understand your technical challenges and provide solutions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Support Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Technical Issues', description: 'Software bugs, errors, crashes' },
              { title: 'Account & Billing', description: 'Payment, subscriptions, invoices' },
              { title: 'Feature Requests', description: 'New features, improvements' },
              { title: 'General Questions', description: 'How-to guides, documentation' },
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Priority Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-primary" />
                <CardTitle>Priority Levels</CardTitle>
              </div>
              <CardDescription>
                Understanding ticket priority helps us respond to your needs more effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <h3 className="font-semibold">High Priority</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Critical issues affecting business operations (Response: ~2 hours)
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <h3 className="font-semibold">Medium Priority</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Important issues with workarounds available (Response: ~24 hours)
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h3 className="font-semibold">Low Priority</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    General questions and feature requests (Response: ~48 hours)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ticket Form Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Submit Support Ticket</SheetTitle>
            <SheetDescription>
              Fill out the form below and our support team will get back to you
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Contact Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Ticket Details</h3>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="low">Low - General questions</option>
                  <option value="medium">Medium - Important but not urgent</option>
                  <option value="high">High - Critical issue</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select a category...</option>
                  <option value="Technical Issues">Technical Issues</option>
                  <option value="Account & Billing">Account & Billing</option>
                  <option value="Feature Requests">Feature Requests</option>
                  <option value="General Questions">General Questions</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Detailed Description *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide as much detail as possible about your issue or question..."
                  className="min-h-[150px]"
                  required
                />
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={formData.privacyAccepted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, privacyAccepted: checked as boolean })
                }
                required
              />
              <label
                htmlFor="privacy"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the privacy policy and agree to the processing of my personal data *
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}