'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Menu, X, Code, ArrowLeft, Calendar, User, Clock } from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [postRes, settingsRes] = await Promise.all([
          fetch(`/api/blog/${params.id}`),
          fetch('/api/settings')
        ])
        
        if (!postRes.ok) {
          router.push('/blog')
          return
        }
        
        const postData = await postRes.json()
        const settingsData = await settingsRes.json()
        setPost(postData)
        setSettings(settingsData.settings || settingsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/blog')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, router])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 bg-muted animate-pulse rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">ModernAgency</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                >
                  {link.name}
                </Link>
              ))}
              <Button asChild>
                <Link href="/admin">Admin Panel</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
              <Button asChild className="w-full">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Blog Post */}
      <article className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="mb-8" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Article Header */}
          <header className="mb-8">
            <div className="space-y-4 mb-6">
              <Badge variant="outline">{post.category}</Badge>
              {post.featured && (
                <Badge>Featured</Badge>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold text-primary">
                  {post.title.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Share Section */}
          <Card className="mb-12">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-4">Share this article</h3>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  Twitter
                </Button>
                <Button size="sm" variant="outline">
                  LinkedIn
                </Button>
                <Button size="sm" variant="outline">
                  Facebook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Enjoyed This Article?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Subscribe to our newsletter to get the latest insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/#contact">
                    Subscribe <ArrowLeft className="rotate-180 mr-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/blog">
                    Read More Articles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      {/* Footer */}
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
              <p className="text-sm text-muted-foreground">
                Creating digital experiences that drive results and inspire growth.
              </p>
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
