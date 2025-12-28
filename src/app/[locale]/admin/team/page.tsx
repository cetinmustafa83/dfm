'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  bio: string
  avatar: string
}

export default function AdminTeam() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
  })

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn !== 'true') {
      router.push('/admin/login')
      return
    }

    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      const res = await fetch('/api/team')
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const memberData = {
      id: editingMember?.id || Date.now().toString(),
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      avatar: formData.avatar || '',
    }

    try {
      if (editingMember) {
        await fetch(`/api/team/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        })
      } else {
        await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        })
      }

      await fetchMembers()
      handleCloseSheet()
    } catch (error) {
      console.error('Error saving team member:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' })
      await fetchMembers()
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  function handleEdit(member: TeamMember) {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      bio: member.bio,
      avatar: member.avatar,
    })
    setIsSheetOpen(true)
  }

  function handleCloseSheet() {
    setIsSheetOpen(false)
    setEditingMember(null)
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      bio: '',
      avatar: '',
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Team</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setEditingMember(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <SheetHeader>
                <SheetTitle>
                  {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                </SheetTitle>
                <SheetDescription>
                  {editingMember ? 'Update team member information' : 'Add a new team member'}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior Developer"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Team member bio..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="/images/team/avatar.jpg"
                  />
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleCloseSheet}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMember ? 'Update' : 'Add'} Member
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-base">
                    {member.role}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  <span className="text-sm text-muted-foreground">{member.email || 'No email'}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  <span className="text-sm text-muted-foreground">{member.phone || 'No phone'}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.bio}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(member)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No team members yet. Add your first team member to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
