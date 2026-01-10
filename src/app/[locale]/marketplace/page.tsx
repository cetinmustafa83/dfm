'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  Package, 
  Code, 
  Layout, 
  ShoppingBag,
  Globe,
  Menu,
  X,
  Shield,
  Eye,
  Languages,
  TrendingUp,
  Key,
  Zap
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoginModal } from '@/components/LoginModal'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  category: string
  productType: string
  price: number
  currency: string
  paymentType: 'one-time' | 'monthly'
  featured: boolean
  image: string
  demoUrl: string
  downloadUrl: string
  technologies: string[]
  features: string[]
  version: string
  lastUpdated: string
  downloads: number
  rating: number
  reviews: number
  status: string
  includedItems: string[]
}

const productTypes = [
  { value: 'all', label: 'All Products', icon: Package },
  { value: 'website-basic', label: 'Basic Websites', icon: Globe },
  { value: 'website-premium', label: 'Premium Websites', icon: Zap },
  { value: 'website-onepage', label: 'One Page Sites', icon: Layout },
  { value: 'website-multipage', label: 'Multi Page Sites', icon: Layout },
  { value: 'website-landing', label: 'Landing Pages', icon: Code },
  { value: 'language-pack', label: 'Language Packs', icon: Languages },
  { value: 'seo-package', label: 'SEO Packages', icon: TrendingUp },
  { value: 'extra-license', label: 'Extra Licenses', icon: Key },
]

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Blog', label: 'Blog' },
  { value: 'Portfolio', label: 'Portfolio' },
  { value: 'Landing', label: 'Landing' },
  { value: 'Education', label: 'Education' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Real Estate', label: 'Real Estate' },
]

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProductType, setSelectedProductType] = useState('all')
  const [selectedPaymentType, setSelectedPaymentType] = useState('all')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetchItems()
    fetchSettings()
  }, [selectedCategory, selectedProductType, selectedPaymentType])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.settings || data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  async function fetchItems() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (selectedProductType !== 'all') {
        params.append('productType', selectedProductType)
      }
      if (selectedPaymentType !== 'all') {
        params.append('paymentType', selectedPaymentType)
      }
      
      const res = await fetch(`/api/marketplace?${params.toString()}`)
      const data = await res.json()
      
      if (data.success) {
        setItems(data.data.filter((item: MarketplaceItem) => item.status === 'active'))
      }
    } catch (error) {
      console.error('Error fetching marketplace items:', error)
      toast({
        title: 'Error',
        description: 'Failed to load marketplace items',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredItems = filteredItems.filter(item => item.featured)
  const regularItems = filteredItems.filter(item => !item.featured)

  const getProductTypeLabel = (type: string) => {
    return productTypes.find(pt => pt.value === type)?.label || type
  }

  const productTypeColors: Record<string, string> = {
    'website-basic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'website-premium': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'website-onepage': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'website-multipage': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'website-landing': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'language-pack': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'seo-package': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'extra-license': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">ModernAgency</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/marketplace" className="text-sm font-medium text-primary">
                Marketplace
              </Link>
              <Button size="icon" className="bg-black hover:bg-black/80 text-white" onClick={() => setIsLoginModalOpen(true)} title="Admin Login">
                <Shield className="h-5 w-5" />
              </Button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-medium text-primary"
              >
                Marketplace
              </Link>
              <Button onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }} className="w-full bg-black hover:bg-black/80 text-white justify-start">
                <Shield className="h-5 w-5 mr-2" />
                Admin Login
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="text-sm">
              Marketplace
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Digital
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse professional websites, language packs, SEO packages, and licenses. Get started instantly with quality products.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                <SelectTrigger>
                  <Package className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <type.icon className="h-4 w-4 mr-2" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
                <SelectTrigger>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Types</SelectItem>
                  <SelectItem value="one-time">One-Time Payment</SelectItem>
                  <SelectItem value="monthly">Monthly Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="text-muted-foreground mt-2">Handpicked premium products</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all border-2 hover:border-primary">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-primary">Featured</Badge>
                    {item.paymentType === 'monthly' && (
                      <Badge className="absolute top-3 left-3 bg-blue-600">Subscription</Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 flex-1">
                        <Badge className={productTypeColors[item.productType]}>
                          {getProductTypeLabel(item.productType)}
                        </Badge>
                        <CardTitle className="text-xl line-clamp-1">{item.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {item.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {item.rating || 0}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">v{item.version}</span>
                    </div>
                    {item.includedItems.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.includedItems.slice(0, 2).map((included, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {included}
                            </Badge>
                          ))}
                          {item.includedItems.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.includedItems.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {item.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {item.demoUrl && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/checkout/${item.id}`}>
                        {item.price > 0 ? `${item.price} ${item.currency}${item.paymentType === 'monthly' ? '/mo' : ''}` : 'Free'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Items */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">All Products</h2>
              <p className="text-muted-foreground mt-2">
                {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardHeader>
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-6 w-full bg-muted rounded mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : regularItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'all' || selectedProductType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No products available yet'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    {item.paymentType === 'monthly' && (
                      <Badge className="absolute top-3 left-3 bg-blue-600">Subscription</Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 flex-1">
                        <Badge className={productTypeColors[item.productType]}>
                          {getProductTypeLabel(item.productType)}
                        </Badge>
                        <CardTitle className="text-xl line-clamp-1">{item.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {item.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {item.rating || 0}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">v{item.version}</span>
                    </div>
                    {item.includedItems.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.includedItems.slice(0, 2).map((included, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {included}
                            </Badge>
                          ))}
                          {item.includedItems.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.includedItems.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {item.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {item.demoUrl && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/checkout/${item.id}`}>
                        {item.price > 0 ? `${item.price} ${item.currency}${item.paymentType === 'monthly' ? '/mo' : ''}` : 'Free'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>{new Date().getFullYear()} {settings?.general?.siteName || 'ModernAgency'}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </div>
  )
}