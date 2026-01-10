'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, FileText, Search, ArrowDown, Upload, X, Sparkles } from 'lucide-react'

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

export default function AdminBlog() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn !== 'true') {
      router.push('/admin/login')
      return
    }

    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
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
    return sorted
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
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      await fetchPosts()
    } catch (error) {
      console.error('Error deleting blog post:', error)
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
      alert('Please paste or write some content first')
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
      } else {
        alert('Failed to optimize content with AI')
      }
    } catch (error) {
      console.error('Error optimizing with AI:', error)
      alert('An error occurred while optimizing content')
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

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const sortedPosts = getSortedPosts()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground mt-2">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
                {sortBy === 'date-desc' && 'Date: Newest First'}
                {sortBy === 'date-asc' && 'Date: Oldest First'}
                {sortBy === 'name-asc' && 'Name: A-Z'}
                {sortBy === 'name-desc' && 'Name: Z-A'}
              </select>
              <ArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {sortedPosts.length} of {posts.length} posts
          </p>
        </CardContent>
      </Card>

      {/* Blog Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {sortedPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {post.title.charAt(0)}
                </span>
              </div>
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

      {sortedPosts.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No blog posts found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {posts.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No blog posts yet. Create your first post to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
