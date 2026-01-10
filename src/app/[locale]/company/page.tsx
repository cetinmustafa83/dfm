'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building2,
  Users,
  Target,
  Award,
  Heart,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Shield,
  Rocket,
  Globe,
  Clock,
  Zap,
  Code,
  Palette,
  LineChart,
  MessageSquare,
  Star,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

export default function CompanyPage() {
  const values = [
    {
      icon: Heart,
      title: 'Client Success First',
      description: 'Your success is our success. We\'re committed to delivering solutions that drive real business results.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation & Creativity',
      description: 'We stay ahead of technology trends and bring creative solutions to complex challenges.'
    },
    {
      icon: Shield,
      title: 'Quality & Excellence',
      description: 'We never compromise on quality. Every project receives meticulous attention to detail.'
    },
    {
      icon: Users,
      title: 'Transparent Partnership',
      description: 'Open communication, clear pricing, and honest advice throughout our collaboration.'
    }
  ]

  const expertise = [
    {
      icon: Code,
      area: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies',
      skills: ['React/Next.js', 'Node.js', 'TypeScript', 'API Development']
    },
    {
      icon: Palette,
      area: 'Design & UX',
      description: 'User-centered design that combines aesthetics with functionality',
      skills: ['UI/UX Design', 'Brand Identity', 'Wireframing', 'Prototyping']
    },
    {
      icon: LineChart,
      area: 'E-commerce',
      description: 'Complete online shop solutions from concept to conversion',
      skills: ['Online Shops', 'Payment Integration', 'Product Management', 'Analytics']
    },
    {
      icon: TrendingUp,
      area: 'Digital Marketing',
      description: 'SEO, content strategy, and digital presence optimization',
      skills: ['SEO', 'Content Strategy', 'Analytics', 'Conversion Optimization']
    }
  ]

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '250+', label: 'Happy Clients' },
    { number: '10+', label: 'Years Experience' },
    { number: '98%', label: 'Client Satisfaction' }
  ]

  const whyChooseUs = [
    {
      icon: Rocket,
      title: 'Fast & Reliable',
      description: 'We deliver on time and ensure your website runs smoothly 24/7'
    },
    {
      icon: Users,
      title: 'Dedicated Team',
      description: 'Experienced professionals who care about your success'
    },
    {
      icon: MessageSquare,
      title: 'Clear Communication',
      description: 'Regular updates and transparent project management'
    },
    {
      icon: Award,
      title: 'Proven Track Record',
      description: 'Hundreds of successful projects across diverse industries'
    },
    {
      icon: Zap,
      title: 'Modern Technology',
      description: 'Using the latest tools and frameworks for best results'
    },
    {
      icon: Globe,
      title: 'Full Service',
      description: 'From concept to launch and beyond - we handle everything'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Discovery',
      description: 'We listen to your needs, understand your goals, and analyze your requirements'
    },
    {
      step: 2,
      title: 'Strategy',
      description: 'We develop a clear plan and recommend the best solutions for your project'
    },
    {
      step: 3,
      title: 'Design',
      description: 'We create beautiful, user-friendly designs that align with your brand'
    },
    {
      step: 4,
      title: 'Development',
      description: 'We build your solution with clean code and best practices'
    },
    {
      step: 5,
      title: 'Testing',
      description: 'We thoroughly test everything to ensure quality and performance'
    },
    {
      step: 6,
      title: 'Launch & Support',
      description: 'We launch your project and provide ongoing support for your success'
    }
  ]

  const services = [
    {
      icon: Globe,
      service: 'Website Development',
      description: 'Custom websites, business sites, and web applications'
    },
    {
      icon: Briefcase,
      service: 'E-commerce Solutions',
      description: 'Online shops and e-commerce platforms'
    },
    {
      icon: Star,
      service: 'Digital Marketing',
      description: 'SEO, content strategy, and online visibility'
    },
    {
      icon: Code,
      service: 'Custom Development',
      description: 'Tailored solutions for unique business needs'
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
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              About <span className="text-primary">DFM Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are a passionate team of developers, designers, and digital strategists dedicated to helping businesses succeed online. With over a decade of experience, we transform ideas into powerful digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </CardTitle>
                  <CardDescription className="text-base font-semibold">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Mission
            </h2>
          </div>
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Target className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <p className="text-lg leading-relaxed mb-4">
                    Our mission is to empower businesses of all sizes with professional, innovative digital solutions that drive growth and success. We believe that every business deserves a strong online presence, and we're committed to making that accessible through transparent pricing, excellent service, and cutting-edge technology.
                  </p>
                  <p className="text-lg leading-relaxed">
                    We don't just build websites - we create digital experiences that connect businesses with their customers, streamline operations, and open new opportunities for growth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Expertise
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive digital solutions across multiple disciplines
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {expertise.map((area, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <area.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{area.area}</CardTitle>
                  <CardDescription className="text-base mb-4">{area.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {area.skills.map((skill, sIndex) => (
                      <span 
                        key={sIndex}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose DFM Solutions?
            </h2>
            <p className="text-xl text-muted-foreground">
              What sets us apart from other agencies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <reason.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                  <CardDescription>{reason.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How We Work
            </h2>
            <p className="text-xl text-muted-foreground">
              Our proven process for successful projects
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
                  <CardDescription className="text-base">{phase.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive digital solutions for your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{service.service}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/#services">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-4">Our Commitment to You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'Deliver high-quality solutions on time and within budget',
                  'Provide transparent communication throughout the project',
                  'Offer competitive pricing without compromising quality',
                  'Ensure your satisfaction with our work',
                  'Provide ongoing support after project completion',
                  'Stay updated with the latest technologies and best practices'
                ].map((commitment, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-base">{commitment}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Work Together?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and explore how we can help your business succeed online. Schedule a free consultation or get in touch with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}