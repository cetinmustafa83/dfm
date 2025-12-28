'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Globe,
  Palette,
  Code,
  Shield,
  Zap,
  Smartphone,
  Search,
  BarChart3,
  HeadphonesIcon,
  Settings,
  CheckCircle2,
  ArrowRight,
  Layers,
  Database,
  Users,
  Mail,
  ShoppingCart,
  FileText,
  Cloud,
  Lock,
  Wrench,
  TrendingUp,
  Clock,
  Award,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function FullServiceWebsitePage() {
  const services = [
    {
      icon: Palette,
      title: 'Custom Web Design',
      description: 'Unique, brand-focused designs tailored to your business identity and target audience'
    },
    {
      icon: Code,
      title: 'Professional Development',
      description: 'Clean, modern code using latest technologies for optimal performance and scalability'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Perfect display and functionality across all devices, tablets, and screen sizes'
    },
    {
      icon: Search,
      title: 'SEO Optimization',
      description: 'Search engine friendly structure and content to maximize organic visibility'
    },
    {
      icon: Database,
      title: 'Content Management',
      description: 'Easy-to-use CMS allowing you to update content without technical knowledge'
    },
    {
      icon: Shield,
      title: 'Security & SSL',
      description: 'HTTPS encryption, security updates, and protection against common threats'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Fast loading speeds and optimized resources for excellent user experience'
    },
    {
      icon: Cloud,
      title: 'Hosting & Domain',
      description: 'Reliable hosting setup with domain registration and email configuration'
    },
    {
      icon: Mail,
      title: 'Professional Email',
      description: 'Custom business email addresses (info@yourdomain.com) with spam protection'
    },
    {
      icon: BarChart3,
      title: 'Analytics Integration',
      description: 'Track visitor behavior, traffic sources, and conversion metrics'
    },
    {
      icon: HeadphonesIcon,
      title: 'Training & Support',
      description: 'Comprehensive training on managing your website plus ongoing technical support'
    },
    {
      icon: Wrench,
      title: 'Maintenance & Updates',
      description: 'Regular updates, backups, and maintenance to keep your site running smoothly'
    }
  ]

  const whatWeInclude = [
    {
      category: 'Design & Development',
      items: [
        'Custom design mockups',
        'Responsive web development',
        'Up to 10 pages',
        'Contact forms',
        'Image galleries',
        'Social media integration'
      ]
    },
    {
      category: 'Technical Setup',
      items: [
        'Domain registration',
        'Professional hosting',
        'SSL certificate (HTTPS)',
        'Email setup (5 addresses)',
        'Database configuration',
        'Security measures'
      ]
    },
    {
      category: 'Content & SEO',
      items: [
        'Basic SEO optimization',
        'Meta tags & descriptions',
        'Google Analytics',
        'Google Search Console',
        'Sitemap creation',
        'Content structure'
      ]
    },
    {
      category: 'Support & Training',
      items: [
        'Website training session',
        'Documentation',
        '30 days post-launch support',
        '3 months warranty',
        'Regular backups',
        'Technical assistance'
      ]
    }
  ]

  const websiteTypes = [
    {
      icon: FileText,
      title: 'Corporate Websites',
      description: 'Professional presence for businesses with company info, services, and contact',
      features: ['About page', 'Services overview', 'Team profiles', 'Contact form']
    },
    {
      icon: ShoppingCart,
      title: 'Small E-Commerce',
      description: 'Online shops for small businesses with product catalogs and shopping cart',
      features: ['Product listings', 'Shopping cart', 'Payment gateway', 'Order management']
    },
    {
      icon: Users,
      title: 'Portfolio Websites',
      description: 'Showcase your work with elegant galleries and project presentations',
      features: ['Project galleries', 'Case studies', 'Client testimonials', 'Contact forms']
    },
    {
      icon: Award,
      title: 'Service Provider Sites',
      description: 'Websites for consultants, agencies, and professional service providers',
      features: ['Service pages', 'Booking system', 'Client area', 'Resource downloads']
    },
    {
      icon: Globe,
      title: 'Multi-language Sites',
      description: 'Reach international audiences with professionally translated content',
      features: ['Language switcher', 'Translated content', 'Regional customization', 'SEO per language']
    },
    {
      icon: TrendingUp,
      title: 'Startup Websites',
      description: 'Modern, scalable websites for startups and growing businesses',
      features: ['Modern design', 'Growth-ready', 'Blog integration', 'Lead capture']
    }
  ]

  const process = [
    {
      phase: 'Discovery & Planning',
      description: 'Understanding your business, goals, target audience, and competitive landscape',
      deliverables: ['Project brief', 'Sitemap', 'Feature list'],
      duration: '1 week'
    },
    {
      phase: 'Design',
      description: 'Creating mockups and prototypes that reflect your brand and engage your audience',
      deliverables: ['Design mockups', 'Style guide', 'Approved final design'],
      duration: '2 weeks'
    },
    {
      phase: 'Development',
      description: 'Building your website with clean code, integrations, and all planned features',
      deliverables: ['Functional website', 'CMS setup', 'Integrations'],
      duration: '3-4 weeks'
    },
    {
      phase: 'Content & SEO',
      description: 'Adding content, optimizing for search engines, and setting up analytics',
      deliverables: ['Content upload', 'SEO optimization', 'Analytics setup'],
      duration: '1 week'
    },
    {
      phase: 'Testing & QA',
      description: 'Thorough testing across devices, browsers, and user scenarios',
      deliverables: ['Test reports', 'Bug fixes', 'Performance optimization'],
      duration: '1 week'
    },
    {
      phase: 'Launch & Training',
      description: 'Going live and training your team on managing the website',
      deliverables: ['Live website', 'Training session', 'Documentation'],
      duration: '3-5 days'
    }
  ]

  const packages = [
    {
      name: 'Starter Website',
      price: '€1,999',
      description: 'Perfect for small businesses and startups',
      features: [
        'Up to 5 pages',
        'Mobile responsive design',
        'Contact form',
        'Basic SEO setup',
        'Social media links',
        '1 year hosting included',
        '2 email addresses',
        '2 rounds of revisions',
        '30 days support',
        '6-8 weeks delivery'
      ]
    },
    {
      name: 'Business Website',
      price: '€3,999',
      description: 'Comprehensive solution for established businesses',
      features: [
        'Up to 10 pages',
        'Custom design',
        'Content Management System',
        'Advanced SEO optimization',
        'Blog integration',
        'Contact forms & maps',
        '1 year hosting & SSL',
        '5 email addresses',
        'Google Analytics setup',
        '3 rounds of revisions',
        '60 days support',
        '8-10 weeks delivery'
      ],
      popular: true
    },
    {
      name: 'Premium Website',
      price: '€6,999',
      description: 'Full-featured website with advanced functionality',
      features: [
        'Up to 20 pages',
        'Premium custom design',
        'Advanced CMS',
        'E-commerce (up to 50 products)',
        'Multi-language support',
        'Advanced integrations',
        'Custom features',
        '1 year hosting & SSL',
        '10 email addresses',
        'Priority support',
        'Training for team',
        'Unlimited revisions',
        '90 days support',
        '10-12 weeks delivery'
      ]
    }
  ]

  const additionalServices = [
    {
      service: 'Additional Pages',
      price: '€199/page',
      description: 'Expand your website with more pages'
    },
    {
      service: 'E-commerce Upgrade',
      price: 'From €999',
      description: 'Add online shop functionality'
    },
    {
      service: 'Booking System',
      price: 'From €799',
      description: 'Online appointment scheduling'
    },
    {
      service: 'Client Portal',
      price: 'From €1,499',
      description: 'Secure login area for customers'
    },
    {
      service: 'Monthly Maintenance',
      price: '€99/month',
      description: 'Updates, backups, and support'
    },
    {
      service: 'Content Updates',
      price: '€59/hour',
      description: 'Professional content management'
    }
  ]

  const benefits = [
    {
      icon: Award,
      title: 'All-in-One Solution',
      description: 'Everything you need in one package - design, development, hosting, and support'
    },
    {
      icon: Clock,
      title: 'Time-Saving',
      description: 'We handle all technical aspects while you focus on running your business'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced designers, developers, and SEO specialists working on your project'
    },
    {
      icon: Sparkles,
      title: 'Future-Proof',
      description: 'Built with scalability in mind, ready to grow with your business'
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
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Full-Service <span className="text-primary">Website Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete website packages with everything included - design, development, hosting, maintenance, and support. Your worry-free path to a professional online presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose Full-Service?
            </h2>
            <p className="text-xl text-muted-foreground">
              One partner for all your website needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Included */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need, All Included
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive services for a complete online presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
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

      {/* What's Included */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What's Included in Every Package
            </h2>
            <p className="text-xl text-muted-foreground">
              Detailed breakdown of our full-service offering
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {whatWeInclude.map((category, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl mb-4">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, iIndex) => (
                      <li key={iIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Website Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Websites for Every Business Type
            </h2>
            <p className="text-xl text-muted-foreground">
              Customized solutions for your specific industry and needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websiteTypes.map((type, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <type.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription className="mb-4">{type.description}</CardDescription>
                  <div className="space-y-1">
                    {type.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span>{feature}</span>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Development Process
            </h2>
            <p className="text-xl text-muted-foreground">
              A transparent, structured approach from concept to launch
            </p>
          </div>

          <div className="space-y-6">
            {process.map((phase, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <CardTitle className="text-xl">{phase.phase}</CardTitle>
                      </div>
                      <CardDescription className="text-base mb-3">{phase.description}</CardDescription>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((deliverable, dIndex) => (
                          <span 
                            key={dIndex}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                          >
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-foreground">
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
              Full-Service Website Packages
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the package that fits your business size and needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
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
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/appointment" className="block">
                    <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Services */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Additional Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalServices.map((item, index) => (
                <Card key={index} className="hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-base">{item.service}</CardTitle>
                      <span className="text-primary font-bold text-sm">{item.price}</span>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Launch Your Website?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and create a website that grows your business. Get started today with a free consultation and project estimate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Schedule Free Consultation
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