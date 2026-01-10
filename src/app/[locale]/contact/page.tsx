'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Menu, X, Code, ArrowRight, Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

interface Settings {
  general: {
    siteName?: string
    contactEmail: string
    contactPhone: string
    contactAddress: string
  }
}

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data.settings || data))
      .catch((error) => console.error('Error fetching settings:', error))
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString().split('T')[0],
          read: false,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit message')
      }

      toast({
        title: 'Message sent successfully!',
        description: 'We will get back to you within 24 hours.',
      })

      setFormData({ name: '', email: '', subject: '', message: '' })
      setPrivacyAccepted(false)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast({
        title: 'Failed to send message',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">ModernAgency</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary text-muted-foreground`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="text-sm">
              Contact Us
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              Let's
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Start Something Amazing Together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have a project in mind? We'd love to hear about it. Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    We typically respond within 24 hours on business days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <input
                        id="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Project inquiry"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        placeholder="Tell us about your project..."
                        rows={5}
                      />
                    </div>

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/30">
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
                        and that my personal data (name, first name, telephone number and email address) will be stored and processed for the purpose of handling my request.
                        <span className="text-destructive ml-1">*</span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || !privacyAccepted}
                      size="lg"
                      className="w-full transition-all hover:scale-105 hover:shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <Send className="mr-2 h-4 w-4 animate-pulse" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">
                        {settings?.general?.contactEmail || 'hello@modernagency.com'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        For general inquiries and project discussions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-muted-foreground">
                        {settings?.general?.contactPhone || '+1 (555) 123-4567'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mon-Fri, 9AM-6PM PST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Office</h3>
                      <p className="text-muted-foreground">
                        {settings?.general?.contactAddress || 'San Francisco, CA'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Visit us at our main office
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Code className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Response Time</h3>
                      <p className="text-muted-foreground">Within 24 hours</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        We aim to respond to all inquiries as quickly as possible
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">Office Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Work With Us?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Expert Team</p>
                        <p className="text-sm text-muted-foreground">
                          15+ years of combined experience in web development and design
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Client-Focused</p>
                        <p className="text-sm text-muted-foreground">
                          We prioritize your goals and deliver solutions that exceed expectations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Transparent Pricing</p>
                        <p className="text-sm text-muted-foreground">
                          Clear, upfront pricing with no hidden fees or surprises
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Ongoing Support</p>
                        <p className="text-sm text-muted-foreground">
                          We provide continuous support even after project completion
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let's discuss how we can help you achieve your digital goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-base" asChild>
                  <Link href="/">
                    View Our Services
                  </Link>
                </Button>
                <Button size="lg" className="text-base" asChild>
                  <Link href="/portfolio">
                    <ArrowRight className="ml-2 h-4 w-4" />
                    View Our Portfolio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">ModernAgency</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Creating digital experiences that drive results and inspire growth.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Web Development</li>
                <li>UI/UX Design</li>
                <li>E-commerce</li>
                <li>Mobile Apps</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>{new Date().getFullYear()} {settings?.general?.siteName || 'ModernAgency'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
