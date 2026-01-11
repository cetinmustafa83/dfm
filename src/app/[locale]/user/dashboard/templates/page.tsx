'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Download, Code, Smartphone, Globe, FileText, Search, Filter, Loader2 } from 'lucide-react'

interface Template {
  id: string
  name: string
  category: string
  description: string
  price: number
  rating: number
  downloads: number
  image: string
  features: string[]
  previewUrl?: string
  downloadUrl?: string
}

export default function UserTemplates() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<{ name: string; value: string }[]>([{ name: 'All', value: 'all' }])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      const result = await response.json()

      if (result.success && result.data) {
        const transformedTemplates = result.data.map((t: any) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          description: t.description || 'No description available',
          price: t.price,
          rating: t.rating || 0,
          downloads: t.downloads || 0,
          image: t.previewUrl || '/templates/default.jpg',
          features: t.features ? JSON.parse(t.features) : [],
          previewUrl: t.previewUrl,
          downloadUrl: t.downloadUrl
        }))
        setTemplates(transformedTemplates)

        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(result.data.map((t: any) => t.category))]
        const categoryOptions = uniqueCategories.map(cat => ({
          name: cat === 'all' ? 'All' : cat,
          value: cat
        }))
        setCategories(categoryOptions as { name: string; value: string }[])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(template =>
    selectedCategory === 'all' || template.category === selectedCategory
  )

  async function handlePurchase(template: Template) {
    // For demo, just show alert
    alert(`Purchase "${template.name}" for ${template.price} €. This will be added to your completed projects.`)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Browse and purchase pre-built templates for your projects
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Template Marketplace</h1>
        <p className="text-muted-foreground mt-2">
          Browse and purchase pre-built templates for your projects
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg border border-input bg-background appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTemplates.length} of {templates.length} templates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-purple-100/50 to-blue-100/50 flex items-center justify-center relative">
              <div className="text-6xl font-bold text-muted-foreground/10">
                {template.name.charAt(0)}
              </div>
              <Badge className="absolute top-4 right-4">
                {template.category}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl line-clamp-2">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Rating and Downloads */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-3xl font-bold text-primary">
                  {template.price} €
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {template.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  {template.features.length > 4 && (
                    <div className="text-sm text-muted-foreground">
                      +{template.features.length - 4} more
                    </div>
                  )}
                </div>

                {/* Purchase Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handlePurchase(template)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No templates found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 border-2 border-purple-200">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                How It Works
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Browse templates by category</p>
                <p>2. Search by name or description</p>
                <p>3. View ratings and downloads</p>
                <p>4. Purchase with one click</p>
                <p>5. Download and use in your project</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Download className="h-5 w-5" />
                After Purchase
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Template files ready for download</p>
                <p>• Complete documentation included</p>
                <p>• Support from our team</p>
                <p>• License for commercial use</p>
                <p>• Regular updates included</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-purple-200">
            <p className="text-sm text-center text-muted-foreground">
              All templates are developed by our expert team and come with full support and regular updates.
              Need a custom template? Contact us for a quote.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <FileText className="h-6 w-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Template Pricing</h4>
              <p className="text-sm text-blue-700 mb-3">
                Templates are sold individually with one-time purchase pricing. Each template includes a commercial license for use in a single project.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Basic Web: 29-79 €</p>
                  <p className="text-xs text-blue-700">1-15 pages templates</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">SEO Packs: 19-39 €</p>
                  <p className="text-xs text-blue-700">SEO tools and resources</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">One Page: 29-39 €</p>
                  <p className="text-xs text-blue-700">Landing and portfolio pages</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">Language Packs: 9 €</p>
                  <p className="text-xs text-blue-700">Complete language translations</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
