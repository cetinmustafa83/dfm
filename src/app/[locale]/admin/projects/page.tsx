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
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react'

interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  clientUrl: string
  tags: string[]
  featured: boolean
}

export default function AdminProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    clientUrl: '',
    tags: '',
    featured: false,
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn !== 'true') {
      router.push('/admin/login')
      return
    }

    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
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

    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t)
    const projectData = {
      id: editingProject?.id || Date.now().toString(),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      image: formData.image || '/images/placeholder.jpg',
      clientUrl: formData.clientUrl,
      tags,
      featured: formData.featured,
    }

    try {
      if (editingProject) {
        await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        })
      } else {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        })
      }

      await fetchProjects()
      handleCloseSheet()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      await fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project)
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image,
      clientUrl: project.clientUrl,
      tags: project.tags.join(', '),
      featured: project.featured,
    })
    setIsSheetOpen(true)
  }

  function handleCloseSheet() {
    setIsSheetOpen(false)
    setEditingProject(null)
    setImageFile(null)
    setFormData({
      title: '',
      category: '',
      description: '',
      image: '',
      clientUrl: '',
      tags: '',
      featured: false,
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Projects</h1>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio projects
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setEditingProject(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <SheetHeader>
                <SheetTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </SheetTitle>
                <SheetDescription>
                  {editingProject ? 'Update project information' : 'Add a new project to your portfolio'}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="EcoTech Solutions"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="E-commerce"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Project Image</Label>
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
                  <Label htmlFor="clientUrl">Client URL</Label>
                  <Input
                    id="clientUrl"
                    value={formData.clientUrl}
                    onChange={(e) => setFormData({ ...formData, clientUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Next.js, TypeScript, Stripe"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleCloseSheet}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? 'Update' : 'Create'} Project
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {project.title.charAt(0)}
                </span>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="outline">{project.category}</Badge>
                  <CardTitle className="text-xl line-clamp-2">{project.title}</CardTitle>
                </div>
                {project.featured && (
                  <Badge className="animate-pulse">Featured</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(project)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No projects yet. Add your first project to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
