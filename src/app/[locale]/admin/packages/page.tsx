'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Search, Plus, Edit, Trash2, Tag, CheckCircle, Globe, Gift, Calendar, Clock, Loader2 } from 'lucide-react'

interface SupportPackage {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  features: string[]
  status: 'active' | 'inactive'
  createdAt: string
}

interface LanguagePackage {
  id: string
  name: string
  code: string
  flag?: string
  status: 'active' | 'inactive'
  completeness: number
  createdAt: string
}

interface ExtraLicense {
  id: string
  customerId: string
  customer: {
    name: string
    email: string
  }
  type: string
  product: string
  key: string
  status: 'active' | 'expired' | 'revoked'
  expiresAt?: string
  createdAt: string
}

type TabType = 'support' | 'language' | 'licenses'

export default function Packages() {
  const [activeTab, setActiveTab] = useState<TabType>('support')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [loading, setLoading] = useState(true)

  // Support Packages
  const [supportPackages, setSupportPackages] = useState<SupportPackage[]>([])
  
  // Language Packages
  const [languagePackages, setLanguagePackages] = useState<LanguagePackage[]>([])
  
  // Extra Licenses
  const [extraLicenses, setExtraLicenses] = useState<ExtraLicense[]>([])

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired' | 'revoked'>('all')

  // Form state
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: '',
    description: '',
    duration: '1',
    features: [''],
    code: '',
    flag: '',
    completeness: '100',
  })

  // Fetch data on mount and tab change
  useEffect(() => {
    fetchData()
  }, [activeTab])

  async function fetchData() {
    setLoading(true)
    try {
      let endpoint = ''
      if (activeTab === 'support') {
        endpoint = '/api/packages?type=support'
      } else if (activeTab === 'language') {
        endpoint = '/api/packages?type=language'
      } else if (activeTab === 'licenses') {
        endpoint = '/api/packages?type=license'
      }

      const res = await fetch(endpoint)
      const data = await res.json()

      if (data.success) {
        if (activeTab === 'support') {
          setSupportPackages(data.data || [])
        } else if (activeTab === 'language') {
          setLanguagePackages(data.data || [])
        } else if (activeTab === 'licenses') {
          setExtraLicenses(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'support' as TabType, label: 'Support Packages', icon: Tag },
    { id: 'language' as TabType, label: 'Language Packs', icon: Globe },
    { id: 'licenses' as TabType, label: 'Extra Licenses', icon: Gift },
  ]

  // Filter functions
  const filteredSupportPackages = supportPackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredLanguagePackages = languagePackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLicenses = extraLicenses.filter((license) => {
    const matchesSearch =
      license.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.key.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || license.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    revoked: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }

  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired',
    revoked: 'Revoked',
  }

  async function handleAddSupportPackage(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'support',
          name: newPackage.name,
          price: newPackage.price,
          description: newPackage.description,
          duration: parseInt(newPackage.duration),
          features: newPackage.features.filter((f) => f !== ''),
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        await fetchData()
        setShowAddSheet(false)
        setNewPackage({ name: '', price: '', description: '', duration: '1', features: [''], code: '', flag: '', completeness: '100' })
      }
    } catch (error) {
      console.error('Error adding package:', error)
    }
  }

  async function handleAddLanguagePackage(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'language',
          name: newPackage.name,
          code: newPackage.code,
          flag: newPackage.flag,
          completeness: parseFloat(newPackage.completeness),
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        await fetchData()
        setShowAddSheet(false)
        setNewPackage({ name: '', price: '', description: '', duration: '1', features: [''], code: '', flag: '', completeness: '100' })
      }
    } catch (error) {
      console.error('Error adding language package:', error)
    }
  }

  async function handleToggleSupportStatus(id: string) {
    const pkg = supportPackages.find(p => p.id === id)
    if (!pkg) return

    try {
      const res = await fetch('/api/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          type: 'support',
          status: pkg.status === 'active' ? 'inactive' : 'active',
        }),
      })
      
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  async function handleToggleLanguageStatus(id: string) {
    const pkg = languagePackages.find(p => p.id === id)
    if (!pkg) return

    try {
      const res = await fetch('/api/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          type: 'language',
          status: pkg.status === 'active' ? 'inactive' : 'active',
        }),
      })
      
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  async function handleDeleteSupportPackage(id: string) {
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      const res = await fetch(`/api/packages?id=${id}&type=support`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  async function handleDeleteLanguagePackage(id: string) {
    if (!confirm('Are you sure you want to delete this language package?')) return

    try {
      const res = await fetch(`/api/packages?id=${id}&type=language`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  async function handleDeleteLicense(id: string) {
    if (!confirm('Are you sure you want to delete this license?')) return

    try {
      const res = await fetch(`/api/packages?id=${id}&type=license`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error deleting license:', error)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
        <p className="text-muted-foreground mt-2">
          Manage support packages, language packs, and extra licenses
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Support Packages Tab */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Support Packages</h2>
            <Button onClick={() => setShowAddSheet(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Package
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredSupportPackages.map((pkg) => (
              <Card key={pkg.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{pkg.name}</CardTitle>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[pkg.status]
                      }`}
                    >
                      {statusLabels[pkg.status]}
                    </div>
                  </div>
                  <CardDescription>€{pkg.price} / {pkg.duration} month(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1 inline" />
                      {formatDate(pkg.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleToggleSupportStatus(pkg.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSupportPackage(pkg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Language Packages Tab */}
      {activeTab === 'language' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Language Packs</h2>
            <Button onClick={() => setShowAddSheet(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Package
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredLanguagePackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription>{pkg.code}</CardDescription>
                    </div>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[pkg.status]
                      }`}
                    >
                      {statusLabels[pkg.status]}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="font-medium">Completeness: {pkg.completeness}%</span>
                    </div>
                    {pkg.flag && (
                      <div className="text-2xl">{pkg.flag}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1 inline" />
                      {formatDate(pkg.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleToggleLanguageStatus(pkg.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLanguagePackage(pkg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Extra Licenses Tab */}
      {activeTab === 'licenses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Extra Licenses</h2>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status Filter</Label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>License Key</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLicenses.map((license) => (
                        <TableRow key={license.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{license.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{license.customer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{license.product}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-mono">{license.key}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm capitalize">{license.type}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {license.expiresAt ? formatDate(license.expiresAt) : 'Never'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusColors[license.status]
                              }`}
                            >
                              {statusLabels[license.status]}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {license.status === 'active' && (
                                <Button variant="ghost" size="icon" title="Extend">
                                  <Clock className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteLicense(license.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="right" className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {activeTab === 'support' ? 'New Support Package' : activeTab === 'language' ? 'New Language Pack' : 'Not Available'}
            </SheetTitle>
            <SheetDescription>
              {activeTab === 'support' ? 'Create a new support package for customers' : 'Create a new language pack'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={activeTab === 'support' ? handleAddSupportPackage : handleAddLanguagePackage} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    placeholder="Enter package name..."
                    required
                  />
                </div>

                {activeTab === 'support' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                        placeholder="299"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (months)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newPackage.duration}
                        onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                        placeholder="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newPackage.description}
                        onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                        placeholder="Package description..."
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Features</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewPackage({ ...newPackage, features: [...newPackage.features, ''] })
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Feature
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {newPackage.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...newPackage.features]
                                newFeatures[index] = e.target.value
                                setNewPackage({ ...newPackage, features: newFeatures })
                              }}
                              placeholder={`Feature ${index + 1}...`}
                              className="flex-1"
                            />
                            {newPackage.features.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newFeatures = newPackage.features.filter((_, i) => i !== index)
                                  setNewPackage({ ...newPackage, features: newFeatures })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'language' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="code">Language Code</Label>
                      <Input
                        id="code"
                        value={newPackage.code}
                        onChange={(e) => setNewPackage({ ...newPackage, code: e.target.value })}
                        placeholder="en, de, fr..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="flag">Flag Emoji</Label>
                      <Input
                        id="flag"
                        value={newPackage.flag}
                        onChange={(e) => setNewPackage({ ...newPackage, flag: e.target.value })}
                        placeholder="🇺🇸"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completeness">Completeness (%)</Label>
                      <Input
                        id="completeness"
                        type="number"
                        value={newPackage.completeness}
                        onChange={(e) => setNewPackage({ ...newPackage, completeness: e.target.value })}
                        placeholder="100"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </>
                )}

                <SheetFooter className="gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Package
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddSheet(false)
                      setNewPackage({ name: '', price: '', description: '', duration: '1', features: [''], code: '', flag: '', completeness: '100' })
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