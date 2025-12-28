'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Globe,
  Palette,
  Smartphone,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Search,
  Clock,
  Users,
  FileText,
  Image,
  MessageSquare,
  Settings,
  Cloud,
  Award,
  Briefcase,
  Home,
  Info,
  Contact,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function BusinessWebsiteBasicPage() {
  const features = [
    {
      icon: Palette,
      title: 'Professional Design',
      description: 'Modern, clean design template customized with your branding and colors'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Perfect display and functionality on all smartphones, tablets, and desktops'
    },
    {
      icon: FileText,
      title: 'Essential Pages',
      description: 'Up to 5 pages including Home, About, Services, Contact, and one custom page'
    },
    {
      icon: MessageSquare,
      title: 'Contact Form',
      description: 'Simple contact form with email notification for new inquiries'
    },
    {
      icon: Search,
      title: 'Basic SEO',
      description: 'Search engine friendly structure with meta tags and sitemap'
    },
    {
      icon: Cloud,
      title: 'Hosting Included',
      description: '1 year of reliable web hosting with SSL certificate (HTTPS)'
    },
    {
      icon: Mail,
      title: 'Business Email',
      description: '2 professional email addresses (info@yourdomain.com)'
    },
    {
      icon: Zap,
      title: 'Fast Loading',
      description: 'Optimized for speed to ensure visitors don\'t bounce'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Basic security measures including SSL encryption and regular backups'
    }
  ]

  const includedPages = [
    {
      icon: Home,
      page: 'Home Page',
      description: 'Welcome visitors with your key message, services overview, and call-to-action'
    },
    {
      icon: Info,
      page: 'About Page',
      description: 'Tell your story, showcase your team, and build trust with potential clients'
    },
    {
      icon: Briefcase,
      page: 'Services Page',
      description: 'Highlight what you offer with clear descriptions and benefits'
    },
    {
      icon: Contact,
      page: 'Contact Page',
      description: 'Contact form, address, phone, email, and optional map integration'
    },
    {
      icon: FileText,
      page: 'Custom Page',
      description: 'One additional page of your choice (e.g., FAQ, Portfolio, Testimonials)'
    }
  ]

  const perfectFor = [
    {
      type: 'Small Businesses',
      examples: ['Local shops', 'Service providers', 'Consultants', 'Tradespersons']
    },
    {
      type: 'Startups',
      examples: ['New businesses', 'Entrepreneurs', 'Freelancers', 'Agencies']
    },
    {
      type: 'Professional Services',
      examples: ['Lawyers', 'Accountants', 'Coaches', 'Therapists']
    },
    {
      type: 'Local Services',
      examples: ['Restaurants', 'Salons', 'Clinics', 'Studios']
    }
  ]

  const whatYouGet = [
    'Professional website design',
    'Up to 5 pages of content',
    'Mobile responsive layout',
    'Contact form with email notifications',
    'Google Maps integration (optional)',
    'Social media links',
    'Image gallery (up to 20 images)',
    'Basic SEO optimization',
    'Meta tags and descriptions',
    'XML sitemap',
    'SSL certificate (HTTPS)',
    '1 year web hosting',
    '2 professional email addresses',
    'Domain setup (domain not included)',
    'Content upload (you provide content)',
    '2 rounds of revisions',
    'Basic training on updates',
    '30 days post-launch support'
  ]

  const process = [
    {
      step: 1,
      title: 'Information Gathering',
      description: 'You provide your business info, content, images, and branding preferences',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Design Setup',
      description: 'We customize a professional template with your branding and colors',
      duration: '2-3 days'
    },
    {
      step: 3,
      title: 'Content Integration',
      description: 'Adding your text, images, contact information, and all page content',
      duration: '2-3 days'
    },
    {
      step: 4,
      title: 'Review & Adjustments',
      description: 'You review the website and we make necessary changes (2 rounds)',
      duration: '2-3 days'
    },
    {
      step: 5,
      title: 'Launch & Training',
      description: 'Website goes live and we show you how to make basic updates',
      duration: '1 day'
    }
  ]

  const notIncluded = [
    'Domain registration (€15-30/year)',
    'Custom design (see Business Website Premium)',
    'E-commerce functionality',
    'Blog functionality',
    'Advanced features or integrations',
    'Copywriting services',
    'Professional photography',
    'Logo design',
    'Ongoing maintenance (available separately)'
  ]

  const addOns = [
    {
      service: 'Additional Pages',
      price: '€99/page',
      description: 'Add more pages to your website'
    },
    {
      service: 'Blog Setup',
      price: '€199',
      description: 'Add a blog with CMS for articles'
    },
    {
      service: 'Image Gallery',
      price: '€149',
      description: 'Enhanced gallery with more images'
    },
    {
      service: 'Monthly Maintenance',
      price: '€49/month',
      description: 'Updates, backups, and support'
    },
    {
      service: 'Content Updates',
      price: '€39/hour',
      description: 'We update content for you'
    },
    {
      service: 'SEO Package',
      price: '€299',
      description: 'Enhanced SEO optimization'
    }
  ]

  const pricingPackage = {
    name: 'Business Website Basic',
    price: '€999',
    description: 'Everything you need to establish your professional online presence',
    deliveryTime: '7-10 business days',
    setupFee: 'One-time payment',
    hosting: '1 year included, then €99/year'
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Business Website <span className="text-primary">Basic</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Affordable, professional website package perfect for small businesses and startups. Get online quickly with a modern, mobile-friendly website that presents your business professionally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Your Website <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Examples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What's Included
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to get your business online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Included Pages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Your 5 Essential Pages
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional pages that cover all the basics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {includedPages.map((page, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <page.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{page.page}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Perfect For
            </h2>
            <p className="text-xl text-muted-foreground">
              Ideal for businesses just starting their online journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perfectFor.map((category, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg mb-4">{category.type}</CardTitle>
                  <div className="space-y-2">
                    {category.examples.map((example, eIndex) => (
                      <div key={eIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              From order to launch in 7-10 days
            </p>
          </div>

          <div className="space-y-6">
            {process.map((phase, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {phase.step}
                        </div>
                        <CardTitle className="text-xl">{phase.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">{phase.description}</CardDescription>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {phase.duration}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Complete Package Details
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything included in your Basic package
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl text-primary mb-4">✓ What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {whatYouGet.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl mb-4">Not Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notIncluded.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-3 h-3 border-2 border-muted-foreground rounded" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Get your business online for less than you think
            </p>
          </div>

          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl mb-2">{pricingPackage.name}</CardTitle>
              <div className="flex flex-col items-center gap-2 my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">{pricingPackage.price}</span>
                </div>
                <div className="text-lg text-muted-foreground">
                  {pricingPackage.setupFee}
                </div>
                <div className="text-sm text-muted-foreground">
                  {pricingPackage.hosting}
                </div>
              </div>
              <CardDescription className="text-lg">{pricingPackage.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Delivery: {pricingPackage.deliveryTime}</span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid md:grid-cols-2 gap-3">
                  {whatYouGet.slice(0, 12).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link href="/appointment" className="block">
                  <Button size="lg" className="w-full text-lg">
                    Order Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Need more features? Check out our <Link href="/services/fullservice-website" className="text-primary hover:underline font-semibold">Full-Service Website</Link> packages.
            </p>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Optional Add-ons
            </h2>
            <p className="text-xl text-muted-foreground">
              Extend your website with additional features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((item, index) => (
              <Card key={index} className="hover:border-primary transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-base">{item.service}</CardTitle>
                    <span className="text-primary font-bold text-sm whitespace-nowrap ml-2">{item.price}</span>
                  </div>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get Your Business Online?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of small businesses who trust us with their online presence. Get started today and have your professional website live in just 7-10 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Started Now
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}