'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, ShoppingBag, Euro, Layers, Globe, Gift, FileText, MessageSquare, TrendingUp, Clock } from 'lucide-react'

interface DashboardStats {
  customers: number
  projectRequests: number
  supportPackages: number
  payments: number
  templates: number
  languagePackages: number
  extraLicenses: number
  blogPosts: number
  messages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    projectRequests: 0,
    supportPackages: 0,
    payments: 0,
    templates: 0,
    languagePackages: 0,
    extraLicenses: 0,
    blogPosts: 0,
    messages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default values on error
        setStats({
          customers: 0,
          projectRequests: 0,
          supportPackages: 0,
          payments: 0,
          templates: 0,
          languagePackages: 0,
          extraLicenses: 0,
          blogPosts: 0,
          messages: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const maxValue = Math.max(stats.customers, stats.projectRequests, stats.supportPackages, stats.payments, stats.templates, stats.languagePackages, stats.extraLicenses, stats.blogPosts, stats.messages)

  const statCards = [
    {
      title: 'Customers',
      value: stats.customers,
      icon: Users,
      description: 'Registered customers',
    },
    {
      title: 'Project Requests',
      value: stats.projectRequests,
      icon: Briefcase,
      description: 'Pending requests',
    },
    {
      title: 'Support Packages',
      value: stats.supportPackages,
      icon: ShoppingBag,
      description: 'Active packages',
    },
    {
      title: 'Payments',
      value: stats.payments,
      icon: Euro,
      description: 'This month',
    },
    {
      title: 'Templates',
      value: stats.templates,
      icon: Layers,
      description: 'Ready templates',
    },
    {
      title: 'Language Packages',
      value: stats.languagePackages,
      icon: Globe,
      description: 'Available languages',
    },
    {
      title: 'Extra Licenses',
      value: stats.extraLicenses,
      icon: Gift,
      description: 'Purchased',
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      description: 'Published articles',
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      description: 'Contact form',
    },
  ]

  const barData = [
    { label: 'Customers', value: stats.customers, color: 'bg-blue-500' },
    { label: 'Project Requests', value: stats.projectRequests, color: 'bg-green-500' },
    { label: 'Support Packages', value: stats.supportPackages, color: 'bg-purple-500' },
    { label: 'Payments', value: stats.payments, color: 'bg-orange-500' },
    { label: 'Templates', value: stats.templates, color: 'bg-pink-500' },
    { label: 'Language Packages', value: stats.languagePackages, color: 'bg-cyan-500' },
    { label: 'Extra Licenses', value: stats.extraLicenses, color: 'bg-teal-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
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

          <Card>
            <CardHeader>
              <CardTitle>Content Distribution</CardTitle>
              <CardDescription>
                Website content statistics
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
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used management actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/admin/customers"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Customers</h3>
                  <p className="text-sm text-muted-foreground">
                    Customer management
                  </p>
                </a>
                <a
                  href="/admin/project-requests"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Briefcase className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Project Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Request management
                  </p>
                </a>
                <a
                  href="/admin/support-packages"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <ShoppingBag className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Support Packages</h3>
                  <p className="text-sm text-muted-foreground">
                    Package management
                  </p>
                </a>
                <a
                  href="/admin/payments"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Euro className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Payments & Invoices</h3>
                  <p className="text-sm text-muted-foreground">
                    Finance management
                  </p>
                </a>
                <a
                  href="/admin/templates"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Layers className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Template Marketplace</h3>
                  <p className="text-sm text-muted-foreground">
                    Template management
                  </p>
                </a>
                <a
                  href="/admin/language-packages"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Globe className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Language Packages</h3>
                  <p className="text-sm text-muted-foreground">
                    Language packages
                  </p>
                </a>
                <a
                  href="/admin/licenses"
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Gift className="h-5 w-5 mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Extra Licenses</h3>
                  <p className="text-sm text-muted-foreground">
                    License management
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dashboard loaded</p>
                    <p className="text-xs text-muted-foreground">
                      Just now
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
