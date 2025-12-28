'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Search, Plus, Edit, Trash2, Layers, Globe, Euro, Download, ExternalLink, Check, X, PackageOpen, Languages, TrendingUp, Key } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  category: string
  productType: 'website-basic' | 'website-premium' | 'website-onepage' | 'website-multipage' | 'website-landing' | 'language-pack' | 'seo-package' | 'extra-license'
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
  status: 'active' | 'inactive' | 'draft'
  licenses: number
  downloadLimit: number
  downloadLimitType: 'unlimited' | 'count' | 'date'
  downloadExpiry: string | null
  includedItems: string[]
  createdAt: string
}

const productTypes = [
  { value: 'website-basic', label: 'Website - Basic', icon: Globe },
  { value: 'website-premium', label: 'Website - Premium', icon: Globe },
  { value: 'website-onepage', label: 'Website - One Page', icon: Globe },
  { value: 'website-multipage', label: 'Website - Multi Page', icon: Globe },
  { value: 'website-landing', label: 'Website - Landing Page', icon: Globe },
  { value: 'language-pack', label: 'Language Pack', icon: Languages },
  { value: 'seo-package', label: 'SEO Package', icon: TrendingUp },
  { value: 'extra-license', label: 'Extra License', icon: Key },
]

const categories = ['E-commerce', 'Corporate', 'Blog', 'Portfolio', 'Landing', 'Education', 'Healthcare', 'Restaurant', 'Real Estate', 'Other']

