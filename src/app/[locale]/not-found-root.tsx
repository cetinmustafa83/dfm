import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Code, ArrowLeft, Home, Search, FileText, Briefcase } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Icon */}
        <div className="relative">
          <div className="text-9xl font-bold text-primary/20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-2">
          Oops! Page Not Found
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="default" className="flex-1" asChild>
              <Link href="#services">
                <Search className="mr-2 h-4 w-4" />
                Browse Services
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/portfolio">
                <Briefcase className="mr-2 h-4 w-4" />
                View Portfolio
              </Link>
            </Button>
            <Button variant="default" className="flex-1" asChild>
              <Link href="/blog">
                <FileText className="mr-2 h-4 w-4" />
                Read Our Blog
              </Link>
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <Card className="bg-muted/30 border-2">
          <CardHeader>
            <h2 className="text-xl font-bold">
              Looking for something specific?
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="text-left">
                <div className="font-medium mb-2">Services</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Web Development, UI/UX Design, E-commerce, Mobile Apps, Digital Marketing, Brand Strategy
                </p>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/services">
                    View Services
                  </Link>
                </Button>
              </div>
              <div className="text-left">
                <div className="font-medium mb-2">Projects</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Browse our portfolio of successful web development projects
                </p>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/portfolio">
                    View Projects
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="text-left">
                <div className="font-medium mb-2">Blog</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Read our latest articles about web development, design, and digital marketing
                </p>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/blog">
                    View Blog
                  </Link>
                </Button>
              </div>
              <div className="text-left">
                <div className="font-medium mb-2">Contact</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get in touch with our team for your next project
                </p>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Still cannot find what you are looking for?
          </p>
          <Link href="/contact" className="text-primary hover:underline mt-2 inline-block">
            Contact our support team
          </Link>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
