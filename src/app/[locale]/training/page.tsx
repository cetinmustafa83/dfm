'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { GraduationCap, Calendar, ArrowRight, Clock, Users, Award, BookOpen, Target, Globe, ShoppingCart } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function TrainingPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    trainingTopic: '',
    participantCount: '',
    preferredDate: '',
    preferredTime: '',
    duration: '',
    location: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const messageContent = `
Training Appointment Request:
----------------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company || 'Not provided'}

Training Details:
-----------------
Topic: ${formData.trainingTopic}
Number of Participants: ${formData.participantCount}
Preferred Date: ${formData.preferredDate}
Preferred Time: ${formData.preferredTime}
Duration: ${formData.duration}
Location Preference: ${formData.location}

Additional Information:
${formData.message || 'No additional information provided'}
      `.trim()

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Training Appointment: ${formData.trainingTopic}`,
          message: messageContent,
          status: 'unread',
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit training appointment request')
      }

      toast({
        title: 'Appointment request sent successfully!',
        description: 'We will contact you shortly to confirm your training session.',
      })

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        trainingTopic: '',
        participantCount: '',
        preferredDate: '',
        preferredTime: '',
        duration: '',
        location: '',
        message: '',
      })
      setPrivacyAccepted(false)
      setIsOpen(false)
    } catch (error) {
      console.error('Error submitting training appointment:', error)
      toast({
        title: 'Failed to send appointment request',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            ← Back to Home
          </Link>
        </div>
      </header>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Project <span className="text-primary">Training</span> Sessions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get professional training on your completed project to maximize its potential. Learn to use and manage your project efficiently.
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg p-6 max-w-3xl mx-auto space-y-2">
              <p className="text-green-900 dark:text-green-100 font-semibold text-lg">
                🎁 First Training Session Free (up to 1 hour)
              </p>
              <p className="text-green-800 dark:text-green-200">
                Additional training: €50/hour | Training sessions require scheduled appointments
              </p>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6">
                  Book Training Session <Calendar className="ml-2 h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Schedule Training Appointment</SheetTitle>
                  <SheetDescription>
                    Fill out the form below to request a training session. We&apos;ll contact you to confirm the details.
                  </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Contact Person *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Acme Corporation"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="trainingTopic" className="text-sm font-medium">
                      Project/Training Topic *
                    </label>
                    <input
                      id="trainingTopic"
                      type="text"
                      required
                      value={formData.trainingTopic}
                      onChange={(e) => setFormData({ ...formData, trainingTopic: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="e.g., E-commerce Website Training, CMS Usage, Admin Panel Training"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the name or type of project you need training for
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="participantCount" className="text-sm font-medium">
                      Number of Participants *
                    </label>
                    <select
                      id="participantCount"
                      required
                      value={formData.participantCount}
                      onChange={(e) => setFormData({ ...formData, participantCount: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select number of participants</option>
                      <option value="1 person">1 person</option>
                      <option value="2-3 people">2-3 people</option>
                      <option value="4-5 people">4-5 people</option>
                      <option value="6-10 people">6-10 people</option>
                      <option value="More than 10">More than 10 people</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredDate" className="text-sm font-medium">
                      Preferred Date *
                    </label>
                    <input
                      id="preferredDate"
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredTime" className="text-sm font-medium">
                      Preferred Time *
                    </label>
                    <select
                      id="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select preferred time</option>
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                      <option value="Full Day (9:00 AM - 5:00 PM)">Full Day (9:00 AM - 5:00 PM)</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium">
                      Estimated Training Duration *
                    </label>
                    <select
                      id="duration"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select estimated duration</option>
                      <option value="1 hour (Free Initial Training)">1 hour (Free Initial Training)</option>
                      <option value="2 hours (1h free + 1h €50)">2 hours (1h free + 1h €50)</option>
                      <option value="3 hours (1h free + 2h €100)">3 hours (1h free + 2h €100)</option>
                      <option value="4 hours (1h free + 3h €150)">4 hours (1h free + 3h €150)</option>
                      <option value="Custom Duration">Custom Duration (specify in message)</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      First hour is always free. Additional hours: €50/hour
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location Preference *
                    </label>
                    <select
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select location</option>
                      <option value="On-site at our facility">On-site at our facility</option>
                      <option value="At your location">At your location</option>
                      <option value="Online/Remote">Online/Remote</option>
                      <option value="Hybrid">Hybrid (Online + In-person)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Additional Information
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      placeholder="Any specific requirements, learning objectives, or questions..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      required
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
                      I hereby confirm that I have read the{' '}
                      <a href="/datenschutz" target="_blank" className="text-primary hover:underline font-medium">
                        privacy policy
                      </a>{' '}
                      and agree to the processing of my personal data for training coordination purposes.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !privacyAccepted}
                    className="w-full h-12 text-base"
                  >
                    {isSubmitting ? 'Sending...' : 'Request Training Appointment'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Project-Specific</h3>
              <p className="text-muted-foreground">
                Training focused exclusively on your completed project and its features
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Practical Knowledge</h3>
              <p className="text-muted-foreground">
                Learn to efficiently use and manage your project with hands-on guidance
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">First Hour Free</h3>
              <p className="text-muted-foreground">
                Get started with a complimentary 1-hour training session on your project
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Flexible Schedule</h3>
              <p className="text-muted-foreground">
                Additional training available at €50/hour based on your needs
              </p>
            </div>
          </div>

          <div className="mt-20 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">What We Cover in Training</h2>
              <p className="text-muted-foreground">Comprehensive training on your completed projects</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Website Management',
                  description: 'Learn to update content, manage pages, and maintain your website efficiently',
                  icon: Globe,
                },
                {
                  title: 'E-Commerce Operations',
                  description: 'Product management, order processing, inventory, and customer handling',
                  icon: ShoppingCart,
                },
                {
                  title: 'Content Management',
                  description: 'Upload images, edit text, manage blog posts and multimedia content',
                  icon: BookOpen,
                },
                {
                  title: 'Admin Panel Usage',
                  description: 'Navigate and utilize all features of your project\'s admin dashboard',
                  icon: Target,
                },
                {
                  title: 'User Management',
                  description: 'Handle user accounts, permissions, roles, and access control',
                  icon: Users,
                },
                {
                  title: 'Custom Features',
                  description: 'Training on any custom functionality specific to your project',
                  icon: Award,
                },
              ].map((training, index) => {
                const Icon = training.icon
                return (
                  <div key={index} className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{training.title}</h3>
                        <p className="text-muted-foreground text-sm">{training.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-20 bg-gradient-to-br from-primary/5 to-primary/10 border rounded-xl p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h3 className="text-3xl font-bold">Ready to Master Your Project?</h3>
              <p className="text-muted-foreground text-lg">
                Schedule your training session today and learn to use your completed project efficiently. First hour is completely free!
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-8 text-left">
                <div className="bg-card rounded-lg p-4">
                  <div className="font-semibold text-primary mb-2">✓ Free Initial Training</div>
                  <p className="text-sm text-muted-foreground">First hour completely free for all clients</p>
                </div>
                <div className="bg-card rounded-lg p-4">
                  <div className="font-semibold text-primary mb-2">✓ Additional Training</div>
                  <p className="text-sm text-muted-foreground">€50/hour for extended training sessions</p>
                </div>
              </div>
              <Button size="lg" onClick={() => setIsOpen(true)} className="mt-6">
                Book Training Session <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}