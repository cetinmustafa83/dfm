'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap,
  Target,
  TrendingUp,
  MousePointerClick,
  Palette,
  Smartphone,
  BarChart3,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Users,
  Award,
  Clock,
  Eye,
  MessageSquare,
  ShoppingCart,
  FileCheck,
  Sparkles,
  CircleDot
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPagePage() {
  const features = [
    {
      icon: Target,
      title: 'Conversion-Focused Design',
      description: 'Every element strategically placed to guide visitors toward your desired action'
    },
    {
      icon: Zap,
      title: 'Fast Loading Speed',
      description: 'Optimized performance ensuring visitors don\'t bounce due to slow loading times'
    },
    {
      icon: MousePointerClick,
      title: 'Clear Call-to-Actions',
      description: 'Compelling CTAs that drive clicks and conversions at every stage'
    },
    {
      icon: Palette,
      title: 'Professional Design',
      description: 'Eye-catching, modern designs that capture attention and build trust'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Perfect display and functionality across all devices and screen sizes'
    },
    {
      icon: BarChart3,
      title: 'Analytics Integration',
      description: 'Track visitor behavior, conversions, and ROI with integrated analytics'
    },
    {
      icon: MessageSquare,
      title: 'Lead Capture Forms',
      description: 'Optimized forms that maximize lead generation while minimizing friction'
    },
    {
      icon: Award,
      title: 'A/B Testing Ready',
      description: 'Built for testing different versions to continuously improve conversion rates'
    },
    {
      icon: Eye,
      title: 'SEO Optimized',
      description: 'Search engine friendly structure to attract organic traffic'
    }
  ]

  const landingPageTypes = [
    {
      icon: ShoppingCart,
      title: 'Product Launch Pages',
      description: 'Generate excitement and pre-orders for new product releases',
      useCases: ['E-commerce products', 'Digital products', 'SaaS launches']
    },
    {
      icon: Users,
      title: 'Lead Generation Pages',
      description: 'Capture qualified leads for your sales funnel',
      useCases: ['B2B services', 'Consulting', 'Real estate']
    },
    {
      icon: FileCheck,
      title: 'Event Registration Pages',
      description: 'Drive sign-ups for webinars, conferences, and events',
      useCases: ['Webinars', 'Workshops', 'Conferences']
    },
    {
      icon: Rocket,
      title: 'App Download Pages',
      description: 'Increase mobile app downloads and installations',
      useCases: ['iOS apps', 'Android apps', 'Web apps']
    },
    {
      icon: CircleDot,
      title: 'Campaign Landing Pages',
      description: 'Support marketing campaigns with targeted pages',
      useCases: ['PPC campaigns', 'Email campaigns', 'Social media ads']
    },
    {
      icon: TrendingUp,
      title: 'Sales Pages',
      description: 'Convert visitors into paying customers',
      useCases: ['Online courses', 'Services', 'Subscriptions']
    }
  ]

  const process = [
    {
      phase: 'Discovery & Strategy',
      description: 'Understanding your goals, target audience, and unique value proposition',
      duration: '2-3 days'
    },
    {
      phase: 'Wireframing & Structure',
      description: 'Planning the page layout and user journey for optimal conversion',
      duration: '1-2 days'
    },
    {
      phase: 'Design & Copywriting',
      description: 'Creating compelling visuals and persuasive copy that converts',
      duration: '3-5 days'
    },
    {
      phase: 'Development',
      description: 'Building a fast, responsive, and conversion-optimized landing page',
      duration: '3-5 days'
    },
    {
      phase: 'Testing & Optimization',
      description: 'Cross-browser testing, speed optimization, and final adjustments',
      duration: '1-2 days'
    },
    {
      phase: 'Launch & Tracking',
      description: 'Deployment with analytics setup for tracking performance',
      duration: '1 day'
    }
  ]

  const packages = [
    {
      name: 'Essential Landing Page',
      price: '€599',
      description: 'Perfect for testing new campaigns or simple offers',
      features: [
        'Single page design',
        'Up to 5 sections',
        'Mobile responsive',
        'Contact form',
        'Basic SEO setup',
        'Google Analytics integration',
        '2 rounds of revisions',
        '14-day delivery'
      ]
    },
    {
      name: 'Professional Landing Page',
      price: '€999',
      description: 'Comprehensive landing page with advanced features',
      features: [
        'Custom design',
        'Up to 8 sections',
        'Mobile responsive',
        'Advanced forms',
        'A/B testing setup',
        'SEO optimization',
        'Email integration',
        'Social proof elements',
        '3 rounds of revisions',
        '10-day delivery'
      ],
      popular: true
    },
    {
      name: 'Premium Funnel',
      price: '€1,999',
      description: 'Complete conversion funnel with multiple pages',
      features: [
        'Multi-page funnel',
        'Landing page + Thank you page',
        'Custom illustrations',
        'Video integration',
        'Advanced analytics',
        'CRM integration',
        'Marketing automation',
        'A/B testing variants',
        'Unlimited revisions',
        'Priority 7-day delivery',
        '30 days post-launch support'
      ]
    }
  ]

  const conversionElements = [
    {
      element: 'Compelling Headline',
      description: 'Clear, benefit-driven headline that immediately communicates your value'
    },
    {
      element: 'Strong Visuals',
      description: 'High-quality images or videos that showcase your product or service'
    },
    {
      element: 'Social Proof',
      description: 'Testimonials, reviews, case studies, and trust badges'
    },
    {
      element: 'Benefit-Focused Copy',
      description: 'Content that addresses pain points and highlights solutions'
    },
    {
      element: 'Clear CTAs',
      description: 'Prominent, action-oriented buttons guiding users to convert'
    },
    {
      element: 'Minimal Distractions',
      description: 'Focused layout without unnecessary navigation or links'
    }
  ]

  const stats = [
    {
      stat: '68%',
      description: 'of B2B businesses use landing pages to generate leads'
    },
    {
      stat: '2-5%',
      description: 'average conversion rate for well-optimized landing pages'
    },
    {
      stat: '52%',
      description: 'of PPC advertisers use dedicated landing pages'
    },
    {
      stat: '300%',
      description: 'potential increase in conversions with A/B testing'
    }
  ]

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
              <Rocket className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              High-Converting <span className="text-primary">Landing Pages</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Turn visitors into customers with professionally designed landing pages optimized for conversions. Perfect for campaigns, product launches, lead generation, and sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Your Landing Page <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Landing Pages Work
            </h2>
            <p className="text-xl text-muted-foreground">
              Data-driven results that speak for themselves
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((item, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary mb-2">
                    {item.stat}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Makes Our Landing Pages Convert
            </h2>
            <p className="text-xl text-muted-foreground">
              Every element designed to maximize conversions
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

      {/* Landing Page Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Landing Pages for Every Purpose
            </h2>
            <p className="text-xl text-muted-foreground">
              Customized solutions for your specific marketing goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingPageTypes.map((type, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <type.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription className="mb-4">{type.description}</CardDescription>
                  <div className="space-y-1">
                    {type.useCases.map((useCase, ucIndex) => (
                      <div key={ucIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>{useCase}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion Elements */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Essential Conversion Elements
            </h2>
            <p className="text-xl text-muted-foreground">
              The building blocks of high-converting landing pages
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {conversionElements.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <CardTitle className="text-lg mb-2">{item.element}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Landing Page Process
            </h2>
            <p className="text-xl text-muted-foreground">
              From concept to conversion in 10-14 days
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
                          {index + 1}
                        </div>
                        <CardTitle className="text-xl">{phase.phase}</CardTitle>
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

      {/* Pricing Packages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Landing Page Packages
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the package that fits your campaign needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${pkg.popular ? 'border-primary border-2 shadow-lg' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                  </div>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/appointment" className="block mt-6">
                    <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Boost Your Conversions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's create a landing page that turns your traffic into customers. Start your project today and see results within 2 weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}