export default function MarketplaceAdmin() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [productTypeFilter, setProductTypeFilter] = useState<string>('all')
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all')
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [editItem, setEditItem] = useState<MarketplaceItem | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    productType: 'website-basic' as MarketplaceItem['productType'],
    price: 0,
    currency: 'EUR',
    paymentType: 'one-time' as 'one-time' | 'monthly',
    featured: false,
    demoUrl: '',
    technologies: [''],
    features: ['', '', '', '', ''],
    version: '1.0.0',
    licenses: 1,
    downloadLimit: 0,
    downloadLimitType: 'unlimited' as 'unlimited' | 'count' | 'date',
    downloadExpiry: '',
    includedItems: [''],
    status: 'draft' as 'active' | 'inactive' | 'draft',
  })

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch('/api/marketplace')
      const data = await res.json()
      
      if (data.success) {
        setItems(data.data)
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

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesProductType = productTypeFilter === 'all' || item.productType === productTypeFilter
    const matchesPaymentType = paymentTypeFilter === 'all' || item.paymentType === paymentTypeFilter

    return matchesSearch && matchesCategory && matchesProductType && matchesPaymentType
  })

  const totalDownloads = items.reduce((sum, item) => sum + item.downloads, 0)
  const totalRevenue = items.reduce((sum, item) => sum + (item.price * item.downloads), 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const payload = {
      ...formData,
      technologies: formData.technologies.filter(t => t.trim() !== ''),
      features: formData.features.filter(f => f.trim() !== ''),
      includedItems: formData.includedItems.filter(i => i.trim() !== ''),
    }

    try {
      const url = editItem ? '/api/marketplace' : '/api/marketplace'
      const method = editItem ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem ? { ...payload, id: editItem.id } : payload),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: data.message,
        })
        setShowAddSheet(false)
        setEditItem(null)
        resetForm()
        fetchItems()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save item',
        variant: 'destructive',
      })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/marketplace?id=${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        })
        fetchItems()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      })
    }
  }

  async function handleToggleStatus(id: string) {
    const item = items.find(i => i.id === id)
    if (!item) return

    const newStatus = item.status === 'active' ? 'inactive' : 'active'

    try {
      const res = await fetch('/api/marketplace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, status: newStatus }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Status updated',
        })
        fetchItems()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      })
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      description: '',
      category: '',
      productType: 'website-basic',
      price: 0,
      currency: 'EUR',
      paymentType: 'one-time',
      featured: false,
      demoUrl: '',
      technologies: [''],
      features: ['', '', '', '', ''],
      version: '1.0.0',
      licenses: 1,
      downloadLimit: 0,
      downloadLimitType: 'unlimited',
      downloadExpiry: '',
      includedItems: [''],
      status: 'draft',
    })
  }

  function handleEdit(item: MarketplaceItem) {
    setEditItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      productType: item.productType,
      price: item.price,
      currency: item.currency,
      paymentType: item.paymentType,
      featured: item.featured,
      demoUrl: item.demoUrl,
      technologies: item.technologies.length > 0 ? item.technologies : [''],
      features: item.features.length > 0 ? item.features : ['', '', '', '', ''],
      version: item.version,
      licenses: item.licenses,
      downloadLimit: item.downloadLimit,
      downloadLimitType: item.downloadLimitType,
      downloadExpiry: item.downloadExpiry || '',
      includedItems: item.includedItems.length > 0 ? item.includedItems : [''],
      status: item.status,
    })
    setShowAddSheet(true)
  }

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

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    draft: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage ready-made websites, language packs, SEO packages, and licenses
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{items.length}</div>
            <p className="text-sm text-muted-foreground">
              {items.filter(i => i.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDownloads.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-blue-600" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue.toLocaleString()} €</div>
            <p className="text-sm text-muted-foreground">From sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Product Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{new Set(items.map(i => i.productType)).size}</div>
            <p className="text-sm text-muted-foreground">Different types</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button onClick={() => {
              setEditItem(null)
              resetForm()
              setShowAddSheet(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={productTypeFilter}
                onChange={(e) => setProductTypeFilter(e.target.value)}
                className="h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
              >
                <option value="all">All Product Types</option>
                {productTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
              >
                <option value="all">All Payment Types</option>
                <option value="one-time">One-Time Payment</option>
                <option value="monthly">Monthly Payment</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={productTypeColors[item.productType]}>
                            {getProductTypeLabel(item.productType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.paymentType === 'one-time' ? 'default' : 'secondary'}>
                            {item.paymentType === 'one-time' ? 'One-Time' : 'Monthly'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold">
                            {item.price} {item.currency}
                            {item.paymentType === 'monthly' && <span className="text-xs text-muted-foreground">/mo</span>}
                          </div>
                        </TableCell>
                        <TableCell>{item.downloads.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[item.status]}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {item.demoUrl && (
                              <a
                                href={item.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(item.id)}
                              title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {item.status === 'active' ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="right" className="sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editItem ? 'Edit' : 'Add'} Marketplace Product</SheetTitle>
            <SheetDescription>
              {editItem ? 'Update' : 'Create'} a marketplace item with all details
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Premium E-commerce Website"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                        required
                      >
                        <option value="">Select...</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed product description..."
                      required
                      rows={3}
                    />
                  </div>
                </div>

                {/* Product Type */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Product Type</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productType">Type *</Label>
                      <select
                        id="productType"
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                        required
                      >
                        {productTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="version">Version</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Pricing (Admin Controlled)</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentType">Payment Type *</Label>
                      <select
                        id="paymentType"
                        value={formData.paymentType}
                        onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                        required
                      >
                        <option value="one-time">One-Time Payment</option>
                        <option value="monthly">Monthly Subscription</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Additional Settings</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="demoUrl">Demo URL</Label>
                      <Input
                        id="demoUrl"
                        type="url"
                        value={formData.demoUrl}
                        onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                        placeholder="https://demo.example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenses">Licenses Included</Label>
                      <Input
                        id="licenses"
                        type="number"
                        min="1"
                        value={formData.licenses}
                        onChange={(e) => setFormData({ ...formData, licenses: parseInt(e.target.value) || 1 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Technologies</h3>
                  <div className="space-y-2">
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={tech}
                          onChange={(e) => {
                            const newTech = [...formData.technologies]
                            newTech[index] = e.target.value
                            setFormData({ ...formData, technologies: newTech })
                          }}
                          placeholder={`Technology ${index + 1}`}
                        />
                        {index === formData.technologies.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFormData({ ...formData, technologies: [...formData.technologies, ''] })}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Features</h3>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <Input
                        key={index}
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features]
                          newFeatures[index] = e.target.value
                          setFormData({ ...formData, features: newFeatures })
                        }}
                        placeholder={`Feature ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Included Items */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Included Items</h3>
                  <div className="space-y-2">
                    {formData.includedItems.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newItems = [...formData.includedItems]
                            newItems[index] = e.target.value
                            setFormData({ ...formData, includedItems: newItems })
                          }}
                          placeholder="e.g., SEO Package, 3 Language Packs"
                        />
                        {index === formData.includedItems.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFormData({ ...formData, includedItems: [...formData.includedItems, ''] })}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <SheetFooter className="gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editItem ? 'Update' : 'Create'} Product
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddSheet(false)
                      setEditItem(null)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </SheetFooter>
              </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}