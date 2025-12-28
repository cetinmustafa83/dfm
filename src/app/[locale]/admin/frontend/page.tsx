'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Save, FileText, Briefcase, Mail, Euro, Users, Plus, Edit, Trash2, Search, ArrowDown, Upload, X, Sparkles, Calendar, UserPlus, GraduationCap } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  featured: boolean
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string
  price?: number
  status: string
  order: number
}

export default function FrontendManagement() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('sections')
  const [settings, setSettings] = useState<any>(null)
  
  // Blog-specific states
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'>('date-desc')
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    category: '',
    image: '',
    featured: false,
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [aiOptimizing, setAiOptimizing] = useState(false)

  // Services-specific states
  const [services, setServices] = useState<Service[]>([])
  const [isServiceSheetOpen, setIsServiceSheetOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
    features: '',
    price: 0,
    isMonthly: false,
    status: 'active',
    order: 0,
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn !== 'true') {
      router.push('/admin/login')
      return
    }

    fetchSettings()
    fetchPosts()
    fetchServices()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      if (data && data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchPosts() {
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    }
  }

  async function fetchServices() {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const getSortedPosts = () => {
    let filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const sorted = [...filtered]
    if (sortBy === 'name-asc') {
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'name-desc') {
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    } else if (sortBy === 'date-asc') {
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else {
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }))
        setImageFile(file)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const postData = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      date: formData.date || new Date().toISOString().split('T')[0],
      category: formData.category,
      image: formData.image || '/images/blog/placeholder.jpg',
      featured: formData.featured,
    }

    try {
      if (editingPost) {
        await fetch(`/api/blog/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })
      } else {
        await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })
      }

      await fetchPosts()
      handleCloseSheet()
      toast({
        title: 'Success',
        description: editingPost ? 'Blog post updated successfully' : 'Blog post created successfully',
      })
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast({
        title: 'Error',
        description: 'Failed to save blog post',
        variant: 'destructive',
      })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      await fetchPosts()
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting blog post:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      })
    }
  }

  function handleEdit(post: BlogPost) {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      category: post.category,
      image: post.image,
      featured: post.featured,
    })
    setIsSheetOpen(true)
  }

  async function handleAIOptimize() {
    if (!formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste or write some content first',
        variant: 'destructive',
      })
      return
    }

    setAiOptimizing(true)
    try {
      const res = await fetch('/api/ai/blog-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: formData.content,
          tone: 'professional',
          length: 'medium',
          optimize: true
        }),
      })

      const data = await res.json()
      if (data.success && data.content) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          excerpt: data.excerpt || prev.excerpt,
          content: data.content,
          category: data.category || prev.category,
        }))
        toast({
          title: 'Success',
          description: 'Content optimized with AI',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to optimize content with AI',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error optimizing with AI:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while optimizing content',
        variant: 'destructive',
      })
    } finally {
      setAiOptimizing(false)
    }
  }

  function handleCloseSheet() {
    setIsSheetOpen(false)
    setEditingPost(null)
    setImageFile(null)
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: '',
      category: '',
      image: '',
      featured: false,
    })
  }

  // Service management functions
  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault()

    const serviceData = {
      id: editingService?.id || Date.now().toString(),
      ...serviceFormData,
    }

    try {
      if (editingService) {
        await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        })
      } else {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        })
      }

      await fetchServices()
      handleCloseServiceSheet()
      toast({
        title: 'Success',
        description: editingService ? 'Service updated successfully' : 'Service created successfully',
      })
    } catch (error) {
      console.error('Error saving service:', error)
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive',
      })
    }
  }

  async function handleServiceDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' })
      await fetchServices()
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting service:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      })
    }
  }

  function handleServiceEdit(service: Service) {
    setEditingService(service)
    setServiceFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features,
      price: service.price || 0,
      isMonthly: (service as any).isMonthly || false,
      status: service.status,
      order: service.order,
    })
    setIsServiceSheetOpen(true)
  }

  function handleCloseServiceSheet() {
    setIsServiceSheetOpen(false)
    setEditingService(null)
    setServiceFormData({
      title: '',
      description: '',
      icon: 'Code',
      features: '',
      price: 0,
      isMonthly: false,
      status: 'active',
      order: 0,
    })
  }

  async function handleSave(section: string, data: any) {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData?.error || `Server error: ${res.status}`)
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      })
      
      await fetchSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Frontend Management</h1>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Frontend Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all frontend sections and content
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Sections</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Blog</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden md:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            <span className="hidden md:inline">Prices</span>
          </TabsTrigger>
          <TabsTrigger value="appointment" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Appointment</span>
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden md:inline">Career</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden md:inline">Training</span>
          </TabsTrigger>
        </TabsList>

        {/* Section Headers Tab */}
        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Headers</CardTitle>
              <CardDescription>
                Manage titles, badges, and descriptions for all homepage sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Services Section */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Services Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="servicesBadge">Badge</Label>
                  <Input
                    id="servicesBadge"
                    value={settings.general.servicesBadge || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, servicesBadge: e.target.value }
                    })}
                    placeholder="Our Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servicesTitle">Title</Label>
                  <Input
                    id="servicesTitle"
                    value={settings.general.servicesTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, servicesTitle: e.target.value }
                    })}
                    placeholder="What We Do Best"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servicesDescription">Description</Label>
                  <Textarea
                    id="servicesDescription"
                    value={settings.general.servicesDescription || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, servicesDescription: e.target.value }
                    })}
                    rows={2}
                    placeholder="Comprehensive digital solutions..."
                  />
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Portfolio Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="portfolioBadge">Badge</Label>
                  <Input
                    id="portfolioBadge"
                    value={settings.general.portfolioBadge || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, portfolioBadge: e.target.value }
                    })}
                    placeholder="Our Portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioTitle">Title</Label>
                  <Input
                    id="portfolioTitle"
                    value={settings.general.portfolioTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, portfolioTitle: e.target.value }
                    })}
                    placeholder="Featured Projects"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioDescription">Description</Label>
                  <Textarea
                    id="portfolioDescription"
                    value={settings.general.portfolioDescription || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, portfolioDescription: e.target.value }
                    })}
                    rows={2}
                    placeholder="Explore our latest work..."
                  />
                </div>
              </div>

              {/* Blog Section */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Blog Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="blogBadge">Badge</Label>
                  <Input
                    id="blogBadge"
                    value={settings.general.blogBadge || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, blogBadge: e.target.value }
                    })}
                    placeholder="Latest from Our Blog"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blogTitle">Title</Label>
                  <Input
                    id="blogTitle"
                    value={settings.general.blogTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, blogTitle: e.target.value }
                    })}
                    placeholder="Insights & Updates"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blogDescription">Description</Label>
                  <Textarea
                    id="blogDescription"
                    value={settings.general.blogDescription || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, blogDescription: e.target.value }
                    })}
                    rows={2}
                    placeholder="Stay updated with the latest trends..."
                  />
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Testimonials Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="testimonialsBadge">Badge</Label>
                  <Input
                    id="testimonialsBadge"
                    value={settings.general.testimonialsBadge || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, testimonialsBadge: e.target.value }
                    })}
                    placeholder="Client Testimonials"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonialsTitle">Title</Label>
                  <Input
                    id="testimonialsTitle"
                    value={settings.general.testimonialsTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, testimonialsTitle: e.target.value }
                    })}
                    placeholder="What Our Clients Say"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonialsDescription">Description</Label>
                  <Textarea
                    id="testimonialsDescription"
                    value={settings.general.testimonialsDescription || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, testimonialsDescription: e.target.value }
                    })}
                    rows={2}
                    placeholder="Real feedback from businesses..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('general', settings.general)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Section Headers'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Tab */}
        <TabsContent value="blog" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
              <p className="text-muted-foreground mt-1">
                Manage your blog posts
              </p>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button onClick={() => setEditingPost(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Post
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <SheetHeader>
                    <SheetTitle>
                      {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
                    </SheetTitle>
                    <SheetDescription>
                      {editingPost ? 'Update blog post information' : 'Add a new blog post'}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="The Future of Web Development"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief summary of post..."
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Technology"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">Blog Image</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file)
                            }}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image')?.click()}
                            disabled={uploadingImage}
                            className="flex-1"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImage ? 'Uploading...' : 'Browse & Upload'}
                          </Button>
                          {formData.image && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setFormData({ ...formData, image: '' })
                                setImageFile(null)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {formData.image && (
                          <div className="relative w-full h-32 border rounded-md overflow-hidden">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {imageFile && (
                          <p className="text-xs text-muted-foreground">
                            Selected: {imageFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="content">Content</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleAIOptimize}
                          disabled={aiOptimizing || !formData.content.trim()}
                          className="h-8 text-xs"
                        >
                          <Sparkles className={`h-4 w-4 mr-1 ${aiOptimizing ? 'animate-spin' : ''}`} />
                          {aiOptimizing ? 'Optimizing...' : 'AI Optimize'}
                        </Button>
                      </div>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Paste your content here and click 'AI Optimize' to enhance it..."
                        required
                        className="min-h-[200px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        💡 Tip: Paste content from anywhere and use AI Optimize to improve it with better structure, SEO, and formatting
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="featured">Featured Post</Label>
                    </div>
                  </div>
                  <SheetFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={handleCloseSheet}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingPost ? 'Update' : 'Create'} Post
                    </Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search and Sort Controls */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by title, category, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-10 pr-8 py-2 rounded-lg border border-input bg-background appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    <option value="date-desc">Date: Newest First</option>
                    <option value="date-asc">Date: Oldest First</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                  </select>
                  <ArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Showing {getSortedPosts().length} of {posts.length} posts
              </p>
            </CardContent>
          </Card>

          {/* Blog Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {getSortedPosts().map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {post.image && post.image !== '/images/blog/placeholder.jpg' ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="space-y-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    {post.featured && (
                      <Badge>Featured</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getSortedPosts().length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No blog posts found matching your search.' : 'No blog posts yet. Create your first post to get started.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Services</h2>
              <p className="text-muted-foreground mt-1">
                Manage promotional service cards displayed on homepage
              </p>
            </div>
            <Sheet open={isServiceSheetOpen} onOpenChange={setIsServiceSheetOpen}>
              <SheetTrigger asChild>
                <Button onClick={() => setEditingService(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
                <form onSubmit={handleServiceSubmit}>
                  <SheetHeader>
                    <SheetTitle>
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </SheetTitle>
                    <SheetDescription>
                      {editingService ? 'Update service information' : 'Add a new service to display on homepage'}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="serviceTitle">Title</Label>
                      <Input
                        id="serviceTitle"
                        value={serviceFormData.title}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                        placeholder="Web Development"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serviceDescription">Description</Label>
                      <Textarea
                        id="serviceDescription"
                        value={serviceFormData.description}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                        placeholder="Custom websites tailored to your needs..."
                        required
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serviceIcon">Icon</Label>
                      <select
                        id="serviceIcon"
                        value={serviceFormData.icon}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="Code">Code (Web Development)</option>
                        <option value="Palette">Palette (UI/UX Design)</option>
                        <option value="ShoppingCart">Shopping Cart (E-commerce)</option>
                        <option value="Smartphone">Smartphone (Mobile Apps)</option>
                        <option value="TrendingUp">Trending Up (Marketing)</option>
                        <option value="Sparkles">Sparkles (Branding)</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="servicePrice">Price (optional)</Label>
                      <div className="space-y-3">
                        <Input
                          id="servicePrice"
                          type="number"
                          step="0.01"
                          value={serviceFormData.price}
                          onChange={(e) => setServiceFormData({ ...serviceFormData, price: parseFloat(e.target.value) || 0 })}
                          placeholder="69"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isMonthly"
                            checked={serviceFormData.isMonthly}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, isMonthly: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                          <Label htmlFor="isMonthly" className="text-sm font-normal cursor-pointer">
                            Monthly price (will display as €XX/month)
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serviceOrder">Display Order</Label>
                      <Input
                        id="serviceOrder"
                        type="number"
                        value={serviceFormData.order}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower numbers appear first
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serviceStatus">Status</Label>
                      <select
                        id="serviceStatus"
                        value={serviceFormData.status}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <SheetFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={handleCloseServiceSheet}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingService ? 'Update' : 'Create'} Service
                    </Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const features = service.features ? JSON.parse(service.features) : []
              return (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                      </div>
                      <Badge variant="outline">Order: {service.order}</Badge>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Icon: <span className="text-muted-foreground">{service.icon}</span></p>
                      {service.price && service.price > 0 && (
                        <p className="text-lg font-bold text-primary">
                          €{service.price}{(service as any).isMonthly ? '/month' : ''}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">Display Order: {service.order}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleServiceEdit(service)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleServiceDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {services.length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No services yet. Create your first service to get started.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
              <CardDescription>
                Manage contact information and form settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactTitle">Contact Title</Label>
                <Input
                  id="contactTitle"
                  value={settings.general.contactTitle || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactTitle: e.target.value }
                  })}
                  placeholder="Let us Build Something Amazing Together"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactDescription">Contact Description</Label>
                <Textarea
                  id="contactDescription"
                  value={settings.general.contactDescription || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactDescription: e.target.value }
                  })}
                  rows={2}
                  placeholder="Ready to transform your digital presence?..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactFormTitle">Form Title</Label>
                  <Input
                    id="contactFormTitle"
                    value={settings.general.contactFormTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactFormTitle: e.target.value }
                    })}
                    placeholder="Send us a message"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactFormDescription">Form Description</Label>
                  <Input
                    id="contactFormDescription"
                    value={settings.general.contactFormDescription || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactFormDescription: e.target.value }
                    })}
                    placeholder="We will get back to you within 24 hours"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.general.contactEmail || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactEmail: e.target.value }
                  })}
                  placeholder="hello@modernagency.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={settings.general.contactPhone || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactPhone: e.target.value }
                  })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Contact Address</Label>
                <Input
                  id="contactAddress"
                  value={settings.general.contactAddress || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactAddress: e.target.value }
                  })}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('general', settings.general)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Contact Section'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prices Tab */}
        <TabsContent value="prices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Plans (Frontend Display)</CardTitle>
              <CardDescription>
                Manage promotional pricing plans shown on homepage. These are for display only, not actual packages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Note:</strong> These are promotional pricing cards for your homepage. For actual purchasable packages, use the Packages section in the sidebar.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Add up to 3 pricing plans</h4>
                <p className="text-sm text-muted-foreground">
                  Simple pricing tiers to display on your homepage (e.g., Basic, Professional, Enterprise)
                </p>
                
                <div className="grid gap-4">
                  {[1, 2, 3].map((planNum) => {
                    const planKey = `pricingPlan${planNum}`
                    const currentPlan = settings.general?.[planKey] || {}
                    
                    return (
                      <div key={planNum} className="p-4 border rounded-lg space-y-4">
                        <h5 className="font-medium">Plan {planNum}</h5>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`plan${planNum}Name`}>Plan Name</Label>
                            <Input
                              id={`plan${planNum}Name`}
                              value={currentPlan.name || ''}
                              onChange={(e) => setSettings({
                                ...settings,
                                general: {
                                  ...settings.general,
                                  [planKey]: { ...currentPlan, name: e.target.value }
                                }
                              })}
                              placeholder="e.g., Basic, Pro, Enterprise"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`plan${planNum}Price`}>Price</Label>
                            <Input
                              id={`plan${planNum}Price`}
                              value={currentPlan.price || ''}
                              onChange={(e) => setSettings({
                                ...settings,
                                general: {
                                  ...settings.general,
                                  [planKey]: { ...currentPlan, price: e.target.value }
                                }
                              })}
                              placeholder="e.g., $29/mo, €499, Free"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`plan${planNum}Description`}>Description</Label>
                          <Textarea
                            id={`plan${planNum}Description`}
                            value={currentPlan.description || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              general: {
                                ...settings.general,
                                [planKey]: { ...currentPlan, description: e.target.value }
                              }
                            })}
                            placeholder="Brief description of this plan"
                            rows={2}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`plan${planNum}Features`}>Features (one per line)</Label>
                          <Textarea
                            id={`plan${planNum}Features`}
                            value={currentPlan.features || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              general: {
                                ...settings.general,
                                [planKey]: { ...currentPlan, features: e.target.value }
                              }
                            })}
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            rows={4}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter each feature on a new line
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`plan${planNum}Featured`}
                            checked={currentPlan.featured || false}
                            onChange={(e) => setSettings({
                              ...settings,
                              general: {
                                ...settings.general,
                                [planKey]: { ...currentPlan, featured: e.target.checked }
                              }
                            })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`plan${planNum}Featured`}>Featured Plan (highlighted)</Label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('general', settings.general)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Pricing Plans'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointment Tab */}
        <TabsContent value="appointment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Page Settings</CardTitle>
              <CardDescription>
                Manage content for the appointment booking page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Hero Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="appointmentTitle">Page Title</Label>
                  <Input
                    id="appointmentTitle"
                    value={settings.general.appointmentTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, appointmentTitle: e.target.value }
                    })}
                    placeholder="Book Your Consultation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentSubtitle">Subtitle</Label>
                  <Textarea
                    id="appointmentSubtitle"
                    value={settings.general.appointmentSubtitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, appointmentSubtitle: e.target.value }
                    })}
                    rows={2}
                    placeholder="Schedule a personalized consultation with our experts..."
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentPhone">Phone Number</Label>
                    <Input
                      id="appointmentPhone"
                      value={settings.general.appointmentPhone || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, appointmentPhone: e.target.value }
                      })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentEmail">Email Address</Label>
                    <Input
                      id="appointmentEmail"
                      type="email"
                      value={settings.general.appointmentEmail || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, appointmentEmail: e.target.value }
                      })}
                      placeholder="appointments@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentOfficeHours">Office Hours</Label>
                  <Input
                    id="appointmentOfficeHours"
                    value={settings.general.appointmentOfficeHours || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, appointmentOfficeHours: e.target.value }
                    })}
                    placeholder="Monday - Friday, 9:00 AM - 6:00 PM"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Note:</strong> Appointment form submissions are automatically sent to the Messages section in the admin panel.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('general', settings.general)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Appointment Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Tab */}
        <TabsContent value="career" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Career Page Settings</CardTitle>
              <CardDescription>
                Manage content for the career/jobs page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Hero Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="careerTitle">Page Title</Label>
                  <Input
                    id="careerTitle"
                    value={settings.general.careerTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, careerTitle: e.target.value }
                    })}
                    placeholder="Join Our Team"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="careerSubtitle">Subtitle</Label>
                  <Textarea
                    id="careerSubtitle"
                    value={settings.general.careerSubtitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, careerSubtitle: e.target.value }
                    })}
                    rows={2}
                    placeholder="Be part of a dynamic team building innovative digital solutions..."
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Open Positions</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add job positions (one per line). Format: Position Title | Type | Location
                </p>
                <div className="space-y-2">
                  <Label htmlFor="careerPositions">Job Positions</Label>
                  <Textarea
                    id="careerPositions"
                    value={settings.general.careerPositions || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, careerPositions: e.target.value }
                    })}
                    rows={6}
                    placeholder="Frontend Developer | Full-time | Remote&#10;Full Stack Developer | Full-time | On-site / Remote&#10;UI/UX Designer | Full-time | Hybrid"
                  />
                  <p className="text-xs text-muted-foreground">
                    Each position on a new line. Use | to separate title, type, and location.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="careerEmail">Careers Email</Label>
                    <Input
                      id="careerEmail"
                      type="email"
                      value={settings.general.careerEmail || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, careerEmail: e.target.value }
                      })}
                      placeholder="careers@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="careerPhone">Careers Phone</Label>
                    <Input
                      id="careerPhone"
                      value={settings.general.careerPhone || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, careerPhone: e.target.value }
                      })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Note:</strong> Career application submissions are automatically sent to the Messages section in the admin panel with detailed candidate information.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('general', settings.general)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Career Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Page Settings</CardTitle>
              <CardDescription>
                Manage content for the professional training programs page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  ⚠️ <strong>Important:</strong> Training sessions require scheduled appointments - walk-ins are not available. This is enforced on the training page.
                </p>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Hero Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="trainingTitle">Page Title</Label>
                  <Input
                    id="trainingTitle"
                    value={settings.general.trainingTitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, trainingTitle: e.target.value }
                    })}
                    placeholder="Professional Training Programs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingSubtitle">Subtitle</Label>
                  <Textarea
                    id="trainingSubtitle"
                    value={settings.general.trainingSubtitle || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, trainingSubtitle: e.target.value }
                    })}
                    rows={2}
                    placeholder="Elevate your team's skills with our expert-led training sessions..."
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Available Training Topics</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage the training topics offered. Add one topic per line with format: Title | Description | Duration | Level
                </p>
                <div className="space-y-2">
                  <Label htmlFor="trainingTopics">Training Topics</Label>
                  <Textarea
                    id="trainingTopics"
                    value={settings.general.trainingTopics || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, trainingTopics: e.target.value }
                    })}
                    rows={8}
                    placeholder="Web Development | HTML, CSS, JavaScript fundamentals | 1-2 weeks | Beginner to Advanced&#10;React & Next.js | Build modern web applications | 1 week | Intermediate&#10;Backend Development | Node.js, APIs, databases | 1-2 weeks | Intermediate"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: Title | Description | Duration | Level (one per line)
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Training Features</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Highlight key benefits of your training programs (one per line)
                </p>
                <div className="space-y-2">
                  <Label htmlFor="trainingFeatures">Key Features</Label>
                  <Textarea
                    id="trainingFeatures"
                    value={settings.general.trainingFeatures || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, trainingFeatures: e.target.value }
                    })}
                    rows={6}
                    placeholder="Expert Instructors | Learn from industry professionals&#10;Customized Content | Tailored to your team's needs&#10;Hands-on Practice | Interactive sessions with real projects&#10;Certification | Receive certificates upon completion"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: Feature Title | Description (one per line, separated by |)
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Appointment Requirements</h4>
                <div className="space-y-2">
                  <Label htmlFor="trainingAppointmentNote">Appointment Notice Text</Label>
                  <Textarea
                    id="trainingAppointmentNote"
                    value={settings.general.trainingAppointmentNote || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, trainingAppointmentNote: e.target.value }
                    })}
                    rows={2}
                    placeholder="Training sessions require scheduled appointments - no walk-ins available"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Note:</strong> Training appointment requests are sent to the Messages section with detailed participant and session information.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('general', settings.general)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Training Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </TabsContent>
      </Tabs>
    </div>
  )
}