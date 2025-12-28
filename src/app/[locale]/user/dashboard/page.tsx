'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ShoppingBag, Euro, Briefcase, Clock, TrendingUp } from 'lucide-react'

interface DashboardStats {
  projectRequests: number
  supportPackages: number
  payments: number
  purchases: number
}

export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projectRequests: 0,
    supportPackages: 0,
    payments: 0,
    purchases: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      setLoading(true)
      const userId = localStorage.getItem('user_id') || 'demo_user'
      const response = await fetch(`/api/user/stats?userId=${userId}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxValue = Math.max(stats.projectRequests, stats.supportPackages, stats.payments, stats.purchases)

  const statCards = [
    {
      title: 'Project Requests',
      value: stats.projectRequests,
      icon: Briefcase,
      description: 'Total requests',
      href: '/user/dashboard/projects',
    },
    {
      title: 'Support Packages',
      value: stats.supportPackages,
      icon: ShoppingBag,
      description: 'Active packages',
      href: '/user/dashboard/packages',
    },
    {
      title: 'Payments',
      value: stats.payments,
      icon: Euro,
      description: 'This month',
      href: '/user/dashboard/payments',
    },
    {
      title: 'My Purchases',
      value: stats.purchases,
      icon: FileText,
      description: 'Total purchases',
      href: '/user/dashboard/purchases',
    },
  ]

  const barData = [
    { label: 'Project Requests', value: stats.projectRequests, color: 'bg-blue-500' },
    { label: 'Support Packages', value: stats.supportPackages, color: 'bg-green-500' },
    { label: 'Payments', value: stats.payments, color: 'bg-purple-500' },
    { label: 'My Purchases', value: stats.purchases, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your account activity
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = stat.href}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {maxValue > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>
                  Visual summary of your account statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {barData.map((item) => {
                    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{item.value}</span>
                        </div>
                        <div className="h-8 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access your most used features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href="/user/dashboard/projects"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Briefcase className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Project Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit and manage project requests
                  </p>
                </a>
                <a
                  href="/user/dashboard/packages"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <ShoppingBag className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Support Packages</h3>
                  <p className="text-sm text-muted-foreground">
                    View and purchase support packages
                  </p>
                </a>
                <a
                  href="/user/dashboard/tickets"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <FileText className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Support Tickets</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help from our support team
                  </p>
                </a>
                <a
                  href="/user/dashboard/payments"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Euro className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    View payment history and invoices
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>

          {stats.projectRequests === 0 && stats.supportPackages === 0 && stats.payments === 0 && stats.purchases === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-6 pb-6 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Welcome to Your Dashboard!</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by exploring our services or submitting a project request.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.href = '/user/dashboard/projects'}>
                    New Project Request
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/user/dashboard/packages'}>
                    View Support Packages
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}