'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Crown,
  Palette,
  Smartphone,
  Code,
  Zap,
  Shield,
  Search,
  Clock,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Users,
  MessageSquare,
  ShoppingCart,
  FileText,
  Calendar,
  Mail,
  Database,
  Settings,
  Award,
  Sparkles,
  Video,
  Image,
  Globe,
  Layers,
  TrendingUp,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

export default function BusinessWebsitePremiumPage() {
  const premiumFeatures = [
    {
      icon: Palette,
      title: 'Custom Design',
      description: 'Completely unique design tailored to your brand identity and target audience'
    },
    {
      icon: Code,
      title: 'Custom Development',
      description: 'Hand-coded features and functionality specific to your business needs'
    },
    {
      icon: Database,
      title: 'Content Management System',
      description: 'Easy-to-use CMS allowing you to update content without technical knowledge'
    },
    {
      icon: FileText,
      title: 'Blog Platform',
      description: 'Professional blog with categories, tags, and SEO-optimized article publishing'
    },
    {
      icon: ShoppingCart,
      title: 'Basic E-commerce',
      description: 'Small online shop with up to 20 products, shopping cart, and payment integration'
    },
    {
      icon: Calendar,
      title: 'Booking System',
      description: 'Appointment scheduling with calendar integration and email notifications'
    },
    {
      icon: Users,
      title: 'Client Portal',
      description: 'Secure login area for customers to access exclusive content or services'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive tracking with custom dashboards and detailed reports'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat Integration',
      description: 'Real-time customer support with chat widget integration'
    },
    {
      icon: Video,
      title: 'Multimedia Content',
      description: 'Video integration, galleries, sliders, and interactive elements'
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Support for multiple languages to reach international audiences'
    },
    {
      icon: Settings,
      title: 'API Integrations',
      description: 'Connect with third-party tools like CRM, email marketing, or payment systems'
    }
  ]

  const basicVsPremium = [
    {
      feature: 'Design',
      basic: 'Template-based',
      premium: 'Completely custom'
    },
    {
      feature: 'Pages',
      basic: 'Up to 5',
      premium: 'Up to 15'
    },
    {
      feature: 'Content Management',
      basic: 'Basic updates',
      premium: 'Full CMS with training'
    },
    {
      feature: 'Blog',
      basic: 'Not included',
      premium: 'Professional blog platform'
    },
    {
      feature: 'E-commerce',
      basic: 'Not included',
      premium: 'Up to 20 products'
    },
    {
      feature: 'Booking System',
      basic: 'Not included',
      premium: 'Integrated calendar'
    },
    {
      feature: 'SEO',
      basic: 'Basic setup',
      premium: 'Advanced optimization'
    },
    {
      feature: 'Analytics',
      basic: 'Basic tracking',
      premium: 'Advanced with reports'
    },
    {
      feature: 'Support',
      basic: '30 days',
      premium: '90 days + priority'
    },
    {
      feature: 'Email Addresses',
      basic: '2 addresses',
      premium: '10 addresses'
    }
  ]

  const perfectFor = [
    {
      icon: TrendingUp,
      title: 'Growing Businesses',
      description: 'Businesses ready to scale with advanced features',
      features: ['Custom functionality', 'E-commerce ready', 'Scalable architecture']
    },
    {
      icon: Award,
      title: 'Established Companies',
      description: 'Companies needing a professional, feature-rich presence',
      features: ['Custom design', 'Advanced features', 'Brand alignment']
    },
    {
      icon: Briefcase,
      title: 'Professional Services',
      description: 'Service providers with booking and client management needs',
      features: ['Booking system', 'Client portal', 'CRM integration']
    },
    {
      icon: ShoppingCart,
      title: 'Small E-commerce',
      description: 'Businesses selling products online with integrated shop',
      features: ['Product catalog', 'Shopping cart', 'Payment processing']
    }
  ]

  const includedFeatures = [
    'Completely custom website design',
    'Up to 15 pages of content',
    'Mobile responsive & optimized',
    'Custom development & features',
    'Content Management System (CMS)',
    'Professional blog platform',
    'Basic e-commerce (up to 20 products)',
    'Appointment booking system',
    'Client portal with secure login',
    'Advanced contact forms',
    'Live chat integration',
    'Newsletter signup integration',
    'Advanced SEO optimization',
    'Google Analytics & Search Console',
    'Advanced analytics dashboard',
    'Multi-language support (2 languages)',
    'Social media integration',
    'Video & multimedia integration',
    'Image galleries & sliders',
    'API integrations (up to 3)',
    'SSL certificate (HTTPS)',
    '1 year premium hosting',
    '10 professional email addresses',
    'Priority email & phone support',
    'Comprehensive training (2 sessions)',
    'Detailed documentation',
    'Unlimited revisions during development',
    '90 days post-launch support',
    '10-14 weeks professional delivery'
  ]

  const process = [
    {
      step: 1,
      title: 'Discovery & Strategy',
      description: 'Deep dive into your business, goals, competitors, and target audience',
      duration: '1-2 weeks'
    },
    {
      step: 2,
      title: 'Custom Design',
      description: 'Creating unique wireframes and mockups aligned with your brand',
      duration: '2-3 weeks'
    },
    {
      step: 3,
      title: 'Custom Development',
      description: 'Building your website with custom features and integrations',
      duration: '4-6 weeks'
    },
    {
      step: 4,
      title: 'Content & SEO',
      description: 'Optimizing content, implementing advanced SEO, and setting up analytics',
      duration: '1-2 weeks'
    },
    {
      step: 5,
      title: 'Testing & QA',
      description: 'Thorough testing across devices, browsers, and user scenarios',
      duration: '1 week'
    },
    {
      step: 6,
      title: 'Training & Launch',
      description: 'Comprehensive training and smooth deployment to production',
      duration: '1 week'
    }
  ]

  const addOnServices = [
    {
      service: 'Additional Products',
      price: '€10/product',
      description: 'Expand beyond 20 products'
    },
    {
      service: 'Additional Pages',
      price: '€149/page',
      description: 'Add more pages beyond 15'
    },
    {
      service: 'Advanced E-commerce',
      price: 'From €999',
      description: 'Unlimited products & advanced features'
    },
    {
      service: 'Marketing Automation',
      price: 'From €499',
      description: 'Email campaigns & automation'
    },
    {
      service: 'Monthly Maintenance',
      price: '€149/month',
      description: 'Updates, backups, and premium support'
    },
    {
      service: 'SEO Management',
      price: 'From €499/month',
      description: 'Ongoing SEO optimization and content'
    }
  ]

  const pricingPackage = {
    name: 'Business Website Premium',
    price: '€3,999',
    description: 'A complete, custom website with advanced features and unlimited growth potential',
    deliveryTime: '10-14 weeks',
    setupFee: 'One-time investment',
    hosting: '1 year included, then €199/year',
    savings: 'Save over €2,000 vs. building features separately'
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
              <Crown className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Business Website <span className="text-primary">Premium</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A completely custom, feature-rich website designed and developed specifically for your business. Everything you need to establish a powerful online presence, generate leads, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Premium Website <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Request Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Premium Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything in Basic, plus advanced functionality and customization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
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

      {/* Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Basic vs. Premium
            </h2>
            <p className="text-xl text-muted-foreground">
              See what makes Premium worth the investment
            </p>
          </div>

          <Card className="overflow-hidden border-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">Basic</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {basicVsPremium.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4 font-medium">{item.feature}</td>
                      <td className="px-6 py-4 text-muted-foreground">{item.basic}</td>
                      <td className="px-6 py-4 text-primary font-semibold">{item.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
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
              Businesses ready for a professional, feature-rich online presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {perfectFor.map((category, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                  <CardDescription className="text-base mb-4">{category.description}</CardDescription>
                  <div className="space-y-2">
                    {category.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm">{feature}</span>
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
              Premium Development Process
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional approach from concept to launch
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

      {/* What's Included */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything Included
            </h2>
            <p className="text-xl text-muted-foreground">
              A complete premium package with no hidden costs
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {includedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Premium Investment
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional quality that drives results
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Basic */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Basic</CardTitle>
                <div className="flex flex-col items-center gap-2 my-4">
                  <span className="text-4xl font-bold">€999</span>
                  <span className="text-sm text-muted-foreground">One-time</span>
                </div>
                <CardDescription>For simple needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Template design</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>5 pages</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Basic features</span>
                  </li>
                </ul>
                <Link href="/services/business-website-basic">
                  <Button variant="outline" className="w-full">
                    View Basic
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-primary shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Premium
                </span>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl mb-2">{pricingPackage.name}</CardTitle>
                <div className="flex flex-col items-center gap-2 my-4">
                  <span className="text-5xl font-bold text-primary">{pricingPackage.price}</span>
                  <span className="text-sm text-muted-foreground">{pricingPackage.setupFee}</span>
                  <span className="text-sm text-muted-foreground">{pricingPackage.hosting}</span>
                </div>
                <CardDescription className="text-base">{pricingPackage.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 text-primary text-center py-2 rounded-lg mb-6 text-sm font-semibold">
                  {pricingPackage.savings}
                </div>
                <ul className="space-y-2 mb-6">
                  {includedFeatures.slice(0, 8).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li className="text-sm text-muted-foreground pl-6">+ 21 more features...</li>
                </ul>
                <Link href="/appointment">
                  <Button className="w-full text-lg">
                    Get Premium Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Full-Service */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Full-Service</CardTitle>
                <div className="flex flex-col items-center gap-2 my-4">
                  <span className="text-4xl font-bold">Custom</span>
                  <span className="text-sm text-muted-foreground">From €6,999</span>
                </div>
                <CardDescription>For complex needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Unlimited pages</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Advanced e-commerce</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
                <Link href="/services/fullservice-website">
                  <Button variant="outline" className="w-full">
                    View Full-Service
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Add-ons */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Optional Add-on Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addOnServices.map((item, index) => (
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready for Premium?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Invest in a website that grows with your business. Get a custom-built, feature-rich platform that delivers results and sets you apart from competitors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Your Premium Website
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Request Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}