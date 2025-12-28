'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
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
  Briefcase,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

export default function WebVCardBasicPage() {
  const features = [
    {
      icon: User,
      title: 'Professional Profile',
      description: 'Your name, photo, job title, and professional summary displayed elegantly'
    },
    {
      icon: Phone,
      title: 'Contact Information',
      description: 'Phone numbers, email addresses, and physical address with one-click actions'
    },
    {
      icon: Globe,
      title: 'Social Media Links',
      description: 'Connect all your social profiles - LinkedIn, Instagram, Facebook, Twitter, etc.'
    },
    {
      icon: Link2,
      title: 'Custom Links',
      description: 'Add links to your website, portfolio, blog, or any other online presence'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect display on all smartphones, tablets, and desktop devices'
    },
    {
      icon: QrCode,
      title: 'QR Code',
      description: 'Get your personal QR code for easy sharing and adding to business cards'
    },
    {
      icon: Download,
      title: 'Contact Download',
      description: 'Visitors can save your contact info directly to their phone'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your vCard via link, QR code, or social media in seconds'
    },
    {
      icon: Zap,
      title: 'Instant Loading',
      description: 'Lightning-fast loading ensures contacts can reach you immediately'
    }
  ]

  const benefits = [
    {
      icon: Award,
      title: 'Professional First Impression',
      description: 'Make a lasting impact with a modern, professional digital business card'
    },
    {
      icon: Clock,
      title: 'Always Up-to-Date',
      description: 'Update your information anytime - all shared links automatically reflect changes'
    },
    {
      icon: Eye,
      title: 'Track Engagement',
      description: 'See how many people view your vCard and which links they click'
    },
    {
      icon: Sparkles,
      title: 'Stand Out',
      description: 'Differentiate yourself from traditional paper business cards'
    }
  ]

  const perfectFor = [
    {
      icon: Briefcase,
      title: 'Business Professionals',
      examples: ['Consultants', 'Sales representatives', 'Executives', 'Account managers']
    },
    {
      icon: User,
      title: 'Freelancers & Creatives',
      examples: ['Designers', 'Photographers', 'Writers', 'Artists']
    },
    {
      icon: MessageSquare,
      title: 'Service Providers',
      examples: ['Real estate agents', 'Insurance agents', 'Coaches', 'Trainers']
    },
    {
      icon: Award,
      title: 'Entrepreneurs',
      examples: ['Startup founders', 'Business owners', 'Influencers', 'Networkers']
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Provide Your Information',
      description: 'Share your contact details, professional info, and social media links with us'
    },
    {
      step: 2,
      title: 'We Create Your vCard',
      description: 'Our team designs and develops your professional digital business card'
    },
    {
      step: 3,
      title: 'Review & Launch',
      description: 'Review your vCard, request any changes, and we publish it online'
    },
    {
      step: 4,
      title: 'Share & Connect',
      description: 'Use your custom link or QR code to share with anyone, anywhere'
    }
  ]

  const includedFeatures = [
    'Custom domain or subdomain (yourname.yourdomain.com)',
    'Professional design with your branding colors',
    'Profile photo and cover image',
    'Contact information with click-to-call/email',
    'Up to 8 social media links',
    'Up to 5 custom links',
    'Personal QR code generation',
    'vCard download functionality',
    'Mobile responsive design',
    'Basic analytics (views counter)',
    '1 year hosting included',
    'SSL certificate (HTTPS)',
    'Quick setup (2-3 days)',
    '1 free update per month',
    'Email support'
  ]

  const comparisonWithPaper = [
    {
      aspect: 'Updates',
      paper: 'Need to reprint every time',
      digital: 'Update instantly, automatically reflected'
    },
    {
      aspect: 'Cost',
      paper: 'Ongoing printing costs',
      digital: 'One-time setup, minimal ongoing cost'
    },
    {
      aspect: 'Information',
      paper: 'Limited space',
      digital: 'Unlimited information and links'
    },
    {
      aspect: 'Sharing',
      paper: 'Only in person',
      digital: 'Share via link, QR code, social media'
    },
    {
      aspect: 'Environment',
      paper: 'Paper waste',
      digital: 'Eco-friendly, no waste'
    },
    {
      aspect: 'Tracking',
      paper: 'No insights',
      digital: 'Track views and engagement'
    }
  ]

  const pricingPackage = {
    name: 'Web vCard Basic',
    price: '€199',
    setupFee: 'One-time setup',
    maintenance: '€9.99/month',
    description: 'Your professional digital business card with all essential features',
    deliveryTime: '2-3 business days'
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
              <CreditCard className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Web vCard <span className="text-primary">Basic</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your digital business card that never runs out. Share your contact information instantly via QR code or link. Professional, modern, and always up-to-date.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Create Your vCard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  See Example
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is vCard */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-4">What is a Web vCard?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground text-center">
                A Web vCard is your modern, digital business card. Instead of carrying paper cards that can be lost or outdated, you share a single link or QR code that contains all your contact information, social media profiles, and professional links. It's accessible 24/7 from any device, always current, and provides a professional first impression.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Features Included
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for professional digital networking
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

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose a Digital vCard?
            </h2>
            <p className="text-xl text-muted-foreground">
              Advantages over traditional business cards
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

      {/* Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Digital vs. Paper Business Cards
            </h2>
            <p className="text-xl text-muted-foreground">
              See why digital is the modern choice
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                    <th className="px-6 py-4 text-left font-semibold">Paper Card</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary">Digital vCard</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonWithPaper.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4 font-medium">{item.aspect}</td>
                      <td className="px-6 py-4 text-muted-foreground">{item.paper}</td>
                      <td className="px-6 py-4 text-primary font-medium">{item.digital}</td>
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
              Ideal for professionals in any industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perfectFor.map((category, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-4">{category.title}</CardTitle>
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

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get your vCard in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                      {step.step}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What's Included
            </h2>
            <p className="text-xl text-muted-foreground">
              Complete package for your digital business card
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to get started
            </p>
          </div>

          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl mb-2">{pricingPackage.name}</CardTitle>
              <div className="flex flex-col items-center gap-2 my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">{pricingPackage.price}</span>
                  <span className="text-muted-foreground">{pricingPackage.setupFee}</span>
                </div>
                <div className="text-lg text-muted-foreground">
                  + {pricingPackage.maintenance} hosting & maintenance
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
                <h4 className="font-semibold mb-4 text-center">What You Get:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {includedFeatures.slice(0, 10).map((feature, index) => (
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
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Need more features? Check out our <Link href="/services/web-vcard-premium" className="text-primary hover:underline font-semibold">Premium vCard</Link> with advanced customization options.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Go Digital?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have upgraded to digital business cards. Create your Web vCard today and never worry about running out of business cards again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Create Your vCard
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