'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Plus, Clock, CheckCircle, XCircle, FileText, PlusCircle, Briefcase } from 'lucide-react'

interface ProjectRequest {
  id: string
  userId: string
  type: string
  description: string
  budget: string
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'in_progress'
  submittedDate: string
}

export default function ProjectRequests() {
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [newRequest, setNewRequest] = useState({
    type: '',
    description: '',
    budget: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      setLoading(true)
      const userId = localStorage.getItem('user_id') || 'demo_user'
      const response = await fetch(`/api/user/projects?userId=${userId}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setRequests(result.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      const userId = localStorage.getItem('user_id') || 'demo_user'
      const response = await fetch('/api/user/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: newRequest.type,
          description: newRequest.description,
          budget: newRequest.budget,
          status: 'draft',
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchProjects()
        setShowAddSheet(false)
        setNewRequest({ type: '', description: '', budget: '' })
        alert('Project request created successfully!')
      } else {
        alert('Failed to create project request: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project request')
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const userId = localStorage.getItem('user_id') || 'demo_user'
      const response = await fetch('/api/user/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          userId,
          status: newStatus,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchProjects()
      } else {
        alert('Failed to update project: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
    }
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    in_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    in_progress: 'bg-purple-100 text-purple-800',
  }

  const statusLabels = {
    draft: 'Draft',
    submitted: 'Submitted',
    in_review: 'In Review',
    approved: 'Approved',
    rejected: 'Rejected',
    in_progress: 'In Progress',
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Requests</h1>
          <p className="text-muted-foreground mt-2">
            Create and track new project requests
          </p>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Requests</h1>
        <p className="text-muted-foreground mt-2">
          Create and track new project requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Requests</CardTitle>
            <Button onClick={() => setShowAddSheet(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.budget}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[request.status]
                          }`}
                        >
                          {statusLabels[request.status]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{request.submittedDate}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Details">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {request.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Submit"
                              onClick={() => handleStatusChange(request.id, 'submitted')}
                            >
                              <PlusCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Project Requests</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any project requests yet. Click the button above to get started.
              </p>
              <Button onClick={() => setShowAddSheet(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="right" className="sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>New Project Request</SheetTitle>
            <SheetDescription>
              Describe your project needs in detail
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Input
                id="type"
                value={newRequest.type}
                onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                placeholder="e.g., E-commerce Website, Mobile App, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                placeholder="Provide detailed information about your project requirements..."
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={newRequest.budget}
                onChange={(e) => setNewRequest({ ...newRequest, budget: e.target.value })}
                placeholder="e.g., 50,000 - 75,000 €"
                required
              />
            </div>

            <SheetFooter className="gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1"
              >
                Save as Draft
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setShowAddSheet(false)
                  setNewRequest({ type: '', description: '', budget: '' })
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