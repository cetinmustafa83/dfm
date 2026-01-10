'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sparkles,
  Palette,
  Code,
  Layers,
  Zap,
  Shield,
  Database,
  Settings,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Globe,
  BarChart3,
  Award,
  Briefcase,
  Target,
  Rocket,
  Heart,
  Eye,
  Wrench,
  LineChart,
  Lock,
  Cloud,
  FileCode,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function IndividualWebsitePage() {
  const uniqueFeatures = [
    {
      icon: Palette,
      title: 'Completely Unique Design',
      description: 'Every pixel designed from scratch to match your vision, brand, and business goals'
    },
    {
      icon: Code,
      title: 'Custom Coded Solutions',
      description: 'Hand-crafted code tailored to your specific requirements, not template limitations'
    },
    {
      icon: Layers,
      title: 'Any Feature Imaginable',
      description: 'If you can dream it, we can build it - no limitations from platforms or templates'
    },
    {
      icon: Database,
      title: 'Custom Database Design',
      description: 'Data structures optimized specifically for your business logic and workflows'
    },
    {
      icon: Settings,
      title: 'Bespoke Functionality',
      description: 'Custom tools, calculators, configurators, or any interactive elements you need'
    },
    {
      icon: Users,
      title: 'User Experience Focus',
      description: 'UX research and design tailored to your specific target audience behavior'
    },
    {
      icon: Zap,
      title: 'Performance Engineering',
      description: 'Optimized architecture for maximum speed, even with complex functionality'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced security measures tailored to your industry and data requirements'
    },
    {
      icon: BarChart3,
      title: 'Custom Analytics',
      description: 'Tracking and reporting designed around your specific business metrics'
    }
  ]

  const whenYouNeed = [
    {
      icon: Target,
      title: 'Unique Business Model',
      description: 'Your business operates differently and standard solutions don\'t fit',
      examples: ['Complex workflows', 'Industry-specific needs', 'Innovative business models']
    },
    {
      icon: Award,
      title: 'Competitive Advantage',
      description: 'You want features your competitors can\'t easily replicate',
      examples: ['Proprietary tools', 'Unique user experience', 'Custom integrations']
    },
    {
      icon: Rocket,
      title: 'Scalable Foundation',
      description: 'You need a platform that can grow and evolve with your business',
      examples: ['Future expansion plans', 'Multiple user types', 'Complex data handling']
    },
    {
      icon: Heart,
      title: 'Brand Expression',
      description: 'Your brand identity demands a truly unique digital presence',
      examples: ['Luxury positioning', 'Creative industries', 'Strong brand values']
    }
  ]

  const capabilitiesExamples = [
    {
      category: 'Advanced Interactions',
      items: [
        'Product configurators with real-time pricing',
        'Interactive calculators and tools',
        'Dynamic data visualizations',
        'Complex search and filtering systems',
        'Custom maps and location features'
      ]
    },
    {
      category: 'User Management',
      items: [
        'Multi-level user roles and permissions',
        'Custom dashboards for different user types',
        'Membership and subscription systems',
        'Client portals with custom features',
        'Team collaboration tools'
      ]
    },
    {
      category: 'Business Processes',
      items: [
        'Workflow automation systems',
        'Custom booking and scheduling',
        'Project management tools',
        'Inventory management',
        'Custom reporting systems'
      ]
    },
    {
      category: 'Integrations',
      items: [
        'ERP and CRM systems',
        'Payment gateways and billing',
        'Email marketing platforms',
        'Third-party APIs',
        'Legacy system connections'
      ]
    }
  ]

  const process = [
    {
      phase: 'Discovery & Research',
      description: 'Deep dive into your business, users, competitors, and technical requirements',
      deliverables: ['Requirements document', 'Technical specification', 'Project roadmap'],
      duration: '2-3 weeks'
    },
    {
      phase: 'UX Research & Strategy',
      description: 'User research, journey mapping, and strategic planning for optimal experience',
      deliverables: ['User personas', 'Journey maps', 'Information architecture'],
      duration: '2-3 weeks'
    },
    {
      phase: 'UI Design',
      description: 'Creating unique interface designs that bring your brand and vision to life',
      deliverables: ['Wireframes', 'Design mockups', 'Design system', 'Interactive prototypes'],
      duration: '3-5 weeks'
    },
    {
      phase: 'Custom Development',
      description: 'Building your website with clean, scalable code and custom functionality',
      deliverables: ['Frontend development', 'Backend systems', 'Database setup', 'API development'],
      duration: '8-16 weeks'
    },
    {
      phase: 'Integration & Testing',
      description: 'Connecting all systems and comprehensive testing across scenarios',
      deliverables: ['System integrations', 'QA testing', 'Performance optimization', 'Security audit'],
      duration: '2-4 weeks'
    },
    {
      phase: 'Training & Launch',
      description: 'Team training, documentation, and smooth transition to production',
      deliverables: ['User documentation', 'Training sessions', 'Launch plan', 'Go-live support'],
      duration: '1-2 weeks'
    },
    {
      phase: 'Support & Evolution',
      description: 'Ongoing support, monitoring, and iterative improvements',
      deliverables: ['Monitoring', 'Bug fixes', 'Feature enhancements', 'Performance optimization'],
      duration: 'Ongoing'
    }
  ]

  const technologies = [
    {
      category: 'Frontend',
      techs: ['React / Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      category: 'Backend',
      techs: ['Node.js', 'Python', '.NET', 'PHP']
    },
    {
      category: 'Databases',
      techs: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis']
    },
    {
      category: 'Cloud & DevOps',
      techs: ['AWS', 'Azure', 'Docker', 'Kubernetes']
    }
  ]

  const advantages = [
    {
      icon: Eye,
      title: 'Unique Market Position',
      description: 'Stand out with a website that competitors can\'t replicate with templates'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth Ready',
      description: 'Built to scale with your business without platform limitations'
    },
    {
      icon: Wrench,
      title: 'Complete Control',
      description: 'Own your codebase and make any changes without vendor restrictions'
    },
    {
      icon: LineChart,
      title: 'Optimized Performance',
      description: 'Fine-tuned code delivers faster loading and better user experience'
    }
  ]

  const pricingInfo = {
    startingFrom: 'From €10,000',
    typical: '€15,000 - €50,000',
    complex: '€50,000+',
    timeline: '12-24 weeks',
    description: 'Investment varies based on complexity, features, and integrations required'
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
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Individual <span className="text-primary">Website Development</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              When standard solutions don't fit, we create extraordinary custom websites designed and built specifically for your unique business needs. No templates, no limitations - just pure innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/appointment">
                <Button size="lg" className="text-lg px-8 py-6">
                  Discuss Your Project <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ticket">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Request Proposal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Truly Custom Development
            </h2>
            <p className="text-xl text-muted-foreground">
              Built from the ground up for your specific requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueFeatures.map((feature, index) => (
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

      {/* When You Need Individual */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              When You Need Individual Development
            </h2>
            <p className="text-xl text-muted-foreground">
              Perfect for businesses with unique requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {whenYouNeed.map((item, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-base mb-4">{item.description}</CardDescription>
                  <div className="space-y-2">
                    {item.examples.map((example, eIndex) => (
                      <div key={eIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Examples */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We Can Build
            </h2>
            <p className="text-xl text-muted-foreground">
              Examples of custom features and functionality
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilitiesExamples.map((category, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl mb-4 text-primary">{category.category}</CardTitle>
                  <div className="space-y-2">
                    {category.items.map((item, iIndex) => (
                      <div key={iIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Advantages of Individual Development
            </h2>
            <p className="text-xl text-muted-foreground">
              Why custom beats templates for growing businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 mx-auto">
                    <advantage.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{advantage.title}</CardTitle>
                  <CardDescription className="text-base">{advantage.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Development Process
            </h2>
            <p className="text-xl text-muted-foreground">
              A structured approach to building exceptional custom solutions
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

      {/* Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Modern Technology Stack
            </h2>
            <p className="text-xl text-muted-foreground">
              We use cutting-edge technologies suited to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg mb-4 text-primary">{tech.category}</CardTitle>
                  <div className="space-y-2">
                    {tech.techs.map((item, iIndex) => (
                      <div key={iIndex} className="text-sm text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Investment & Timeline
            </h2>
            <p className="text-xl text-muted-foreground">
              Custom development is a significant investment that delivers unique value
            </p>
          </div>

          <Card className="border-2">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl mb-4">Individual Website Development</CardTitle>
              <CardDescription className="text-lg mb-6">{pricingInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Starting From</h4>
                  <p className="text-2xl font-bold text-primary">{pricingInfo.startingFrom}</p>
                  <p className="text-xs text-muted-foreground mt-1">Simple custom projects</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Typical Range</h4>
                  <p className="text-2xl font-bold text-primary">{pricingInfo.typical}</p>
                  <p className="text-xs text-muted-foreground mt-1">Most business websites</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Complex Projects</h4>
                  <p className="text-2xl font-bold text-primary">{pricingInfo.complex}</p>
                  <p className="text-xs text-muted-foreground mt-1">Enterprise solutions</p>
                </div>
              </div>

              <div className="pt-6 border-t text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Typical Timeline: {pricingInfo.timeline}</span>
                </div>
                <p className="text-sm text-muted-foreground">Depending on project scope and complexity</p>
              </div>

              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4 text-center">What's Included:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Complete custom design',
                    'Custom development',
                    'Unlimited features',
                    'Advanced integrations',
                    'User research & UX',
                    'Quality assurance',
                    'Training & documentation',
                    'Post-launch support',
                    'Full code ownership',
                    'Scalable architecture'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link href="/appointment" className="block">
                  <Button size="lg" className="w-full text-lg">
                    Schedule Strategy Session
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Build Something Extraordinary?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your unique requirements and create a custom solution that sets you apart from competitors. Schedule a free consultation to explore possibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Schedule Free Consultation
              </Button>
            </Link>
            <Link href="/ticket">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Request Detailed Proposal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}