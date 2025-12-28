'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Crown,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Share2,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Zap,
  Clock,
  Award,
  QrCode,
  Download,
  Link2,
  Eye,
  Sparkles,
  Video,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  Palette,
  Star,
  Briefcase,
  Image,
  Music,
  ShoppingBag,
  Code,
  Layout,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function WebVCardPremiumPage() {
  const premiumFeatures = [
    {
      icon: Palette,
      title: 'Custom Design & Branding',
      description: 'Fully customized design matching your brand identity, colors, fonts, and style'
    },
    {
      icon: Video,
      title: 'Video Background',
      description: 'Add video backgrounds or promotional videos to make a powerful impression'
    },
    {
      icon: Layout,
      title: 'Multiple Page Layouts',
      description: 'Choose from various professional templates or get a completely custom design'
    },
    {
      icon: FileText,
      title: 'Portfolio & Projects',
      description: 'Showcase your work with galleries, case studies, and project descriptions'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Integrated calendar allowing contacts to book meetings directly from your vCard'
    },
    {
      icon: MessageSquare,
      title: 'Contact Forms',
      description: 'Custom contact forms with automated email notifications'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights on visitors, clicks, popular links, and engagement metrics'
    },
    {
      icon: Link2,
      title: 'Unlimited Links',
      description: 'Add as many social profiles, websites, and custom links as you need'
    },
    {
      icon: Music,
      title: 'Audio & Multimedia',
      description: 'Embed audio messages, podcasts, or music samples'
    },
    {
      icon: ShoppingBag,
      title: 'E-commerce Integration',
      description: 'Integrate payment links, product showcases, or booking systems'
    },
    {
      icon: Code,
      title: 'Custom Code Integration',
      description: 'Add custom HTML, CSS, tracking codes, or third-party widgets'
    },
    {
      icon: Settings,
      title: 'Advanced Features',
      description: 'Lead capture, email marketing integration, CRM connections, and more'
    }
  ]

  const basicVsPremium = [
    {
      feature: 'Design',
      basic: 'Template-based',
      premium: 'Fully custom design'
    },
    {
      feature: 'Social Links',
      basic: 'Up to 8',
      premium: 'Unlimited'
    },
    {
      feature: 'Custom Links',
      basic: 'Up to 5',
      premium: 'Unlimited'
    },
    {
      feature: 'Portfolio/Gallery',
      basic: 'Not included',
      premium: 'Included with unlimited items'
    },
    {
      feature: 'Video Content',
      basic: 'Not included',
      premium: 'Video background & embeds'
    },
    {
      feature: 'Appointment Booking',
      basic: 'Not included',
      premium: 'Integrated calendar system'
    },
    {
      feature: 'Contact Forms',
      basic: 'Basic form',
      premium: 'Custom forms with automation'
    },
    {
      feature: 'Analytics',
      basic: 'Basic view counter',
      premium: 'Advanced with detailed insights'
    },
    {
      feature: 'Updates',
      basic: '1 free update/month',
      premium: 'Unlimited updates'
    },
    {
      feature: 'Support',
      basic: 'Email support',
      premium: 'Priority support & dedicated manager'
    }
  ]

  const idealFor = [
    {
      icon: Briefcase,
      title: 'Corporate Executives',
      description: 'Senior professionals who need to make a strong impression',
      features: ['Custom branding', 'Video introduction', 'Advanced analytics']
    },
    {
      icon: Star,
      title: 'Influencers & Content Creators',
      description: 'Build your personal brand with portfolio and media showcase',
      features: ['Portfolio gallery', 'Video content', 'Social integration']
    },
    {
      icon: Award,
      title: 'Premium Service Providers',
      description: 'Luxury brands and high-end service providers',
      features: ['Booking system', 'Custom forms', 'E-commerce links']
    },
    {
      icon: Sparkles,
      title: 'Entrepreneurs & Startups',
      description: 'Stand out with cutting-edge digital presence',
      features: ['Custom design', 'Lead capture', 'Analytics']
    }
  ]

  const includedFeatures = [
    'Completely custom design matching your brand',
    'Custom domain (yourname.com)',
    'Unlimited social media links',
    'Unlimited custom links',
    'Video background or embedded videos',
    'Portfolio/gallery section (unlimited items)',
    'Appointment booking system',
    'Custom contact forms with automation',
    'Advanced analytics dashboard',
    'Lead capture & email integration',
    'Multi-language support (optional)',
    'Custom code integration',
    'E-commerce integrations',
    'Priority customer support',
    '1 year premium hosting & SSL',
    'Professional email (10 addresses)',
    'Unlimited updates & changes',
    'Dedicated account manager',
    'Fast setup (3-5 days)',
    'Training & documentation',
    '90 days premium support'
  ]

  const addOnServices = [
    {
      service: 'SEO Optimization',
      price: '€199',
      description: 'Full SEO setup for better search visibility'
    },
    {
      service: 'Social Media Management',
      price: 'From €299/month',
      description: 'Professional social media content and posting'
    },
    {
      service: 'Content Creation',
      price: 'From €149',
      description: 'Professional copywriting and content strategy'
    },
    {
      service: 'Photography/Videography',
      price: 'From €499',
      description: 'Professional photo and video shoot for your vCard'
    },
    {
      service: 'Additional Languages',
      price: '€149/language',
      description: 'Multi-language version of your vCard'
    },
    {
      service: 'Advanced Integrations',
      price: 'Custom pricing',
      description: 'CRM, marketing automation, or custom systems'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Discovery Call',
      description: 'We discuss your vision, brand identity, goals, and required features',
      duration: '1 hour'
    },
    {
      step: 2,
      title: 'Design Concept',
      description: 'We create initial design mockups based on your brand and preferences',
      duration: '2-3 days'
    },
    {
      step: 3,
      title: 'Development',
      description: 'Building your premium vCard with all custom features and integrations',
      duration: '2-3 days'
    },
    {
      step: 4,
      title: 'Content Integration',
      description: 'Adding all your content, media, links, and configuring features',
      duration: '1 day'
    },
    {
      step: 5,
      title: 'Review & Refinement',
      description: 'You review everything and we make unlimited adjustments',
      duration: '1-2 days'
    },
    {
      step: 6,
      title: 'Launch & Training',
      description: 'Going live and training you on managing your premium vCard',
      duration: '1 day'
    }
  ]

  const pricingPackage = {
    name: 'Web vCard Premium',
    price: '€599',
    setupFee: 'One-time setup',
    maintenance: '€29.99/month',
    description: 'The ultimate digital business card with unlimited customization and features',
    deliveryTime: '3-5 business days',
    savings: 'Save €200 compared to Basic + Add-ons'
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
              Web vCard <span className="text-primary">Premium</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The ultimate digital business card. Fully customized design, unlimited features, video content, appointment booking, advanced analytics, and everything you need to stand out professionally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Premium vCard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  See Premium Examples
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
              Everything in Basic, plus advanced customization and features
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

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Basic vs. Premium
            </h2>
            <p className="text-xl text-muted-foreground">
              See what makes Premium worth the upgrade
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

      {/* Ideal For */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ideal For Premium Professionals
            </h2>
            <p className="text-xl text-muted-foreground">
              Perfect for those who demand the best
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {idealFor.map((category, index) => (
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
              White-glove service from concept to launch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((phase, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                      {phase.step}
                    </div>
                    <CardTitle className="text-lg">{phase.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base mb-3">{phase.description}</CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{phase.duration}</span>
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
              Everything Included in Premium
            </h2>
            <p className="text-xl text-muted-foreground">
              A complete premium package with no hidden fees
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
              Premium Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional investment for premium results
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Basic Comparison */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Basic</CardTitle>
                <div className="flex flex-col items-center gap-2 my-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€199</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    + €9.99/month
                  </div>
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
                    <span>8 social links</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>5 custom links</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
                <Link href="/services/web-vcard-basic">
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">{pricingPackage.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pricingPackage.setupFee}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    + {pricingPackage.maintenance} premium hosting
                  </div>
                </div>
                <CardDescription className="text-base">{pricingPackage.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 text-primary text-center py-2 rounded-lg mb-6 text-sm font-semibold">
                  {pricingPackage.savings}
                </div>
                <ul className="space-y-2 mb-6">
                  {includedFeatures.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li className="text-sm text-muted-foreground pl-6">+ 15 more features...</li>
                </ul>
                <Link href="/appointment">
                  <Button className="w-full text-lg">
                    Get Premium Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                <div className="flex flex-col items-center gap-2 my-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Custom pricing
                  </div>
                </div>
                <CardDescription>For teams & organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multiple vCards</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Team management</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/ticket">
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Add-on Services */}
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
            Elevate your professional presence with a fully customized, feature-rich digital business card. Get started today with our premium package and stand out from the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Premium vCard
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Schedule Strategy Call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}