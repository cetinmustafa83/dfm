'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { LayoutDashboard, Briefcase, Users, FileText, MessageSquare, Settings, Home, Menu, X, LogOut, Euro, ShoppingBag, Layers, Monitor } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('admin')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  const navItems = [
    { name: t('navigation.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('navigation.frontend'), href: '/admin/frontend', icon: Monitor },
    { name: t('navigation.customers'), href: '/admin/customers', icon: Users },
    { name: t('navigation.projectRequests'), href: '/admin/project-requests', icon: Briefcase },
    { name: t('navigation.packages'), href: '/admin/packages', icon: ShoppingBag },
    { name: t('navigation.payments'), href: '/admin/payments', icon: Euro },
    { name: t('navigation.marketplace'), href: '/admin/marketplace', icon: Layers },
    { name: t('navigation.messages'), href: '/admin/messages', icon: MessageSquare },
    { name: t('navigation.settings'), href: '/admin/settings', icon: Settings },
  ]

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in')
    const adminUsername = localStorage.getItem('admin_username')
    setIsLoggedIn(loggedIn === 'true')
    setUsername(adminUsername || '')

    if (loggedIn !== 'true') {
      router.push('/')
    }
  }, [router])

  function handleLogout() {
    localStorage.removeItem('admin_logged_in')
    localStorage.removeItem('admin_username')
    setIsLoggedIn(false)
    router.push('/')
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">{t('adminPanel')}</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm text-muted-foreground">
                {t('welcome')}, <span className="font-medium text-foreground">{username}</span>
              </span>
              <LanguageSwitcher />
              <Button variant="outline" asChild>
                <Link href="/">{t('website')}</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r border-border pt-16 lg:pt-0 transform transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 w-full lg:ml-0">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
