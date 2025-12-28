'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search,
  TrendingUp,
  Target,
  FileText,
  Link2,
  BarChart3,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Users,
  Smartphone,
  Code,
  LineChart,
  Award,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function SEOPage() {
  const seoServices = [
    {
      icon: Search,
      title: 'Keyword Research & Analysis',
      description: 'In-depth keyword research to identify high-value search terms your target audience uses'
    },
    {
      icon: FileText,
      title: 'On-Page Optimization',
      description: 'Optimizing titles, meta descriptions, headers, content, and URL structures for better rankings'
    },
    {
      icon: Link2,
      title: 'Link Building',
      description: 'Strategic acquisition of high-quality backlinks to increase domain authority and rankings'
    },
    {
      icon: Code,
      title: 'Technical SEO',
      description: 'Optimizing site speed, mobile responsiveness, schema markup, and crawlability'
    },
    {
      icon: FileText,
      title: 'Content Strategy',
      description: 'Creating SEO-optimized content that engages users and ranks well in search engines'
    },
    {
      icon: Globe,
      title: 'Local SEO',
      description: 'Optimizing for local search results with Google Business Profile and local citations'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive tracking and reporting of rankings, traffic, and conversion metrics'
    },
    {
      icon: Target,
      title: 'Competitor Analysis',
      description: 'Analyzing competitor strategies to identify opportunities and stay ahead'
    },
    {
      icon: Smartphone,
      title: 'Mobile SEO',
      description: 'Ensuring perfect optimization for mobile search and voice search queries'
    }
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increased Organic Traffic',
      description: 'Higher rankings lead to more visitors finding your website through search engines'
    },
    {
      icon: Users,
      title: 'Better User Experience',
      description: 'SEO improvements enhance site usability, speed, and overall user satisfaction'
    },
    {
      icon: Award,
      title: 'Brand Credibility',
      description: 'Top search rankings establish your brand as a trusted authority in your industry'
    },
    {
      icon: LineChart,
      title: 'Long-term ROI',
      description: 'SEO provides sustainable results and continuous return on investment over time'
    }
  ]

  const process = [
    {
      phase: 'SEO Audit',
      description: 'Comprehensive analysis of your current website performance, technical issues, and ranking opportunities',
      duration: '1 week'
    },
    {
      phase: 'Strategy Development',
      description: 'Creating a customized SEO roadmap based on your goals, industry, and competition',
      duration: '1 week'
    },
    {
      phase: 'On-Page Optimization',
      description: 'Implementing technical improvements, optimizing content, and fixing structural issues',
      duration: '2-4 weeks'
    },
    {
      phase: 'Content Creation',
      description: 'Developing SEO-optimized content that targets your key search terms and audience needs',
      duration: 'Ongoing'
    },
    {
      phase: 'Link Building',
      description: 'Strategic outreach and relationship building to earn high-quality backlinks',
      duration: 'Ongoing'
    },
    {
      phase: 'Monitoring & Reporting',
      description: 'Continuous tracking of rankings, traffic, and adjusting strategy based on data',
      duration: 'Monthly'
    }
  ]

  const packages = [
    {
      name: 'Starter SEO',
      price: '€499',
      period: '/month',
      description: 'Perfect for small businesses starting their SEO journey',
      features: [
        'Up to 10 keywords',
        'Basic on-page optimization',
        'Monthly performance report',
        'Google Business Profile optimization',
        'Technical SEO audit',
        'Content recommendations'
      ]
    },
    {
      name: 'Professional SEO',
      price: '€999',
      period: '/month',
      description: 'Comprehensive SEO for growing businesses',
      features: [
        'Up to 30 keywords',
        'Advanced on-page optimization',
        'Monthly content creation (2-4 articles)',
        'Link building campaign',
        'Bi-weekly performance reports',
        'Competitor analysis',
        'Technical SEO maintenance',
        'Local SEO optimization'
      ],
      popular: true
    },
    {
      name: 'Enterprise SEO',
      price: 'Custom',
      period: 'pricing',
      description: 'Full-scale SEO for large businesses and e-commerce',
      features: [
        'Unlimited keywords',
        'Comprehensive optimization',
        'Weekly content creation',
        'Aggressive link building',
        'Weekly performance reports',
        'Dedicated SEO manager',
        'Advanced technical SEO',
        'International SEO',
        'Custom strategy development'
      ]
    }
  ]

  const whySEO = [
    {
      stat: '93%',
      description: 'of online experiences begin with a search engine'
    },
    {
      stat: '75%',
      description: 'of users never scroll past the first page of search results'
    },
    {
      stat: '70-80%',
      description: 'of users ignore paid ads and focus on organic results'
    },
    {
      stat: '14.6%',
      description: 'average close rate for SEO leads vs 1.7% for traditional marketing'
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
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Search Engine <span className="text-primary">Optimization (SEO)</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Increase your online visibility, attract more qualified traffic, and grow your business with professional SEO services. Get found by customers who are actively searching for your products and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Free SEO Audit <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Request SEO Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why SEO Matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why SEO Matters for Your Business
            </h2>
            <p className="text-xl text-muted-foreground">
              The numbers speak for themselves
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whySEO.map((item, index) => (
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

      {/* SEO Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our SEO Services
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive optimization strategies for maximum visibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Benefits of Professional SEO
            </h2>
            <p className="text-xl text-muted-foreground">
              How SEO drives business growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
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
              Our SEO Process
            </h2>
            <p className="text-xl text-muted-foreground">
              A systematic approach to improving your search rankings
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              SEO Packages
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your business needs
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
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground">{pkg.period}</span>
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

      {/* Results Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              When to Expect Results
            </h2>
            <p className="text-xl text-muted-foreground">
              SEO is a long-term investment with compounding returns
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-bold text-primary">1-3 Months</div>
                  <div>
                    <h4 className="font-semibold mb-1">Initial Improvements</h4>
                    <p className="text-sm text-muted-foreground">Technical fixes implemented, site health improved, initial ranking movements</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-bold text-primary">3-6 Months</div>
                  <div>
                    <h4 className="font-semibold mb-1">Visible Progress</h4>
                    <p className="text-sm text-muted-foreground">Increased organic traffic, better keyword rankings, more page one positions</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-bold text-primary">6-12 Months</div>
                  <div>
                    <h4 className="font-semibold mb-1">Significant Results</h4>
                    <p className="text-sm text-muted-foreground">Substantial traffic growth, top rankings for target keywords, improved conversions</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-bold text-primary">12+ Months</div>
                  <div>
                    <h4 className="font-semibold mb-1">Market Leadership</h4>
                    <p className="text-sm text-muted-foreground">Established authority, consistent top rankings, ongoing traffic and revenue growth</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Dominate Search Results?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your SEO journey today with a free website audit. We'll analyze your current performance and show you exactly what needs to be done to rank higher.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Free SEO Audit
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact SEO Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}