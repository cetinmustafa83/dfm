'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Menu, X, Code, ArrowRight, ExternalLink } from 'lucide-react'

export default function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, settingsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/settings')
        ])
        const projectsData = await projectsRes.json()
        const settingsData = await settingsRes.json()
        setProjects(projectsData)
        setSettings(settingsData.settings || settingsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setProjects([
          { id: '1', title: 'EcoTech', category: 'E-commerce', description: 'Complete platform.', tags: ['Next.js'], featured: true },
          { id: '2', title: 'Fitness App', category: 'Mobile', description: 'Fitness tracking app.', tags: ['React Native'], featured: true },
          { id: '3', title: 'Portfolio Site', category: 'Web', description: 'Modern portfolio website.', tags: ['Three.js'], featured: false },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProjects = filter === 'all'
    ? projects
    : filter === 'featured'
    ? projects.filter((p: any) => p.featured)
    : projects.filter((p: any) => p.category.toLowerCase().includes(filter.toLowerCase()))

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">ModernAgency</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                  {link.name}
                </Link>
              ))}
              <Button asChild>
                <Link href="/admin">Admin Panel</Link>
              </Button>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md hover:bg-accent">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary">
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-full">
              <Link href="/admin" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
            </Button>
          </div>
        </div>
      )}

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8 mb-12">
            <Badge variant="outline" className="text-sm">Our Portfolio</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              Featured <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Projects & Work</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our collection of successful projects and see how we have helped businesses achieve their digital goals.
            </p>
          </div>

          <section className="py-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {['all', 'featured', 'ecommerce', 'web', 'mobile'].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className="capitalize"
                >
                  {filterType === 'all' ? 'All Projects' : `${filterType} Projects`}
                </Button>
              ))}
            </div>
          </section>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Showing {filteredProjects.length} of {projects.length} projects</p>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-muted/50 animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {project.featured ? (
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                        <Code className="w-10 h-10 text-primary" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Code className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge variant="outline">{project.category}</Badge>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                      </div>
                      {project.featured && <Badge className="animate-pulse">Featured</Badge>}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{project.description}</CardDescription>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground font-medium mb-2">Technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href="/contact">Request Quote <ExternalLink className="ml-2 h-4 w-4" /></Link>
                      </Button>
                      <Button className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                        <Link href="/contact">View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <Card className="text-center">
              <CardContent className="py-12">
                <p className="text-lg text-muted-foreground">No projects found in this category.</p>
                <Button variant="outline" className="mt-4" onClick={() => setFilter('all')}>
                  View All Projects
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Have a Project in Mind?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let us turn your vision into reality. Our team is ready to bring your next big idea to life.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">Start Your Project <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">ModernAgency</span>
              </div>
              <p className="text-sm text-muted-foreground">Creating digital experiences that drive results.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Web Development</li>
                <li>UI/UX Design</li>
                <li>E-commerce</li>
                <li>Mobile Apps</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>{new Date().getFullYear()} {settings?.general?.siteName || 'ModernAgency'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
