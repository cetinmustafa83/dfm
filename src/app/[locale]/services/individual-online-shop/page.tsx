'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Palette, 
  Code, 
  Layers, 
  Zap, 
  Shield, 
  Smartphone,
  Database,
  Settings,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Wrench,
  Boxes,
  BarChart
} from 'lucide-react'
import Link from 'next/link'

export default function IndividualOnlineShopPage() {
  const customFeatures = [
    {
      icon: Palette,
      title: 'Custom Design',
      description: 'Unique, brand-focused design tailored to your business identity and customer expectations'
    },
    {
      icon: Code,
      title: 'Bespoke Development',
      description: 'Custom-coded solutions built from scratch to match your exact requirements'
    },
    {
      icon: Layers,
      title: 'Flexible Architecture',
      description: 'Scalable infrastructure that grows with your business needs and traffic'
    },
    {
      icon: Database,
      title: 'Custom Database Design',
      description: 'Optimized data structures for your specific product catalogs and business logic'
    },
    {
      icon: Settings,
      title: 'Advanced Integrations',
      description: 'Seamless connection with ERP, CRM, warehouse management, and third-party systems'
    },
    {
      icon: Wrench,
      title: 'Tailored Features',
      description: 'Custom functionalities designed specifically for your business processes'
    },
    {
      icon: Boxes,
      title: 'Complex Product Configurators',
      description: 'Interactive product builders with real-time pricing and visual customization'
    },
    {
      icon: BarChart,
      title: 'Custom Analytics',
      description: 'Personalized reporting dashboards with metrics that matter to your business'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced security measures and compliance with industry-specific regulations'
    }
  ]

  const advantages = [
    {
      icon: Sparkles,
      title: 'Unique Brand Experience',
      description: 'Stand out from competitors with a completely custom shopping experience that reflects your brand values'
    },
    {
      icon: TrendingUp,
      title: 'Competitive Advantage',
      description: 'Implement innovative features and workflows that give you an edge in your market'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Fine-tuned code and infrastructure for maximum speed and efficiency'
    },
    {
      icon: Users,
      title: 'Customer-Centric Design',
      description: 'User experience tailored to your specific target audience and their shopping behavior'
    }
  ]

  const developmentPhases = [
    {
      phase: 'Discovery & Analysis',
      description: 'Deep dive into your business requirements, target audience, and competitive landscape',
      duration: '2-3 weeks'
    },
    {
      phase: 'UX/UI Design',
      description: 'Custom wireframes, mockups, and interactive prototypes tailored to your brand',
      duration: '3-4 weeks'
    },
    {
      phase: 'Custom Development',
      description: 'Building your unique e-commerce platform with custom features and integrations',
      duration: '8-16 weeks'
    },
    {
      phase: 'Testing & QA',
      description: 'Comprehensive testing across devices, browsers, and usage scenarios',
      duration: '2-3 weeks'
    },
    {
      phase: 'Launch & Training',
      description: 'Deployment, staff training, and post-launch support',
      duration: '1-2 weeks'
    },
    {
      phase: 'Ongoing Support',
      description: 'Continuous maintenance, updates, and feature enhancements',
      duration: 'Ongoing'
    }
  ]

  const useCases = [
    {
      title: 'B2B Wholesale Platforms',
      description: 'Complex pricing structures, bulk ordering, customer-specific catalogs, and approval workflows'
    },
    {
      title: 'Marketplace Solutions',
      description: 'Multi-vendor platforms with custom commission structures and vendor management'
    },
    {
      title: 'Subscription Commerce',
      description: 'Recurring billing, subscription management, and automated fulfillment systems'
    },
    {
      title: 'Product Configurators',
      description: 'Interactive customization tools for complex products with real-time pricing'
    },
    {
      title: 'Industry-Specific Solutions',
      description: 'Specialized e-commerce for automotive, fashion, food, healthcare, or manufacturing'
    },
    {
      title: 'International Expansion',
      description: 'Multi-region stores with localized content, pricing, and payment methods'
    }
  ]

  const technologies = [
    'Next.js / React',
    'Node.js / Express',
    'GraphQL / REST APIs',
    'PostgreSQL / MongoDB',
    'Redis / ElasticSearch',
    'AWS / Azure / GCP',
    'Docker / Kubernetes',
    'Stripe / PayPal / Custom'
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
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Individual <span className="text-primary">E-Shop Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Custom-built e-commerce platforms designed exclusively for your business. When standard solutions don't fit, we create the perfect online shop tailored to your unique requirements and vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Schedule Consultation <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Why Custom Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose a Custom E-Shop?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Standard platforms have limitations. A custom solution gives you complete freedom to implement exactly what your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <advantage.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{advantage.title}</CardTitle>
                  <CardDescription className="text-base">{advantage.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Custom Development Capabilities
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything built specifically for your business requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customFeatures.map((feature, index) => (
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

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Perfect For Complex Requirements
            </h2>
            <p className="text-xl text-muted-foreground">
              Custom solutions for businesses with unique challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Custom Development Process
            </h2>
            <p className="text-xl text-muted-foreground">
              A structured approach to building your perfect e-commerce solution
            </p>
          </div>

          <div className="space-y-6">
            {developmentPhases.map((phase, index) => (
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
                    <div className="flex-shrink-0">
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

      {/* Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Modern Technology Stack
            </h2>
            <p className="text-xl text-muted-foreground">
              We use cutting-edge technologies for scalable, performant solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {technologies.map((tech, index) => (
              <Card key={index} className="text-center p-6 hover:border-primary transition-colors">
                <p className="font-semibold">{tech}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl mb-4">Investment in Your Success</CardTitle>
              <CardDescription className="text-lg">
                Custom e-commerce development is a significant investment that pays off through increased sales, efficiency, and competitive advantage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">Starting Investment</h4>
                  <p className="text-3xl font-bold text-primary">From €15,000</p>
                  <p className="text-sm text-muted-foreground">For basic custom solutions with essential features</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">Complex Projects</h4>
                  <p className="text-3xl font-bold text-primary">€30,000 - €100,000+</p>
                  <p className="text-sm text-muted-foreground">For enterprise solutions with advanced integrations</p>
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">What's Included:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Custom design & UX',
                    'Bespoke development',
                    'API integrations',
                    'Testing & QA',
                    'Training & documentation',
                    'Launch support',
                    '3-6 months warranty',
                    'Maintenance options'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
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
            Ready to Build Your Custom E-Shop?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your unique requirements and create an e-commerce solution that perfectly fits your business. Schedule a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Book Free Consultation
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Get Detailed Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}