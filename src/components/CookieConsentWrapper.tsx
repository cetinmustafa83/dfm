'use client'

import { useEffect, useState } from 'react'
import GDPRCookieConsent from './GDPRCookieConsent'

export default function CookieConsentWrapper() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data.settings)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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