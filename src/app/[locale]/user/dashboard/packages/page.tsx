'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, CheckCircle, Clock, Tag, AlertCircle } from 'lucide-react'

interface UserSupportPackage {
  id: string
  name: string
  price: string
  features: string[]
  status: 'active' | 'expired'
  renewalDate: string
}

export default function UserSupportPackages() {
  const [packages, setPackages] = useState<UserSupportPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [])

  async function fetchPackages() {
    try {
      setLoading(true)
      const response = await fetch('/api/packages?activeOnly=true')
      const result = await response.json()
      
      if (result.success && result.data) {
        // Transform API data to component format
        const transformedPackages = result.data.map((pkg: any) => ({
          id: pkg.id,
          name: pkg.name,
          price: `${pkg.price} €/${pkg.billingCycle}`,
          features: pkg.featuresList || [],
          status: 'active' as const,
          renewalDate: '2025-06-15', // In production, get from user's purchase data
        }))
        setPackages(transformedPackages)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
  }

  const statusLabels = {
    active: 'Active',
    expired: 'Expired',
  }

  function handleRenew(pkgId: string) {
    alert(`Package renewal initiated: ${pkgId}`)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Packages</h1>
          <p className="text-muted-foreground mt-2">
            Available support packages
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Packages</h1>
        <p className="text-muted-foreground mt-2">
          Choose a support package that fits your needs
        </p>
      </div>

      {/* Free Tier Notice */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">You're currently on the Free Plan</h4>
              <p className="text-sm text-blue-700 mb-3">
                Upgrade to a paid support package to get faster response times, more support channels, and priority assistance.
              </p>
              <div className="text-sm text-blue-700">
                <strong>Free Plan includes:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>2 support tickets per month</li>
                  <li>Email support only</li>
                  <li>72-hour response time</li>
                  <li>Basic community support</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Packages */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="relative hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription className="mt-1">{pkg.price}</CardDescription>
                </div>
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => alert(`Redirecting to checkout for ${pkg.name}`)}
                >
                  Purchase Package
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No packages available</p>
            <p className="text-muted-foreground">
              Please check back later for available support packages
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}