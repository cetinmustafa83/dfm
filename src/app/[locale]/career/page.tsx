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
import { Briefcase, ArrowRight, Phone, Mail, Users, Target, TrendingUp, Award } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function CareerPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    linkedIn: '',
    portfolio: '',
    message: '',
    resumeUrl: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare message for admin panel
      const messageContent = `
Career Application:
-------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Position Applied: ${formData.position}
Years of Experience: ${formData.experience}
LinkedIn: ${formData.linkedIn || 'Not provided'}
Portfolio: ${formData.portfolio || 'Not provided'}

Cover Letter/Message:
${formData.message}

${formData.resumeUrl ? `Resume: ${formData.resumeUrl}` : 'Resume: Not uploaded'}
      `.trim()

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Career Application: ${formData.position}`,
          message: messageContent,
          status: 'unread',
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit career application')
      }

      toast({
        title: 'Application sent successfully!',
        description: 'We will review your application and get back to you soon.',
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        linkedIn: '',
        portfolio: '',
        message: '',
        resumeUrl: '',
      })
      setPrivacyAccepted(false)
      setIsOpen(false)
    } catch (error) {
      console.error('Error submitting career application:', error)
      toast({
        title: 'Failed to send application',
        description: 'Please try again later.',
        variant: 'destructive',
      })
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Join Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Be part of a dynamic team building innovative digital solutions. We're always looking for talented individuals passionate about technology.
            </p>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6">
                  Apply Now <Briefcase className="ml-2 h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Submit Your Application</SheetTitle>
                  <SheetDescription>
                    Fill out the form below to apply for a position at our company.
                  </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name *
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

                  {/* Email */}
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
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
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

                  {/* Position */}
                  <div className="space-y-2">
                    <label htmlFor="position" className="text-sm font-medium">
                      Position Applied For *
                    </label>
                    <select
                      id="position"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select a position</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Marketing Specialist">Marketing Specialist</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label htmlFor="experience" className="text-sm font-medium">
                      Years of Experience *
                    </label>
                    <select
                      id="experience"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select experience level</option>
                      <option value="0-1 years">0-1 years (Entry Level)</option>
                      <option value="1-3 years">1-3 years (Junior)</option>
                      <option value="3-5 years">3-5 years (Mid-Level)</option>
                      <option value="5-10 years">5-10 years (Senior)</option>
                      <option value="10+ years">10+ years (Expert)</option>
                    </select>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <label htmlFor="linkedIn" className="text-sm font-medium">
                      LinkedIn Profile
                    </label>
                    <input
                      id="linkedIn"
                      type="url"
                      value={formData.linkedIn}
                      onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>

                  {/* Portfolio */}
                  <div className="space-y-2">
                    <label htmlFor="portfolio" className="text-sm font-medium">
                      Portfolio/Website
                    </label>
                    <input
                      id="portfolio"
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="https://johndoe.com"
                    />
                  </div>

                  {/* Message/Cover Letter */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Cover Letter / Why You? *
                    </label>
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      placeholder="Tell us why you'd be a great fit for this position..."
                    />
                  </div>

                  {/* Resume Upload Note */}
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      📎 Please attach your resume/CV in your email or mention it in your cover letter above.
                    </p>
                  </div>

                  {/* Privacy Policy */}
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
                      and agree to the processing of my personal data for recruitment purposes.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !privacyAccepted}
                    className="w-full h-12 text-base"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Application'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Great Team</h3>
              <p className="text-muted-foreground">
                Work with talented professionals in a collaborative environment
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Career Growth</h3>
              <p className="text-muted-foreground">
                Opportunities for professional development and advancement
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Exciting Projects</h3>
              <p className="text-muted-foreground">
                Work on innovative projects with cutting-edge technologies
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Competitive Benefits</h3>
              <p className="text-muted-foreground">
                Attractive salary packages and employee benefits
              </p>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mt-20 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground">Explore our current job opportunities</p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  title: 'Frontend Developer',
                  type: 'Full-time',
                  location: 'Remote / Hybrid',
                  description: 'Build stunning user interfaces with React, Next.js, and modern web technologies.',
                },
                {
                  title: 'Full Stack Developer',
                  type: 'Full-time',
                  location: 'On-site / Remote',
                  description: 'Work on both frontend and backend, creating complete web applications.',
                },
                {
                  title: 'UI/UX Designer',
                  type: 'Full-time',
                  location: 'Hybrid',
                  description: 'Design beautiful and intuitive user experiences for our digital products.',
                },
              ].map((job, index) => (
                <div key={index} className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground">{job.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => setIsOpen(true)} className="md:w-auto">
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-20 bg-card border rounded-lg p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Don't See Your Perfect Role?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're always interested in hearing from talented individuals. Send us your details and we'll keep you in mind for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a href="mailto:careers@example.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="w-5 h-5" />
                careers@example.com
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a href="tel:+15551234567" className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="w-5 h-5" />
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}