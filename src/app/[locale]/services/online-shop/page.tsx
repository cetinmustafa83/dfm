'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ShoppingCart, 
  CreditCard, 
  Package, 
  TrendingUp, 
  Shield, 
  Smartphone,
  Search,
  BarChart3,
  Users,
  Globe,
  Zap,
  Lock,
  ArrowRight,
  Check
} from 'lucide-react'
import Link from 'next/link'

export default function OnlineShopPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('')

  const features = [
    {
      icon: ShoppingCart,
      title: 'Complete E-Commerce Platform',
      description: 'Full-featured online shop with shopping cart, product catalog, and checkout system'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment Integration',
      description: 'Multiple payment gateways including PayPal, Stripe, and credit card processing'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Real-time stock tracking, automated reordering, and multi-warehouse support'
    },
    {
      icon: Smartphone,
      title: 'Mobile-Responsive Design',
      description: 'Optimized shopping experience across all devices and screen sizes'
    },
    {
      icon: Search,
      title: 'Advanced Search & Filters',
      description: 'Powerful search functionality with category filters and product comparisons'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive sales reports, customer insights, and performance metrics'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'User accounts, order history, wishlist, and personalized recommendations'
    },
    {
      icon: Globe,
      title: 'Multi-Language & Currency',
      description: 'Support for international markets with multiple languages and currencies'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'SSL encryption, GDPR compliance, and PCI DSS certified payment processing'
    }
  ]

  const plans = [
    {
      name: 'Starter Shop',
      price: '€999',
      description: 'Perfect for small businesses starting their online journey',
      features: [
        'Up to 100 products',
        'Basic payment integration',
        'Mobile-responsive design',
        'SSL certificate included',
        'Basic analytics',
        '5 GB storage',
        'Email support'
      ]
    },
    {
      name: 'Professional Shop',
      price: '€2,499',
      description: 'Ideal for growing businesses with expanding product lines',
      features: [
        'Up to 1,000 products',
        'Multiple payment gateways',
        'Advanced search & filters',
        'Inventory management',
        'Customer accounts',
        'Advanced analytics',
        '25 GB storage',
        'Priority support',
        'SEO optimization'
      ],
      popular: true
    },
    {
      name: 'Enterprise Shop',
      price: 'Custom',
      description: 'Comprehensive solution for large-scale e-commerce operations',
      features: [
        'Unlimited products',
        'Custom payment solutions',
        'Multi-warehouse support',
        'API integrations',
        'Advanced marketing tools',
        'Custom reporting',
        'Unlimited storage',
        '24/7 dedicated support',
        'Custom development',
        'Migration assistance'
      ]
    }
  ]

  const technologies = [
    { name: 'Next.js', description: 'React framework for production' },
    { name: 'Shopify', description: 'E-commerce platform' },
    { name: 'WooCommerce', description: 'WordPress e-commerce' },
    { name: 'Magento', description: 'Enterprise e-commerce' },
    { name: 'Stripe', description: 'Payment processing' },
    { name: 'PayPal', description: 'Payment gateway' }
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Sales',
      description: 'Reach customers 24/7 and expand your market globally'
    },
    {
      icon: Zap,
      title: 'Fast Performance',
      description: 'Lightning-fast loading times for better conversion rates'
    },
    {
      icon: Lock,
      title: 'Secure Transactions',
      description: 'Bank-level security for all customer transactions'
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
              <ShoppingCart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Online Shop <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional e-commerce solutions tailored to your business needs. From small shops to enterprise platforms, we build scalable online stores that drive sales and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Request Consultation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Complete E-Commerce Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to run a successful online business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose Our E-Shop Solutions?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Flexible Pricing Plans
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your business size and requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary border-2 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/appointment">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Technologies We Use
            </h2>
            <p className="text-xl text-muted-foreground">
              Modern, reliable platforms for your e-commerce success
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="text-center p-6 hover:border-primary transition-colors">
                <h4 className="font-semibold mb-1">{tech.name}</h4>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Development Process
            </h2>
            <p className="text-xl text-muted-foreground">
              From concept to launch in a structured approach
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'Understanding your business needs and goals' },
              { step: '02', title: 'Design', description: 'Creating intuitive and attractive shop layouts' },
              { step: '03', title: 'Development', description: 'Building your custom e-commerce platform' },
              { step: '04', title: 'Launch & Support', description: 'Going live with ongoing maintenance' }
            ].map((phase, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold">{phase.title}</h3>
                <p className="text-muted-foreground">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Launch Your Online Store?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's build an e-commerce platform that drives your business growth. Contact us today for a free consultation.
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

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {children}
    </span>
  )
}