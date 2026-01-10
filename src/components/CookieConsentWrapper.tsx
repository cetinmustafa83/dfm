'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import GDPRCookieConsent from './GDPRCookieConsent'

export default function CookieConsentWrapper() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't show cookie consent on admin and user dashboards
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/user/dashboard')) {
      setLoading(false)
      return
    }

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data.settings)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [pathname])

  // Don't show on admin and user dashboards
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/user/dashboard')) {
    return null
  }

  if (loading || !settings?.legal?.cookieConsent?.enabled) {
    return null
  }

  return (
    <GDPRCookieConsent
      position={settings.legal.cookieConsent.position || 'bottom'}
      theme={settings.legal.cookieConsent.theme || 'light'}
    />
  )
}