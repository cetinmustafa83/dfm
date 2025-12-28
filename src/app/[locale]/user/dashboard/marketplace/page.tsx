'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, ExternalLink, Search, Tag, Loader2 } from 'lucide-react'

interface Template {
  id: string
  name: string
  category: string
  price: number
  status: 'free' | 'premium' | 'purchased'
  preview: string
  previewUrl?: string
  downloadUrl?: string
}

export default function UserMarketplace() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>(['all'])

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
          price: t.price,
          status: t.price === 0 ? 'free' : 'premium',
          preview: t.previewUrl || '/images/templates/default.jpg',
          previewUrl: t.previewUrl,
          downloadUrl: t.downloadUrl
        }))
        setTemplates(transformedTemplates)
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(result.data.map((t: any) => t.category))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const statusColors = {
    free: 'bg-blue-100 text-blue-800',
    premium: 'bg-green-100 text-green-800',
    purchased: 'bg-purple-100 text-purple-800',
  }

  const statusLabels = {
    free: 'Free',
    premium: 'Premium',
    purchased: 'Purchased',
  }

  function handlePurchase(templateId: string) {
    alert(`Purchase flow initiated for template: ${templateId}`)
  }

  function handleDownload(templateId: string) {
    alert(`Download initiated for template: ${templateId}`)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Browse and download premium templates for your website
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Template Marketplace</h1>
        <p className="text-muted-foreground mt-2">
          Browse and download premium templates for your website
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Browse Templates</CardTitle>
          <CardDescription>
            {filteredTemplates.length} templates available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <div className="mb-2 text-sm text-muted-foreground">Filter by category:</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category as any)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      categoryFilter === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Tag className="h-3 w-3 mr-1 inline" />
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>
                          <Tag className="h-3 w-3 mr-1 inline" />
                          {template.category}
                        </CardDescription>
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[template.status]
                        }`}
                      >
                        {statusLabels[template.status]}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold">
                          {template.price === 0 ? 'Free' : `${template.price} €`}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {template.status === 'free' || template.status === 'purchased' ? (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDownload(template.id)}
                              title="Download"
                              disabled={!template.downloadUrl}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => handleDownload(template.id)}
                              disabled={!template.downloadUrl}
                            >
                              Download Now
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePurchase(template.id)}
                              title="Preview"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => handlePurchase(template.id)}
                            >
                              Purchase Now
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
