'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, Copy, AlertTriangle, RefreshCw, Search, Download, Loader2, ShieldCheck } from 'lucide-react'

interface License {
  id: string
  projectId: string
  projectName: string
  licenseKey: string
  licenseType: 'single' | 'multi-site' | 'commercial'
  status: 'active' | 'expired' | 'suspended'
  issuedDate: string
  expiryDate: string
  lastUsed: string
  maxSites: number
  currentSites: number
  downloadUrl: string
}

export default function UserLicenses() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchLicenses()
  }, [])

  async function fetchLicenses() {
    try {
      const response = await fetch('/api/user/licenses')
      if (response.ok) {
        const data = await response.json()
        setLicenses(data.licenses || [])
      }
    } catch (error) {
      console.error('Error fetching licenses:', error)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    alert('License key copied to clipboard!')
  }

  const filteredLicenses = licenses.filter(license =>
    license.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    license.licenseKey.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
      case 'suspended':
        return <Badge className="bg-yellow-500 text-white">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'single':
        return <Badge variant="outline">Single Site</Badge>
      case 'multi-site':
        return <Badge className="bg-blue-500 text-white">Multi-Site</Badge>
      case 'commercial':
        return <Badge className="bg-purple-500 text-white">Commercial</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Licenses</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your project licenses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{licenses.length} License{licenses.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search licenses by project name or license key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLicenses.length} of {licenses.length} licenses
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {licenses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShieldCheck className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No licenses yet</h3>
            <p className="text-muted-foreground mb-6">
              Your project licenses will appear here after purchase
            </p>
            <Button asChild>
              <a href="/user/dashboard/marketplace">Browse Marketplace</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Licenses Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredLicenses.map((license) => (
              <Card key={license.id} className={`${license.status === 'expired' ? 'border-destructive/50' : ''} hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(license.status)}
                        {getTypeBadge(license.licenseType)}
                      </div>
                      <CardTitle className="text-xl">{license.projectName}</CardTitle>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {license.issuedDate}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* License Key */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">License Key</p>
                        <code className="text-sm font-mono">{license.licenseKey}</code>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(license.licenseKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* License Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{license.status.charAt(0).toUpperCase() + license.status.slice(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{license.licenseType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expiry:</span>
                      <span className="font-medium">{license.expiryDate}</span>
                    </div>
                    {license.status === 'active' && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Used:</span>
                        <span className="font-medium">{license.lastUsed}</span>
                      </div>
                    )}
                  </div>

                  {/* Multi-site Info */}
                  {license.licenseType === 'multi-site' && license.status === 'active' && (
                    <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
                      <span className="text-muted-foreground">Sites Used:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{license.currentSites}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{license.maxSites}</span>
                      </div>
                    </div>
                  )}

                  {/* Status Messages */}
                  {license.status === 'expired' && (
                    <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-destructive">License Expired</p>
                        <p className="text-muted-foreground">
                          This license expired on {license.expiryDate}. Please contact support to renew your license.
                        </p>
                      </div>
                    </div>
                  )}

                  {license.status === 'suspended' && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-yellow-900">License Suspended</p>
                        <p className="text-muted-foreground">
                          This license has been suspended. Please contact support for more information.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  {license.status === 'active' && license.downloadUrl && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        window.location.href = license.downloadUrl
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredLicenses.length === 0 && licenses.length > 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No licenses found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold mb-4">License Information</h3>
            <div className="space-y-3 text-sm text-blue-900">
              <p>
                <strong>Single Site:</strong> Use on one website domain. Perfect for small projects.
              </p>
              <p>
                <strong>Multi-Site:</strong> Use on multiple websites. Great for agencies managing multiple client projects.
              </p>
              <p>
                <strong>Commercial:</strong> Unlimited sites with full commercial usage rights. Best for large enterprises.
              </p>
            </div>
            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                Need help with your licenses? Contact our support team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}