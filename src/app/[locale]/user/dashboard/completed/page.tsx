'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Download, CreditCard, Briefcase, Copy, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

interface CompletedProject {
  id: string
  title: string
  category: string
  description: string
  price: number
  licenseKey: string
  licenseType: string
  licenseStatus: string
  expiryDate: string
  lastUsed: string
  downloadUrl: string
  completedAt: string
}

export default function UserCompletedProjects() {
  const [projects, setProjects] = useState<CompletedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const response = await fetch('/api/user/completed')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.completedProjects || [])
      }
    } catch (error) {
      console.error('Error fetching completed projects:', error)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    alert('License key copied to clipboard!')
  }

  function getStatusBadge(status: string) {
    if (status === 'active') {
      return <Badge className="bg-green-500 text-white">Active</Badge>
    } else if (status === 'expired') {
      return <Badge variant="destructive">Expired</Badge>
    } else if (status === 'trial') {
      return <Badge variant="outline">Trial</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  function getTypeBadge(type: string) {
    if (type === 'single') {
      return <Badge variant="outline">Single Site</Badge>
    } else if (type === 'multi-site') {
      return <Badge className="bg-blue-500 text-white">Multi-Site</Badge>
    } else if (type === 'commercial') {
      return <Badge className="bg-purple-500 text-white">Commercial</Badge>
    }
    return <Badge variant="outline">{type}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Completed Projects</h1>
          <p className="text-muted-foreground mt-2">
            View and download your completed projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm text-muted-foreground">{projects.length} Project{projects.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No completed projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Once your projects are completed, they will appear here with download links
            </p>
            <Button asChild>
              <a href="/user/dashboard/projects">View Active Projects</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-100/50 to-purple-100/50 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{project.category}</Badge>
                      {getStatusBadge(project.licenseStatus)}
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </div>
                  {getTypeBadge(project.licenseType)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{project.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{project.price.toLocaleString()} €</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-primary" />
                    <span className="font-medium text-xs">License: {project.licenseKey.slice(0, 12)}...</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    onClick={() => {
                      if (project.downloadUrl) {
                        window.location.href = project.downloadUrl
                      } else {
                        alert('Download link not available. Please contact support.')
                      }
                    }}
                    disabled={!project.downloadUrl || project.licenseStatus === 'expired'}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setSelectedProject(project)}>
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>License Information</SheetTitle>
            <SheetDescription>
              Detailed license information for your project
            </SheetDescription>
          </SheetHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Project</p>
                  <p className="font-semibold">{selectedProject.title}</p>
                  <p className="text-xs text-muted-foreground mt-2">License Key</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm flex-1 bg-background px-2 py-1 rounded">{selectedProject.licenseKey}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(selectedProject.licenseKey)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="p-2 border rounded bg-background">{getTypeBadge(selectedProject.licenseType)}</div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="p-2 border rounded bg-background">{getStatusBadge(selectedProject.licenseStatus)}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expiry:</span>
                  <span className="font-medium">{selectedProject.expiryDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium">{selectedProject.completedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Used:</span>
                  <span className="font-medium">{selectedProject.lastUsed}</span>
                </div>
              </div>

              {selectedProject.licenseStatus === 'expired' && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-destructive">License Expired</p>
                    <p className="text-muted-foreground">
                      This license expired on {selectedProject.expiryDate}. Contact support to renew.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}