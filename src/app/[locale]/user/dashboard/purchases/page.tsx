'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, ExternalLink, Calendar, ShoppingBag, Loader2 } from 'lucide-react'

interface Purchase {
  id: string
  itemName: string
  category: string
  price: string
  purchaseDate: string
  status: 'active' | 'expired'
  downloadLink?: string
}

export default function UserPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  async function fetchPurchases() {
    try {
      const response = await fetch('/api/user/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(data.purchases || [])
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
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

  function handleDownload(link?: string, itemName?: string) {
    if (link) {
      window.location.href = link
    } else {
      alert(`Download link not available for ${itemName}. Please contact support.`)
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
        <p className="text-muted-foreground mt-2">
          All your purchases and digital products
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Purchases</CardTitle>
              <CardDescription>
                {purchases.length} purchase record{purchases.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No purchases yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your purchased templates, licenses, and digital products will appear here
              </p>
              <Button className="mt-6" asChild>
                <a href="/user/dashboard/marketplace">Browse Marketplace</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{purchase.itemName}</div>
                        <div className="text-sm text-muted-foreground">{purchase.category}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{purchase.price}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{purchase.purchaseDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[purchase.status]
                      }`}
                    >
                      {statusLabels[purchase.status]}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(purchase.downloadLink, purchase.itemName)}
                      disabled={purchase.status === 'expired' || !purchase.downloadLink}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {purchase.downloadLink && (
                      <Button variant="ghost" size="icon" title="View Details">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}